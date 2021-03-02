/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(function(){"use strict";var T={};T.render=function(r,c){var t=c.getTooltip_AsString();r.write("<div");r.writeControlData(c);if(t){r.writeAttributeEscaped("title",t);}r.addClass("sapSuiteTc");r.writeClasses();r.addStyle("width",c.getWidth());r.addStyle("height",c.getHeight());if(c.getMinWidth()){r.addStyle("min-width",c.getMinWidth());}if(c.getMinHeight()){r.addStyle("min-height",c.getMinHeight());}r.writeStyles();r.write(">");r.renderControl(c._oRemoveButton);r.write("<nav");r.writeAttribute("id",c.getId()+"-nav-prev");r.addClass("sapSuiteTcNavPrev");r.writeClasses();r.write(">");r.write("</nav>");r.write("<div");r.writeAttribute("id",c.getId()+"-container");r.writeAttribute("tabindex","0");r.writeAccessibilityState(c,{role:'list',live:'assertive',disabled:false});r.addClass("sapSuiteTcContainer");r.writeClasses();r.write(">");r.write("<div");r.writeAttribute("id",c.getId()+"-first");r.writeAttribute("aria-hidden","true");r.addClass("sapSuiteTcPrev");r.writeClasses();r.write(">");r.write("</div>");r.write("<div");r.writeAttribute("id",c.getId()+"-second");r.writeAttribute("aria-hidden","false");r.addClass("sapSuiteTcCenter");r.writeClasses();r.write(">");if(c._oCenterControl){r.renderControl(c._oCenterControl);}r.write("</div>");r.write("<div");r.writeAttribute("id",c.getId()+"-third");r.writeAttribute("aria-hidden","true");r.addClass("sapSuiteTcNext");r.writeClasses();r.write(">");r.write("</div>");r.write("</div>");r.write("<nav");r.writeAttribute("id",c.getId()+"-nav-next");r.addClass("sapSuiteTcNavNext");r.writeClasses();r.write(">");r.write("</nav>");r.write("</div>");};return T;},true);
