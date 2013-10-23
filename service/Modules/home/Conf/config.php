<?php

return array(
    'SESSION_AUTO_START'        =>  true,

	'LAYOUT_ON'=>true, //是否启用布局

	'URL_MODEL'=>2, //使用PATHINFO模式

	'DEFAULT_THEME'=>'default', //默认模板主题目录

//	SHOW_PAGE_TRACE'=>true, //显示页面trace(踪迹)信息

	'TOKEN_ON'=>false,  // 是否开启令牌验证

//	'LAYOUT_NAME'=>'layout', //当前布局名称

	'SHOW_PAGE_TRACE'=>false, //显示页面trace(踪迹)信息

	'DB_FIELDS_CACHE' =>false, //是否开启数据表字段缓存

	'TMPL_CACHE_ON'=>false, //关闭模版缓存

	'LOG_RECORD'=>false, //是否记录日志信息

	'LOG_LEVEL'  =>'ERR', // 只记录EMERG ALERT CRIT ERR 错误
);