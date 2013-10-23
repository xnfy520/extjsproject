<?php

	function moveFiles($source,$dest,$model,$action){
		$s = './Public/tmp/';
		$d = './Public/Uploads/'.$model.'/';

		if(!is_dir($d)){
			mkdir($d,0777,true);
		}

		switch($action){
			case 'update':
				copy($s.$source, $d.$source);
				unlink($d.$dest);
				unlink($s.$source);
				break;
			case 'insert':
				copy($s.$source, $d.$source);
				unlink($s.$source);
				break;
			case 'delete':
				unlink($d.$dest);
				break;
			case 'delete_file':
				unlink($s.$source);
				break;
		}

//		if($action=='update'){
//			copy($s.$source, $d.$source);
//			unlink($d.$dest);
//			unlink($s.$source);
//		}else if($action=='insert'){
//			copy($s.$source, $d.$source);
//			unlink($s.$source);
//		}else if($action=='delete'){
//			unlink($d.$dest);
//		}else if($action=='delete_file'){
//			unlink($s.$source);
//		}

	}