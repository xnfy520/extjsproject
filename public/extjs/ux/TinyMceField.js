Ext.define('Ext.ux.TinyMceField', {
    extend: 'Ext.form.field.TextArea',
    alias: 'widget.tinymce',
    /**
     * TinyMCE editor configuration.
     *
     * @cfg {Object}
     */
    editorConfig: undefined,
    afterRender: function() {
        this.callParent(arguments);

        var me = this,
            id = this.inputEl.id;
        var editor = tinymce.createEditor(id,
            Ext.apply({
                selector: '#' + id,
                //resize: true,
                height: this.height-36,
                width: this.width,
                // autoresize_min_height: 300,
                // autoresize_max_height: 800,
                toolbar_items_size: 'small',
                menubar: false,
                language : 'zh_CN',
                statusbar : false,
                //forced_root_block:'',
                plugins: [
                    "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
                    "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                    "table contextmenu directionality emoticons template textcolor paste fullpage textcolor responsivefilemanager"
                ],//fullpage
                toolbar1:"searchreplace print | fontselect fontsizeselect | link unlink anchor | image media responsivefilemanager | table charmap hr pagebreak nonbreaking | inserttime",
                toolbar2: "undo redo removeformat | forecolor backcolor | bold italic underline strikethrough subscript superscript | alignleft aligncenter alignright alignjustify | outdent indent | ltr rtl | bullist numlist blockquote | visualblocks code preview fullscreen",
                autosave_ask_before_unload: false,
                plugin_preview_width : "800",
                code_dialog_width : "800",
                external_filemanager_path:"public/filemanager/",
                filemanager_title:"文件管理器",
                external_plugins: { "filemanager" : "../filemanager/plugin.min.js"},
                init_instance_callback:function(inst){
                    //inst.execCommand('mceAutoResize');
                }
            },this.editorConfig));

        this.editor = editor;
        // set initial value when the editor has been rendered            
        editor.on('init', function() {
            editor.setContent(me.value || '');
        });

        // render
        editor.render();

        // --- Relay events to Ext

        editor.on('focus', function() {
            me.previousContent = editor.getContent();
            me.fireEvent('focus', me);
        });

        editor.on('blur', function() {
            me.fireEvent('blur', me);
        });

        editor.on('change', function(e) {
            var content = editor.getContent(),
                previousContent = me.previousContent;
            if (content !== previousContent) {
                me.previousContent = content;
                me.fireEvent('change', me, content, previousContent);
            }
        });
    },
    getRawValue: function() {
        var editor = this.editor,
            value = editor && editor.initialized ? editor.getContent() : Ext.value(this.rawValue, '');
        this.rawValue = value;
        return value;
    },
    setRawValue: function(value) {
        this.callParent(arguments);

        var editor = this.editor;
        if (editor && editor.initialized) {
            editor.setContent(value);
        }

        return this;
    }
});