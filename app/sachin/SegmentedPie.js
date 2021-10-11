jQuery.sap.require("sap.ui.thirdparty.d3");

sap.ui.define(
	["sap/ui/core/Control",
		"sap/base/Log"],
	function (Control, Log) {

		var SegmentedPie = Control.extend("dev.sachin.SegmentedPie", {
			metadata: {
				properties: {
					height: {
						type: "sap.ui.core.CSSSize", //this is optional, but it helps prevent errors in your code by enforcing a type
						defaultValue: "320px" //this is also optional, but recommended, as it prevents your properties being null
					},
					width: {
						type: "sap.ui.core.CSSSize", //this is optional, but it helps prevent errors in your code by enforcing a type
						defaultValue: "320px" //this is also optional, but recommended, as it prevents your properties being null
					},
					data: {
						type: "object",
						"multiple": false
					}
				},
				"aggregations": {
					
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
			onAfterRendering:function(){
				setTimeout(this.drawChart.bind(this),1000);
			},
			drawChart: function () {
				
				var maxRadius = parseInt(d3.min([$(this.getDomRef()).width(), $(this.getDomRef()).height()]) / 2);

				var padding = parseInt(maxRadius * 5 / 100);

				maxRadius = maxRadius - padding;

				//this.setBusy(true);

				if(!this.getData()){
					console.log("No Data");
					return;
				}

				var data = this.getData().map(d=>d.count);
				var legends = this.getData().map(d=>d.category);
/*
				for (var i = 0; i < 4; i++) {
					data.push(parseInt(Math.random() * 100));
					legends.push("Color " + i);
				}
				data = data.sort(function (a, b) { return a - b }).reverse();
*/

				var total = 0;
				data.forEach(d => total += d);

				d3.select("#" + this.getId() + ">svg *").remove();
				

				var g = d3
					.select("#" + this.getId() + ">svg")
					.append("g")
					.attr("transform", "translate(" + $(this.getDomRef()).width() / 3 + "," + $(this.getDomRef()).height() / 2 + ") rotate(180)");


				//Container for the gradients
				var defs = g.append("defs");

				//Filter for the outside glow
				var filter = defs.append("filter")
					.attr("id", "glow");

				filter.append("feGaussianBlur")
					.attr("class", "blur")
					.attr("stdDeviation", "4.5")
					.attr("result", "coloredBlur");

				var feMerge = filter.append("feMerge");
				feMerge.append("feMergeNode")
					.attr("in", "coloredBlur");
				feMerge.append("feMergeNode")
					.attr("in", "SourceGraphic");

				var colors = ["#7f7dfa", "#71f0b7", "#ff8fdf", "#dbb13d", "#f7866f", "#4b3eb8"]

				var x = d3.scale.linear().domain([data.length, 0]).range([maxRadius / 1.8, maxRadius])

				// Generate the pie
				var pie = d3.layout.pie().sort(null);
				var arc = d3.svg.arc()
					.innerRadius(maxRadius / 4)
					.outerRadius(maxRadius);//;



				//Generate groups
				var arcs = g.selectAll("arc")
					.data(pie(data))
					.enter()
					.append("g")
					.attr("class", "arc")
					.append("path")
					.transition()
					.delay(function (d, i) { return i * 100; })
					.duration(100)
					.attrTween('d', function (d, index) {
						var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
						return function (t) {
							d.endAngle = i(t);
							return (d3.svg.arc()
								.innerRadius(parseInt(maxRadius / 3))
								.outerRadius(parseInt(x(index))))(d, index);
						}
					})
					.attr("fill", function (d, i) {
						return colors[i];
					})
					//.style("filter","url(#glow)")
					.ease("linear")





				
				var legend = d3
					.select("#" + this.getId() + ">svg")
					.append("g")
					.attr("transform", "translate("+($(this.getDomRef()).width() / 3 * 2)+",0)");


					legend.selectAll("rect")
						.data(data)
						.enter()
						.append("rect")
						.attr("x", "10")
						.attr("y", function(d,i){ return 20*i; } )
						.attr("height", "10")
						.attr("width", "10")
						.style("fill", function(d,i){
							return colors[i];
						});
					legend.selectAll("text")
						.data(legends)
						.enter()
						.append("text")
						.attr("x", "25")
						.attr("y", function(d,i){ return 10+20*i; } )
						.text(function(d,i){ return d; })
						.style("font-size", "12px");
					
			}
		});
		SegmentedPie.prototype.mapRendered = function () {
			var that = this;
			this.__gmap.addListener("center_changed", function (e) {
				var mapPoint = that.getCenter();

				mapPoint.setPoint(this.getCenter());
			});
		};
		SegmentedPie.prototype.setZoom = function (zoom) {
			this.setProperty("zoom", zoom, true);
			if (this.__gmap) {
				this.__gmap.setZoom(zoom);
			}
		};
		SegmentedPie.prototype.setCenter = function (center) {
			this.setAggregation("center", center, true);
			if (this.__gmap) {
				this.__gmap.panTo(center.getLatLng());
			}
		};
		SegmentedPie.prototype.setVisualStyle = function (json) {
			if (this.__gmap) {
				Log.warning("Map already rendered, Style cannot be applied now");
			} else {
				this.setProperty("visualStyle", json.styles, true);
			}
			return this;
		};
		return SegmentedPie;
	}
);