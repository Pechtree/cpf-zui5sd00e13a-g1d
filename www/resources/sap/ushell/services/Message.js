// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/m/MessageBox","sap/ushell/Config","sap/ushell/resources","sap/m/Dialog","sap/m/Text","sap/m/Link","sap/m/Button","sap/m/VBox","sap/m/FormattedText"],function(M,C,r,D,T,L,B,V,F){"use strict";function a(){var s;this.init=function(S){s=S;return this;};this.show=function(t,m,p){if(!m){jQuery.sap.log.error("Message must not be empty.");return;}if(s&&typeof s==="function"){s(t,m,p||{});}else{this.buildMessage(t,m,p||{});}};this.buildMessage=function(t,m,p){var o={title:p.title,actions:p.actions,details:p.details,onClose:p.callback},b;switch(t){case a.Type.ERROR:var d=this.createErrorDialog(m,o);d.open();return;case a.Type.CONFIRM:if(!p.actions){b="confirm";}else{o.icon=M.Icon.QUESTION;b="show";}break;case a.Type.INFO:b="info";this.buildAndSendMessageToast(m,p.duration||3000);return;default:o={duration:p.duration||3000};b="show";break;}this.sendMessageBox(m,b,o);};this.createErrorDialog=function(m,c){function b(t){var q=document.createElement("textarea");try{q.contentEditable=true;q.readonly=false;q.innerText=t;document.documentElement.appendChild(q);if(navigator.userAgent.match(/ipad|iphone/i)){var R=document.createRange();R.selectNodeContents(q);window.getSelection().removeAllRanges();window.getSelection().addRange(R);q.setSelectionRange(0,999999);}else{jQuery(q).select();}document.execCommand("copy");sap.m.MessageToast.show(r.i18n.getText("CopyWasSuccessful"));}catch(E){sap.m.MessageToast.show(r.i18n.getText("CopyWasNotSuccessful"));}finally{jQuery(q).remove();}}function g(q){var t=new B({text:r.i18n.getText(q),press:function(){var u=c.details;if(typeof c.details==="object"){u=JSON.stringify(c.details,null,'\t');}var w=[];w.push("Title: "+(l||"-"));w.push("Message: "+(m||"-"));w.push("Details: "+(u||"-"));b(w.join("\n"));}});t.setTooltip(r.i18n.getText("CopyToClipboardBtn_tooltip"));return t;}function d(q){var t=new B({text:r.i18n.getText(q),press:function(){sap.ui.require(['sap/ushell/ui/footerbar/ContactSupportButton'],function(u){var w=new u();if(w){w.showContactSupportDialog();w.destroy();}});o.destroy();}});t.setTooltip(r.i18n.getText("contactSupportBtn_tooltip"));return t;}function e(q){switch(q){case"contactSupportBtn":return d(q);case"CopyToClipboardBtn":return g(q);default:return new B({text:r.i18n.getText(q),press:function(){o.destroy();}});}}function f(H){var q=[],p=[];if(H){q.push("contactSupportBtn");}else{q.push("okDialogBtn");}q.push("CopyToClipboardBtn");q.push("cancelDialogBtn");q.forEach(function(t){p.push(e(t));});return p;}function h(o,p){p.forEach(function(q){o.addButton(q);});}function i(v){var t=new T({text:m});if(c.details){t.addStyleClass("sapUiSmallMarginBottom");}v.addItem(t);}function j(v){var q=c.details;if(typeof c.details==="object"){q=c.details.info;}var t=new L({text:r.i18n.getText("ViewDetails"),press:function(){var u=v.indexOfItem(t);v.removeItem(u);v.insertItem(new F({htmlText:q}),u);}});v.addItem(t);}function k(){var v=new V({renderType:sap.m.FlexRendertype.Bare});i(v);if(c.details){j(v);}return v;}var l=c.title||r.i18n.getText("error");var o=new D({state:sap.ui.core.ValueState.Error,title:l,type:sap.m.DialogType.Message,contentWidth:"30rem"});var n=C.last("/core/extension/SupportTicket"),H=sap.ushell.Container&&n&&m!==r.i18n.getText("supportTicketCreationFailed");var p=f(H);h(o,p);var v=k();o.addContent(v);return o;};this.buildAndSendMessageToast=function(m,d){sap.ui.require(["sap/m/MessageToast"],function(b){b.show(m,{duration:d});});};this.sendMessageBox=function(m,t,c){if(M.hasOwnProperty(t)&&typeof M[t]==="function"){M[t](m,c);}else{jQuery.sap.log.error("Unknown Message type: "+t);}};this.info=function(m,d){this.show(a.Type.INFO,m,{duration:d||3000});};this.error=function(m,t){m=(t!==undefined)?t+" , "+m:m;jQuery.sap.log.error(m);this.show(a.Type.ERROR,m,{title:t});};this.confirm=function(m,c,t,A){this.show(a.Type.CONFIRM,m,{title:t,callback:c,actions:A});};}a.Type={INFO:0,ERROR:1,CONFIRM:2};a.hasNoAdapter=true;return a;},true);
