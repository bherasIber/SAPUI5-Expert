sap.ui.define([
    "sap/ui/core/UIComponent",
    "logaligroup/invoices/model/Models",
    "sap/ui/model/resource/ResourceModel",
    "./controller/HelloDialog"
],
    /**
     * @param {typeof sap.ui.core.UIComponent} UIComponent 
     * @param {typeof sap.ui.model.resource.ResourceModel} ResourceModel
     */
    function (UIComponent, Models, ResourceModel, HelloDialog) {
        return UIComponent.extend("logaligroup.invoices.Component", {

            metadata: {
                manifest : "json"
                // "rootView": {
                //     "viewName": "logaligroup.invoices.view.App",
                //     "type": "XML",
                //     "async": true,
                //     "id": "app"
                // }
            },

            init: function () {
                //call the init function of the parent
                UIComponent.prototype.init.apply(this, arguments);

                // set data model on the view 
                this.setModel(Models.createRecipient());

                // set i18n model on the view
                //var i18nModel = new ResourceModel({ bundleName: "logaligroup.invoices.i18n.i18n" });
                //this.setModel(i18nModel, "i18n");

                this._helloDialog = new HelloDialog(this.getRootControl());

                //Create the views bases on the url/hash
                this.getRouter().initialize();
            },

            exit: function() {
                this._helloDialog.destroy();
                delete this._helloDialog;
            },

            openHelloDialog: function () {
                this._helloDialog.open();
            }
        });
    });