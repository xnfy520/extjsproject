Ext.define('Xnfy.model.Admin', {
   fields: ['id', 'key','value'],
   extend: 'Ext.data.Model',
   proxy: {
       type: 'sessionstorage',
       id: 'admin-login'
   }
});