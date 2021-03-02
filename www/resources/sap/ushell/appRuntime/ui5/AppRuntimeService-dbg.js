// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr"
], function (AppCommunicationMgr) {
    "use strict";

    function AppRuntimeService () {
        this.sendMessageToOuterShell = function (sMessageId, oParams) {
            return AppCommunicationMgr.sendMessageToOuterShell(sMessageId, oParams);
        };
    }

    AppRuntimeService.prototype.jsonParseFn = function(sJson) {
        var sResult = {};

        if (sJson && typeof sJson === "string" && sJson.length > 0) {
            sResult = JSON.parse(sJson, function (key, value) {
                if (typeof value != 'string') {
                    return value;
                }
                return (value.substring(0, 8) == 'function') ? eval('(' + value + ')') : value;
            });
        }

        return sResult;
    };

    return new AppRuntimeService();

}, false);
