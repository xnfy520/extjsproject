Ext.define('Xnfy.view.ArticleList', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.ux.ProgressBarPager',
        'Xnfy.util.common'
    ],
    id:'article_list',
    alias: 'widget.articlelist',
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
                    // style: {
                    //     borderStyle: 'solid',
                    //     borderWidth:"0 5px 0 0",
                    //     borderColor:"#ADD2ED"
                    // },
                    columns: [
                        {
                            text: '#',
                            dataIndex: 'id',
                            width:60,
                            hidden:true
                        },
                        {
                            text: '文章名称',
                            dataIndex: 'title',
                            flex: 1
                        },
                        {
                            text: '标识索引',
                            dataIndex: 'indexing',
                            width:100
                        },
                        {
                            text: '启用',
                            dataIndex: 'publish',
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
                            text: '浏览',
                            dataIndex: 'views',
                            align:'center',
                            width:60
                        },
                        {
                            text: '创建时间',
                            dataIndex: 'create_date',
                            align:'center',
                            xtype: 'datecolumn',
                            width:150,
                            hidden:false,
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
                            hidden:false,
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
                                    id:'search_treepicker',
                                    xtype: 'treepicker',
                                    // fieldLabel:'所属分类',
                                    // flex: 1,
                                    autoScroll:true,
                                    minPickerHeight:'auto',
                                    maxPickerHeight:200,
                                    emptyText:'无分类选择',
                                    blankText:'无分类选择',
                                    displayField : 'title',
                                    value:{},
                                    // margin:'25px 0 0 0',
                                    labelStyle: 'font-weight:bold;padding-bottom:5px',
                                    store:Ext.create('Xnfy.store.ClassifyMenu').load({params:{indexing:'article'},callback:function(records,operation,success){
                                        var this_treepicker = me.queryById('search_treepicker');
                                        if(success && records.length>0){
                                            this_treepicker.store.setRootNode({title:'全部文章',id:records[0].data.id,expanded:true});
                                            this_treepicker.store.getRootNode().appendChild({title:'未分类文章',id:-1,leaf:true});
                                            this_treepicker.setValue(records[0].data.id);
                                        }else{
                                            this_treepicker.disable();
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
                                                self.up('gridpanel').getStore().reload({params:{pid:0}});
                                            }else{
                                                self.up('gridpanel').getStore().reload({params:{pid:record.data.id}});
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'searchfield',
                                    emptyText: '输入搜索关键字',
                                    store:Ext.create('Xnfy.store.ArticleList'),
                                    width:200
                                },
                                {
                                    xtype: 'tbfill'
                                },
                                {
                                    itemId:'add',
                                    xtype: 'button',
                                    text: '添加文章',
                                    iconCls:'icon-file',
                                    listeners:{
                                        scope:this,
                                        click:function(button){
                                            var gridpanel = button.up('gridpanel');
                                            var gridselectionmodel = gridpanel.getSelectionModel();
                                            if(gridselectionmodel.getCount()>0){
                                                gridselectionmodel.deselectAll(true);
                                            }
                                            gridpanel.getDockedItems('toolbar [itemId=edit]')[0].setDisabled(true);
                                            gridpanel.getDockedItems('toolbar [itemId=delete]')[0].setDisabled(true);

                                            me.add_edit_article(true);
                                        }
                                    }
                                },
                                {
                                    itemId:'edit',
                                    xtype: 'button',
                                    text: '修改文章',
                                    iconCls:'icon-edit',
                                    disabled:true,
                                    listeners:{
                                        scope:this,
                                        click:function(button){
                                            var gridpanel = button.up('gridpanel');
                                            var gridselectionmodel = gridpanel.getSelectionModel();
                                            var lastmodel = gridselectionmodel.getLastSelected();
                                            me.add_edit_article(false);
                                            var win = Ext.getCmp('add-edit-article-window');
                                            if(win){
                                                win.down('form').load({
                                                    url:'admin/article/getdata',
                                                    params:{id:lastmodel.data.id},
                                                    success:function(form,action){
                                                        var pid = form.findField('pid').getStore().getRootNode().data.id;
                                                        var form_values = form.getValues();
                                                        if(form_values.pid==0){
                                                            form.setValues({pid:pid});
                                                        }
                                                        if(form_values.cover){
                                                            form.findField('cover_combobox').setValue(1);
                                                            form.owner.queryById('article-cover-image').setSrc('source/'+form_values.cover);
                                                            form.owner.queryById('article-cover-image').setVisible(true);
                                                        }
                                                    },
                                                    failure:function(form,action){
                                                        Ext.create('Xnfy.util.common').uxNotification(false,'异常操作',3000);
                                                        win.close();
                                                    }
                                                });
                                            }
                                        }
                                    }
                                },
                                {
                                    itemId:'delete',
                                    xtype: 'button',
                                    text: '删除文章',
                                    iconCls:'icon-trash',
                                    disabled:true,
                                    listeners:{
                                        scope:this,
                                        click:function(t){
                                            var gridpanel = t.up('gridpanel');
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
                                                                url:"admin/article/delete",
                                                                method:'POST',
                                                                params:{ids:ids.toString()},
                                                                callback:function(records, operation, success){
                                                                    var response = Ext.JSON.decode(success.responseText);
                                                                    if(response.success){
                                                                        gridpanel.getSelectionModel().deselectAll();
                                                                        gridpanel.getStore().reload();
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
                            if(r.length==1){
                                this.child('gridpanel').getDockedItems('toolbar [itemId=edit]')[0].setDisabled(false);
                                this.child('gridpanel').getDockedItems('toolbar [itemId=delete]')[0].setDisabled(false);
                            }else if(r.length>0){
                                this.child('gridpanel').getDockedItems('toolbar [itemId=edit]')[0].setDisabled(true);
                                this.child('gridpanel').getDockedItems('toolbar [itemId=delete]')[0].setDisabled(false);
                            }else{
                                this.child('gridpanel').getDockedItems('toolbar [itemId=edit]')[0].setDisabled(true);
                                this.child('gridpanel').getDockedItems('toolbar [itemId=delete]')[0].setDisabled(true);
                            }
                        },
                        celldblclick:function(self, td, cellIndex, record, tr, rowIndex, e, eOpts){
                            if(record){
                                me.add_edit_article(false);
                                var win = Ext.getCmp('add-edit-article-window');
                                if(win){
                                    win.down('form').load({
                                        url:'admin/article/getdata',
                                        params:{id:record.data.id},
                                        success:function(form,action){
                                            var pid = form.findField('pid').getStore().getRootNode().data.id;
                                            var form_values = form.getValues();
                                            if(form_values.pid==0){
                                                form.setValues({pid:pid});
                                            }
                                            if(form_values.cover){
                                                form.findField('article-image-combobox').setValue(1);
                                                form.owner.queryById('article-image').setSrc(form_values.cover);
                                                form.owner.queryById('article-image').setVisible(true);
                                            }
                                        },
                                        failure:function(form,action){
                                            Ext.create('Xnfy.util.common').uxNotification(false,'异常操作',3000);
                                            win.close();
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            ]
        });
        me.callParent(arguments);
    },
    add_edit_article:function(foo){
        var v_title = '';
        var v_id = null;
        if(foo){
            v_title = '添加文章';
        }else{
            v_title = '修改文章';
            v_id = {xtype:'hiddenfield',name:'id'};
            // v_id = {xtype:'textfield',name:'id'};
        }
        Ext.create('Ext.window.Window', {
            id:'add-edit-article-window',
            //autoShow: true,
            title: v_title,
            width: 985,
            maximizable:false,
            resizable:false,
            modal:true,
            constrain: true,
            height:580,
            // padding:5,
            //minWidth: 500,
            layout: 'fit',
            style: {
                backgroundColor: '#fff'
            },
            items: {  // Let's put an empty grid in just to illustrate fit layout
                xtype: 'form',
                border: false,
                // padding:'5px 5px 0 5px',
                defaults: {
                    layout: 'anchor'
                },
                layout:'hbox',
                items: [{
                    width:790,
                    height:503,
                    // maxHeiht:5,
                    padding:'5px 5px 0 5px',
                    defaultType: 'textfield',
                    items:[
                            {
                                fieldLabel: '标　　题',
                                labelStyle: 'font-weight:bold',
                                allowBlank: false,
                                labelWidth: 60,
                                emptyText : '',
                                name: 'title',
                                anchor:'100%'  // anchor width by percentage
                            },
                            {
                                xtype: 'tinymce',
                                name:'details',
                                anchor: '100%',
                                // id: 'zh_cn_tinyEditor',
                                height:440,
                                value: '',
                                listeners: {
                                    change: function(me, newValue, oldValue) {
                                        // console.log('content changed: ' + oldValue + ' => ' + newValue);
                                    },
                                    blur: function() {
                                        // console.log(this); console.log('editor blurred'); 
                                    },
                                    focus: function() {
                                        if(Ext.getCmp('article-treepicker').isExpanded){
                                            Ext.getCmp('article-treepicker').collapse();
                                        }
                                    }
                                }
                            }
                        ]
                },{
                    height:503,
                    padding:'5px 0 0 0',
                    defaultType: 'textfield',
                    // autoScroll:true,
                    items:[{
                        labelAlign: 'top',
                        anchor:'100%',
                        xtype: 'treepicker',
                        name:'pid',
                        id:'article-treepicker',
                        // fieldLabel:'所属分类',
                        // flex: 1,
                        autoScroll:true,
                        minPickerHeight:'auto',
                        maxPickerHeight:200,
                        value:{},
                        emptyText:'分类选择',
                        blankText:'无分类选择',
                        displayField : 'title',
                        // margin:'25px 0 0 0',
                        labelStyle: 'font-weight:bold;padding-bottom:5px',
                        store:Ext.create('Xnfy.store.ClassifyMenu'),
                        listeners:{
                            afterrender:function( self, eOpts ){
                                self.store.load({params:{indexing:'article'},callback:function(records,operation,success){
                                    if(success && records.length>0){
                                        self.store.setRootNode({title:'选择分类',id:records[0].data.id}).expand();
                                        if(foo){
                                            self.setValue(records[0].data.id);
                                        }
                                    }else{
                                        self.store.setRootNode({id:0,title:'无分类选择'});
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
                            select:function(self){
                                self.collapse();
                            }
                        }
                    },
                    v_id,
                    {
                        xtype:'textfield',
                        name:'indexing',
                        fieldLabel:'标识索引',
                        labelAlign: 'top',
                        anchor:'100%',
                        stripCharsRe:new RegExp(/[\W]/i),
                        labelStyle: 'font-weight:bold;padding-bottom:5px'
                            // margin:'0 10 0 0'
                    },{
                        xtype:'numberfield',
                        name:'views',
                        minValue: 0,
                        fieldLabel:'浏览数量',
                        value:0,
                        labelAlign: 'top',
                        anchor:'100%',
                        labelStyle: 'font-weight:bold;padding-bottom:5px'
                    },{
                        xtype: 'combobox',
                        name:"publish",
                        //allowBlank: false,
                        fieldLabel:'启　　用',
                        emptyText : '请选择',
                        labelAlign: 'top',
                        anchor:'100%',
                        labelStyle: 'font-weight:bold;padding-bottom:5px',
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
                        xtype:'hiddenfield',
                         // xtype:'textfield',
                        id:'article-image-field',
                        name:'cover',
                        fieldLabel:'封面地址',
                        // hidden:true,
                        labelAlign: 'top',
                        anchor:'100%',
                        labelStyle: 'font-weight:bold;padding-bottom:5px'
                    },{
                        xtype: 'combobox',
                        labelAlign: 'top',
                        anchor:'100%',
                        id:'article-image-combobox',
                        //allowBlank: false,
                        fieldLabel:'文章封面',
                        emptyText : '选择封面',
                        mode : 'local',// 数据模式，local代表本地数据
                        //readOnly : false,// 是否只读
                        editable : false,// 是否允许输入
                        //forceSelection : true,// 必须选择一个选项
                        //blankText : '请选择',// 该项如果没有选择，则提示错误信息,
                        labelStyle: 'font-weight:bold;padding-bottom:5px',
                        store:Ext.create('Ext.data.Store', {
                            fields: ['text', 'selected_image'],
                            data : [
                                {"text":"无封面", "selected_image":0},
                                {"text":"选择封面", "selected_image":1}
                            ]
                        }),
                        value:0,
                        displayField:'text',
                        valueField:'selected_image',
                        listConfig: {
                            listeners: {
                                itemclick: function(list, record, eml, index,a,b) {
                                    if(index==1){
                                        Ext.create('Ext.window.Window', {
                                            id:'select-image-window',
                                            title: '选择图片',
                                            custom_variables:{image_id:'article-image',combobox_id:'article-image-combobox',filed_id:'article-image-field'},
                                            maximizable:false,
                                            resizable:false,
                                            modal:true,
                                            constrain: true,
                                            width:880,
                                            height:580,
                                            html:'<iframe id="article-iframe-filemanager" style="width:100%;height:100%;border:0" src="public/filemanager/dialog.php?type=1&random="'+Math.random()+'></iframe>',
                                            closable: true,
                                            style: {
                                                borderStyle: '0 solid #fff'
                                            },
                                            listeners:{
                                                scope:this,
                                                close:function(){
                                                    if(Ext.getCmp('article-image-field').getValue()==''){
                                                        Ext.getCmp('article-image-combobox').setValue(0);
                                                    }
                                                },
                                                afterrender:function(self){
                                                        self.setLoading(true);
                                                        subWin = window.frames['article-iframe-filemanager'];
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
                                        Ext.getCmp('article-image-field').setValue('');
                                    }
                                }
                            }
                        },
                        listeners: {
                            scope: this,
                            change:function(combo,n,o){
                                if(n==0){
                                    Ext.getCmp('article-image').setSrc('http://www.sencha.com/img/20110215-feat-html5.png');
                                    Ext.getCmp('article-image').setVisible(false);
                                    combo.setValue(combo.store.getAt(0));
                                }else{
                                    combo.setValue(combo.store.getAt(1));
                                }
                            }
                        }
                    },
                    Ext.create('Ext.Img', {
                        id:'article-image',
                        src: 'http://www.sencha.com/img/20110215-feat-html5.png',
                        hidden:true,
                        padding:'2px 0 0 0',
                        style: {
                            maxWidth: '180px',
                            minWidth: '50px',
                            maxHeight:'242px'
                        }
                    })]
                }],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    ui: 'footer',
                    items: [
                       //  {
                       //      xtype: 'datefield',
                       //      format: 'Y-m-d',
                       //      name: 'publish_date',
                       //      fieldLabel: '发布日期',
                       //      labelWidth: 60,
                       //      labelStyle: 'font-weight:bold',
                       //      margin: '0 5 0 0',
                       //      width:165,
                       //      value: new Date(),
                       //      minValue: '1970-01-01',
                       //      maxValue: new Date()
                       //  }, {
                       //      xtype: 'timefield',
                       //      name: 'publish_time',
                       //      format:'H:i:s',
                       //      width:90,
                       //      value: new Date(),
                       //      anchor: '100%'
                       // },
                       // {
                       //      xtype:'toggleslide',
                       //      name:"publish",
                       //      state: true,
                       //      onText: '启用',
                       //      offText: '禁用'
                       //  },
                        {
                            xtype: 'tbfill'
                        },
                        {
                            text: '确定',
                            formBind: true,
                            handler:function(button){
                                var windows = button.up('window');
                                var forms = button.up('window').query('form');
                                var values = forms[0].getForm().getFieldValues(true);
                                var pid = forms[0].getForm().findField('pid').getStore().getRootNode().internalId;
                                if(values.pid==pid || !values.pid){
                                    forms[0].getForm().setValues({pid:0});
                                    pids = 0;
                                }else{
                                    pids = values.pid;
                                }
                                if(foo){
                                    forms[0].getForm().submit({
                                        waitMsg:'正在处理数据...',
                                        params:{pid:pids},
                                        method:'POST',
                                        submitEmptyText:false,
                                        url:'admin/article/insert',
                                        success:function(f, response){
                                            forms[0].getForm().setValues({pid:values.pid});
                                            windows.close();
                                            var panel = Ext.getCmp('article_list');
                                            panel.child('gridpanel').getStore().reload();
                                            panel.child('gridpanel').getSelectionModel().deselectAll();
                                            Ext.create('Xnfy.util.common').uxNotification(true,'添加数据成功',3000);
                                        },
                                        failure:function(f, response){
                                            Ext.create('Xnfy.util.common').uxNotification(false,response.result.errors.msg,5000);
                                        }
                                    });
                                }else{
                                    forms[0].getForm().submit({
                                        waitMsg:'正在处理数据...',
                                        params:{pid:pids},
                                        method:'POST',
                                        submitEmptyText:false,
                                        url:'admin/article/update',
                                        success:function(f, response){
                                            forms[0].getForm().setValues({pid:values.pid});
                                            windows.close();
                                            var panel = Ext.getCmp('article_list');
                                            panel.child('gridpanel').getStore().reload();
                                            Ext.create('Xnfy.util.common').uxNotification(true,'修改数据成功',3000);
                                        },
                                        failure:function(f, response){
                                            Ext.create('Xnfy.util.common').uxNotification(false,response.result.errors.msg,5000);
                                        }
                                    });
                                }
                            }
                        },{
                            text: '取消',
                            scope: this,
                            handler: function(button,e){
                                button.up('window').close();
                            }
                        }
                    ]
                }]
            }
        }).show();
    }

});