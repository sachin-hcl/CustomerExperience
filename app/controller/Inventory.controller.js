sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/m/Dialog"
], function (Controller, MessageBox, MessageToast, JSONModel, Filter, Dialog) {
	"use strict";

	return Controller.extend("com.hcl.telecom.operator.ui.controller.Inventory", {
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("Inventory").attachPatternMatched(this._onMatched, this);
		},
		_onMatched: function (oEvent) {
            oEvent.getParameter("arguments");
            $.getJSON(this.getView().getModel("odata").sServiceUrl + `Stocks?$expand=Warehouse`).then((data=>{
                this.getView().getModel().setProperty("/Stocks",data.value);
            }).bind(this));
        },
        createPR:function(){
            if (!this.oDefaultDialog) {
				this.oDefaultDialog = new Dialog({
                    title: "Create Purchase Requisition",
                    type:"Message",
					content: new sap.m.VBox({
						items: [
                            new sap.m.Label({text:"Select Device Type"}),
                            new sap.m.Select({
                                width:"100%",
                                items:[
                                    new sap.ui.core.Item({text:"Hub"}),
                                    new sap.ui.core.Item({text:"Router"}),
                                    new sap.ui.core.Item({text:"5G Router"})
                                ]
                            }),
                            new sap.m.Label({text:"Select Supplier"}),
                            new sap.m.Select({
                                width:"100%",
                                items:[
                                    new sap.ui.core.Item({text:"Jupiter Technologies"}),
                                    new sap.ui.core.Item({text:"Neon Wireless Corporation"})
                                ]
                            }),
                            new sap.m.Label({text:"Enter Quantity"}),
                            new sap.m.Input()
                        ]
					}),
					beginButton: new sap.m.Button({
						type: "Emphasized",
						text: "Create",
						press: function () {
							this.oDefaultDialog.setBusy(true);
							setTimeout(function(){
								this.oDefaultDialog.setBusy(false);
								this.oDefaultDialog.close();	
								sap.m.MessageToast.show("Purchase Requisition #420012025 Created")
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