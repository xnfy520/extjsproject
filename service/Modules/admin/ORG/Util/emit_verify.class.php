<?php
/**
 * Created by JetBrains PhpStorm.
 * File: validation.class.php
 * User: Xnfy520@gmail.com
 * Date: 12-3-28
 * Time: 下午8:24
 */

	class validation{

		private $width;
		private $height;
		private $num;
		private $imgsrc;
		private $distrubs;
		private $code;

		function __construct($width=100, $height=20, $num=4){
			$this->width = $width;
			$this->height = $height;
			$this->num = $num;
			$this->distrubs = $this->width*$this->height/10;
			$this->code = $this->setcode();
		}

		function show($truetype=''){
			$this->createimg();
			$this->setdistrubs();
			$this->settext($truetype);
			$this->outputimg();
		}

		private function createimg(){
			$this->imgsrc = imagecreatetruecolor($this->width, $this->height);
			//$randback = imagecolorallocate($this->imgsrc, rand(200, 255), rand(200, 255), rand(200, 255));
			$randback = imagecolorallocate($this->imgsrc, 255, 255, 255);
			imagefill($this->imgsrc, 0, 0, $randback);
		}

		private function setdistrubs(){
			for($i=0; $i<$this->distrubs; $i++){
				$randcolor = imagecolorallocate($this->imgsrc, rand(100, 200), rand(100, 200), rand(100, 200));
				imagesetpixel($this->imgsrc, rand(0, $this->width), rand(0, $this->height), $randcolor);
			}
			for($j=0; $j<$this->num; $j++){
				$randcolor = imagecolorallocate($this->imgsrc, rand(0, 200), rand(0, 200), rand(0, 200));
				imageline($this->imgsrc, rand(0, $this->width), rand(0, $this->height), rand(0, $this->width), rand(0, $this->height), $randcolor);
			}
		}

		private function settext($truetype){
			if($truetype==''){
				for($i=0; $i<$this->num; $i++){
					$randcolor = imagecolorallocate($this->imgsrc, rand(0,100), rand(0,100), rand(0,100));
					$x = ($this->width/$this->num)*$i+7;
					$y = 2;
					imagechar($this->imgsrc, 5, $x, $y, $this->code[$i], $randcolor);
				}
			}else{
				for($i=0; $i<$this->num; $i++){
					$randcolor = imagecolorallocate($this->imgsrc, rand(0, 100), rand(0, 100), rand(0, 100));
					$x = ($this->width/$this->num)*$i+7;
					$y = $this->height-2;
					imagettftext($this->imgsrc, rand(10, 12), rand(10, 20), $x, $y, $randcolor, $truetype, $this->code[$i]);
				}
			}
		}

		private function outputimg(){
			if(imagetypes() && IMG_GIF){
				header('Content-Type:image/gif');
				imagegif($this->imgsrc);
			}elseif(imagetypes() && IMG_JPEG){
				header('Content-Type:image/jpeg');
				imagejpeg($this->imgsrc);
			}elseif(imagetypes() && IMG_PNG){
				header('Content-Type:image/png');
				imagepng($this->imgsrc);
			}else{
				die('暂不支持此图片格式');
			}
		}

		private function setcode(){
			//$string = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
			$string = '123456789abcdefghijkmnprstuvwxyz';
			$chars = '';
			for($i=0; $i<$this->num; $i++){
				$char = $string[rand(0, strlen($string)-1)];
				$chars.=$char;
			}
			return $chars;
		}

		function getcode(){
			return $this->code;
		}

	}