Ext.define('Xnfy.store.UserGroupTree', {
    extend: 'Ext.data.TreeStore',
    requires: [
        'Xnfy.model.UserGroupTree'
    ],
    model: 'Xnfy.model.UserGroupTree',
    storeId: 'UserGroupTree',
    //autoLoad: false,
    sorters:{property:'id',direction:'DESC'},
    nodeParam:'pid',
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            root: {
                title: '用户列表',
                leaf: false,
                id: 0
            },
            proxy: {
                type: 'ajax',
                api: {
                    create: 'createPersons',
                    read: 'admin/user_group/getList',
                    update: 'updatePersons',
                    destroy: 'destroyPersons'
                }
            }
        }, cfg)]);
    }
});