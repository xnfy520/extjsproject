<?php

class upload
{
	private $filepath;
	private $allowtype = array('jpg','png','iso');
	private $israndname = false;
	private $maxsize = 20000000000000;
	private $orgname;
	private $tmpname;
	private $newname;
	private $filetype;
	private $filesize;
	private $errornum = 0;
	private $errormsg = '';

	function __construct($options = array()){
		foreach($options as $key=>$value){
			$key = strtolower($key);
			if(!in_array($key, get_class_vars(get_class($this)))){
				continue;
			}
			$this->setoptions($key, $value);
		}
	}

	private function setoptions($key, $value){
		$this->$key = $value;
	}

	function uploadfiles($form){
		$return  = true;
		if(!$this->checkfilepath()){
			$this->errormsg = $this->seterrormsg();
			return false;
		}
		$name = $_FILES[$form]['name'];
		$tmpname = $_FILES[$form]['tmp_name'];
		$size = $_FILES[$form]['size'];
		$error = $_FILES[$form]['error'];
		if(is_array($name)){
			$errors = array();
			for($i=0; $i<count($name); $i++){
				if($this->setattributes($name[$i], $tmpname[$i], $size[$i], $error[$i])){
					if(!$this->checkfiletype() || !$this->checkfilesize()){
						$errors[] = $this->seterrormsg();
						$return = false;
					}
				}else{
					$errors[] = $this->seterrormsg();
					$return  = false;
				}
				$this->setattributes();
			}
			if($return){
				$newnames = array();
				for($i=0; $i<count($name); $i++){
					if($this->setattributes($name[$i], $tmpname[$i], $size[$i], $error[$i])){
						$this->setnewname();
						if(!$this->copyfile()){
							$errors[] = $this->seterrormsg();
							$return = false;
						}else{
							$newnames[] = $this->newname;
							$return = true;
						}
					}
				}
				$this->newname = $newnames;
			}
			if(!$return){
				$this->errormsg = $errors;
			}
			return $return;
		}else{
			if($this->setattributes($name, $tmpname, $size, $error)){
				if($this->checkfiletype() && $this->checkfilesize()){
					$this->setnewname();
					if($this->copyfile()){
						$return  = true;
					}else{
						$return  = false;
					}
				}else{
					$return  = false;
				}
			}else{
				$return = false;
			}
			if(!$return){
				$this->errormsg = $this->seterrormsg();
			}
			return $return;
		}
	}

	private function copyfile(){
		if($this->errornum){
			return false;
		}
		$filename = rtrim($this->filepath,'/').'/';
	//	$filename.=$this->newname;

		$newname = iconv('utf-8','gbk',$this->newname);
		$filename.=$newname;

		if(@!move_uploaded_file($this->tmpname, $filename)){
			$this->setoptions('errornum', -3);
			return false;
		}else{
			return true;
		}
	}

	private function setattributes($name='', $tmpname='', $size=0, $error=0){
		$this->setoptions('errornum', $error);
		if($error){
			return false;
		}
		$this->setoptions('orgname', $name);
		$this->setoptions('tmpname', $tmpname);
		$this->setoptions('filesize', $size);
		$filetype = explode('.', $name);
		$this->setoptions('filetype', strtolower($filetype[count($filetype)-1]));
		return true;
	}

	private function checkfilepath(){
		if(empty($this->filepath)){
			$this->setoptions('errornum', -5);
			return false;
		}
		if(!file_exists($this->filepath) || !is_writeable($this->filepath)){
			if(@!mkdir($this->filepath, 0755)){
				$this->setoptions('errornum', -4);
				return false;
			}
		}
		return true;
	}

	private function checkfiletype(){
		if(!in_array($this->filetype, $this->allowtype)){
//			$this->setoptions('errornum', -1);
			return true;
		}else{
			return true;
		}
	}

	private function checkfilesize(){
		if($this->filesize>$this->maxsize){
//			$this->setoptions('errornum', -2);
			return true;
		}else{
			return true;
		}
	}

	private function setrandname(){
		$filename = date('YmdHis').rand(100, 999);
		return $filename.'.'.$this->filetype;
	}

	private function setnewname(){
		if($this->israndname){
			$this->setoptions('newname', $this->setrandname());
		}else{
			$this->setoptions('newname', $this->orgname);
		}
	}

	private function seterrormsg(){
		$errormsg = '上传的文件有误:';
		switch($this->errornum){
			case 4 : $errormsg.='没有文件被上传'; break;
			case 3 : $errormsg.='只有部分文件被上传'; break;
			case 2 : $errormsg.='上传文件超过表单的大小限制'; break;
			case 1 : $errormsg.='上传文件超过系统配置的大小限制'; break;
			case -1 : $errormsg.='未允许类型'; break;
			case -2 : $errormsg.='上传文件超过程序配置的大小限制'; break;
			case -3 : $errormsg.='上传文件失败'; break;
			case -4 : $errormsg.='创建存放文件的目录失败, 请重新指定存放文件的目录'; break;
			case -5 : $errormsg.="未指定上传目录"; break;
			default: $errormsg.='未知错误'; break;
		}
		return $errormsg;
	}

	function getnewname(){
		return $this->newname;
	}

	function geterrormsg(){
		return $this->errormsg;
	}
}
