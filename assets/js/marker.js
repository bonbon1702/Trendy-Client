/* global google */

define(['require','underscore','jquery','dust','vendor/jquery/images-loaded'],function (require) {
    

    var _ = require('underscore'),
        $ = require('jquery'),
        dust = require('dust');

    require('vendor/jquery/images-loaded');

    function constructDimensions(size) {
        var borderWidth = 4;

        size = size || 72;
        return {
            size: size,
            cx: 0.5 * size,
            cy: 0.5 * size,
            r: 0.5 * size,
            A: {
                x: size / 2 + borderWidth,
                y: size / 2 + borderWidth + Math.pow(2 * Math.pow(size / 2 + borderWidth, 2), 1/2)
            },
            B: {
                x: 0.23575 * size,
                y: 0.8075 * size
            },
            C: {
                x: 0.76425 * size,
                y: 0.8075 * size
            },
            innerStrokeWidth: 0.1,
            innerStrokeColor: '#ffffff'
        };
    }

    function Marker(opts) {
        var opts = opts || {};

        this.opts = opts;

        this.id = opts._id;
        this.zoom = opts.zoom;
        this.dimensions = constructDimensions(opts.size);

        if (opts.map) {
            this.setMap(opts.map);
        }

        this.$element = null;
        this.$elementWrapper = null;
    }

    Marker.initialize = function (opts) {
        var opts = opts || {},
            size = opts.size;
    };

    Marker.prototype = _.create(google.maps.OverlayView.prototype, {
        constructor: Marker
    });

    _.assign(Marker.prototype, new function () {

        this.getPosition = function () {
            if (this.opts.position instanceof google.maps.LatLng) {
                return this.opts.position;
            }

            return new google.maps.LatLng(
                this.opts.position.lat,
                this.opts.position.lng
            );
        };

        this.onAdd = function () {
            this.$elementWrapper = $('<div>');
            this.$elementWrapper.addClass('map-marker');

            var self = this,
                $hover = $('<div>').addClass('marker-hover'),
                dimensions = this.dimensions;

            dust.render('map/marker', _.assign({}, this.opts, {
                    dimensions: dimensions
                }))
                .then(function (html) {
                    var $element = $(html).prependTo(self.$elementWrapper);

                    self.$element = $element;

                    $element.eq(0)
                        .hover(function (e) {
                            self.$elementWrapper.find('.marker-hover')
                                .stop()
                                .fadeIn();
                        }, function (e) {
                            self.$elementWrapper.find('.marker-hover')
                                .stop()
                                .fadeOut();
                        });

                    if (self.opts.url) {
                        $element.eq(0).off('mousedown')
                            .on('mousedown', function (e) {
                                var $this = $(this);

                                $this.data().mousedownInMarker = true;
                                $(window).off('mousemove.marker')
                                    .on('mousemove.marker', function (e) {
                                       $this.data().mousedownInMarker = false;
                                    });
                            })
                            .off('mouseup')
                            .on('mouseup', function (e) {
                                var $this = $(this);

                                if ($this.data().mousedownInMarker) {
                                    Backbone.history.navigate(self.opts.url, { trigger: true });
                                }
                            });
                        }

                    if (self.opts.draggable) {

                    }

                    self.getPanes().overlayImage.appendChild(
                        self.$elementWrapper.get(0)
                    );
                });
        };

        this.draw = function () {
            var position = this.getProjection().fromLatLngToDivPixel(
                    this.getPosition()
                ),
                dimensions = this.dimensions;

            this.$elementWrapper
                .css('top', (position.y - dimensions.A.y))
                .css('left', (position.x - dimensions.A.x));
        };

        this.onRemove = function () {
            this.$elementWrapper.remove();
            this.$elementWrapper = null;
            this.$element = null;
        };

    });

    return Marker;
});
