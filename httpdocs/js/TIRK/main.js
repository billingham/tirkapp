//(function(){if(true){

if(!console){var console={log:function(){}};}
try{console.log("Start TIRKAPP!");}catch(e){var console={log:function(){}};}


TIRK = { 
  version: 0.3,
  loaded:  false,
  require: function() {
    var scripts = {};
    //$(document).ready( function() { requireAvailible=false } );

    var requireAvailable = function(){
      return TIRK.loaded;
    };
    
    return function(url){
      /*if(!requireAvailable()){
        //TIRK.blocks.error( 'Can no longer include JS files ('+url+')' );
      }else */if(!scripts[url]){
        document.write('<scr'+'ipt src="'+ url +'" type="text/javascript" charset="utf-8"><\/scr'+'ipt>');
        scripts[url]=(new Date());
      }
    };
  }(),
  since: function(){
    var today = new Date();
    return new Date(today.getYear(), today.getMonth(), today.getDate()-7);
  }(),
  f: function(funct){
    try{
      funct();
    }catch(e){
      TIRK.blocks.error( e );
    }
  }
};

/* External Libraries */
TIRK.require("js/lib/jquery-1.3.2.min.js");
TIRK.require("js/lib/jquery.blockUI.js");
TIRK.require("js/lib/jquery.cookie.js");
TIRK.require("js/lib/jquery.json-1.3.js");
TIRK.require("js/lib/jquery.shortkeys.js");
TIRK.require("js/lib/md5.js");
TIRK.require("js/lib/micro-templates.js");

/* Google Gears Library */
TIRK.require("http://code.google.com/apis/gears/gears_init.js");

/* TIRK Libraries */
TIRK.require("js/TIRK/constants.js");
TIRK.require("js/TIRK/dom.js");
TIRK.require("js/TIRK/settings.js");
TIRK.require("js/TIRK/templates.js");
TIRK.require("js/TIRK/objects.js");
TIRK.require("js/TIRK/streams.js");
TIRK.require("js/TIRK/blocks.js");
TIRK.require("js/TIRK/display.js");
TIRK.require("js/TIRK/post.js");

/* TIRK Load */
TIRK.require("js/TIRK/load.js");

//}}());