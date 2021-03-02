sap.ui.controller("zui5sd00e13a.OCON", {
	
	//--------------------------------------------------------------------------------
	//Program config TOO
	//--------------------------------------------------------------------------------
	getCTX: function(){
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData({
			rendered 	: false,
			cancel_nav 	: false,
			oEvt		: null,
			host		: 'https://10.244.51.123:44300',
			client		: '210',
			typ			: "",
			url			: "",
			timer		: 0,
			wdapp		: '',
			techapp		: '',
			apptyp		: '',
		    uuid		: "",	//Device UUID
		    urlid		: "",	//Device URI
		    uname		: "",	//SAP Virtual User
		    session		: "",	//SAP Session
		    rfcdest	   	: "",	//SAP Transaction Server
		    hybrid		: "",	//Application is run in hybrid
		});
        
		return oModel;
	},
	
	//--------------------------------------------------------------------------------
	//																	UI5-DISPATCH
	//--------------------------------------------------------------------------------
	
	//ui5DispatchBackEnd
	//--------------------------------------------------------------------------------
	ui5DispatchBackEnd: function(fcode,iAction,sBusy){
		
		var oModela = new sap.ui.model.json.JSONModel();
		var oDialog = oCon.getBusyDialog(sBusy);
		var oParam  = oCon.ui5DispatchParam(fcode);
		oModela.setSizeLimit(1000);
		
		//Register Handler
		oModela.attachRequestSent(function(){oDialog.open();});
		oModela.attachRequestCompleted(function(){
			oDialog.close();
			oCon.popMsgErrSuc(oModela,"E");
			oCon.ui5DispatchFcode(fcode,oModela);
		});
		oModela.attachRequestFailed(function(){
			oDialog.close();
			oCon.popMsgbox("Coummunication to SAP fail !!!");
			oCTX.oData.cancel_nav = true;
		});
		oModela.attachParseError(function(){
			oDialog.close();
			oCon.popMsgbox("Coummunication to SAP fail !!!");
			oCTX.oData.cancel_nav = true;
		});
		
		//Call Back-end
		oModela.loadData(oCon.getModelURL(iAction),oParam);
		//oModela.loadData(oCon.getModelURL(iAction),oParam,true,"POST");
		
	},
	
	
	//ui5Dispatch				(======> #0)
	//--------------------------------------------------------------------------------
	ui5Dispatch: function(oEvt){
		
		var vPar 	= '';
		
		oCTX.oData.oEvt = oEvt;
		try{
			vPar = oEvt.getSource().getParent().sId;
		}catch(err){
		};
		
		if(vPar=="b101til"){
			oCon.ui5DispatchFcode(vPar);
		}else{
			oCon.ui5DispatchFcode(oEvt.getSource().sId);
		};
		
	},
	
	//ui5DispatchFcode      	(======> #1)
	//--------------------------------------------------------------------------------
	ui5DispatchFcode: function(fcode,oModela){
		
		oCTX.oData.cancel_nav = false;
		
		sap.ui.controller('zui5sd00e13a.B100').M01_FCD(fcode,oModela); 
		
		sap.ui.controller('zui5sd00e13a.B100').M01_DEV(fcode,oModela); 
		
		
		//Model Set 
		//------------------------------------
		oCon.ui5DispatchModelSet(fcode,oModela);
		oCon.ui5DispatchUI(fcode,oModela);
		oCon.ui5DispatchNav(fcode,oModela);
		oCon.ui5DispatchNex(fcode,oModela);
	},
	
	
	//ui5DispatchParam       	(======> #2)
	//--------------------------------------------------------------------------------
	ui5DispatchParam: function(fcode){
		
		if(fcode=="SAPEVT_B101"){return sap.ui.controller('zui5sd00e13a.B100').M02_PAR(fcode);};
		if(fcode=="SAPEVT_B102"){return sap.ui.controller('zui5sd00e13a.B100').M02_PAR(fcode);};
		if(fcode=="SAPEVT_B103"){return sap.ui.controller('zui5sd00e13a.B100').M02_PAR(fcode);};
		if(fcode=="SAPEVT_B104"){return sap.ui.controller('zui5sd00e13a.B100').M02_PAR(fcode);};
	},
	
	//ui5DispatchModelSet    	(======> #3)
	//--------------------------------------------------------------------------------
	ui5DispatchModelSet: function(fcode,oModela){
		//try{
			
			sap.ui.controller('zui5sd00e13a.B100').M03_MOD(fcode,oModela);
			
		//}catch(err){
		//	oCTX.oData.cancel_nav=true;
		//};
		
	},
	
	//ui5DispatchUI     		(======> #4)
	//--------------------------------------------------------------------------------
	ui5DispatchUI: function(fcode,oModela){		
		
		sap.ui.controller('zui5sd00e13a.B100').M04_DYN(fcode,oModela);
			
	},
	
	//ui5DispatchNav    		(======> #5)
	//--------------------------------------------------------------------------------
	ui5DispatchNav: function(fcode,oModela){
		
		if(oCTX.oData.cancel_nav){return;};
		
		sap.ui.controller('zui5sd00e13a.B100').M05_NAV(fcode,oModela);
		
	},
	
	//ui5DispatchNex    		(======> #6)
	//--------------------------------------------------------------------------------
	ui5DispatchNex: function(fcode,oModela){
		
		if(oCTX.oData.cancel_nav){return;};
		
		sap.ui.controller('zui5sd00e13a.B100').M05_NEX(fcode,oModela);

	},

	//--------------------------------------------------------------------------------
	//																		SAPUI5-H
	//--------------------------------------------------------------------------------
	
	//getForm
	//--------------------------------------------------------------------------------
	getForm: function(col){
		return new sap.ui.layout.form.SimpleForm({
			layout          : "ResponsiveGridLayout",
			maxContainerCols: col,
			editable        : true,
			breakpointL		: 300,
			breakpointM		: 300,
			columnsL   		: col,
			columnsM   		: col,		
		});
	},
	
	//getControl
	//--------------------------------------------------------------------------------
	getControl: function(sName){
		return sap.ui.getCore().getControl(sName);
	},
	
	//getBusyDialog
	//--------------------------------------------------------------------------------
	getBusyDialog: function(sText){
		return new sap.m.BusyDialog({
			text		: sText + '..',
			title		: '{i18n>LBL_DIALOG}'});
	},
	
	//popMsgbox
	//--------------------------------------------------------------------------------
	popMsgbox: function(sMsg){
		jQuery.sap.require("sap.m.MessageBox");
		sap.m.MessageBox.show(sMsg, {
		          title	: "{i18n>LBL_DIALOG}",
		 });		
	},
	
	//popConfirm
	//--------------------------------------------------------------------------------
	popConfirm: function(sMsg,fcodeOK,fcodeCanc){
		jQuery.sap.require("sap.m.MessageBox");
		sap.m.MessageBox.confirm(sMsg, {
		          title		: "{i18n>LBL_DIALOG}",
		          onClose	: function(oEvt){
		        	  if(oEvt==sap.m.MessageBox.Action.OK)
		        		  oCon.ui5DispatchFcode(fcodeOK);
		        	  else
		        		  oCon.ui5DispatchFcode(fcodeCanc);
		          },
		 });		
	},
	
	//popMsgErrSuc
	//--------------------------------------------------------------------------------
	popMsgErrSuc: function(oModela,typ){
		try
		{
			if(oModela.oData.logon.typ==typ){
				oCon.popMsgbox(oModela.oData.logon.msg);
				return true;
			};
			return false;
		}catch (err){
			return false;
		};
	},
	//fmtAlpha
	//--------------------------------------------------------------------------------
	fmtAlpha: function(oEvt){
		if(oEvt==undefined){return;};
		return parseInt(oEvt,10);
	},
	//fmtDate
	//--------------------------------------------------------------------------------
	fmtDate: function(oEvt){
		if(oEvt==undefined){return;};
		return oEvt.substring(6,8)+'.'+
		       oEvt.substring(4,6)+'.'+
		       oEvt.substring(0,4);
	},
	//fmtTime
	//--------------------------------------------------------------------------------
	fmtTime: function(oEvt){
		if(oEvt==undefined){return;};
		return oEvt.substring(0,2)+':'+
		       oEvt.substring(2,4)+':'+
		       oEvt.substring(4,6);
	},
	//fmtDec3
	//--------------------------------------------------------------------------------
	fmtDec3: function(oEvt){
		if(oEvt==undefined){return;};
		Qty = parseFloat(oEvt).toFixed(3);
		return Qty.toString();
	},
	//fmtAmt
	//--------------------------------------------------------------------------------
	fmtAmt: function(oEvt){
		if((oEvt=='')||(!oEvt))
			return '0.00';
		
		var n 	= oEvt.search('-');
		var amt = parseFloat(oEvt.replace(',',''));

		if(n>=0){
			amt = Math.abs(amt) * -1;
		};
		
		jQuery.sap.require("sap.ui.core.format.NumberFormat");
		var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
			maxFractionDigits 	: 2,
			minFractionDigits   : 2,
			groupingEnabled		: true,
			groupingSeparator	: ",",
			decimalSeparator	: ".",
			minusSign           : "-",
		}); 
		return oNumberFormat.format(amt);
	},
	//--------------------------------------------------------------------------------
	//liveSearch
	//--------------------------------------------------------------------------------
	liveSearch: function(sQuery,sTab,sField){
		
	    // add filter for search
	    var aFilters = [];
	    if (sQuery && sQuery.length > 0) {
	      var filter = new sap.ui.model.Filter(sField, sap.ui.model.FilterOperator.Contains, sQuery);
	      aFilters.push(filter);
	    }

	    // update list binding
	    var list = oCon.getControl(sTab);
	    var binding = list.getBinding("items");
	    binding.filter(aFilters, "Application");
	
	},
	//--------------------------------------------------------------------------------
	//arrListSelected
	//--------------------------------------------------------------------------------
	arrListSelected: function(vList,vField){
		
		var arr 	= new Array();
		for(var i=0;i<oCon.getControl(vList).getSelectedItems().length;i++){
			arr[i]     = new Array(1);
			arr[i][0]  = oCon.getControl(vList).getSelectedItems()[i].getBindingContext().getProperty(vField);
		};
		return arr;
	
	},
	//--------------------------------------------------------------------------------
	//arrListItems
	//--------------------------------------------------------------------------------
	arrListItems: function(vList,vField){
		
		var arr 	= new Array();
		for(var i=0;i<oCon.getControl(vList).getItems().length;i++){
			arr[i]     = new Array(1);
			arr[i][0]  = oCon.getControl(vList).getItems()[i].getBindingContext().getProperty(vField);
		};
		return arr;
	
	},
	//--------------------------------------------------------------------------------
	//arrListItemsNoBlank
	//--------------------------------------------------------------------------------
	arrListItemsNoBlank: function(vList,vField,vFieldChk){
		
		var arr 	= new Array();
		for(var i=0;i<oCon.getControl(vList).getItems().length;i++){
			if(oCon.getControl(vList).getItems()[i].getBindingContext().getProperty(vFieldChk)!=""){
				arr[i]     = new Array(1);
				arr[i][0]  = oCon.getControl(vList).getItems()[i].getBindingContext().getProperty(vField);
			};
		};
		return arr;
	
	},
	//--------------------------------------------------------------------------------
	//fldQtyST
	//--------------------------------------------------------------------------------
	fldQtyST: function(sSign,iField,step){
		
		var Qty = parseFloat(oCon.getControl(iField).getText());
		
		//Current Line Order
		if(sSign=='+'){
			Qty = Qty  + step;
			if(isNaN(Qty)){Qty = step;};
		}else{
			if(Qty>0){Qty = Qty - step;};
		};
		
		//Current Line Order
		if(!isNaN(Qty)&&Qty>0)
			oCon.getControl(iField).setText(Qty);
		else
			oCon.getControl(iField).setText('');
	},	
	//--------------------------------------------------------------------------------
	//pressQtyST
	//--------------------------------------------------------------------------------
	pressQtyST: function(oEvt,sSign,iCell,iField,step){
		
		var Qty = parseFloat(oEvt.getSource().getBindingContext().getProperty(iField));
		
		//Current Line Order
		if(sSign=='+'){
			Qty = Qty  + step;
			if(isNaN(Qty)){Qty = step;};
		}else{
			if(Qty>0){Qty = Qty - step;};
		};
		
		//Current Line Order
		if(!isNaN(Qty)&&Qty>0)
			oEvt.getSource().getParent().getAggregation("cells")[iCell].setText(Qty);
		else
			oEvt.getSource().getParent().getAggregation("cells")[iCell].setText('');
	},
	//--------------------------------------------------------------------------------
	//pressQtyDec3
	//--------------------------------------------------------------------------------
	pressQtyDec3: function(oEvt,sSign,iCell,iField,step){
		
		var Qty = parseFloat(oEvt.getSource().getBindingContext().getProperty(iField));
		
		//Current Line Order
		if(sSign=='+'){
			Qty = Qty  + step;
			if(isNaN(Qty)){Qty = step;};
		}else{
			if(Qty>0){Qty = Qty - step;};
		};
		
		//Current Line Order
		if(!isNaN(Qty)&&Qty>0)
			oEvt.getSource().getParent().getAggregation("cells")[iCell].setText(Qty.toFixed(3));
		else
			oEvt.getSource().getParent().getAggregation("cells")[iCell].setText('');
	},
	//--------------------------------------------------------------------------------
	//getColNum
	//--------------------------------------------------------------------------------
	getColNum: function(desp){
		return new sap.m.Column({
			width	:'60px',
			hAlign	:sap.ui.core.TextAlign.Right,
			header	: new sap.m.Label({text:desp,design:"Bold",})
		});
	},
	//--------------------------------------------------------------------------------
	//getColBtn
	//--------------------------------------------------------------------------------
	getColBtn: function(){
		return new sap.m.Column({
			width	:'20px',
			hAlign	:sap.ui.core.TextAlign.Center,
			header	: new sap.m.Label({design:"Bold",})
		});
	},
	
	//--------------------------------------------------------------------------------
	//sortTable
	//--------------------------------------------------------------------------------
	sortTable: function(sTable,sField){
		var oBinding = oCon.getControl(sTable).getBinding("items");
		var aSorters = [];
		aSorters.push(new sap.ui.model.Sorter(sField));
	    oBinding.sort(aSorters);	
	},
	//--------------------------------------------------------------------------------
	//getDate
	//--------------------------------------------------------------------------------
	getDate: function(){
		var date        = new Date();
		var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern: "dd.MM.yyyy"});
		var datetx      = oDateFormat.format(date);
		return datetx;
	},
	//--------------------------------------------------------------------------------
	//getURLParm
	//--------------------------------------------------------------------------------
	getURLParm: function(parm){
		var r = jQuery.sap.getUriParameters().get(parm);
		if(jQuery.sap.getUriParameters().get(parm)==null)
			return '';
		
		return jQuery.sap.getUriParameters().get(parm);
	},
	
	//getModelURL
	//--------------------------------------------------------------------------------
	getModelURL: function(action){
				
		if(oCTX.oData.host=='http://cpfdv6.cpf.co.th:8000'){
			return  oCTX.oData.host + "/yui5/chestha?sap-client=299&sap-language=TH" +
		        "&application=mobi12" 	+
		        "&action=" 		+ action;
		}else{
			return  oCTX.oData.host + "/zui5?sap-language=TH" +
			    "&application=mobi12" 	+
			    "&action=" 		+ action;
		};
		

	},
	
	//getiOrderUrl
	//--------------------------------------------------------------------------------
	getiOrderUrl: function(app,apptyp){
		
		switch(apptyp){
			case '5':
				return  oCTX.oData.host +'/sap/bc/ui5_ui5/sap/'+app+'/index.html?sap-language=TH' +
				  '&sap-ui-appcache=false&sap-ui-language=TH' +
				  '&sap-client=' + oCTX.oData.client +
				  "&uuid="  	 + oCon.getControl("b102inpUUID").getValue() +
				  "&regid="  	 + oCon.getControl("b102inpGuid").getValue() +
				  "&urlid=" 	 + oCon.getControl("b102inpURL").getValue() +
				  "&uname=" 	 + oCon.getControl("b102inpVname").getValue();
			break;
		
			case 'A':
				return  oCTX.oData.host +'/'+app+'/index.html?sap-language=TH' +
				  '&sap-ui-appcache=false&sap-ui-language=TH' +
				  '&sap-client=' + oCTX.oData.client +
				  "&uuid="  	 + oCon.getControl("b102inpUUID").getValue() +
				  "&regid="  	 + oCon.getControl("b102inpGuid").getValue() +
				  "&urlid=" 	 + oCon.getControl("b102inpURL").getValue() +
				  "&uname=" 	 + oCon.getControl("b102inpVname").getValue();
			break;
			
			case 'W':
				return  oCTX.oData.host +'/sap/bc/webdynpro/sap/'+app+'?sap-language=TH' +
				  '&sap-client=' + oCTX.oData.client +
				  "&uuid="  	 + oCon.getControl("b102inpUUID").getValue() +
				  "&regid="  	 + oCon.getControl("b102inpGuid").getValue() +
				  "&urlid=" 	 + oCon.getControl("b102inpURL").getValue() +
				  "&uname=" 	 + oCon.getControl("b102inpVname").getValue();
			break;
			
			case 'U':
				return  app+'?sap-language=TH' +
				  '&sap-client=' + oCTX.oData.client +
				  "&uuid="  	 + oCon.getControl("b102inpUUID").getValue() +
				  "&regid="  	 + oCon.getControl("b102inpGuid").getValue() +
				  "&urlid=" 	 + oCon.getControl("b102inpURL").getValue() +
				  "&uname=" 	 + oCon.getControl("b102inpVname").getValue();
			break;
		};	
	},
});	