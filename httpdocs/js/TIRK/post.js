TIRK.post=function(){
  var expose = {},
    max_chars = 140,
    ikey = "";
  
  var init = function(ik){
    ikey = ik;

    remaining();
    TIRK.dom.$message
      .change(function(){ remaining(); })
      .keyup(function(){ remaining(); })
      .focus(function(){jQuery(this).addClass('focus');})
      .blur(function(){jQuery(this).removeClass('focus');});
    /*$(document).shortkeys({
      'i':       function () { $('#message').focus(); },
    });*/
    
    TIRK.dom.$form.submit(function(){setTimeout(function(){update();},10);return false;});
  };
  expose.init = init;
  
  var remaining = function(){
    //console.log("TIRK.post.remaining()");
    var l = TIRK.dom.$message.val().length;
    if( l < max_chars ){
      TIRK.dom.$counter.html( (max_chars - l) );
    }else{
      TIRK.dom.$counter.html("");
    }
  };
  
  var update = function(){
    console.log("TIRK.post.update()");
    var a = TIRK.settings.getAuth(ikey);
    var status = TIRK.dom.$message.val();
    if(status.length > 0){
      var data = {
        host:"twitter.com",
        path:"statuses/update.json",
        type:"POST",
        "args[status]":status,
        "args[callback]":'TIRK.post.callback'
      };
    
      jQuery.ajax({
        url:"proxy.php",
        type:"POST",
        dataType:"json",
        data:data
      });
    }
    TIRK.dom.$message.addClass('loading').val('');
  };
  
  var callback = function(data){
    TIRK.dom.$message.removeClass('loading');
    console.log(data);
  };
  expose.callback = callback;
  
  return expose;
}();