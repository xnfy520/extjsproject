Ext.define('Xnfy.store.Admin', {
    extend: 'Ext.data.Store',
    requires: [
        'Xnfy.model.Admin'
    ],
    model: 'Xnfy.model.Admin',
    storeId: 'Admin',
    //autoLoad: false,
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({

        }, cfg)]);
    }
});