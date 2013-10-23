Ext.define('Xnfy.model.UserList', {
    extend: 'Ext.data.Model',
    fields:[{name:'id',type:'int'},'username','email', 'avatar','group_id', 'enabled','remark','register_date','last_login_date']
});