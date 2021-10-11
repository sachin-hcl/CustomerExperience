sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter"
], function (Controller, MessageBox, MessageToast, JSONModel, Filter) {
	"use strict";

	return Controller.extend("com.hcl.telecom.operator.ui.controller.Coverage", {
		onAfterRendering: function () {
			var defaultLayers = sap.ui.getCore().MapPlatform.createDefaultLayers();
			//Step 2: initialize a map - this map is centered over Europe
			var map = new H.Map(this.getView().byId("networkMap").getDomRef(),
				defaultLayers.vector.normal.map, {
				center: { lat: 0, lng: 0 },
				zoom: 12,
				pixelRatio: window.devicePixelRatio || 1
			});
			//debugger;



			//window.addEventListener('resize', () => map.getViewPort().resize());
			var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
			//var ui = H.ui.UI.createDefault(map, defaultLayers);
			setTimeout(function () {
				map.setCenter({ lat: 53.75084, lng: -1.60473 });
				map.setZoom(12);
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

				var dataPoints = [];
				for (var i = 0; i < 50; i++) {
					dataPoints.push(new H.clustering.DataPoint(53.75284,  -1.60573));
				}

				// Create a clustering provider with custom options for clusterizing the input
				var clusteredDataProvider = new H.clustering.Provider(dataPoints, {
					clusteringOptions: {
						// Maximum radius of the neighbourhood
						eps: 32,
						// minimum weight of points required to form a cluster
						minWeight: 2
					}
				});

				// Create a layer tha will consume objects from our clustering provider
				var clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);

				// To make objects from clustering provder visible,
				// we need to add our layer to the map
				map.addLayer(clusteringLayer);

				// Create a provider for a semi-transparent heat map:
				var heatmapProvider = new H.data.heatmap.Provider({
					colors: new H.data.heatmap.Colors({
					'0': 'blue',
					'1': 'red'
					}, true),
					opacity: 0.9,
					// Paint assumed values in regions where no data is available
					assumeValues: false
				});
				
				// Add the data:
				heatmapProvider.addData([
					{lat: 53.75084, lng: -1.65473, value: 0},
					{lat: 53.75184, lng: -1.65473, value: 1},
					{lat: 53.75284, lng: -1.65473, value: 1},
					{lat: 53.75384, lng: -1.65573, value: 1},
					{lat: 53.75184, lng: -1.65673, value: 1},
					{lat: 53.75184, lng: -1.65773, value: 1}
				]);

				// Add a layer for the heatmap provider to the map:
				map.addLayer(new H.map.layer.TileLayer(heatmapProvider));

			}, 2000);

		}
	});
});