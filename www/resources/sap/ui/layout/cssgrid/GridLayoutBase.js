/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/ManagedObject","sap/ui/Device"],function(M,D){"use strict";var g={gridTemplateColumns:"grid-template-columns",gridTemplateRows:"grid-template-rows",gridGap:"grid-gap",gridColumnGap:"grid-column-gap",gridRowGap:"grid-row-gap",gridAutoRows:"grid-auto-rows",gridAutoColumns:"grid-auto-columns",gridAutoFlow:"grid-auto-flow"};var E=16;var G={Row:"row",Column:"column",RowDense:"row dense",ColumnDense:"column dense"};var a=M.extend("sap.ui.layout.cssgrid.GridLayoutBase",{metadata:{library:"sap.ui.layout","abstract":true}});a.prototype.applyGridLayout=function(e){if(!e){return;}e.forEach(this._applySingleGridLayout,this);};a.prototype._applySingleGridLayout=function(e){if(!e){return;}e=e instanceof window.HTMLElement?e:e.getDomRef();var o=this.getActiveGridSettings();e.style.setProperty("display","grid");if(o){this._setGridLayout(e,o);}else{this._removeGridLayout(e);}};a.prototype._setGridLayout=function(e,o){var p=o.getMetadata().getProperties(),P,s;for(P in g){if(p[P]){s=o.getProperty(P);if(P==="gridAutoFlow"){s=G[s];}if(s===""&&(P==="gridRowGap"||P==="gridColumnGap")){continue;}e.style.setProperty(g[P],s);}}};a.prototype._removeGridLayout=function(e){for(var p in g){e.style.removeProperty(g[p]);}};a.prototype.getActiveGridSettings=function(){throw new Error("GridLayoutBase getActiveGridSettings not implemented in child class");};a.prototype.onGridAfterRendering=function(o){o.getGridDomRefs().forEach(function(d){if(d.children){for(var i=0;i<d.children.length;i++){if(!d.children[i].classList.contains("sapMGHLI")){d.children[i].classList.add("sapUiLayoutCSSGridItem");}}}});};a.prototype.onGridResize=function(e){};a.prototype.isResponsive=function(){return false;};a.prototype.isGridSupportedByBrowser=function(){return!D.browser.msie&&!(D.browser.edge&&D.browser.version<E);};a.prototype.renderSingleGridLayout=function(r){var o=this&&this.getActiveGridSettings(),p,P;r.addStyle("display","grid");if(!o||this.isResponsive()){return;}var b=o.getMetadata().getProperties();for(p in g){if(b[p]){P=o.getProperty(p);if(p==="gridAutoFlow"){P=G[P];}r.addStyle(g[p],P);}}};return a;});
