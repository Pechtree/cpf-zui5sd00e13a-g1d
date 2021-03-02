// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview Provide mock feature group data
 *
 * @version 1.65.1
 * @private
 */
sap.ui.define([
    "sap/ushell/resources"
], function (resources) {
    "use strict";

    var oFeaturedGroupConfig = {};

    var sGroupTitle = resources.i18n.getText("featuredGroup.title");
    var sRecentActivity = resources.i18n.getText("recentActivities");
    var sFrequentlyUsed = resources.i18n.getText("frequentActivities");
    var sTop = resources.i18n.getText("top", 3);

    var oFeaturedGroups = {
        groups: [{
            "id": "featuredGroup",
            "contentProvider": "featured",
            "isPersonalizationLocked": function () {
                return true;
            },
            "getTitle": function () {
                return sGroupTitle;
            },
            "title": sGroupTitle,
            "isFeatured": true,
            "isPreset": true,
            "isVisible": true,
            "isDefaultGroup": false,
            "isGroupLocked": true,
            "tiles": [
                {
                    id: "FrequentsCard",
                    contentProvider: "featured",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "FrequentsCard",
                    tileType: "sap.ui.integration.widgets.Card",
                    isCard: true,
                    type: "frequent",
                    manifest: {
                        "sap.flp": {
                            "columns": "4",
                            "rows": "3"
                        },
                        "sap.app": {
                            "type": "card"
                        },
                        "sap.ui5": {
                            "services": {
                                "CardNavigationService": {
                                    "factoryName": "sap.ushell.ui5service.CardNavigation"
                                },
                                "CardUserFrequentsService": {
                                    "factoryName": "sap.ushell.ui5service.CardUserFrequents"
                                }
                            }
                        },
                        "sap.card": {
                            "type": "List",
                            "header": {
                                "title": sFrequentlyUsed,
                                "status": {
                                    "text": sTop
                                },
                                "actions": [{
                                    "type": "Navigation",
                                    "service": "CardNavigationService",
                                    "parameters": {
                                        "openDialog": "FrequentActivities"
                                    }
                                }]
                            },
                            "content": {
                                "maxItems": 3,
                                "data": {
                                    "service": {
                                        "name": "CardUserFrequentsService"
                                    }
                                },
                                "item": {
                                    "title": {
                                        "value": "{Name}"
                                    },
                                    "description": {
                                        "value": "{Description}"
                                    },
                                    "highlight": "{Highlight}",
                                    "icon": {
                                        "src": "{= ${Icon} === undefined ? 'sap-icon://product' : ${Icon} }",
                                        "label": "icon"
                                    },
                                    "actions": [{
                                        "type": "Navigation",
                                        "service": "CardNavigationService",
                                        "parameters": {
                                            "title": "{Name}",
                                            "url": "{Url}",
                                            "intentSemanticObject": "{Intent/SemanticObject}",
                                            "intentAction": "{Intent/Action}",
                                            "intentParameters": "{Intent/Parameters}"
                                        }
                                    }]
                                }
                            }
                        }
                    }
                },
                {
                    id: "RecentsCard",
                    contentProvider: "featured",
                    formFactor: "Desktop,Tablet,Phone",
                    chipId: "RecentsCard",
                    tileType: "sap.ui.integration.widgets.Card",
                    isCard: true,
                    type: "recent",
                    manifest: {
                        "sap.flp": {
                            "columns": "4",
                            "rows": "3"
                        },
                        "sap.app": {
                            "type": "card"
                        },
                        "sap.ui5": {
                            "services": {
                                "CardNavigationService": {
                                    "factoryName": "sap.ushell.ui5service.CardNavigation"
                                },
                                "CardUserRecentsService": {
                                    "factoryName": "sap.ushell.ui5service.CardUserRecents"
                                }
                            }
                        },
                        "sap.card": {
                            "type": "List",
                            "header": {
                                "title": sRecentActivity,
                                "status": {
                                    "text": sTop
                                },
                                "actions": [{
                                    "type": "Navigation",
                                    "service": "CardNavigationService",
                                    "parameters": {
                                        "openDialog": "RecentActivities"
                                    }
                                }]
                            },
                            "content": {
                                "maxItems": 3,
                                "data": {
                                    "service": {
                                        "name": "CardUserRecentsService"
                                    }
                                },
                                "item": {
                                    "title": {
                                        "label": "{{title_label}}",
                                        "value": "{Name}"
                                    },
                                    "description": {
                                        "label": "{{description_label}}",
                                        "value": "{Description}"
                                    },
                                    "icon": {
                                        "src": "{= ${Icon} === undefined ? 'sap-icon://product' : ${Icon} }",
                                        "label": "icon"
                                    },
                                    "highlight": "{Highlight}",
                                    "actions": [{
                                        "type": "Navigation",
                                        "service": "CardNavigationService",
                                        "parameters": {
                                            "title": "{Name}",
                                            "url": "{Url}",
                                            "intentSemanticObject": "{Intent/SemanticObject}",
                                            "intentAction": "{Intent/Action}",
                                            "intentParameters": "{Intent/Parameters}"
                                        }
                                    }]
                                }
                            }
                        }
                    }
                }
            ]
        }]
    };

    oFeaturedGroupConfig.getMockAdapterConfig = function (bEnableFrequentCard, bEnableRecentCard) {
        var oConfig = {
            groups: []
        };

        oFeaturedGroups.groups.forEach(function (group) {
            group.tiles = group.tiles.filter(function (oElement) {
                return bEnableFrequentCard && (oElement.type === "frequent") || (bEnableRecentCard && (oElement.type === "recent"));
            });
            oConfig.groups.push(group);
        });

        return oConfig;
    };

    return oFeaturedGroupConfig;

}, /* bExport = */ true);
