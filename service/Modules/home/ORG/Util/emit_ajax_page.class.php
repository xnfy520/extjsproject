 <?php

	class page{

		private $total;
		private $num;
		private $cpage;
		private $tpage;
		private $limit;
		private $uri;
		private $configs;
		private $fnum;
		public $lz;

		function __construct($total, $num=10, $page,$params=''){
			$this->total = ($total) ? $total : 1;
			$this->num = $num;
			if(isset($page) && !empty($page) && ceil($this->total/$this->num)>=$page){
				$this->cpage = $page;
			}else if(ceil($this->total/$this->num)<$page){
				$this->cpage = ceil($this->total/$this->num);
			}else{
				$this->cpage  = 1;
			}
//			if(isset($_POST['page']) && !empty($_POST['page']) && ceil($this->total/$this->num)>=$_POST['page']){
//				$this->cpage = $_POST['page'];
//			}else if(ceil($this->total/$this->num)<$_POST['page']){
//				$this->cpage = ceil($this->total/$this->num);
//			}else{
//				$this->cpage  = 1;
//			}
			$this->tpage = ceil($this->total/$this->num);
			$this->limit = $this->setlimit();
			$this->uri = $this->seturi($params);
			$this->configs = array('header'=>'首页', 'footer'=>'尾页', 'prev'=>'上一页', 'next'=>'下一页');
			$this->fnum = 10;
			$this->lz = ($this->cpage-1)*$this->num;
		}

		function __get($arg){
			if($arg=='limit'){
				return $this->limit;
			}else{
				return null;
			}
		}

		function setlimit(){
		//	return 'limit '.($this->cpage-1)*$this->num.' ,'.$this->num;
			return ($this->cpage-1)*$this->num.' ,'.$this->num;
		}

		private function seturi($params){
			$url = $_SERVER['REQUEST_URI'].(strpos($_SERVER['REQUEST_URI'], '?') ? '' : '?').$params;
			$parseurl = parse_url($url);
			if(isset($parseurl['query'])){
				parse_str($parseurl['query'], $parsestr);
				unset($parsestr['page']);
				$url = $parseurl['path'].'?'.http_build_query($parsestr).'&';
			}
			return $url;
		}

		private function pfirst(){
			return ($this->cpage-1)*$this->num+1;
		}

		private function plast(){
			return min($this->cpage*$this->num, $this->total);
		}

		private function pheader(){
			$html = '';
			if($this->cpage<=1){
				$html=array('page'=>0,'title'=>$this->configs['header'],'class'=>'page_list');
			}else{
				$html=array('page'=>1,'title'=>$this->configs['header'],'class'=>'page_list');
			}
			return $html;
		}
		
		private function pprev(){
			$html = '';
			if($this->cpage<=1){
				$html=array('page'=>0,'title'=>$this->configs['prev'],'class'=>'page_list');
			}else{
				$html=array('page'=>$this->cpage-1,'title'=>$this->configs['prev'],'class'=>'page_list');
			}
			return $html;
		}
		
		private function plist(){
			$linkpage = '';
			$num = floor($this->fnum/2);
			for($i=$num; $i>=1; $i--){
				$page = $this->cpage-$i;
				if($page<1){
					continue;
				}
				$linkpage[]=array('page'=>$page,'title'=>$page,'class'=>'page_list');
			}

			$linkpage[]=array('page'=>$this->cpage,'title'=>$this->cpage,'class'=>'active page_list');

			for($j=1; $j<=$num; $j++){
				$page = $this->cpage+$j;
				if($page>$this->tpage){
					continue;
				}
				$linkpage[]=array('page'=>$page,'title'=>$page,'class'=>'page_list');
			}

			return $linkpage;

		}

		private function pnext(){
			$html = '';
			if($this->cpage>=$this->tpage){
				$html=array('page'=>0,'title'=>$this->configs['next'],'class'=>'page_list');
			}else{
				$html=array('page'=>$this->cpage+1,'title'=>$this->configs['next'],'class'=>'page_list');
			}
			return $html;
		}
		
		private function pfooter(){
			$html = '';
			if($this->cpage>=$this->tpage){
				$html=array('page'=>0,'title'=>$this->configs['footer'],'class'=>'page_list');
			}else{
				$html=array('page'=>$this->tpage,'title'=>$this->configs['footer'],'class'=>'page_list');
			}
			return $html;
		}
		
		function fpage($options = array(0,1,2,3,4,5,6,7,8)){
//			$html[] = '<p class="xnfy520_page_title"><span style="padding:0 5px">'.$this->cpage.'/'.$this->tpage.'页</span></p>';
//			$html[] = '<p class="xnfy520_page_title"><span style="padding:0 5px">共'.$this->total.'条记录</span></p>';
//			$html[] = '<p class="xnfy520_page_title"><span style="padding:0 5px">当前'.$this->pfirst().'-'.$this->plast().'条记录</span></p>';
//			$html[] = '<p class="xnfy520_page_title"><span style="padding:0 5px">本页'.($this->plast()-$this->pfirst()+1).'条记录</span></p>';
			$html['header'] = $this->pheader();
			$html['prev'] = $this->pprev();
			$html['list'] = $this->plist();
			$html['next'] = $this->pnext();
			$html['footer'] = $this->pfooter();
		//	dump($html);
//			$html[] = array(0,'首页');
//			$html[] = array(1,'1');
//			$html[] = array(2,'2');
//			$html[] = array(3,'3');
//			$html[] = array(0,'尾页');
//			$page = '';
//			foreach($options as $key){
//				$page.=$html[$key];
//			}
			return $html;
		}

	}