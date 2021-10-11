sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter"
], function (Controller, MessageBox, MessageToast, JSONModel, Filter) {
	"use strict";

	return Controller.extend("com.hcl.telecom.operator.ui.controller.AssetDistribution", {
		onAfterRendering: function () {
			Promise.all([
				$.getJSON(this.getView().getModel("odata").sServiceUrl + `AssetBySupportLevels`),
				$.getJSON(this.getView().getModel("odata").sServiceUrl + `AssetGroupByAge`),
				$.getJSON(this.getView().getModel("odata").sServiceUrl + `AssetByVendors`)
			]).then(function(results){
				this.getView().getModel().setProperty("/Assets",{
					"AssetBySupportLevels":results[0].value.map(d=>{
						return {category:d.SupportStatus,count:d.Count};
					}),
					"AssetGroupByAge":results[1].value,
					"AssetByVendors":results[2].value.map(d=>{
						return {category:d.Vendor,count:d.Count};
					})
				});
			}.bind(this));
			
			
			
			this.getView().getModel().setProperty("/HardwareDistribution", [{
				"category": "Recent and Updated",
				"count": 36
			}, {
				"category": "Recent SW Update Required",
				"count": 41
			}, {
				"category": "Hardware off support",
				"count": 45
			}, {
				"category": "Unsupported",
				"count": 44
			}]);

			this.getView().getModel().setProperty("/HardwareAge", [{
				"type": "Age Group",
				"ageGroup": "0-2 Years",
				"count": 272
			}, {
				"type": "Age Group",
				"ageGroup": "2-4 Years",
				"count": 423
			}, {
				"type": "Age Group",
				"ageGroup": "4-6 Years",
				"count": 623
			}, {
				"type": "Age Group",
				"ageGroup": "6+ Years",
				"count": 153
			}]);

			this.getView().getModel().setProperty("/AssetsByVendors", [{
				"category": "Cisco",
				"count": 986
			}, {
				"category": "Juniper",
				"count": 432
			}, {
				"category": "HPE",
				"count": 124
			}, {
				"category": "Arista",
				"count": 713
			}, {
				"category": "Others",
				"count": 1231
			}]);

			

			var defaultLayers = sap.ui.getCore().MapPlatform.createDefaultLayers();
			//Step 2: initialize a map - this map is centered over Europe
			var map = new H.Map(this.getView().byId("mapDistribution").getDomRef(),
				defaultLayers.vector.normal.map, {
				center: { lat: 0, lng: 0 },
				zoom: 12,
				pixelRatio: window.devicePixelRatio || 1
			});
			//debugger;

			
			//window.addEventListener('resize', () => map.getViewPort().resize());
			var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
			//var ui = H.ui.UI.createDefault(map, defaultLayers);
			setTimeout(function(){
				map.setCenter({ lat: 53.75084, lng: -1.60473 });
				map.setZoom(14);
				map.getViewPort().resize();
				map.addObject(new H.map.Circle(
					// The central point of the circle
					{ lat: 53.75084, lng: -1.60473 },
					// The radius of the circle in meters
					500,
					{
						style: {
							strokeColor: 'rgba(55, 85, 170, 0.6)', // Color of the perimeter
							lineWidth: 1,
							fillColor: 'rgba(0, 128, 0, 0.5)'  // Color of the circle
						}
					}
				));
			},2000);
			/*
			
			*/



		}
	});
});