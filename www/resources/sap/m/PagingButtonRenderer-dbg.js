/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([],
	function() {
		"use strict";

		/**
		 * PagingButton renderer
		 * @namespace
		 */
		var PagingButtonRenderer = {};


		PagingButtonRenderer.render = function (oRm, oControl) {
			var nextButton = oControl._getNextButton(),
				prevButton = oControl._getPreviousButton();

			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addClass("sapMPagingButton");
			oRm.writeClasses();
			oRm.write(">");
			oRm.renderControl(prevButton);
			oRm.renderControl(nextButton);
			oRm.write("</div>");
		};

		return PagingButtonRenderer;

	}, /* bExport= */ true);
