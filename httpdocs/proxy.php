<?php

if(!isset($_REQUEST['host'])){
  die(json_encode(array("error"=>1,"message"=>"no host param")));
}
if(!isset($_REQUEST['path'])){
  die(json_encode(array("error"=>2,"message"=>"no path param")));
}
if(!isset($_REQUEST['type'])){
  die(json_encode(array("error"=>3,"message"=>"no type param")));
}

class Auth{
  const COOKIE_NAME = 'auth';
  const USERNAME_KEY = 'username';
  const PASSWORD_KEY = 'password';
  
  private $is_logged_in = false;
  private $username = null;
  private $password = null;
  
  function __construct(){

    if(isset($_COOKIE[self::COOKIE_NAME])){
      $auth=json_decode(stripslashes($_COOKIE[self::COOKIE_NAME]),true);
    }
    if(is_array($auth) 
          && isset($auth[self::USERNAME_KEY])
          && isset($auth[self::PASSWORD_KEY])){
      $this->is_logged_in=true;
      $this->username=$auth[self::USERNAME_KEY];
      $this->password=$auth[self::PASSWORD_KEY];
    }
  }
  
  function isLoggedIn(){
    return $is_logged_in;
  }
  
  function getAuthStr(){
    return sprintf('%s:%s',$this->username,$this->password);
  }
  
  function addCurlAuth($ch){
    if($this->is_logged_in){
      curl_setopt($ch, CURLOPT_USERPWD, $this->getAuthStr());
    }
  }
  
  function setCookie($u,$p){
    if(strlen($u) && strlen($p)){
      $value=json_encode(array(self::USERNAME_KEY=>$u,self::PASSWORD_KEY=>$p));
    }else{
      $value='';
    }
    setcookie(self::COOKIE_NAME,$value);
    $_COOKIE[self::COOKIE_NAME]=$value;
  }
}
  
  
class Proxy{
  const USER_AGENT = 'TirkApp';
  const TIMEOUT=30;
  
  protected $ch=null;
  private $url='';
  private $response=array();
  
  function __construct($host,$path){
    $ch = curl_init();
    $this->url=$host.'/'.$path;
    curl_setopt($ch, CURLOPT_URL,$this->url); 
    curl_setopt($ch, CURLOPT_VERBOSE, 1);
    curl_setopt($ch, CURLOPT_NOBODY, 0);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    $auth = new Auth();
    $auth->addCurlAuth($ch);
    curl_setopt($ch, CURLOPT_USERAGENT, (strlen($_SERVER['HTTP_USER_AGENT'])>0) ? $_SERVER['HTTP_USER_AGENT'] : self::USER_AGENT); 
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, self::TIMEOUT);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    $this->ch=$ch;
  }
  
  
  function args($args,$type='get'){
    $body=array();
    if(is_array($args)){
      foreach($args AS $k=>$v){
        $body[]=sprintf('%s=%s',urlencode($k),urlencode($v));
      }
    }
    
    switch(strtoupper($type)){
      case 'POST':
        curl_setopt($this->ch, CURLOPT_POST, 1);
        curl_setopt($this->ch, CURLOPT_POSTFIELDS, implode($body,'&'));
        break;
      case 'GET':
      default:
        curl_setopt($this->ch, CURLOPT_HTTPGET, 1);
        curl_setopt($this->ch, CURLOPT_URL,$this->url.'?'.implode($body,'&')); 
        break;
    }
  }
  
  function process(){
    $this->response['data'] = curl_exec($this->ch);
    $this->response['info']=curl_getinfo($this->ch);   
    if (curl_errno($this->ch)) {
      $this->response['error']=curl_error($this->ch);
    }
    curl_close($this->ch);
  }
  
  function results(){
    return $this->response['data'] ;
  }
}

class VerifyCredentialsProxy extends Proxy{
  function __construct($host,$path){
    parent::__construct($host,$path);
  }
  function process(){
    parent::process();
  }
}

if($_REQUEST['host']=='twitter.com' && $_REQUEST['path']=='account/verify_credentials.json'){
  $request = new VerifyCredentialsProxy($_REQUEST['host'],$_REQUEST['path']);
}else{
  $request = new Proxy($_REQUEST['host'],$_REQUEST['path']);
}
  
$request->args($_REQUEST['args'],$_REQUEST['type']);
$request->process();
echo $request->results();
  

?>