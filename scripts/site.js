$(function() {
  $("#content-holder section").animatedSections();
});

$.fn.animatedSections = function() {
  var $win = $(window),
      that = this,
      bgWrap = $(".as-bg-wrap");

  if (!bgWrap.length) {
    bgWrap = $("<div class='as-bg-wrap' />").prependTo($("body"));
  }

  function isImage(url) {
    var ix = url.indexOf('.jpg') || url.indexOf('.png') || url.indexOf('.gif');
    return ix > -1;
  }
  function isVideo(url) {
    var ix = url.indexOf('.mp4');
    return ix > -1;
  }

  var items = [];
  var prevScroll = 0;
  function winScroll () {
    var sTop = $win.scrollTop();

    var active = processScroll(sTop, sTop > prevScroll ? "down" : "up");
    prevScroll = sTop;

    if (active.length) {
      console.log(active);
      bgWrap.find(".as-bg-item").removeClass("active");
      active.data("as-bg").addClass("active");
    }
  }

  function processScroll (top, dir) {
      var winBottom = (top + $win.height())
          winMid = (top + winBottom) / 2;

      //console.log(winBottom, winMid, this);
      var active = that.filter(function() {
        var thisTop = $(this).offset().top;

        //console.log(dir, thisTop, this);
        if (dir === "down") {
          return thisTop < winMid && thisTop > top;
        }
        else {
          var thisBottom = thisTop + $(this).height();
          return thisBottom > winMid && thisBottom < winBottom; 
        }
      });

      return active;
  }

  function winResize () {
    bgWrap.height($win.height());
    that.css("min-height", $win.height());
  }

  $win.on('scroll', $.throttle(250, winScroll));
  $win.on('resize', $.throttle(500, winResize));

  winResize();

  var first = true;
  return that.each(function() {
    var item = $(this),
        url = item.data("bg-url") || '',
        scroll = item.data("scroll"),
        med;

    if (isImage(url)) {
      med = $("<img src='" + url + "' class='as-bg-item' />").appendTo(bgWrap);
    }
    else if (isVideo(url)) {
      med = $("<video autobuffer class='as-bg-item'><source src='" + url + "' type='video/mp4'></video>").appendTo(bgWrap);
    }

    if (first) {
      med.addClass("active");
      first = false;
    }

    item.data("as-bg", med);
    items.push({
      medium: med,
      item: item
    });
  });
};


