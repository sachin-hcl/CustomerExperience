sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/hcl/telecom/operator/ui/model/models",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/model/json/JSONModel"

], function(UIComponent, Device, models, ODataModel,JSONModel) {
	"use strict";
	return UIComponent.extend("com.hcl.telecom.operator.ui.Component", {
		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			com.hcl.telecom.operator.ui.uiComponent = this;
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.getRouter().initialize();
			sap.ui.getCore().MapPlatform = new H.service.Platform({
				apikey: "j_qdffX9ABhXyTehdFTiHZIkQJO-Zofib1l8piFaSxU"
			});
			
		}
	});
});