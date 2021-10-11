sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller, MessageBox) {
	"use strict";
	return Controller.extend("com.hcl.telecom.operator.ui.controller.ICEX", {
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("ICEX").attachPatternMatched(function (oEvent) {

			}, this);
		}
	});
});