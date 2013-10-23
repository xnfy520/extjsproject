<?php

	// echo '<pre>';

	// var_dump($_GET);

	// echo '</pre>';

	$arr = array('name'=>'zw','email'=>'zw@qq.com','phone'=>'123');

	$arrs = array(
		array('name'=>'zw','email'=>'zw@qq.com','phone'=>'123'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
				array('name'=>'zw','email'=>'zw@qq.com','phone'=>'123'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
				array('name'=>'zw','email'=>'zw@qq.com','phone'=>'123'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
				array('name'=>'zw','email'=>'zw@qq.com','phone'=>'123'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw123','email'=>'zw123@qq.com','phone'=>'123456'),
		array('name'=>'zw321','email'=>'zw321@qq.com','phone'=>'123654')
	);

	if($_GET['id']=='ClassifyMenu'){
		echo json_encode(array('total'=>1,'items'=>$arr));
	}else{
		$abc = array_chunk($arrs, 10);
		echo json_encode(array('total'=>count($arrs),'items'=>$abc[$_GET['page']-1]));
	}