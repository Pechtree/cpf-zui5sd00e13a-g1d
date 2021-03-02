sap.ui.controller("zui5sd00e13a.B100", {
	//--------------------------------------------------------------------------------	
	//PAI FCODE 
	//--------------------------------------------------------------------------------	
	M01_FCD: function(fcode,oModela){
		
		if(fcode=='INITIALIZE'){
			if(oCTX.oData.hybrid==''){
				oCon.getControl('b102inpUUID').setValue('e4891e30-e1bb-0d7e-3524-050693192888');
				oCon.ui5DispatchBackEnd("SAPEVT_B102","evt_b102","Loading User..");
			};
		};
		
		//Start Application
		//-----------------------------------------------
		if(fcode=='b101til'){
			oCTX.oData.uname 	= oCTX.oData.oEvt.getSource().getBindingContext().getProperty("uname");
			oCTX.oData.techapp  = oCTX.oData.oEvt.getSource().getBindingContext().getProperty("techapp");
			oCTX.oData.apptyp   = oCTX.oData.oEvt.getSource().getBindingContext().getProperty("apptyp");
			oCon.getControl('b102inpVname').setValue(oCTX.oData.uname);
			oCon.getControl('b102inpApp').setValue(oCTX.oData.techapp);
			//oDevice.dbDispatch('GAP.READLOGON');
			oCon.ui5DispatchBackEnd("SAPEVT_B103","evt_b103","Request access..");	
		};
		//if(fcode=='GAP.INIT.SUC'){
		//	oCon.ui5DispatchBackEnd("SAPEVT_B103","evt_b103","Request access..");			
		//};
		
		//Reset Device
		//------------------------------------------------
		if(fcode=='b102btnReset'){//Reset Popup
			oCon.getControl('b102inpReset').setValue();
			oCon.getControl('b102diaReset').open();
		};
		if(fcode=='b102btnResetNo'){//Cancel Reset
			oCon.getControl('b102diaReset').close();
		};
		if(fcode=='b102btnResetOk'){//OK Register
			oCon.ui5DispatchBackEnd("SAPEVT_B104","evt_b104","Resetting Device..");
		};
		if(fcode=="SAPEVT_B104"){
			oCon.getControl('b102diaReset').close();
		};
		
		//Register Device
		//------------------------------------------------
		if(fcode=='b101btnRegis'){//Register
			oCon.getControl('b101inpVname').setValue();
			oCon.getControl('b101diaReg').open();
		};
		if(fcode=='b101btnRegisNo'){//Cancel Register
			oCon.getControl('b101diaReg').close();
		};
		if(fcode=='b101btnRegisOk'){//OK Register
			if(oCon.getControl('b101inpVname').getValue()==''){
				oCon.popMsgbox("Please enter virtual user");
				return;
			}
			oCon.getControl('b101diaReg').close();
			oCon.ui5DispatchBackEnd("SAPEVT_B101","evt_b101","Registering Device..");
		};
		if(fcode=="SAPEVT_B101"){
			if(oCon.popMsgErrSuc(oModela,'S')){
				oCon.ui5DispatchModelSet(fcode,oModela);
				//oDevice.dbDispatch("GAP.REGISTER");
			};
		};
			
		//Reload User
		//------------------------------------------------
		if(fcode=='b101btnLoad'){
			oCon.ui5DispatchBackEnd("SAPEVT_B102","evt_b102","Loading User..");
		}
		
	},
	//--------------------------------------------------------------------------------	
	//Device Fcode
	//--------------------------------------------------------------------------------	
	M01_DEV: function(fcode,oModela){
		
		
	},
	//--------------------------------------------------------------------------------	
	//Parameters 
	//--------------------------------------------------------------------------------
	M02_PAR: function(fcode,oModela){
		
		if(fcode=='SAPEVT_B101'){ //Register Device
			return oParameters = { 
				"uuid" 		: oCon.getControl("b102inpUUID").getValue(),
				"guid"		: oCon.getControl("b102inpGuid").getValue(),
				"uname"		: oCon.getControl("b101inpVname").getValue(),
				"reset"		: oCon.getControl("b102inpReset").getValue(),
			};
		};
		
		if(fcode=='SAPEVT_B102'){ //List User
			return oParameters = { 
				"uuid" 		: oCon.getControl("b102inpUUID").getValue(),
				"guid"		: oCon.getControl("b102inpGuid").getValue(),
				"uname"		: oCon.getControl("b101inpVname").getValue(),
				"reset"		: oCon.getControl("b102inpReset").getValue(),
			};
		};
		
		if(fcode=='SAPEVT_B103'){ //Start Application
			return oParameters = { 
				"uuid" 		: oCon.getControl("b102inpUUID").getValue(),
				"guid"		: oCon.getControl("b102inpGuid").getValue(),
				"uname"		: oCon.getControl("b102inpVname").getValue(),
				"reset"		: oCon.getControl("b102inpReset").getValue(),
			};
		};
		
		if(fcode=='SAPEVT_B104'){ //Reset Device
			return oParameters = { 
				"uuid" 		: oCon.getControl("b102inpUUID").getValue(),
				"reset"		: oCon.getControl("b102inpReset").getValue(),
			};
		};
		

		
		
	},
	//--------------------------------------------------------------------------------	
	//Model Set 
	//--------------------------------------------------------------------------------
	M03_MOD: function(fcode,oModela){
		
		if(fcode=="SAPEVT_B101"){//Register Device
			oCon.getControl('b102inpGuid').setValue(oModela.oData.reginfo.guid);
			oCon.getControl("b101til").setModel(oModela);
		};
		
		if(fcode=="SAPEVT_B102"){//List Registered User
			oCon.getControl("b101til").setModel(oModela);
		};
		
		
		if(fcode=="SAPEVT_B103"){//Login Startup
			oCon.getControl("b102inpURL").setValue(oModela.oData.reginfo.urlid);
		};
		
		if(fcode=="SAPEVT_B104"){//Reset Device
			if(oCon.popMsgErrSuc(oModela,'S')){
				oCon.ui5DispatchModelSet(fcode,oModela);
				oDevice.dbDispatch("GAP.DEREGISTER");
			};
			oCon.getControl("b101til").setModel(oModela);
		};
		
	},
	//--------------------------------------------------------------------------------	
	//Set UI 
	//--------------------------------------------------------------------------------
	M04_DYN: function(fcode,oModela){

	},
	//--------------------------------------------------------------------------------	
	//Navigation 
	//--------------------------------------------------------------------------------
	M05_NAV: function(fcode,oModela){
		
		if(fcode=='b101btnInfo')	{app.to('B102','slide');};
		if(fcode=='b102btnBak')		{app.to('B101','slide');};
		
	},
	//--------------------------------------------------------------------------------	
	//Next Process
	//--------------------------------------------------------------------------------
	M05_NEX: function(fcode,oModela){
		
		if(fcode=="SAPEVT_B103"){//Login Startup
			if(oModela.oData.logon.typ=='S'){
				oCTX.oData.url      = oCon.getiOrderUrl(oCTX.oData.techapp,oCTX.oData.apptyp);
				window.open(oCTX.oData.url, '_system', 'location=no');
			};
		};
		
	},
});