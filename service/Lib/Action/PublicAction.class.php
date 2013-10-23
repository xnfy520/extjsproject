<?php
class PublicAction extends Action {

	function verify(){
		import('ORG.Util.Image');
		Image::buildImageVerify(4, 1, 'png', 60);
	}

}