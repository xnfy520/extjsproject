Ext.define('Xnfy.util.common',{
	uxNotification:function(status,msg,delay){
		if(status){
			if(!msg){
				msg = '操作成功';
			}
			Ext.create('widget.uxNotification', {
				// title: '提示信息',
				position: 't',
				paddingY: 5,
				resizable:false,
				closable: false,
				html: '<div style="min-width:200px;max-width:500px"><i style="color:#3892d3;font-size:18px;" class="icon-ok-sign"></i> <span style="font-size:15px;">'+msg+'</span></div>',
				autoCloseDelay: 500,
				autoHideDelay:delay?delay:3000,
				slideInDuration: 500,
				slideBackDuration: 500,
				slideInAnimation: 'bounceOut', //bounceOut elasticIn
				slideBackAnimation: 'easeIn' //easeIn elasticIn
			}).show();
		}else{
			if(!msg){
				msg = '操作失败';
			}
			Ext.create('widget.uxNotification', {
                // title: '提示信息',
                position: 't',
                paddingY: 5,
                resizable:false,
                closable: false,
                html: '<div style="min-width:200px;max-width:500px"><i style="color:red;font-size:18px;" class="icon-remove-sign"></i> <span style="font-size:15px;">'+msg+'</span></div>',
                autoCloseDelay: 500,
                autoHideDelay:delay?delay:5000,
                slideInDuration: 500,
                slideBackDuration: 500,
                slideInAnimation: 'elasticIn', //bounceOut elasticIn
                slideBackAnimation: 'easeIn', //easeIn elasticIn
                bodyStyle: {
                    //background: '#ffc'
                },
                style:{
                    borderColor: 'red',
                    borderStyle: 'solid'
                }
            }).show();
		}
	},
	unRemoveNodeTab:function(node){
		var self = this;
		var center = Ext.getCmp("center");
		var tab = center.getComponent(node.id);
		if(node.hasChildNodes()){
			node.eachChild(function(n){
				n.remove();
				if(center.getComponent(n.id)){
                    center.getComponent(n.id).close();
                }
				self.unRemoveNodeTab(n);
			});
		}
		var root = node.getOwnerTree().getRootNode();
		var activetab = center.getActiveTab(); //获取当前tab
		if(root && (root.isExpanded() || root.isLoaded())){
			if(activetab){
				if(root.findChild('id',activetab.openid,true)){
					var pid = root.findChild('id',activetab.openid,true).data.parentId;
					var pgrid = center.getComponent('Xnfy.model.ClassifyMenu-'+pid);
					if(pgrid){
						var record = pgrid.child('gridpanel').getStore().findRecord('id',activetab.openid);
						if(record){
							pgrid.child('gridpanel').getStore().reload({params:{pid:pid}});
						}
					}
				}
			}
		}

		if(node){
            node.remove();
        }
		if(tab){
            tab.close();
        }
	}
});
