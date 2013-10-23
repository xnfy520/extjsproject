Ext.define('Xnfy.model.ClassifyMenu', {
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