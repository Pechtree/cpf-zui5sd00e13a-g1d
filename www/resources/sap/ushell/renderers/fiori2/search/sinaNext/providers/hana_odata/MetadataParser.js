sinaDefine(['../../core/core','./typeConverter'],function(c,t){"use strict";return c.defineClass({_init:function(p){this.provider=p;this.sina=p.sina;this.presentationUsageConversionMap={TITLE:'TITLE',SUMMARY:'SUMMARY',DETAIL:'DETAIL',IMAGE:'IMAGE',THUMBNAIL:'THUMBNAIL',HIDDEN:'HIDDEN'};this.accessUsageConversionMap={AUTO_FACET:'AUTO_FACET',SUGGESTION:'SUGGESTION'};},_getWindow:function(){if(typeof window==="undefined"){return new Promise(function(r,a){sinaRequire(['jsdom','fs'],function(j,f){var b=f.readFileSync("./node_modules/jquery/dist/jquery.js","utf-8");j.env({html:"<html><body></body></html>",src:[b],done:function(e,w){if(!e){r(w);}else{a(e);}}});});});}return Promise.resolve(window);},parseResponse:function(m){var a=this;var b={businessObjectMap:{},businessObjectList:[],dataSourceMap:{},dataSourcesList:[]};return this._getWindow().then(function(w){w.$(m).find('Schema').each(function(){var $=w.$(this);var h=a._parseEntityType($,w);a._parseEntityContainer($,h,b,w);});return Promise.resolve(b);});},_parseEntityType:function(s,w){var a=this;var h={};s=w.$(s);s.find('EntityType').each(function(){var b=w.$(this).attr('Name');var d={schema:s.attr('Namespace'),keys:[],attributeMap:{},resourceBundle:'',labelResourceBundle:'',label:'',labelPlural:'',annotations:{}};h[b]=d;w.$(this).find('Key>PropertyRef').each(function(){d.keys.push(w.$(this).attr('Name'));});w.$(this).find('Annotation[Term="Search.searchable"]').each(function(){w.$(this).siblings('Annotation').each(function(){var $=w.$(this);var f=$.attr('Term');if(f!==undefined&&f.length>0){f=f.toUpperCase();var g=a._getValueFromElement(this);if(f==='ENTERPRISESEARCHHANA.UIRESOURCE.LABEL.BUNDLE'){var r=g;try{d.resourceBundle=jQuery.sap.resources({url:r,language:sap.ui.getCore().getConfiguration().getLanguage()});}catch(e){sinaLog.error("Resource bundle of "+b+" '"+r+"' can't be found:"+e.toString());}}else if(f==='ENTERPRISESEARCHHANA.UIRESOURCE.LABEL.KEY'){var k=g;if(k&&d.resourceBundle){var T=d.resourceBundle.getText(k);if(T){d.labelResourceBundle=T;}}}else if(f==='UI.HEADERINFO.TYPENAME'){d.label=g;}else if(f==='UI.HEADERINFO.TYPENAMEPLURAL'){d.labelPlural=g;}else if(f==='UI.HEADERINFO.TITLE.TYPE'){a._setAnnotationValue(d.annotations,f,g);}else if(f==='UI.HEADERINFO.TITLE.VALUEQUALIFIER'){a._setAnnotationValue(d.annotations,f,g);}else{a._setAnnotationValue(d.annotations,f,g);}}});});w.$(this).find('Property').each(function(e){var f=w.$(this).attr('Name');var g={labelRaw:f,label:null,type:w.$(this).attr('Type'),presentationUsage:[],isFacet:false,isSortable:false,supportsTextSearch:false,displayOrder:e,annotationsAttr:{},unknownAnnotation:[]};d.attributeMap[f]=g;w.$(this).find('Annotation').each(function(){var k=w.$(this).attr('Term');if(k!==undefined&&k.length>0){k=k.toUpperCase();var l=a._getValueFromElement(this);if(l==undefined){w.$(this).children("Collection").children("Record").each(function(){l=l||[];var m={};l.push(m);w.$(this).children("PropertyValue").each(function(){var n=w.$(this).attr("property");if(n!==undefined&&n.length>0){n=n.toUpperCase();var o=a._getValueFromElement(this);if(o!==undefined){m[n]=o;}}});});}if(l!==undefined){switch(k){case'SAP.COMMON.LABEL':if(!g.label){g.label=l;}break;case'ENTERPRISESEARCHHANA.UIRESOURCE.LABEL.KEY':if(l&&d.resourceBundle){var T=d.resourceBundle.getText(l);if(T){g.label=T;}}break;case'ENTERPRISESEARCH.KEY':g.isKey=l;break;case'ENTERPRISESEARCH.PRESENTATIONMODE':w.$(this).find('Collection>String').each(function(){var p=a._getValueFromElement(this);p=a.presentationUsageConversionMap[p];if(p){g.presentationUsage.push(p);}});break;case'ENTERPRISESEARCHHANA.ISSORTABLE':g.isSortable=l;break;case'ENTERPRISESEARCHHANA.SUPPORTSTEXTSEARCH':g.supportsTextSearch=l;break;case'ENTERPRISESEARCH.FILTERINGFACET.DEFAULT':g.isFacet=l;break;case'ENTERPRISESEARCH.DISPLAYORDER':g.displayOrder=l;break;default:if(k.startsWith("UI")||k.startsWith("OBJECTMODEL")||k.startsWith("SEMANTICS")){a._setAnnotationValue(g.annotationsAttr,k,l);}else{g.unknownAnnotation.push(w.$(this));}}}}});var j=g.annotationsAttr.UI&&g.annotationsAttr.UI.IDENTIFICATION;if(j){if(j.POSITION!==undefined){g.displayOrder=j.POSITION;}else if(Array.isArray(j)){for(var i=0;i<j.length;i++){if(j[i].TYPE==undefined&&j[i].POSITION!==undefined){g.displayOrder=j[i].POSITION;break;}}}}});});return h;},_setAnnotationValue:function(a,b,v){var d=b.split(".");var e;var f=a;var g="___temporaryDummyEntriesForArrays___";var i;for(i=0;i<d.length-1;i++){e=d[i];if(f[e]===undefined){f[e]={};f=f[e];}else if(Array.isArray(f[e])){f[g]=f[g]||{};if(!f[g][e]){f[g][e]={};f[e].push(f[g][e]);}f=f[g][e];}else if(typeof f[e]==="object"){f=f[e];}else if(typeof f[e]==="boolean"){f[e]={};f=f[e];}else{return;}}if(i<d.length){e=d[i];if(f[e]===undefined){f[e]=v;}else if(Array.isArray(f[e])){if(Array.isArray(v)){f[e]=f[e].concat(v);}else{f[g]=f[g]||{};if(!f[g][e]){f[g][e]=v;f[e].push(f[g][e]);}else{for(var p in v){if(!f[g][e][p]){f[g][e][p]=v[p];}}}}}}},_getValueFromElement:function(a){var $=window.$(a);var v=$.text();if(!v||v.trim().length==0){v=undefined;if($.attr('string')!==undefined){v=$.attr('string');}else if($.attr('decimal')!==undefined){try{v=Number.parseFloat($.attr('decimal'));if(isNaN(v)){v=undefined;}}catch(e){v=undefined;}}else if($.attr('int')!==undefined){try{v=Number.parseInt($.attr('int'),10);if(isNaN(v)){v=undefined;}}catch(e){v=undefined;}}else if($.attr('bool')!==undefined){v=$.attr('bool')=="true";}}return v;},_parseEntityContainer:function(s,h,a,w){var b=this;s.find('EntityContainer>EntitySet').each(function(){if(w.$(this).attr('Name')&&w.$(this).attr('EntityType')){var n=w.$(this).attr('Name');var e=w.$(this).attr('EntityType');var d=e.slice(e.lastIndexOf('.')+1);var f=h[d];if(f===undefined){throw'EntityType '+d+' has no corresponding meta data!';}var g=b.sina._createDataSource({id:n,label:f.labelResourceBundle||f.label||n,labelPlural:f.labelResourceBundle||f.labelPlural||f.label||n,type:b.sina.DataSourceType.BusinessObject,attributesMetadata:[{id:'dummy'}]});g.annotations=f.annotations;a.dataSourceMap[g.id]=g;a.dataSourcesList.push(g);f.name=n;f.dataSource=g;a.businessObjectMap[n]=f;a.businessObjectList.push(f);}});},fillMetadataBuffer:function(d,a){if(d.attributesMetadata[0].id!=='dummy'){return;}d.attributesMetadata=[];d.attributeMetadataMap={};var b={dataSourceAnnotations:{},attributeAnnotations:{}};b.dataSourceAnnotations=d.annotations;for(var f in a.attributeMap){try{this.fillPublicMetadataBuffer(d,a.attributeMap[f],b);}catch(e){}}var p=this.sina._createCDSAnnotationsParser({dataSource:d,cdsAnnotations:b});p.parseCDSAnnotationsForDataSource();},fillPublicMetadataBuffer:function(d,a,b){var e=a.displayOrder;var f=b.attributeAnnotations[a.labelRaw]={};jQuery.extend(f,a.annotationsAttr);var g=this._parseAttributeTypeAndFormat(a);if(g.type){var p=this.sina._createAttributeMetadata({id:a.labelRaw,label:a.label||a.labelRaw,isKey:a.isKey||false,isSortable:a.isSortable,usage:this._parseUsage(a,e)||{},type:g.type,format:g.format,matchingStrategy:this._parseMatchingStrategy(a)});p._private.semanticObjectType=a.SemanticObjectTypeId;d.attributesMetadata.push(p);d.attributeMetadataMap[p.id]=p;}},_parseMatchingStrategy:function(a){if(a.supportsTextSearch===true){return this.sina.MatchingStrategy.Text;}return this.sina.MatchingStrategy.Exact;},_parseAttributeTypeAndFormat:function(a){for(var i=0;i<a.presentationUsage.length;i++){var p=a.presentationUsage[i]||'';switch(p.toUpperCase()){case'SUMMARY':continue;case'DETAIL':continue;case'TITLE':continue;case'HIDDEN':continue;case'FACTSHEET':continue;case'THUMBNAIL':case'IMAGE':return{type:this.sina.AttributeType.ImageUrl};case'LONGTEXT':return{type:this.sina.AttributeType.String,format:this.sina.AttributeFormatType.Longtext};default:throw new c.Exception('Unknown presentation usage '+p);}}switch(a.type){case'Edm.Binary':if(a.annotationsAttr){if(a.annotationsAttr.SEMANTICS&&a.annotationsAttr.SEMANTICS.CONTACT&&a.annotationsAttr.SEMANTICS.CONTACT.PHOTO||a.annotationsAttr.SEMANTICS&&a.annotationsAttr.SEMANTICS.IMAGEURL){return{type:this.sina.AttributeType.ImageBlob};}}case'Edm.String':case'Edm.Boolean':case'Edm.Byte':case'Edm.Guid':return{type:this.sina.AttributeType.String};case'Edm.Double':case'Edm.Decimal':case'Edm.Float':case'Edm.Single':case'Edm.SingleRange':return{type:this.sina.AttributeType.Double};case'Edm.Int16':case'Edm.Int32':case'Edm.Int64':return{type:this.sina.AttributeType.Integer};case'Edm.Time':return{type:this.sina.AttributeType.Time};case'Edm.DateTime':if(a.TypeLength>8){return{type:this.sina.AttributeType.Timestamp};}return{type:this.sina.AttributeType.Timestamp};case'Collection(Edm.String)':return{type:this.sina.AttributeType.String};case'Edm.GeometryPoint':return{type:this.sina.AttributeType.GeoJson};case'GeoJson':return{type:this.sina.AttributeType.GeoJson};default:return null;}},_parseUsage:function(a,d){var u={};for(var i=0;i<a.presentationUsage.length;i++){var b=a.presentationUsage[i].toUpperCase()||'';if(b==="TITLE"){u.Title={displayOrder:d};}if(b==="SUMMARY"||b==="DETAIL"||b==="IMAGE"||b==="THUMBNAIL"||b==="LONGTEXT"){u.Detail={displayOrder:d};}}if(a.isFacet){u.AdvancedSearch={displayOrder:d};u.Facet={displayOrder:d};}return u;},parseDynamicMetadata:function(s){var d=s.data;if(!d){return;}var m=d['@com.sap.vocabularies.Search.v1.Metadata'];if(!m){return;}var a=this.getUniqueDataSourceFromSearchResult(s);if(!a){return;}for(var b in m){var e=m[b];this.parseDynamicAttributeMetadata(a,b,e);}},parseDynamicAttributeMetadata:function(d,a,b){var e=d.getAttributeMetadata(a);var f=this._parseAttributeTypeAndFormat({presentationUsage:[],type:b.$Type});if(e){if(!e._private.dynamic){return;}e.label=b['@SAP.Common.Label'];e.type=f.type;e.format=f.format;}else{e=this.sina._createAttributeMetadata({id:a,label:b['@SAP.Common.Label'],isKey:false,isSortable:false,usage:{},type:f.type,format:f.format,matchingStrategy:this.sina.MatchingStrategy.Exact,_private:{dynamic:true}});d.attributesMetadata.push(e);d.attributeMetadataMap[e.id]=e;}},getUniqueDataSourceFromSearchResult:function(s){var d=s.data;if(!d){return;}var a=d.value;if(!a){return;}var b,p;for(var i=0;i<a.length;++i){var e=a[i];var f=e['@odata.context'];if(!f){return;}b=f.split('#')[1];if(!b){return;}if(p&&p!==b){return;}p=b;}return this.sina.getDataSource(b);}});});
