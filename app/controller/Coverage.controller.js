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
            var map = new H.Map(this.getView().byId("networkMap").getDomRef(),
                defaultLayers.vector.normal.map, {
                center: { lat: 0, lng: 0 },
                zoom: 12,
                pixelRatio: window.devicePixelRatio || 1
            });
            new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
            H.ui.UI.createDefault(map, defaultLayers);

            setTimeout(function () {
                map.setCenter({ lat: 53.75084, lng: -1.60473 });
                map.setZoom(12);
                map.getViewPort().resize();


                $.getJSON(this.getView().getModel("odata").sServiceUrl + `CustomerTickets?$select=lat,lng,ID&$filter=TicketStatus ne 'Closed'`).then(data => {
                    return data.value.map(customer => {
                        return new H.clustering.DataPoint(customer.lat, customer.lng);
                    });
                }).then(dataPoints => {
                    var clusteringLayer = new H.map.layer.ObjectLayer(new H.clustering.Provider(dataPoints, {
                        clusteringOptions: {
                            eps: 32,
                            minWeight: 2
                        }
                    }));
                    map.addLayer(clusteringLayer);
                });
                /*
                                map.addEventListener('mapviewchangeend', function(){
                                    var newZoom=map.getZoom();
                                    if(newZoom > oldZoom){
                                    // zoomed in
                                    }else{
                                    // zoomed out
                                    }
                                    oldZoom=newZoom;
                                })
                                */
                
                $.getJSON(this.getView().getModel("odata").sServiceUrl + `CustomerTickets?$select=lat,lng,ID&$filter=TicketStatus ne 'Closed'`).then(data => {
                    return data.value.map(customer => {
                        return new H.clustering.DataPoint(customer.lat, customer.lng);
                    });
                }).then(dataPoints => {
                    var clusteringLayer = new H.map.layer.ObjectLayer(new H.clustering.Provider(dataPoints, {
                        clusteringOptions: {
                            eps: 32,
                            minWeight: 2
                        }
                    }));
                    map.addLayer(clusteringLayer);
                });

                window.coords = [];

                map.addEventListener('tap', function (evt) {
                    var coord = map.screenToGeo(evt.currentPointer.viewportX,evt.currentPointer.viewportY);
                    window.coords.push(coord);
                });
                

                
                var polygon = new H.map.Polygon(new H.geo.LineString([53.72501646703716, -1.6521657465282074, 0, 53.73287012723793, -1.7080129214818767, 0, 53.732734727671534, -1.7698110171850017, 0, 53.76318771229521, -1.7936147316149613, 0, 53.78739899239111, -1.783086170654296, 0, 53.798350344404234, -1.6599477359350017, 0, 53.80200015970489, -1.5768636294896892, 0, 53.767787581142116, -1.5564931530761705, 0, 53.739368595267386, -1.5931142328563324, 0, 53.728943480519455, -1.6315663812938324, 0]), {
                    style: {
                        fillColor: 'rgba(35, 51, 129, 0.3)',
                        lineWidth: 5,
                        strokeColor: 'rgba(114, 38, 51, 1)'
                    }
                });

                map.addObject(polygon);


            }.bind(this), 2000);























            /*
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
            */
        }
    });
});