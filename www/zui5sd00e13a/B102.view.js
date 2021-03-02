sap.ui.jsview("zui5sd00e13a.B102", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5sd00e13a.B102
	*/ 
	getControllerName : function() {
		return "zui5sd00e13a.B102";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5sd00e13a.B102
	*/ 
	createContent : function(oController) {
		//Main Form
		//-------------------------------------------------------------------------------
		var b102frm = new sap.ui.layout.form.SimpleForm({
			id				: 'b102frm',
			layout          : "ResponsiveGridLayout",
			editable        : true,
			maxContainerCols: 2,
			breakpointL 	: 500,
			breakpointM 	: 500,
			columnsL   		: 2,
			columnsM   		: 2,
		});
		
		b102frm.addContent(new sap.m.Label({text:"Device UUID"}));
		b102frm.addContent(new sap.m.Input({id:'b102inpUUID',editable:false,value:""}));
		b102frm.addContent(new sap.m.Label({text:"Virtual User"}));
		b102frm.addContent(new sap.m.Input({id:'b102inpVname',editable:false,value:""}));
		b102frm.addContent(new sap.m.Label({text:"Register Key"}));
		b102frm.addContent(new sap.m.Input({id:'b102inpGuid',editable:false,value:""}));
		b102frm.addContent(new sap.m.Label({text:"Logon Key"}));
		b102frm.addContent(new sap.m.Input({id:'b102inpURL',editable:false,value:""}));
		b102frm.addContent(new sap.m.Label({text:"Application"}));
		b102frm.addContent(new sap.m.Input({id:'b102inpApp',editable:false,value:""}));
		b102frm.addContent(new sap.m.Label({text:""}));
		b102frm.addContent(new sap.m.Button({
			id		: 'b102btnReset',
			icon	: 'sap-icon://delete',
			text	: 'Reset Device',
			press	: oCon.ui5Dispatch,
			visible	: false,
		}));
		//Reset Password Dialog
		//-------------------------------------------------------------------------------
		var b102frm2 = new sap.ui.layout.form.SimpleForm({
			id				: 'b102frm2',
			layout          : "ResponsiveGridLayout",
			editable        : true,
			maxContainerCols: 2,
			breakpointL 	: 500,
			breakpointM 	: 500,
			columnsL   		: 2,
			columnsM   		: 2,
		});
		b102frm2.addContent(new sap.m.Label({text:"Reset Password"}));
		b102frm2.addContent(new sap.m.Input({id:'b102inpReset',value:""}));
		b102frm2.addContent(new sap.m.Label({text:""}));
		b102frm2.addContent(new sap.m.Button({id:'b102btnResetOk',text:'Reset',press:oCon.ui5Dispatch}));
		var b102diaReset = new sap.m.Dialog({
			id				: 'b102diaReset',
			title			: 'Reset Device',
			beginButton		: new sap.m.Button({id:'b102btnResetNo',text:'Cancel',press:oCon.ui5Dispatch}),
		    content			: [b102frm2],
		});
		
		//Info Page
		//-------------------------------------------------------------------------------
		//String
		var b102lblTitle = new sap.m.Label({text:"CPF-SAP Mobile",design:sap.m.LabelDesign.Bold});
		var b102btnBak   = new sap.m.Button({id:'b102btnBak',icon:"sap-icon://nav-back",press:oCon.ui5Dispatch});
		var b102page = new sap.m.Page({
			id				: 'b102page',
			title			: "CPF-SAP Mobile",
			customHeader	: new sap.m.Bar({ contentLeft  :[b102btnBak],
				    						  contentMiddle:[b102lblTitle]}),
			footer			: new sap.m.Bar({contentMiddle:[]}),
			content			: [b102frm]
		});	
		
		
		//Return
		//-------------------------------------------------------------------------------
		this.setDisplayBlock(true);
		return [b102page];
	}

});