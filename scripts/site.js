
$(function() {
  var bgImgWrap = $("#bg-img-wrap"),
      sections = $("section"),
      bgImages = bgImgWrap.find("img"),
      win = $(window),
      sectionInnerMap;

  function calcSections() {
    sectionInnerMap = sections.find(".section-inner").map(function() {
        var item = $(this),
            o = item.offset(),
            top = o.top,
            bottom = top + item.height();

        return {
            item: item,
            top: top,
            bottom: bottom
        };
    }).toArray();
  }
  
  function resizeBackground() {
    bgImgWrap.width(win.width());
    bgImgWrap.height(win.height());
    sections.css("height", win.height());

    calcSections();
  }
  
  function getVisibleSection(top, bottom) {
    var section = sectionInnerMap.filter(function(i) {
        return i.bottom <= bottom && i.top >= top;
    })[0];

    return !!section ? section.item : null;
  }
  
  function winScroll() {
    var visibleInner = getVisibleSection(win.scrollTop(), win.scrollTop() + win.height());
    if (visibleInner) {
        var ix = visibleInner.closest("section").data("ix");
        var active = bgImages.removeClass("active").filter("[data-ix='" + ix + "']").addClass("active");
    }
  }
  
  win.on('resize', resizeBackground);
  win.on('scroll', $.throttle(500, winScroll));
  resizeBackground();
});