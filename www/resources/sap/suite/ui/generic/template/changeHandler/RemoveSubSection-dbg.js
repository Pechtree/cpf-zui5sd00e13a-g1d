
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/generic/RemoveElement"
], function(
	jQuery,
	Utils,
	RemoveElement
) {
	"use strict";

	/**
	 * Change handler for removing a subsection..
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.RemoveSection **
	 * @author SAP SE
	 * @version 1.65.1
	 * @experimental
	 */
	var RemoveSubSection = {};
	var FACETS = "com.sap.vocabularies.UI.v1.CollectionFacet";

	RemoveSubSection.applyChange = function(oChange, oControl, mPropertyBag) {
		RemoveElement.applyChange(oChange, oControl, mPropertyBag);
	};

	RemoveSubSection.completeChangeContent = function(oChange, oSpecificChangeInfo, mPropertyBag) {
		oSpecificChangeInfo.custom = {};
		oSpecificChangeInfo.custom.annotation = FACETS;
		oSpecificChangeInfo.custom.fnPerformCustomRemove = Utils.fnRemoveSubSection;
		RemoveElement.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
	};

	return RemoveSubSection;
},
/* bExport= */true);
