TIRK.settings=function(){
  var expose = {},
        username="",
        password="",
        ikey=false;
        authenticated=false;

  var settings = {
    scrollBackLines:{value:200,type:"int",label:"Scroll back"},
    pollingTime:{value:5,type:"int",label:"Polling time"},
    rowsBack:{value:50,type:"int",label:"Inital # of historial rows collected"},
    quickAdd:{value:false,type:"bool",label:"Quickly add streams"}
  };

  var init = function(ik){
    ikey=ik;
    var auth_cookie = $.evalJSON($.cookie('auth'))||{};
    if(auth_cookie['username'] && auth_cookie['password']){
      setAuth(auth_cookie['username'],auth_cookie['password']);
    }

    var settings_cookie = $.evalJSON($.cookie('settings'))||{};

    for(k in settings_cookie){
      set(k,settings_cookie[k]);
    }
  };
  expose.init = init;
  
  var isLoggedIn = function(){
    return authenticated;
  }
  expose.isLoggedIn = isLoggedIn;

  var getAuth = function(ik){
    if(ik===ikey){
      return {username:username,password:password};
    }else{
      throw ( {message:"Unvalidated access to the authentication data."});
    }
  };
  expose.getAuth = getAuth;

  var getUsername = function(){
    return username;
  };
  expose.getUsername = getUsername;

  var setAuth = function(u,p){
    username = u;
    password = p;
    authenticated = true;
  };
  expose.setAuth = setAuth;

  var get = function(){
    return settings;
  };
  expose.get = get;

  var getByName = function(name){
    return settings[name].value;
  };
  expose.getByName = getByName;

  var set = function(key,val){
    if( typeof ( settings[key] ) == "object" ) {
      if( settings[key].type == "int"){
        settings[key].value = parseInt(val,10);
      }else if( settings[key].type == "bool"){
        settings[key].value = val?true:false;
      }
    }
  };
  expose.set = set;

  var saveSettingsCookie = function(){
    var cs={};
    for(k in settings){
      cs[k]=settings[k].value;
    }
    $.cookie('settings',$.toJSON(cs));
  };
  expose.saveSettingsCookie = saveSettingsCookie;

  var saveAuthCookie = function(){
    $.cookie('auth',$.toJSON(getAuth(ikey)));
  };
  expose.saveAuthCookie = saveAuthCookie;

  var pollingTime = function(){
    var pt = getByName('pollingTime');
    if(typeof pt != 'number' || pt < 1){
      pt=1;
    }
    return 1000*60*pt;
  };
  expose.pollingTime = pollingTime;

  return expose;
}();

