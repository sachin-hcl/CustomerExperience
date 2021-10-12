sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/core/Fragment"
], function (Controller, MessageBox, MessageToast, JSONModel, Filter, Fragment) {
	"use strict";

	return Controller.extend("com.hcl.telecom.operator.ui.controller.AssetDistribution", {
        showAssets:function(oEvent){
            var filters = "";
            var selection = oEvent.getParameter("data")[0].data["Age Group"];
            if(selection === "6 + Years"){
                filters += ("InstalledDate le "+new Date(Date.now()-6*365*24*3600000).toISOString().substring(0,10))
            } else if(selection === "4 - 6 Years"){
                filters += ("InstalledDate ge "+new Date(Date.now()-6*365*24*3600000).toISOString().substring(0,10))
                filters += (" and InstalledDate le "+new Date(Date.now()-4*365*24*3600000).toISOString().substring(0,10))
            } else if(selection === "2 - 4 Years"){
                filters += ("InstalledDate ge "+new Date(Date.now()-4*365*24*3600000).toISOString().substring(0,10))
                filters += (" and InstalledDate le "+new Date(Date.now()-2*365*24*3600000).toISOString().substring(0,10))
            } else if(selection === "0 - 2 Years"){
                filters += ("InstalledDate ge "+new Date(Date.now()-2*365*24*3600000).toISOString().substring(0,10))
            }


            $.getJSON(this.getView().getModel("odata").sServiceUrl + `Assets?$expand=Customer,Plan&$filter=${filters}`).then(function(data){
                this.getView().getModel().setProperty("/DisplayAssets",data.value);
            }.bind(this))

            
            var oButton = oEvent.getSource(),
				oView = this.getView();
			if (!this._pDialog) {
				this._pDialog = Fragment.load({
					name: "com.hcl.telecom.operator.ui.fragments.AssetList",
					controller: this
				}).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.addStyleClass("sapUiSizeCompact");
					return oDialog;
                });
			}
			this._pDialog.then(function(oDialog){
				oDialog.open();
			});
        },
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
            


            var defaultLayers = sap.ui.getCore().MapPlatform.createDefaultLayers();
			//Step 2: initialize a map - this map is centered over Europe
			var map = new H.Map(this.getView().byId("mapDistribution").getDomRef(),
				defaultLayers.vector.normal.map, {
				center: { lat: 0, lng: 0 },
				zoom: 12,
				pixelRatio: window.devicePixelRatio || 1
            });

            new H.mapevents.Behavior(new H.mapevents.MapEvents(map));


            $.getJSON(this.getView().getModel("odata").sServiceUrl + `Customers?$select=lat,lng,ID`).then(data=>{
                return data.value.map(customer=>{
                    return new H.clustering.DataPoint(customer.lat,customer.lng);
                });
            }).then(dataPoints=>{
                var clusteringLayer = new H.map.layer.ObjectLayer(new H.clustering.Provider(dataPoints, {
					clusteringOptions: {
						// Maximum radius of the neighbourhood
						eps: 32,
						// minimum weight of points required to form a cluster
						minWeight: 2
					}
                }));
                map.addLayer(clusteringLayer);
            })


			//var ui = H.ui.UI.createDefault(map, defaultLayers);
			setTimeout(function(){
				map.setCenter({ lat: 53.75084, lng: -1.60473 });
				map.setZoom(7);
				map.getViewPort().resize();
				// map.addObject(new H.map.Circle(
				// 	// The central point of the circle
				// 	{ lat: 53.75084, lng: -1.60473 },
				// 	// The radius of the circle in meters
				// 	500,
				// 	{
				// 		style: {
				// 			strokeColor: 'rgba(55, 85, 170, 0.6)', // Color of the perimeter
				// 			lineWidth: 1,
				// 			fillColor: 'rgba(0, 128, 0, 0.5)'  // Color of the circle
				// 		}
				// 	}
				// ));
			},2000);
			/*
			
			*/



		}
	});
});