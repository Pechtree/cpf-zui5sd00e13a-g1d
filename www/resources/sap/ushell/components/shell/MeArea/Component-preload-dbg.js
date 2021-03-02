//@ui5-bundle Component-preload.js
sap.ui.require.preload({
	"sap/ushell/components/shell/MeArea/Component.js":function(){// ${copyright}
sap.ui.define([
    'sap/ushell/resources',
    'sap/ui/core/UIComponent',
    'sap/ushell/components/applicationIntegration/AppLifeCycle',
    'sap/ushell/ui/footerbar/ContactSupportButton',
    'sap/ushell/ui/footerbar/EndUserFeedback',
    'sap/ushell/EventHub',
    'sap/ushell/Config'
], function (
    resources,
    UIComponent,
    AppLifeCycle,
    ContactSupportButton,
    EndUserFeedback,
    EventHub,
    Config
) {
    "use strict";

    var _oRenderer;
    // Shortcut to sap.ushell.Container.getRenderer("fiori2")
    function _renderer () {
        if (!_oRenderer) {
            _oRenderer = sap.ushell.Container.getRenderer("fiori2");
        }
        return _oRenderer;
    }

    // Shortcut to sap.ushell.Container.getRenderer("fiori2").getShellConfig()
    function _shellConfig () {
        return _renderer().getShellConfig();
    }

    // Shortcut to AppLifeCycle.getElementsModel().getModel()
    function _model () {
        return AppLifeCycle.getElementsModel().getModel();
    }

    var bEnableHelp;

    /* MeArea Component */
    return UIComponent.extend("sap.ushell.components.shell.MeArea.Component", {

        metadata: {
            version: "${version}",
            library: "sap.ushell.components.shell.MeArea",
            dependencies: {
                libs: ["sap.m", "sap.ui.layout"]
            }
        },

        createContent: function () {
            this._bSearchPrefsLoaded = false;
            this._bIsMeAreaCreated = false;
            //xray enabledment
            bEnableHelp  = Config.last("/core/extension/enableHelp");

            var that = this,
                oMeAreaToggle;

            // Show/Hide MeArea
            var toggleMeArea = function (bShow) {
                this.toggleMeAreaView(oMeAreaToggle, bShow);
            }.bind(this);

            oMeAreaToggle = sap.ui.getCore().byId("meAreaHeaderButton");
            oMeAreaToggle.applySettings({
                tooltip: sap.ushell.Container.getUser().getFullName(),
                //Header Icon - icon on meArea toggle button
                icon: '{/userImage/personPlaceHolder}',
                selected: {
                    path: "/currentViewPortState",
                    formatter: function (viewPortState) {
                        if (viewPortState === 'LeftCenter') {
                            return true;
                        }
                        return false;
                    }
                },
                press: function () {
                    toggleMeArea(!this.getSelected());
                },
                visible: true,
                enabled: true,
                showSeparator: false,
                ariaLabel: "{i18n>MeAreaToggleButtonAria}"
            }).removeStyleClass("sapUshellPlaceHolders");

            oMeAreaToggle.addEventDelegate({
                onAfterRendering: function () {
                    oMeAreaToggle.$().attr("aria-pressed", oMeAreaToggle.getSelected());
                },
                onsapskipforward: function (oEvent) {
                    sap.ushell.renderers.fiori2.AccessKeysHandler.bForwardNavigation = true;
                    oEvent.preventDefault();
                    jQuery("#sapUshellHeaderAccessibilityHelper").focus();
                },
                onsaptabprevious: function (oEvent) {
                    var viewPort = sap.ui.getCore().byId('viewPortContainer'),
                        sCurrentState = viewPort.getCurrentState(),
                        oRecentItemsList;

                    switch (sCurrentState) {
                        case "LeftCenter":
                            oRecentItemsList = jQuery("#meAreaIconTabBar-content li:first");
                            if (oRecentItemsList.length > 0) {
                                oRecentItemsList[0].focus();
                            } else {
                                var enableRecentActivity = Config.last("/core/shell/enableRecentActivity");
                                if (enableRecentActivity && _model().getProperty("/enableTrackingActivity")) {
                                    jQuery("#meAreaIconTabBar .sapMITBText")[0].focus();
                                } else {
                                    oEvent.preventDefault();
                                    jQuery('.sapUshellActionItem:last')[0].focus();
                                }
                            }
                            break;
                        case "Center":
                            if (sap.ushell.renderers.fiori2.AccessKeysHandler.getAppKeysHandler()) {
                                oEvent.preventDefault();
                                sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;
                            }
                            break;
                        default:
                            //do nothing
                    }
                },
                onsapskipback: function (oEvent) {

                    // When the focus is on the MeArea icon and MeArea is opened (i.e. case "LeftCenter") -
                    // SHIFT+F6 should move the focus to the Recently Used list

                    var viewPort = sap.ui.getCore().byId('viewPortContainer'),
                        sCurrentState = viewPort.getCurrentState(),
                        oNextElement;

                    switch (sCurrentState) {
                        case "LeftCenter":
                            oEvent.preventDefault();
                            oNextElement = jQuery("#meAreaIconTabBar .sapMITBSelected");
                            if (oNextElement.length === 0) {
                                oNextElement = jQuery(".sapUshellActionItem");
                            }
                            oNextElement[0].focus();
                            break;
                        case "Center":
                            oEvent.preventDefault();
                            // if co-pilot exists and we came from tile - need to focus on copilot - otherwise - on mearea
                            if (jQuery("#sapUshellFloatingContainerWrapper:visible").length == 1 &&  (oEvent.originalEvent.srcElement.id) != "") {
                                sap.ui.getCore().getEventBus().publish("launchpad", "shellFloatingContainerIsAccessible");
                            } else if (sap.ushell.renderers.fiori2.AccessKeysHandler.getAppKeysHandler()) {
                                sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;
                            }
                            break;
                        default :
                            //do nothing
                    }
                }
            });

            //In state blank when no Action Items do not display MeArea.
            AppLifeCycle.getElementsModel().createTriggers([{
                fnRegister: function () {
                    if (!that.oActionsDoable) {
                        that.oActionsDoable = Config.on("/core/shell/model/currentState/actions").do(function (aActions) {
                            if (Config.last("/core/shell/enableFiori3")) {
                                if (aActions && aActions.length > 0) {
                                    _renderer().showHeaderEndItem(["meAreaHeaderButton"], true);
                                } else {
                                    _renderer().hideHeaderEndItem(["meAreaHeaderButton"], true);
                                }
                            } else if (aActions && aActions.length > 0) {
                                _renderer().showHeaderItem(["meAreaHeaderButton"], true);
                            } else {
                                _renderer().hideHeaderItem(["meAreaHeaderButton"], true);
                            }
                        });
                    }
                },
                fnUnRegister: function () {
                    if (!that.oActionsDoable) {
                        that.oActionsDoable.off();
                        that.oActionsDoable = null;
                    }
                }
            }], false, ["blank-home", "blank"]);

            if (Config.last("/core/shell/enableFiori3")) {
                sap.ushell.Container.getRenderer("fiori2").oShellModel.addHeaderEndItem(["meAreaHeaderButton"], false, ["home", "app", "minimal", "standalone", "embedded", "embedded-home", "lean"], true);
            }

            this._createMeArea();

            // Show/Hide MeArea API. Usage: EventHub.emit('showMeArea', [true|false]);
            EventHub.on('showMeArea').do(toggleMeArea);
        },

        _createMeArea: function () {
            if (this._bIsMeAreaCreated === true) {
                return;
            }
            this._bIsMeAreaCreated = true;

            //add MeArea view
            var oMeAreaView = sap.ui.view("meArea", {
                viewName: "sap.ushell.components.shell.MeArea.MeArea",
                type: 'JS',
                viewData: _renderer().getComponentData(),
                async: true
            });

            oMeAreaView.addCustomData(new sap.ushell.ui.launchpad.AccessibilityCustomData({
                key: "role",
                value: "region",
                writeToDom: true
            }));
            oMeAreaView.addCustomData(new sap.ushell.ui.launchpad.AccessibilityCustomData({
                key: "aria-label",
                value: resources.i18n.getText("MeAreaToggleButtonAria"),
                writeToDom: true
            }));

            // create buttons & adjust model BEFORE the me area is added to the view-port
            // otherwise the first buttons of open-catalog and user-settings render
            // before rest of the actions are instantiated thus causing a glitch in the UI
            this._createActionButtons();

            oMeAreaView.loaded().then(function (oView) {
                _renderer().addLeftViewPort(oMeAreaView);
            });
        },

        /*
         * OnClick handler of the me area header button
         *
         */
        toggleMeAreaView: function (oMeAreaToggle, bShow) {

            if (!oMeAreaToggle || !oMeAreaToggle.getDomRef()) {
                return; // do nothing if the MeArea toggle button is not rendered
            }
            if (oMeAreaToggle.getSelected() === !!bShow) {
                return; // no change
            }

            var sCurrentShellState = _model().getProperty('/currentState/stateName');
            var oPopoverStates = {
                'embedded' : true,
                'embedded-home' : true,
                'standalone' : true,
                'blank-home' : true,
                'blank' : true
            };

            this._createMeArea();

            if (oPopoverStates[sCurrentShellState] === true) {
                // Open a Popover with Actions.
                this._showActionsInPopOver(oMeAreaToggle);
            } else {
                //Show MeArea
                this._switchToMeAreaView(oMeAreaToggle, bShow);
            }
        },

        _createActionButtons: function () {

            //
            // About button
            //
            if (!sap.ui.getCore().byId("aboutBtn")) {
                var oAboutButton = new sap.ushell.ui.footerbar.AboutButton("aboutBtn");
                if (bEnableHelp) {
                    oAboutButton.addStyleClass('help-id-aboutBtn');// xRay help ID
                }
                _renderer().addShellDanglingControl(oAboutButton);
            }

            //
            // User Settings button
            //
            //in case the user setting button should move to the shell header, it was already created in shell.model.js
            //otherwise, create it as an actionItem in the me area
            if (!sap.ui.getCore().byId("userSettingsBtn") && !_shellConfig().moveUserSettingsActionToShellHeader) {
                var oUserPrefButton = new sap.ushell.ui.launchpad.ActionItem("userSettingsBtn", {
                    id: "userSettingsBtn",
                    text: resources.i18n.getText("userSettings"),
                    icon: 'sap-icon://action-settings'
                });
                if (bEnableHelp) {
                    oUserPrefButton.addStyleClass('help-id-loginDetails');// xRay help ID
                }
                _renderer().addShellDanglingControl(oUserPrefButton);
            }

            //
            // Support Ticket button
            //
            // Only when the contact support button has to be shown in the MeArea
            if (!_shellConfig().moveContactSupportActionToShellHeader) {
                Config.on("/core/extension/SupportTicket").do(
                    function (bConfigured) {
                        // 1) false and no button : do nothing
                        // 2) false and the button exists: probably visible, set visibility to false
                        // 3) true: create the button and set visibility to true
                        var oContactSupport = sap.ui.getCore().byId("ContactSupportBtn");
                        if (bConfigured && !oContactSupport) {
                            oContactSupport = new ContactSupportButton("ContactSupportBtn");
                            _renderer().addShellDanglingControl(oContactSupport);
                            if (bEnableHelp) {
                                oContactSupport.addStyleClass('help-id-contactSupportBtn'); // xRay help ID
                            }
                        }
                        if (oContactSupport) {
                            oContactSupport.setVisible(bConfigured);
                        }
                    }
                );
            }

            //
            // End User Feedback button
            //
            _model().setProperty('/showEndUserFeedback', false);

            function setEndUserFeedbackButton (oEndUserFeedbackService, oEndUserFeedbackBtn) {
                try {
                    oEndUserFeedbackService.isEnabled()
                        .done(function () {  // The service is enabled
                            _model().setProperty('/showEndUserFeedback', true);
                            var endUserFeedbackConfiguration = _renderer().getEndUserFeedbackConfiguration();

                            if (_shellConfig().moveGiveFeedbackActionToShellHeader) {
                                jQuery.sap.measure.start("FLP:Shell.controller._createActionButtons", "create give feedback as shell head end item", "FLP");
                                //since the EndUserFeedback is not compatible type with shell header end item, creating here the button which will not be shown on the view and trigger its
                                //press method by a shell header end item button that was created in shell.model.js - this is done below the creation of this button
                                var tempBtn = sap.ui.getCore().byId("EndUserFeedbackHandlerBtn");

                                tempBtn.setModel(_model());
                                tempBtn.setShowAnonymous(endUserFeedbackConfiguration.showAnonymous);
                                tempBtn.setAnonymousByDefault(endUserFeedbackConfiguration.anonymousByDefault);
                                tempBtn.setShowLegalAgreement(endUserFeedbackConfiguration.showLegalAgreement);
                                tempBtn.setShowCustomUIContent(endUserFeedbackConfiguration.showCustomUIContent);
                                tempBtn.setFeedbackDialogTitle(endUserFeedbackConfiguration.feedbackDialogTitle);
                                tempBtn.setTextAreaPlaceholder(endUserFeedbackConfiguration.textAreaPlaceholder);
                                tempBtn.setAggregation("customUIContent", endUserFeedbackConfiguration.customUIContent, false);

                                oEndUserFeedbackBtn.attachPress(function () {
                                    tempBtn.firePress();
                                }); // Exception if the button does not exist

                                jQuery.sap.measure.end("FLP:Shell.controller._createActionButtons");

                            } else if (!oEndUserFeedbackBtn) {
                                oEndUserFeedbackBtn = new EndUserFeedback("EndUserFeedbackBtn", {
                                    showAnonymous: endUserFeedbackConfiguration.showAnonymous,
                                    anonymousByDefault: endUserFeedbackConfiguration.anonymousByDefault,
                                    showLegalAgreement: endUserFeedbackConfiguration.showLegalAgreement,
                                    showCustomUIContent: endUserFeedbackConfiguration.showCustomUIContent,
                                    feedbackDialogTitle: endUserFeedbackConfiguration.feedbackDialogTitle,
                                    textAreaPlaceholder: endUserFeedbackConfiguration.textAreaPlaceholder,
                                    customUIContent: endUserFeedbackConfiguration.customUIContent
                                });
                                if (bEnableHelp) {
                                    oEndUserFeedbackBtn.addStyleClass('help-id-EndUserFeedbackBtn'); // xRay help ID
                                }
                                _renderer().addShellDanglingControl(oEndUserFeedbackBtn);
                            }
                            oEndUserFeedbackBtn.setVisible(true);
                        })
                        .fail(function () { // The service is disabled
                            if (oEndUserFeedbackBtn) {
                                oEndUserFeedbackBtn.setVisible(false);
                            }
                        });
                } catch (e) {
                    jQuery.sap.log.error("EndUserFeedback adapter is not found", e.message || e);
                }
            }

            Config.on("/core/extension/EndUserFeedback").do(function (bConfigured) {
                var oEndUserFeedbackBtn = sap.ui.getCore().byId("EndUserFeedbackBtn");
                if (bConfigured) { // Create and set the End User Feedback button
                    sap.ushell.Container.getServiceAsync("EndUserFeedback").then(function (oEndUserFeedbackService) {
                        setEndUserFeedbackButton(oEndUserFeedbackService, oEndUserFeedbackBtn);
                    });
                } else if (oEndUserFeedbackBtn) { // Hide the button, if it was prevoiusly enabled
                    _model().setProperty('/showEndUserFeedback', false);
                    oEndUserFeedbackBtn.setVisible(false);
                }
            });
        },

        /**
         *
         *
         */
        _showActionsInPopOver: function (oOpenByControl) {
            var aCurrentStateActions = _model().getProperty('/currentState/actions');
            if (!this.oActionsPopover) {
                this.oActionsLayout = new sap.ui.layout.VerticalLayout();
                this.oActionsPopover = new sap.m.Popover("sapUshellActionsPopover", {//here
                    showHeader: false,
                    placement: sap.m.PlacementType.Bottom,
                    content: this.oActionsLayout
                }).addStyleClass("sapUshellPopupContainer");

            }
            this.oActionsLayout.removeAllContent();
            this._createActionButtons();
            aCurrentStateActions.forEach(function (sActionId, iIndex) {
                var oAction = sap.ui.getCore().byId(sActionId);

                if (oAction && oAction.setActionType) {
                    /*since the factory can be called many times,
                     we need to add the press handler only once.
                     the method below makes sure it is added only once per control
                     the press handler is attached to all actions, and switches the
                     viewport state to "Center" as requested by UX*/
                    //TODO: COMPLETE THIS LOGIC!!
                    //oController._addPressHandlerToActions(oCtrl);
                    this.oActionsLayout.addContent(oAction);
                    oAction.setActionType('standard');
                    oAction.addStyleClass('sapUshellStandardActionItem');
                }
            }.bind(this));
            this.oActionsPopover.setModel(_model());
            this.oActionsPopover.openBy(oOpenByControl);
        },

        _switchToMeAreaView: function (oOpenByControl, bShow) {
            // Toggle viewport
            _renderer().switchViewPortStateByControl(oOpenByControl, bShow ? "LeftCenter" : "Center");
            // recalculate items on MeArea
            _renderer().toggleOverFlowActions();
        },

        _getSearchPrefs: function () {
            function isSearchButtonEnabled () {
                try {
                    return Config.last("/core/shellHeader/headEndItems").indexOf("sf") != -1;
                } catch (err) {
                    jQuery.sap.log.debug("Shell controller._createWaitForRendererCreatedPromise: search button is not visible.");
                    return false;
                }
            }

            if (isSearchButtonEnabled()) {
                // search preferences (user profiling, concept of me)
                // entry is added async only if search is active
                sap.ui.require([
                    'sap/ushell/renderers/fiori2/search/userpref/SearchPrefs',
                    'sap/ushell/renderers/fiori2/search/SearchShellHelperAndModuleLoader'
                ], function (SearchPrefs) {
                    this._bSearchPrefsLoaded = true;
                    var searchPreferencesEntry = SearchPrefs.getEntry();
                    searchPreferencesEntry.isSearchPrefsActive().done(function (isSearchPrefsActive) {
                        if (isSearchPrefsActive) {
                            // Add search as a profile entry
                            _renderer().addUserProfilingEntry(searchPreferencesEntry);
                        }
                    }.bind(this));
                }.bind(this));
            }
        },

        exit : function () {
            if (this.oActionsDoable) {
                this.oActionsDoable.off();
            }
        }
    });

});
},
	"sap/ushell/components/shell/MeArea/MeArea.controller.js":function(){// ${copyright}
sap.ui.define([
    "sap/ushell/resources",
    "sap/m/library",
    "sap/ushell/EventHub"
], function(
    resources,
    MobileLibrary,
    EventHub
) {
    "use strict";

    /* global jQuery, sap */

    // shortcut for type from sap/m/library
    var ButtonType = MobileLibrary.ButtonType;

    var oModel = new sap.ui.model.json.JSONModel({
        actions: [],
        userPreferences: {
            entries: []
        },
        apps: {
            recentActivities: [],
            frequentActivities: []
        }
    });

    sap.ui.controller("sap.ushell.components.shell.MeArea.MeArea", {
        onInit: function () {
            var oConfig = (this.getView().getViewData() ? this.getView().getViewData().config : {}) || {};
            this.aControlsWithPressHandler = [];
            this.getView().setModel(oModel, "meAreaModel");
            this._addActionItemToOverflowSupport();
            this.oResourceBundle = resources.i18n;

            if (oConfig.enableRecentActivity && sap.ushell.Container.getRenderer("fiori2").oShellModel.getModel().getProperty("/enableTrackingActivity")) {
                this.oUserRecentsSrvc = sap.ushell.Container.getService('UserRecents');
            }
            this.lastVisited = null;
        },

        onBeforeRendering: function () {
            if (this.oUserRecentsSrvc) {
                if (!oModel.getProperty('/apps/recentActivities') || !oModel.getProperty('/apps/recentActivities').length) {
                    this.refreshRecentActivities();
                }
            }
            if (!oModel.getProperty('/apps/frequentActivities') || !oModel.getProperty('/apps/frequentActivities').length) {
                this.refreshFrequentActivities();
            }
        },

        refreshRecentActivities: function () {
            if (this.oUserRecentsSrvc) {
                this.oUserRecentsSrvc.getRecentActivity().done(function (aActivity) {
                    aActivity.forEach(function (oItem) {
                        oItem.timestamp = sap.ushell.utils.formatDate(oItem.timestamp);
                    });
                    oModel.setProperty('/apps/recentActivities', aActivity);
                });
            }
        },

        refreshFrequentActivities: function () {
            if (this.oUserRecentsSrvc) {
                this.oUserRecentsSrvc.getFrequentActivity().done(function (aActivity) {
                    oModel.setProperty('/apps/frequentActivities', aActivity);
                });
            }
        },

        createViewByName: function (oEvent, sName, sViewId) {
            var oView = sViewId ? sap.ui.getCore().byId(sViewId) : null;
            if (!oView) {
                var oSrc = oEvent.getSource(),
                    oCtx = oSrc.getBindingContext(),
                    sPath = oCtx ? oCtx.getPath() : "",
                    sViewName = sName || oCtx.getModel().getProperty(sPath + "/viewName");

                sViewId = sViewId || oCtx.getModel().getProperty(sPath + "/id");
                oView = sap.ui.view(sViewId, {
                    viewName: sViewName,
                    type: 'JS',
                    viewData: {}
                });
            }

            return oView;
        },

        logout: function () {
            sap.ui.require(['sap/m/MessageBox'],
                function (MessageBox) {
                    var oLoading = new sap.ushell.ui.launchpad.LoadingDialog({text: ""}),
                        bShowLoadingScreen = true,
                        bIsLoadingScreenShown = false,
                        oLogoutDetails = {};

                    sap.ushell.Container.getGlobalDirty().done(function (dirtyState) {
                        bShowLoadingScreen = false;
                        if (bIsLoadingScreenShown === true) {
                            oLoading.exit();
                            oLoading = new sap.ushell.ui.launchpad.LoadingDialog({text: ""});
                        }

                        var _getLogoutDetails = function (dirtyState) {
                            var oLogoutDetails = {},
                                oResourceBundle = resources.i18n;

                            if (dirtyState === sap.ushell.Container.DirtyState.DIRTY) {
                                // show warning only if it is sure that there are unsaved changes
                                oLogoutDetails.message = oResourceBundle.getText('unsaved_data_warning_popup_message');
                                oLogoutDetails.icon = MessageBox.Icon.WARNING;
                                oLogoutDetails.messageTitle = oResourceBundle.getText("unsaved_data_warning_popup_title");
                            } else {
                                // show 'normal' logout confirmation in all other cases, also if dirty state could not be determined
                                oLogoutDetails.message = oResourceBundle.getText('signoutConfirmationMsg');
                                oLogoutDetails.icon = MessageBox.Icon.QUESTION;
                                oLogoutDetails.messageTitle = oResourceBundle.getText("signoutMsgTitle");
                            }

                            return oLogoutDetails;
                        };

                        oLogoutDetails = _getLogoutDetails(dirtyState);
                        MessageBox.show(oLogoutDetails.message, oLogoutDetails.icon,
                            oLogoutDetails.messageTitle, [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                            function (oAction) {
                                if (oAction === MessageBox.Action.OK) {
                                    oLoading.openLoadingScreen();
                                    oLoading.showAppInfo(resources.i18n.getText('beforeLogoutMsg'), null);
                                    sap.ushell.Container.logout();
                                }
                            }, sap.ui.core.ElementMetadata.uid("confirm"));
                    });
                    if (bShowLoadingScreen === true) {
                        oLoading.openLoadingScreen();
                        bIsLoadingScreenShown = true;
                    }
                });
        },

        _addPressHandlerToActions: function (oControl) {
            if (this.aControlsWithPressHandler.indexOf(oControl.getId()) === -1) {
                this.aControlsWithPressHandler.push(oControl.getId());
                oControl.attachPress(function (oEvent) {
                    sap.ui.getCore().byId("viewPortContainer").switchState("Center");
                    if (oControl.getId() === "userSettingsBtn") {
                        EventHub.emit("openUserSettings", Date.now());
                    }
                });
            }
        },


        _getControlsWithPressHandler: function () {
            return this.aControlsWithPressHandler;
        },
        _addActionItemToOverflowSupport: function () {
            if (sap.m._overflowToolbarHelpers && sap.m._overflowToolbarHelpers.OverflowToolbarAssociativePopoverControls._mSupportedControls) {
                var mSupported = sap.m._overflowToolbarHelpers.OverflowToolbarAssociativePopoverControls._mSupportedControls;
                var oPrototypeToExtend = sap.m._overflowToolbarHelpers.OverflowToolbarAssociativePopoverControls.prototype;
                var aControlNamesToAdd = [
                    "sap.ushell.ui.launchpad.ActionItem",
                    "sap.ushell.ui.footerbar.AboutButton",
                    "sap.ushell.ui.footerbar.ContactSupportButton",
                    "sap.ushell.ui.footerbar.EndUserFeedback",
                    "sap.ushell.ui.footerbar.LogoutButton",
                    "sap.ushell.ui.footerbar.UserPreferencesButton",
                    "sap.m.Button"
                ];
                var fnCapitalize = function (sName) {
                    return sName.substring(0, 1).toUpperCase() + sName.substring(1);
                };
                var oSupports = {
                    canOverflow: true,
                    listenForEvents: ["press"],
                    noInvalidationProps: ["enabled", "type"]
                };
                var fnPreProcess = function (oControl) {
                    if (!oControl.mCustomStyleClassMap.sapUshellActionItem) {
                        return;
                    }
                    if (oControl.setActionType) {
                        oControl.setActionType('standard');
                    }
                    var sType = oControl.getType();

                    if (sType !== ButtonType.Accept && sType !== ButtonType.Reject) {
                        oControl.setType(ButtonType.Transparent);
                    }

                    // when icon is available - need to indent it
                    if (oControl.getIcon()) {
                        oControl.addStyleClass("sapMOTAPButtonWithIcon");
                    } else {
                        oControl.addStyleClass("sapMOTAPButtonNoIcon");
                    }
                };

                var fnPostProcess = function (oControl) {
                    if (oControl.setActionType) {
                        oControl.setActionType('action');
                    }
                };
                aControlNamesToAdd.forEach(function (sName) {
                    mSupported[sName] = oSupports;
                    var sCap = sName.split(".").map(fnCapitalize).join("");
                    var sPreProcessPrefix = '_preProcess';
                    var sPostProcessPrefix = '_postProcess';
                    oPrototypeToExtend[sPreProcessPrefix + sCap] = fnPreProcess;
                    oPrototypeToExtend[sPostProcessPrefix + sCap] = fnPostProcess;
                });
            }
        },

        /**
         * Use to store the last visited url that was clicked form the TabBar control
         * @param {string} sUrl the url that was used in the navigation
         */
        setLastVisited: function (sUrl) {
            this.lastVisited = sUrl;
        },

        updateScrollBar: function (hash) {
            /**
             When navigating from one of the entries (recent or frequent apps) the TabBar remembers the last scroll
             position it was in.
             In case additional navigation took place (i.e the hash has changed) - we reset the TabBar control to point
             to the first entry in the Recent Activities Tab.
             */
            if (this.lastVisited && this.lastVisited != "#" + hash) {
                //Scroll to top:
                jQuery('.sapUshellViewPortLeft').scrollTop(0);

                // setting the Recent-Activity Tab as selected
                sap.ui.getCore().byId('meAreaIconTabBar').setSelectedKey("sapUshellIconTabBarrecentActivities");

                // setting first Recent-Activity item to set focus on first item again
                // otherwise every time me-area will opened there will be a scroll jump
                var oListRecent = sap.ui.getCore().byId('sapUshellActivityListrecentActivities'),
                    aListItems = oListRecent.getItems();
                if (aListItems && aListItems.length > 0) {
                    sap.ui.getCore().byId('sapUshellActivityListrecentActivities').setSelectedItem(aListItems[0], true);
                }

                // reset the lastVisited index
                this.lastVisited = null;
            }
        },

        onExit: function () {
            this.getView().aDanglingControls.forEach(function (oControl) {
                if (oControl.destroyContent) {
                    oControl.destroyContent();
                }
                oControl.destroy();
            });
        }
    });


}, /* bExport= */ false);
},
	"sap/ushell/components/shell/MeArea/MeArea.view.js":function(){// ${copyright}
sap.ui.define([
    "sap/ushell/services/AppType",
    "sap/m/Button",
    "sap/m/List",
    "sap/m/Text",
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/m/Image",
    "sap/m/Popover",
    "sap/m/OverflowToolbar",
    "sap/m/ScrollContainer",
    "sap/ushell/renderers/fiori2/AccessKeysHandler",
    "sap/ushell/resources",
    "sap/ushell/ui/launchpad/UserStatusItem",
    "sap/ushell/ui/launchpad/AccessibilityCustomData",
    "sap/m/library",
    "sap/ui/Device",
    "sap/ui/core/Icon",
    "sap/ui/core/IconPool",
    "sap/ui/core/service/ServiceFactoryRegistry"
], function (appType, Button, List, Text, VBox, HBox, Image, Popover, OverflowToolbar, ScrollContainer, AccessKeysHandler, resources, UserStatusItem, AccessibilityCustomData, mobileLibrary, Device, Icon, IconPool, ServiceFactoryRegistry) {
    "use strict";

    /*global jQuery, sap, document, self, hasher*/

    // shortcuts for types from sap/m/library and sap/ui/core/library
    var BackgroundDesign = mobileLibrary.BackgroundDesign,
        ButtonType = mobileLibrary.ButtonType,
        ListSeparators = mobileLibrary.ListSeparators,
        ListType = mobileLibrary.ListType,
        PlacementType = mobileLibrary.PlacementType,
        ToolbarDesign = mobileLibrary.ToolbarDesign;

    sap.ui.jsview("sap.ushell.components.shell.MeArea.MeArea", {

        createContent: function (oController) {
            this.addStyleClass('sapUshellMeAreaView');
            this.aDanglingControls = [];

            var sUserName = sap.ushell.Container.getUser().getFullName(),
                oPopover,
                translationBundle = resources.i18n,
                oConfig = (this.getViewData() ? this.getViewData().config : {}) || {},
                sCurrentShellState = oConfig.appState,
                bCreateDetachedLogoutButton = (sCurrentShellState === 'embedded' || sCurrentShellState === 'embedded-home' || sCurrentShellState === 'standalone' || sCurrentShellState === 'blank-home'  || sCurrentShellState === 'blank'),
                aUserStatusItems,
                oService = ServiceFactoryRegistry.get("sap.ushell.ui5service.UserStatus"),
                fnStatusChangeHandle;
            if (oService) {
                var oServiceInstance = oService.createInstance();

                fnStatusChangeHandle = function (newStatus) {
                    oServiceInstance.then(
                        function (oService) {
                            oService.setStatus(newStatus);
                            oPopover.close();
                        }
                    );
                };
            }

            aUserStatusItems = [
                new UserStatusItem({
                    status: UserStatusItem.prototype.STATUS_ENUM.AVAILABLE,
                    id: "userStatusItem1",
                    isOpener: false,
                    press: function (oEvent) {
                        fnStatusChangeHandle(sap.ushell.ui5service.UserStatus.prototype.AvailableStatus.AVAILABLE);
                    }.bind(this)
                }).addStyleClass('sapUserStatusContainer'),
                new UserStatusItem({
                    status: UserStatusItem.prototype.STATUS_ENUM.AWAY,
                    id: "userStatusItem2",
                    isOpener: false,
                    press: function (oEvent) {
                        fnStatusChangeHandle(sap.ushell.ui5service.UserStatus.prototype.AvailableStatus.AWAY);
                    }.bind(this)
                }).addStyleClass('sapUserStatusContainer'),
                new UserStatusItem({
                    status: UserStatusItem.prototype.STATUS_ENUM.BUSY,
                    id: "userStatusItem3",
                    isOpener: false,
                    press: function (oEvent) {
                        fnStatusChangeHandle(sap.ushell.ui5service.UserStatus.prototype.AvailableStatus.BUSY);
                    }.bind(this)
                }).addStyleClass('sapUserStatusContainer'),
                new UserStatusItem({
                    status: UserStatusItem.prototype.STATUS_ENUM.APPEAR_OFFLINE,
                    id: "userStatusItem4",
                    isOpener: false,
                    press: function (oEvent) {
                        fnStatusChangeHandle(sap.ushell.ui5service.UserStatus.prototype.AvailableStatus.APPEAR_OFFLINE);
                    }.bind(this)
                }).addStyleClass('sapUserStatusContainer')

            ];

            if (!oConfig.disableSignOut) {
                aUserStatusItems.push(new UserStatusItem({
                    status: UserStatusItem.prototype.STATUS_ENUM.SIGNOUT,
                    id: "userStatusLogout",
                    isOpener: false,
                    press: [oController.logout, oController]
                }).addStyleClass('sapUserStatusSignOutContainer'));
            }

            var oUserStatusItemList = new List({
                id: "sapUshellUserStatusItemList",
                showSeparators: "None",
                items: aUserStatusItems
            });
            //"aria-labelledBy", cannot be added in the constructor
            oUserStatusItemList.addCustomData(new AccessibilityCustomData({
                key: "aria-labelledBy",
                value: "userStatusItem1",
                writeToDom: true
            }));

            oPopover = new Popover("statuses", {
                placement: PlacementType.Bottom,
                showArrow: false,
                showHeader: false,
                content: oUserStatusItemList
            }).addStyleClass('sapUserStatusPopOver');
            oPopover.addStyleClass("sapContrastPlus");
            oPopover.setOffsetX(-3);

            aUserStatusItems = [
                new Text({text: sUserName}).addStyleClass('sapUshellMeAreaUserName')
            ];

            var statusOpener = new UserStatusItem({
                id: "userStatusOpener",
                visible: {
                    parts: ["/userStatusEnabled", "/userStatusUserEnabled"],
                    formatter: function (bStatusEnabled, bUserStatusEnabled) {
                        if (bStatusEnabled && bUserStatusEnabled) {
                            return true;
                        }
                        return false;
                    }.bind(this)
                },
                status: {
                    path: "/userStatus",
                    formatter: function (sUserStatus) {
                        return UserStatusItem.prototype.STATUS_ENUM[sUserStatus];
                    }.bind(this)
                },
                tooltip: translationBundle.getText("userStatus_tooltip"),
                image: IconPool.getIconURI("account"),
                press: function (oEvent) {
                    var oButton = sap.ui.getCore().byId(oEvent.mParameters.id);
                    if (oPopover.isOpen()) {
                        oPopover.close();
                    } else {
                        oPopover.openBy(oButton);
                    }
                }.bind(this),
                contentList: oPopover
            }).addStyleClass('sapUserStatusOpener');

            statusOpener.addCustomData(new AccessibilityCustomData({
                key: "tabindex",
                value: "0",
                writeToDom: true
            }));
            //"aria-label", cannot be added in the constructor
            statusOpener.addCustomData(new AccessibilityCustomData({
                key: "aria-label",
                value: resources.i18n.getText("OnlineStatus") + " " + translationBundle.getText("userStatus_tooltip"),
                writeToDom: true
            }));
            //"role", cannot be added in the constructor
            statusOpener.addCustomData(new AccessibilityCustomData({
                key: "role",
                value: "listbox",
                writeToDom: true
            }));
            var listStatusOpener = new List({
                items:[statusOpener],
                backgroundDesign: BackgroundDesign.Transparent
            });
            aUserStatusItems.push(listStatusOpener);

            if (!oConfig.disableSignOut) {
                var oLogoutBtn;
                if (!bCreateDetachedLogoutButton) {
                    oLogoutBtn = new Button("logoutBtn", {
                        visible: {
                            parts: ["/userStatusEnabled", "/userStatusUserEnabled"],
                            formatter: function (bStatusEnabled, bUserStatusEnabled) {
                                if (bStatusEnabled && bUserStatusEnabled) {
                                    return false;
                                }
                                return true;
                            }.bind(this)
                        },
                        type: ButtonType.Transparent,
                        icon: 'sap-icon://log',
                        text: resources.i18n.getText("signoutBtn_title"),
                        press: [oController.logout, oController]
                    });
                    aUserStatusItems.push(oLogoutBtn);
                } else {
                    oLogoutBtn = new sap.ushell.ui.launchpad.ActionItem("logoutBtn", {
                        visible: true,
                        type: ButtonType.Transparent,
                        icon: 'sap-icon://log',
                        text: resources.i18n.getText("signoutBtn_title"),
                        press: [oController.logout, oController]
                    });
                }
            }

            var oUserName = new VBox({
                items: [aUserStatusItems]
            }).addStyleClass("sapUshellUserArea");

            var oUser = sap.ushell.Container.getUser(),
                userImage = oUser.getImage(),
                userBoxItem;

            if (!userImage) {
                userBoxItem = this.createPlaceHolderIcon();
            } else {
                userBoxItem = this.createNewImage();
            }

            userBoxItem.addStyleClass("sapUshellMeAreaUserImage");

            //Me Area Icon (big icon above recent activity)
            var oUserHBox = new HBox({
                items: [
                    userBoxItem,
                    oUserName
                ]
            });

            oUser.attachOnSetImage(this._updateUserImage.bind({
                origScope: this,
                oUserHBox: oUserHBox,
                userBoxItem: userBoxItem
            }));

            oUserHBox.addStyleClass('sapUshellMeAreaUserInfo');
            oUserHBox.addStyleClass('sapContrastPlus');
            oUserHBox.addEventDelegate({
                onsapskipback: function (oEvent) {
                    oEvent.preventDefault();
                    AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                    AccessKeysHandler.sendFocusBackToShell(oEvent);
                },
                onsaptabprevious: function (oEvent) {
                    oEvent.preventDefault();
                    AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                    AccessKeysHandler.sendFocusBackToShell(oEvent);
                }
            });

            var oActionsHBox = new OverflowToolbar({
                id: "overflowActions",
                design: ToolbarDesign.Transparent,
                content: {
                    path: "/currentState/actions",
                    factory: function (sId, oContext) {
                        var oCtrl = sap.ui.getCore().byId(oContext.getObject());
                        if (oCtrl) {
                            var bIsActionOutOfMeArea = oCtrl.isA("sap.ushell.ui.shell.ShellHeadItem");
                            if (bIsActionOutOfMeArea) {
                                return undefined;
                            }

                            if (oCtrl.setActionType) {
                                oCtrl.setActionType("action");
                                oCtrl.addStyleClass('sapContrastPlus');
                            }
                            /*since the factory can be called many times,
                             we need to add the press handler only once.
                             the method below makes sure it is added only once per control
                             the press handler is attached to all actions, and switches the
                             viewport state to "Center" as requested by UX*/
                            oController._addPressHandlerToActions(oCtrl);
                        }
                        return oCtrl;
                    }
                }
            });

            //since we customized the control items, we need to override this priveate method, as suggested in
            //internal ticket #1670374902 by UI5 colleague Vladislav Tasev.
            oActionsHBox._getOverflowButtonSize = function () {
                // item width is 4.65rem + 0.25rem left margin + 0.25rem right margin => 5.15rem=82.4px
                return 82.4;
            };
            //"aria-label"
            oActionsHBox.addCustomData(new AccessibilityCustomData({
                key: "aria-label",
                value: resources.i18n.getText("overflowActions_AriaLabel"),
                writeToDom: true
            }));

            if (oActionsHBox._getOverflowButton) {
                var overflowButton = oActionsHBox._getOverflowButton();
                if (overflowButton) {
                    var orig = overflowButton.onAfterRendering;
                    overflowButton.onAfterRendering = function () {
                        if (orig) {
                            orig.apply(this, arguments);
                        }
                        this.addStyleClass('sapUshellActionItem').addStyleClass('sapContrastPlus');
                        this.setText(resources.i18n.getText('meAreaMoreActions'));
                    };
                }
            }

            oActionsHBox.updateAggregation = function (sName) {
                /*jslint nomen: true */
                var oBindingInfo = this.mBindingInfos[sName],
                    oAggregationInfo = this.getMetadata().getJSONKeys()[sName],
                    oClone;

                jQuery.each(this[oAggregationInfo._sGetter](), jQuery.proxy(function (i, v) {
                    this[oAggregationInfo._sRemoveMutator](v);
                }, this));
                jQuery.each(oBindingInfo.binding.getContexts(), jQuery.proxy(function (i, v) {
                    // NOTE: factory returns undefined if the control should
                    // not be in the me area.
                    oClone = oBindingInfo.factory(this.getId() + "-" + i, v);

                    if (oClone) {
                        this[oAggregationInfo._sMutator](oClone.setBindingContext(v, oBindingInfo.model));
                    }
                }, this));
            };

            var oMeAreaContentVBox = new VBox("sapUshellMeAreaContent", {});
            this.actionBox = oActionsHBox;
            oMeAreaContentVBox.addItem(oUserHBox);
            oMeAreaContentVBox.addItem(oActionsHBox);

            if (oConfig.enableRecentActivity) {
                var bShowRecentActivity = sap.ushell.Container.getRenderer("fiori2").oShellModel.getModel().getProperty('/currentState/showRecentActivity');
                if (bShowRecentActivity === true) {
                    var oCreateIconTabBarPromise = this.createIconTabBar(oController);
                    oCreateIconTabBarPromise.done(function (oIconTabBar) {
                        oMeAreaContentVBox.addItem(oIconTabBar);
                        // if the user disable recent activities feature the container will be hidden.
                        var bIsEnableTrackingActivity = sap.ushell.Container.getRenderer("fiori2").oShellModel.getModel().getProperty("/enableTrackingActivity");
                        oIconTabBar.setVisible(bIsEnableTrackingActivity);
                        //this.handleAccessabilityWhenRecentActivitesChange(oActionsHBox,bIsEnableTrackingActivity);
                    });
                }
            }
            this.actionBox.addEventDelegate({
                onsaptabnext: function (oEvent) {
                    var oOriginalElement = oEvent.originalEvent,
                        oSourceElement = oOriginalElement.srcElement,
                        lastElementId = jQuery('.sapUshellActionItem:last')[0].id,
                        isLastElement,isIconTabBarVisible;
                    isIconTabBarVisible = sap.ui.getCore().byId('meAreaIconTabBar').getVisible();
                    // Check if the element currently in focus is the last action item, if yes go to top
                    isLastElement = lastElementId === oSourceElement.id;
                    // if the iconbar doesn't visible forward the focus
                    if (isLastElement === true && !isIconTabBarVisible) {
                        oEvent.preventDefault();
                        AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                        AccessKeysHandler.sendFocusBackToShell(oEvent);
                    }
                },
                // When using F6 - the focus should go from the ActionsHBox's header straight to the MeArea header icon
                onsapskipforward: function (oEvent) {
                    var isIconTabBarVisible= sap.ui.getCore().byId('meAreaIconTabBar').getVisible();
                    // if the iconbar doesn't visible forward the focus
                    if (!isIconTabBarVisible) {
                        oEvent.preventDefault();
                        AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                        AccessKeysHandler.sendFocusBackToShell(oEvent);
                    }
                }
            });


            return new ScrollContainer({
                vertical: true,
                horizontal: false,
                height: "100%",
                content: oMeAreaContentVBox
            });
        },

        createIconTabBar: function (oController) {
            var oResultDeferred = new jQuery.Deferred(),
                that = this,
                oIconTabBar,
                origTabBarAfterRendering,
                oTabBarHeader;

            sap.ui.require(['sap/m/IconTabBar',
                            'sap/m/CustomListItem',
                            'sap/m/IconTabFilter',
                            'sap/m/Text',
                            'sap/m/HBox'],
                function (IconTabBar, CustomListItem, IconTabFilter, Text, HBox) {

                    oIconTabBar = new IconTabBar('meAreaIconTabBar', {
                        backgroundDesign: BackgroundDesign.Transparent,
                        expandable: false,
                        items: [that.createIconTab("recentActivities", true, oController, CustomListItem, IconTabFilter, Text, HBox), //Recent activities show timestamp in info property
                                that.createIconTab("frequentActivities", false, oController, CustomListItem, IconTabFilter, Text, HBox)] //Frequent activities have no info
                    }).addStyleClass('sapUshellMeAreaTabBar');

                    oIconTabBar.addEventDelegate({
                        onsaptabnext: function (oEvent) {
                            var oOriginalElement = oEvent.originalEvent,
                                oSourceElement = oOriginalElement.srcElement,
                                aClassList = oSourceElement.classList,
                                bIncludesClass;

                            // Check if the element currently in focus is an actual item in a list such as the Recently Used list
                            bIncludesClass = jQuery.inArray('sapUshellMeAreaActivityItem', aClassList) > -1;
                            if (bIncludesClass === true) {
                                oEvent.preventDefault();
                                AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                                AccessKeysHandler.sendFocusBackToShell(oEvent);
                            }
                        },
                        // When using F6 - the focus should go from the IconTabBar's header (i.e. the "Recently Used" text) straight to the MeArea header icon
                        onsapskipforward: function (oEvent) {
                            oEvent.preventDefault();
                            AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                            AccessKeysHandler.sendFocusBackToShell(oEvent);
                        }
                    });

                    origTabBarAfterRendering = oIconTabBar.onAfterRendering;
                    oIconTabBar.onAfterRendering = function () {
                        if (origTabBarAfterRendering) {
                            origTabBarAfterRendering.apply(that, arguments);
                        }
                        oTabBarHeader = sap.ui.getCore().byId('meAreaIconTabBar--header');
                        if (oTabBarHeader) {
                            oTabBarHeader.addStyleClass('sapContrastPlus');
                            oTabBarHeader.addStyleClass('sapUshellTabBarHeader');
                        }
                    };
                    oResultDeferred.resolve(oIconTabBar);
            });
            return oResultDeferred.promise();
        },

        //This function creates each tab in the IconTabBar.
        //The parameter iconTabName will be used for IDs, for the path in the model and to get the
        //strings from the resource bundle (both the tab and the no-data strings). So they all have to match.
        //showInfo will control if to use the info property to present timestamp.
        createIconTab: function (iconTabName, showInfo, oController, CustomListItem, IconTabFilter, Text, HBox) {
            var oActivityTemplateFunction,
                sIcon,
                sTitle,
                sDescription,
                oLi,
                oIconTabFilter,
                oActivityList,
                oModel,
                sPath,
                oViewPort;

            oActivityTemplateFunction = function (sId, oContext) {
                sIcon = oContext.getProperty("icon");
                sTitle = oContext.getProperty("title");

                sDescription = appType.getDisplayName(oContext.getProperty("appType"));

                var oTitle = new Text({
                        text: sTitle
                    }).addStyleClass('sapUshellMeAreaActivityItemTitle'),

                    oIcon = sIcon ? new Icon({
                        src: sIcon
                    }).addStyleClass('sapUshellMeAreaActivityItemIcon') : null,

                    oDescription = new Text({
                        text: sDescription
                    }).addStyleClass('sapUshellMeAreaActivityItemDescription'),

                    oInfo = new Text({
                        text: showInfo ? oContext.getProperty("timestamp") : ""
                    }).addStyleClass('sapUshellMeAreaActivityItemInfo'),

                    oHBox = new HBox({
                        items: oIcon ? [oIcon, oDescription] : [oDescription],
                        justifyContent: "SpaceBetween"
                    }),

                    oContainer = new HBox({
                        items: showInfo ? [oHBox, oInfo] : [oHBox],
                        justifyContent: "SpaceBetween"
                    }).addStyleClass('sapUshellMeAreaActivityItemContainer');

                oLi = new CustomListItem({
                    content: [oTitle, oContainer],
                    type: ListType.Active
                }).addStyleClass('sapUshellMeAreaActivityItem');

                //"aria-label", cannot be added in the constructor
                oLi.addCustomData(new AccessibilityCustomData({
                    key: "aria-describedby",
                    value: oIconTabFilter.getId(),
                    writeToDom: true
                }));

                return oLi;
            };

            oIconTabFilter = new IconTabFilter({
                id: "sapUshellIconTabBar" + iconTabName,
                text: resources.i18n.getText(iconTabName)
            });

            oActivityList = new List({
                id: "sapUshellActivityList" + iconTabName,
                showSeparators: ListSeparators.All,
                items: {
                    path: "meAreaModel>/apps/" + iconTabName,
                    factory: oActivityTemplateFunction.bind(this)
                },
                noDataText: resources.i18n.getText(iconTabName + 'NoDataText'),
                //mode: sap.m.ListMode.SingleSelectMaster,
                itemPress: function (oEvent) {
                    oModel = this.getModel('meAreaModel');
                    oViewPort = sap.ui.getCore().byId("viewPortContainer");

                    if (oViewPort) {//added in order to make loading dialog open after view switch
                        oViewPort.switchState("Center");
                    }

                    sPath = oEvent.getParameter('listItem').getBindingContextPath();
                    oController.setLastVisited(oModel.getProperty(sPath).url);
                    setTimeout(function () {//timeOut is needed in cases in which the app loads fast. This way we get smoother navigation
                        if (oModel.getProperty(sPath).url[0] === '#') {
                            hasher.setHash(oModel.getProperty(sPath).url);
                        } else {
                            var oConfig = this.getViewData() ? this.getViewData().config : {};
                            if (oConfig.enableRecentActivity && oConfig.enableRecentActivityLogging) {
                                // add the URL to recent activity log (required to log URLs that are launched from the recent activity list)
                                var oRecentEntry = {
                                    title: oModel.getProperty(sPath).title,
                                    appType: "App",
                                    url: oModel.getProperty(sPath).url,
                                    appId: oModel.getProperty(sPath).url
                                };
                                sap.ushell.Container.getRenderer("fiori2").logRecentActivity(oRecentEntry);
                            }

                            window.open(oModel.getProperty(sPath).url, '_blank');
                        }
                    }, 200);
                }
            });
            oIconTabFilter.addContent(oActivityList);
            return oIconTabFilter;
        },

        onViewStateShow: function () {
            this.getController().refreshRecentActivities();
            this.getController().refreshFrequentActivities();
            if (this.actionBox) {
                this.actionBox.updateAggregation("content");
            }
            this.getController().updateScrollBar(hasher.getHash());
        },

        createNewImage: function () {
            return  new Image({
                src: '{/userImage/personPlaceHolder}'
            });
        },

        createPlaceHolderIcon: function () {
            return  new Icon({
                src: '{/userImage/personPlaceHolder}',
                size: '4rem'
            });
        },

        getControllerName: function () {
            return "sap.ushell.components.shell.MeArea.MeArea";
        },

        _updateUserImage: function (oData) {
            var sUserImageUri = (typeof oData) === 'string' ? oData : oData.mParameters;
            this.oUserHBox.removeItem(this.userBoxItem);
            if ((typeof sUserImageUri) === 'string') {
                this.userBoxItem = this.origScope.createNewImage();
            } else {
                this.userBoxItem = this.origScope.createPlaceHolderIcon();
            }
           if (this.oUserHBox) {
               this.oUserHBox.insertItem( this.userBoxItem , 0);
               if (this.userBoxItem) {
                   this.userBoxItem.addStyleClass("sapUshellMeAreaUserImage");
               }
           }
        }

    });

}, /* bExport= */ false);
},
	"sap/ushell/components/shell/MeArea/fiori3/Component.js":function(){// ${copyright}
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/Config",
    "sap/ushell/components/shell/MeArea/fiori3/MeArea.controller"
], function (
    UIComponent,
    AppLifeCycle,
    Config,
    MeAreaController
) {
    "use strict";

    var _oRenderer;
    // Shortcut to sap.ushell.Container.getRenderer("fiori2")
    function _renderer () {
        if (!_oRenderer) {
            _oRenderer = sap.ushell.Container.getRenderer("fiori2");
        }
        return _oRenderer;
    }

    // MeArea Component
    return UIComponent.extend("sap.ushell.components.shell.MeArea.Component", {

        metadata: {
            version: "${version}",
            library: "sap.ushell.components.shell.MeArea",
            dependencies: {
                libs: ["sap.m"]
            }
        },

        createContent: function () {
            this._bIsMeAreaCreated = false;

            this.oMeAreaController = new MeAreaController();
            this.oMeAreaController.onInit();

            var that = this;

            // In state blank when no Action Items do not display MeArea.
            AppLifeCycle.getElementsModel().createTriggers([{
                fnRegister: function () {
                    if (!that.oActionsDoable) {
                        that.oActionsDoable = Config.on("/core/shell/model/currentState/actions").do(function (aActions) {
                            if (aActions && aActions.length > 0) {
                                _renderer().showHeaderEndItem(["meAreaHeaderButton"], true);
                            } else {
                                _renderer().hideHeaderEndItem(["meAreaHeaderButton"], true);
                            }
                        });
                    }
                },
                fnUnRegister: function () {
                    if (!that.oActionsDoable) {
                        that.oActionsDoable.off();
                        that.oActionsDoable = null;
                    }
                }
            }], false, ["blank-home", "blank"]);

            sap.ui.getCore().getEventBus().publish("shell", "meAreaCompLoaded", { delay: 0 });
        },

        exit : function () {
            if (this.oActionsDoable) {
                this.oActionsDoable.off();
            }
            this.oEventListener.off();
            this.oMeAreaController.onExit();
        }
    });

});
},
	"sap/ushell/components/shell/MeArea/fiori3/MeArea.controller.js":function(){// ${copyright}

sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/m/ButtonType",
    "sap/m/ListType",
    "sap/m/StandardListItem",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/ushell/ui/footerbar/AboutButton",
    "sap/ushell/ui/footerbar/ContactSupportButton",
    "sap/ushell/ui/footerbar/EndUserFeedback",
    "sap/ushell/ui/launchpad/ActionItem",
    "sap/ushell/ui/fiori3/QuickAccess",
    "sap/ushell/EventHub"
], function (
        jQuery,
        Controller,
        Device,
        JSONModel,
        ButtonType,
        ListType,
        StandardListItem,
        AppLifeCycle,
        Config,
        resources,
        AboutButton,
        ContactSupportButton,
        EndUserFeedback,
        ActionItem,
        QuickAccess,
        EventHub
    ) {
    "use strict";

    var _oRenderer;
    // Shortcut to sap.ushell.Container.getRenderer("fiori2")
    function _renderer () {
        if (!_oRenderer) {
            _oRenderer = sap.ushell.Container.getRenderer("fiori2");
        }
        return _oRenderer;
    }

    // Shortcut to sap.ushell.Container.getRenderer("fiori2").getShellConfig()
    function _shellConfig () {
        return _renderer().getShellConfig();
    }

    // Shortcut to AppLifeCycle.getElementsModel().getModel()
    function _model () {
        return AppLifeCycle.getElementsModel().getModel();
    }

    function isActionExist (sActionId) {
        if (!sap.ui.getCore().byId(sActionId)) {
            jQuery.sap.log.debug("Could not render ActionItem because it was not created: " + sActionId);
            return false;
        }
        return true;
    }

    return Controller.extend("sap.ushell.components.shell.MeArea.fiori3.MeArea", {
        _aDanglingControl: [],
        _aDoables: [],

        onInit: function () {
            var that = this;

            var oConfig = _shellConfig();
            this._createActionButtons(oConfig);

            var aCreatedActions = Config.last("/core/shell/model/currentState/actions").filter(isActionExist);
            this.oModel = new JSONModel({
                actions: aCreatedActions,
                userName: sap.ushell.Container.getUser().getFullName()
            });
            this._aDoables.push(Config.on("/core/shell/model/currentState/actions").do(function (aActions) {
                var aFilteredActions = aActions.filter(isActionExist);
                that.getModel().setProperty("/actions", aFilteredActions);
            }));

            this._aDoables.push(EventHub.on("showMeArea").do(function (bShow) {
                var oPopover = sap.ui.getCore().byId("sapUshellMeAreaPopover");
                if (oPopover && oPopover.isOpen() || !bShow) {
                    that._toggleMeAreaPopover(false);
                } else {
                    that._toggleMeAreaPopover(true);
                }
            }));
        },

        onExit: function () {
            this._destroyDanglingControls();
            this._aDoables.forEach(function (oDoable) {
                oDoable.off();
            });
            this._aDanglingControl = [];
            this._aDoables = [];

            var oPopover = sap.ui.getCore().byId("sapUshellMeAreaPopover");
            if (oPopover) {
                oPopover.destroy();
            }
        },

        getModel: function () {
            return this.oModel;
        },

        _createActionButtons: function (oConfig) {
            var bEnableHelp = Config.last("/core/extension/enableHelp");

            this._createAboutButton(bEnableHelp);

            if (oConfig.enablePersonalization !== false && !oConfig.moveAppFinderActionToShellHeader) {
                this._createAppFinderButton(oConfig, bEnableHelp);
            }

            //in case the user setting button should move to the shell header, it was already created by header
            //otherwise, create it as an actionItem for MeArea
            if (!oConfig.moveUserSettingsActionToShellHeader) {
                this._createSettingsButton(bEnableHelp);
            }

            // Only when the contact support button has to be shown in the MeArea
            if (!oConfig.moveContactSupportActionToShellHeader) {
                this._createSupportTicketButton(bEnableHelp);
            }

            this._createEndUserFeedbackButton(oConfig, bEnableHelp);

            if (oConfig.enableRecentActivity && Config.last("/core/shell/model/currentState/showRecentActivity")) {
                this._createRecentActivitiesButton();
                this._createFrequentActivitiesButton();
            }

            if (!oConfig.disableSignOut) {
                this._createLogoutButton();
            }
        },

        _createAppFinderButton: function (oConfig, bEnableHelp) {
            if (sap.ui.getCore().byId("openCatalogBtn")) {
                return;
            }
            var pressAppFinder = function () {
                sap.ushell.Container.getServiceAsync("URLParsing").then(
                    function (oUrlParser) {
                        var oHash;
                        var sAppFinderHash = "#Shell-home&/appFinder/catalog";
                        if (oUrlParser) {
                            oHash = oUrlParser.parseShellHash(window.hasher.getHash());
                            oHash.action = "appfinder";
                            oHash.semanticObject = "Shell";
                            sAppFinderHash = "#" + oUrlParser.constructShellHash(oHash);
                        }
                        // perform the navigation only after the viewport animation ends and the center vireport is active
                        setTimeout(function () {
                            sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(
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
            };

            var oOpenCatalogItem = new ActionItem("openCatalogBtn", {
                text: resources.i18n.getText("open_appFinderBtn"),
                icon: "sap-icon://sys-find",
                visible: !oConfig.disableAppFinder, // Todo remove from model???
                press: pressAppFinder,
                actionType: "action"
            });
            if (bEnableHelp) {
                oOpenCatalogItem.addStyleClass("help-id-openCatalogActionItem"); // xRay help ID
            }
            this._addDanglingControl(oOpenCatalogItem);
        },

        _createAboutButton: function (bEnableHelp) {
            if (!sap.ui.getCore().byId("aboutBtn")) {
                var oAboutButton = new AboutButton("aboutBtn");
                if (bEnableHelp) {
                    oAboutButton.addStyleClass("help-id-aboutBtn"); // xRay help ID
                }
                this._addDanglingControl(oAboutButton);
            }
        },

        _createSettingsButton: function (bEnableHelp) {
            var sId = "userSettingsBtn";
            if (!sap.ui.getCore().byId(sId)) {
                var oUserPrefButton = new ActionItem(sId, {
                    text: resources.i18n.getText("userSettings"),
                    icon: "sap-icon://action-settings",
                    press: function () {
                        EventHub.emit("openUserSettings", Date.now());
                    }
                });
                if (bEnableHelp) {
                    oUserPrefButton.addStyleClass("help-id-loginDetails"); // xRay help ID
                }
                this._addDanglingControl(oUserPrefButton);
            }
        },

        _createSupportTicketButton: function (bEnableHelp) {
            var that = this;
            //Create button on demand
            Config.on("/core/extension/SupportTicket").do(function (bConfigured) {
                    // 1) false and no button : do nothing
                    // 2) false and the button exists: probably visible, set visibility to false
                    // 3) true: create the button and set visibility to true
                    var sId = "ContactSupportBtn";
                    var oContactSupport = sap.ui.getCore().byId(sId);
                    if (bConfigured && !oContactSupport) {
                        oContactSupport = new ContactSupportButton(sId);
                        that._addDanglingControl(oContactSupport);
                        if (bEnableHelp) {
                            oContactSupport.addStyleClass("help-id-contactSupportBtn"); // xRay help ID
                        }
                    }
                    if (bConfigured) {
                        _renderer().showActionButton(sId);
                    } else {
                        _renderer().hideActionButton(sId);
                    }
                }
            );
        },
        _createEndUserFeedbackButton: function (oConfig, bEnableHelp) {
            var sId = "EndUserFeedbackBtn";
            var oEndUserFeedbackBtn = sap.ui.getCore().byId(sId);
            if (!oEndUserFeedbackBtn) {
                var endUserFeedbackConfiguration = _renderer().getEndUserFeedbackConfiguration();
                oEndUserFeedbackBtn = new EndUserFeedback(sId, {
                    showAnonymous: endUserFeedbackConfiguration.showAnonymous,
                    anonymousByDefault: endUserFeedbackConfiguration.anonymousByDefault,
                    showLegalAgreement: endUserFeedbackConfiguration.showLegalAgreement,
                    showCustomUIContent: endUserFeedbackConfiguration.showCustomUIContent,
                    feedbackDialogTitle: endUserFeedbackConfiguration.feedbackDialogTitle,
                    textAreaPlaceholder: endUserFeedbackConfiguration.textAreaPlaceholder,
                    customUIContent: endUserFeedbackConfiguration.customUIContent
                });
                if (bEnableHelp) {
                    oEndUserFeedbackBtn.addStyleClass("help-id-EndUserFeedbackBtn"); // xRay help ID
                }
                oEndUserFeedbackBtn.setModel(_model());
                this._addDanglingControl(oEndUserFeedbackBtn);
            }
            this._setupEndUserFeedbackButton(oConfig);
        },

        _setupEndUserFeedbackButton: function (oConfig) {
            var sId = "EndUserFeedbackBtn";

            Config.emit("/core/shell/model/showEndUserFeedback", false);

            function setEndUserFeedbackButton (oEndUserFeedbackService, oEndUserFeedbackBtn) {
                try {
                    oEndUserFeedbackService.isEnabled()
                        .done(function () {  // The service is enabled
                            Config.emit("/core/shell/model/showEndUserFeedback", true);
                            var endUserFeedbackConfiguration = _renderer().getEndUserFeedbackConfiguration();

                            if (oConfig.moveGiveFeedbackActionToShellHeader) {
                                jQuery.sap.measure.start("FLP:Shell.controller._createActionButtons", "create give feedback as shell head end item", "FLP");
                                // since the EndUserFeedback is not compatible type with shell header end item,
                                // create here the button which will not be shown on the view and trigger its
                                // press method by a shell header end item button that was created in ControlManager.js
                                var tempBtn = sap.ui.getCore().byId("EndUserFeedbackHandlerBtn");
                                if (tempBtn) {
                                    tempBtn.setModel(_model());
                                    tempBtn.setShowAnonymous(endUserFeedbackConfiguration.showAnonymous);
                                    tempBtn.setAnonymousByDefault(endUserFeedbackConfiguration.anonymousByDefault);
                                    tempBtn.setShowLegalAgreement(endUserFeedbackConfiguration.showLegalAgreement);
                                    tempBtn.setShowCustomUIContent(endUserFeedbackConfiguration.showCustomUIContent);
                                    tempBtn.setFeedbackDialogTitle(endUserFeedbackConfiguration.feedbackDialogTitle);
                                    tempBtn.setTextAreaPlaceholder(endUserFeedbackConfiguration.textAreaPlaceholder);
                                    tempBtn.setAggregation("customUIContent", endUserFeedbackConfiguration.customUIContent, false);

                                    oEndUserFeedbackBtn.attachPress(function () {
                                        tempBtn.firePress();
                                    }); // Exception if the button does not exist
                                }

                                jQuery.sap.measure.end("FLP:Shell.controller._createActionButtons");

                            }
                            oEndUserFeedbackBtn.setVisible(true);
                            _renderer().showActionButton(sId);
                        })
                        .fail(function () { // The service is disabled
                            _renderer().hideActionButton(sId);
                        });
                } catch (e) {
                    jQuery.sap.log.error("EndUserFeedback adapter is not found", e.message || e);
                }
            }

            Config.on("/core/extension/EndUserFeedback").do(function (bConfigured) {
                var oEndUserFeedbackBtn = sap.ui.getCore().byId(sId);
                if (bConfigured) { // Create and set the End User Feedback button
                    sap.ushell.Container.getServiceAsync("EndUserFeedback").then(function (oEndUserFeedbackService) {
                        setEndUserFeedbackButton(oEndUserFeedbackService, oEndUserFeedbackBtn);
                    });
                } else if (oEndUserFeedbackBtn) { // Hide the button, if it was prevoiusly enabled
                    Config.emit("/core/shell/model/showEndUserFeedback", false);
                    _renderer().hideActionButton(sId);
                }
            });
        },

        _createRecentActivitiesButton: function () {
            var that = this,
                sId = "recentActivitiesBtn";

            Config.on("/core/shell/model/enableTrackingActivity").do(function (bEnableTrackingActivity) {
                if (bEnableTrackingActivity) {
                    var oRecentActivitiesBtn = sap.ui.getCore().byId(sId);
                    if (!oRecentActivitiesBtn) {
                        oRecentActivitiesBtn = new ActionItem(sId, {
                            text: resources.i18n.getText("recentActivities"),
                            icon: "sap-icon://customer-history",
                            press: function () {
                                QuickAccess.openQuickAccessDialog("recentActivityFilter", "meAreaHeaderButton");
                            }
                        });
                        that._addDanglingControl(oRecentActivitiesBtn);
                    }
                    _renderer().showActionButton(sId, false);
                } else {
                    _renderer().hideActionButton(sId, false);
                }
            });
        },

        _createFrequentActivitiesButton: function () {
            var that = this,
                sId = "frequentActivitiesBtn";

            Config.on("/core/shell/model/enableTrackingActivity").do(function (bEnableTrackingActivity) {
                if (bEnableTrackingActivity) {
                    var oFrequentActivitiesBtn = sap.ui.getCore().byId(sId);
                    if (!oFrequentActivitiesBtn) {
                        oFrequentActivitiesBtn = new ActionItem(sId, {
                            text: resources.i18n.getText("frequentActivities"),
                            icon: "sap-icon://activity-individual",
                            tooltip: resources.i18n.getText("frequentActivitiesTooltip"),
                            press: function () {
                                QuickAccess.openQuickAccessDialog("frequentlyUsedFilter", "meAreaHeaderButton");
                            }
                        });
                        that._addDanglingControl(oFrequentActivitiesBtn);
                    }
                    _renderer().showActionButton(sId, false);
                } else {
                    _renderer().hideActionButton(sId, false);
                }
            });
        },

        _createLogoutButton: function () {
            var sId = "logoutBtn";
            if (sap.ui.getCore().byId(sId)) {
                return;
            }
            var oLogoutBtn = new ActionItem(sId, {
                visible: true,
                type: ButtonType.Transparent,
                icon: "sap-icon://log",
                text: resources.i18n.getText("signoutBtn_title"),
                press: this.logout
            });
            this._addDanglingControl(oLogoutBtn);
            _renderer().showActionButton(sId, false);
        },

        logout: function () {
            sap.ui.require(["sap/m/MessageBox", "sap/ushell/ui/launchpad/LoadingDialog"],
                function (MessageBox, LoadingDialog) {
                    var oLoading = new LoadingDialog({text: ""}),
                        bShowLoadingScreen = true,
                        bIsLoadingScreenShown = false,
                        oLogoutDetails = {};

                    sap.ushell.Container.getGlobalDirty().done(function (dirtyState) {
                        bShowLoadingScreen = false;
                        if (bIsLoadingScreenShown === true) {
                            oLoading.exit();
                            oLoading = new LoadingDialog({text: ""});
                        }

                        var _getLogoutDetails = function (dirtyState) {
                            var oLogoutDetails = {},
                                oResourceBundle = resources.i18n;

                            if (dirtyState === sap.ushell.Container.DirtyState.DIRTY) {
                                // show warning only if it is sure that there are unsaved changes
                                oLogoutDetails.message = oResourceBundle.getText("unsaved_data_warning_popup_message");
                                oLogoutDetails.icon = MessageBox.Icon.WARNING;
                                oLogoutDetails.messageTitle = oResourceBundle.getText("unsaved_data_warning_popup_title");
                            } else {
                                // show 'normal' logout confirmation in all other cases, also if dirty state could not be determined
                                oLogoutDetails.message = oResourceBundle.getText("signoutConfirmationMsg");
                                oLogoutDetails.icon = MessageBox.Icon.QUESTION;
                                oLogoutDetails.messageTitle = oResourceBundle.getText("signoutMsgTitle");
                            }

                            return oLogoutDetails;
                        };

                        oLogoutDetails = _getLogoutDetails(dirtyState);
                        MessageBox.show(oLogoutDetails.message, oLogoutDetails.icon,
                            oLogoutDetails.messageTitle, [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                            function (oAction) {
                                if (oAction === MessageBox.Action.OK) {
                                    oLoading.openLoadingScreen();
                                    oLoading.showAppInfo(resources.i18n.getText("beforeLogoutMsg"), null);
                                    sap.ushell.Container.logout();
                                }
                            }, sap.ui.core.ElementMetadata.uid("confirm"));
                    });
                    if (bShowLoadingScreen === true) {
                        oLoading.openLoadingScreen();
                        bIsLoadingScreenShown = true;
                    }
                }
            );
        },

        _addDanglingControl: function (oControl) {
            this._aDanglingControl.push(oControl);
        },

        _destroyDanglingControls: function () {
            if (this._aDanglingControl) {
                this._aDanglingControl.forEach(function (oControl) {
                    if (oControl.destroyContent) {
                        oControl.destroyContent();
                    }
                    oControl.destroy();
                });
            }
        },

        /**
         * Method to open or close the MeArea popover
         *
         * @param {boolean} bShow flag to open or cloase MeArea popover
         *
         * @private
         */
        _toggleMeAreaPopover: function (bShow) {
            var oPopover = sap.ui.getCore().byId("sapUshellMeAreaPopover");
            if (!oPopover) {
                oPopover = sap.ui.xmlfragment("sap.ushell.components.shell.MeArea.fiori3.MeAreaPopover", this);
                oPopover.setModel(this.getModel());
            }
            if (bShow) {
                oPopover.openBy(sap.ui.getCore().byId("meAreaHeaderButton"));
            } else {
                oPopover.close();
            }
        },

        meAreaPopoverItemFactory: function (sId, oContext) {
            var oActionItem = sap.ui.getCore().byId(oContext.getObject()),
                oListItem;

            oListItem = new StandardListItem({
                id: sId + "-" + oActionItem.getId(),
                icon: oActionItem.getIcon(),
                iconInset: true,
                title: oActionItem.getText(),
                type: ListType.Active,
                customData: [ //used for opa test
                   {
                        key: "actionItemId",
                        value: oActionItem.getId()
                    }
                ],
                press: function () {
                    if (oActionItem) {
                        oActionItem.firePress();
                    }

                    EventHub.emit("showMeArea", false);
                }
            });
            oListItem.addStyleClass("sapUshellMeAreaActionItem");
            return oListItem;
        }
    });
});
},
	"sap/ushell/components/shell/MeArea/fiori3/MeAreaPopover.fragment.xml":'<core:FragmentDefinition\n        xmlns="sap.m" xmlns:core="sap.ui.core">\n    <Popover\n            id="sapUshellMeAreaPopover"\n            placement="Bottom"\n            showArrow="true"\n            showHeader="false"\n            class="sapUshellPopupContainer sapUiSizeCompact">\n        <content>\n            <List\n                class="sapUshellPopoverList"\n                showSeparators="None"\n                includeItemInSelection="true"\n                items="{\n                    path: \'/actions\',\n                    factory: \'.meAreaPopoverItemFactory\'\n                }">\n                <headerToolbar>\n                    <Toolbar style="Clear">\n                        <Title level="H5" text="{/userName}"/>\n                    </Toolbar>\n                </headerToolbar>\n            </List>\n       </content>\n    </Popover>\n</core:FragmentDefinition>'
},"Component-preload"
);
