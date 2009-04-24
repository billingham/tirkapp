

TIRK.templates = function(){
  var files = {
    activityRow:"activity_row.js.tmpl.html",
    searchList:"stream_list.js.tmpl.html",
    settingsBlock:"settings_block.js.tmpl.html",
    authBlock:"auth_block.js.tmpl.html",
    addStreamBlock:"add_stream_block.js.tmpl.html",
    editStreamBlock:"edit_stream_block.js.tmpl.html",
    streamDetails:"stream_details.js.tmpl.html",
    streamStyleSheet:"stream_stylesheet.js.tmpl.css",
    errorDetailsBlock:"error_block.js.tmpl.html",
    mainBody:"main_body.js.tmpl.html" 
  };

  var expose = {},
    loaded = 0,
    onload = function(){};

  var loadIndividual = function(id){
    loaded = loaded + 1;
    $.get(
      "js/tmpl/"+files[id],
      {},
      function(data){
        expose[id] = tmpl(data);
        loaded = loaded - 1;
        if(loaded === 0){
          loadComplete();
        }
      },
      'text'
    )
  };

  var loadComplete = function(){
    delete expose.load;
    setTimeout(function(){
      TIRK.dom.$content.html(expose.mainBody({}));
      TIRK.dom.init.html();
      onload();
    },500);
  };

  var load = function(f){
    onload = f;
    for(k in files){
      loadIndividual(k);
    }
  };
  expose.load = load;


  return expose;
}();


