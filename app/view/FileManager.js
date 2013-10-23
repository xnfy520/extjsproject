Ext.define('Xnfy.view.FileManager', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.filemanager',
    title: 'Tab',
    html:'<iframe id="iframe-filemanager" style="width:100%;height:100%;border:0" src="public/filemanager/dialog.php?o=none"></iframe>',
    // layout:'fit',
    // items:[{
    //     xtype:'component',
    //     autoEl:{
    //         tag:"iframe",
    //         src:"filemanager/dialog.php"
    //     }
    // }],
    closable: true,
    style: {
        borderStyle: '0 solid #fff'
    },
    listeners:{
        render:function(self){
            self.setLoading(true);
            subWin = window.frames['iframe-filemanager'];
            if (window.attachEvent) {
                subWin.attachEvent("onload", function(){
                });
            }else {
                subWin.addEventListener("load", function(){
                    self.setLoading(false);
                }, true);
            }
        }
    },
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        });
        me.callParent(arguments);
    }

});