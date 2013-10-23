Ext.define('Xnfy.controller.ClassifyMenu', {
    extend: 'Ext.app.Controller',
    models: [
        'ClassifyMenu','ClassifyList'
    ],
    stores: [
        'ClassifyMenu','ClassifyList'
    ],
    views: [
        'Menu','Center'
    ],
    init: function(application) {
        this.control({
            'xnfymenu [itemId=ClassifyMenu]':{
                selectionchange:function(t, selecteds){
                },
                cellclick:function(self, td, cellIndex, selected){
                    if(selected && !selected.data.leaf){
                        var center = Ext.getCmp("center");
                        var panel = Ext.getCmp(selected.id);
                        if(!panel){
                            panel =Ext.create('Xnfy.view.ClassifyList');
                            var form = panel.child('form');
                            panel.setTitle(selected.data.title+' 分类');
                            var pid = selected.internalId;
                            //if(selected.internalId===0){
                            form.setTitle('添加 分类');
                            // }else{
                            //     form.setTitle('添加 '+selected.data.title+' 子类');
                            // }
                            this.openClassify(panel,selected.id,pid);
                        }else{
                            center.setActiveTab(panel);
                        }
                    }
                },
                beforeexpand:function(p){
                    p.getRootNode().expand();
                },
                expand:function(p){
                    p.getRootNode().eachChild(function(i){
                        if(!i.isExpanded()){
                            i.expand();
                        }
                    });
                }
            },
            'xnfymenu [itemId=Configuration]':{
                cellclick:function(self, td, cellIndex, selected){
                    if(selected){
                        var center = Ext.getCmp("center");
                        var panel = Ext.getCmp(selected.id);
                        if(!panel){
                            panel =Ext.create('Xnfy.view.Configuration');
                            panel.setTitle(selected.data.text);
                            var pid = selected.internalId;
                            this.openConfiguration(panel,selected.id,pid);
                        }else{
                            center.setActiveTab(panel);
                        }
                    }
                }
            },
            'xnfymenu [itemId=User]':{
                cellclick:function(self, td, cellIndex, selected){
                    if(selected){
                        var center = Ext.getCmp("center");
                        var panels = center.getComponent(selected.internalId);
                        if(panels){
                            center.setActiveTab(panels);
                        }else{
                            switch(selected.internalId){
                                case 'UserGroup':
                                    panel =Ext.create('Xnfy.view.UserGroup');
                                    panel.setTitle(selected.data.text);
                                    panel.child('form').setTitle('添加 分组');
                                    this.openUserGroup(panel,selected.internalId);
                                break;
                                case 'UserManage':
                                    panel =Ext.create('Xnfy.view.UserList');
                                    panel.setTitle(selected.data.text);
                                    panel.child('form').setTitle('添加 用户');
                                    this.openUserList(panel,selected.internalId);
                                break;
                            }
                        }
                    }
                }
            },
            'xnfymenu [itemId=ModuleMenu]':{
                cellclick:function(self, td, cellIndex, selected){
                   if(selected){
                        var center = Ext.getCmp("center");
                        var panel = center.getComponent(selected.internalId);
                        if(panel){
                            center.setActiveTab(panel);
                        }else{
                            switch(selected.internalId){
                                case 'FileManage':
                                    panel =Ext.create('Xnfy.view.FileManage');
                                    panel.setTitle(selected.data.text);
                                    this.openFileManage(panel,selected.internalId);
                                break;
                                case 'FileManager':
                                    panel =Ext.create('Xnfy.view.FileManager');
                                    panel.setTitle(selected.data.text);
                                    this.openFileManager(panel,selected.internalId);
                                break;
                                case 'ArticleManage':
                                    panel =Ext.create('Xnfy.view.ArticleList');
                                    panel.setTitle(selected.data.text);
                                    this.openArticleManage(panel,selected.internalId);
                                break;
                                case 'LinkManage':
                                    panel =Ext.create('Xnfy.view.LinkList');
                                    panel.setTitle(selected.data.text);
                                    panel.child('form').setTitle('添加 链接');
                                    this.openLinkManage(panel,selected.internalId);
                                break;
                            }
                        }
                    }
                }
            }
        });
    },
    openConfiguration:function(panel,id,pid){
        var n = (typeof panel == "string" ? panel : id || panel.id);
        var center = Ext.getCmp("center");
        var tab = center.getComponent(n);
        if (tab) {
            center.setActiveTab(tab);
        } else if(typeof panel!="string"){
            panel.id = n;
            center.setActiveTab(center.add(panel));
            var stores = Ext.create('Xnfy.store.Configuration');
            var store = stores.load({scope:this,callback:function(records,operation,success){}});
            panel.child('gridpanel').reconfigure(store);
        }
    },
    openClassify : function (panel,id,pid){
        var n = (typeof panel == "string" ? panel : id || panel.id);
        var center = Ext.getCmp("center");
        var tab = center.getComponent(n);
        if (tab) {
            center.setActiveTab(tab);
        } else if(typeof panel!="string"){
            panel.id = n;
            panel.class='classify';
            panel.openid = pid;
            var gridpanel = panel.child('gridpanel');
            var pagingtoolbar = gridpanel.getDockedItems('pagingtoolbar')[0];
            var stores = Ext.create('Xnfy.store.ClassifyList');
            var store = stores.load({params:{pid:pid},scope:this,callback:function(records,operation,success){
                if(success){
                    if(records.length<=0){
                        if(panel.child('form')){
                            panel.child('form').expand(true);
                        }
                    }
                }
            }});
            gridpanel.reconfigure(store);
            pagingtoolbar.bindStore(store);

            center.setActiveTab(center.add(panel));
        }
    },
    openFileManage : function (panel,id){
        var n = (typeof panel == "string" ? panel : id || panel.id);
        var center = Ext.getCmp("center");
        var tab = center.getComponent(n);
        if (tab) {
            center.setActiveTab(tab);
        } else if(typeof panel!="string"){
            panel.id = n;
            var gridpanel = panel.child('gridpanel');
            var pagingtoolbar = gridpanel.getDockedItems('pagingtoolbar')[0];
            var stores = Ext.create('Xnfy.store.FileManage');
            var store = stores.load({scope:this,callback:function(records,operation,success){
            }});
            gridpanel.reconfigure(store);
            pagingtoolbar.bindStore(store);
            center.setActiveTab(center.add(panel));
        }
    },
    openFileManager : function (panel,id){
        var n = (typeof panel == "string" ? panel : id || panel.id);
        var center = Ext.getCmp("center");
        var tab = center.getComponent(n);
        if (tab) {
            center.setActiveTab(tab);
        } else if(typeof panel!="string"){
            panel.id = n;
            var gridpanel = panel.child('gridpanel');
            center.setActiveTab(center.add(panel));
        }
    },
    openArticleManage : function (panel,id){
        var n = (typeof panel == "string" ? panel : id || panel.id);
        var center = Ext.getCmp("center");
        var tab = center.getComponent(n);
        if (tab) {
            center.setActiveTab(tab);
        } else if(typeof panel!="string"){
            panel.id = n;
            var gridpanel = panel.child('gridpanel');
            var pagingtoolbar = gridpanel.getDockedItems('pagingtoolbar')[0];
            var stores = Ext.create('Xnfy.store.ArticleList');
            var store = stores.load({scope:this,callback:function(records,operation,success){
            }});
            gridpanel.reconfigure(store);
            pagingtoolbar.bindStore(store);
            center.setActiveTab(center.add(panel));
        }
    },
    openLinkManage : function(panel,id,pid){
        var n = (typeof panel == "string" ? panel : id || panel.id);
        var center = Ext.getCmp("center");
        var tab = center.getComponent(n);
        if (tab) {
            center.setActiveTab(tab);
        } else if(typeof panel!="string"){
            panel.id = n;
            var gridpanel = panel.child('gridpanel');
            var pagingtoolbar = gridpanel.getDockedItems('pagingtoolbar')[0];
            var stores = Ext.create('Xnfy.store.LinkList');
            var store = stores.load({scope:this,callback:function(records,operation,success){
                // if(success){
                //     if(records.length<=0){
                //         if(panel.child('form')){
                //             panel.child('form').expand(true);
                //         }
                //     }
                // }
            }});
            gridpanel.reconfigure(store);
            pagingtoolbar.bindStore(store);
            center.setActiveTab(center.add(panel));
        }
    },
    openUserGroup: function(panel,id){
        var n = (typeof panel == "string" ? panel : id || panel.id);
        var center = Ext.getCmp("center");
        var tab = center.getComponent(n);
        if (tab) {
            center.setActiveTab(tab);
        } else if(typeof panel!="string"){
            panel.id = n;
            var gridpanel = panel.child('gridpanel');
            var pagingtoolbar = gridpanel.getDockedItems('pagingtoolbar')[0];
            var stores = Ext.create('Xnfy.store.UserGroup');
            var store = stores.load({scope:this,callback:function(records,operation,success){
                // if(success){
                //     if(records.length<=0){
                //         if(panel.child('form')){
                //             panel.child('form').expand(true);
                //         }
                //     }
                // }
            }});
            gridpanel.reconfigure(store);
            pagingtoolbar.bindStore(store);
            center.setActiveTab(center.add(panel));
        }
    },
    openUserList : function(panel,id){
        var n = (typeof panel == "string" ? panel : id || panel.id);
        var center = Ext.getCmp("center");
        var tab = center.getComponent(n);
        if (tab) {
            center.setActiveTab(tab);
        } else if(typeof panel!="string"){
            panel.id = n;
            var gridpanel = panel.child('gridpanel');
            var pagingtoolbar = gridpanel.getDockedItems('pagingtoolbar')[0];
            var stores = Ext.create('Xnfy.store.UserList');
            var store = stores.load({scope:this,callback:function(records,operation,success){
                // if(success){
                //     if(records.length<=0){
                //         if(panel.child('form')){
                //             panel.child('form').expand(true);
                //         }
                //     }
                // }
            }});
            gridpanel.reconfigure(store);
            pagingtoolbar.bindStore(store);
            center.setActiveTab(center.add(panel));
        }
    }
});
