/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"./library",
	"sap/ui/core/Element"
], function(library, Element) {
	"use strict";

	/**
	 * Constructor for a new AriaProperties.
	 *
	 * @class
	 * <code>AriaProperties</code> provides ARIA-compliant properties for screen reader software that can be added to any control renderer.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.65.0
	 * @since 1.65.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.suite.ui.commons.AriaProperties
	 */
	var AriaProperties = Element.extend("sap.suite.ui.commons.AriaProperties", {
		metadata: {
			library: "sap.suite.ui.commons",
			properties: {
				/**
				 * Defines a string value that labels the current element. See the related <code>labelledBy</code> property.
				 */
				label: {type: "string", defaultValue: null},

				/**
				 * Identifies one or more elements that label the current element. See the related <code>label</code> and <code>describedBy</code> properties.
				 */
				labelledBy: {type: "string", defaultValue: null},

				/**
				 * Identifies one or more elements that describe the object. See the related <code>labelledBy</code> property.
				 */
				describedBy: {type: "string", defaultValue: null},

				/**
				 * Identifies the element role.
				 */
				role: {type: "string", defaultValue: null},

				/**
				 * Indicates that the element has a popup context menu or a submenu.
				 */
				hasPopup: {type: "string", defaultValue: null}
			}
		}
	});

	AriaProperties.prototype.addAriaProperties = function (oRm, oDefaultProperties) {
		var sLabel = this.getLabel() || oDefaultProperties.label;
		if (sLabel) {
			oRm.writeAttributeEscaped("aria-label", sLabel);
		}

		var sLabelledBy = this.getLabelledBy() || oDefaultProperties.labelledBy;
		if (sLabelledBy) {
			oRm.writeAttributeEscaped("aria-labelledby", sLabelledBy);
		}

		var sDescribedBy = this.getDescribedBy() || oDefaultProperties.describedBy;
		if (sDescribedBy) {
			oRm.writeAttributeEscaped("aria-describedby", sDescribedBy);
		}

		var sRole = this.getRole() || oDefaultProperties.role;
		if (sRole) {
			oRm.writeAttributeEscaped("role", sRole);
		}

		var sHasPopup = this.getHasPopup() || oDefaultProperties.hasPopup;
		if (sHasPopup) {
			oRm.writeAttributeEscaped("aria-haspopup", sHasPopup);
		}
	};

	return AriaProperties;
});
