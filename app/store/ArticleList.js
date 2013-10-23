Ext.define('Xnfy.store.ArticleList', {
    extend: 'Ext.data.Store',
    requires: [
        'Xnfy.model.ArticleList'
    ],
//    autoLoad: true,
    model: 'Xnfy.model.ArticleList',
    // pageSize: 2,
    storeId: 'ArticleList',
    sorters:{property:'id',direction:'DESC'},
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            proxy: {
                type: 'ajax',
                actionMethods: {create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'},
                api:{
                    read: 'admin/article',
                    create : 'admin/articlemanage/insert',
                    update: 'admin/articlemanage/update',
                    destroy: 'admin/articlemanage/delete'
                },
                reader: {
                    type: 'json',
                    root: 'data'
                },
                writer : {
                    encode : true,
                    type : 'json',
                    root : 'data'//服务器端直接用接收
                },
                // Parameter name to send filtering information in
                filterParam: 'query',

                // The PHP script just use query=<whatever>
                encodeFilters: function(filters) {
                    return filters[0].value;
                }
            },
            remoteFilter: true,
            listeners: {
                beforeload: function(t){
                    var tab = Ext.getCmp("center").getActiveTab();
                    var search_treepicker = tab.queryById('search_treepicker');
                    if(search_treepicker){
                        var store = search_treepicker.getStore().getRootNode();
                        var root_pid = store.data.id;
                        var search_pid = search_treepicker.getValue();
                        if(root_pid==search_pid){
                            Ext.apply(this.proxy.extraParams, { pid: null});
                        }else if(search_pid<0){
                            Ext.apply(this.proxy.extraParams, { pid: 0});
                        }else{
                            Ext.apply(this.proxy.extraParams, { pid: search_pid});
                        }
                    }
                }
            }
        }, cfg)]);
    }
});