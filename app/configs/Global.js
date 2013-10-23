Ext.define('Xnfy.configs.Global', {
    extend: 'Ext.data.Store',
    storeId: 'ConfigsGlobal',
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            data : [{
                Classify:[{
                    DeleteInhibitFlag:['article']
                }]
             }]
        }, cfg)]);
    }
});