/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./library","sap/ui/core/Element"],function(l,E){"use strict";var A=E.extend("sap.suite.ui.commons.AriaProperties",{metadata:{library:"sap.suite.ui.commons",properties:{label:{type:"string",defaultValue:null},labelledBy:{type:"string",defaultValue:null},describedBy:{type:"string",defaultValue:null},role:{type:"string",defaultValue:null},hasPopup:{type:"string",defaultValue:null}}}});A.prototype.addAriaProperties=function(r,d){var L=this.getLabel()||d.label;if(L){r.writeAttributeEscaped("aria-label",L);}var s=this.getLabelledBy()||d.labelledBy;if(s){r.writeAttributeEscaped("aria-labelledby",s);}var D=this.getDescribedBy()||d.describedBy;if(D){r.writeAttributeEscaped("aria-describedby",D);}var R=this.getRole()||d.role;if(R){r.writeAttributeEscaped("role",R);}var h=this.getHasPopup()||d.hasPopup;if(h){r.writeAttributeEscaped("aria-haspopup",h);}};return A;});
