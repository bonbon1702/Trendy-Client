/**
 * Created by tuan on 12/11/2014.
 */
(function(root, factory){
    root.googleMap = factory(root);
})(this, function(root){

    'use strict';

    var googleMap = {};

    var map, markers=[];

    googleMap.init = function(){
        var haNoiLocation = new google.maps.LatLng(21.0249399, 105.8457613);
        var myStyles = [
            {
                "featureType":"administrative.country",
                "elementType":"labels",
                "stylers":[
                    {
                        "visibility":"simplified"
                    }
                ]
            },
            {
                "featureType":"administrative.province",
                "elementType":"labels",
                "stylers":[
                    {
                        "visibility":"simplified"
                    }
                ]
            },
            {
                "featureType":"administrative.locality",
                "elementType":"labels",
                "stylers":[
                    {
                        "visibility":"simplified"
                    }
                ]
            },
            {
                "featureType":"administrative.neighborhood",
                "elementType":"labels",
                "stylers":[
                    {
                        "visibility":"off"
                    }
                ]
            },
            {
                "featureType":"administrative.land_parcel",
                "elementType":"labels",
                "stylers":[
                    {
                        "visibility":"off"
                    }
                ]
            },
            {
                "featureType":"landscape.natural",
                "elementType":"geometry.fill",
                "stylers":[
                    {
                        "visibility":"on"
                    },
                    {
                        "color":"#e0efef"
                    }
                ]
            },
            {
                "featureType":"poi",
                "elementType":"geometry.fill",
                "stylers":[
                    {
                        "visibility":"off"
                    },
                    {
                        "hue":"#1900ff"
                    },
                    {
                        "color":"#c0e8e8"
                    }
                ]
            },
            {
                "featureType":"poi",
                "elementType":"labels",
                "stylers":[
                    {
                        "visibility":"off"
                    }
                ]
            },
            {
                "featureType":"road",
                "elementType":"all",
                "stylers":[
                    {
                        "visibility":"off"
                    }
                ]
            },
            {
                "featureType":"road",
                "elementType":"geometry",
                "stylers":[
                    {
                        "lightness":100
                    },
                    {
                        "visibility":"simplified"
                    }
                ]
            },
            {
                "featureType":"road",
                "elementType":"labels",
                "stylers":[
                    {
                        "visibility":"on"
                    }
                ]
            },
            {
                "featureType":"transit",
                "elementType":"all",
                "stylers":[
                    {
                        "visibility":"off"
                    }
                ]
            },
            {
                "featureType":"transit.line",
                "elementType":"geometry",
                "stylers":[
                    {
                        "visibility":"off"
                    },
                    {
                        "lightness":700
                    }
                ]
            },
            {
                "featureType":"water",
                "elementType":"all",
                "stylers":[
                    {
                        "color":"#7dcdcd"
                    }
                ]
            }
        ];
        var mapOptions = {
            zoom: 15,
            center: haNoiLocation,
            panControl: false,
            zoomControl: false,
            scaleControl: false,
            streetViewControl: false,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: myStyles,
            disableDefaultUI: true,
            disableDoubleClickZoom: true
        }

        map = new google.maps.Map(document.getElementById('map'), mapOptions);

        searchBox();
        homeButton();
    }

    var searchBox = function(){
        var input = /** @type {HTMLInputElement} */ (
            document.getElementById('pac-input'));
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        var searchBox = new google.maps.places.SearchBox(
            /** @type {HTMLInputElement} */
            (input));
        // Listen for the event fired when the user selects an item from the
        // pick list. Retrieve the matching places for that item.
        google.maps.event.addListener(searchBox, 'places_changed', function() {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }
            for (var i = 0, marker; marker = markers[i]; i++) {
                marker.setMap(null);
            }

            // For each place, get the icon, place name, and location.
            markers = [];
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0, place; place = places[i]; i++) {
                var image = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                var marker = createMarker(map, image, place.geometry.location);
                markers.push(marker);

                bounds.extend(place.geometry.location);
            }

            map.fitBounds(bounds);
            map.setZoom(18);
        });

        // Bias the SearchBox results towards places that are within the bounds of the
        // current map's viewport.
        google.maps.event.addListener(map, 'bounds_changed', function() {
            var bounds = map.getBounds();
            searchBox.setBounds(bounds);
        });
    }

    var homeButton = function(){
        var homeControlDiv = document.createElement('div');
        var homeControl = new HomeControl(homeControlDiv, map);

        homeControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(homeControlDiv);


        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }

        function showPosition(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            var myLatlng = new google.maps.LatLng(lat, lng);

            for (var i = 0, marker; marker = markers[i]; i++) {
                marker.setMap(null);
            }

            // For each place, get the icon, place name, and location.
            markers = [];

            var marker = createMarker(map, null, myLatlng);

            var infowindow = new google.maps.InfoWindow({
                content: "It is your location"
            });

            markers.push(marker);
            map.panTo(myLatlng);
            map.setZoom(15);

            google.maps.event.addListener(marker, 'mouseover', function() {
                infowindow.open(map, marker);
            });
            google.maps.event.addListener(marker, 'mouseout', function() {
                infowindow.close();
            });
        }

        function HomeControl(controlDiv, map) {

            // Set CSS styles for the DIV containing the control
            // Setting padding to 5 px will offset the control
            // from the edge of the map
            controlDiv.style.padding = '16px';

            // Set CSS for the control border
            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = 'white';
            controlUI.style.borderStyle = 'solid';
            controlUI.style.borderWidth = '1px';
            controlUI.style.cursor = 'pointer';
            controlUI.style.textAlign = 'center';
            controlUI.style.height = '32px';
            controlUI.title = 'Click to set the map to Home';
            controlDiv.appendChild(controlUI);

            // Set CSS for the control interior
            var controlText = document.createElement('div');
            controlText.style.fontFamily = 'Arial,sans-serif';
            controlText.style.fontSize = '12px';
            controlText.style.paddingLeft = '20px';
            controlText.style.paddingRight = '20px';
            controlText.style.paddingTop = '6px';
            controlText.innerHTML = '<b>Home</b>';
            controlUI.appendChild(controlText);

            // Setup the click event listeners: simply set the map to
            google.maps.event.addDomListener(controlUI, 'click', function() {
                getLocation();
            });
        }
    }
    //var _ = require('underscore'),
    //    $ = require('jquery'),
    //    dust = require('dust');
    //
    //require('vendor/jquery/images-loaded');
    //
    //function constructDimensions(size) {
    //    var borderWidth = 4;
    //
    //    size = size || 72;
    //    return {
    //        size: size,
    //        cx: 0.5 * size,
    //        cy: 0.5 * size,
    //        r: 0.5 * size,
    //        A: {
    //            x: size / 2 + borderWidth,
    //            y: size / 2 + borderWidth + Math.pow(2 * Math.pow(size / 2 + borderWidth, 2), 1/2)
    //        },
    //        B: {
    //            x: 0.23575 * size,
    //            y: 0.8075 * size
    //        },
    //        C: {
    //            x: 0.76425 * size,
    //            y: 0.8075 * size
    //        },
    //        innerStrokeWidth: 0.1,
    //        innerStrokeColor: '#ffffff'
    //    };
    //}
    //function Marker(opts) {
    //    var opts = opts || {};
    //
    //    this.opts = opts;
    //
    //    this.id = opts._id;
    //    this.zoom = opts.zoom;
    //    this.dimensions = constructDimensions(opts.size);
    //    this.position=opts.position;
    //    this.map=opts.map;
    //    this.shape=opts.shape;
    //    this.icon=opts.icon;
    //    this.optimized=opts.optimized;
    //    if (opts.map) {
    //        this.setMap(opts.map);
    //    }
    //
    //    this.$element = null;
    //    this.$elementWrapper = null;
    //}
    //Marker.initialize = function (opts) {
    //    var opts = opts || {},
    //        size = opts.size;
    //};
    //
    //Marker.prototype = _.create(google.maps.OverlayView.prototype, {
    //    constructor: Marker
    //});
    //_.assign(Marker.prototype, new function () {
    //
    //    this.getPosition = function () {
    //        if (this.opts.position instanceof google.maps.LatLng) {
    //            return this.opts.position;
    //        }
    //
    //        return new google.maps.LatLng(
    //            this.opts.position.lat,
    //            this.opts.position.lng
    //        );
    //    };
    //
    //    this.onAdd = function () {
    //        this.$elementWrapper = $('<div>');
    //        this.$elementWrapper.addClass('map-marker');
    //
    //        var self = this,
    //            $hover = $('<div>').addClass('marker-hover'),
    //            dimensions = this.dimensions;
    //
    //        dust.render('map/marker', _.assign({}, this.opts, {
    //            dimensions: dimensions
    //        }))
    //            .then(function (html) {
    //                var $element = $(html).prependTo(self.$elementWrapper);
    //
    //                self.$element = $element;
    //
    //                $element.eq(0)
    //                    .hover(function (e) {
    //                        self.$elementWrapper.find('.marker-hover')
    //                            .stop()
    //                            .fadeIn();
    //                    }, function (e) {
    //                        self.$elementWrapper.find('.marker-hover')
    //                            .stop()
    //                            .fadeOut();
    //                    });
    //
    //                if (self.opts.url) {
    //                    $element.eq(0).off('mousedown')
    //                        .on('mousedown', function (e) {
    //                            var $this = $(this);
    //
    //                            $this.data().mousedownInMarker = true;
    //                            $(window).off('mousemove.marker')
    //                                .on('mousemove.marker', function (e) {
    //                                    $this.data().mousedownInMarker = false;
    //                                });
    //                        })
    //                        .off('mouseup')
    //                        .on('mouseup', function (e) {
    //                            var $this = $(this);
    //
    //                            if ($this.data().mousedownInMarker) {
    //                                Backbone.history.navigate(self.opts.url, { trigger: true });
    //                            }
    //                        });
    //                }
    //
    //                if (self.opts.draggable) {
    //
    //                }
    //
    //                self.getPanes().overlayImage.appendChild(
    //                    self.$elementWrapper.get(0)
    //                );
    //            });
    //    };
    //
    //    this.draw = function () {
    //        var position = this.getProjection().fromLatLngToDivPixel(
    //                this.getPosition()
    //            ),
    //            dimensions = this.dimensions;
    //
    //        this.$elementWrapper
    //            .css('top', (position.y - dimensions.A.y))
    //            .css('left', (position.x - dimensions.A.x));
    //    };
    //
    //    this.onRemove = function () {
    //        this.$elementWrapper.remove();
    //        this.$elementWrapper = null;
    //        this.$element = null;
    //    };
    //
    //});
    var createMarker = function(map, icon, position){
        icon = icon || null;
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            shape:{ coords:[17,17,18],type:'circle'},
            icon:
            {
                url:'http://latte.lozi.vn/upload/images/1vtAFiOXC8vCwMtgrwSZO5kyOHcD3i5n-s-120.jpg',
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(50, 50)
            },

            optimized:false
        });
        return marker;
    }
    return googleMap;
});