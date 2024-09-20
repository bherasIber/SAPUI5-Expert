sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",

],
    /**
     * 
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.m.MessageToast} MessageToast
     */
    function (Controller, MessageToast) {
        //alert("UI5 is ready");
        "use strict";

        return Controller.extend("logaligroup.invoices.controller.HelloPanel", {
            onInit: function () {

            },
            onShowHello: function () {
                //alert("Hello World");
                //read text from i18n model
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                var sRecipient = this.getView().getModel().getProperty("/recipient/name");
                var sMsg = oBundle.getText("helloMsg", [sRecipient]);
                MessageToast.show(sMsg);
            }
        });
    });