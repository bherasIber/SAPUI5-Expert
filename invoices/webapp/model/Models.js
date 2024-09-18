sap.ui.define([
    "sap/ui/model/json/JSONModel"
],
    /**
     * 
     * @param {typeof sap/ui/model/json/JSONModel} JSONModel
     */
    function (JSONModel) {
        //alert("UI5 is ready");
        "use strict";

        return {
            createRecipient: function () {
                var oData = {
                    recipient : {
                        name : "World"
                    }
                };

                return new JSONModel(oData);
            }
        };
    });