<?php
/**
 * Project: Recipe
 * File: emit_images.class.php
 * Author: Xnfy520@gmail.com
 * Date: 12-4-17
 * Time: 下午8:46
 */

class image
{
	private $path;

	function __construct($path){
		$this->path = rtrim($path,'/').'/';
	}

	function thumb($name, $width, $height, $prefix, $true){
		$orgimginfo = $this->getorgimginfo($name);
		$orgimgsrc = $this->getorgimgsrc($name, $orgimginfo);
		$newimginfo = $this->getnewimginfo($width, $height, $orgimginfo, $true);
		$newimgsrc = $this->getnewimgsrc($orgimginfo, $orgimgsrc, $newimginfo);
		return $this->outputimg($newimgsrc, $prefix.$name, $orgimginfo);
	}


	function cut($name, $prefix=''){
		$orgimginfo = $this->getorgimginfo($name);
		$orgimgsrc = $this->getorgimgsrc($name, $orgimginfo);
		$newimginfo = $this->getnewcutimginfo($orgimginfo);
		$newimgsrc = $this->getnewcutimgsrc($orgimginfo, $orgimgsrc, $newimginfo);
		return $this->outputimg($newimgsrc, $prefix.$name, $orgimginfo);
	}

	function tailorIimage($name,$imageinfo,$prefix=''){
		$orgimginfo = $this->getorgimginfo($name);
		$orgimgsrc = $this->getorgimgsrc($name, $orgimginfo);

		$newimgsrc = $this->getnewtailorimgsrc($orgimginfo, $orgimgsrc, $imageinfo);

		return $this->outputimg($newimgsrc, $prefix.$name, $orgimginfo);
	}

	function getnewtailorimgsrc($orgimginfo, $orgimgsrc, $imageinfo){
		$newimgsrc = imagecreatetruecolor($imageinfo['width'], $imageinfo['height']);
		$gettms = imagecolortransparent($orgimgsrc);
		if($gettms>=0 && $gettms<imagecolorstotal($orgimgsrc)){
			$tmsindex = imagecolorsforindex($orgimgsrc, $gettms);
			$tms = imagecolorallocate($orgimgsrc, $tmsindex['red'], $tmsindex['green'], $tmsindex['bule']);
			imagefill($newimgsrc, 0, 0, $tms);
			imagecolortransparent($newimgsrc, $tms);
		}

		imagecopyresized($newimgsrc, $orgimgsrc, 0, 0, $imageinfo['x1'], $imageinfo['y1'], $imageinfo['width'], $imageinfo['height'], $imageinfo['width'], $imageinfo['height']);

		imagedestroy($orgimgsrc);
		return $newimgsrc;
	}

/***********************************************/
	function zdcut($name,$width=100,$height=200,$prefix=''){
		//原图片信息,宽 高 类型
		$orgimginfo = $this->getorgimginfo($name);
		//原图片资源
		$orgimgsrc = $this->getorgimgsrc($name, $orgimginfo);
		//新图片宽 高
		$newimginfo = $this->getnewzdcutimginfo($orgimginfo,$width, $height);

		$newimgsrc = $this->getnewdzcutimgsrc($orgimginfo, $orgimgsrc, $newimginfo);
		return $this->outputimg($newimgsrc, $prefix.$name, $orgimginfo);
	}

	private function getnewzdcutimginfo($orgimginfo,$width, $height){

//		if($width>$orgimginfo['width'] || $height>$orgimginfo['height']){
//			$newsize['width'] = $width;
//			$newsize['height'] = $orgimginfo['height'];
//		}else{
			$newsize['width'] = $width;
			$newsize['height'] = $height;
//		}



		return $newsize;
	}

	private function getnewdzcutimgsrc($orgimginfo, $orgimgsrc, $newimginfo){
		//新图片资源宽度, 新图片资源高度
		$newimgsrc = imagecreatetruecolor($newimginfo['width'], $newimginfo['height']);
		$gettms = imagecolortransparent($orgimgsrc);
		if($gettms>=0 && $gettms<imagecolorstotal($orgimgsrc)){
			$tmsindex = imagecolorsforindex($orgimgsrc, $gettms);
			$tms = imagecolorallocate($orgimgsrc, $tmsindex['red'], $tmsindex['green'], $tmsindex['bule']);
			imagefill($newimgsrc, 0, 0, $tms);
			imagecolortransparent($newimgsrc, $tms);
		}

/**
 * $newimgsrc 新图片资源
 * $orgimgsrc 原图片资源

 * 从原图片的
 * ($orgimginfo['width']-$newimginfo['width'])/2 ,0;
 * $newimginfo['width'], $newimginfo['height']位置开始
 *
 * 0, 0 复制到新图片的 0,0
 * $newimginfo['width'], $newimginfo['height']位置
 *
 */
		$tms = imagecolorallocate($newimgsrc, 255, 255, 255);
		imagefill($newimgsrc, 0, 0, $tms);
imagecopyresized($newimgsrc, $orgimgsrc, 0, 0, ($orgimginfo['width']-$newimginfo['width'])/2, ($orgimginfo['height']-$newimginfo['height'])/2, $newimginfo['width'], $newimginfo['height'], $newimginfo['width'], $newimginfo['height']);

		imagedestroy($orgimgsrc);
		return $newimgsrc;
	}

