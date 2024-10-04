sap.ui.define([
	"logaligroup/invoices/localService/mockserver",
	"sap/ui/test/opaQunit",
	"./pages/HelloPanel"
	/**
	 * @param {sap.ui.test.opaQunit} opaQunit
	 */
], function(mockserver,	opaQunit, HelloPanel) {
	"use strict";

	QUnit.module("Navigation");
	opaQunit("Should open the Hello Dialog", function(Given, When, Then){

		//Initialize the mock server
		mockserver.init();

		//Arrangements
		Given.iStartMyUIComponent({
			componentConfig: {
				name: "logaligroup.invoices"
			}
		});

		//Actions
		When.onTheAppPage.iSayHelloDialogButton();

		//Assertions
		Then.onTheAppPage.iSeeTheHelloDialog();

		//Cleanup
		Then.iTeardownMyApp();


	});
});