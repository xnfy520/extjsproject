Ext.define('Xnfy.view.Configuration', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Xnfy.util.common'
    ],
    alias: 'widget.configuration',
    layout: {
        type: 'fit'
    },
    title: 'Tab',
    closable: true,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [{
                        xtype: 'gridpanel',
                        selType:'checkboxmodel',
                        selModel: {
                            injectCheckbox:'last'
                        },
                        //store: Ext.data.StoreManager.lookup('Configuration'),
                        plugins: [
                            Ext.create('Ext.grid.plugin.RowEditing',{
                                pluginId:'rowediting',
                                clicksToMoveEditor: 1,
                                autoCancel: false,
                                errorSummary:false,
                                listeners: {
                                    cancelEdit: function(editor, context) {
                                        console.log('cancelEdit');
                                        editor.grid.getDockedItems('toolbar [itemId=delete]')[0].setDisabled(false);
                                        if (context.record.phantom) {
                                            editor.grid.getStore().remove(context.record);
                                            editor.grid.getDockedItems('toolbar [itemId=add]')[0].setDisabled(false);
                                        }
                                    },
                                    beforeedit:function(editor, context){
                                        console.log('beforeedit');
                                    },
                                    edit:function(editor, context){
                                        console.log('edit');
                                        if(context.record.phantom){
                                            Ext.Ajax.request({
                                                url:"admin/configuration/insert",
                                                method:'POST',
                                                params:context.record.data,
                                                callback:function(records, operation, success){
                                                    var response = Ext.JSON.decode(success.responseText);
                                                    if(response.success){
                                                        context.record.commit();
                                                        editor.grid.getDockedItems('toolbar [itemId=add]')[0].setDisabled(false);
                                                        Ext.create('Xnfy.util.common').uxNotification(true,response.msg);
                                                        return false;
                                                    }
                                                }
                                            });
                                        }else{
                                             if(context.record.dirty){
                                                Ext.Ajax.request({
                                                    url:"admin/configuration/update",
                                                    method:'POST',
                                                    params:context.record.data,
                                                    callback:function(records, operation, success){
                                                        var response = Ext.JSON.decode(success.responseText);
                                                        if(response.success){
                                                            context.record.commit();
                                                            editor.grid.getDockedItems('toolbar [itemId=add]')[0].setDisabled(false);
                                                            Ext.create('Xnfy.util.common').uxNotification(true,response.msg);
                                                            return false;
                                                        }
                                                    }
                                                });
                                             }
                                        }
                                    },
                                    validateedit:function(editor, e){
                                        console.log('validateedit');
                                        var keys = [];
                                        var indexs = [];
                                        var store = editor.grid.getStore();
                                        var keysexist = false;
                                        var indexsexist = false;
                                        store.each(function(r,i){
                                            if(i!=e.rowIdx){
                                                keys.push(r.data.key);
                                                indexs.push(r.data.index);
                                            }
                                        },this);
                                        for(var i=0;i<keys.length;i++){
                                            if(e.newValues.key==keys[i]){
                                                keysexist = true;
                                            }
                                        }
                                        for(var s= 0;s<indexs.length;s++){
                                            if(e.newValues.index==indexs[s]){
                                                indexsexist = true;
                                            }
                                        }
                                        if(!e.newValues.key && !e.newValues.index){
                                            Ext.create('Xnfy.util.common').uxNotification(false,'配置项名称和配置项索引必须填写');
                                            return false;
                                        }else if(keysexist && indexsexist){
                                            Ext.create('Xnfy.util.common').uxNotification(false,'配置项名称和配置项索引已经存在');
                                            return false;
                                        }else if(!e.newValues.key){
                                            Ext.create('Xnfy.util.common').uxNotification(false,'配置项名称不能为空');
                                            return false;
                                        }else if(keysexist){
                                            Ext.create('Xnfy.util.common').uxNotification(false,'配置项名称已经存在');
                                            return false;
                                        }else if(!e.newValues.index){
                                            Ext.create('Xnfy.util.common').uxNotification(false,'配置项索引不能为空');
                                            return false;
                                        }else if(indexsexist){
                                            Ext.create('Xnfy.util.common').uxNotification(false,'配置项索引已经存在');
                                            return false;
                                        }else{
                                            return true;
                                        }
                                    }
                                }
                            })
                        ],
                        columns: {
                            defaults:{
                                sortable: false
                            },
                            items:[
                                {
                                    text: '配置项名称',
                                    dataIndex: 'key',
                                    width:150,
                                    field: {
                                        xtype: 'textfield',
                                        //allowBlank: false
                                        emptyText:'配置项名称'
                                    }
                                },
                                {
                                    text: '配置项索引',
                                    dataIndex: 'index',
                                    width:150,
                                    field: {
                                        xtype: 'textfield',
                                        //allowBlank: false
                                        emptyText:'配置项索引',
                                        stripCharsRe:new RegExp(/[\W]/i)
                                    }
                                },
                                {
                                    text: '值',
                                    flex: 1,
                                    dataIndex: 'value',
                                    field: {
                                        xtype: 'textfield',
                                        emptyText:'值'
                                    }
                                }
                            ]
                        },
                        dockedItems: [
                            {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    xtype: 'tbfill'
                                },
                                {
                                    itemId:'add',
                                    xtype: 'button',
                                    text: '添加配置项',
                                    handler:function(button){
                                        var gridpanel = button.up('gridpanel');
                                        var store = gridpanel.getStore();
                                        var count = store.getCount();
                                        if(count>0){
                                            if(!store.data.items[count-1].phantom){
                                                gridpanel.getStore().insert(count,Ext.create('Xnfy.model.Configuration'));
                                                gridpanel.getPlugin('rowediting').startEdit(count, 0);
                                            }
                                        }else{
                                            gridpanel.getStore().insert(0,Ext.create('Xnfy.model.Configuration'));
                                            gridpanel.getPlugin('rowediting').startEdit(0, 0);
                                        }
                                        button.setDisabled(true);
                                    }
                                },
                                {
                                    itemId:'delete',
                                    xtype: 'button',
                                    text: '删除配置项',
                                    disabled:true,
                                    listeners:{
                                        scope:this,
                                        click:function(button){
                                            console.log('delete');
                                            var gridpanel = button.up('gridpanel');
                                            var datas = gridpanel.getSelectionModel().getSelection();
                                            var count = gridpanel.getSelectionModel().getCount();
                                            if(count<=0){
                                                Ext.create('Xnfy.util.common').uxNotification(false,'请选择要删除的数据');
                                                return false;
                                            }else if(count==1 && datas[0].phantom){
                                                gridpanel.getStore().remove(datas[0]);
                                            }else{
                                                var indexs = [];
                                                Ext.Array.forEach(datas,function(item,index,all){
                                                    indexs.push(item.data.index);
                                                });
                                                Ext.MessageBox.show({
                                                    title:'删除数据?',
                                                    msg: '确认删除所选数据?',
                                                    buttons: Ext.MessageBox.YESNO,
                                                    buttonText:{
                                                        yes: "确认",
                                                        no: "取消"
                                                    },
                                                    fn: function(btn){
                                                        if(btn=='yes'){
                                                            if(indexs.length>0){
                                                                 Ext.Ajax.request({
                                                                    url:"admin/configuration/delete",
                                                                    method:'POST',
                                                                    params:{datas:indexs.toString()},
                                                                    callback:function(records, operation, success){
                                                                        var response = Ext.JSON.decode(success.responseText);
                                                                        if(response.success){
                                                                            gridpanel.getStore().remove(datas);
                                                                            Ext.create('Xnfy.util.common').uxNotification(true,response.msg);
                                                                            return false;
                                                                        }else{
                                                                            Ext.create('Xnfy.util.common').uxNotification(false,response.msg);
                                                                            return false;
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            ]
                            }
                        ],
                        listeners:{
                            scope:this,
                            selectionchange:function(self, selected){
                                console.log('selectionchange');
                                var grid = this.child('gridpanel');
                                var count = grid.getSelectionModel().getCount();
                                if(count>0){
                                    grid.getDockedItems('toolbar [itemId=delete]')[0].setDisabled(false);
                                }else{
                                    grid.getDockedItems('toolbar [itemId=delete]')[0].setDisabled(true);
                                }
                            },
                            beforedeselect:function( self, record, index, eOpts ){
                                console.log('beforedeselect');
                                if(record.phantom){
                                    var store = this.child('gridpanel').getStore();
                                    store.remove(record);
                                }
                            }
                        }
                }],
                listeners:{
                    scope:this,
                    activate:function(self){
                        //console.log('haha');
                    }
                }
        });
        me.callParent(arguments);
    }

});

var config = {

    };