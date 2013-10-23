Ext.define('Xnfy.view.Main', {
    extend: 'Ext.container.Viewport',
    layout: {
        type: 'border'
    },
    requires : [
        'Xnfy.view.Header',
        'Xnfy.view.Menu',
        'Xnfy.view.Center',
        'Xnfy.view.Footer',
        'Xnfy.store.Admin'
    ],
    listeners:{
                beforerender:function(self){
                        Ext.Ajax.request({
                            url:"admin/common/check",
                            method:'get',
                            callback:function(records, operation, success){
                                var response = Ext.JSON.decode(success.responseText);
                                if(response.success){
                                    Ext.getCmp('admin@').setText(response.datas.username);
                                    Ext.Object.each(self.items.items,function(key,value,myself){
                                        value.show();
                                    });
                                }else{
                                    var loginwindow = self.openLoginWindow();
                                    loginwindow.show(null,function(){
                                        this.zIndexManager.mask.setStyle('background','url(public/images/login_gb.jpg) no-repeat 100% 100%');
                                    });
                                }
                            }
                        });
                },
                render:function(self){
                    // console.log('2');
                },
                afterrender:function(){
                    // console.log('3');
                    // console.log();
                }
            },
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
           items: [
                    Ext.create('Xnfy.view.Header').hide(),
                    Ext.create('Xnfy.view.Menu').hide(),
                    Ext.create('Xnfy.view.Center').hide(),
                    Ext.create('Xnfy.view.Footer').hide()
                ]
        });

        me.callParent(arguments);
    },
    openLoginWindow:function(){
         return Ext.create('Ext.window.Window', {
                //autoShow: true,
                title: '管理员登录',
                draggable:false,
                closable:false,
                width: 350,
                shadowOffset:10,
                maximizable:false,
                resizable:false,
                modal:true,
                header:true,
                height:190,
                layout: 'border',
                items:[
                    {
                        xtype:'panel',
                        region: 'west',
                        border:false,
                        style:{
                            background:'white',
                            textAlign:'center'
                        },
                        width:150,
                        height:145,
                        padding:'10 0 0 0',
                        html:'<img src="./public/images/logo.jpg" style="width:110px" /><span style="display:inline-block;font-weight:bold;font-size:13px;color:#3892D3;margin-top:2px;"><a style="font-weight:bold;font-size:13px;color:#3892D3;text-decoration:none;margin-right:2px;" target="_blank" href="http://whldcy.com">乐点创意</a>后台管理系统</span>'
                    },
                    {
                        xtype:'form',
                        region: 'center',
                        border:false,
                        bodyPadding: '0 5 5 0',
                        defaultType: 'textfield',
                        fieldDefaults: {
                            labelAlign: 'left',
                            anchor: '100%',
                            margin:'11px 0 0 0',
                            labelStyle: 'font-weight:bold;',
                            msgTarget:'side'
                        },
                        items: [{
                            name:'username',
                            allowBlank: false,
                            emptyText:'用户名',
                            stripCharsRe:new RegExp(/[^\w\.\@]/i),
                            minLength:5,
                            listeners:{
                                specialkey: function(field, e){
                                    if (e.getKey() == e.ENTER) {
                                        Ext.getCmp('login').fireEvent('click');
                                    }
                                }
                            }
                        },{
                            name:'password',
                            inputType:'password',
                            allowBlank: false,
                            emptyText:'密码',
                            stripCharsRe:new RegExp(/[\s]/i),
                            minLength:6,
                            listeners:{
                                specialkey: function(field, e){
                                    if (e.getKey() == e.ENTER) {
                                        Ext.getCmp('login').fireEvent('click');
                                    }
                                }
                            }
                        },{
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            padding:0,
                            margin:0,
                            defaultType: 'textfield',
                            items:[{
                                name:'verify',
                                width:'50%',
                                allowBlank: false,
                                stripCharsRe:new RegExp(/[^\da-z]/i),
                                emptyText:'验证码',
                                maxLength:4,
                                minLength:4,
                                listeners:{
                                    specialkey: function(field, e){
                                        if (e.getKey() == e.ENTER) {
                                            Ext.getCmp('login').fireEvent('click');
                                        }
                                    }
                                }
                            },
                            Ext.create('Ext.Img', {
                                width:'50%',
                                height:'100%',
                                id:'login-verify',
                                // src: 'http://www.sencha.com/img/20110215-feat-html5.png',
                                src: './admin/common/verify',
                                margin:'11px 0 0 5px',
                                listeners:{
                                    el: {
                                        click: function() {
                                            Ext.getCmp(this.id).setSrc('./admin/common/verify?_id='+Math.random());
                                        }
                                    }
                                }
                            })
                            ]
                        }],
                        buttons: [{
                            text: '重置',
                            formBind: true,
                            handler:function(button){
                                button.up('form').getForm().reset();
                            }
                        },
                        {xtype: 'tbfill'},
                        {
                            text:'登录',
                            id:'login',
                            formBind: true,
                            listeners:{
                                click:function(){
                                    var self = this;
                                    var form = self.up('form').getForm();
                                    if(form && form.isValid()){
                                        form.submit({
                                            waitMsg:'正在处理数据...',
                                            method:'POST',
                                            url:'admin/common/login',
                                            submitEmptyText:false,
                                            success:function(f, response){
                                                //self.up('window').hide();
                                                self.up('window').setLoading(true);
                                                window.location.reload();
                                            },
                                            failure:function(f, response){
                                                form.findField('verify').setValue('').focus();
                                                Ext.getCmp('login-verify').setSrc('./admin/common/verify?_id='+Math.random());
                                                Ext.create('Xnfy.util.common').uxNotification(false,response.result.msg,5000);
                                            }
                                        });
                                    }
                                }
                            }
                        }]
                    }
                ]
            });
    }
});