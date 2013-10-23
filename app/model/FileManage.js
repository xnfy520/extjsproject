Ext.define('Xnfy.model.FileManage', {
    extend: 'Ext.data.Model',
    fields:[{name:'id',type:'int'},'title','name', 'enabled',{name:'number',type:'int'},'remark','create_date','modify_date']
});