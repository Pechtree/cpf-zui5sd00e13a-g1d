// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/Config","sap/ushell/services/_ContentExtensionAdapterFactory/ContentExtensionAdapterConfig"],function(C,a){"use strict";var b={};b.getAdapters=function(c){var d=b._getConfigAdapters(c);var A={};var e=d.map(function(o){var E=C.last(o.configSwitch);if(!E){return Promise.resolve();}var f=b._getAdapter(o);f.then(function(g){A[o.contentProviderName]=g;});return f;});return new Promise(function(r){jQuery.when.apply(jQuery,e).then(function(){r(A);});});};b._getConfigAdapters=function(c){if(!c){c=a._getConfigAdapters();}if(!Array.isArray(c)){c=[c];}return c;};b._getAdapter=function(c){var d=new jQuery.Deferred();var A=c.configHandler?c.configHandler():{};var m=c.adapter.replace(/\./g,'/');sap.ui.require([m],function(){var i=b._getAdapterInstance(c.adapter,c.system,null,A);d.resolve(i);});return d.promise();};b._getAdapterInstance=function(A,s,p,c){var d=jQuery.sap.getObject(A);if(d){var D={config:c||{}};return new d(s,p,D);}return null;};return b;});
