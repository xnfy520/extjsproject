Ext.define('Xnfy.controller.ClassifyList', {
    extend: 'Ext.app.Controller',
    models: [
        'ClassifyMenu','ClassifyList'
    ],
    stores: [
        'ClassifyMenu','ClassifyList'
    ],
    views: [
        'Menu','Center','ClassifyList'
    ],
    init: function(application) {
        this.control({
            // 'classifylist [itemId=add]':{
            //     click:function(button){
            //         var gridpanel = button.up('gridpanel');
            //         var gridselectionmodel = gridpanel.getSelectionModel();
            //         if(gridselectionmodel.getCount()>0){
            //             gridselectionmodel.deselectAll(true);
            //         }
            //         var form = gridpanel.nextSibling('form');
            //         if(form.getForm().findField('id')){
            //             form.remove(form.getForm().findField('id'));
            //         }
            //         if(form.getCollapsed()){
            //             gridpanel.getDockedItems('toolbar [itemId=edit]')[0].setDisabled(true);
            //         }
            //         form.setTitle('添加 分类');
            //         form.getForm().reset();
            //         form.expand();
            //     }
            // },
            // 'classifylist [itemId=edit]':{
            //     click:function(button){
            //         var gridpanel = button.up('gridpanel');
            //         var form = gridpanel.nextSibling('form');
            //         form.expand();
            //     }
            // },
            // 'classifylist gridpanel':{
            //     selectionchange:function(self, selected, eOpts){
            //         console.log(parent);
            //         console.log(self);
            //         console.log(selected);
            //         console.log(this);
            //     },
            //     celldblclick:function(self, td, cellIndex, record, tr, rowIndex, e, eOpts){
            //         console.log(self);
            //         // var form = this.child('form');
            //         // form.toggleCollapse();
            //     }
            // }
        });
    }

});
