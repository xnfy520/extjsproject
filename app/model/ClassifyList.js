Ext.define('Xnfy.model.ClassifyList', {
    extend: 'Ext.data.Model',
    fields:[{name:'id',type:'int'},'title','pid','indexing', 'leaf',{name:'number',type:'int'}, 'enabled','remark','create_date','modify_date']
});