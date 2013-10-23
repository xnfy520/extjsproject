Ext.define('Xnfy.store.Configuration', {
    extend: 'Ext.data.Store',
    requires: [
        'Xnfy.model.Configuration'
    ],
    //autoLoad: true,
    model: 'Xnfy.model.Configuration',
    storeId: 'Configuration',
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            proxy: {
                type: 'ajax',
                api:{
                    read: 'admin/configuration',
                    create : 'admin/configuration/insert',
                    update: 'admin/configuration/update',
                    destroy: 'admin/configuration/delete'
                },
                reader: {
                    type: 'json',
                    root: 'data'
                },
                writer : {
                    encode : true,
                    type : 'json',
                    root : 'data'//服务器端直接用接收
                }
            },
            listeners: {
                beforeload: function(t){

                }
            }
        }, cfg)]);
    }
});