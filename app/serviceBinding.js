function initModel() {
	var sUrl = "/safePassage/hclSafePassage_v0/Services/hclSafePassage.xsodata/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}