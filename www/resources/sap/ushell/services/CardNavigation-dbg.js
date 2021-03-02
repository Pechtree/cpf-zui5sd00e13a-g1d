// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview Card Navigation
 *
 * @version 1.65.1
 */

/*global sap */
sap.ui.define([
    "sap/ui/integration/services/Navigation",
    "sap/ushell/EventHub",
    "sap/ushell/Config",
    "sap/base/Log"
], function (Navigation, EventHub, Config, UI5Log) {
    "use strict";

    /**
     * Constructor for the navigation service used by the sap.ui.integration.widgets.Card control.
     *
     * @class
     * This navigation service is used by sap.ui.integration.widget.Cards to enable navigation
     * inside the FLP if a user clicks on the header or an item.
     * @extends sap.ui.integration.services.Navigation
     *
     * @constructor
     * @private
     * @name sap.ushell.services.CardNavigation
     * @since 1.64
     */
    var CardNavigation = Navigation.extend(function () {
        this.oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");
    });

    /**
     * Overwrites navigate to execute a cross app navigation. Gets called as soon as the user clicks
     * on a card item or header.
     *
     * @private
     * @param {object} oContext An object that gives the service information about the target.
     * @param {object} oContext.parameters A map with parameters.
     * @since 1.64
     */
    CardNavigation.prototype.navigate = function (oContext) {
        var oParameters = oContext.parameters;
        if (oParameters.openDialog) {
            if (oParameters.openDialog === "RecentActivities" || oParameters.openDialog === "FrequentActivities") {
                sap.ui.require([
                    "sap/ushell/ui/fiori3/QuickAccess"
                ], function (QuickAccess) {
                    var sTabName = oParameters.openDialog === "RecentActivities" ? "recentActivityFilter" : "frequentlyUsedFilter";
                    QuickAccess.openQuickAccessDialog(sTabName);
                });
            } else {
                UI5Log.error("Request to open unknown dialog: '" + oParameters.openDialog + "'");
            }
        } else if (oParameters.url && oParameters.url !== "") {
            var bLogRecentActivity = Config.last("/core/shell/enableRecentActivity") && Config.last("/core/shell/enableRecentActivityLogging");
            if (bLogRecentActivity) {
                var oRecentEntry = {
                    title: oParameters.title,
                    url: oParameters.url,
                    appType: "App",
                    appId: oParameters.url
                };
                sap.ushell.Container.getRenderer("fiori2").logRecentActivity(oRecentEntry);
            }

            window.open(oParameters.url, "_blank");
        } else {
            this.oCrossAppNav.toExternal({
                target: {
                    semanticObject: oParameters.intentSemanticObject,
                    action: oParameters.intentAction
                },
                params: oParameters.intentParameters
            });
        }
    };

    /**
     * Overwrites enabled to indicate whether the user can click the card header or item to navigate.
     *
     * @private
	 * @param {object} oContext An object that gives the service information about the target.
	 * @param {object} oContext.parameters A map with parameters.
     * @returns {promise} A promise that resolves with true if the navigation is supported.
     * @since 1.64
     */
    CardNavigation.prototype.enabled = function (oContext) {
        var oParameters = oContext.parameters;
        if (oParameters.openDialog) {
            if (Config.last("/core/shell/enableFiori3") && ["RecentActivities", "FrequentActivities"].indexOf(oParameters.openDialog) > -1) {
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
        }
        var oNavigation = {
            target: {
                semanticObject: oParameters.intentSemanticObject,
                action: oParameters.intentAction
            },
            params: oParameters.intentParameters
        };
        return new Promise(function (resolve) {
            this.oCrossAppNav.isNavigationSupported([oNavigation]).done(function (aResponses) {
                resolve(aResponses[0].supported);
            }).fail(function () {
                resolve(false);
            });
        }.bind(this));
    };

    CardNavigation.hasNoAdapter = true;
    return CardNavigation;

}, true /* bExport */);