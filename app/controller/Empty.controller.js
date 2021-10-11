sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter"
], function (Controller, MessageBox, MessageToast, JSONModel, Filter) {
	"use strict";

	return Controller.extend("com.hcl.telecom.operator.ui.controller.Home", {
		onAfterRendering: function () {
			this.getView().getModel().setProperty("/Tickets",[{
				date:"2021-10-05",
				high:3,
				medium:18,
				low:39
			},{
				date:"2021-10-05",
				high:4,
				medium:24,
				low:39
			},{
				date:"2021-10-04",
				high:2,
				medium:12,
				low:39
			},{
				date:"2021-10-03",
				high:9,
				medium:10,
				low:39
			},{
				date:"2021-10-02",
				high:25,
				medium:9,
				low:39
			},{
				date:"2021-10-01",
				high:18,
				medium:20,
				low:39
			}])
		},
		navigate:function(){

		}
	});
});