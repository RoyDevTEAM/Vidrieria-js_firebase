/*! construction-landing-page-pro  2020-04-06 2:43:08 PM */

jQuery(document).ready(function(e){var a,t,n,o,i,r,d;if(a=e(window).width(),"1"==construction_landing_page_data.sticky&&992<=a){if("one"!=construction_landing_page_data.header&&"seven"!=construction_landing_page_data.header){var l="sticky-menu";nav="two"==construction_landing_page_data.header||"four"==construction_landing_page_data.header?(hdr=e(".site-header .header-holder").outerHeight(),e(".nav-holder").outerHeight()):"three"==construction_landing_page_data.header?(hdr=e(".site-header .top-bar").outerHeight(),e(".header-t").outerHeight()):"six"==construction_landing_page_data.header?(hdr=e(".site-header .header-t").outerHeight(),e(".nav-holder").outerHeight()):(hdr=e(".site-header").outerHeight(),e(".main-navigation").outerHeight()),"two"==construction_landing_page_data.header||"four"==construction_landing_page_data.header||"six"==construction_landing_page_data.header?mn=e(".nav-holder"):"three"==construction_landing_page_data.header?mn=e(".header-t"):"five"!=construction_landing_page_data.header&&"eight"!=construction_landing_page_data.header||(mn=e(".main-navigation")),e(window).scroll(function(){e(this).scrollTop()>hdr?(mn.addClass(l),e(".sticky-holder").height(nav)):(mn.removeClass(l),e(".sticky-holder").height(0))})}else"one"==construction_landing_page_data.header?t=e(".header-one").outerHeight():"seven"==construction_landing_page_data.header&&(t=e(".header-7").outerHeight()),e(".sticky-holder").height(t);if("eight"==construction_landing_page_data.header){var c=e(".site-header.building-header .top-bar").outerHeight(),s=e(".site-header.building-header .header-t .top").outerHeight(),g=e(".site-header.building-header .main-navigation").outerHeight(),h=c+s;console.log(h),e(window).scroll(function(){e(this).scrollTop()>h?(e(".site-header.building-header .main-navigation").addClass("sticky-menu"),e(".sticky-holder").height(g)):(e(".site-header.building-header .main-navigation").removeClass("sticky-menu"),e(".sticky-holder").height(0))})}}wow=new WOW({offset:0,mobile:!1}),wow.init(),e("#secondary-mobile-header a").click(function(){e(".site-header.header-2 .secondary-menu").slideToggle()}),e("#mobile-header a").click(function(){e("body").toggleClass("menu-active")});var u=e(".grid").imagesLoaded(function(){u.isotope({}),e(".button-group").on("click","button",function(){e(".button-group button").removeClass("is-checked"),e(this).addClass("is-checked");var a=e(this).attr("data-filter");u.isotope({filter:a})})});n="1"==construction_landing_page_data.rtl,e(".portfolio-slider").slick({slidesToShow:1,slidesToScroll:1,arrows:!0,asNavFor:".portfolio-thumb",draggable:!1,infinite:!1,rtl:n}),e(".portfolio-thumb").slick({slidesToShow:6,slidesToScroll:1,asNavFor:".portfolio-slider",dots:!1,arrows:!1,centerMode:!1,focusOnSelect:!0,infinite:!1,draggable:!1,rtl:n,responsive:[{breakpoint:767,settings:{slidesToShow:2}}]}),o="1"==construction_landing_page_data.auto,i="1"==construction_landing_page_data.loop,r="1"==construction_landing_page_data.control,d="slide"==construction_landing_page_data.mode?"":"fade"==construction_landing_page_data.mode?"fadeOut":construction_landing_page_data.mode,e("#banner-slider").owlCarousel({items:1,margin:0,animateOut:d,dots:!1,mouseDrag:!1,autoplay:o,loop:i,nav:r,autoplaySpeed:construction_landing_page_data.speed,autoplayTimeout:construction_landing_page_data.pause,rtl:n}),"1"==construction_landing_page_data.lightbox&&(e(".entry-content").find(".gallery-columns-1").find(".gallery-icon > a").attr("data-fancybox","group1"),e(".entry-content").find(".gallery-columns-2").find(".gallery-icon > a").attr("data-fancybox","group2"),e(".entry-content").find(".gallery-columns-3").find(".gallery-icon > a").attr("data-fancybox","group3"),e(".entry-content").find(".gallery-columns-4").find(".gallery-icon > a").attr("data-fancybox","group4"),e(".entry-content").find(".gallery-columns-5").find(".gallery-icon > a").attr("data-fancybox","group5"),e(".entry-content").find(".gallery-columns-6").find(".gallery-icon > a").attr("data-fancybox","group6"),e(".entry-content").find(".gallery-columns-7").find(".gallery-icon > a").attr("data-fancybox","group7"),e(".entry-content").find(".gallery-columns-8").find(".gallery-icon > a").attr("data-fancybox","group8"),e(".entry-content").find(".gallery-columns-9").find(".gallery-icon > a").attr("data-fancybox","group9"),e("a[href$='.jpg'],a[href$='.jpeg'],a[href$='.png'],a[href$='.gif'],[data-fancybox]").fancybox({buttons:["zoom","slideShow","fullScreen","close"]})),e(window).on("load",function(){e(".our-projects .col .text-holder").mCustomScrollbar(),e(".portfolio-page .portfolio-holder .col .text-holder").mCustomScrollbar()}),e(".shortcode-slider .slides").owlCarousel({items:1,margin:0,dots:!1,mouseDrag:!1,nav:!0,rtl:n}),e(".rara_accordian .rara_accordian_content").hide(),e(".rara_accordian:first").children(".rara_accordian_content").show(),e(".rara_accordian:first").children(".rara_accordian_title").addClass("active"),e(".rara_accordian_title").click(function(){e(this).hasClass("active")||(e(this).parent(".rara_accordian").siblings().find(".rara_accordian_content").slideUp(),e(this).next(".rara_accordian_content").slideToggle(),e(this).parent(".rara_accordian").siblings().find(".rara_accordian_title").removeClass("active"),e(this).toggleClass("active"))}),e(".rara_toggle.close .rara_toggle_content").hide(),e(".rara_toggle.open .rara_toggle_title").addClass("active"),e(".rara_toggle_title").click(function(){e(this).next(".rara_toggle_content").slideToggle(),e(this).toggleClass("active")}),e(".rara_tab").hide(),e(".rara_tab_wrap").prepend('<div class="rara_tab_group clearfix"></div>'),e(".rara_tab_wrap").each(function(){e(this).children(".rara_tab").find(".tab-title").prependTo(e(this).find(".rara_tab_group")),e(this).children(".rara_tab").wrapAll("<div class='rara_tab_content clearfix' />")}),e("#page").each(function(){e(this).find(".rara_tab:first-child").show(),e(this).find(".tab-title:first-child").addClass("active")}),e(".rara_tab_group .tab-title").click(function(){e(this).siblings().removeClass("active"),e(this).addClass("active"),e(this).parent(".rara_tab_group ").next(".rara_tab_content").find(".rara_tab").hide();var a=e(this).attr("id");e(this).parent(".rara_tab_group ").next(".rara_tab_content").find("."+a).show()}),e("html").click(function(){e(".site-header .form-holder form").hide()}),e(".form-holder").click(function(a){a.stopPropagation()}),e(".search-btn").click(function(){return e(".site-header .form-holder form").slideToggle(),!1});var _=e(".site-header").outerHeight(),p=e(window).width();e(".banner").css("padding-top",_+82),p<992&&e(".banner").css("padding-top",_+44),p<768&&e(".banner").css("padding-top",50),e(window).scroll(function(){1<e(this).scrollTop()?e(".site-header.sticky-menu").addClass("background"):e(".site-header.sticky-menu").removeClass("background")}),e(window).scroll(function(){300<e(this).scrollTop()?e("#rara-top").fadeIn():e("#rara-top").fadeOut()}),e("#rara-top").click(function(){e("html,body").animate({scrollTop:0},600)}),(0<e(".page-template-template-about").length||0<e(".page-template-template-home").length)&&e(".number").counterUp({delay:20,time:2e3}),e(".mobile-menu-opener").click(function(){e("body").addClass("open-menu"),e(".btn-close-menu").click(function(){e("body").removeClass("open-menu")})}),e(".overlay").click(function(){e("body").removeClass("open-menu")}),e(".mobile-menu").prepend('<div class="btn-close-menu"></div>'),e(".mobile-main-navigation ul .menu-item-has-children").append('<div class="angle-down"></div>'),e(".mobile-main-navigation ul li .angle-down").click(function(){e(this).prev().slideToggle(),e(this).toggleClass("active")}),e("#site-navigation ul li a").focus(function(){e(this).parents("li").addClass("focus")}).blur(function(){e(this).parents("li").removeClass("focus")})});