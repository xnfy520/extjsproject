<?php

	class CommonAction extends Action{

		function _initialize(){
			header("Content-Type:text/html;Charset=utf-8;");
			//unset($_SESSION['admin@']);
		}

		function verify(){
			import('@.ORG.Util.emit_verify');
			$verify = new validation();
			$verify->show();
			$_SESSION['verify'] = md5($verify->getcode());
			// import('ORG.Util.Image');
			// Image::buildImageVerify(4, 1, 'png', 60);
		}

		function check(){
			$status = false;
			if(isset($_SESSION['admin@']['username']) && isset($_SESSION['admin@']['group']) && isset($_SESSION['admin@']['uid'])){
				$search['username'] = $_SESSION['admin@']['username'];
				$search['uid'] = $_SESSION['admin@']['uid'];
				$search['group_id'] = $_SESSION['admin@']['group'];
				$result = $this->checkGroup($search['group_id']);
				if($result){
					$User = M('User');
					$exists = $User->where($search)->count();
					if($exists){
						$status = true;
					}else{
						$status = false;
					}
				}else{
					$status = false;
				}
			}else{
				$status = false;
			}
			if($status){
				echo json_encode(array(
						"success"=>true,
						"datas"=>$_SESSION['admin@']
					));
			}else{
				unset($_SESSION['admin@']);
				echo json_encode(array(
						"success"=>false
					));
			}
		}

		function login(){
			$status = 0; //异常操作
			if(isset($_POST['username']) && isset($_POST['password']) && isset($_POST['verify'])){
				if(md5($_POST['verify'])==$_SESSION['verify']){
					$User = M('User');
					$search['username'] = $_POST['username'];
					$search['password'] = md5($_POST['password']);
					$search['group_id'] = array('neq',0);
					$search['enabled'] = 1;
					$userinfo = $User->field('password',true)->where($search)->find();
					if($userinfo){
						if($this->checkGroup($userinfo['group_id'])){
							$_SESSION['admin@']['username'] = $search['username'];
							$_SESSION['admin@']['uid'] = $userinfo['id'];
							$_SESSION['admin@']['group'] = $userinfo['group_id'];
							$User->where($search)->setField('last_login_date',time());
							$status = 1; //登录成功
						}else{
							$status = -1; //用户分组不存在或未被启用
						}
					}else{
						$status = -2; //用户不存在或被未被启用
					}
				}else{
					$status = -3;//验证码输入有错误
				}
			}else{
				$status = -4;//参数异常
			}
			if($status===1){
				echo json_encode(array(
						"success"=>true,
						"status"=>$status
					));
			}else{
				$msg = '异常操作';
				switch ($status) {
					case 0:
						$msg = '异常操作';
						break;
					case -1:
						$msg = '用户分组不存在或未被启用';
						break;
					case -2:
						$msg = '用户不存在或被未被启用';
						break;
					case -3:
						$msg = '验证码输入有错误';
						break;
					case -4:
						$msg = '参数异常';
						break;
					default:
						$msg = '请检查输入是否有误';
						break;
				}
				echo json_encode(array(
						"success"=>false,
						"msg"=>$msg
					));
			}
		}

		function logout(){
			if(isset($_SESSION['admin@'])){
				unset($_SESSION['admin@']);
			}
		}

		function checkGroup($uid){
			if($uid){
				$UserGroup = M('UserGroup');
				$search['id'] = $uid;
				$search['indexing'] = 'admin';
				$search['enabled'] = 1;
				$exists = $UserGroup->where($search)->count();
				if($exists){
					return true;
				}else{
					return false;
				}
			}else{
				return false;
			}
		}

		function upload(){
			import("ORG.Net.UploadFile");
			$tmpDir = 'upload/tmp/';
			$srcDir = 'uploads/attachments';
			if(!file_exists($tmpDir)){
				mkdir('upload/tmp',0777,true);
			}
			$upload = new UploadFile();
			$upload->savePath =  $tmpDir;
			if($upload->upload()) {
				$uploadInfo = $upload->getUploadFileInfo();
				//dump($uploadInfo);
				// if(isset($_POST['movedir']) && !empty($_POST['movedir'])){
				// 	$flag = false;
				// 	if(isset($_POST['rename']) && $_POST['rename']==1){
				// 		if(copy($tmpDir.$uploadInfo[0]['savename'], $srcDir.$_POST['movedir'].$uploadInfo[0]['name'])){
				// 			$flag = true;
				// 		}else{
				// 			$flag = false;
				// 		}
				// 	}else{
				// 		if(copy($tmpDir.$uploadInfo[0]['savename'], $srcDir.$_POST['movedir'].$uploadInfo[0]['savename'])){
				// 			$flag = true;
				// 		}else{
				// 			$flag = false;
				// 		}
				// 	}
				// 	if($flag){
				// 		unlink($tmpDir.$uploadInfo[0]['savename']);
				// 	}
				// }
				echo json_encode(array('status'=>1,'info'=>'上传成功','data'=>$uploadInfo[0]));
			}else{
				echo json_encode(array('status'=>0,'info'=>$upload->getErrorMsg()));
			}
		}

	}