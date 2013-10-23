Ext.define('Xnfy.model.UserGroupTree', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type:'int'
        },{
            name:'leaf',
            type:'boolean'
        },
        {
            name: 'title'
        }
    ]
});