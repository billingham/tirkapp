TIRK.streams=function(){
  var expose = {};
  var list = {};
  //expose.list = list;
  var callbacks = {};
  expose.callbacks = callbacks;
  var active = true;
  var timeout = false;
  var ikey = false;
  var firstLoad = true;
    
  var cleanKeyString=function(str){
    str.replace(/^#/,"hash_").replace(/^@/,"at_")
  };
  
  var insertToTable = function($lowest,data){
    if( parseInt(data.id) > parseInt($lowest.attr('id'))){
      $(TIRK.templates.activityRow(data))
        .data('keys',[data.key])
        .find("span.search").click(function(){TIRK.blocks.openAdd($(this).text());}).end()
        .find("span.user").click(function(){TIRK.blocks.openAdd("("+($(this).text())+")");}).end()
        .insertAfter($lowest);
      TIRK.display.stickyBottomScroll();
    }else{
      insertToTable($lowest.prev(),data);
    }
  };
  
  
  var addStream = function(origin,type,data,key){
    data.origin=origin;
    data.key=key;
    data.ikey=ikey;
    data.type=type;
    if(origin=='twitter' && type == 'search'){
      list[key] = TIRK.factory.twitterSearchStream(data);
      addCallback(key);
    }else if(origin=='twitter' && type == 'friends'){
      list[key] = TIRK.factory.twitterFriendStream(data);
      addCallback(key);
    }else if(origin=='twitter' && type == 'replies'){
      list[key] = TIRK.factory.twitterRepliesStream(data);
      addCallback(key);
    }else if(origin=='twitter' && type == 'user'){
      list[key] = TIRK.factory.twitterUserStream(data);
      addCallback(key);
    }
    TIRK.display.addCSS( TIRK.templates.streamStyleSheet(data) );
    //console.log(TIRK.templates.streamStyleSheet(data));
    //$('head').append('<style>#activity p span.'+key+'{background-color:'+data.style.bgcolor+';}#main div.'+key+' p{display:none;}#main div.'+key+' p.'+key+'{display:block;}</style>');
    
  };
  
  var addCallback = function(key){
    callbacks[key]=function(data){
      list[key].callback(data);
      TIRK.display.updateMessageCount();
    };
  };
  
  var deleteStream = function(key){
    if(list[key].custom){
      delete list[key];
      deleteCustomStreamFromCookie(key);
      TIRK.display.clearOutHistoryRows(key);
    }
  };
  expose.deleteStream = deleteStream;
  
  var updateStream = function(key,opts){
    if(list[key].custom){
      for( i in opts ){
        list[key][i]=opts[i];
      }
    }
  };
  
  var extractCustomStreamsFromCookie = function(){
    var c = $.evalJSON($.cookie('streams'))||{};
    console.log("streams cookie:",c);
    for(key in c){
      addStream("twitter","search",{name:c[key]['q'],style:c[key]['s'],query:c[key]['q']},key);
    }
  };
  
  var addCustomStreamToCookie = function(key,query,style){
    var c = $.evalJSON($.cookie('streams'))||{};
    c[key]={q:query,s:style};
    $.cookie('streams',$.toJSON(c));
  };
  
  var deleteCustomStreamFromCookie = function(key){
    var c = $.evalJSON($.cookie('streams'))||{};
    delete c[key];
    $.cookie('streams',$.toJSON(c));
  };
  
  
  
  var init = function(ik){
    ikey = ik;
    $('#pause').click(function(){togglePause();});
    $('#clear').click(function(){TIRK.display.clearOutAllHistoryRows();});
    /*$(document).shortkeys({
      'p':       function () { togglePause(); },
    });*/
    if(TIRK.settings.isLoggedIn()){
      addStream("twitter","friends",{name:"friends",type:"timeline",style:TIRK.constants.colors[TIRK.constants.default_styles.friends]},"timeline_friends");
      addStream("twitter","replies",{name:"@"+TIRK.settings.getUsername(),type:"timeline",style:TIRK.constants.colors[TIRK.constants.default_styles.replies]},"timeline_replies");
      addStream("twitter","user",{name:"("+TIRK.settings.getUsername()+")",type:"timeline",style:TIRK.constants.colors[TIRK.constants.default_styles.user]},"timeline_thisuser");
    }
    
    extractCustomStreamsFromCookie();
  };
  expose.init = init;
  
  var addSearch = function(query,style){
    var key = 'key'+hex_md5(query);
    addStream("twitter","search",{name:query,style:style,query:query},key);
    
    addCustomStreamToCookie(key,query,style);
    
    list[key].request();
  };
  expose.addSearch = addSearch;
  
  var scheduleUpdate = function(){
    timeout=setTimeout(update,TIRK.settings.pollingTime());
  };
  
  var update = function(){
    //console.log("TIRK.streams.update()");
    TIRK.display.toggleNewMessages();
    for ( i in list ) {
      try{
        list[i].request();
        TIRK.display.clearOutOldRows(i);
      }catch(e){
        TIRK.blocks.error( e );
      }
    }
    scheduleUpdate();
    
  };
  expose.update = update;
  
  var addMessage = function(data){
    var $msgs = jQuery('#'+data.id);
    if( $msgs.size() == 0){
      insertToTable(jQuery('#activity p:last'),data);
    }else if ( $msgs.find('span.'+data.key).size() == 0){
      addKeyToMessage($msgs,data);
    }
  };
  expose.addMessage = addMessage;

  var addKeyToMessage = function($msgs,data){
    $msgs.addClass(data.key)
      .find('span.stream').after('<span class="stream '+data.key+'"></span>');
  };
  
  var get = function(){
    return list;
  };
  expose.get = get;
  
  var getByKey = function(key){
    return list[key];
  };
  expose.getByKey = getByKey;
  
  var togglePause = function(){
    if(!!timeout){
      clearTimeout(timeout);
      timeout=false;
      $('#pause').addClass('paused').find('span').html('Un<u>p</u>ause');
    }else{
      update();
      $('#pause').removeClass('paused').find('span').html('<u>P</u>ause');
    }
  };
  
  return expose;
}();




