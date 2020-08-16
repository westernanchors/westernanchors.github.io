$(document).ready(function () {
    initSiteNav();
    initHeroCar();
    initScrollBlocks();
    initHeadSrch();
    initProd();
    initPopups();
    initJumpTo();
    initStickyNav();
    initSubscribe();
});

function initSubscribe() {
    $(".subscribe-block form").on("submit", function (e) {
        e.preventDefault();
        var form = $(this);

        $("button", form).text("Subscribing...").prop("disabled", true);

        $.ajax({
            url: form.attr("action"),
            type: form.attr("method"),
            data: form.serialize(),
            success: function (response) {
                if (response.success) {
                    form.replaceWith("<p class='msg'>Thank you for subscribing.</p>");
                } else {
                    form.replaceWith("<p class='msg'>An error occurred whilst trying to subscribe you. Please try again later.</p>");
                }
            },
            error: function(response) {
                form.replaceWith("<p class='msg'>An error occurred whilst trying to subscribe you. Please try again later.</p>");
            }
        });

    });
}
function initJumpTo() {
    $(".jump-to[href^=#]").click(function (e) {
        e.preventDefault();
        var $trg = $($(this).attr("href"));
        scrollToTrg($trg.get(0), 0);
        //setTimeout(function (trg) {
        //    document.location.hash = "#" + $trg.attr("id");
        //}, 1000);
    });
}

function initStickyNav() {
    var win = $(window);
    win.on("scroll", function (e) {
        var htt = $("#site-head .head-top").offset().top;
        var hth = $("#site-head .head-top").outerHeight(true);
        var hbt = $("#site-head .head-bot").offset().top;
        var hbh = $("#site-head .head-bot").outerHeight(true);
        if (win.scrollTop() >= htt + hth) {
            if (!$("html").hasClass("fix-head")) {
                $("html").addClass("fix-head");
                setPageOsY({ noAnim: true });
            }
        } else {
            if ($("html").hasClass("fix-head")) {
                $("html").removeClass("fix-head");
                setPageOsY({ noAnim: true });
            }
        }
    }).on("resize", function (e) {
    }).scroll();
}

function initPopups() {
    $(".btn-enq-online").on("click", function (e) {
        e.preventDefault();
        $(".pop-contact").trigger("openMe");
    });

    $(".popup").on("click", ".pop-close", function (e) {
        e.preventDefault();
        $(e.delegateTarget).trigger("closeMe");
    }).on("openMe", function () {
        $(this).scrollTop(0);
        $(this).addClass("open");
        $("html").addClass("show-popup");
    }).on("closeMe", function () {
        $(this).removeClass("open");
        $("html").removeClass("show-popup");
    });
}

function initProd() {
    var $wrap = $($(".product-head"))
    var $ms = $("[data-metal]", $wrap);
    var $ws = $("[data-weight]", $wrap);
    var $mss = $("select[name=metal]", $wrap);
    var $wss = $("select[name=weight]", $wrap);

    $ms.on("click", function (e) {
        e.preventDefault();
        if ($("html").data("metal") != $(this).attr("data-metal"))
            $("html").removeData("weight");
        $("html").data("metal", $(this).attr("data-metal"));
        updView();
    });

    $mss.on("change", function (e) {
        e.preventDefault();
        if ($("html").data("metal") != $mss.val())
            $("html").removeData("weight");
        $("html").data("metal", $mss.val());
        updView();
    });

    $ws.on("click", function (e) {
        e.preventDefault();
        $("html").data("weight", $(this).attr("data-weight"));
        updView();
    });

    $wss.on("change", function (e) {
        e.preventDefault();
        $("html").data("weight", $wss.filter(":visible").val());
        updView();
    });

    function updView() {
        var m = $("html").data("metal");
        var w = $("html").data("weight");
        if (m == undefined) {
            m = $ms.first().attr("data-metal");
        }
        if (w == undefined) {
            w = $("[data-weights=" + m + "] [data-weight]").first().attr("data-weight");
        }

        $("[data-weights=" + m + "]").fadeIn(500).siblings("[data-weights]").hide();
        var $view = $("#specs-" + m + "-" + w);
        if (!$view.is(":visible")) {
            $(".spec-views", $wrap).prepend($view);
            $view.fadeIn(500).siblings(".spec-view").hide();
        }

        var $m = $ms.filter(".active, :first").last();
        $ms.filter("[data-metal=" + m + "]").addClass("active").siblings("[data-metal]").removeClass("active");
        $ws.filter("[data-weight=" + w + "]").addClass("active").siblings("[data-weight]").removeClass("active");

        $mss.val(m);
        $wss.val(w);

        initProdGallery($(".prod-gallery", $view));
    }
    updView();
}

