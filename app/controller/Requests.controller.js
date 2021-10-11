sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter"
], function (Controller, MessageBox, MessageToast, JSONModel, Filter) {
	"use strict";

	return Controller.extend("com.hcl.telecom.operator.ui.controller.Requests", {
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("Requests").attachPatternMatched(this._onMatched, this);
		},
        _onMatched:function(oEvent){
            var requestType = oEvent.getParameter("arguments").type;
            if(requestType === "5G"){
                $.getJSON(this.getView().getModel("odata").sServiceUrl +"FiveGRequests?$expand=Customer").then((data=>{
                    this.getView().getModel().setProperty("/Requests",data.value);
                }).bind(this));
            }else if(requestType === "Connection"){
                $.getJSON(this.getView().getModel("odata").sServiceUrl +"NewConnectionRequests?$expand=Customer").then((data=>{
                    this.getView().getModel().setProperty("/Requests",data.value);
                }).bind(this));
            }
        },
		navigate:function(){

		}
	});
});