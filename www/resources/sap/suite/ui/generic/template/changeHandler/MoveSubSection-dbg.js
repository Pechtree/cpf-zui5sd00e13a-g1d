/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/suite/ui/generic/template/changeHandler/generic/MoveElements"
], function(
	jQuery,
	Utils,
	AnnotationChangeUtils,
	MoveElements
) {
	"use strict";

	/**
	 * Change handler for moving a subsection.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.MoveSubSection
	 * @author SAP SE
	 * @version 1.65.1
	 * @experimental
	 */
	var MoveSubSection = {};
	var FACETS = "com.sap.vocabularies.UI.v1.Facets";



	MoveSubSection.applyChange = function(oChange, oControl, mPropertyBag) {
	};

	MoveSubSection.completeChangeContent = function(oChange, oSpecificChangeInfo, mPropertyBag) {
		oSpecificChangeInfo.custom = {};
		oSpecificChangeInfo.custom.annotation = FACETS;
		oSpecificChangeInfo.custom.fnPerformCustomMove = Utils.fnMoveSubSection;
		MoveElements.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
	};

	return MoveSubSection;
},
/* bExport= */true);
