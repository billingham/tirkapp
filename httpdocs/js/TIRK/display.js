

TIRK.display=function(){
  var expose = {};
  
  var generateStreamList = function(){
    //console.log("TIRK.display.generateStreamList()");
    TIRK.dom.$streams
        .html( TIRK.templates.searchList( {streams:TIRK.streams.get()} ) )
        .find('ul li span').click(function(){ addFilter($(this).parent().attr('id')); })
        .find('ul li span input[type=checkbox]').click(function(){ addFilter($(this).parent().attr('id')); });
  };
  expose.generateStreamList = generateStreamList;
  
  var init = function(){
    //console.log("TIRK.display.init()");
    

    generateStreamList();
    //$('img.avatar').load(function(){($this).css('border','1px solid red');});
    resize();
    $(window).resize( function(){ resize(); } );
    
    //$('td').click(function(){ console.log("test");TIRK.display.highlightRow(this); });
    //$('td').hover(function(){ console.log("hover");$(this).addClass("details");},function(){ $("this").removeClass("details");});
    TIRK.dom.$closefilterbutton.click(function(){removeFilters();});
    TIRK.dom.$removefilterbutton.click(function(){removeFilters();});
    activityOnClick();
    removeExtraRows();
  };
  expose.init = init;

  var resize = function(){
    TIRK.dom.$main.height($(window).height()-60);
    TIRK.dom.$main.width($(window).width()-150);
  };

  var streamListOnClick = function(){
    $('#streams').click(
      function(e){

      }

    );
  };

  var activityOnClick = function(){
    TIRK.dom.$activity.click(
        function(e){
          $('#activity p.selected').removeClass('selected');
          
          if(e.originalEvent.originalTarget.nodeName.toString().toLowerCase()==="p"){
            $(e.originalEvent.originalTarget).addClass('selected');
          }else{
            $(e.originalEvent.originalTarget).parents("p.entry").addClass('selected');
          }
          var $str = $(e.originalEvent.originalTarget).filter('span.stream');
          if($str.length > 0){
            var keys = $str.parents("p.entry").data("keys");
            for(i in keys){
              addFilter(keys[i]);
            }
            //console.log("add body class");
          }
          //console.log(e.originalEvent.originalTarget.nodeName);
          //console.log(arguments);
        }
     );

  };

  var addCSS = function(css){
    TIRK.dom.$head.append('<style>'+css+'</style>');
  };
  expose.addCSS = addCSS;

  var addFilter = function(key){
    TIRK.dom.$body.attr('class','').addClass(key).addClass('filtered');
    $('#edit_stream span.link').click(function(){TIRK.blocks.openStream(key);});
    updateMessageCount();
    stickyBottomScroll();
  };
  expose.addFilter = addFilter;

  var removeFilters = function(){
    TIRK.dom.$body.attr('class','');
    updateMessageCount();
    stickyBottomScroll();
  };
  expose.removeFilters = removeFilters;
  
  /*resize:function(){
    console.log("TIRK.display.resize()");
    resizeTofitWindow();
  },*/
  var toggleNewMessages = function(){
    TIRK.dom.$activity.find('.new').removeClass('new');
  };
  expose.toggleNewMessages = toggleNewMessages;
  
  var updateMessageCount = function(){
    var overall_count = $('#activity p:visible').not('.del').size() - 1;
    $('#overall_count').html(overall_count + ' messages');
    var new_count = $('#activity .new:visible').not('.del').size();
    
    $('#new_count').html(new_count === 0?'':(new_count + ' new messages'));
  };
  expose.updateMessageCount = updateMessageCount;
  
  var stickyBottomScroll = function(){
    var top_padding_height = TIRK.dom.$padding.height();
    var window_height = TIRK.dom.$main.height();
    var table_height = TIRK.dom.$activity.outerHeight() - top_padding_height;
    var scroll_top = TIRK.dom.$main.scrollTop();
    if( window_height > table_height ){
      TIRK.dom.$padding.height(window_height - table_height - 20);
    } else {
      TIRK.dom.$padding.height(0);
    }

    if ( scroll_top + window_height + 40 > table_height ) {
      var new_scroll_top = table_height - window_height;
      TIRK.dom.$main.scrollTop( new_scroll_top);
      //console.log("scroll_top:current=",scroll_top,";new=",new_scroll_top);
    }
  };
  expose.stickyBottomScroll = stickyBottomScroll;
  
  var highlightRow = function(oThis){
    //console.log("TIRK.display.highlightRow()",oThis);
    clearSelectedRows();
    $(oThis).addClass('select');
  };
  expose.highlightRow = highlightRow;
  
  var formatMessageBody = function(str){
    return str
        .replace(/(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]?)/ig," <a href='$1' title='$1' target='_blank'>$3</a> ")
        .replace(/@([_a-zA-Z0-9]+)/g," @<span class='user link'>$1</span> ")
        .replace(/\$([a-zA-Z]{2,4})/g," <span class='search link'>$$$1</span> ")
        .replace(/ #([a-zA-Z0-9]+)/g," <span class='search link'>#$1</span> ")
        .replace(/^#([a-zA-Z0-9]+)/g," <span class='search link'>#$1</span> ");
  };
  expose.formatMessageBody = formatMessageBody;

  var clearOutHistoryRows = function(key){
    TIRK.dom.$activity.find('p.'+key).not('.internal').not('.del').addClass('del');
    updateMessageCount();
  };
  expose.clearOutHistoryRows = clearOutHistoryRows;

  var clearOutAllHistoryRows = function(){
    TIRK.dom.$activity.find('p').not('.internal').not('.del').addClass('del');
    updateMessageCount();
  };
  expose.clearOutAllHistoryRows = clearOutAllHistoryRows;

  var clearOutOldRows = function(key){
    var $rows = TIRK.dom.$activity.find('p.'+key).not('.internal').not('.del');
    var s = TIRK.settings.getByName('scrollBackLines');
    if( $rows.size() > s ) {
      $rows.filter(':first').addClass('del');
      clearOutOldRows(key);
    }
  };
  expose.clearOutOldRows = clearOutOldRows;

  var removeExtraRows = function(){
    //console.log("TIRK.display.removeExtraRows()",dom.$activity.find('p.del').length);
    TIRK.dom.$activity.find('p.del').remove();
    setTimeout(removeExtraRows,TIRK.constants.removeExtraRowsDuration);
  };
  
  
  return expose;
}();

