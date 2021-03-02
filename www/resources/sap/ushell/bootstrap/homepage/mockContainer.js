sap.ui.define(["sap/ui/base/Object","sap/ushell/Utils","sap/ushell/EventHub","sap/ushell/services/ClientSideTargetResolution"],function(O,u,H,C){"use strict";H.emit("CoreResourcesComplementLoaded");var p,c={services:{Personalization:{adapter:{module:"sap.ushell.adapters.local.PersonalizationAdapter"}},CommonDataModel:{adapter:{config:{allowSiteSourceFromURLParameter:true,ignoreSiteDataPersonalization:true,siteDataUrl:"../../cdmSiteData/CommonDataModelAdapterData.json"}}},AppState:{adapter:{module:"sap.ushell.adapters.local.AppStateAdapter"}}}},s=new u.Map();var S={getPlatform:function(){return"cdm";}};var a={getSystem:function(){return S;}};function b(n,S,P,A){var o=g(n).adapter||{},e=o.module||d(S.getPlatform())+"."+n+"Adapter";function f(){return new(jQuery.sap.getObject(e))(S,P,{config:o.config||{}});}if(A){return new Promise(function(r,h){var m=e.replace(/\./g,'/');sap.ui.require([m],function(){try{r(f());}catch(i){h(i);}});});}else{jQuery.sap.require(e);return f();}}function g(e){return(c.services&&c.services[e])||{};}function d(P){if(p&&p[P]){return p[P];}return"sap.ushell.adapters."+P;}return O.extend("sap.ushell.Container",{isMock:true,constructor:function(){},getServiceAsync:function(e,P){return Promise.resolve(this.getService(e,P,true));},getService:function(e,P,A){this._overrideCSTRResolution();var o={},m,k,f,h,i,j;function l(S){var D=new jQuery.Deferred();if(!S){throw new Error("Missing system");}D.resolve(b(e,S,P));sap.ushell.Container.addRemoteSystem(S);return D.promise();}if(!e){throw new Error("Missing service name");}if(e.indexOf(".")>=0){throw new Error("Unsupported service name");}i=g(e);m=i.module||"sap.ushell.services."+e;k=m+"/"+(P||"");j={config:i.config||{}};function n(r,h){o.createAdapter=l;return new r(h,o,P,j);}function q(f,A){var r;if(f.hasNoAdapter){r=new f(o,P,j);}else{h=b(e,a.getSystem(),P,A);if(A){return h.then(function(t){var r=n(f,t);s.put(k,r);return r;});}else{r=n(f,h);}}s.put(k,r);return A?Promise.resolve(r):r;}if(!s.containsKey(k)){if(A){return new Promise(function(r){sap.ui.require([m.replace(/[.]/g,"/")],function(t){r(q(t,true));});});}else{f=sap.ui.requireSync(m.replace(/[.]/g,"/"));return q(f);}}if(A){return Promise.resolve(s.get(k));}else{return s.get(k);}},_overrideCSTRResolution:function(){C.prototype.getEasyAccessSystems=function(){var D=new jQuery.Deferred();var r={"U1Y_000":{"appType":{"TR":true,"WDA":true},"text":"U1Y Client 000"},"FLPINTEGRATION2015_588":{"appType":{"URL":true},"text":"Business Objects Demo"},"GOOGLE":{"appType":{"URL":true},"text":"Google Searches"}};D.resolve(r);return D.promise();};},getUser:function(){return{getLanguage:function(){return"en";}};},getRenderer:function(){return{createExtendedShellState:function(){},applyExtendedShellState:function(){}};},getLogonSystem:function(){return false;}});},true);
