// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "./AddHeadItemsStrategy",
    "./AddHeadItemsStrategyFiori3",
    "./AddHeadEndItemsStrategy",
    "./AddHeadEndItemsStrategyFiori3",
    "./ExtendApplicationPropertyStrategy",
    "./RemoveItemsStrategy",
    "./SetHeadPropertyStrategy",
    "sap/ushell/Config"
], function (
    AddHeadItemsStrategy,
    AddHeadItemsStrategyFiori3,
    AddHeadEndItemsStrategy,
    AddHeadEndItemsStrategyFiori3,
    ExtendApplicationPropertyStrategy,
    RemoveItemsStrategy,
    SetHeadPropertyStrategy,
    Config
) {
    "use strict";

    return function (sPropertyName, sAction) {
        var oStrategy;
        switch (sPropertyName) {
            case "headItems":
                if (sAction === "remove") {
                    oStrategy = RemoveItemsStrategy;
                } else if (Config.last("/core/shell/enableFiori3")) {
                    oStrategy = AddHeadItemsStrategyFiori3;
                } else {
                    oStrategy = AddHeadItemsStrategy;
                }
                break;
            case "headEndItems":
                if (sAction === "remove") {
                    oStrategy = RemoveItemsStrategy;
                } else if (Config.last("/core/shell/enableFiori3")) {
                    oStrategy = AddHeadEndItemsStrategyFiori3;
                } else {
                    oStrategy = AddHeadEndItemsStrategy;
                }
                break;
            case "showLogo":
            case "headerVisible":
            case "centralAreaElement":
            case "title":
                oStrategy = SetHeadPropertyStrategy;
                break;
            case "application":
                oStrategy = ExtendApplicationPropertyStrategy;
                break;
            case "application/hierarchy":
            case "application/icon":
            case "application/relatedApps":
            case "application/showNavMenuTitle":
            case "application/title":
                oStrategy = SetHeadPropertyStrategy;
                break;
            default:
                oStrategy = null;
                break;
        }
        return oStrategy;
    };

});