	/***********************************************/


	function waterimg($background, $waterimg, $position, $prefix){
		$backgroundimginfo = $this->getorgimginfo($background);
		$waterimginfo = $this->getorgimginfo($waterimg);
		$backgroundimgsrc = $this->getorgimgsrc($background, $backgroundimginfo);
		$waterimgsrc = $this->getorgimgsrc($waterimg, $waterimginfo);
		$pos = $this->getposition($backgroundimginfo, $waterimginfo, $position);
		if(!$pos){
			 die('背景图片尺寸不能小于水印图片尺寸');
		}
		$newimgsrc = $this->copyimg($backgroundimgsrc, $waterimgsrc, $pos, $waterimginfo);
		return $this->outputimg($newimgsrc, $prefix.$background, $backgroundimginfo);
	}

	function waterstr($background, $string, $prefix ,$truetype=''){
			//获取背景图片信息
		$backgroundimginfo = $this->getorgimginfo($background);
	
			//获取背景图片资源
		$backgroundimgsrc = $this->getorgimgsrc($background, $backgroundimginfo);
	
			//获取新图片资源
		$newimgsrc = $this->addstrings($backgroundimgsrc, $string, $truetype, $backgroundimginfo);

		return $this->outputimg($newimgsrc, $prefix.$background, $backgroundimginfo);
	}

	private function addstrings($backgroundimgsrc, $string, $truetype, $backgroundimginfo){
		$fontcolor=imagecolorallocate($backgroundimgsrc,0,0,0);
		if($truetype==''){
				$x = $backgroundimginfo['width']-(strlen($string)*10);
				$y = $backgroundimginfo['height']-20;
			imagestring($backgroundimgsrc, 5, $x, $y, $string, $fontcolor);
		}else{
				$x = $backgroundimginfo['width']-(strlen($string)*12);
				$y = $backgroundimginfo['height']-20;
			imagettftext($backgroundimgsrc, 15, 0, $x, $y, $fontcolor, $truetype, $string);
		}
		
		
		return $backgroundimgsrc;
	}

	private function getnewcutimginfo($orgimginfo){
		if($orgimginfo['height']>$orgimginfo['width']){
			$newsize['width'] = $orgimginfo['width'];
			$newsize['height'] = $orgimginfo['width'];
		}else{
			$newsize['width'] = $orgimginfo['height'];
			$newsize['height'] = $orgimginfo['height'];
		}
		return $newsize;
	}

	private function getnewcutimgsrc($orgimginfo, $orgimgsrc, $newimginfo){
		$newimgsrc = imagecreatetruecolor($newimginfo['width'], $newimginfo['height']);
		$gettms = imagecolortransparent($orgimgsrc);
		if($gettms>=0 && $gettms<imagecolorstotal($orgimgsrc)){
			$tmsindex = imagecolorsforindex($orgimgsrc, $gettms);
			$tms = imagecolorallocate($orgimgsrc, $tmsindex['red'], $tmsindex['green'], $tmsindex['bule']);
			imagefill($newimgsrc, 0, 0, $tms);
			imagecolortransparent($newimgsrc, $tms);
		}
		if($orgimginfo['height']<$orgimginfo['width']){
			imagecopyresized($newimgsrc, $orgimgsrc, 0, 0, ($orgimginfo['width']-$newimginfo['width'])/2, 0, $newimginfo['width'], $newimginfo['height'], $orgimginfo['height'], $orgimginfo['height']);
		}else{
			imagecopyresized($newimgsrc, $orgimgsrc, 0, 0, 0 , ($orgimginfo['height']-$newimginfo['height'])/2, $newimginfo['width'], $newimginfo['height'], $orgimginfo['width'], $orgimginfo['width']);

		}
		imagedestroy($orgimgsrc);
		return $newimgsrc;
	}

	private function getorgimginfo($name){
		$imginfo = getimagesize($this->path.$name);
		$orgimginfo['width'] = $imginfo[0];
		$orgimginfo['height'] = $imginfo[1];
		$orgimginfo['type'] = $imginfo[2];
		return $orgimginfo;
	}

