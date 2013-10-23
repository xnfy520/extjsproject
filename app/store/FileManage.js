Ext.define('Xnfy.store.FileManage', {
    extend: 'Ext.data.Store',
    requires: [
        'Xnfy.model.FileManage'
    ],
//    autoLoad: true,
    model: 'Xnfy.model.FileManage',
//    pageSize: 2,
    storeId: 'FileManage',
    sorters:{property:'id',direction:'DESC'},
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            proxy: {
                type: 'ajax',
                actionMethods: {create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'},
                api:{
                    read: 'admin/filemanage',
                    create : 'admin/filemanage/insert',
                    update: 'admin/filemanage/update',
                    destroy: 'admin/filemanage/delete'
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
                    // var tab = Ext.getCmp("center").getActiveTab();
                    // var pid = tab.openid?tab.openid:0;
                    // if(pid>=0){
                    //     Ext.apply(this.proxy.extraParams, { pid: pid});
                    // }
                }
            }
        }, cfg)]);
    }
});