sap.ui.jsview("zui5sd00e13a.B101", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5sd00e13a.B101
	*/ 
	getControllerName : function() {
		return "zui5sd00e13a.B101";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5sd00e13a.B101
	*/ 
	createContent : function(oController) {
		//Login Form: iOrder URL
		//-------------------------------------------------------------------------------		
		//Tile Menu
		var b101tilItm = new sap.m.StandardTile({
            icon		: '{icon}',
            title		: '{title}',
            info		: '{info}',
            type		: '{tiletype}',
            infoState	: '{state}',
            press		: oCon.ui5Dispatch,
        });
		var b101til = new sap.m.TileContainer({
			id		: 'b101til',
			tiles	: {path:'/t_user',template:b101tilItm},
		});		
		//Register Dialog
		//-------------------------------------------------------------------------------
		var b101frm = new sap.ui.layout.form.SimpleForm({
			id				: 'b101frm',
			layout          : "ResponsiveGridLayout",
			editable        : true,
			maxContainerCols: 2,
			breakpointL 	: 500,
			breakpointM 	: 500,
			columnsL   		: 2,
			columnsM   		: 2,
		});
		b101frm.addContent(new sap.m.Label({text:"Virtual User"}));
		b101frm.addContent(new sap.m.Input({id:'b101inpVname',value:""}));
		b101frm.addContent(new sap.m.Label({text:""}));
		b101frm.addContent(new sap.m.Button({id:'b101btnRegisOk',text:'Register',press:oCon.ui5Dispatch}));
		
		var b101diaReg = new sap.m.Dialog({
			id				: 'b101diaReg',
			title			: 'Register Device',
			beginButton		: new sap.m.Button({id:'b101btnRegisNo',text:'Cancel',press:oCon.ui5Dispatch}),
		    content			: [b101frm],
		});
		//Login Page
		//-------------------------------------------------------------------------------
		var b101lblTitle = new sap.m.Label({text:"CPF-SAP Mobile",design:sap.m.LabelDesign.Bold});
		var b101btnLoad  = new sap.m.Button({id:'b101btnLoad',text:'Refresh',press:oCon.ui5Dispatch});
		var b101btnRegis = new sap.m.Button({id:'b101btnRegis',text:'Add User',icon:'sap-icon://add',press:oCon.ui5Dispatch});
		var b101btnInfo  = new sap.m.Button({id:'b101btnInfo',text:'Info',icon:'sap-icon://message-information',press:oCon.ui5Dispatch});
		var b101page = new sap.m.Page({
			id				: 'b101page',
			enableScrolling	: false,
			customHeader	: new sap.m.Bar({contentLeft:	[b101btnInfo],
											 contentMiddle:	[b101lblTitle],
										     contentRight:	[]}),
			footer			: new sap.m.Bar({contentMiddle:	[b101btnLoad],
											 contentRight:	[]}),
			content			: [b101til]
		});	
		
		//Return
		//-------------------------------------------------------------------------------
		this.setDisplayBlock(true);
		return [b101page];
	}

});