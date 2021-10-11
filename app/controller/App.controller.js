sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller, MessageBox) {
	"use strict";
	return Controller.extend("com.hcl.telecom.operator.ui.controller.App", {
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("Home").attachPatternMatched(function (oEvent) {

			}, this);
		},
		onAfterRendering: function () {
			
		},
		navigate:function(oEvent){
			this.oRouter.navTo(oEvent.getSource().data("route"));
		}
	});
});