function initHeadSrch() {
    $("#site-head .head-top .head-srch input[type=text]").on("focus", function (e) {
        $("html").addClass("head-srch-open");
    }).on("blur", function (e) {
        $("html").removeClass("head-srch-open");
    });
}

function initHeroCar() {
    var defPause = 5000;
    var breakPause = 20000;
    $(".hero-carousel").each(function () {
        var $c = $(this);
        var $ps = $(".panel", this);
        var $ns = $(".car-nav", this);
        var $next = $(".car-next", this);
        var $prev = $(".car-prev", this);
        var direction = 0;
        var pause = defPause;

        $ns.on("click", "a", function (e) {
            e.preventDefault();
            pause = breakPause;
            autoScroll($c, "goto", $(this).index() + 1);
            //$c.attr("data-panel", $(this).index() + 1);
        });
        $ps.each(function () {
            var $p = $(this);
            $ns.append($("<a/>", { href: "#" }));
        });
        $c.on("touchstart", function (e) {
            direction = e.originalEvent.touches[0].clientX;
            x = direction;
            $c.on("touchmove", function (e) {
                x = e.originalEvent.touches[0].clientX;
                if (direction < x - 2 || direction > x + 2) {
                    $c.off("touchmove");
                    if (direction > x) {
                        pause = breakPause;
                        autoScroll($c, "fwd");
                    } else if (direction < x) {
                        pause = breakPause;
                        autoScroll($c, "rev");
                    }
                }
                direction = x;
            });
        }).on("touchstop", function (e) {
            $c.off("touchmove");
        }).on("rev", function (e) {
            var i = parseInt($c.attr("data-panel")) || 1;
            i = i > 1 ? i - 1 : $ps.size();
            $c.attr("data-panel", i);
        }).on("fwd", function (e) {
            var i = parseInt($c.attr("data-panel")) || 1;
            i = i < $ps.size() ? i + 1 : 1;
            $c.attr("data-panel", i);
        }).on("goto", function (e, idx) {
            $c.attr("data-panel", idx);
        });

        $next.on("click", function (e) {
            e.preventDefault();
            pause = breakPause;
            autoScroll($c, "fwd");
            //$c.trigger("fwd");
        });
        $prev.on("click", function (e) {
            e.preventDefault();
            pause = breakPause;
            autoScroll($c, "rev");
            //$c.trigger("rev");
        });

        $c.data("sID", setTimeout(function () {
            autoScroll($c, "fwd");
        }, pause));

        function autoScroll(car, dir, idx) {
            var dir = dir || "fwd";
            if (dir == "goto") {
                $(car).trigger("goto", [idx]);
            } else {
                $(car).trigger(dir);
            }
            clearTimeout($(car).data("sID"));
            $(car).data("sID", setTimeout(function () {
                pause = defPause;
                autoScroll(car);
            }, pause));
        }
    });

}

function initScrollBlocks() {
    $(window).bind("scroll", function (e) {
        calcScrollBlocks();
    });
}

function calcScrollBlocks() {
    var win = $(window);
    var $blocks = $(".bg-scroll");
    $blocks.each(function (i, block) {
        var $block = $(this);
        var $bg = $(".bg-scroll-bit", this);
        var nt = $("#site-head .head-bot").outerHeight(true);
        var osT = $block.offset().top - nt;
        if (win.scrollTop() >= osT) {
            var st = Math.max($("html").scrollTop() - osT, $("body").scrollTop() - osT, 0);
            //$bg.css({ "margin-top": st / 2, "margin-bottom": st / -2 });
            $bg.css({ "transform": "translateY(" + st / 2 + "px)" });
        } else {
            //$bg.css({ "margin-top": 0, "margin-bottom": 0 });
            $bg.css({ "transform": "translateY(0)" });
        }

    });
}

