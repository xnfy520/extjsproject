Ext.define('Xnfy.view.ClassifyList', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.ux.ProgressBarPager',
        'Xnfy.util.common'
    ],
    alias: 'widget.classifylist',
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
                        { text: '分类索引',  dataIndex: 'indexing' },
                        {
                            text: '叶子',
                            dataIndex: 'leaf',
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
                            text: '子类数量',
                            dataIndex: 'number',
                            align:'center'
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
                            hidden:true,
                            align:'center',
                            xtype: 'datecolumn',
                            width:150,
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
                                    xtype: 'button',
                                    text: '添加分类',
                                    iconCls:'icon-file',
                                    listeners:{
                                        scope:this,
                                        click:function(button){
                                            var gridpanel = button.up('gridpanel');
                                            var form = gridpanel.nextSibling('form');
                                            var gridselectionmodel = gridpanel.getSelectionModel();
                                            if(gridselectionmodel.getCount()>0){
                                                gridselectionmodel.deselectAll(true);
                                            }
                                            if(form.getForm().findField('id')){
                                                form.remove(form.getForm().findField('id'));
                                                gridpanel.getDockedItems('toolbar [itemId=edit]')[0].setDisabled(true);
                                            }
                                            gridpanel.getDockedItems('toolbar [itemId=delete]')[0].setDisabled(true);
                                            form.setTitle('添加 分类');
                                            form.getForm().reset();
                                            form.expand();
                                        }
                                    }
                                },
                                {
                                    itemId:'edit',
                                    xtype: 'button',
                                    text: '修改分类',
                                    iconCls:'icon-edit',
                                    disabled:true,
                                    listeners:{
                                        scope:this,
                                        click:function(button){
                                            button.up('gridpanel').nextSibling('form').expand();
                                        }
                                    }
                                },
                                {
                                    itemId:'delete',
                                    xtype: 'button',
                                    text: '删除分类',
                                    iconCls:'icon-trash',
                                    disabled:true,
                                    listeners:{
                                        scope:this,
                                        click:function(t){
                                            var gridpanel = t.up('gridpanel');
                                            var form = gridpanel.nextSibling('form');
                                            if(gridpanel.getSelectionModel().getCount()<=0){
                                                Ext.create('Xnfy.util.common').uxNotification(false,'请选择要删除的数据');
                                                return false;
                                            }
                                            var datas = gridpanel.getSelectionModel().getSelection();
                                            var titles = [];
                                            var ids = [];
                                            var flag = false;
                                            Ext.Array.forEach(datas,function(item,index,all){
                                                if(item.data.number>0){
                                                    titles.push(item.data.title);
                                                }else{
                                                    ids.push(parseInt(item.internalId,0));
                                                }
                                                if(form.getForm().findField('id') && form.getForm().findField('id').value==item.internalId){
                                                    flag = true;
                                                }
                                            });
                                            if(ids.length<=0){
                                                Ext.create('Xnfy.util.common').uxNotification(false,'所选分类下还有子类不能被删除');
                                                return false;
                                            }
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
                                                        if(ids.length>0){
                                                            Ext.Ajax.request({
                                                                url:"admin/classify/delete",
                                                                method:'POST',
                                                                params:{ids:ids.toString()},
                                                                callback:function(records, operation, success){

                                                                    var response = Ext.JSON.decode(success.responseText);
                                                                    if(response.success){

                                                                        var center = Ext.getCmp("center");
                                                                        center.items.each(function(i){
                                                                            if(i.class && i.class=='classify'){
                                                                                i.child('gridpanel').getStore().reload({params:{pid:i.openid}});
                                                                                i.child('gridpanel').getSelectionModel().deselectAll();
                                                                            }
                                                                        });

                                                                        var menuc = Ext.ComponentQuery.query('xnfymenu [itemId=ClassifyMenu]')[0];
                                                                        var menud = menuc.getRootNode();

                                                                        if(menud.isExpanded() || menud.isLoaded()){
                                                                            for(i=0;i<ids.length;i++){
                                                                                var node = menud.findChild('id',ids[i],true);
                                                                                if(node){
                                                                                    Ext.create('Xnfy.util.common').unRemoveNodeTab(node);
                                                                                }
                                                                            }
                                                                        }
                                                                        // gridpanel.child('pagingtoolbar').getStore().load({
                                                                        //     callback:function(){
                                                                                if(flag){
                                                                                    form.setTitle('添加 分类');
                                                                                    if(form.getForm().findField('id')){
                                                                                        form.getForm().findField('id').destroy();
                                                                                    }
                                                                                    form.getForm().reset();
                                                                                }
                                                                            // }
                                                                        // });
                                                                        gridpanel.getSelectionModel().deselectAll();
                                                                        if(titles.length>0){
                                                                            var li = '';
                                                                            for(var s=0;s<titles.length;s++){
                                                                                li+='<li>'+titles[s]+'</li>';
                                                                            }
                                                                            Ext.create('Xnfy.util.common').uxNotification(true,'删除数据成功<div style="text-align:left;margin:0"><p style="margin:0">以下分类还有子类,不能被删除</p><ul style="margin:0;list-style-type:decimal;color:red">'+li+'</ul></div>',5000);
                                                                        }else{
                                                                            Ext.create('Xnfy.util.common').uxNotification(true,'删除数据成功');
                                                                        }
                                                                    }else{
                                                                        Ext.create('Xnfy.util.common').uxNotification(false,'删除数据失败');
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    }
                                                },
                                                icon: Ext.MessageBox.QUESTION
                                            });
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
                            if(r.length>0){
                                var form = this.child('form');
                                form.setTitle('修改 分类');
                                if(!form.getForm().findField('id')){
                                    form.insert(0, {xtype:'hiddenfield',name:'id'});
                                }
                                form.getForm().loadRecord(t.lastSelected);
                                //form.getForm().load({url:'admin/classify/getdata',params:{id:t.lastSelected.internalId}});
                                if(this.child('form').getCollapsed()){
                                    this.child('gridpanel').getDockedItems('toolbar [itemId=edit]')[0].setDisabled(false);
                                }else{
                                    this.child('gridpanel').getDockedItems('toolbar [itemId=edit]')[0].setDisabled(true);
                                }
                                this.child('gridpanel').getDockedItems('toolbar [itemId=delete]')[0].setDisabled(false);
                            }else{
                                this.child('gridpanel').getDockedItems('toolbar [itemId=edit]')[0].setDisabled(true);
                                this.child('gridpanel').getDockedItems('toolbar [itemId=delete]')[0].setDisabled(true);
                            }

                        },
                        celldblclick:function(){
                            var form = this.child('form');
                            form.toggleCollapse();
                        }
                    }
                },
                {
                    xtype: 'form',
                    region: 'east',
                    split: false,
                    width: 250,
                    bodyPadding: 10,
                    collapsed: true,
                    collapsible: true,
                    title: '',
                    border:false,
                    autoScroll:true,
                    defaultType: 'textfield',
                    fieldDefaults: {
                        labelAlign: 'top',
                        anchor: '100%',
                        labelStyle: 'font-weight:bold;padding-bottom:5px'
                        // msgTarget:'side'
                    },
                    items: [
                        // {
                        //     xtype:'hiddenfield',
                        //     name:'id'
                        // },
                        {
                            fieldLabel: '分类名称',
                            labelAlign: 'top',
                            allowBlank: false,
                            emptyText:'分类名称',
                            name:'title',
                            maxLength:15
                        },
                        {
                            fieldLabel: '分类索引',
                            labelAlign: 'top',
                            name:'indexing',
                            allowBlank: true,
                            emptyText:'分类索引',
                            stripCharsRe:new RegExp(/[\W]/i),
                            maxLength:15
                        },{
                            xtype: 'combobox',
                            name:"leaf",
                            //allowBlank: false,
                            fieldLabel:'叶　　子',
                            emptyText : '请选择',
                            mode : 'local',// 数据模式，local代表本地数据
                            //readOnly : false,// 是否只读
                            editable : false,// 是否允许输入
                            //forceSelection : true,// 必须选择一个选项
                            //blankText : '请选择',// 该项如果没有选择，则提示错误信息,
                            store:Ext.create('Ext.data.Store', {
                                fields: ['text', 'enabled'],
                                data : [
                                    {"text":"是", "enabled":1},
                                    {"text":"否", "enabled":0}
                                ]
                            }),
                            value:0,
                            displayField:'text',
                            valueField:'enabled',
                            listeners: {
                              change:function(combo,n,o){
                                if(n==1){
                                    combo.setValue(combo.store.getAt(0));
                                }else{
                                    combo.setValue(combo.store.getAt(1));
                                }
                              }
                            }
                        },{
                            xtype: 'combobox',
                            name:"enabled",
                            //allowBlank: false,
                            fieldLabel:'启　　用',
                            emptyText : '请选择',
                            mode : 'local',// 数据模式，local代表本地数据
                            //readOnly : false,// 是否只读
                            editable : false,// 是否允许输入
                            //forceSelection : true,// 必须选择一个选项
                            //blankText : '请选择',// 该项如果没有选择，则提示错误信息,
                            store:Ext.create('Ext.data.Store', {
                                fields: ['text', 'enabled'],
                                data : [
                                    {"text":"是", "enabled":1},
                                    {"text":"否", "enabled":0}
                                ]
                            }),
                            value:1,
                            displayField:'text',
                            valueField:'enabled',
                            listeners: {
                              change:function(combo,n,o){
                                if(n==1){
                                    combo.setValue(combo.store.getAt(0));
                                }else{
                                    combo.setValue(combo.store.getAt(1));
                                }
                              }
                            }
                        },{
                            xtype: 'textareafield',
                            name:'remark',
                            fieldLabel: '备　　注',
                            height: 120,
                            margin: '0',
                            allowBlank: true,
                            msgTarget:'under',
                            maxLength:200
                        }
                    ],
                    listeners:{
                        collapse:function(p){
                            if(p.getForm().findField('id')){
                                this.ownerCt.child('gridpanel').getDockedItems('toolbar [itemId=edit]')[0].setDisabled(false);
                            }
                        },
                        expand:function(p){
                            this.ownerCt.child('gridpanel').getDockedItems('toolbar [itemId=edit]')[0].setDisabled(true);
                        }
                    },
                    buttons: [{
                        text: '重置',
                        formBind: true,
                        handler:function(button){
                            var bt = button.ownerCt.ownerCt;
                            if(bt.getForm().findField('id')){
                                bt.getForm().load({url:'admin/classify/getData',params:{id:bt.getForm().findField('id').value}});
                            }else{
                                bt.getForm().reset();
                            }
                        }
                    },{xtype: 'tbfill'},
                    {
                        text: '提交',
                        formBind: true,
                        handler:function(button){
                            var panel = button.up('form').up('panel');
                            var pid = panel.openid; //获取当前pid
                            var form = button.up('form'); //获取表单组件
                            var menuc = Ext.ComponentQuery.query('xnfymenu [itemId=ClassifyMenu]')[0]; //获取分类列表
                            var menud = menuc.getRootNode();
                            var center = Ext.getCmp("center");
                            if(pid!==0){
                                menud = menuc.getRootNode().findChild('id',pid,true); //获取当前pid节点
                            }
                            if(form.getForm().findField('id') && form.getForm().findField('id').value>0){
                                var rcord = panel.child('gridpanel').getStore().findRecord('id',form.getForm().findField('id').value);
                                if(rcord.data.number>0 && form.getForm().findField('leaf').value==1){
                                    Ext.create('Xnfy.util.common').uxNotification(false,'此分类下还有子类,不能修改为叶子',3000);
                                    return false;
                                }
                                form.getForm().submit({
                                    waitMsg:'正在处理数据...',
                                    method:'POST',
                                    url:'admin/classify/update',
                                    submitEmptyText:false,
                                    success:function(f, response){
                                        panel.child('gridpanel').getDockedItems('pagingtoolbar')[0].getStore().reload();
                                        var tab = center.getComponent('Xnfy.model.ClassifyMenu-'+response.result.data.id);
                                        if(menud.isExpanded() || menud.isLoaded()){
                                            if(response.result.data.leaf==1){
                                                response.result.data.leaf = true;
                                                if(tab){
                                                    tab.close();
                                                }
                                            }else{
                                                response.result.data.leaf = false;
                                                if(tab){
                                                    tab.setTitle(response.result.data.title);
                                                }
                                            }
                                            menuc.getRootNode().findChild('id',response.result.data.id,true).updateInfo(true,response.result.data);
                                        }
                                        Ext.create('Xnfy.util.common').uxNotification(true,'修改数据成功',3000);
                                    },
                                    failure:function(f, response){
                                        Ext.create('Xnfy.util.common').uxNotification(false,response.result.errors.msg,5000);
                                    }
                                });
                            }else{
                                form.getForm().submit({
                                        params:{pid:pid},
                                        waitMsg:'正在处理数据...',
                                        method:'POST',
                                        submitEmptyText:false,
                                        url:'admin/classify/insert',
                                        success:function(f, response){
                                            // panel.child('gridpanel').getDockedItems('pagingtoolbar')[0].getStore().loadPage(1);
                                            if(menud.isExpanded() || menud.isLoaded()){
                                                menud.insertChild(0,response.result.data);
                                            }
                                            // var pids = menud.data.parentId;
                                            // var pgrid = center.getComponent('Xnfy.model.ClassifyMenu-'+pids);
                                            // if(pgrid){
                                            //     var record = pgrid.child('gridpanel').getStore().findRecord('id',pid);
                                            //     if(record){
                                            //         pgrid.child('gridpanel').getStore().reload({params:{pid:pids}});
                                            //     }
                                            // }
                                            var center = Ext.getCmp("center");
                                            center.items.each(function(i){
                                                if(i.class && i.class=='classify'){
                                                    i.child('gridpanel').getStore().reload({params:{pid:i.openid}});
                                                    i.child('gridpanel').getSelectionModel().deselectAll();
                                                }
                                            });
                                            form.getForm().reset();
                                            Ext.create('Xnfy.util.common').uxNotification(true,'添加数据成功',3000);
                                        },
                                        failure:function(f, response){
                                            Ext.create('Xnfy.util.common').uxNotification(false,response.result.errors.msg,5000);
                                        }
                                    });
                            }
                        }
                    }]
                }
            ]
        });
        me.callParent(arguments);
    }

});