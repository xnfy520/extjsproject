Ext.define('Xnfy.model.UserGroup', {
    extend: 'Ext.data.Model',
    fields:[{name:'id',type:'int'},'title','pid','indexing',{name:'sort',type:'int'},{name:'number',type:'int'}, 'enabled','remark','create_date','modify_date']
});