function initSiteNav() {
    var navAnimDuration = 500;
    var win = $(window);
    var $head = $("#site-head");
    var $dNav = $("#site-nav");
    var $dSubnavs = $("#sub-navs");

    $head.on("openSubnav closeSubnav", function (e, opts) {
        var $sNav = $(e.target);
        var $navItem = $sNav.data("navItem");
        var $open = $(".sub-nav.active", $dSubnavs);
        if ($open.size() == 1) {
            $dSubnavs.addClass("open");
            $sNav.trigger("showMe").show();
            setPageOsY(opts);
        } else if ($open.size() > 1) {
            $hide = $sNav.siblings(".active");
            $hide.trigger("hideMe").hide();
            $sNav.trigger("showMe").fadeIn("slow");
        } else {
            $dSubnavs.removeClass("open");
            setTimeout(function () { $sNav.trigger("hideMe").hide(); }, (opts && opts.noAnim) ? 0 : navAnimDuration);
            setPageOsY(opts);
        }
    });

    $(".sub-nav", $dSubnavs).each(function () {
        var $sNav = $(this);
        var $navItem = $("a", $dNav).eq(parseInt($sNav.data("subnav"), 10));
        $navItem.data("snav", $sNav);
        $sNav.data("navItem", $navItem);
        $navItem.on("click", function (e) {
            e.preventDefault();
            $sNav.trigger("toggleSubnav");
        });
        $sNav.on("openSubnav", function (e) {
            $sNav.add($navItem).addClass("active");
        }).on("closeSubnav", function (e) {
            $sNav.add($navItem).removeClass("active");
        }).on("toggleSubnav", function (e) {
            if ($sNav.hasClass("active"))
                $sNav.trigger("closeSubnav");
            else
                $sNav.trigger("openSubnav");
        }).on("showMe", function (e) {
            $sNav.add($navItem).addClass("active");
        }).on("hideMe", function (e) {
            $sNav.add($navItem).removeClass("active");
        });
    });

    try {
        $(".active", $dNav).last().data("snav").trigger("openSubnav", [{ noAnim: true }]);
    } catch (ex) {
        // no default selected
    }

    var $mMenu = $("#mmenu");
    $("ul > li", $mMenu).each(function (i, item) {
        var $item = $(this);
        var $sub = $item.find(".sub-nav");
        if ($sub.size()) {
            $item.on("click", "> a", function (e) {
                e.preventDefault();
                if ($item.hasClass("active")) {
                    $item.trigger("closeMe");
                } else {
                    $item.trigger("openMe");
                }
            });
            $item.bind("openMe", function (e) {
                $item.addClass("active");
                $sub.css({ "height": $("> ol", $sub).outerHeight(true) });
            }).bind("closeMe", function (e) {
                $item.removeClass("active");
                $sub.css({ "height": "" });
            });
        }
    }).filter(".active").trigger("openMe");

    $("#site-head").on("click", ".burger", function (e) {
        e.preventDefault();
        $mMenu.trigger("showMe");
    })
    $mMenu.on("click", ".close-x", function (e) {
        e.preventDefault();
        $mMenu.trigger("hideMe");
    });
    $mMenu.bind("showMe", function (e) {
        $("html").addClass("show-mmenu");
    }).bind("hideMe", function (e) {
        $("html").removeClass("show-mmenu");
    });


}

function setPageOsY(opts) {
    //var mH = ($("html").hasClass("fix-head")) ? $("#site-head .head-bot").position().top + $("#site-nav").outerHeight(true) + $("#sub-navs .active .content-wrap").outerHeight(true) : $("#sub-navs .active .content-wrap").outerHeight(true);
    var mH = $("#sub-navs .active .content-wrap").outerHeight(true);
    mH = mH || 0;
    if (opts && opts.noAnim) {
        //$("#site-head").css({ "transition-duration": "0s" });
        $("#main-content, #site-foot").css({ "transition-duration": "0s" });
    }
    //$("#site-head").css("margin-bottom", mH || "");
    $("#main-content, #site-foot").css("transform", "translateY(" + mH + "px)");
    $("#site-foot").css({ "margin-bottom": mH });
    setTimeout(function () {
        //$("#site-head").css("transition-duration", "");
        $("#main-content, #site-foot").css("transition-duration", "");
    }, 10);

}

