Ext.define('Xnfy.view.Header', {
    extend: 'Ext.panel.Panel',
    region: 'north',
    height: 60,
    header: false,
    // id: 'instructions',
    layout: {
        type: 'column'
    },
    //html:'<a href="admin.html"><img width="60" src="./public/images/logo.jpg" /></a>',
    dockedItems: [{
    }],
    bodyStyle: {
        // background: '#ccc'
    },
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items:[{
                html:'<a href="./admin"><img width="56" height="56" src="./public/images/logo.jpg" /></a>',
                width:60,
                height:60,
                padding:'2',
                margin:'0 0 0 5'
            },{
                columnWidth:1,
                html:'<span style="visibility:hidden">hello</span>'
            },{
                layout:{
                    type: 'vbox'
                },
                items:[{
                    xtype:'toolbar',
                    padding:'4 0 0 8',
                    height:28
                },{
                    xtype:'toolbar',
                    padding:'4 0 0 8',
                    items: [
                        {
                            xtype: 'button',
                            id:'admin@',
                            iconCls:'icon-user',
                            text : ''
                        },
                        {
                            xtype: 'button',
                            text : '退出',
                            listeners:{
                                click:function(button){
                                    Ext.MessageBox.show({
                                                title:'退出系统',
                                                msg: '确认退出系统?',
                                                buttons: Ext.MessageBox.YESNO,
                                                buttonText:{
                                                    yes: "确认",
                                                    no: "取消"
                                                },
                                                icon: Ext.MessageBox.QUESTION,
                                                fn: function(btn){
                                                    if(btn=='yes'){
                                                        Ext.getCmp('mainviewport').setLoading(true);
                                                        Ext.Ajax.request({
                                                            url:"admin/common/logout",
                                                            method:'get',
                                                            callback:function(records, operation, success){
                                                                // var response = Ext.JSON.decode(success.responseText);
                                                                window.location.reload();
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                }
                            }
                        }
                    ]
                }]
            }]
        });
        me.callParent(arguments);
    }

});