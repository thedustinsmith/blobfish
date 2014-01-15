$(function() {
  $("#content-holder section").animatedSections();
});

$.fn.animatedSections = function() {
  var $win = $(window),
      that = this,
      bgWrap = $(".as-bg-wrap");
  var items = [];
  var prevScroll = 0;
  var activeVideo;
  var activeSection;

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

  function winScroll () {
    var sTop = $win.scrollTop();
    var dir = sTop > prevScroll ? "down" : "up";
    var active = processScroll(sTop, dir);

    prevScroll = sTop;
    if (active.length) {
      bgWrap.find(".as-bg-item").removeClass("active");
      var bgItem = active.data("as-bg").addClass("active");

      activeSection = active;
      if (bgItem.is('video')) {
        processVideo(bgItem);
      }
      else {
        stopVideo();
      }
    }
  }

  function trackVideo () {
    var dur = activeVideo.duration,
        vidTop = activeSection.offset().top,
        vidHeight= activeSection.height();

    var top = $win.scrollTop(),
        bottom = top + $win.height(),
        mid = (top + bottom) / 2;

    var perc = (mid - vidTop) / vidHeight;
    activeVideo.currentTime = perc * dur;
  }

  function stopVideo () {
    $win.off('scroll', trackVideo);
    activeVideo = undefined;
  }

  function processVideo (vid) {
    activeVideo = vid[0];
    $win.on('scroll', trackVideo);
  }

  function processScroll (top, dir) {
      var winBottom = (top + $win.height())
          winMid = (top + winBottom) / 2;

      var active = that.filter(function() {
        var thisTop = $(this).offset().top;

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


