<?php

class ConfigurationAction extends CommonAction {

	public function index(){
		// $data = array(
		// 	array('key'=>'网站标题','index'=>'site_name','value'=>'乐点创意'),
		// 	array('key'=>'网站描述','index'=>'site_description','value'=>'乐点创意'),
		// 	array('key'=>'网站关键字','index'=>'site_keywords','value'=>'创意,网站'),
		// 	array('key'=>'版权信息','index'=>'site_copyright','value'=>'Copyright© 2002-2013'),
		// 	array('key'=>'备案信息','index'=>'site_approve','value'=>'鄂ICP备10207551号'),
		// );
		// F(MODULE_NAME,$data);
		if(F(MODULE_NAME)){
			$data = F(MODULE_NAME);
			echo json_encode(array('data'=>$data));
		}
	}

	function insert(){
		if(!empty($_POST['key'])&& !empty($_POST['index'])){
			$data = array($_POST);
			if(F(MODULE_NAME)){
				$datas = F(MODULE_NAME);
				$newdatas = array_merge($datas,$data);
				F(MODULE_NAME,$newdatas);
			}else{
				F(MODULE_NAME,$data);
			}
			echo json_encode(array(
							"success"=>true,
							"msg"=>'添加成功'
						));
		}else{
			echo json_encode(array(
							"success"=>false,
							"msg"=>'添加失败'
						));
		}
	}

	function update(){
		if(!empty($_POST['key'])&& !empty($_POST['index'])){
			if(F(MODULE_NAME)){
				$datas = F(MODULE_NAME);
				for($i=0;$i<count($datas);$i++){
					if($datas[$i]['index'] == $_POST['index']){
						$datas[$i] = $_POST;
						break;
					}
				}
				F(MODULE_NAME,$datas);
			}else{
				F(MODULE_NAME,array($_POST));
			}
			echo json_encode(array(
							"success"=>true,
							"msg"=>'修改成功'
						));
		}else{
			echo json_encode(array(
							"success"=>false,
							"msg"=>'修改失败'
						));
		}
	}

	function delete(){
		if(!empty($_POST['datas'])){
			$data = explode(',', $_POST['datas']);
			$datas = F(MODULE_NAME);
			if(count($datas)>0){
				$newdatas = array();
				foreach($datas as $keys=>$values){
					foreach($data as $k=>$v){
						if($values['index']==$v){
							unset($datas[$keys]);
						}
					}
				}
				$newdatas = array();
				foreach($datas as $key=>$value){
					$newdatas[] = $value;
				}
				F(MODULE_NAME,$newdatas);
				echo json_encode(array(
							"success"=>true,
							"msg"=>'删除成功'
						));
			}else{
				echo json_encode(array(
							"success"=>false,
							"msg"=>'删除失败'
						));
			}
		}else{
			echo json_encode(array(
							"success"=>false,
							"msg"=>'删除失败'
						));
		}
	}

}