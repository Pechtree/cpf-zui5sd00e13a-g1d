/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/base/ManagedObject","sap/f/library","sap/f/DynamicPage","sap/f/DynamicPageTitle","sap/f/DynamicPageHeader","sap/m/OverflowToolbar","sap/m/ActionSheet","./SemanticTitle","./SemanticFooter","./SemanticShareMenu","./SemanticConfiguration","./SemanticPageRenderer"],function(C,M,l,D,a,b,O,A,S,c,d,e,f){"use strict";var g=l.DynamicPageTitleArea;var h=C.extend("sap.f.semantic.SemanticPage",{metadata:{library:"sap.f",properties:{headerExpanded:{type:"boolean",group:"Behavior",defaultValue:true},headerPinnable:{type:"boolean",group:"Behavior",defaultValue:true},preserveHeaderStateOnScroll:{type:"boolean",group:"Behavior",defaultValue:false},toggleHeaderOnTitleClick:{type:"boolean",group:"Behavior",defaultValue:true},showFooter:{type:"boolean",group:"Behavior",defaultValue:false},titlePrimaryArea:{type:"sap.f.DynamicPageTitleArea",group:"Appearance",defaultValue:g.Begin},titleAreaShrinkRatio:{type:"sap.f.DynamicPageTitleShrinkRatio",group:"Appearance",defaultValue:"1:1.6:1.6"}},defaultAggregation:"content",aggregations:{titleHeading:{type:"sap.ui.core.Control",multiple:false,defaultValue:null,forwarding:{getter:"_getTitle",aggregation:"heading"}},titleExpandedHeading:{type:"sap.ui.core.Control",multiple:false,defaultValue:null,forwarding:{getter:"_getTitle",aggregation:"expandedHeading"}},titleSnappedHeading:{type:"sap.ui.core.Control",multiple:false,defaultValue:null,forwarding:{getter:"_getTitle",aggregation:"snappedHeading"}},titleBreadcrumbs:{type:"sap.m.IBreadcrumbs",multiple:false,defaultValue:null,forwarding:{getter:"_getTitle",aggregation:"breadcrumbs"}},titleSnappedOnMobile:{type:"sap.m.Title",multiple:false,forwarding:{getter:"_getTitle",aggregation:"snappedTitleOnMobile"}},titleSnappedContent:{type:"sap.ui.core.Control",multiple:true,forwarding:{getter:"_getTitle",aggregation:"snappedContent"}},titleExpandedContent:{type:"sap.ui.core.Control",multiple:true,forwarding:{getter:"_getTitle",aggregation:"expandedContent"}},titleContent:{type:"sap.ui.core.Control",multiple:true,forwarding:{getter:"_getTitle",aggregation:"content"}},titleMainAction:{type:"sap.f.semantic.TitleMainAction",multiple:false},editAction:{type:"sap.f.semantic.EditAction",multiple:false},deleteAction:{type:"sap.f.semantic.DeleteAction",multiple:false},copyAction:{type:"sap.f.semantic.CopyAction",multiple:false},addAction:{type:"sap.f.semantic.AddAction",multiple:false},flagAction:{type:"sap.f.semantic.FlagAction",multiple:false},favoriteAction:{type:"sap.f.semantic.FavoriteAction",multiple:false},fullScreenAction:{type:"sap.f.semantic.FullScreenAction",multiple:false},exitFullScreenAction:{type:"sap.f.semantic.ExitFullScreenAction",multiple:false},closeAction:{type:"sap.f.semantic.CloseAction",multiple:false},titleCustomTextActions:{type:"sap.m.Button",multiple:true},titleCustomIconActions:{type:"sap.m.OverflowToolbarButton",multiple:true},headerContent:{type:"sap.ui.core.Control",multiple:true,forwarding:{getter:"_getHeader",aggregation:"content"}},content:{type:"sap.ui.core.Control",multiple:false},footerMainAction:{type:"sap.f.semantic.FooterMainAction",multiple:false},messagesIndicator:{type:"sap.f.semantic.MessagesIndicator",multiple:false},draftIndicator:{type:"sap.m.DraftIndicator",multiple:false},positiveAction:{type:"sap.f.semantic.PositiveAction",multiple:false},negativeAction:{type:"sap.f.semantic.NegativeAction",multiple:false},footerCustomActions:{type:"sap.m.Button",multiple:true},discussInJamAction:{type:"sap.f.semantic.DiscussInJamAction",multiple:false},saveAsTileAction:{type:"sap.m.Button",multiple:false},shareInJamAction:{type:"sap.f.semantic.ShareInJamAction",multiple:false},sendMessageAction:{type:"sap.f.semantic.SendMessageAction",multiple:false},sendEmailAction:{type:"sap.f.semantic.SendEmailAction",multiple:false},printAction:{type:"sap.f.semantic.PrintAction",multiple:false},customShareActions:{type:"sap.m.Button",multiple:true},landmarkInfo:{type:"sap.f.DynamicPageAccessibleLandmarkInfo",multiple:false,forwarding:{getter:"_getPage",aggregation:"landmarkInfo"}},_dynamicPage:{type:"sap.f.DynamicPage",multiple:false,visibility:"hidden"}},dnd:{draggable:false,droppable:true},designtime:"sap/f/designtime/SemanticPage.designtime"}});h._EVENTS={SHARE_MENU_CONTENT_CHANGED:"_shareMenuContentChanged"};h._SAVE_AS_TILE_ACTION="saveAsTileAction";h.CONTENT_PADDING_CLASSES_TO_FORWARD={"sapUiNoContentPadding":true,"sapUiContentPadding":true,"sapUiResponsiveContentPadding":true};h.prototype.init=function(){this._bSPBeingDestroyed=false;this._initDynamicPage();this._attachShareMenuButtonChange();this._fnActionSubstituteParentFunction=function(){return this;}.bind(this);};h.prototype.exit=function(){this._bSPBeingDestroyed=true;this._cleanMemory();};h.prototype.setHeaderExpanded=function(H){this._getPage().setHeaderExpanded(H);return this;};h.prototype.getHeaderExpanded=function(){return this._getPage().getHeaderExpanded();};h.prototype.setHeaderPinnable=function(H){var o=this._getPage(),i=o.getHeader();i.setPinnable(H);return this.setProperty("headerPinnable",i.getPinnable(),true);};h.prototype.setPreserveHeaderStateOnScroll=function(p){var o=this._getPage();o.setPreserveHeaderStateOnScroll(p);return this.setProperty("preserveHeaderStateOnScroll",o.getPreserveHeaderStateOnScroll(),true);};h.prototype.setToggleHeaderOnTitleClick=function(t){this._getPage().setToggleHeaderOnTitleClick(t);return this.setProperty("toggleHeaderOnTitleClick",t,true);};h.prototype.setShowFooter=function(s){this._getPage().setShowFooter(s);return this.setProperty("showFooter",s,true);};h.prototype.setTitlePrimaryArea=function(p){var o=this._getTitle();o.setPrimaryArea(p);return this.setProperty("titlePrimaryArea",o.getPrimaryArea(),true);};h.prototype.setTitleAreaShrinkRatio=function(s){var o=this._getTitle();o.setAreaShrinkRatio(s);return this.setProperty("titleAreaShrinkRatio",o.getAreaShrinkRatio(),true);};h.prototype.addStyleClass=function(s,i){var o=this.getAggregation("_dynamicPage");if(h.CONTENT_PADDING_CLASSES_TO_FORWARD[s]){o.addStyleClass(s,true);}return C.prototype.addStyleClass.call(this,s,i);};h.prototype.removeStyleClass=function(s,i){var o=this.getAggregation("_dynamicPage");if(h.CONTENT_PADDING_CLASSES_TO_FORWARD[s]){o.removeStyleClass(s,true);}return C.prototype.removeStyleClass.call(this,s,i);};h.prototype.setAggregation=function(s,o,i){var j=this.mAggregations[s],t,p;if(j===o){return this;}o=this.validateAggregation(s,o,false);if(s===h._SAVE_AS_TILE_ACTION){t=h._SAVE_AS_TILE_ACTION;}else{t=this.getMetadata().getManagedAggregation(s).type;}if(e.isKnownSemanticType(t)){p=e.getPlacement(t);if(j){this._onRemoveAggregation(j,t);this._getSemanticContainer(p).removeContent(j,p);}if(o){o._getType=function(){return t;};this._getSemanticContainer(p).addContent(o,p);this._onAddAggregation(o,t);}return M.prototype.setAggregation.call(this,s,o,true);}return M.prototype.setAggregation.call(this,s,o,i);};h.prototype.destroyAggregation=function(s,i){var o=this.getMetadata().getAggregations()[s],j,p,t;if(s===h._SAVE_AS_TILE_ACTION){t=h._SAVE_AS_TILE_ACTION;}else{t=o&&o.type;}if(t&&e.isKnownSemanticType(t)){j=M.prototype.getAggregation.call(this,s);if(j){p=e.getPlacement(t);this._onRemoveAggregation(j,t);!this._bSPBeingDestroyed&&this._getSemanticContainer(p).removeContent(j,p);}}return M.prototype.destroyAggregation.call(this,s,i);};["getContent","setContent","destroyContent"].forEach(function(m){var i=/^(set|destroy)/.test(m);h.prototype[m]=function(o){var j=this._getPage();var r=j[m].apply(j,arguments);return i?this:r;};},this);["addTitleCustomTextAction","insertTitleCustomTextAction","indexOfTitleCustomTextAction","removeTitleCustomTextAction","removeAllTitleCustomTextActions","destroyTitleCustomTextActions","getTitleCustomTextActions"].forEach(function(m){var i=/^(add|insert|destroy)/.test(m);h.prototype[m]=function(){var s=this._getSemanticTitle(),j=m.replace(/TitleCustomTextAction?/,"CustomTextAction"),r;r=s[j].apply(s,arguments);return i?this:r;};},this);["addTitleCustomIconAction","insertTitleCustomIconAction","indexOfTitleCustomIconAction","removeTitleCustomIconAction","removeAllTitleCustomIconActions","destroyTitleCustomIconActions","getTitleCustomIconActions"].forEach(function(m){var i=/^(add|insert|destroy)/.test(m);h.prototype[m]=function(){var s=this._getSemanticTitle(),j=m.replace(/TitleCustomIconAction?/,"CustomIconAction"),r;r=s[j].apply(s,arguments);return i?this:r;};},this);["addFooterCustomAction","insertFooterCustomAction","indexOfFooterCustomAction","removeFooterCustomAction","removeAllFooterCustomActions","destroyFooterCustomActions","getFooterCustomActions"].forEach(function(m){var i=/^(add|insert|destroy)/.test(m);h.prototype[m]=function(){var s=this._getSemanticFooter(),j=m.replace(/FooterCustomAction?/,"CustomAction"),r;r=s[j].apply(s,arguments);return i?this:r;};},this);["addCustomShareAction","insertCustomShareAction","indexOfCustomShareAction","removeCustomShareAction","removeAllCustomShareActions","destroyCustomShareActions","getCustomShareActions"].forEach(function(m){var i=/^(add|insert|destroy)/.test(m);h.prototype[m]=function(){var s=this._getShareMenu(),j=m.replace(/CustomShareAction?/,"CustomAction"),r;r=s[j].apply(s,arguments);return i?this:r;};},this);h.prototype._onAddAggregation=function(o,t){if(t===h._SAVE_AS_TILE_ACTION){this._replaceParent(o);}};h.prototype._onRemoveAggregation=function(o,t){if(t===h._SAVE_AS_TILE_ACTION){this._restoreParent(o);}if(o._getType){delete o._getType;}};h.prototype._replaceParent=function(o){if(o._fnOriginalGetParent){return;}o._fnOriginalGetParent=o.getParent;o.getParent=this._fnActionSubstituteParentFunction;};h.prototype._restoreParent=function(o){if(o&&o._fnOriginalGetParent){o.getParent=o._fnOriginalGetParent;}};h.prototype._attachShareMenuButtonChange=function(){this.attachEvent(h._EVENTS.SHARE_MENU_CONTENT_CHANGED,this._onShareMenuContentChanged,this);};h.prototype._onShareMenuContentChanged=function(E){var s=E.getParameter("bEmpty"),o=this._getSemanticTitle(),i=this._getShareMenu(),j=i._getShareMenuButton();if(!j.getParent()){o.addContent(j,"shareIcon");return;}j.setVisible(!s);};h.prototype._getPage=function(){if(!this.getAggregation("_dynamicPage")){this._initDynamicPage();}return this.getAggregation("_dynamicPage");};h.prototype._initDynamicPage=function(){this.setAggregation("_dynamicPage",new D(this.getId()+"-page",{title:this._getTitle(),header:this._getHeader(),footer:this._getFooter()}),true);};h.prototype._getTitle=function(){if(!this._oDynamicPageTitle){this._oDynamicPageTitle=this._getSemanticTitle()._getContainer();}return this._oDynamicPageTitle;};h.prototype._getHeader=function(){if(!this._oDynamicPageHeader){this._oDynamicPageHeader=new b(this.getId()+"-pageHeader");}return this._oDynamicPageHeader;};h.prototype._getFooter=function(){if(!this._oDynamicPageFooter){this._oDynamicPageFooter=this._getSemanticFooter()._getContainer();}return this._oDynamicPageFooter;};h.prototype._getSemanticTitle=function(){if(!this._oSemanticTitle){this._oSemanticTitle=new S(new a(this.getId()+"-pageTitle"),this);}return this._oSemanticTitle;};h.prototype._getShareMenu=function(){if(!this._oShareMenu){this._oShareMenu=new d(this._getActionSheet(),this);this.addDependent(this._oShareMenu._oContainer);}return this._oShareMenu;};h.prototype._getActionSheet=function(){if(!this._oActionSheet){this._oActionSheet=new A(this.getId()+"-shareMenu");}return this._oActionSheet;};h.prototype._getSemanticFooter=function(){if(!this._oSemanticFooter){this._oSemanticFooter=new c(this._getOverflowToolbar(),this);}return this._oSemanticFooter;};h.prototype._getOverflowToolbar=function(){if(!this._oOverflowToolbar){this._oOverflowToolbar=new O(this.getId()+"-pageFooter");}return this._oOverflowToolbar;};h.prototype._getSemanticContainer=function(p){var P=e._Placement;if(p===P.titleText||p===P.titleIcon){return this._getSemanticTitle();}else if(p===P.footerLeft||p===P.footerRight){return this._getSemanticFooter();}else if(p===P.shareMenu){return this._getShareMenu();}return null;};h.prototype._cleanMemory=function(){if(this._oShareMenu){this._oShareMenu.destroy();this._oShareMenu=null;}if(this._oActionSheet){this._oActionSheet.destroy();this._oActionSheet=null;}if(this._oSemanticTitle){this._oSemanticTitle.destroy();this._oSemanticTitle=null;}if(this._oDynamicPageTitle){this._oDynamicPageTitle.destroy();this._oDynamicPageTitle=null;}if(this._oDynamicPageHeader){this._oDynamicPageHeader.destroy();this._oDynamicPageHeader=null;}if(this._oSemanticFooter){this._oSemanticFooter.destroy();this._oSemanticFooter=null;}if(this._oDynamicPageFooter){this._oDynamicPageFooter.destroy();this._oDynamicPageFooter=null;}if(this._oOverflowToolbar){this._oOverflowToolbar.destroy();this._oOverflowToolbar=null;}};return h;});
