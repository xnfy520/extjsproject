Ext.define('Xnfy.view.FileManage', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.ux.ProgressBarPager',
        'Xnfy.util.common'
    ],
    alias: 'widget.filemanage',
    layout: {
        type: 'border'
    },
    title: 'Tab',
    closable: true,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'gridpanel',
                    selType:'checkboxmodel',
                    selModel: {
                        injectCheckbox:'last'
                    },
                    region: 'center',
                    border:false,
                    style: {
                        borderStyle: 'solid',
                        borderWidth:"0 5px 0 0",
                        borderColor:"#ADD2ED"
                    },
                    columns: [
                        {
                            text: '#',
                            dataIndex: 'id',
                            width:60,
                            hidden:true
                        },
                        {
                            text: '分类名称',
                            dataIndex: 'title',
                            flex: 1
                        },
                        {
                            text: '启用',
                            dataIndex: 'enabled',
                            align:'center',
                            renderer:function(value){
                                if(value){
                                    if(value==1){
                                        return '<span style="color:blue">是</span>';
                                    }else{
                                        return '<span style="color:red">否</span>';
                                    }
                                }
                            }
                        },
                        {
                            text: '创建时间',
                            dataIndex: 'create_date',
                            align:'center',
                            xtype: 'datecolumn',
                            width:150,
                            hidden:true,
                            renderer:function(value){
                                if(value){
                                    var v = Ext.util.Format.date(new Date(parseInt(value,0)*1000),"Y-m-d H:i:s");
                                    return '<span style="color:red">'+v+'</span>';
                                }else{
                                    return '<span style="text-align:center">-</span>';
                                }
                            }
                        },
                        {
                            text: '修改时间',
                            dataIndex: 'modify_date',
                            align:'center',
                            xtype: 'datecolumn',
                            width:150,
                            hidden:true,
                            renderer:function(value){
                                if(value){
                                    var v = Ext.util.Format.date(new Date(parseInt(value,0)*1000),"Y-m-d H:i:s");
                                    return '<span style="color:blue">'+v+'</span>';
                                }else{
                                    return '<span style="text-align:center">-</span>';
                                }
                            }
                        }
                    ],
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    xtype: 'searchfield',
                                    emptyText: '输入搜索关字',
                                    store:Ext.create('Xnfy.store.ClassifyList'),
                                    width:300
                                },
                                {
                                    xtype: 'tbfill'
                                },
                                {
                                    itemId:'add',
                                    id:'upload',
                                    xtype: 'button',
                                    text: '上传文件',
                                    iconCls:'icon-file',
                                    listeners:{
                                        scope:this,
                                        click:function(button){
                                            var gridpanel = button.up('gridpanel');
                                            var gridselectionmodel = gridpanel.getSelectionModel();
                                            if(gridselectionmodel.getCount()>0){
                                                gridselectionmodel.deselectAll(true);
                                            }
                                            gridpanel.getDockedItems('toolbar [itemId=delete]')[0].setDisabled(true);
                                            var upanel = Ext.create('Ext.ux.uploadPanel',{
                                               // title : 'UploadPanel for extjs 4.0',
                                               // addFileBtnText : '选择文件...',
                                               // uploadBtnText : '上传',
                                               // removeBtnText : '移除所有',
                                               // cancelBtnText : '取消上传',
                                               // file_size_limit : 10000,//MB
                                               upload_url : 'admin/common/upload'
                                            });

                                            var upcmp = Ext.getCmp('fileupload');
                                            if(upcmp){
                                                upcmp.show();
                                            }else{
                                                var win = Ext.create('Ext.window.Window', {
                                                    id:'fileupload',
                                                    title: '文件上传',
                                                    animateTarget:'upload',
                                                    minimizable:true,
                                                    maximizable:false,
                                                    constrain: true,
                                                    resizable:false,
                                                    closeAction:'close',
                                                    // layout: 'fit',
                                                    items: {  // Let's put an empty grid in just to illustrate fit layout
                                                        xtype: upanel
                                                    },
                                                    listeners: {
                                                            minimize: function () {
                                                                this.hide();
                                                            }
                                                        }
                                                });
                                                win.show();
                                            }
                                        }
                                    }
                                },
                                {
                                    itemId:'edit',
                                    xtype: 'button',
                                    text: '修改文件',
                                    iconCls:'icon-edit',
                                    disabled:true,
                                    listeners:{
                                        scope:this,
                                        click:function(button){
                                        }
                                    }
                                },
                                {
                                    itemId:'delete',
                                    xtype: 'button',
                                    text: '删除文件',
                                    iconCls:'icon-trash',
                                    disabled:true,
                                    listeners:{
                                        scope:this,
                                        click:function(t){
                                            var gridpanel = t.up('gridpanel');
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'pagingtoolbar',
                            dock: 'bottom',
                            width: 360,
                            displayInfo: true,
                            plugins: Ext.create('Ext.ux.ProgressBarPager', {})
                        }
                    ],
                    listeners:{
                        scope:this,
                        selectionchange:function(t, r){
                        },
                        celldblclick:function(){
                        }
                    }
                }
            ]
        });
        me.callParent(arguments);
    }

});