function scrollToTrg(trg, osY) {
    if (!$(trg).is(":visible")) { return false; }

    var mH = ($("html").hasClass("fix-head")) ? $("#site-head .head-bot").position().top + $("#site-nav").outerHeight(true) + $("#sub-navs .active .content-wrap").outerHeight(true) : $("#sub-navs .active .content-wrap").outerHeight(true);
    var osY = osY || mH;
    var sTop = typeof trg == "number" ? trg : typeof trg == "object" ? Math.max(0, $(trg).offset().top) : -1;

    sTop -= osY;
    if (sTop > -1) {
        $("html, body").animate({ scrollTop: Math.max(0, sTop - 10) }, 1000);
    }
}

/*
* jQuery google map plugin
*/
; (function ($) {
    function GoogleMap(options) {
        this.options = $.extend({
            holder: null,
            mapOptions: {
                zoom: 10,
                // minZoom: 13,
                // maxZoom: 13,
                panControl: false,
                zoomControl: false,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                overviewMapControl: false
            },
            addressAttr: 'data-source',
            urlForImagePinAttr: null
        }, options);
        this.init();
    }

    GoogleMap.prototype = {
        init: function () {
            if (this.options.holder) {
                this.findElements();
                this.attachEvents();
            }
        },
        findElements: function () {
            var self = this;
            this.holder = jQuery(this.options.holder);
            this.map = new google.maps.Map(this.options.holder, this.options.mapOptions);
            this.geocoder = new google.maps.Geocoder();
            this.bounds = new google.maps.LatLngBounds();
            this.currentIndex = 0;
            if (this.holder.data('address')) {
                this.drawOnlyOneMarker(this.holder.data('address'));
            } else {
                this.loadAddress().done(function (obj) {
                    self.onajaxSuccess(obj);
                    self.makeCallback('onInit', true);
                });
            }
        },
        attachEvents: function () {
            var self = this;

            this.resizeHandler = function () {
                if (self.holder.data('ratio')) {
                    self.holder.css({
                        height: self.holder.width() / self.holder.data('ratio')
                    });
                }
            };

            this.resizeHandler();

            $(window).on('load resize orientationchange', this.resizeHandler);
        },
        onajaxSuccess: function (obj) {
            this.addressObj = obj;

            this.drawMarkers();
        },
        loadAddress: function () {
            var d = $.Deferred();

            $.ajax({
                url: this.holder.attr(this.options.addressAttr),
                type: 'get',
                dataType: 'json',
                success: function (obj) {
                    d.resolve(obj);
                }
            });

            return d;
        },
        drawMarkers: function () {
            var self = this;

            this.getLatLng(this.addressObj[this.currentIndex].address).done(function (results, status) {
                self.setMarker(results[0].geometry.location);
                self.centeringMap(results[0].geometry.location);
                if (self.currentIndex < self.addressObj.length - 1) {
                    self.currentIndex++;
                    self.drawMarkers();
                }
            });
        },
        drawOnlyOneMarker: function (address) {
            var self = this;

            this.getLatLng(address).done(function (results, status) {
                self.setMarker(results[0].geometry.location);
                self.map.setCenter(results[0].geometry.location);
            });
        },
        setMarker: function (position) {
            new google.maps.Marker({
                map: this.map,
                position: position,
                icon: this.options.urlForImagePinAttr ? this.holder.attr(this.options.urlForImagePinAttr) : null
            });
        },
        centeringMap: function (position) {
            this.bounds.extend(position);
            this.map.fitBounds(this.bounds);
        },
        getLatLng: function (address) {
            var d = jQuery.Deferred();

            this.geocoder.geocode({
                address: address
            }, function (results, status) {
                d.resolve(results, status);
            });

            return d;
        },
        makeCallback: function (name) {
            if (typeof this.options[name] === 'function') {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                this.options[name].apply(this, args);
            }
        }
    };

    $.fn.googleMap = function (opt) {
        return this.each(function () {
            $(this).data('GoogleMap', new GoogleMap($.extend({
                holder: this
            }, opt)));
        });
    };
}(jQuery));
