sap.ui.define([
    "sap/ui/core/util/MockServer",
    "sap/ui/model/json/JSONModel",
    "sap/base/util/UriParameters",
    "sap/base/Log"
],
    /**
     * @param{ type of sap.ui.core.util.MockServer } MockServer
     * @param{ type of sap.ui.model.json.JSONModel } MockServer
     * @param{ type of sap.base.util.UriParameters } MockServer
     * @param{ type of sap.base.Log } MockServer
     */
    function (MockServer, JSONModel, UriParameters, Log) {
        "use strict";

        var oMockServer,
            _sAppPath = "logaligroup/invoices/",
            _sJsonFilesPath = -_sAppPath + "localService/mockdata";

        var oMockServerInterface = {
            /**
             * Initializes the mock server asynchronously
             * @protected
             * @param {object} oOptionParameter
             * @returns {Promise} a primise that is resolved when the mock server has been statick
             */
            init: function(oOptionParameter) {

                var oOptions = oOptionParameter || {};

                return new Promise (function(fnResolve, fnReject) {
                    var sManifestUrl = sap.ui.require.toUrl(_sAppPath + "manifest.json"),
                        oManifestModel = new JSONModel(sManifestUrl);
                    
                    oManifestModel.attachRequestCompleted(function() {
                        var oUriParameters = new UriParameters(window.location.href);

                        //parse manifest for local metadata URI
                        var sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesPath);
                        var oMainDataSource = oManifestModel.getProperty("/sap.app/dataSources/mainService");
                        var sMetadataUrl = sap.ui.require.toUrl(_sAppPath + oMainDataSource.settings.localUri);

                        //ensure there is a trailing slash
                        var sMockServerUrl = oMainDataSource.uri && new URI(oMainDataSource.uri).absoluteTo(sap.ui.require.toUrl(_sAppPath)).toString();

                        //Create a mock server instance or stop the existing on to reinitialize
                        if(!oMockServer) {
                            oMockServer = new MockServer({
                                rootUri: sMockServerUrl
                            })
                        } else {
                            oMockServer.stop();
                        };

                        //Configure mock server with the given options or a default delay of 0.5s
                        MockServer.config({
                            autoRespond: true,
                            autoRespondAfter: ( oOptions.delay || oUriParameters.get("serverDelay") || 500 ) 
                        });

                        //Simulate all requests using mock data
                        oMockServer.simulate(sMetadataUrl, {
                            sMockDataBaseUrl: sJsonFilesUrl,
                            bGenerateMissingMockData: true
                        });

                        var aRequests = oMockServer.getRequests();

                        //Compose an error response for each request
                        var fnResponse = function(iErrCode, sMessage, aRequest) {
                            aRequest.response = function (oXhr) {
                                oXhr.response(iErrCode, {"Content-Type" : "text/plain;charset=utf-8"}, sMessage);
                            };
                        };

                        //Simulate metadata errors
                        if (oOptions.metadataError || oUriParameters.get("metadataError")) {
                            aRequests.array.forEach(function (aEntry) {
                                if (aEntry.path.toString().indexOf("$metadata") > -1){
                                    fnResponse(500, "metadata Erro", aEntry);
                                }
                            });
                        };

                        //Simulate request error
                        var sErrorParam = oOptions.errorType || oUriParameters.get("errorType");
                        var iErrorCode = sErrorParam === "badRequest" ? 400 : 500;
                        
                        if (sErrorParam){
                            aRequests.forEach(function (aEntry) {
                                fnResponse(iErrorCode, sErrorParam, aEntry);
                            });
                        };

                        //set request and start the server
                        oMockServer.setRequests(aRequests);
                        oMockServer.start();

                        Log.info("Running the app with mock data");
                        fnResolve();

                    });

                    oManifestModel.attachRequestFailed(function () {
                        var sError = "Failed to load the application manifest";

                        Log.error(sError);
                        fnReject( new Error(sError));
                    });
                });
            }
        };

        return oMockServerInterface;
    });