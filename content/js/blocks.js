$(function () {
    //carousel
    $(".page-heros:not(.no-carousel)").bxSlider({
        auto: true,
        easing: 'ease-in',
        pause: 8000 //milliseconds
    });

    //galleries
    initGalleries();

    //videos

    $("#main-content").fitVids();

    $(".vid-wrap a").on("click", function (e) {
        e.preventDefault();
        $(this).hide();
        var video = $(".video", $(this).parent());
        var iframe = $("iframe", video);

        video.addClass("visible");
        iframe.attr('src', iframe.data('src'));
    });

    //masonry
    $(".isotope").each(function () {
        var container = $(this);
        //$(".block", container).width(container.width() / 4);

        container.imagesLoaded(function () {
            container.packery({
                itemSelector: '.block',
                gutter: 10
            });
        });
    });

    refreshTicker();

    $("[data-accordion]").accordion({
        transitionSpeed: 400
    });
});

function refreshTicker() {
    $("#metal-prices").load("/umbraco/surface/Shared/RenderMetalPrices", function () {
        $("#metal-prices").removeClass("loading");
        $("#metal-prices").data("loading", false);

        setTimeout(refreshTicker, 5 * 60 * 1000);
    });
}
function initGalleries() {
    $('.gallery').each(function () {
        var id = $(this).attr('data-id');
        var self = this;

        var slider = $('.fulls ul', this).bxSlider({
            pagerCustom: '#gallery-thumbs-' + id,
            adaptiveHeight: true,
            preloadImages: 'all',
            infiniteLoop: false,
            hideControlOnEnd: true
        }).on('click', function (e) {
            slider.goToNextSlide();
        });
    });
}

function initProdGallery(gallery) {
    var self = $(gallery);
    if (self.data("gal-init")) return true;
    var id = self.attr('data-id');
    self.data("gal-init", true);
    var slider = $('.fulls ul', self).bxSlider({
        pagerCustom: '#gallery-thumbs-' + id,
        adaptiveHeight: true,
        preloadImages: 'all',
        infiniteLoop: false,
        hideControlOnEnd: true
    }).on('click', function (e) {
        slider.goToNextSlide();
    });
}