	private function getorgimgsrc($name, $orgimginfo){
		$orgimgsrc = null;
		switch($orgimginfo['type']){
			case 1 :
				$orgimgsrc = imagecreatefromgif($this->path.$name);
				break;
			case 2 :
				$orgimgsrc = imagecreatefromjpeg($this->path.$name);
				break;
			case 3 :
				$orgimgsrc = imagecreatefrompng($this->path.$name);
				break;
			default :
				echo '暂不支持此图片格式';
				break;
		}
		return $orgimgsrc;
	}

	private function getnewimginfo($width, $height, $orgimginfo, $true){
		if($true){
			$newsize['width'] = $width;
			$newsize['height'] = $height;
		}else{
			if($orgimginfo['width']<$width && $orgimginfo['height']<$height){
				$newsize['width'] = $orgimginfo['width'];
				$newsize['height'] = $orgimginfo['height'];
			}else{
				$newsize['width'] = $width;
				$newsize['height'] = $height;
			}
		//	if($width<$orgimginfo['width']){
		//		$newsize['width'] = $width;
		//	}
		//	if($height<$orgimginfo['height']){
		//		$newsize['height'] = $height;
		//	}
			if($newsize['width']*$orgimginfo['width']>$newsize['height']*$orgimginfo['height']){
				$newsize['height'] = round($newsize['width']*$orgimginfo['height']/$orgimginfo['width']);
			}else{
				$newsize['width'] = round($newsize['height']*$orgimginfo['width']/$orgimginfo['height']);
			}
		}

		return $newsize;
	}

	private function getnewimgsrc($orgimginfo, $orgimgsrc, $newimginfo){
		$newimgsrc = imagecreatetruecolor($newimginfo['width'], $newimginfo['height']);
		$gettms = imagecolortransparent($orgimgsrc);
		if($gettms>=0 && $gettms<imagecolorstotal($orgimgsrc)){
			$tmsindex = imagecolorsforindex($orgimgsrc, $gettms);
			$tms = imagecolorallocate($orgimgsrc, $tmsindex['red'], $tmsindex['green'], $tmsindex['bule']);
			imagefill($newimgsrc, 0, 0, $tms);
			imagecolortransparent($newimgsrc, $tms);
		}
		imagecopyresized($newimgsrc, $orgimgsrc, 0, 0, 0, 0, $newimginfo['width'], $newimginfo['height'], $orgimginfo['width'], $orgimginfo['height']);
		imagedestroy($orgimgsrc);
		return $newimgsrc;
	}

	private function outputimg($newimgsrc, $newname, $orgimginfo){
		switch($orgimginfo['type']){
			case 1 :
				imagegif($newimgsrc, $this->path.$newname);
				break;
			case 2 :
				imagejpeg($newimgsrc, $this->path.$newname);
				break;
			case 3 :
				imagepng($newimgsrc, $this->path.$newname);
				break;
		}
		return $newname;
	}

	private function getposition($bginfo, $wtinfo, $pos){
		switch($pos){
			case 1 :
				$x = 0;
				$y = 0;
				break;
			case 2 :
				$x = ($bginfo['width']-$wtinfo['width'])/2;
				$y = 0;
				break;
			case 3 :
				$x = $bginfo['width']-$wtinfo['width'];
				$y = 0;
				break;
			case 4 :
				$x = 0;
				$y = ($bginfo['height']-$wtinfo['height'])/2;
				break;
			case 5 :
				$x = ($bginfo['width']-$wtinfo['width'])/2;
				$y = ($bginfo['height']-$wtinfo['height'])/2;
				break;
			case 6 :
				$x = $bginfo['width']-$wtinfo['width'];
				$y = ($bginfo['height']-$wtinfo['height'])/2;
				break;
			case 7 :
				$x = 0;
				$y = $bginfo['height']-$wtinfo['height'];
				break;
			case 8 :
				$x = ($bginfo['width']-$wtinfo['width'])/2;
				$y = $bginfo['height']-$wtinfo['height'];
				break;
			case 9 :
				$x = $bginfo['width']-$wtinfo['width'];
				$y = $bginfo['height']-$wtinfo['height'];
				break;
			case 0 :
			default :
				$x = rand(0, $bginfo['width']-$wtinfo['width']);
				$y = rand(0, $bginfo['height']-$wtinfo['height']);
				break;
		}
		return array('x'=>$x, 'y'=>$y);
	}

	private function copyimg($backgroundimgsrc, $waterimgsrc, $pos, $waterimginfo){
		imagecopy($backgroundimgsrc, $waterimgsrc, $pos['x'], $pos['y'], 0, 0, $waterimginfo['width'], $waterimginfo['height']);
		imagedestroy($waterimgsrc);
		return $backgroundimgsrc;
	}

}
