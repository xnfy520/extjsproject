Ext.define('Xnfy.view.UserList', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.ux.ProgressBarPager',
        'Xnfy.util.common'
    ],
    alias: 'widget.userlist',
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
                            text: '用户名',
                            dataIndex: 'username',
                            flex: 1
                        },
                        {
                            text: '邮箱',
                            width:200,
                            dataIndex: 'email'
                        },
                        {
                            text: '启用',
                            width:70,
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
                            text: '注册日期',
                            dataIndex: 'register_date',
                            // align:'center',
                            xtype: 'datecolumn',
                            width:150,
                            renderer:function(value){
                                if(value){
                                    var v = Ext.util.Format.date(new Date(parseInt(value,0)*1000),"Y-m-d H:i:s");
                                    return v;
                                }else{
                                    return '';
                                }
                            }
                        },
                        {
                            text: '最后登录',
                            dataIndex: 'last_login_date',
                            hidden:false,
                            // align:'center',
                            xtype: 'datecolumn',
                            width:150,
                            renderer:function(value){
                                if(value){
                                    var v = Ext.util.Format.date(new Date(parseInt(value,0)*1000),"Y-m-d H:i:s");
                                    return v;
                                }else{
                                    return '';
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
                                    id:'user_search_treepicker',
                                    xtype: 'treepicker',
                                    // fieldLabel:'所属分类',
                                    // flex: 1,
                                    autoScroll:true,
                                    minPickerHeight:'auto',
                                    maxPickerHeight:200,
                                    emptyText:'分组选择',
                                    blankText:'无分组选择',
                                    displayField : 'title',
                                    // value:0,
                                    // margin:'25px 0 0 0',
                                    labelStyle: 'font-weight:bold;padding-bottom:5px',
                                    store:Ext.create('Xnfy.store.UserGroupTree').load({callback:function(records,operation,success){
                                        var search_treepicker = me.queryById('user_search_treepicker');
                                        if(success && records.length>0){
                                            search_treepicker.store.setRootNode({title:'全部用户',id:'0',expanded:true});
                                            search_treepicker.store.getRootNode().appendChild({title:'未分组用户',id:-1,leaf:true});
                                            search_treepicker.setValue('0');
                                        }else{
                                            search_treepicker.disable();
                                        }
                                    }}),
                                    listeners:{
                                        afterrender:function( self, eOpts ){
                                        },
                                        select:function( self, record, eOpts ){
                                            self.collapse();
                                            if(record.data.root){
                                                self.up('gridpanel').getStore().load();
                                            }else if(record.data.id<0){
                                                self.up('gridpanel').getStore().reload({params:{group_id:0}});
                                            }else{
                                                self.up('gridpanel').getStore().reload({params:{group_id:record.data.id}});
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'searchfield',
                                    emptyText: '输入搜索关键字',
                                    store:Ext.create('Xnfy.store.UserList'),
                                    width:200
                                },
                                {
                                    xtype: 'tbfill'
                                },
                                {
                                    itemId:'add',
                                    xtype: 'button',
                                    text: '添加用户',
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
                                            form.setTitle('添加 用户');
                                            form.getForm().findField('password').allowBlank = false;
                                            form.getForm().reset();

                                            var treepicker = form.getForm().findField('group_id');
                                            if(treepicker.disabled){
                                                treepicker.setValue(0);
                                            }else{
                                                var pid = treepicker.getStore().getRootNode().internalId;
                                                treepicker.setValue(pid);
                                            }
                                            form.expand();
                                        }
                                    }
                                },
                                {
                                    itemId:'edit',
                                    xtype: 'button',
                                    text: '修改用户',
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
                                    text: '删除用户',
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
                                            var ids = [];
                                            Ext.Array.forEach(datas,function(item,index,all){
                                                ids.push(parseInt(item.internalId,0));
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
                                                        if(ids.length>0){
                                                            Ext.Ajax.request({
                                                                url:"admin/user/delete",
                                                                method:'POST',
                                                                params:{ids:ids.toString()},
                                                                callback:function(records, operation, success){
                                                                    var response = Ext.JSON.decode(success.responseText);
                                                                    if(response.success){
                                                                        gridpanel.getSelectionModel().deselectAll();
                                                                        gridpanel.getStore().reload();
                                                                        form.setTitle('添加 用户');
                                                                        if(form.getForm().findField('id')){
                                                                            form.getForm().findField('id').destroy();
                                                                        }
                                                                        form.getForm().reset();
                                                                        Ext.create('Xnfy.util.common').uxNotification(true,'删除数据成功');
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
                            var form = this.child('form');
                            if(r.length>0){
                                form.setTitle('修改 用户');
                                if(!form.getForm().findField('id')){
                                    form.insert(0, {xtype:'hiddenfield',name:'id'});
                                }
                                form.getForm().findField('password').allowBlank = true;
                                form.getForm().clearInvalid();

                                var treepicker = form.getForm().findField('group_id');
                                var combobox_avatar = form.getForm().findField('combobox_avatar');

                                form.getForm().loadRecord(t.lastSelected);
                                var pid = treepicker.getStore().getRootNode().internalId;
                                var image = form.queryById('user-avatar');
                                if(treepicker.disabled){
                                    treepicker.setValue(0);
                                }else{
                                    if(t.lastSelected.data.group_id==0){
                                        treepicker.setValue(pid);
                                    }else{
                                        treepicker.setValue(t.lastSelected.data.group_id);
                                    }
                                }
                                if(t.lastSelected.data.avatar!=''){
                                    combobox_avatar.setValue(1);
                                    image.setSrc(t.lastSelected.data.avatar);
                                    image.setVisible(true);
                                }else{
                                    combobox_avatar.setValue(0);
                                    image.hide();
                                    image.setSrc('');
                                }
                                // form.setLoading(false);
                                // form.getForm().load({url:'admin/link/getdata',params:{id:t.lastSelected.internalId}});
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
                    // layout: {
                    //     type: 'vbox'
                    // },
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
                                labelAlign: 'top',
                                anchor:'100%',
                                xtype: 'treepicker',
                                name:'group_id',
                                id:'user-treepicker',
                                fieldLabel:'所属分组',
                                autoScroll:true,
                                minPickerHeight:'auto',
                                maxPickerHeight:200,
                                // value:0,
                                emptyText:'分组选择',
                                blankText:'无分组选择',
                                displayField : 'title',
                                // margin:'25px 0 0 0',
                                labelStyle: 'font-weight:bold;padding-bottom:5px',
                                store:Ext.create('Xnfy.store.UserGroupTree'),
                                listeners:{
                                    afterrender:function( self, eOpts ){
                                        self.store.load({callback:function(records,operation,success){
                                            if(success && records.length>0){
                                                self.store.setRootNode({title:'选择分组',id:0,expanded:true});
                                                self.setValue(0);
                                            }else{
                                                self.store.setRootNode({id:0,title:'无分组选择'});
                                                self.setValue(0);
                                                self.disable();
                                            }
                                        }});
                                    },
                                    beforeshow:function( self, eOpts ){
                                    },
                                    blur:function( self, The, eOpts ){
                                    },
                                    expand:function( field, eOpts ){
                                    },
                                    select:function( self, record, eOpts ){
                                        self.collapse();
                                    }
                                }
                        },
                        {
                            fieldLabel: '用户名',
                            labelAlign: 'top',
                            allowBlank: false,
                            emptyText:'用户名',
                            name:'username',
                            maxLength:15,
                            minLength:5,
                            stripCharsRe:new RegExp(/[^\u4e00-\u9fa5_a-z0-9]/i)
                        },
                        {
                            fieldLabel: '密　　码',
                            inputType:'password',
                            labelAlign: 'top',
                            allowBlank: false,
                            emptyText:'密码',
                            name:'password',
                            maxLength:15,
                            minLength:6,
                            stripCharsRe:new RegExp(/[\s]/i)
                        },
                        {
                            fieldLabel: '邮　　箱',
                            labelAlign: 'top',
                            allowBlank: true,
                            emptyText:'邮箱',
                            name:'email',
                            vtype: 'email'
                        },
                        {
                            xtype:'hiddenfield',
                            // xtype:'textfield',
                            id:'user-avatar-field',
                            name:'avatar',
                            fieldLabel:'头像地址',
                            // hidden:true,
                            labelAlign: 'top',
                            anchor:'100%',
                            labelStyle: 'font-weight:bold;padding-bottom:5px'
                        },{
                            xtype: 'combobox',
                            name:'combobox_avatar',
                            labelAlign: 'top',
                            anchor:'100%',
                            id:'user-avatar-combobox',
                            //allowBlank: false,
                            fieldLabel:'用户头像',
                            emptyText : '选择头像',
                            mode : 'local',// 数据模式，local代表本地数据
                            //readOnly : false,// 是否只读
                            editable : false,// 是否允许输入
                            //forceSelection : true,// 必须选择一个选项
                            //blankText : '请选择',// 该项如果没有选择，则提示错误信息,
                            labelStyle: 'font-weight:bold;padding-bottom:5px',
                            store:Ext.create('Ext.data.Store', {
                                fields: ['text', 'selected_avatar'],
                                data : [
                                    {"text":"无头像", "selected_avatar":0},
                                    {"text":"选择头像", "selected_avatar":1}
                                ]
                            }),
                            value:0,
                            displayField:'text',
                            valueField:'selected_avatar',
                            listConfig: {
                                listeners: {
                                    itemclick: function(list, record, eml, index,a,b) {
                                        if(index==1){
                                            Ext.create('Ext.window.Window', {
                                                id:'select-image-window',
                                                title: '选择头像',
                                                custom_variables:{image_id:'user-avatar',combobox_id:'user-avatar-combobox',filed_id:'user-avatar-field'},
                                                maximizable:false,
                                                resizable:false,
                                                modal:true,
                                                constrain: true,
                                                width:880,
                                                height:580,
                                                html:'<iframe id="userlist-iframe-filemanager" style="width:100%;height:100%;border:0" src="public/filemanager/dialog.php?type=1"></iframe>',
                                                closable: true,
                                                style: {
                                                    borderStyle: '0 solid #fff'
                                                },
                                                listeners:{
                                                    scope:this,
                                                    close:function(){
                                                        if(Ext.getCmp('user-avatar-field').getValue()==''){
                                                            Ext.getCmp('user-avatar-combobox').setValue(0);
                                                        }
                                                    },
                                                    afterrender:function(self){
                                                        self.setLoading(true);
                                                        subWin = window.frames['userlist-iframe-filemanager'];
                                                        if (window.attachEvent) {
                                                            subWin.attachEvent("onload", function(){
                                                            });
                                                        }else {
                                                            subWin.addEventListener("load", function(){
                                                                self.setLoading(false);
                                                            }, true);
                                                        }
                                                    }
                                                }
                                            }).show();
                                        }else{
                                            Ext.getCmp('user-avatar-field').setValue('');
                                        }
                                    }
                                }
                            },
                            listeners: {
                                scope: this,
                                change:function(combo,n,o){
                                    if(n==0){
                                        Ext.getCmp('user-avatar').setSrc('http://www.sencha.com/img/20110215-feat-html5.png');
                                        Ext.getCmp('user-avatar').setVisible(false);
                                        combo.setValue(combo.store.getAt(0));
                                    }else{
                                        combo.setValue(combo.store.getAt(1));
                                    }
                                }
                            }
                        },
                        Ext.create('Ext.Img', {
                            id:'user-avatar',
                            src: 'http://www.sencha.com/img/20110215-feat-html5.png',
                            hidden:true,
                            padding:'2px 0 0 0',
                            style: {
                                maxWidth: '215px',
                                minWidth: '50px'
                            }
                        }),
                        {
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
                    buttons: [
                    // {
                    //     text: '重置',
                    //     formBind: true,
                    //     handler:function(button){
                    //         var bt = button.ownerCt.ownerCt;
                    //         if(bt.getForm().findField('id')){
                    //             bt.getForm().load({url:'admin/link/getData',params:{id:bt.getForm().findField('id').value}});
                    //         }else{
                    //             bt.getForm().reset();
                    //         }
                    //     }
                    // },
                    {xtype: 'tbfill'},
                    {
                        text: '提交',
                        formBind: true,
                        handler:function(button){
                            var panel = button.up('form').up('panel');
                            var form = button.up('form'); //获取表单组件
                            var center = Ext.getCmp("center");
                            var values = form.getForm().getFieldValues(true);
                            var group_id = form.getForm().findField('group_id').getStore().getRootNode().internalId;
                            if(values.group_id==group_id || !values.group_id){
                                form.getForm().setValues({group_id:0});
                                pids = 0;
                            }else{
                                pids = values.group_id;
                            }
                            if(form.getForm().findField('id') && form.getForm().findField('id').value>0){
                                form.getForm().submit({
                                    waitMsg:'正在处理数据...',
                                    method:'POST',
                                    params:{group_id:pids},
                                    url:'admin/user/update',
                                    submitEmptyText:false,
                                    success:function(f, response){
                                        form.getForm().setValues({group_id:values.group_id});
                                        panel.child('gridpanel').getStore().reload();
                                        Ext.create('Xnfy.util.common').uxNotification(true,'修改数据成功',3000);
                                    },
                                    failure:function(f, response){
                                        Ext.create('Xnfy.util.common').uxNotification(false,response.result.errors.msg,5000);
                                    }
                                });
                            }else{
                                form.getForm().submit({
                                        params:{group_id:pids},
                                        waitMsg:'正在处理数据...',
                                        method:'POST',
                                        submitEmptyText:false,
                                        url:'admin/user/insert',
                                        success:function(f, response){
                                            panel.child('gridpanel').getStore().reload();
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