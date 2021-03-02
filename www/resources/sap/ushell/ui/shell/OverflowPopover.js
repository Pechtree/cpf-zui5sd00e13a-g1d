// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/IconPool",'sap/m/Popover','sap/ui/core/CustomData','sap/ushell/library'],function(q,I,P,C){"use strict";var O=P.extend("sap.ushell.ui.shell.OverflowPopover",{init:function(){P.prototype.init.apply(this);this.oPopup.setAutoCloseAreas=function(){};},renderer:{}});return O;},true);
