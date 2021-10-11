sap.ui.define([
	"./App.controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter"
], function (Controller, MessageBox, MessageToast, JSONModel, Filter) {
	"use strict";

	return Controller.extend("com.hcl.telecom.operator.ui.controller.Tickets", {
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("Tickets").attachPatternMatched(this._onMatched, this);
		},
		_onMatched: function (oEvent) {
			var filters = oEvent.getParameter("arguments").filters;
			var filterString = "TicketStatus ne 'Closed'";

			this.getView().getModel().setProperty("/UI",($.extend(this.getView().getModel().getProperty("/UI"),{
				TicketPageTitle:"All Open Tickets"
			})));

			if (filters && filters.indexOf("24Hrs") >= 0) {
				var nextDay = new Date(Date.now() + 24 * 3600000);
				filterString += " and SLADateTime lt " + nextDay.toISOString();
				this.getView().getModel().setProperty("/UI/TicketPageTitle","Tickets to be closed in 24 Hours");
			}
			if (filters && filters.indexOf("PriorityCustomers") >= 0 ) {
				filterString += " and Rating eq 5";
				this.getView().getModel().setProperty("/UI/TicketPageTitle","Tickets by Top Rated Customers");
			}
			if (filters && filters.indexOf("PriorityTickets") >= 0 ) {
				filterString += " and Priority eq 'H'";
				this.getView().getModel().setProperty("/UI/TicketPageTitle","High Priority Tickets");
			}
			$.get(this.getView().getModel("odata").sServiceUrl + "CustomerTickets?" + (filterString ? `$filter=${filterString}` : "")).then((d => {
				this.getView().getModel().setProperty("/CustomerTickets", d.value);
			}).bind(this))
		},
		onAfterRendering: function () {

		},
		navToTicketDetail: function (oEvent) {
			this.oRouter.navTo("TicketDetails",{
				id:oEvent.getSource().getBindingContext().getProperty("ID")
			})
		}
	});
});