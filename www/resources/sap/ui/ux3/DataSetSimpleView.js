/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/thirdparty/jquery','sap/ui/core/Control','sap/ui/core/ResizeHandler','./library','./DataSetSimpleViewRenderer','sap/base/Log'],function(q,C,R,l,D,L){"use strict";var a=C.extend("sap.ui.ux3.DataSetSimpleView",{metadata:{interfaces:["sap.ui.ux3.DataSetView"],library:"sap.ui.ux3",properties:{floating:{type:"boolean",group:"Misc",defaultValue:true},name:{type:"string",group:"Misc",defaultValue:"Name of this View"},icon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},iconHovered:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},iconSelected:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},responsive:{type:"boolean",group:"Misc",defaultValue:false},itemMinWidth:{type:"int",group:"Misc",defaultValue:0},initialItemCount:{type:"int",group:"Appearance",defaultValue:0},reloadItemCount:{type:"int",group:"Appearance",defaultValue:0},scrollArea:{type:"any",group:"Appearance",defaultValue:null},height:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null}},aggregations:{template:{type:"sap.ui.core.Control",multiple:false}}}});a.prototype.init=function(){this._oDataSet=this.getParent();this.items=[];this._bRendered=false;if(this.getInitialItemCount()>0&&this.getReloadItemCount()<=0){this.setReloadItemCount(this.getInitialItemCount());}this._bUsePagination=false;};a.prototype.exit=function(){if(this.sResizeListenerId){R.deregister(this.sResizeListenerId);this.sResizeListenerId=null;}};a.prototype.handleSelection=function(e){var d=this.getParent();var i=d.getItems(),s=d.getSelectedIndices();if(s.length>1){this._clearTextSelection();}q.each(i,function(b,c){if(d.isSelectedIndex(b)){c.$().addClass("sapUiUx3DSSVSelected");}else{c.$().removeClass("sapUiUx3DSSVSelected");}});};a.prototype._clearTextSelection=function(){if(window.getSelection){if(window.getSelection().empty){window.getSelection().empty();}else if(window.getSelection().removeAllRanges){window.getSelection().removeAllRanges();}}else if(document.selection&&document.selection.empty){try{document.selection.empty();}catch(e){}}};a.prototype.isItemSelected=function(i){var I=this.items.indexOf(i);if(I==-1){return false;}return this.getParent().isSelectedIndex(I);};a.prototype.initView=function(I){this.getParent().attachSelectionChanged(this.handleSelection,this);this.items=this.items.concat(I);for(var i=0;i<I.length;i++){var t=this.getTemplate().clone();I[i].setAggregation('_template',t,true);}};a.prototype.updateView=function(d){var i;if(!this.getDomRef()){for(i=0;i<d.length;i++){if(d[i].type==="delete"){d[i].item.destroy();}}return;}var r=sap.ui.getCore().createRenderManager(),b=this.items.length;for(i=0;i<d.length;i++){var I=d[i].item;var c=d[i].index;if(d[i].type==="insert"){var t=this.getTemplate().clone();I.setAggregation('_template',t,true);if(i==d.length-1&&b==0){var o={onAfterRendering:function(){this.calculateItemCounts();this.getParent().updateItems(sap.ui.model.ChangeReason.Change);t.removeDelegate(o);}};t.addDelegate(o,false,this);}this.getRenderer().renderItem(r,this,I);r.flush(this.$()[0],false,c);this.items.splice(c,0,I);}else{this.items.splice(c,1);I.$().remove();I.destroy();}}if(d.length>0&&this.getFloating()&&this.getResponsive()){this._computeWidths(true);}r.destroy();};a.prototype.exitView=function(I){this.getParent().detachSelectionChanged(this.handleSelection,this);for(var i=0;i<I.length;i++){I[i].destroyAggregation("_template",true);}this.items=[];};a.prototype.initScrollArea=function(){var $=this.getScrollArea(),t=this;var s=function(e){t.getParent().updateItems(sap.ui.model.ChangeReason.Change);};if(typeof $==='string'){$=q(document.getElementById($));}if(!$){$=this.$();}else if($.is('html')){$=q(document);}if(!this._bUsePagination){$.off('scroll',s);}else{$.on('scroll',s);}};a.prototype.checkScrollItems=function(){if(!this._bRendered){return;}var b=this.getParent().mBindingInfos["items"],$=this.getScrollArea(),B=b.binding,p=this.getParent(),A=0,f,s,c,S;if(p.getItems().length===B.getLength()){return A;}if(typeof $==='string'){$=q(document.getElementById($));}if(!$){$=this.$();}if(!$||$.length==0){return A;}s=$[0];c=s.clientHeight;S=s.scrollHeight;if($.is('html')){$=q(document);}if(c==S){f=c+this._iScrollTrigger;}else{f=c+this._iScrollTrigger+$.scrollTop();}if(f>0){var n=Math.floor(f/this._iRowHeight)*this._iItemsPerRow;var i=p.getItems().length;n=Math.ceil(n/this._iItemsPerRow)*this._iItemsPerRow;A=n-i;}return A;};a.prototype.getItemCount=function(){if(this._bUsePagination){var i=this.getParent().getItems().length,A=this.checkScrollItems();if(i==0){i+=this.getInitialItemCount();}else{i+=A;}return i;}else{return null;}};a.prototype.setInitialItemCount=function(v){this.setProperty("initialItemCount",v);this._bUsePagination=(v!=0);return this;};a.prototype.onBeforeRendering=function(){if(this.sResizeListenerId){R.deregister(this.sResizeListenerId);this.sResizeListenerId=null;}};a.prototype.onAfterRendering=function(){this._bRendered=true;this.initScrollArea();if((this.getFloating()&&this.getResponsive())||this._bUsePagination){this._height=-1;this._itemsPerRow=-1;this.onresize();this.sResizeListenerId=R.register(this.getDomRef(),q.proxy(this.onresize,this));}};a.prototype.onThemeChanged=function(){if(this._bRendered){this.calculateItemCounts();this.getParent().updateItems(sap.ui.model.ChangeReason.Change);}};a.prototype.onresize=function(){if(!this.getDomRef()){if(this.sResizeListenerId){R.deregister(this.sResizeListenerId);this.sResizeListenerId=null;}return;}if(this.getFloating()&&this.getResponsive()){this._computeWidths();}if(this._bUsePagination&&this.items.length>0){this.calculateItemCounts();this.getParent().updateItems(sap.ui.model.ChangeReason.Change);}};a.prototype.setTemplate=function(t){this.setAggregation("template",t,true);if(this.getParent()){this.getParent().updateItems();}return this;};a.prototype.calculateItemCounts=function(){if(this.getDomRef()&&sap.ui.getCore().isThemeApplied()){var $=this.$(),b=$.children().first();this._iItemsPerRow=Math.floor($.outerWidth(true)/b.outerWidth(true));this._iNewRows=Math.ceil(this.getReloadItemCount()/this._iItemsPerRow);this._iNewItems=this._iItemsPerRow*this._iNewRows;this._iRowHeight=b.outerHeight(true);this._iScrollTrigger=this._iNewRows*this._iRowHeight;}};a.prototype._computeWidths=function(i){var t=this.$();var I=Math.floor(t.width()/this.getItemMinWidth());var b=Math.floor(100/I);if(t.width()*b/100<this.getItemMinWidth()){I--;b=Math.floor(100/I);}if(i||this._height!=t.height()||this._itemsPerRow!=I){var c=-1;var d=this.getParent().getItems();var e,w;for(var j=0;j<d.length;j++){if(c==-1||c+1>I){c=0;e=100-(I*b);}var w=b;if(e>0){w++;e--;}d[j].$().css("width",w+"%");c++;}this._height=t.height();this._itemsPerRow=I;}};a.prototype.setScrollArea=function(s,S){if(typeof s!=='string'&&!(s instanceof q)){L.error('You can only pass a string (ID of scroll area DOM) or a jQuery object as scrollarea');}this.setProperty('scrollArea',s,S);return this;};return a;},true);
