Ext.define('Xnfy.view.ArticleManage', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.ux.ProgressBarPager',
        'Xnfy.util.common'
    ],
    alias: 'widget.articlemanage',
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
                                            gridpanel.getDockedItems('toolbar [itemId=delete]')[0].setDisabled(true);

                                                var center_form = new Ext.form.Panel({
                                                    region: 'center',
                                                    border: false,
                                                    fieldDefaults: {
                                                        labelWidth: 60
                                                    },
                                                    defaultType: 'textfield',
                                                    bodyPadding: '5px',
                                                    items: [{
                                                        fieldLabel: '标　　题',
                                                        labelStyle: 'font-weight:bold',
                                                        allowBlank: false,
                                                        emptyText : '',
                                                        name: 'title',
                                                        anchor:'100%'  // anchor width by percentage
                                                    },
                                                    {
                                                        xtype: 'tinymce',
                                                        name:'details',
                                                        anchor: '100%',
                                                        // id: 'zh_cn_tinyEditor',
                                                        height:410,
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
                                                    }]
                                                });

                                                var east_form = new Ext.form.Panel({
                                                    split: false,
                                                    bodyPadding: '5px 3px 0 0',
                                                    // margin:'0 5px 0 0',
                                                                region: 'east',
                                                                border: false,
                                                                fieldDefaults: {
                                                                    labelAlign: 'top',
                                                                    anchor: '100%'
                                                                },
                                                                items:[
                                                                    {
                                                                        xtype: 'fieldcontainer',
                                                                        layout: 'hbox',
                                                                        defaultType: 'textfield',
                                                                        items: [{
                                                                            xtype: 'treepicker',
                                                                            name:'pid',
                                                                            id:'article-treepicker',
                                                                            // fieldLabel:'所属分类',
                                                                            // flex: 1,
                                                                            autoScroll:true,
                                                                            minPickerHeight:'auto',
                                                                            maxPickerHeight:200,
                                                                            emptyText:'无分类选择',
                                                                            displayField : 'title',
                                                                            // margin:'25px 0 0 0',
                                                                            labelStyle: 'font-weight:bold;padding-bottom:5px',
                                                                            store:Ext.create('Xnfy.store.ClassifyMenu'),
                                                                            listeners:{
                                                                                afterrender:function( self, eOpts ){
                                                                                    self.store.load({params:{indexing:'article'},callback:function(records,operation,success){
                                                                                        if(success && records.length>0){
                                                                                            self.store.setRootNode(records[0]).expand();
                                                                                            self.setValue(records[0].data.id);
                                                                                        }else{
                                                                                             self.disable();
                                                                                        }
                                                                                    }});
                                                                                },
                                                                                beforeshow:function( self, eOpts ){
                                                                                },
                                                                                blur:function( self, The, eOpts ){
                                                                                },
                                                                                expand:function( field, eOpts ){
                                                                                }
                                                                            }
                                                                        }]
                                                                    },{
                                                                        xtype:'textfield',
                                                                        name:'indexing',
                                                                        fieldLabel:'标识索引',
                                                                        labelStyle: 'font-weight:bold;padding-bottom:5px'
                                                                            // margin:'0 10 0 0'
                                                                    },{
                                                                        xtype:'numberfield',
                                                                        name:'views',
                                                                        minValue: 0,
                                                                        fieldLabel:'浏览数量',
                                                                        value:0,
                                                                        labelStyle: 'font-weight:bold;padding-bottom:5px'
                                                                    },{
                                                                        // xtype:'hiddenfield',
                                                                        xtype:'textfield',
                                                                        id:'cover_field',
                                                                        name:'cover',
                                                                        fieldLabel:'封面地址',
                                                                        hidden:true,
                                                                        labelStyle: 'font-weight:bold;padding-bottom:5px'
                                                                    },{
                                                                        xtype: 'combobox',
                                                                        id:'cover_combobox',
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
                                                                                            id:'select-cover-article-window',
                                                                                            title: '选择图片',
                                                                                            maximizable:false,
                                                                                            resizable:false,
                                                                                            modal:true,
                                                                                            constrain: true,
                                                                                            width:880,
                                                                                            height:550,
                                                                                            html:'<iframe style="width:100%;height:100%;border:0" src="filemanager/dialog.php?type=1"></iframe>',
                                                                                            closable: true,
                                                                                            style: {
                                                                                                borderStyle: '0 solid #fff'
                                                                                            }
                                                                                        }).show();
                                                                                    }else{
                                                                                        Ext.getCmp('cover_field').setValue('');
                                                                                    }
                                                                                }
                                                                            }
                                                                        },
                                                                        listeners: {
                                                                            scope: this,
                                                                            change:function(combo,n,o){
                                                                                if(n==0){
                                                                                    Ext.getCmp('article-cover-image').setSrc('http://www.sencha.com/img/20110215-feat-html5.png');
                                                                                    Ext.getCmp('article-cover-image').setVisible(false);
                                                                                    combo.setValue(combo.store.getAt(0));
                                                                                }else{
                                                                                    combo.setValue(combo.store.getAt(1));
                                                                                }
                                                                            }
                                                                        }
                                                                    },
                                                                    Ext.create('Ext.Img', {
                                                                        id:'article-cover-image',
                                                                        src: 'http://www.sencha.com/img/20110215-feat-html5.png',
                                                                        maxWidth:180,
                                                                        width:180,
                                                                        maxHeight:267,
                                                                        hidden:true
                                                                    })
                                                                ]
                                                            });

                                        Ext.create('Ext.window.Window', {
                                                id:'add-edit-article-window',
                                                //autoShow: true,
                                                title: '添加文章',
                                                width: 1000,
                                                maximizable:false,
                                                resizable:false,
                                                modal:true,
                                                constrain: true,
                                                height:550,
                                                // padding:5,
                                                //minWidth: 500,
                                                layout: 'border',
                                                style: {
                                                    backgroundColor: '#fff'
                                                },
                                                items: [
                                                    center_form,
                                                    east_form
                                                ],
                                                dockedItems: [{
                                                    xtype: 'toolbar',
                                                    dock: 'bottom',
                                                    ui: 'footer',
                                                    items: [
                                                        {
                                                            xtype: 'datefield',
                                                            format: 'Y-m-d',
                                                            name: 'publish_date',
                                                            fieldLabel: '发布日期',
                                                            labelWidth: 60,
                                                            labelStyle: 'font-weight:bold',
                                                            margin: '0 5 0 0',
                                                            width:165,
                                                            value: new Date(),
                                                            minValue: '1970-01-01',
                                                            maxValue: new Date()
                                                        }, {
                                                            xtype: 'timefield',
                                                            name: 'publish_time',
                                                            format:'H:i:s',
                                                            width:90,
                                                            value: new Date(),
                                                            anchor: '100%'
                                                       },{
                                                            xtype:'toggleslide',
                                                            name:"publish",
                                                            state: true,
                                                            onText: '启用',
                                                            offText: '禁用'
                                                        },
                                                        {
                                                            xtype: 'tbfill'
                                                        },{
                                                            text: '确定',
                                                            formBind: true,
                                                            handler:function(button){
                                                                console.log(button);
                                                                var forms = button.up('window').query('form');
                                                                // for(i=0;i<forms.length;i++){
                                                                //     console.log(forms[i]);
                                                                //     console.log(forms[i].getForm());
                                                                // }
                                                                var s = forms[0].getForm().getFieldValues(true);
                                                                console.log(s);
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
                                            }).show();
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
                                    text: '删除文章',
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