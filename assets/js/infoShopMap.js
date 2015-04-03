/**
 * Created by Nam on 12/3/2015.
 */

(function (root, factory) {
    root.infoShopMap = factory(root);
})(this, function (root) {

    'use strict';
    var markerHome;
    var infoShopMap = {};

    var map, markers = [];

    infoShopMap.init = function (dataShop) {
        //console.log(data);
        var haNoiLocation = new google.maps.LatLng(21.0249399, 105.8457613);
        var myStyles = [
            {
                "featureType": "administrative.country",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "administrative.province",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "administrative.neighborhood",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#e0efef"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "off"
                    },
                    {
                        "hue": "#1900ff"
                    },
                    {
                        "color": "#c0e8e8"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 100
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "off"
                    },
                    {
                        "lightness": 700
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#7dcdcd"
                    }
                ]
            }
        ];
        var mapOptions = {
            zoom: 15,
            center: haNoiLocation,
            panControl: false,
            zoomControl: true,
            scaleControl: false,
            streetViewControl: false,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: myStyles,
            disableDefaultUI: true,
            disableDoubleClickZoom: true
        }

        map = new google.maps.Map(document.getElementById('map'), mapOptions);

    }


    infoShopMap.createMarker = function (data) {
        var shop = data.data;
        for (var i = 0, marker; marker = shop[i]; i++) {
            //var marker =
            new CustomMarker(
                new google.maps.LatLng(data.data[i].lat, data.data[i].long),
                map,
                {	marker_id:data.data[i].id,
                    product:data.data[i].name,
                    shop:data.data[i].address,
                    img:data.data[i].image_url_resize
                });
        }
    };
    // Hàm đánh dấu lên bản đồ từ 1 đối tượng địa điểm place
    function CustomMarker(latlng, map, args) {
        this.latlng = latlng;
        this.args = args;
        this.setMap(map);
    }

    CustomMarker.prototype = new google.maps.OverlayView();

    CustomMarker.prototype.draw = function() {

        var self = this;

        var div = this.div;
        var div1 = this.div;
        if (!div) {

            div = this.div = document.createElement('div');

            div.className = 'map-marker';

            div.style.position = 'absolute';
            div.style.cursor = 'pointer';
            //div.id='heart';
            var img = "";
            var product = "";
            var shop = "";
            if (self.args.img != null && self.args.img != '') img = self.args.img;
            if (self.args.product != null && self.args.product != '') product = self.args.product;
            if (self.args.shop != null && self.args.product != '') shop = self.args.shop;
            div.innerHTML ='<div class="marker"><img class="img-marker" '
            +'src="'+img+'">'
            +'<div class="marker-hover">'
            +'<a href="" role="product">'
            +	product
            +'</a>'
            +'<a href="" role="shop">'+shop+'</a></div></div>';
            div1 = document.createElement('div');

            div1.className = 'pulse';
            div1.style.top = '72px'
            div1.style.left = '47px'
            div1.style.position = 'absolute';
            div1.style.cursor = 'pointer';
            if (typeof(self.args.marker_id) !== 'undefined') {
                div.dataset.marker_id = self.args.marker_id;
                div1.dataset.marker_id = self.args.marker_id;
            }

            google.maps.event.addDomListener(div, "click", function(event) {
                alert('You clicked on a shop!');
                google.maps.event.trigger(self, "click");
            });
            var panes = this.getPanes();
            //panes.overlayImage.appendChild(div1);
            div.appendChild(div1);
            panes.overlayImage.appendChild(div);
            //panes.overlayImage.appendChild('<div class="pulse"></div>');
        }

        var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

        if (point) {
            div.style.left = (point.x -42) + 'px';
            div.style.top = (point.y -86) + 'px';

            //div1.style.left = (point.x+5) + 'px';
            //div1.style.top = (point.y-12) + 'px';
        }
    };

    CustomMarker.prototype.remove = function() {
        if (this.div) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
        }
        if (this.div1) {
            this.div1.parentNode.removeChild(this.div1);
            this.div1 = null;
        }
    };

    CustomMarker.prototype.getPosition = function() {
        return this.latlng;
    };
    return infoShopMap;
});