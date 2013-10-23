Ext.define('Xnfy.store.UserGroup', {
    extend: 'Ext.data.Store',
    requires: [
        'Xnfy.model.UserGroup'
    ],
//    autoLoad: true,
    model: 'Xnfy.model.UserGroup',
//    pageSize: 2,
    storeId: 'UserGroup',
    sorters:{property:'id',direction:'ASC'},
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            proxy: {
                type: 'ajax',
                actionMethods: {create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'},
                api:{
                    read: 'admin/user_group',
                    create : 'admin/user_group/insert',
                    update: 'admin/user_group/update',
                    destroy: 'admin/user_group/delete'
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
                }
            }
        }, cfg)]);
    }
});