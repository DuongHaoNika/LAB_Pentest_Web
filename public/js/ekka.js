/* ====== Index ======

1.  SCROLLBAR SIDEBAR
2.  MOBILE OVERLAY
3.  SIDEBAR MENU
4.  SIDEBAR TOGGLE FOR MOBILE
5.  SIDEBAR TOGGLE FOR VARIOUS SIDEBAR LAYOUT
6.  RIGHT SIDEBAR
7.  DROPDOWN NOTIFY
8.  TOOLTIPS AND POPOVER
9.  Google Map chart
10. MULTIPLE SELECT
11. BASIC DATA TABLE
12. RESPONSIVE DATA TABLE
13. HOVERABLE DATA TABLE
15. Image Change on Upload
16. Click To Select

====== End ======*/

$(document).ready(function () {
  "use strict";

  /*======== SCROLLBAR SIDEBAR ========*/
  var sidebarScrollbar = $(".sidebar-scrollbar");
  if (sidebarScrollbar.length != 0) {
    sidebarScrollbar.slimScroll({
      opacity: 0,
      height: "100%",
      color: "#808080",
      size: "5px",
      touchScrollStep: 50
    })
      .mouseover(function () {
        $(this)
          .next(".slimScrollBar")
          .css("opacity", 0.5);
      });
  }

  /*======== MOBILE OVERLAY ========*/
  if ($(window).width() < 768) {
    $(".sidebar-toggle").on("click", function () {
      $("body").css("overflow", "hidden");
      $(".ec-tools-sidebar-overlay").fadeIn();
    });

    $(document).on("click", '.ec-tools-sidebar-overlay', function (e) {
      $(this).fadeOut();
      $("#body").removeClass("sidebar-mobile-in").addClass("sidebar-mobile-out");
      $("body").css("overflow", "auto");
    });
  }

  /*======== SIDEBAR MENU ========*/
  var sidebar = $(".sidebar")
  if (sidebar.length != 0) {
    $(".sidebar .nav > .has-sub > a").click(function () {
      $(this).parent().siblings().removeClass('expand');
      $(this).parent().siblings().children(".collapse").slideUp('show');
      $(this).parent().toggleClass('expand');
      $(this).parent().children(".collapse").slideToggle("show");
    })
    $(".sidebar .nav > .has-sub .has-sub > a").click(function () {
      $(this).parent().toggleClass('expand');
    })
  }

  /*======== SIDEBAR TOGGLE FOR MOBILE ========*/
  if ($(window).width() < 768) {
    $(document).on("click", ".sidebar-toggle", function (e) {
      e.preventDefault();
      var min = "sidebar-mobile-in",
        min_out = "sidebar-mobile-out",
        body = "#body";
      $(body).hasClass(min)
        ? $(body)
          .removeClass(min)
          .addClass(min_out)
        : $(body)
          .addClass(min)
          .removeClass(min_out)
    });
  }

  /*======== SIDEBAR TOGGLE FOR VARIOUS SIDEBAR LAYOUT ========*/
  var body = $("#body");
  if ($(window).width() >= 768) {

    if (typeof window.isMinified === "undefined") {
      window.isMinified = false;
    }
    if (typeof window.isCollapsed === "undefined") {
      window.isCollapsed = false;
    }

    $("#sidebar-toggler").on("click", function () {
      if (
        body.hasClass("ec-sidebar-fixed-offcanvas") ||
        body.hasClass("ec-sidebar-static-offcanvas")
      ) {
        $(this)
          .addClass("sidebar-offcanvas-toggle")
          .removeClass("sidebar-toggle");
        if (window.isCollapsed === false) {
          body.addClass("sidebar-collapse");
          window.isCollapsed = true;
          window.isMinified = false;
        } else {
          body.removeClass("sidebar-collapse");
          body.addClass("sidebar-collapse-out");
          setTimeout(function () {
            body.removeClass("sidebar-collapse-out");
          }, 300);
          window.isCollapsed = false;
        }
      }

      if (
        body.hasClass("ec-sidebar-fixed") ||
        body.hasClass("ec-sidebar-static")
      ) {
        $(this)
          .addClass("sidebar-toggle")
          .removeClass("sidebar-offcanvas-toggle");
        if (window.isMinified === false) {
          body
            .removeClass("sidebar-collapse sidebar-minified-out")
            .addClass("sidebar-minified");
          window.isMinified = true;
          window.isCollapsed = false;
        } else {
          body.removeClass("sidebar-minified");
          body.addClass("sidebar-minified-out");
          window.isMinified = false;
        }
      }
    });
  }

  if ($(window).width() >= 768 && $(window).width() < 992) {
    if (
      body.hasClass("ec-sidebar-fixed") ||
      body.hasClass("ec-sidebar-static")
    ) {
      body
        .removeClass("sidebar-collapse sidebar-minified-out")
        .addClass("sidebar-minified");
      window.isMinified = true;
    }
  }

  /*======== RIGHT SIDEBAR ========*/
  var rightSidebarIn = 'right-sidebar-in';
  var rightSidebarOut = 'right-sidebar-out';

  $('.nav-right-sidebar .nav-link').on('click', function () {

    if (!body.hasClass(rightSidebarIn)) {
      body.addClass(rightSidebarIn).removeClass(rightSidebarOut);

    } else if ($(this).hasClass('show')) {
      body.addClass(rightSidebarOut).removeClass(rightSidebarIn);
    }
  });

  $('.card-right-sidebar .close').on('click', function () {
    body.removeClass(rightSidebarIn).addClass(rightSidebarOut);
  })

  if ($(window).width() <= 1024) {

    var togglerInClass = "right-sidebar-toggoler-in"
    var togglerOutClass = "right-sidebar-toggoler-out"

    body.addClass(togglerOutClass);

    $('.btn-right-sidebar-toggler').on('click', function () {
      if (body.hasClass(togglerOutClass)) {
        body.addClass(togglerInClass).removeClass(togglerOutClass)
      } else {
        body.addClass(togglerOutClass).removeClass(togglerInClass);
      }
    });
  }

  /*======== DROPDOWN NOTIFY ========*/
  var dropdownToggle = $('.notify-toggler');
  var dropdownNotify = $('.dropdown-notify');

  if (dropdownToggle.length !== 0){
    dropdownToggle.on('click', function () {
      if (!dropdownNotify.is(':visible')){
        dropdownNotify.fadeIn(5);
      }else {
        dropdownNotify.fadeOut(5);
      }
    });

    $(document).mouseup(function (e) {
      if (!dropdownNotify.is(e.target) && dropdownNotify.has(e.target).length === 0){
        dropdownNotify.fadeOut(5);
      }
    });
  }

  /*======== TOOLTIPS AND POPOVER ========*/
  var tooltip = $('[data-toggle="tooltip"]')
  if(tooltip.length != 0){
    tooltip.tooltip({
      container: "body",
      template:
        '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
    });
  }

  var popover = $('[data-toggle="popover"]')

  if(popover.length != 0){
    popover.popover();
  }

  /*======== BASIC DATA TABLE ========*/
  var basicDataTable = $("#basic-data-table");
  if (basicDataTable.length !== 0){
    basicDataTable.DataTable({
      "dom": '<"row justify-content-between top-information"lf>rt<"row justify-content-between bottom-information"ip><"clear">'
    });
  }

  /*======== RESPONSIVE DATA TABLE ========*/
  var responsiveDataTable = $("#responsive-data-table");
  if (responsiveDataTable.length !== 0){
    responsiveDataTable.DataTable({
      "aLengthMenu": [[20, 30, 50, 75, -1], [20, 30, 50, 75, "All"]],
      "pageLength": 20,
      "dom": '<"row justify-content-between top-information"lf>rt<"row justify-content-between bottom-information"ip><"clear">'
    });
  }

  /*======== Image Change on Upload ========*/
  $("body").on("change", ".ec-image-upload", function (e) {

    var lkthislk = $(this);

    if (this.files && this.files[0]) {

        var reader = new FileReader();
        reader.onload = function (e) {

            var ec_image_preview = lkthislk.parent().parent().children('.ec-preview').find('.ec-image-preview').attr('src', e.target.result);

            ec_image_preview.hide();
            ec_image_preview.fadeIn(650);
        }
        reader.readAsDataURL(this.files[0]);
    }
  });

  /*======== Click To Select ========*/ 
  $('.fa-span').click(function() {
      var fa_class = $(this).text();

      // Create a "hidden" input
      var aux = document.createElement("input");

      // Assign it the value of the specified element
      aux.setAttribute("value", fa_class);

      // Append it to the body
      document.body.appendChild(aux);

      // Highlight its content
      aux.select();

      // Copy the highlighted text
      document.execCommand("copy");

      // Remove it from the body
      document.body.removeChild(aux);

      $('#fa-preview').html('<code>&lt;i class=&quot;'+ fa_class +'&quot;&gt;&lt;/i&gt;</code>');

      var copied = document.createElement('div');
			copied.setAttribute('class', 'copied');
			copied.appendChild(document.createTextNode('Copied to Clipboard'));
    	document.body.appendChild(copied);
			setTimeout(function () {
				document.body.removeChild(copied);
			}, 1500);
  });

  /*----------------------------- Product Image Zoom --------------------------------*/
  $('.zoom-image-hover').zoom();
  
  /*----------------------------- Single Product Slider  ------------------------------ */
  $('.single-product-cover').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
    asNavFor: '.single-nav-thumb',
  });

  $('.single-nav-thumb').slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      asNavFor: '.single-product-cover',
      dots: false,
      arrows: true,
      focusOnSelect: true
  });

  /*----------------------------- Category slug --------------------------------*/
  function generate_slug(slug) {
	
    slug = slug.replace(/^\s+|\s+$/g, ''); // trim
    slug = slug.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to   = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
      slug = slug.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
  
    slug = slug.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes
    
    $('.set-slug').val(slug);
  };
  
  $('.slug-title').bind("paste", function(e){
		var slug = e.originalEvent.clipboardData.getData('text');
		generate_slug(slug);
	});
	
	$(".slug-title").keypress(function(){	
		var slug = $(this).val();
		generate_slug(slug);
	});
	
	var d = new Date();
	var year = d.getFullYear();
	document.getElementById("ec-year").innerHTML = year;

});
