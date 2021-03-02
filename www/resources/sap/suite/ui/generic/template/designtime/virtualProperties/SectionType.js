sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2","sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils"],function(U,A,D){"use strict";var S={};var F="com.sap.vocabularies.UI.v1.FieldGroup";var a="com.sap.vocabularies.UI.v1.Facets";var L="com.sap.vocabularies.UI.v1.LineItem";var C="com.sap.vocabularies.UI.v1.Chart";var b="com.sap.vocabularies.UI.v1.CollectionFacet";var R="com.sap.vocabularies.UI.v1.ReferenceFacet";var I="com.sap.vocabularies.UI.v1.Identification";var c="com.sap.vocabularies.UI.v1.DataField";var d="com.sap.vocabularies.UI.v1.FieldGroupType";var e="SmartForm";var f="SmartTable";var g="SmartChart";S.createNewSection=function(o,s){var n,N={"Label":{"String":"New Group"},"ID":{},"Target":{},"RecordType":R};if(s){N.Target.AnnotationPath="@"+s;n={"ID":{},"Label":{},"Facets":[N],"RecordType":b};}var h=s?n:N;for(var p in o){if(p!=="RecordType"&&p!=="Target"&&p!=="Facets"&&h[p]){jQuery.extend(h[p],o[p]);}if(jQuery.isEmptyObject(h[p])){delete h[p];}}return h;};S.getSectionTypeValues=function(){var v={SmartForm:{displayName:"Smart Form"},SmartTable:{displayName:"Smart Table"},SmartChart:{displayName:"Smart Chart"}};return v;};S.getSectionType=function(s){var i,o;var E=U.getODataEntityType(U.getComponent(s));var h=E[a];var j=s.getId();j=j.split("--")[1];if(j){j=j.substring(0,j.lastIndexOf("::"));var k=D.getFacetIndexFromID(j,h);if(k===undefined){return;}o=h[k];if(o.RecordType===b){var n=o.Facets;var l,t,m;for(i=0;i<n.length;i++){if(n[i].RecordType===b){return;}if(n[i].Target.AnnotationPath.indexOf(F)>-1||n[i].Target.AnnotationPath.indexOf(I)>-1){l=true;}else if(n[i].Target.AnnotationPath.indexOf(L)>-1){t=true;}}if(l&&t){m="invalid";}else{m=l?e:f;}return m;}else{if(o.Target&&(o.Target.AnnotationPath.indexOf(F)>-1||o.Target.AnnotationPath.indexOf(I)>-1)){return e;}if(o.Target&&o.Target.AnnotationPath.indexOf(L)>-1){return f;}if(o.Target&&o.Target.AnnotationPath.indexOf(C)>-1){return g;}}}};S.setSectionType=function(s,v){var i,r,o=S.getSectionType(s);if(o===v){return;}switch(v){case e:r=F;break;case f:r=L;break;case g:r=C;break;default:break;}if(!r){return;}var E=U.getODataEntityType(U.getComponent(s));var O=E[a];O.splice();var h=s.getId().split("--")[1];h=h.substring(0,h.lastIndexOf("::"));i=D.getFacetIndexFromID(h,O);if(i===undefined){return;}var j=O[i];var n=[],k=[],l={},m;var t=U.getEntityType(U.getComponent(s));n.push.apply(n,O);if(v===e){m=U.createFieldGroupTerm(E);l[m]={"Data":[{"RecordType":c}],"RecordType":d};}var N=S.createNewSection(j,m);if(v===e&&!(N.ID&&N.ID.String)){N.ID={"String":v+i};}n.splice(i,1,N);var p=A.createCustomAnnotationTermChange(t,n,O,a);var q=A.createCustomAnnotationTermChange(t,l[m],{},m);k.push(p);k.push(q);return k;};return S;});
