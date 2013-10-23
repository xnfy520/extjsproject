Ext.define('Xnfy.model.ArticleList', {
    extend: 'Ext.data.Model',
    fields:[{name:'id',type:'int'},'title','indexing',{name:'pid',type:'int'},'views','publish','create_date','modify_date']
});