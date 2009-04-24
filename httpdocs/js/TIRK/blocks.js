TIRK.blocks=function(){
  var expose = {},
    ikey = '';

  var open = function(body){
    body += '<button id="close"><img src="http://tirkapp.com/img/icons/sanscons/close.gif" /></button>';
    $.blockUI({ 
      message: body,
      css: { 
        cursor: 'default',
        border: '1px solid #333',
        width: '250px',
        top: '20%',
        left: ((($(window).width()-250)/2).toString()+'px'),
        backgroundColor:'#ccc'
      },
      overlayCSS: {
        backgroundColor:'#fff',
        opacity:        '0.8'
      },
      fadeIn: 0,
      fadeOut: 0
    });
    $('#close').click(function(){$.unblockUI();});
  };
  
  var cancel = function(){
    console.log("TIRK.blocks.cancel()");
    $.unblockUI();
  };
  
  var init = function(ik){
    ikey = ik;
    $('#settings').click(function(){openSettings();});
    $('#auth').click(function(){openAuth();});
    $('#add').click(function(){openAdd();});
  };
  expose.init = init;
  
  //var initStreamsBlock = function(){
  //  $('#streams ul li span').click(function(){ openStream($(this).parent().attr('id')); });
  //};
  //expose.initStreamsBlock = initStreamsBlock;
  
  var initLoadingBlock = function(){
    
  };
  expose.initLoadingBlock = initLoadingBlock;
  
  var openSettings = function(){
    open(TIRK.templates.settingsBlock({hash:TIRK.settings.get()}));
    $('#cancel').click(function(){cancel();});
    $('#save').click(function(){saveSettings();});
  };
  expose.openSettings = openSettings;
  
  var saveSettings = function(){
    $('p.settingsline input.settings')
              .each(function(){
                    TIRK.settings.set($(this).attr('id'),$(this).val());
              });
    TIRK.settings.saveSettingsCookie();
    $.unblockUI();
  };
  expose.saveSettings = saveSettings;
  
  var openAuth = function(){
    open ( TIRK.templates.authBlock(TIRK.settings.getAuth(ikey)) );
    $('#cancel').click(function(){cancel();});
    $('#save').click(function(){saveAuth();});
  };
  expose.openAuth = openAuth;
  
  var saveAuth = function(){
    TIRK.settings.setAuth($('#username').val(),$('#password').val());
    TIRK.settings.saveAuthCookie();
    $.unblockUI();
  };
  expose.saveAuth = saveAuth;
  
  var openAdd = function(new_search_term){
    console.log("TIRK.blocks.openAdd()");
    var args = {
      value:new_search_term,
      colors:TIRK.constants.colors,
      randnum:Math.floor( TIRK.constants.colors.length * Math.random() )
    }
    open ( TIRK.templates.addStreamBlock(args) );
    $('#cancel').click(function(){cancel();});
    $('#save').click(function(){saveAdd();});
  };
  expose.openAdd = openAdd;
  
  var saveAdd = function(){
    console.log("TIRK.blocks.saveAdd()");
    var color_number = $('input:radio[name=new_color]:checked').val();
    var style = TIRK.constants.colors[((TIRK.constants[color_number] === 'undefined') ? 0 : color_number)];
    TIRK.streams.addSearch($('#new_search_term').val(),style);
    TIRK.display.generateStreamList();
    $.unblockUI();
  };
  expose.saveAdd = saveAdd;
  
  var openStream = function(id){
    console.log("TIRK.blocks.openStream()");

    var stream = TIRK.streams.getByKey(id)

    var selected_style = 0;
    for(i in TIRK.constants.colors){
      if(TIRK.constants.colors[i].bgcolor === stream.style.bgcolor && TIRK.constants.colors[i].color === stream.style.color){
        selected_style = i;
      }
    }

    var args = {
      colors:TIRK.constants.colors,
      details:stream,
      selected:selected_style
    };
    open ( TIRK.templates.editStreamBlock( args ) );
    $('#cancel').click(function(){cancel();});
    $('#save').click(function(){saveStream();});
    $('#delete').click(function(){deleteStream();});
    $('#history').click(function(){clearStream();});
    //$('#activity').addClass(id);
  };
  expose.openStream = openStream;
  
  var saveStream = function(){
    var k = $('#stream_key').val();
    $.unblockUI();
    //$('#activity').removeClass(k);
  };
  //public.saveStream = saveStream;
  var deleteStream = function(){
    var k = $('#stream_key').val();
    TIRK.streams.deleteStream(k);
    TIRK.display.generateStreamList();
    TIRK.display.removeFilters();
    $.unblockUI();
    //$('#activity').removeClass(k);
  };
  var clearStream = function(){
    var k = $('#stream_key').val();
    TIRK.display.clearOutHistoryRows(k);
    $.unblockUI();
    //$('#activity').removeClass(k);
  };
  
  var error = function(err){
    console.log("TIRK.blocks.error()",err);
    var args = {
      e:err
    };
    open ( TIRK.templates.errorDetailsBlock ( args ) );
    //$('#cancel').click(function(){cancel();});
    $('#reload').click(function(){window.location.reload(false);});
  };
  expose.error = error;
  
  return expose;
}();