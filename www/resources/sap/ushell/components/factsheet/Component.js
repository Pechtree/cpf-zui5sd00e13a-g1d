// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ui/core/UIComponent'],function(U){"use strict";var C=U.extend("sap.ushell.components.factsheet.Component",{oMainView:null,metadata:{version:"1.65.1",library:"sap.ushell.components.factsheet",dependencies:{libs:["sap.m","sap.ui.vbm","sap.suite.ui.commons","sap.ui.layout","sap.viz"],components:[]}},createContent:function(){var c=this.getComponentData();var s=(c&&c.startupParameters)||{};this.oMainView=sap.ui.view({type:sap.ui.core.mvc.ViewType.JS,viewName:"sap.ushell.components.factsheet.views.ThingViewer",viewData:s,height:"100%"}).addStyleClass("ThingViewer");return this.oMainView;},exit:function(){window.console.log("On Exit of factsheet Component.js called : this.getView().getId()"+this.getId());},onExit:function(){window.console.log("On Exit of factsheet Component.js called : this.getView().getId()"+this.getId());}});jQuery.sap.setObject("factsheet.Component",C);return C;});