TIRK.objects={};

TIRK.objects.Stream = function(opt){
  this.name = opt.name || "empty";
  this.key = opt.key || hex_md5(time());
  this.delay = opt.delay || TIRK.settings.getByName('pollingTime');
  this.lastid = opt.lastid || 0;
  this.style = opt.style || {bgcolor:'#fff',color:'#000'};
  this.ishash = false;
  this.isticker = false;
  this.request = function(data){
    console.log("TIRK.objects.Stream.request()");
    throw new Error("TIRK.objects.Stream.request() << this should be overwritten");
  };
  this.callback = function(data){
    console.log("TIRK.objects.Stream.callback()");
    throw new Error("TIRK.objects.Stream.callback() << this should be overwritten")
  };
  this.checkLastId = function(new_id){
    if(this.lastid < new_id){
      this.lastid = new_id;
    }
  };
  this.startLoad = function(){
    $('ul li#'+this.key).addClass('loader');
  };
  this.stopLoad = function(count){
    $('ul li#'+this.key).removeClass('loader');
    if(count > 0){
      $('ul li#'+this.key+' span.count').show().text(count);
    }else{
      $('ul li#'+this.key+' span.count').hide().text('');
    }
    TIRK.display.updateMessageCount();
  };
  this.origin='none';
  this.type='none';
  this.custom=false;
};

TIRK.factory={};

TIRK.factory.twitterSearchStream = function(opt){
  var stream = new TIRK.objects.Stream(opt);
  stream.origin='twitter';
  stream.type = 'search';
  stream.query = opt.query || '#test';
  stream.ishash = stream.query.match(/^#/);
  stream.isticker = stream.query.match(/^\$/);
  
  stream.custom = true;

  if(stream.isticker){
    stream.name = stream.name.toUpperCase();
  }
  
  stream.request = function(){
    console.log("TIRK.factory.TwitterSearchStream.request()");
    stream.startLoad();
    $.ajax({
      url:"http://search.twitter.com/search.json",
      type:"GET",
      dataType:"script",
      data:{
        q:stream.query,
        rpp:TIRK.settings.getByName('rowsBack'),
        lang:"en",
        since_id:stream.lastid,
        callback:'TIRK.streams.callbacks.'+opt.key
      }
    });
  };
  stream.callback = function(data){
    var r=data.results;
    console.log("TIRK.factory.TwitterSearchStream.callback()",r.length);
    for ( var i = r.length-1 ; i >= 0 ; i-- ) {
      TIRK.streams.addMessage(
        {
          id:r[i].id,
          handle:r[i].from_user,
          avatar:r[i].profile_image_url,
          content:r[i].text,
          time:r[i].created_at,
          hashes:[],
          key:opt.key
        }
      );
      stream.checkLastId(r[i].id);
    }
    stream.stopLoad(r.length);
  };
  return stream;
};

TIRK.factory.twitterFriendStream = function(opt){
  var stream = new TIRK.objects.Stream(opt);
  stream.origin='twitter';
  stream.type = 'friend';
  
  stream.request = function(){
    console.log("TIRK.factory.twitterFriendStream.request()");
    stream.startLoad();
    
    var a = TIRK.settings.getAuth(opt.ikey);
    
    var data = {
      host:"twitter.com",
      path:"statuses/friends_timeline.json",
      type:"GET",
      "args[since]":TIRK.since.toUTCString(),
      "args[count]":TIRK.settings.getByName('rowsBack'),
      "args[callback]":'TIRK.streams.callbacks.'+opt.key
    };
    if(stream.lastid>0){data["args[since_id]"]=stream.lastid;}
    
    $.ajax({
      url:"proxy.php",
      type:"GET",
      dataType:"script",
      data:data
    });
  };
  stream.callback = function(data){
    console.log("TIRK.factory.twitterFriendStream.callback()",data.length);
    for ( var i = data.length-1; i >= 0 ; i-- ) {
      TIRK.streams.addMessage(
        {
          id:data[i].id,
          handle:data[i].user.screen_name,
          avatar:data[i].user.profile_image_url,
          content: data[i].text,
          time: data[i].created_at,
          hashes:[],
          key:opt.key
        }
      );
      stream.checkLastId(data[i].id);
    }
    stream.stopLoad(data.length);
  };
  return stream;
};

TIRK.factory.twitterRepliesStream = function(opt){
  var stream = new TIRK.objects.Stream(opt);
  stream.origin='twitter';
  stream.type = 'reply';
  
  stream.request = function(){
    console.log("TIRK.factory.twitterRepliesStream.request()");
    stream.startLoad();
    
    var a = TIRK.settings.getAuth(opt.ikey);
    
    var data = {
      host:"twitter.com",
      path:"statuses/replies.json",
      type:"GET",
      "args[since]":TIRK.since.toUTCString(),
      "args[count]":TIRK.settings.getByName('rowsBack'),
      "args[callback]":'TIRK.streams.callbacks.'+opt.key
    };
    if(stream.lastid>0){data["args[since_id]"]=stream.lastid;}
    
    $.ajax({
      url:"proxy.php",
      type:"GET",
      dataType:"script",
      data:data
    });
  };
  stream.callback = function(data){
    console.log("TIRK.factory.twitterRepliesStream.callback()",data.length);
    for ( var i = data.length-1; i >= 0 ; i-- ) {
      TIRK.streams.addMessage(
        {
          id:data[i].id,
          handle:data[i].user.screen_name,
          avatar:data[i].user.profile_image_url,
          content: data[i].text,
          time: data[i].created_at,
          hashes:[],
          key:opt.key
        }
      );
      stream.checkLastId(data[i].id);
    }
    stream.stopLoad(data.length);
  };
  return stream;
};

TIRK.factory.twitterUserStream = function(opt){
  var stream = new TIRK.objects.Stream(opt);
  stream.origin='twitter';
  stream.type = 'user';
  
  stream.request = function(){
    console.log("TIRK.factory.twitterUserStream.request()");
    stream.startLoad();
    
    var a = TIRK.settings.getAuth(opt.ikey);
    
    var data = {
      host:"twitter.com",
      path:"statuses/user_timeline.json",
      type:"GET",
      "args[since]":TIRK.since.toUTCString(),
      "args[count]":TIRK.settings.getByName('rowsBack'),
      "args[callback]":'TIRK.streams.callbacks.'+opt.key
    };
    if(stream.lastid>0){data["args[since_id]"]=stream.lastid;}
    else{
      //data["args[since]"]=(new Date()).getTime() - 1000*60*60*24*7; // one week go
    }
    
    $.ajax({
      url:"proxy.php",
      type:"GET",
      dataType:"script",
      data:data
    });
  };
  stream.callback = function(data){
    console.log("TIRK.factory.twitterUserStream.callback()",data.length);
    for ( var i = data.length-1; i >= 0 ; i-- ) {
      TIRK.streams.addMessage(
        {
          id:data[i].id,
          handle:data[i].user.screen_name,
          avatar:data[i].user.profile_image_url,
          content: data[i].text,
          time: data[i].created_at,
          hashes:[],
          key:opt.key
        }
      );
      stream.checkLastId(data[i].id);
    }
    stream.stopLoad(data.length);
  };
  return stream;
};
