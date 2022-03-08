/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require(["publicrepository/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
