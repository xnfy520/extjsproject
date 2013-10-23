Ext.define('Ext.ux.uploadPanel',{
	extend : 'Ext.grid.Panel',
	frame:false,
	alias : 'widget.uploadpanel',
	width : 900,
	height : 400,
	selType:'checkboxmodel',
    selModel: {
        injectCheckbox:'last',
        allowDeselect:false,
        listeners:{}
    },
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
			pluginId: 'fileNameEdit',
            clicksToEdit: 1,
            listeners : {
				beforeedit : function(e,obj) {
					if(obj.record.data.status=='-4'){ //如果该记录状态为已经完成则不允许编辑
						return false;
					}
				}
			}
        })
    ],
	columns : [
        {xtype: 'rownumberer'},
		{text: '原文件名',dataIndex: 'name',flex: 1,sortable:false},
		{text: '自定义文件名',flex: 1,dataIndex: 'fileName',editor: {xtype: 'textfield',disabled:false},sortable:false},
        {text: '类型', width: 70,dataIndex: 'type',sortable:false,hidden:true},
        {text: '大小', width: 70,dataIndex: 'size',sortable:false,renderer:function(v){
			return Ext.util.Format.fileSize(v);
        }},
        {text: '进度', width: 130,dataIndex: 'percent',sortable:false,renderer:function(v){
			var html =
				'<div>'+
					'<div style="border:1px solid #3892D3;height:10px;width:115px;margin:2px 0px 1px 0px;float:left;">'+
						'<div style="float:left;background:#3892D3;width:'+v+'%;height:8px;">'+
							'<div></div>'+
						'</div>'+
					'</div>'+
				'</div>';
			return html;
        }},
        {text: '状态', width: 80,dataIndex: 'status',sortable:false,renderer:function(v){
			var status;
			if(v==-1){
				status = "等待上传";
			}else if(v==-2){
				status =  "上传中...";
			}else if(v==-3){
				status =  "<div style='color:red;'>上传失败</div>";
			}else if(v==-4){
				status =  "上传成功";
			}else if(v==-5){
				status =  "停止上传";
			}
			return status;
		}}
		// ,
  //       {
  //           xtype:'actioncolumn',
  //           flex: 1,
  //           items: [{
  //               icon: 'sdk/ux/uploadPanel/icons/delete.gif',
  //               tooltip: 'Remove',
  //               handler: function(grid, rowIndex, colIndex) {
		//			var id = grid.store.getAt(rowIndex).get('id');
  //                   grid.store.remove(grid.store.getAt(rowIndex));
  //               }
  //           }]
  //       }
    ],
    store : Ext.create('Ext.data.JsonStore',{
		autoLoad : false,
		fields : ['id','name','type','size','percent','status','fileName']
    }),
    listeners:{
		beforeselect:function( self, record, index, eOpts){
			if(record.data.status=='-4'){ //如果该记录状态为已经完成则不允许选择
				return false;
			}
		},
		selectionchange:function( self, record, index, eOpts ){
			if(record.length>0){
				this.down('#removeBtn').setDisabled(false);//如果选择的记录数>0则开启删除按钮
			}else{
				this.down('#removeBtn').setDisabled(true);//否则禁用删除按钮
			}
		}
    },
	addFileBtnText : '添加文件',
	uploadBtnText : '开始上传',
	removeBtnText : '移除文件',
	cancelBtnText : '取消上传',
	debug : false,
	file_size_limit : 100,//MB
	file_types : '*.*',
	file_types_description : 'All Files',
	file_upload_limit : 50,
	file_queue_limit : 0,
	post_params : {},
	upload_url : '',
	flash_url : "public/swfupload/swfupload.swf",
	flash9_url : "public/swfupload/swfupload_fp9.swf",
	initComponent : function(){
		this.dockedItems = [{
		xtype: 'toolbar',
		dock: 'top',
		items: [
			'->',
			{
				xtype:'button',
				itemId: 'addFileBtn',
				id : '_btn_for_swf_',
				text : this.addFileBtnText
			},{
				xtype : 'button',
				itemId : 'uploadBtn',
				text : this.uploadBtnText,
				scope : this,
				disabled : true,
				handler : this.onUpload
			},{
				xtype : 'button',
				itemId : 'removeBtn',
				disabled : true,
				text : this.removeBtnText,
				scope : this,
				handler : this.onRemove
			},{
				xtype : 'button',
				itemId : 'cancelBtn',
				disabled : true,
				text : this.cancelBtnText,
				scope : this,
				handler : this.onCancelUpload
			}
		]
		}];
		this.callParent();
		this.down('button[itemId=addFileBtn]').on({
			afterrender : function(btn){
				var config = this.getSWFConfig(btn);
				this.swfupload = new SWFUpload(config);
				Ext.get(this.swfupload.movieName).setStyle({
					position : 'absolute',
					top : 0,
					left : -2
				});
			},
			scope : this,
			buffer:300
		});
	},
	getSWFConfig : function(btn){
		var me = this;
		var placeHolderId = Ext.id();
		var em = btn.getEl().child('em');
		if(em==null){
			em = Ext.get(btn.getId()+'-btnWrap');
		}
		em.setStyle({
			position : 'relative',
			display : 'block'
		});
		em.createChild({
			tag : 'div',
			id : placeHolderId
		});
		return {
			debug: me.debug,
			flash_url : me.flash_url,
			flash9_url : me.flash9_url,
			upload_url: me.upload_url,
			post_params: me.post_params||{savePath:'upload\\'},
			file_size_limit : (me.file_size_limit*1024),
			file_types : me.file_types,
			file_types_description : me.file_types_description,
			file_upload_limit : me.file_upload_limit,
			file_queue_limit : me.file_queue_limit,
			button_width: em.getWidth(),
			button_height: em.getHeight(),
			button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
			button_cursor: SWFUpload.CURSOR.HAND,
			button_placeholder_id: placeHolderId,
			custom_settings : {
				scope_handler : me
			},
			swfupload_preload_handler : me.swfupload_preload_handler,//
			swfupload_load_failed_handler : me.swfupload_load_failed_handler,//
			swfupload_loaded_handler : me.swfupload_loaded_handler,
			file_dialog_start_handler : me.file_dialog_start_handler,
			file_queued_handler : me.file_queued_handler,
			file_queue_error_handler : me.file_queue_error_handler,
			file_dialog_complete_handler : me.file_dialog_complete_handler,
			upload_start_handler : me.upload_start_handler,
			upload_progress_handler : me.upload_progress_handler,
			upload_error_handler : me.upload_error_handler,
			upload_success_handler : me.upload_success_handler,
			upload_complete_handler : me.upload_complete_handler
		};
	},
	swfupload_preload_handler : function(){
		console.log('1.swfupload_preload_handler');
		if (!this.support.loading) {
			Ext.Msg.show({
				title : '提示',
				msg : '浏览器Flash Player版本太低,不能使用该上传功能！',
				width : 250,
				icon : Ext.Msg.ERROR,
				buttons :Ext.Msg.OK
			});
			return false;
		}
	},
	swfupload_load_failed_handler : function(){
		Ext.Msg.show({
			title : '提示',
			msg : 'SWFUpload加载失败！',
			width : 180,
			icon : Ext.Msg.ERROR,
			buttons :Ext.Msg.OK
		});
	},
	swfupload_loaded_handler : function(){
		console.log('2.swfupload_loaded_handler');
	},
	file_dialog_start_handler : function(){
		console.log('3.file_dialog_start_handler');
	},
	file_queued_handler : function(file){ //文件列队
		console.log('4.file_queued_handler');
		var me = this.settings.custom_settings.scope_handler;
		var filename = file.name.split('.');
		filename.pop();
		filename = filename.join('.');
		me.store.add({
			id : file.id,
			name : file.name,
			fileName : filename,
			size : file.size,
			type : file.type,
			status : file.filestatus,
			percent : 0
		});
	},
	file_dialog_complete_handler : function(){
		console.log('5.file_dialog_complete_handler');

		var me = this.settings.custom_settings.scope_handler;
		if(me.store.getCount()>0){
			var ok = 0;
			me.store.each(function(record){
				if(record.data.status!='-4'){
					ok++;
				}
			});
			if(ok>0){
				me.down('#uploadBtn').setDisabled(false);
			}else{
				me.down('#uploadBtn').setDisabled(true);
			}
		}else{
			me.down('#uploadBtn').setDisabled(true);
		}
	},
	file_queue_error_handler : function(file, errorCode, message){ //文件列队错误
		console.log('6.file_queue_error_handler');
		switch(errorCode){
			case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED : msg('上传文件列表数量超限,不能选择！');
			break;
			case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT : msg('所选文件大小超过限制, 不能选择！');
			break;
			case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE : msg('文件大小为0,不能选择！');
			break;
			case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE : msg('文件类型不允许上传！');
			break;
		}
		function msg(info){
			Ext.Msg.show({
				title : '提示',
				msg : info,
				width : 250,
				icon : Ext.Msg.WARNING,
				buttons :Ext.Msg.OK
			});
		}
	},
	upload_start_handler : function(file){ //开始上传
		console.log('6.upload_start_handler');
		var me = this.settings.custom_settings.scope_handler;
		var rec = me.store.getById(file.id);
		this.setFilePostName(encodeURIComponent(rec.get('fileName')));
	},
	upload_progress_handler : function(file, bytesLoaded, bytesTotal){ //上传文件进度
		console.log('7.upload_progress_handler');
		var me = this.settings.custom_settings.scope_handler;
		var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);
		percent = percent == 100? 99 : percent;
		var rec = me.store.getById(file.id);
		rec.set('percent', percent);
		rec.set('status', file.filestatus);
		rec.commit();
	},
	upload_error_handler : function(file, errorCode, message){ //上传文件失败
		console.log('upload_error_handler');
		var me = this.settings.custom_settings.scope_handler;
		var rec = me.store.getById(file.id);
		rec.set('percent', 0);
		rec.set('status', file.filestatus);
		rec.commit();
	},
	upload_success_handler : function(file, serverData, responseReceived){ //上传文件成功
		console.log('8.upload_success_handler');
		var me = this.settings.custom_settings.scope_handler;
		var rec = me.store.getById(file.id);
		if(Ext.JSON.decode(serverData).status){
			rec.set('percent', 100);
			rec.set('status', file.filestatus);
		}else{
			rec.set('percent', 0);
			rec.set('status', SWFUpload.FILE_STATUS.ERROR);
		}
		rec.commit();
		if (this.getStats().files_queued > 0 && this.uploadStopped == false) {
			this.startUpload();
		}else{

		}
	},
	upload_complete_handler : function(file){ //上传文件结束
		console.log('9.upload_complete_handler');
		var me = this.settings.custom_settings.scope_handler;
		this.uploadStopped = false;   //设置状态为 开启
		this.setButtonDisabled(false);
		var stats = this.getStats();
		// console.log(stats);
		if(stats.files_queued===0){
			me.down('#addFileBtn').setDisabled(false); //启用添加按钮
			me.down('#uploadBtn').setDisabled(true); //禁用上传按钮
			me.down('#cancelBtn').setDisabled(true); //禁用取消按钮
		}
	},
	onUpload : function(){ //上传操作
		if (this.swfupload&&this.store.getCount()>0) {
			if (this.swfupload.getStats().files_queued > 0) {
				this.swfupload.uploadStopped = false;   //设置状态为 开启
				this.swfupload.startUpload(); //开始上传
				this.swfupload.setButtonDisabled(true); //禁用添加文件
				this.getSelectionModel().deselectAll(); //取消选中记录
				this.down('#uploadBtn').setDisabled(true); //禁用上传按钮
				this.down('#addFileBtn').setDisabled(true); //禁用添加按钮
				this.down('#cancelBtn').setDisabled(false); //启用取消按钮
			}
		}
	},
	onRemove : function(){ //删除操作
		var sm = this.getSelectionModel().getSelection(); //获取选中记录
		var st = this.store; //获取数据集
		for(var i=0;i<sm.length;i++){ //遍历选中记录
			st.remove(sm[i]); //从数据集中删除选中记录
			this.swfupload.cancelUpload(sm[i].data.id,false); //从上传列队中删除选中文件
		}
		this.getView().refresh(); //更新视图
		this.swfupload.uploadStopped = false;  //设置状态为 开启
		var ok = 0;
		st.each(function(record){
			if(record.data.status!='-4'){
				ok++;
			}
		});
		if(ok>0){
			this.down('#uploadBtn').setDisabled(false);
		}else{
			this.down('#uploadBtn').setDisabled(true);
		}
	},
	onCancelUpload : function(){ //取消上传操作
		if (this.swfupload) {
			this.swfupload.uploadStopped = true; //设置状态为 停止
			this.swfupload.stopUpload(); //停止上传
			this.down('#uploadBtn').setDisabled(false); //启用上传按钮
			this.down('#cancelBtn').setDisabled(true); //禁用取消上传按钮
			this.down('#addFileBtn').setDisabled(false); //启用添加按钮
		}
	},
	changeUploadStatus : function(){
		var st = this.store; //获取数据集
		var ok = 0;
		st.each(function(record){
			if(record.data.status!='-4'){
				ok++;
			}
		});
		if(ok>0){
			this.down('#uploadBtn').setDisabled(false);
		}else{
			this.down('#uploadBtn').setDisabled(true);
		}
	}
});