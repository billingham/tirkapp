

TIRK.load = function(){



  var loadTemplates = function(){
    TIRK.templates.load(loadOperations);
  };

  var loadImages = function(){
    var icons = ['add','user','tools','trash','pause','close','comment','undo','star','loop'];
    var loaded_icons = [];
    for(i in icons){
      loaded_icons[i] = new Image();
      loaded_icons[i].src = TIRK.constants.urls.icons+icons[i]+".gif";
    }
  };

  var loadOperations = function(){
    TIRK.f(function(){
      var ikey = hex_md5(Math.floor(Math.random()*10000)+(new Date()).toString());

      TIRK.settings.init(ikey);
      TIRK.streams.init(ikey);
      TIRK.display.init(ikey);
      TIRK.blocks.init(ikey);
      TIRK.post.init(ikey);
      TIRK.streams.update();

      ikey=null;
    });
  };

  var disableRequire = function(){
    TIRK.require = function(){
      throw({name:"Script Require Error",message:"Page has loaded, scripts can no longer be included in the page."});
    };
  };

  return function() {
    TIRK.f(function(){
      disableRequire();
      loadTemplates();
      loadImages();
    });
  };

  

}();

$(document).ready( function() { TIRK.load(); } );