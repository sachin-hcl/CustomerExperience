jQuery.sap.require("sap.ui.thirdparty.d3");
sap.ui.define(
	["sap/ui/core/Control",
		"sap/base/Log"],
	function (Control, Log) {

		var BubbleStar = Control.extend("dev.sachin.BubbleStar", {
			metadata: {
				properties: {
					height: {
						type: "sap.ui.core.CSSSize", //this is optional, but it helps prevent errors in your code by enforcing a type
						defaultValue: "320px" //this is also optional, but recommended, as it prevents your properties being null
					},
					width: {
						type: "sap.ui.core.CSSSize", //this is optional, but it helps prevent errors in your code by enforcing a type
						defaultValue: "360px" //this is also optional, but recommended, as it prevents your properties being null
					}
				},
				"aggregations": {
					"data": {
						type: "object",
						"multiple": false
					}
				}
			},
			renderer: function (oRm, oControl) {
				oRm.write("<div style='position:relative;width:" + oControl.getWidth() + ";height:" + oControl.getHeight() + ";'");
				oRm.writeControlData(oControl); //ui5 trackings data, outputs sId, absolutely mandatory
				oRm.writeClasses(oControl); //allows the class="" attribute to work correctly
				oRm.write(">");
				oRm.write("<svg style=\"width:" + oControl.getWidth() + ";height:" + oControl.getHeight() + ";\"></svg>");
				oRm.write("</div>");
			},
			onAfterRendering: function () {

				var padding = 20;
				var data = [];
				for(var i =0; i<5; i++){
					data.push(parseInt(Math.random()*100));
				}
				var domWidth = $(this.getDomRef()).width();
				var chartHeight = $(this.getDomRef()).height();
				
				var chartWidth = domWidth - padding * 2;

				var segmentWidth = parseInt(chartWidth / (data.length + 1));
				
				var g = d3
					.select("#" + this.getId() + ">svg")
					.append("g")
					.attr("transform", "translate("+(segmentWidth + padding)+",0)");
					//.attr("transform", "translate(" + ( (domWidth - chartWidth) / 2 ) + ",0)");


				var x = d3.scale.linear().domain([d3.min(data),d3.max(data)]).range([segmentWidth / 4,segmentWidth ]);
				
				var colors = ["#7f7dfa", "#71f0b7", "#ff8fdf", "#dbb13d", "#f7866f", "#4b3eb8"]

				var points = data.map(function(){
					return ( chartHeight - (2*segmentWidth) ) * Math.random() + segmentWidth;
				});


				
					


				g.selectAll("circle")
					.data(data)
					.enter().append("circle")
					.style("fill", function(d,i){
						return colors[i];
					})
					.style("fill-opacity","0.85")
					.attr("r", (d,i)=>{
						return x(d);
					})
					.attr("cx", (d,i)=>segmentWidth * i)
					.attr("cy", function(d,i){
						return points[i];
					})
				
				g.selectAll("text")
					.data(data)
					.enter()
					.append("text")
					.attr("x", (d,i)=>segmentWidth * i)
					.attr("y", function(d,i){
						return points[i];
					})
					.attr("text-anchor","middle")
					.attr("dy", ".35em")
					.text(function(d,i){return i+1});

			}
		});
		BubbleStar.prototype.mapRendered = function () {
			var that = this;
			this.__gmap.addListener("center_changed", function (e) {
				var mapPoint = that.getCenter();

				mapPoint.setPoint(this.getCenter());
			});
		};
		BubbleStar.prototype.setZoom = function (zoom) {
			this.setProperty("zoom", zoom, true);
			if (this.__gmap) {
				this.__gmap.setZoom(zoom);
			}
		};
		BubbleStar.prototype.setCenter = function (center) {
			this.setAggregation("center", center, true);
			if (this.__gmap) {
				this.__gmap.panTo(center.getLatLng());
			}
		};
		BubbleStar.prototype.setVisualStyle = function (json) {
			if (this.__gmap) {
				Log.warning("Map already rendered, Style cannot be applied now");
			} else {
				this.setProperty("visualStyle", json.styles, true);
			}
			return this;
		};
		return BubbleStar;
	}
);