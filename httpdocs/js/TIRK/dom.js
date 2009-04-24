
TIRK.dom = function(){
  var expose = {},
    init = {};

  init.html =  function(){
    load('#activity','activity');
    load('#main','main');
    load('#streams','streams');
    load('#0','padding');

    load('#charcter_counter','counter');
    load('#hash_tags_selected','hashes');

    load('#overall_count','totalrows');
    load('#new_count','newrows');

    load('#action form','form');
    load('#reply_to_message_id','replyto');
    load('#message','message');

    load('#remove','removefilterbutton');
    load('#clear_filter','closefilterbutton');
  };
  init.block = function(){
    
  }
  expose.init = init;

  var load = function(query,key){
    var k = '$' + key;
    delete expose[k];
    expose[k] = jQuery(query);
  };

  load('body','body');
  load('head','head');
  load('body > div','content');

  return expose;

}();


