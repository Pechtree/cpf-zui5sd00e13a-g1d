/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['./library','./InfoTileRenderer','sap/ui/core/Renderer'],function(l,I,R){"use strict";var C=R.extend(I);C.renderContent=function(r,c){r.write("<div");r.writeAttribute("id",c.getId()+"-content");r.addClass("sapSuiteCmpTileContent");r.addClass(c.getSize());r.writeClasses();r.write(">");if(l.LoadState.Loaded==c.getState()){this.renderInnerContent(r,c);}r.write("</div>");};C.renderDescription=function(r,c){if(c.getDescription()||c.getUnit()){r.write("<div");r.addClass("sapSuiteInfoTileDescTxt");r.addClass(c.getState());r.addClass(c.getSize());r.writeClasses();r.writeAttribute("id",c.getId()+"-description-text");r.writeAttributeEscaped("title",this.createDescriptionTooltip(c));r.write(">");if(c.getDescription()){r.write("<span");r.writeAttribute("id",c.getId()+"-description");r.addClass("sapSuiteCmpTileDescInner");r.writeClasses();r.write(">");r.writeEscaped(c.getDescription());r.write("</span>");}if(c.getUnit()){r.write("<span");r.writeAttribute("id",c.getId()+"-unit");r.addClass("sapSuiteCmpTileUnitInner");r.writeClasses();r.write(">(");r.writeEscaped(c.getUnit());r.write(")</span>");}r.write("</div>");}};C.createDescriptionTooltip=function(c){var r=[];if(c.getDescription()){r.push(c.getDescription());}if(c.getUnit()){r.push("("+c.getUnit()+")");}return r.join(" ");};return C;},true);