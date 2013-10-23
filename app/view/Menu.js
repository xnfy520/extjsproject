Ext.define('Xnfy.view.Menu', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.xnfymenu',

    region: 'west',
    split: true,
    width: 200,
    minWidth:200,
    maxWidth:250,
    layout: {
        type: 'accordion'
    },
    collapsible: true,
    title: '系统菜单',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
			items: [{
                    xtype: 'treepanel',
                    title: '配置管理',
                    itemId:'Configuration',
                    rootVisible: false,
                    lines:false,
                    root: {
                        text: 'root',
                        id: 'root',
                        expanded:true,
                        children:[{
                            id:0,
                            leaf: true,
                            text:'基本配置'
                        }]
                    }
                },{
                    xtype: 'treepanel',
                    title: '分类管理',
                    itemId:'ClassifyMenu',
                    rootVisible: true,
                    displayField: 'title',
                    store: 'ClassifyMenu'
                },
				{
					xtype: 'treepanel',
					title: '模块管理',
                    itemId:'ModuleMenu',
                    rootVisible: false,
                    lines:false,
                    root: {
                        text: 'root',
                        id: 'root',
                        expanded:true,
                        children:[
                        // {
                        //     id:'FileManage',
                        //     disabled:false,
                        //     leaf: true,
                        //     text:'文件管理'
                        // },
                        {
                            id:'FileManager',
                            leaf: true,
                            text:'文件管理'
                        },{
                            id:'ArticleManage',
                            leaf: true,
                            text:'文章管理'
                            // expanded:true,
                            // children:[{
                            //     text:'文章推送',
                            //     id:"PushManage",
                            //     leaf: true
                            // }]
                        },{
                            id:'LinkManage',
                            leaf: true,
                            text:'链接管理'
                        }]
                    }
				},
                {
                    xtype: 'treepanel',
                    title: '用户管理',
                    itemId:'User',
                    rootVisible: false,
                    lines:false,
                    root: {
                        text: 'root',
                        id: 'root',
                        expanded:true,
                        children:[{
                            id:'UserGroup',
                            leaf: true,
                            text:'用户分组'
                        },{
                            id:'UserManage',
                            leaf: true,
                            text:'用户管理'
                        }]
                    }
                }]
        });
        me.callParent(arguments);
    }

});