<?php
return array(


	'URL_MODEL'                 =>  2, // 如果你的环境不支持PATHINFO 请设置为3

	'APP_AUTOLOAD_PATH'         =>  '@.TagLib',
	'APP_GROUP_LIST'            =>  'home,admin',
	'DEFAULT_GROUP'             =>  'home',

	'APP_GROUP_MODE'            =>  1,
	'SHOW_PAGE_TRACE'           =>  1,//显示调试信息

	'TMPL_L_DELIM'=>'<{', //模版标签开始标记
	'TMPL_R_DELIM'=>'}>', //模版标签结束标记

	'LOAD_EXT_CONFIG' => 'db,user', //加载扩展配置文件
	"LOAD_EXT_FILE"=>"underscore", //加载扩展函数文件

	'TMPL_EXCEPTION_FILE'=>'./project/Tpl/Public/error.html'

);
