sap.ui.controller("zui5sd00e13a.ODEVICE", {

	//--------------------------------------------------------------------------------
	//																	DEVICE-EVENT
	//--------------------------------------------------------------------------------
	
	//onDeviceReady
	//--------------------------------------------------------------------------------
	onDeviceReady: function(){
		oCTX.oData.hybrid = 'X';
		oCon.getControl('b102inpUUID').setValue(device.uuid);
		oCon.ui5DispatchBackEnd("SAPEVT_B102","evt_b102","Loading User..");
		
//		window.plugins.uniqueDeviceID.get(
//				function(uuid){oCon.getControl('b102inpUUID').setValue(uuid);
//							   oCon.ui5DispatchBackEnd("SAPEVT_B102","evt_b102","Loading User..");
//			    },
//				function(){oCon.ui5DispatchFcode("onUUIDErr");});
	},
	
	//--------------------------------------------------------------------------------
	//DEVICE-DATABASE
	//--------------------------------------------------------------------------------
	dbErr: function(oEvt){
		oCon.popMsgbox("Error processing SQL: "+oEvt.code);
	},

	//dbReadLogon
	//--------------------------------------------------------------------------------
	dbReadLogon: function(oEvt){

		var VName = oCon.getControl('b102inpVname').getValue().toUpperCase();
		var sql   = 'SELECT * FROM ZREGIS3 WHERE vname = "'+VName+'"';
		
		oEvt.executeSql('CREATE TABLE IF NOT EXISTS ZREGIS3 (vname unique, uuid, guid)');
		oEvt.executeSql(sql, [], 
			function(tx, results){
				if(results.rows.length>0){
					oCon.getControl('b102inpGuid').setValue(results.rows.item(0).guid);
					oCon.getControl('b102inpVname').setValue(results.rows.item(0).vname);
					oCon.ui5DispatchFcode("GAP.INIT.SUC");
				}else{
					oCon.popMsgbox("No register key found for "+VName)
				};
			},
			function(){oCon.ui5DispatchFcode("GAP.INIT.ERR");});
	},
	
	//dbRegis
	//--------------------------------------------------------------------------------
	dbRegis: function(oEvt){
		
		var UUID  = oCon.getControl('b102inpUUID').getValue();
		var VName = oCon.getControl('b101inpVname').getValue().toUpperCase();
		var Regid = oCon.getControl('b102inpGuid').getValue();
		
		oEvt.executeSql('CREATE TABLE IF NOT EXISTS ZREGIS3 (vname unique, uuid, guid)');
		oEvt.executeSql('DELETE FROM ZREGIS3 WHERE vname = "'+VName+'"');
		oEvt.executeSql('INSERT INTO ZREGIS3 (vname, uuid, guid) VALUES ("'+VName+'", "'+UUID+'", "'+Regid+'")',[],
			function(oEvt){oCon.ui5DispatchFcode("GAP.REGISTER.SUC");},
			function(){oCon.ui5DispatchFcode("GAP.REGISTER.ERR");});
	},
	
	//dbDeRegis
	//--------------------------------------------------------------------------------
	dbDeRegis: function(oEvt){
		oEvt.executeSql('DELETE FROM ZREGIS3', [], 
				function(){},
				function(){});
		oEvt.executeSql('DROP TABLE IF EXISTS ZREGIS3', [], 
				function(){},
				function(){});
	},
	
	//dbDispatch
	//--------------------------------------------------------------------------------
	dbDispatch: function(fcode){
		
		var oDb = window.openDatabase("SAPUI5DB", "1.0", "CPF-SAP", 200000);
		
		if(fcode=='GAP.READLOGON'){oDb.transaction(oDevice.dbReadLogon, oDevice.dbErr);};
		
		if(fcode=='GAP.DEREGISTER'){oDb.transaction(oDevice.dbDeRegis, oDevice.dbErr);};
		
		if(fcode=="GAP.REGISTER"){oDb.transaction(oDevice.dbRegis, oDevice.dbErr);};
	},
	
});	