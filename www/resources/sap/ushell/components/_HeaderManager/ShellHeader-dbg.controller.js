// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    'sap/ui/thirdparty/jquery',
    'sap/ui/core/mvc/Controller',
    'sap/ui/Device',
    'sap/ui/model/json/JSONModel',
    'sap/ushell/EventHub',
    'sap/ushell/components/applicationIntegration/AppLifeCycle',
    'sap/m/ListType',
    'sap/ushell/ui/shell/OverflowListItem',
    'sap/ushell/Config'
    ],
    function(
        jQuery,
        Controller,
        Device,
        JsonModel,
        EventHub,
        AppLifeCycle,
        ListType,
        OverflowListItem,
        Config
    ) {
    "use strict";

    return Controller.extend("sap.ushell.components._HeaderManager.ShellHeader", {

        shellUpdateAggItem: function (sId, oContext) {
            return sap.ui.getCore().byId(oContext.getObject());
        },

        pressNavBackButton: function () {
            // set meAria as closed when navigating back
            EventHub.emit('showMeArea', false);
            AppLifeCycle.service().navigateBack();
        },

        /**
         * in case the endItemsOverflowButtons was pressed we need to show
         * all overflow items in the action sheet
         * @param {object} oEvent event object
         */
        pressEndItemsOverflow: function (oEvent) {
            var oPopover = sap.ui.getCore().byId('headEndItemsOverflow'),
                oModel;

            if (!oPopover) {
                oPopover = sap.ui.xmlfragment("sap.ushell.renderers.fiori2.HeadEndItemsOverflowPopover", this);
                oModel = new JsonModel({
                    headEndItems: Config.last("/core/shellHeader/headEndItems")
                });
                oPopover.setModel(oModel);
            }
            if (oPopover.isOpen()) {
                oPopover.close();
            } else {
                oPopover.openBy(oEvent.getSource());
            }
        },

        headEndItemsOverflowItemFactory: function (sId, oContext) {
            var oHeadEndItem = sap.ui.getCore().byId(oContext.getObject()),
            oFloatingNumberBindingInfo = oHeadEndItem.getBindingInfo("floatingNumber");

            var oOveflowListItem = new OverflowListItem({
                id: sId + "-" + oHeadEndItem.getId(),
                icon: oHeadEndItem.getIcon(),
                iconInset: true,
                title: oHeadEndItem.getText(),
                type: ListType.Active,
                press: function () {
                    if (oHeadEndItem) {
                        oHeadEndItem.firePress();
                    }

                    var oPopover = sap.ui.getCore().byId("headEndItemsOverflow");
                    if (oPopover.isOpen()) {
                        oPopover.close();
                    }
                }
            });

            if (oFloatingNumberBindingInfo) {
                var oModel = oHeadEndItem.getModel();
                oOveflowListItem.setModel(oModel);
                oOveflowListItem.bindProperty("floatingNumber", oFloatingNumberBindingInfo);
            }
            return oOveflowListItem;
        },

        destroyHeadEndItemsOverflow: function (oEvent) {
            oEvent.getSource().destroy();
        },

        /**
         * return true for buttons that should go in the overflow and not in the header
         * @param {string} sButtonNameInUpperCase button name
         * @returns {boolean} isHeadEndItemInOverflow
         */
        isHeadEndItemInOverflow: function (sButtonNameInUpperCase) {
            return sButtonNameInUpperCase !== "ENDITEMSOVERFLOWBTN" && !this.isHeadEndItemNotInOverflow(sButtonNameInUpperCase);
        },

        /**
         * return true for buttons that should be in the header and not in oveflow
         * In case overflow mode is on @see isHeadEndItemOverflow only the
         * NotificationsCountButton and the endItemsOverflowButtons should be in the header
         * in case overflow mode is off all buttons except endItemsOverflowButtons
         * should be in the header
         *
         * In case of Fiori 3 all buttons should go into the overflow expect the meAreaHeaderButton
         *
         * @param {string} sButtonNameInUpperCase button name
         * @returns {boolean} isHeadEndItemNotInOverflow
         */
        isHeadEndItemNotInOverflow: function (sButtonNameInUpperCase) {
            var bOverflowVisible = this.isHeadEndItemOverflow();
            var sSizeType = Device.media.getCurrentRange(Device.media.RANGESETS.SAP_STANDARD).name;

            // Overflow Button
            if (sButtonNameInUpperCase === "ENDITEMSOVERFLOWBTN") {
                return bOverflowVisible;
            }

            // No overflow: all buttons are visible
            if (!bOverflowVisible) {
                return true;
            }

            if (!Config.last("/core/shell/enableFiori3")) {
                // Notifications button is always visible
                if (sButtonNameInUpperCase === "NOTIFICATIONSCOUNTBUTTON") {
                    return true;
                }
            }

            // Fiori 3 specific:
            if (Config.last("/core/shell/enableFiori3") === true && ["MEAREAHEADERBUTTON", "BACKBTN"].indexOf(sButtonNameInUpperCase) > -1) {
                return true;
            }

            // No more buttons on the phone
            if (sSizeType === "Phone") {
                return false;
            }

            // Tablet and desktop, show Search and FloatingContainer buttons
            if (["SF", "FLOATINGCONTAINERBUTTON"].indexOf(sButtonNameInUpperCase) > -1) {
                return true;
            }

            if (sSizeType === "Desktop" && sButtonNameInUpperCase === "COPILOTBTN") {
                return true;
            }

            return false;
        },

        /**
         * returns true if we are in overflow mode
         * we enter the overflow mode in case:
         *  - meArea is on
         *  - current width of the screen is not desktop (as recived from the sap.ui.Device.media
         *  - we have 3 buttons in the header (exluding the endItemsOverflowBtn)
         * @returns {boolean} result
         */
        isHeadEndItemOverflow: function () {
            var nNumberOfVisibleElements = 0,
                oElement,
                aEndItems = Config.last("/core/shellHeader/headEndItems");

            if (aEndItems.indexOf("endItemsOverflowBtn") === -1) {
                return false;
            } else {
                var currentMediaType = Device.media.getCurrentRange(Device.media.RANGESETS.SAP_STANDARD).name;
                var numAllowedBtn = 3;
                if (currentMediaType === "Phone") {
                    numAllowedBtn = 1;
                }

                //calculate number nNumberOfVisibleElements
                for (var i = 0; i < aEndItems.length; i++) {
                    oElement = sap.ui.getCore().byId(aEndItems[i]);
                    if (oElement && oElement.getVisible()) {
                        nNumberOfVisibleElements++;
                    }
                }

                if (sap.ui.getCore().byId("endItemsOverflowBtn").getVisible()) {
                    return nNumberOfVisibleElements > numAllowedBtn + 1;
                } else {
                    return nNumberOfVisibleElements > numAllowedBtn;
                }
            }
        },

        handleNavigationMenuItemPress: function (oEvent) {
            var oData = oEvent.getSource().getCustomData();
            if (oData && oData.length > 0) {
                for (var i=0; i<oData.length; i++) {
                    if (oData[i].getKey() === "intent") {

                        var sListItemIntent = oData[i].getValue();
                        if (sListItemIntent && sListItemIntent[0] === "#") {
                            this.navigateFromShellApplicationNavigationMenu(sListItemIntent);
                            return;
                        }
                    }
                }
            }
        },

        /*
         * method used for navigation from items of the Shell-Application-Navigation-Menu.
         * this method makes sure the view-port is centered before triggering navigation
         * (as the notifications or me-area might be open, and in addition
         * fire an event to closes the popover which opens the navigation menu
         */
        navigateFromShellApplicationNavigationMenu: function (sIntent) {

            //if the target was not change, do nothing
            if (window.hasher.getHash() !== sIntent.substr(1)) {
                // we must make sure the view-port is centered before triggering navigation from shell-app-nav-menu
                EventHub.emit("centerViewPort", Date.now());

                // trigger the navigation
                window.hasher.setHash(sIntent);
            }

            // close the popover which holds the navigation menu
            var oShellAppTitle = sap.ui.getCore().byId("shellAppTitle");
            if (oShellAppTitle) {
                oShellAppTitle.close();
            }
        },

        handleUserSettingsPress: function () {
            EventHub.emit("openUserSettings", Date.now());
        },

        handleAppFinderPress: function () {
            jQuery.sap.measure.start("FLP:AppFinderLoadingStartToEnd", "AppFinderLoadingStartToEnd", "FLP");
            sap.ushell.Container.getServiceAsync("URLParsing").then(
                function (oUrlParser) {
                    var oHash;
                    var sAppFinderHash = "#Shell-home&/appFinder/catalog";
                    var sSemanticObject = "Shell";
                    var sAction = "appfinder";

                    if (oUrlParser) {
                        oHash = oUrlParser.parseShellHash(window.hasher.getHash());
                        oHash.action = sAction;
                        oHash.semanticObject = sSemanticObject;
                        sAppFinderHash = "#" + oUrlParser.constructShellHash(oHash);
                    }
                    // perform the navigation only after the viewport animation completed
                    // and the center viewport is active
                    setTimeout(function () {
                        sap.ushell.Container.getServiceAsync("CrossApplicationNavigation")
                            .then(
                                function (oCrossAppNavigator) {
                                    oCrossAppNavigator.toExternal({
                                        target: {
                                            shellHash: sAppFinderHash
                                        }
                                    });
                                }
                            );
                    }, Device.system.desktop ? 0 : 500);
                }
            );
        }
     });

});