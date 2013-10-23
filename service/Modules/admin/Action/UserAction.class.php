<?php

class UserAction extends CommonAction {

	public function index(){

		import("@.ORG.Util.emit_ajax_page");

		$MODULE_NAME = D(MODULE_NAME);

		if(isset($_GET['group_id']) && $_GET['group_id']!=''){
			$search['group_id'] = $_GET['group_id'];
		}

		if(isset($_GET['query']) && !empty($_GET['query'])){
			$search['_string'] = 'username like "%'.$_GET['query'].'%" OR email like "%'.$_GET['query'].'%"';
		}

		$counts = $MODULE_NAME->where($search)->count();

		$page = new page($counts,$_GET['limit'],$_GET['page'] ? $_GET['page'] : 0);

		$sort = 'id DESC';

		if(isset($_GET['sort']) && !empty($_GET['sort'])){
			if(!empty($_GET['property']) && !empty($_GET['direction'])){
				$sort = $_GET['propery'].' '.$_GET['direction'];
			}else if(!empty($_GET['property'])){
				$sort = $_GET['propery'];
			}
		}

		$list = $MODULE_NAME->where($search)->limit($page->limit)->order($sort)->select();

		echo json_encode(array(
						"success"=>true,
						"data"=>$list,
						"total"=>$counts
					));
		
	}

	function getData(){
		if(isset($_POST['id']) && !empty($_POST['id'])){
			$MODULE_NAME = M(MODULE_NAME);
			$data = $MODULE_NAME->find($_POST['id']);
			echo json_encode(array(
						"success"=>true,
						"data"=>$data
					));
		}else{
			echo json_encode(array(
						"success"=>false,
						"errors"=>array("msg"=>"异常操作")
					));
		}
	}

	function insert(){
		$MODULE_NAME = M(MODULE_NAME);
		if($data = $MODULE_NAME->create()){
			$username_exist = $MODULE_NAME->where('username="'.$_POST['username'].'"')->count();
			$email_exist = $MODULE_NAME->where('email<>"" AND email="'.$_POST['email'].'"')->count();
			if($username_exist>0 && $email_exist>0){
				echo json_encode(array(
					"success"=>false,
					"errors"=>array("msg"=>"用户名和用户邮箱已经存在")
				));
				return;
			}else if($username_exist>0){
				echo json_encode(array(
					"success"=>false,
					"errors"=>array("msg"=>"用户名已经存在")
				));
				return;
			}else if($email_exist>0){
				echo json_encode(array(
					"success"=>false,
					"errors"=>array("msg"=>"用户邮箱已经存在")
				));
				return;
			}
			$data['group_id'] = $_POST['group_id'];
			$data['password'] = md5($_POST['password']);
			$data['register_date'] = time();
			if($id = $MODULE_NAME->add($data)){
				$data['id'] = $id;
				echo json_encode(array(
						"success"=>true,
						"data"=>$data
					));
			}else{
				echo json_encode(array(
						"success"=>false,
						"errors"=>array("msg"=>"添加数据失败")
					));
			}
		}else{
			echo json_encode(array(
						"success"=>false,
						"errors"=>array("msg"=>"异常操作")
					));
		}
	}

	function update(){
		$MODULE_NAME = D(MODULE_NAME);
		if($data = $MODULE_NAME->create()){
			$username_exist = $MODULE_NAME->where('id<>'.$_POST['id'].' AND username="'.$_POST['username'].'"')->count();
			$email_exist = $MODULE_NAME->where('id<>'.$_POST['id'].' AND email<>"" AND email="'.$_POST['email'].'"')->count();
			if($username_exist>0 && $email_exist>0){
				echo json_encode(array(
					"success"=>false,
					"errors"=>array("msg"=>"用户名和用户邮箱已经存在")
				));
				return;
			}else if($username_exist>0){
				echo json_encode(array(
					"success"=>false,
					"errors"=>array("msg"=>"用户名已经存在")
				));
				return;
			}else if($email_exist>0){
				echo json_encode(array(
					"success"=>false,
					"errors"=>array("msg"=>"用户邮箱已经存在")
				));
				return;
			}
			if(empty($data['password'])){
				unset($data['password']);
			}else{
				$data['password'] = md5($data['password']);
			}
			if($MODULE_NAME->save($data)){
				echo json_encode(array(
						"success"=>true,
						"data"=>$data
					));
			}else{
				echo json_encode(array(
						"success"=>false,
						"errors"=>array("msg"=>"修改失败")
					));
			}
		}else{
			echo json_encode(array(
						"success"=>false,
						"errors"=>array("msg"=>"异常操作")
					));
		}
	}

	function delete(){
		if(isset($_POST['ids'])){
			$ids = explode(',', $_POST['ids']);
			if(count($ids)>0){
				$MODULE_NAME = D(MODULE_NAME);
				for($i=0;$i<count($ids);$i++){
					$MODULE_NAME->delete($ids[$i]);
				}
				echo json_encode(array(
						"success"=>true,
						"data"=>null
					));
			}else{
				echo json_encode(array(
						"success"=>false,
						"errors"=>array("msg"=>"异常操作")
					));
			}
		}else{
			echo json_encode(array(
						"success"=>false,
						"errors"=>array("msg"=>"异常操作")
					));
		}
	}

}