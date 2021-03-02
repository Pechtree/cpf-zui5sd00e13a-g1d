// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/resources"],function(r){"use strict";var f={};var g=r.i18n.getText("featuredGroup.title");var R=r.i18n.getText("recentActivities");var F=r.i18n.getText("frequentActivities");var t=r.i18n.getText("top",3);var o={groups:[{"id":"featuredGroup","contentProvider":"featured","isPersonalizationLocked":function(){return true;},"getTitle":function(){return g;},"title":g,"isFeatured":true,"isPreset":true,"isVisible":true,"isDefaultGroup":false,"isGroupLocked":true,"tiles":[{id:"FrequentsCard",contentProvider:"featured",formFactor:"Desktop,Tablet,Phone",chipId:"FrequentsCard",tileType:"sap.ui.integration.widgets.Card",isCard:true,type:"frequent",manifest:{"sap.flp":{"columns":"4","rows":"3"},"sap.app":{"type":"card"},"sap.ui5":{"services":{"CardNavigationService":{"factoryName":"sap.ushell.ui5service.CardNavigation"},"CardUserFrequentsService":{"factoryName":"sap.ushell.ui5service.CardUserFrequents"}}},"sap.card":{"type":"List","header":{"title":F,"status":{"text":t},"actions":[{"type":"Navigation","service":"CardNavigationService","parameters":{"openDialog":"FrequentActivities"}}]},"content":{"maxItems":3,"data":{"service":{"name":"CardUserFrequentsService"}},"item":{"title":{"value":"{Name}"},"description":{"value":"{Description}"},"highlight":"{Highlight}","icon":{"src":"{= ${Icon} === undefined ? 'sap-icon://product' : ${Icon} }","label":"icon"},"actions":[{"type":"Navigation","service":"CardNavigationService","parameters":{"title":"{Name}","url":"{Url}","intentSemanticObject":"{Intent/SemanticObject}","intentAction":"{Intent/Action}","intentParameters":"{Intent/Parameters}"}}]}}}}},{id:"RecentsCard",contentProvider:"featured",formFactor:"Desktop,Tablet,Phone",chipId:"RecentsCard",tileType:"sap.ui.integration.widgets.Card",isCard:true,type:"recent",manifest:{"sap.flp":{"columns":"4","rows":"3"},"sap.app":{"type":"card"},"sap.ui5":{"services":{"CardNavigationService":{"factoryName":"sap.ushell.ui5service.CardNavigation"},"CardUserRecentsService":{"factoryName":"sap.ushell.ui5service.CardUserRecents"}}},"sap.card":{"type":"List","header":{"title":R,"status":{"text":t},"actions":[{"type":"Navigation","service":"CardNavigationService","parameters":{"openDialog":"RecentActivities"}}]},"content":{"maxItems":3,"data":{"service":{"name":"CardUserRecentsService"}},"item":{"title":{"label":"{{title_label}}","value":"{Name}"},"description":{"label":"{{description_label}}","value":"{Description}"},"icon":{"src":"{= ${Icon} === undefined ? 'sap-icon://product' : ${Icon} }","label":"icon"},"highlight":"{Highlight}","actions":[{"type":"Navigation","service":"CardNavigationService","parameters":{"title":"{Name}","url":"{Url}","intentSemanticObject":"{Intent/SemanticObject}","intentAction":"{Intent/Action}","intentParameters":"{Intent/Parameters}"}}]}}}}}]}]};f.getMockAdapterConfig=function(e,E){var c={groups:[]};o.groups.forEach(function(a){a.tiles=a.tiles.filter(function(b){return e&&(b.type==="frequent")||(E&&(b.type==="recent"));});c.groups.push(a);});return c;};return f;},true);