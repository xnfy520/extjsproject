<?php

	return array(

		'LOGIN_ALLOW_LEVEL'=>array(1,2),

		//用户分组
		'USER_GROUP'=>array(
			array(
				'name'=>'系统管理员',
				'level'=>1,
				'description'=>''
			),
			array(
				'name'=>'公司成员',
				'level'=>2,
				'description'=>'',
				'item'=>array(
					array('type'=>1,'name'=>'销售'),
					array('type'=>2,'name'=>'美工'),
					array('type'=>3,'name'=>'前台'),
					array('type'=>4,'name'=>'后台')
				)
			),
			array(
				'name'=>'普通成员',
				'level'=>3,
				'description'=>''
			),
		),

	);