sap.ui.define(
	["jquery.sap.global"],
	function (jQuery) {
		sap.ui.getCore().initLibrary({
            name : "dev.sachin",
            version: "${version}",
            dependencies : ["sap.ui.core"],
            types: [],
            interfaces: [],
            controls: [
            ],
            elements: []
        });
        return jQuery;
	}
);