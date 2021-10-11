sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/m/Dialog"
], function (Controller, MessageBox, MessageToast, JSONModel, Filter,Dialog) {
	"use strict";

	return Controller.extend("com.hcl.telecom.operator.ui.controller.TicketDetails", {
		onInit:function(){
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("TicketDetails").attachPatternMatched(this._onMatched, this);
		},
		_onMatched:function(oEvent){
			this.getView().setBusy(true);
			setTimeout(function(){
				this.getView().setBusy(false)
			}.bind(this),3000);
			var ticketId = oEvent.getParameter("arguments").id;
			$.getJSON(this.getView().getModel("odata").sServiceUrl + `CustomerTickets(ID=${ticketId})`).then(function(data){
				this.getView().getModel().setProperty("/CustomerTicket",data);
			}.bind(this));
		},
		navigate:function(){
			this.oRouter.navTo("ICEX")
		},
		createWorkOrder:function(oEvent){
			if (!this.oDefaultDialog) {
				this.oDefaultDialog = new Dialog({
					title: "Create Work Order",
					content: new sap.m.TextArea({
						width:"100%",
						placeholder: "Short Description"
					}),
					beginButton: new sap.m.Button({
						type: "Emphasized",
						text: "OK",
						press: function () {
							this.oDefaultDialog.setBusy(true);
							setTimeout(function(){
								this.oDefaultDialog.setBusy(false);
								this.oDefaultDialog.close();	
								sap.m.MessageToast.show("Work Order #190000032 Created")
							}.bind(this),2000);
						}.bind(this)
					}),
					endButton: new sap.m.Button({
						text: "Close",
						press: function () {
							this.oDefaultDialog.close();
						}.bind(this)
					})
				});

				// to get access to the controller's model
				this.getView().addDependent(this.oDefaultDialog);
			}

			this.oDefaultDialog.open();
		}
	});
});