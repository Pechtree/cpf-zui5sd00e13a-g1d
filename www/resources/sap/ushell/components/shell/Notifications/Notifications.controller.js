// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/utils'],function(u){"use strict";sap.ui.controller("sap.ushell.components.shell.Notifications.Notifications",{oPagingConfiguration:{MAX_NOTIFICATION_ITEMS_DESKTOP:400,MAX_NOTIFICATION_ITEMS_MOBILE:100,MIN_NOTIFICATION_ITEMS_PER_BUFFER:15,NOTIFICATION_ITEM_HEIGHT:(sap.ui.Device.system.phone||sap.ui.Device.system.tablet)?130:100,TAB_BAR_HEIGHT:100},onInit:function(){var i={};this.iMaxNotificationItemsForDevice=sap.ui.Device.system.desktop?this.oPagingConfiguration.MAX_NOTIFICATION_ITEMS_DESKTOP:this.oPagingConfiguration.MAX_NOTIFICATION_ITEMS_MOBILE;this.oNotificationsService=sap.ushell.Container.getService("Notifications");this.oSortingType=this.oNotificationsService.getOperationEnum();i[this.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING]=this.getInitialSortingModelStructure();i[this.oSortingType.NOTIFICATIONS_BY_DATE_ASCENDING]=this.getInitialSortingModelStructure();i[this.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING]=this.getInitialSortingModelStructure();i[this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING]={};this.sCurrentSorting=this.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING;this.sCurrentExpandedType=undefined;var m=new sap.ui.model.json.JSONModel(i);m.setSizeLimit(1500);this.getView().setModel(m);this.getNextBuffer();this._oTopNotificationData=undefined;},shouldFetchMoreNotifications:function(){var h=this.getView().getModel().getProperty("/"+this.sCurrentSorting+"/hasMoreItemsInBackend"),l=this.getView().getModel().getProperty("/"+this.sCurrentSorting+"/listMaxReached");return h&&!l;},getNextBuffer:function(){var c=this.getItemsFromModel(this.sCurrentSorting),n,p,N;if(!this.shouldFetchMoreNotifications()){return;}N=this.getNumberOfItemsToFetchOnScroll();if(N===0){this.getView().getModel().setProperty("/"+this.sCurrentSorting+"/hasMoreItems",false);return;}if(c!==undefined){n=c.length;}if(n===0){this.addBusyIndicatorToTabFilter(true);}this.getView().getModel().setProperty("/"+this.sCurrentSorting+"/inUpdate",true);p=this.oNotificationsService.getNotificationsBufferBySortingType(this.sCurrentSorting,n,N);p.done(function(r){var d=this.oNotificationsService._getNotificationSettingsAvalability();if(d.state()=="pending"){this.oNotificationsService._userSettingInitialization();}this.addBufferToModel(r);}.bind(this));p.fail(function(r){if(n===0){this.handleError();}}.bind(this));},getNextBufferForType:function(){var s=this.sCurrentExpandedType,S=this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING,g=this.getGroupFromModel(s),c=g?g.aNotifications:undefined,n=0,p,h=g.hasMoreItems;if(!h){return;}if(c!==undefined){n=c.length;}this.getView().getModel().setProperty("/"+S+"/inUpdate",true);p=this.oNotificationsService.getNotificationsBufferInGroup(s,n,this.getBasicBufferSize());p.done(function(r){this.addTypeBufferToModel(s,r,false);}.bind(this));p.fail(function(r){this.getNextBufferFailHandler(S);}.bind(this));},addTypeHeadersToModel:function(r){var c=this.getItemsFromModel(this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING),C=c.length,R;this._oTopNotificationData=undefined;if(!r){return;}R=JSON.parse(r).value;R.forEach(function(i,a){i.hasMoreItems=true;i.aNotifications=[{"Id":"temp"}];});this.getView().getModel().setProperty("/"+this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING+"/aGroupHeaders",R);this.getView().getModel().setProperty("/"+this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING+"/inUpdate",false);if(C===0){this.removeBusyIndicatorToTabFilter(false);}},addBufferToModel:function(r){var c=this.getItemsFromModel(this.sCurrentSorting),C=c.length,m,h=r.length>=this.getNumberOfItemsToFetchOnScroll();this._oTopNotificationData=undefined;if(!r){this.getView().getModel().setProperty("/"+this.sCurrentSorting+"/hasMoreItemsInBackend",false);return;}this.getView().getModel().setProperty("/"+this.sCurrentSorting+"/hasMoreItemsInBackend",h);m=c.concat(r);this.getView().getModel().setProperty("/"+this.sCurrentSorting+"/aNotifications",m);this.getView().getModel().setProperty("/"+this.sCurrentSorting+"/inUpdate",false);if(m.length>=this.iMaxNotificationItemsForDevice){this.handleMaxReached();}if(C===0){this.removeBusyIndicatorToTabFilter(true);}},addTypeBufferToModel:function(t,r,o){var g=this.getGroupFromModel(t),G=this.getGroupIndexFromModel(t),a=this.getView().getModel().getProperty("/"+this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING),m;if(!r){return;}if(r.length<this.getBasicBufferSize()){g.hasMoreItems=false;}if(!g.aNotifications||o){g.aNotifications=[];}m=g.aNotifications.concat(r);a[G].aNotifications=m;a[G].Busy=false;this.getView().getModel().setProperty("/"+this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING,a);this.getView().getModel().setProperty("/"+this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING+"/inUpdate",false);},keydownHandler:function(k){var j,n,c;if(k.keyCode===jQuery.sap.KeyCodes.DELETE){j=jQuery(document.activeElement);if(j.hasClass('sapUshellNotificationsListItem')){n=j.next();c=j.find(".sapMNLB-CloseButton")[0];sap.ui.getCore().byId(c.id).firePress();if(n){n.focus();}}}},notificationsUpdateCallback:function(d){var t=this,c,n,N;if(this.sCurrentSorting===this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING){this.notificationsUpdateCallbackForType();d.resolve();return;}c=this.getItemsFromModel(this.sCurrentSorting);if(c!==undefined){n=c.length;}this.cleanModel();N=this.getNumberOfItemsToFetchOnUpdate(n);this.oNotificationsService.getNotificationsBufferBySortingType(this.sCurrentSorting,0,N).done(function(a){if(!a){return;}d.resolve();t.replaceItemsInModel(a,N);}).fail(function(a){jQuery.sap.log.error("Notifications control - call to notificationsService.getNotificationsBufferBySortingType failed: ",a,"sap.ushell.components.shell.Notifications.Notifications");});},getSelectedList:function(){var s;if(this.sCurrentSorting===this.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING){s=this.getView().oNotificationsListPriority;}else{s=this.getView().oNotificationsListDate;}return s;},isMoreCircleExist:function(){var s=this.getSelectedList(),i=s.getItems().length,l=s.getItems()[i-1];return!!i&&l.getMetadata().getName()==="sap.m.CustomListItem";},handleMaxReached:function(){var s=this.getSelectedList(),n=Math.floor(this.oNotificationsService.getNotificationsCount()),m=n-this.iMaxNotificationItemsForDevice,i=this.isMoreCircleExist();this.getView().getModel().setProperty("/"+this.sCurrentSorting+"/moreNotificationCount",m);this.getView().getModel().setProperty("/"+this.sCurrentSorting+"/listMaxReached",m>=0);if(m>0&&!i){s.addItem(this.getView().getMoreCircle(this.sCurrentSorting));}else if(m<=0&&i){s.removeItem(this.getView().oMoreListItem);}},reAddFailedGroup:function(g){var m=this.getView().getModel(),G=m.getProperty('/notificationsByTypeDescending');G.splice(g.removedGroupIndex,0,g.oGroup);m.setProperty('/notificationsByTypeDescending',G);},removeGroupFromModel:function(g){var m=this.getView().getModel(),G=m.getProperty('/notificationsByTypeDescending'),r={oGroup:g,removedGroupIndex:undefined};G.some(function(o,i){if(o.Id===g.Id){r.removedGroupIndex=i;G.splice(i,1);m.setProperty('/notificationsByTypeDescending',G);return true;}return false;});this.sCurrentExpandedType=undefined;return r;},updateGroupHeaders:function(){var p=this.oNotificationsService.getNotificationsGroupHeaders(),t=this,g=t.getView().getModel().getProperty("/"+t.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING);p.fail(function(d){jQuery.sap.log.error("Notifications control - call to notificationsService.updateGroupHeaders failed: ",d,"sap.ushell.components.shell.Notifications.Notifications");});p.done(function(n){var j=JSON.parse(n),a=j.value;a.forEach(function(i,b){var f=false;g.forEach(function(c,I){if(c.Id===i.Id){g[I].GroupHeaderText=i.GroupHeaderText;g[I].CreatedAt=i.CreatedAt;f=true;}});if(!f){g.unshift(i);}});t.getView().getModel().setProperty("/"+t.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING,g);});},reloadGroupHeaders:function(){var p=this.oNotificationsService.getNotificationsGroupHeaders(),t=this;p.fail(function(d){jQuery.sap.log.error("Notifications control - call to notificationsService.getNotificationsGroupHeaders failed: ",d,"sap.ushell.components.shell.Notifications.Notifications");t.replaceBusyIndicatorWithNotificationsList();});p.done(function(n){var j=JSON.parse(n),a=j.value,r=[],l=-1;a.forEach(function(i,b){if(i.IsGroupHeader){i.Collapsed=true;r.push(i);l=l+1;}else if(r[l]){if(!r[l].notifications){r[l].notifications=[];}r[l].notifications.push(i);}});t.getView().getModel().setProperty("/"+t.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING,r);t.replaceBusyIndicatorWithNotificationsList();});},markRead:function(n){var p=this.oNotificationsService.markRead(n),t=this;p.fail(function(){sap.ushell.Container.getService('Message').error(sap.ushell.resources.i18n.getText('notificationsFailedMarkRead'));t.setMarkReadOnModel(n,false);});this.setMarkReadOnModel(n,true);},onExit:function(){this.getView().oBusyIndicator.destroy();},onBeforeRendering:function(){this.oNotificationsService.registerDependencyNotificationsUpdateCallback(this.notificationsUpdateCallback.bind(this),false);},executeAction:function(n,a){return this.oNotificationsService.executeAction(n,a);},executeBulkAction:function(n,a,A,g,N,p){var t=g,P=this.oNotificationsService.executeBulkAction(g.Id,a),m,G=A,s=this.getView().getModel().getProperty(p+"/NotificationTypeDesc"),b=this;if(s===""){s=this.getView().getModel().getProperty(p+"/NotificationTypeKey");}P.fail(function(r){this.getView().getModel().setProperty(N+"/Busy",false);t.notifications.forEach(function(i,c){this.getView().getModel().setProperty(p+"/Busy",false);}.bind(this));if(r&&r.succededNotifications&&r.succededNotifications.length){r.succededNotifications.forEach(function(c,i){this.removeNotificationFromModel(c);}.bind(this));b.cleanModel();}if(r.succededNotifications.length===1){m=sap.ushell.resources.i18n.getText("notificationsPartialSuccessExecuteBulkAction",[G,r.succededNotifications.length,r.failedNotifications.length+r.succededNotifications.length,s,r.failedNotifications.length]);sap.m.MessageToast.show(m,{duration:4000});}else if(r.succededNotifications.length>1){m=sap.ushell.resources.i18n.getText("notificationsSingleSuccessExecuteBulkAction",[G,r.succededNotifications.length,r.failedNotifications.length+r.succededNotifications.length,s,r.failedNotifications.length]);sap.m.MessageToast.show(m,{duration:4000});}else{m=sap.ushell.resources.i18n.getText("notificationsFailedExecuteBulkAction");sap.ushell.Container.getService('Message').error(m);}}.bind(this));P.done(function(){m=sap.ushell.resources.i18n.getText("notificationsSuccessExecuteBulkAction",[G,s]);sap.m.MessageToast.show(m,{duration:4000});this.removeGroupFromModel(t);this.cleanModel();}.bind(this));},dismissNotification:function(n){var t=this,r=this.removeNotificationFromModel(n),p=this.oNotificationsService.dismissNotification(n);this.cleanModel();p.fail(function(){sap.ushell.Container.getService('Message').error(sap.ushell.resources.i18n.getText('notificationsFailedDismiss'));t.addNotificationToModel(r.obj,r.index);});},dismissBulkNotifications:function(n,g){var r=this.removeGroupFromModel(g),p=this.oNotificationsService.dismissBulkNotifications(g.Id);this.cleanModel();p.fail(function(){sap.ushell.Container.getService('Message').error(sap.ushell.resources.i18n.getText('notificationsFailedExecuteBulkAction'));this.reAddFailedGroup(r);}.bind(this));},onListItemPress:function(n,s,a,p){var v=sap.ui.getCore().byId('viewPortContainer');if(v){v.switchState("Center");}u.toExternalWithParameters(s,a,p);this.markRead(n);},scrollToItem:function(t){var j=this._getJqNotificationObjects(),a=j[0],b=j[1],c=j[2],d=j[3],i,n,e,f,g;if(a.length>0&&b.length>0&&c.length>0&&d.length>0){i=d.outerHeight(true)-window.parseInt(d.css("margin-top").replace("px",""));n=this.getIndexInModelByItemId(t.topItemId);n=n?n:0;e=n*i+window.parseInt(d.css("margin-top").replace("px",""));f=window.parseInt(b.css("padding-top").replace("px",""))+window.parseInt(c.css("padding-top").replace("px",""));g=a.offset().top;a.scrollTop(e+f+g-t.offSetTop);}this._oTopNotificationData=undefined;},_getJqNotificationObjects:function(){var j=jQuery("#notificationIconTabBar-containerContent"),a=j.children(),b=a.children(),c=j.find("li").first();return[j,a,b,c];},getTopOffSet:function(){var t=0,j=this._getJqNotificationObjects()[0];if(j.children().length>0&&j.children().children().length>0){t+=j.children().outerHeight()-j.children().height();t+=j.children().children().outerHeight()-j.children().children().height();}return t;},getTopItemOnTheScreen:function(){var j=this._getJqNotificationObjects()[0],t=0,i,a=0,b=this;t=this.getTopOffSet();j.find("li").each(function(){a=jQuery(this).offset().top;if(a>=t){i=b.getItemNotificationId(this);return false;}});return{topItemId:i,offSetTop:a};},handleError:function(){this.removeBusyIndicatorToTabFilter(true);try{sap.ushell.Container.getService("Message").error(sap.ushell.resources.i18n.getText("errorOccurredMsg"));}catch(e){jQuery.sap.log.error("Getting Message service failed.");}},addBusyIndicatorToTabFilter:function(i){var t=this.getSelectedTabFilter(),I=this.getView().oIconTabBar;if(i){I.addStyleClass('sapUshellNotificationIconTabByTypeWithBusyIndicator');t.removeAllContent();t.addContent(this.getView().oBusyIndicator);}},removeBusyIndicatorToTabFilter:function(i){var t=this.getSelectedTabFilter(),s;if(t&&i){if(this.sCurrentSorting===this.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING){s=this.getView().oNotificationsListPriority;}else{s=this.getView().oNotificationsListDate;}t.removeContent(this.getView().oBusyIndicator);t.addContent(s);}},replaceBusyIndicatorWithNotificationsList:function(){var v=this.getView(),t=v.oIconTabBar.getItems()[1];if(t.getContent()[0]===v.oBusyIndicator){t.removeContent(v.oBusyIndicator);t.addContent(v.oNotificationsListType);}},addNotificationToModel:function(n,i){var m=this.getView().getModel(),a=m.getProperty("/"+this.sCurrentSorting+"/aNotifications");a.splice(i,0,n);m.setProperty("/"+this.sCurrentSorting+"/aNotifications",a);},removeNotificationFromModel:function(n){var m=this.getView().getModel(),i,g,a,N,r={};if(this.sCurrentSorting===this.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING||this.sCurrentSorting===this.oSortingType.NOTIFICATIONS_BY_DATE_ASCENDING||this.sCurrentSorting===this.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING){N="/"+this.sCurrentSorting+"/aNotifications";a=m.getProperty(N);a.some(function(b,i,c){if(b.Id&&b.Id===n){r.obj=c.splice(i,1)[0];r.index=i;return true;}});m.setProperty(N,a);return r;}g=m.getProperty("/notificationsByTypeDescending");for(i=0;i<g.length;i++){a=g[i].aNotifications;if(a){if(a.length===1&&a[0].Id===n){g.splice(i,1);}else{a.some(function(b,i,c){if(b.Id&&b.Id===n){r.obj=c.splice(i,1)[0];r.index=i;return true;}});g[i].aNotifications=a;}}}this.updateGroupHeaders();m.setProperty("/notificationsByTypeDescending",g);return r;},getIndexInModelByItemId:function(n){var N,i;if(this.notificationsByTypeDescending===this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING){N=this.getView().getModel().getProperty("/"+this.sCurrentExpandedType+"/aNotifications");}else{N=this.getView().getModel().getProperty("/"+this.sCurrentSorting+"/aNotifications");}if(N===undefined||N.length===0){return 0;}for(i=0;i<N.length;i++){if(N[i].Id===n){return i;}}},cleanModel:function(){var t=this,s=this.getView().getModel().getProperty("/");if(this.sCurrentSorting===this.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING||this.sCurrentSorting===this.oSortingType.NOTIFICATIONS_BY_DATE_ASCENDING){this.getView().oIconTabBar.getItems()[1].removeAllContent();this.getView().oIconTabBar.getItems()[2].removeAllContent();}else if(this.sCurrentSorting===this.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING){this.getView().oIconTabBar.getItems()[0].removeAllContent();this.getView().oIconTabBar.getItems()[1].removeAllContent();}else{this.getView().oIconTabBar.getItems()[2].removeAllContent();this.getView().oIconTabBar.getItems()[0].removeAllContent();}jQuery.each(s,function(i,a){if(i!==t.sCurrentSorting&&i!=="notificationsByTypeDescending"){s[i]=t.getInitialSortingModelStructure();}});this.getView().getModel().setProperty("/",s);},replaceItemsInModel:function(r,n){var c=this.getItemsFromModel(this.sCurrentSorting),C=c.length,h=r.length>=n;if(C){this._oTopNotificationData=this.getTopItemOnTheScreen();}this.getView().getModel().setProperty("/"+this.sCurrentSorting+"/hasMoreItemsInBackend",h);this.getView().getModel().setProperty("/"+this.sCurrentSorting+"/aNotifications",r);this.getView().getModel().setProperty("/"+this.sCurrentSorting+"/inUpdate",false);this.handleMaxReached();},setMarkReadOnModel:function(n,I){var m=this.getView().getModel(),p="/"+this.sCurrentSorting,N,d,g,i;d=m.getProperty(p);if(this.sCurrentSorting==="notificationsByTypeDescending"){for(i=0;i<d.length;i++){if(d[i].Id===this.sCurrentExpandedType){p=p+"/"+i;g=true;break;}}if(!g){return;}}p=p+"/aNotifications";N=m.getProperty(p);N.some(function(a){if(a.Id===n){a.IsRead=I;return true;}});m.setProperty(p,N);},getNumberOfItemsInScreen:function(){var i,h=this.getWindowSize();i=(h-this.oPagingConfiguration.TAB_BAR_HEIGHT)/this.oPagingConfiguration.NOTIFICATION_ITEM_HEIGHT;return Math.ceil(i);},getBasicBufferSize:function(){return Math.max(this.getNumberOfItemsInScreen()*3,this.oPagingConfiguration.MIN_NOTIFICATION_ITEMS_PER_BUFFER);},getWindowSize:function(){return jQuery(window).height();},getNumberOfItemsToFetchOnScroll:function(){var c=this.getItemsFromModel(this.sCurrentSorting).length,b=this.getBasicBufferSize();if(c>=this.iMaxNotificationItemsForDevice){return 0;}if(c+b>this.iMaxNotificationItemsForDevice){return this.iMaxNotificationItemsForDevice-c;}return b;},getNumberOfItemsToFetchOnUpdate:function(n){var b=this.getBasicBufferSize(),N=Math.ceil(n/b),r;r=N>0?N*b:b;return r>this.iMaxNotificationItemsForDevice?this.iMaxNotificationItemsForDevice:r;},getItemsFromModel:function(s){if(s===undefined){s=this.sCurrentSorting;}return this.getView().getModel().getProperty("/"+s+"/aNotifications");},getItemsOfTypeFromModel:function(t){var g=this.getGroupFromModel(t);if(g){return g.aNotifications?g.aNotifications:[];}return[];},getGroupFromModel:function(t){var g=this.getView().getModel().getProperty("/"+this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING),G;g.some(function(a,i){if(a.Id===t){G=a;return true;}});return G;},getGroupIndexFromModel:function(t){var g=this.getView().getModel().getProperty("/"+this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING),i;g.forEach(function(a,b){if(a.Id===t){i=b;return true;}});return i;},getItemNotificationId:function(e){var i,I;i=sap.ui.getCore().byId(e.getAttribute("Id")).getBindingContext().sPath;I=this.getView().getModel().getProperty(i+"/Id");return I;},getInitialSortingModelStructure:function(){return{hasMoreItemsInBackend:true,listMaxReached:false,aNotifications:[],inUpdate:false,moreNotificationCount:""};},getSelectedTabFilter:function(){var t;if(this.sCurrentSorting===this.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING||this.sCurrentSorting===this.oSortingType.NOTIFICATIONS_BY_DATE_ASCENDING){t=this.getView().oIconTabBar.getItems()[0];}else if(this.sCurrentSorting===this.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING){t=this.getView().oIconTabBar.getItems()[2];}else{t=this.getView().oIconTabBar.getItems()[1];}return t;},triggerRetrieveMoreDataForGroupNotifications:function(){if(!this.getModel().getProperty("/"+this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING+"/inUpdate")){var n=this.getItemsOfTypeFromModel(this.sCurrentExpandedType),a=n?n.length:0,b=a?this.getBasicBufferSize():0,c=b*3/5,i=Math.floor(a-c),l=this.getView().oNotificationsListDate.getItems()[i],t=this.getTopOffSet();if(jQuery(l.getDomRef()).offset().top<=t){this.getNextBufferForType();}}},onExpandGroup:function(g){var l=this.getView().oNotificationsListType.getItems(),a=g.getId(),G=this.getView().getModel().getProperty(g.getBindingContextPath()),t=this;t.sCurrentExpandedType=G.Id;t.getView().getModel().setProperty(g.getBindingContextPath()+"/aNotifications",[]);t.getView().getModel().setProperty(g.getBindingContextPath()+"/hasMoreItems",true);l.forEach(function(i,b){if(i.getId()===a){t.getNextBufferForType();}else if(i.getId()!==a&&!i.getCollapsed()){i.setCollapsed(true);t.getView().getModel().setProperty(i.getBindingContextPath()+"/hasMoreItems",true);}});},notificationsUpdateCallbackForType:function(){var s=this.sCurrentExpandedType,S=this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING,g=this.getGroupFromModel(s),c=g?g.aNotifications:undefined,n=0,p;if(c!==undefined){n=c.length;}this.getView().getModel().setProperty("/"+S+"/inUpdate",true);this.updateGroupHeaders();if(s){p=this.oNotificationsService.getNotificationsBufferInGroup(s,0,this.getNumberOfItemsToFetchOnUpdate(n));p.done(function(r){this.addTypeBufferToModel(s,r,true);}.bind(this));p.fail(function(r){this.getNextBufferFailHandler(r);}.bind(this));}},handleEmptyList:function(){var i=this.getItemsFromModel(this.sCurrentSorting);if(i){this.getSelectedList().toggleStyleClass("sapContrast",!i.length);this.getSelectedList().toggleStyleClass("sapContrastPlus",!i.length);}}});},false);
