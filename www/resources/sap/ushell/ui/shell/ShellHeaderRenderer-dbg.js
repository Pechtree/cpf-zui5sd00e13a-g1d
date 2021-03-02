// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define(['sap/ushell/resources'], function (resources) {
    "use strict";

    /**
     * @name ShellHeader renderer.
     * @static
     * @private
     */
    var ShellHeaderRenderer = {};

    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the render output buffer
     * @param {sap.ui.core.Control} oHeader ShellHeader to be rendered
     */
    ShellHeaderRenderer.render = function (rm, oHeader) {
        var id = oHeader.getId();
        rm.write("<div");
        rm.writeControlData(oHeader);
        if (oHeader.getAriaLabel()) {
            rm.writeAccessibilityState({
                label: oHeader.getAriaLabel(),
                role: "banner"
            });
        }
        rm.addClass("sapUshellShellHeader");
        rm.addClass("sapUshellShellCntnt");
        rm.writeClasses();
        rm.write(">");
        rm.write("<div id='", id, "-hdr-begin' class='sapUshellShellHeadBegin'>");
        this.renderHeaderItems(rm, oHeader, true);

        this.renderLogo(rm, oHeader);
        rm.write("</div>");

        rm.write("<div id='", id, "-hdr-center' class='sapUshellShellHeadCenter' >");

        var oTitle = oHeader.getTitle();
        if (oTitle && oTitle.getText()) {
            this.renderTitle(rm, oHeader);
        }
        if (oHeader.getAppTitle()) {
            this.renderAppTitle(rm, oHeader);
        }
        this.renderSearch(rm, oHeader);
        rm.write("</div>");


        rm.write("<div id='", id, "-hdr-end' class='sapUshellShellHeadEnd'>");
        this.renderHeaderItems(rm, oHeader, false);
        rm.write("</div>");
        rm.write("<div tabindex='0' id='sapUshellHeaderAccessibilityHelper' style='position: absolute'></div>");
        rm.write("</div>");
    };

    ShellHeaderRenderer.renderSearch = function (rm, oHeader) {
        var oSearch = oHeader.getSearch();
        rm.write("<div id='", oHeader.getId(), "-hdr-search-container'");
        rm.writeAttribute("class", "sapUshellShellSearch");
        rm.addStyle("max-width", oHeader.getSearchMaxWidth() + "rem");

        rm.writeStyles();
        rm.write(">");
        if (oSearch) {
            rm.renderControl(oSearch);
        }
        rm.write("</div>");
    };

    ShellHeaderRenderer.renderTitle = function (rm, oHeader) {
        var sClassName = "sapUshellShellHeadTitle";
        if (oHeader.getAppTitle()) {
            sClassName = "sapUshellShellHeadSubtitle";
        }

        rm.write("<div id='", oHeader.getId(), "-hdr-title' class='" + sClassName + "'");
        rm.write(">");
        rm.renderControl(oHeader.getTitle());
        rm.write("</div>");
    };

    ShellHeaderRenderer.renderAppTitle = function (rm, oHeader) {
        rm.write("<div id='", oHeader.getId(), "-hdr-appTitle' class='sapUshellShellHeadTitle'");
        rm.writeAccessibilityState({
            role: "heading",
            level: 1,
            label: oHeader.getAppTitle().getText()
        });
        rm.write(">");
        rm.renderControl(oHeader.getAppTitle());
        rm.write("</div>");
    };

    ShellHeaderRenderer.renderHeaderItems = function (rm, oHeader, begin) {
        rm.write("<div class='sapUshellShellHeadContainer'>");
        var aItems = begin ? oHeader.getHeadItems() : oHeader.getHeadEndItems(),
            i;
        for (i = 0; i < aItems.length; i++) {
            rm.renderControl(aItems[i]);
        }

        rm.write("</div>");
    };

    ShellHeaderRenderer.renderLogo = function (rm, oHeader) {
        var sLogoTooltip = resources.i18n.getText("SHELL_LOGO_TOOLTIP"),
            sIco = oHeader._getLogo(),
            sClassName = "";
        if (!oHeader.getShowLogo()) {
            sClassName += "sapUshellShellHideIco";
        } else {
            sClassName += "sapUshellShellIco";
        }
        rm.write("<div class='" + sClassName + "'");
        rm.write(">");
        rm.write("<img id='", oHeader.getId(), "-icon'");
        rm.writeAttributeEscaped("title", sLogoTooltip);
        rm.writeAttribute("role", "presentation");
        rm.write("src='");
        rm.writeEscaped(sIco);
        rm.write("'");
        if (!sIco) {
            rm.write(" style='display:none;'");
        }
        rm.write("></div>");
    };

    return ShellHeaderRenderer;

}, /* bExport= */ true);
