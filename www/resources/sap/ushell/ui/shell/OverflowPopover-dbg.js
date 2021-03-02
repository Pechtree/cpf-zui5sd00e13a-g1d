// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ui/core/IconPool",
    'sap/m/Popover',
    'sap/ui/core/CustomData',
    'sap/ushell/library'

], function (jQuery, IconPool, Popover, CustomData) {
        "use strict";

        /**
         * Constructor for a new OverflowPopover.
         *
         * @param {string} [sId] id for the new control, generated automatically if no id is givenOverflowPopover
         * @param {object} [mSettings] initial settings for the new control
         */
        var OverflowPopover = Popover.extend("sap.ushell.ui.shell.OverflowPopover", /** @lends sap.ushell.ui.shell.prototype */ {
            init: function() {
                Popover.prototype.init.apply(this);
                this.oPopup.setAutoCloseAreas = function() {};
            },
            renderer: {}
        });
       // sap.ui.unified.OverflowPopover = OverflowPopover;

        return OverflowPopover;

    }, true /* bExport */);