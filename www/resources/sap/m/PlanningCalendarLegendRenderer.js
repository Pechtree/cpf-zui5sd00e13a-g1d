/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/unified/CalendarLegendRenderer','sap/ui/core/Renderer'],function(C,R){"use strict";var P=R.extend(C);P.renderItemsHeader=function(r,l){var i=l.getItemsHeader();if(i&&(l.getItems().length||l.getStandardItems().length)){this._renderItemsHeader(r,i);}};P.renderAppointmentsItemsHeader=function(r,l){var a=l.getAppointmentItemsHeader();if(a&&l.getAppointmentItems().length){this._renderItemsHeader(r,a);}else if(l.getAppointmentItems().length&&(l.getItems().length||l.getStandardItems().length)){r.write("<hr/>");}};P._renderItemsHeader=function(r,h){r.write("<div class='sapMPlanCalLegendHeader'>");r.writeEscaped(h);r.write("</div><hr/>");};P.renderAdditionalContent=function(r,l){var a=l.getAppointmentItems(),i,c;this.renderAppointmentsItemsHeader(r,l);r.write("<div");r.addClass("sapUiUnifiedLegendItems");r.writeClasses();c=l.getColumnWidth();r.writeAttribute("style","column-width:"+c+";-moz-column-width:"+c+";-webkit-column-width:"+c+";");r.writeStyles();r.write(">");for(i=0;i<a.length;i++){this.renderLegendItem(r,"sapUiCalLegDayType"+l._getItemType(a[i],a).slice(4),a[i],["sapUiUnifiedLegendSquareColor","sapMPlanCalLegendAppCircle"]);}r.write("</div>");};return P;},true);
