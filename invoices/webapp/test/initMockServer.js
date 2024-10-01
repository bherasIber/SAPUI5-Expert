sap.ui.define([
    "../localService/mockserver",
    "sap/m/MessageBox"
], 
/**
 * @param{ type of sap.m.Messagebox} Messagebox
 */
function(mockserver,Messagebox){ 

    "use strict";

    var aMockServers = []; 

    //Inicialize the mock server
    aMockServers.push(mockserver.init());
    
    Promise.all(aMockServers).catch( function (oError){
        Messagebox.error(oError.message);
    }).finally( function(){
        sap.ui.require(["sap/ui/core/ComponentSupport"]);
    });

});