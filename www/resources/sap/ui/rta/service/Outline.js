/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/dt/OverlayRegistry","sap/ui/dt/ElementOverlay","sap/ui/dt/AggregationOverlay","sap/ui/rta/Utils","sap/ui/dt/Util","sap/base/util/deepEqual","sap/base/util/merge","sap/ui/thirdparty/jquery"],function(O,E,A,R,D,d,m,q){"use strict";return function(r,p){var o={};o._getOutline=function(i,a){var b;if(!a&&D.isInteger(i)){a=i;i=undefined;}var I=[];if(!i){I=r._oDesignTime.getRootElements().map(function(s){return O.getOverlay(s);});}else{var P=O.getOverlay(i);if(!P){throw D.createError("services.Outline#get","Cannot find element with id= "+i+". A valid or empty value for the initial element id should be provided.","sap.ui.rta");}I.push(P);}b=I.map(function(c){return this._getChildrenNodes(c,a);},this);return b;};o._getChildrenNodes=function(a,i,P){var v=D.isInteger(i);if(a.getShouldBeDestroyed()){return{};}var b=this._getNodeProperties(a,P)||{};var c=a.getChildren();if((!v||(v&&i>0))&&c.length>0&&!q.isEmptyObject(b)){i=v?i-1:i;b.elements=c.map(function(C){return this._getChildrenNodes(C,i,C.getParent());},this).filter(function(C){return!q.isEmptyObject(C);});}return b;};o._getNodeProperties=function(a,P){var b;var s;var t;var v;var i=false;var e=a.getElement();var I=e.getId();var c=e.getMetadata().getName();var f=a.getDesignTimeMetadata();var g=f.getData();var h=f.getLabel(e);var j=(g.palette&&g.palette.icons&&g.palette.icons.svg||undefined);if(a instanceof E){t="element";i=a.getEditable();b=f.getName(e);v=a.isVisible();}else{t="aggregation";s=a.getAggregationName();b=P.getAggregation(s)?P.getDesignTimeMetadata().getAggregationDescription(s,e):undefined;}var k=Object.assign({id:I,technicalName:s||c,editable:i,type:t},h!==I&&h!==undefined&&{instanceName:h},b&&b.singular&&{name:b.singular},j!==undefined&&{icon:j},typeof v==="boolean"&&{visible:v});return k;};o._removeDuplicate=function(a,b){return a.filter(function(u){return!d(b,u,Infinity);});};o._updatesHandler=function(e){var P=e.getParameters();if(this.sStatus==="initial"){this.aUpdates=[];}var a=m({},P);var s=a.id?O.getOverlay(a.id).getElement().getId():undefined;var t=a.targetId?O.getOverlay(a.targetId).getElement().getId():undefined;switch(e.getId()){case"elementOverlayCreated":if(P.elementOverlay.isRoot()){var b=P.elementOverlay.getElement().getId();a.element=o._getOutline(b)[0];a.type="new";break;}return;case"elementOverlayAdded":a.element=o._getOutline(s)[0];a.targetId=t;a.type="new";break;case"elementOverlayMoved":a.element=o._getOutline(s,0)[0];a.targetId=t;a.type="move";break;case"elementOverlayDestroyed":var c=a.elementOverlay.getParentAggregationOverlay();if((c instanceof A&&!c._bIsBeingDestroyed)||a.elementOverlay.isRoot()){a.element={};a.element.id=a.elementOverlay.getElement()?a.elementOverlay.getElement().getId():a.elementOverlay.getAssociation("element");a.type="destroy";break;}return;case"elementOverlayEditableChanged":a.element={id:s,editable:a.editable};a.type="editableChange";break;case"elementPropertyChanged":a.element=o._getOutline(s,0)[0];a.type="elementPropertyChange";break;}a=R.omit(a,["elementOverlay","editable","target","id","elementId"]);this.aUpdates=o._removeDuplicate(this.aUpdates,a);this.aUpdates.push(a);if(this.sStatus==="initial"){setTimeout(function(){if(Array.isArray(this.aUpdates)&&this.aUpdates.length>0){this.sStatus="initial";p("update",this.aUpdates);}}.bind(o),200);}this.sStatus="processing";};o.destroy=function(){r._oDesignTime.detachEvent("elementOverlayCreated",this._updatesHandler,this);r._oDesignTime.detachEvent("elementOverlayAdded",this._updatesHandler,this);r._oDesignTime.detachEvent("elementOverlayMoved",this._updatesHandler,this);r._oDesignTime.detachEvent("elementOverlayDestroyed",this._updatesHandler,this);r._oDesignTime.detachEvent("elementPropertyChanged",this._updatesHandler,this);r._oDesignTime.detachEvent("elementOverlayEditableChanged",this._updatesHandler,this);delete this.aUpdates;delete this.sStatus;};o.aUpdates=[];o.sStatus="initial";r._oDesignTime.attachEvent("elementOverlayCreated",o._updatesHandler,o);r._oDesignTime.attachEvent("elementOverlayAdded",o._updatesHandler,o);r._oDesignTime.attachEvent("elementOverlayMoved",o._updatesHandler,o);r._oDesignTime.attachEvent("elementOverlayDestroyed",o._updatesHandler,o);r._oDesignTime.attachEvent("elementPropertyChanged",o._updatesHandler,o);r._oDesignTime.attachEvent("elementOverlayEditableChanged",o._updatesHandler,o);return{events:["update"],exports:{get:o._getOutline.bind(o)},destroy:o.destroy.bind(o)};};});