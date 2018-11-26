class CarouselSlider {
    constructor($) {
        $('body').find('.carousel-slider').each(function () {
            let _this = $(this),
                autoplaySpeed = 500,
                slideType = _this.data('slide-type'),
                isHeroCarousel = ('hero-banner-slider' === slideType),
                isProductCarousel = ('product-carousel' === slideType),
                isVideoCarousel = ('video-carousel' === slideType);

            if (typeof jQuery().owlCarousel === 'function') {
                let owl_options = _this.data('owl_options'),
                    animation = _this.data('animation');

                if (owl_options) {
                    _this.owlCarousel(owl_options);
                    if (isHeroCarousel && owl_options.autoplaySpeed) {
                        autoplaySpeed = owl_options.autoplaySpeed;
                    }
                } else {
                    let autoWidth = _this.data('auto-width'),
                        stagePadding = parseInt(_this.data('stage-padding'));

                    _this.owlCarousel({
                        stagePadding: stagePadding > 0 ? stagePadding : 0,
                        nav: _this.data('nav'),
                        dots: _this.data('dots'),
                        margin: _this.data('margin'),
                        loop: _this.data('loop'),
                        autoplay: _this.data('autoplay'),
                        autoplayTimeout: _this.data('autoplay-timeout'),
                        autoplaySpeed: _this.data('autoplay-speed'),
                        autoplayHoverPause: _this.data('autoplay-hover-pause'),
                        slideBy: _this.data('slide-by'),
                        lazyLoad: _this.data('lazy-load'),
                        autoWidth: autoWidth,
                        navText: [
                            '<svg class="carousel-slider-nav-icon" viewBox="0 0 20 20"><path d="M14 5l-5 5 5 5-1 2-7-7 7-7z"></path></use></svg>',
                            '<svg class="carousel-slider-nav-icon" viewBox="0 0 20 20"><path d="M6 15l5-5-5-5 1-2 7 7-7 7z"></path></svg>'
                        ],
                        responsive: {
                            320: {items: _this.data('colums-mobile')},
                            600: {items: _this.data('colums-small-tablet')},
                            768: {items: _this.data('colums-tablet')},
                            993: {items: _this.data('colums-small-desktop')},
                            1200: {items: _this.data('colums-desktop')},
                            1921: {items: _this.data('colums')}
                        }
                    });

                    if (isHeroCarousel) {
                        autoplaySpeed = _this.data('autoplay-speed');
                    }
                }

                if (isHeroCarousel && animation.length) {
                    _this.on('change.owl.carousel', function () {
                        let sliderContent = _this.find('.carousel-slider-hero__cell__content');
                        sliderContent.removeClass('animated' + ' ' + animation).hide();
                    });
                    _this.on('changed.owl.carousel', function (e) {
                        setTimeout(function () {
                            let current = $(e.target).find('.carousel-slider-hero__cell__content').eq(e.item.index);
                            current.show().addClass('animated' + ' ' + animation);
                        }, autoplaySpeed);
                    });
                }
            }

            if (typeof jQuery().magnificPopup === 'function') {
                if (isProductCarousel) {
                    $(this).find('.magnific-popup').magnificPopup({
                        type: 'ajax'
                    });
                } else if (isVideoCarousel) {
                    $(this).find('.magnific-popup').magnificPopup({
                        type: 'iframe'
                    });
                } else {
                    $(this).find('.magnific-popup').magnificPopup({
                        type: 'image',
                        gallery: {
                            enabled: true
                        },
                        zoom: {
                            enabled: true,
                            duration: 300,
                            easing: 'ease-in-out'
                        }
                    });
                }
            }
        });
    }
}

export {CarouselSlider}