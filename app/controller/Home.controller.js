sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter"
], function (Controller, MessageBox, MessageToast, JSONModel, Filter) {
	"use strict";

	return Controller.extend("com.hcl.telecom.operator.ui.controller.Home", {
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("Home").attachPatternMatched(this._onMatched, this);
		},
		_onMatched: function (oEvent) {
			oEvent.getParameter("arguments");
			var nextDay = new Date(Date.now()+24*3600000);
			var lastWeek = new Date(Date.now()-7*24*3600000);
			
			Promise.all([
				$.get(this.getView().getModel("odata").sServiceUrl + "CustomerTickets/$count?$filter=(TicketStatus ne 'Closed' and SLADateTime lt " + nextDay.toISOString() + ")"),
				$.get(this.getView().getModel("odata").sServiceUrl + "CustomerTickets/$count?$filter=TicketStatus ne 'Closed'"),
				$.get(this.getView().getModel("odata").sServiceUrl + "FiveGRequests/$count?$filter=IsFulfilled eq null"),
				$.get(this.getView().getModel("odata").sServiceUrl + "NewConnectionRequests/$count?$filter=IsFulfilled eq null"),
				$.getJSON(this.getView().getModel("odata").sServiceUrl + `TicketPriorityCounts?$orderby=Date&$filter=Date lt ${nextDay.toISOString().substring(0,10)} and Date gt ${lastWeek.toISOString().substring(0,10)}`),
				$.get(this.getView().getModel("odata").sServiceUrl + "Assets/$count"),
				$.getJSON(this.getView().getModel("odata").sServiceUrl + "AssetGroupByAge?$filter=AgeGroup eq '6 + Years'"),
				$.get(this.getView().getModel("odata").sServiceUrl + "CustomerTickets/$count?$filter=TicketStatus ne 'Closed' and Rating eq 5"),
				$.getJSON(this.getView().getModel("odata").sServiceUrl + "Stocks"),
			]).then(results => {
				//TicketsBreachingSLA
				//OpenTickets
				//Open 5G Requests
				//new connection requests
				
				var counts = {
					TicketsBreachingSLA:results[0],
					OpenTickets:results[1],
					Open5GRequests : results[2],
					NewConnectionRequests: results[3],
					TicketPriorityCounts:results[4].value,
					AllAssets:parseInt(results[5]),
					AgedAssets:results[6].value[0].Count,
					TicketsByPriorityCustomers:results[7],
					AssetsInStock:results[8].value[0].StockCount
				};
				counts.AssetsRequired = parseInt(counts.NewConnectionRequests) + parseInt(counts.AgedAssets),
				counts.AssetReplacementPercent = parseInt(counts.AgedAssets/counts.AllAssets*100);
				counts.MaxStockCount = Math.max(counts.AssetsInStock, parseInt(counts.NewConnectionRequests) + parseInt(counts.AgedAssets));
				this.getView().getModel().setProperty("/Counts",counts);
				
				console.log(this.getView().getModel().getProperty("/Counts"));
			}).catch(err => {
				MessageBox.error(err.message);
			})

		},
		navigate: function (oEvent) {
			this.oRouter.navTo(oEvent.getSource().data("route"),{
				filters:oEvent.getSource().data("filters")
			});
		},
		requests:function(oEvent){
			this.oRouter.navTo("Requests",{
				type:oEvent.getSource().data("type")
			});
		},
		onAfterRendering: function () {
			// this.getView().getModel().setProperty("/Tickets", [{
			// 	date: "2021-10-05",
			// 	high: 3,
			// 	medium: 18,
			// 	low: 39
			// }, {
			// 	date: "2021-10-05",
			// 	high: 4,
			// 	medium: 24,
			// 	low: 39
			// }, {
			// 	date: "2021-10-04",
			// 	high: 2,
			// 	medium: 12,
			// 	low: 39
			// }, {
			// 	date: "2021-10-03",
			// 	high: 9,
			// 	medium: 10,
			// 	low: 39
			// }, {
			// 	date: "2021-10-02",
			// 	high: 25,
			// 	medium: 9,
			// 	low: 39
			// }, {
			// 	date: "2021-10-01",
			// 	high: 18,
			// 	medium: 20,
			// 	low: 39
			// }])
		}
	});
});