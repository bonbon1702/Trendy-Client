/**
 * Created by tuan on 12/11/2014.
 */
(function (root, factory) {
    root.googleMap = factory(root);
})(this, function (root) {

    'use strict';

    var googleMap = {};

    var map, markers = [];

    googleMap.init = function (data) {

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
        var pos = new google.maps.LatLng(20.9875830,105.8316770);
		var pos2 = new google.maps.LatLng(21.0249399, 105.8457613);
		new CustomMarker(pos,map,{marker_id:'123',product:'shirt',shop:'123 ha noi xxxxxxxxxxxxxxxxxxxxxxxxxxxx'});
		new CustomMarker(pos2,map,{marker_id:'12',product:'short',shop:'435 ha noi zzzzzzzzzzzzzzzzzzzzzzzzzzzzz'});
        //new CustomMarker.prototype.remove();
        createMarker(map,null,pos);
        //alert(data.length);
        //createMarker(map,null,new google.maps.LatLng(21.0226967,105.8369637,13),'Ha Noi','dep');
        //createMarker(map,icon,new google.maps.LatLng(21.0277866,105.812223,13));
        //for (var i = 0; i < data.length; i++) {
        //    var image = {
        //        url: data[i].image_url,
        //        size: new google.maps.Size(71, 71),
        //        origin: new google.maps.Point(0, 0),
        //        anchor: new google.maps.Point(17, 34),
        //        scaledSize: new google.maps.Size(25, 25)
        //    };
        //    alert(data[i].name);
        //    createMarker(map, null, new google.maps.LatLng(data[i].lat , data[i].long),data[i].name);
        //    //markers.push(marker);
        //}
        //map.panTo(new google.maps.LatLng(data[0].lat, data[0].lang));

        searchBox();
        homeButton();
    }

    var searchBox = function () {
        var input = /** @type {HTMLInputElement} */ (
            document.getElementById('pac-input'));
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        var searchBox = new google.maps.places.SearchBox(
            /** @type {HTMLInputElement} */
            (input));
        // Listen for the event fired when the user selects an item from the
        // pick list. Retrieve the matching places for that item.
        google.maps.event.addListener(searchBox, 'places_changed', function () {
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
        google.maps.event.addListener(map, 'bounds_changed', function () {
            var bounds = map.getBounds();
            searchBox.setBounds(bounds);
        });
    }

    var homeButton = function () {
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

            google.maps.event.addListener(marker, 'mouseover', function () {
                infowindow.open(map, marker);
            });
            google.maps.event.addListener(marker, 'mouseout', function () {
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
            google.maps.event.addDomListener(controlUI, 'click', function () {
                getLocation();
            });
        }
    }
	var createMarker = function (map, icon, position) {
        icon = icon || null;
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            shape: {coords: [17, 17, 18], type: 'circle'},
            //icon: {
            //   url: 'http://latte.lozi.vn/upload/images/1vtAFiOXC8vCwMtgrwSZO5kyOHcD3i5n-s-120.jpg',
            //    size: new google.maps.Size(71, 71),
            //   origin: new google.maps.Point(0, 0),
            //    anchor: new google.maps.Point(17, 34),
            //   scaledSize: new google.maps.Size(50, 50)
            //},

            optimized: false
        });
        return marker;
    }
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

            div.className = 'heart';

            div.style.position = 'absolute';
            div.style.cursor = 'pointer';
            //div.id='heart';
            div.innerHTML ='<img class="img-marker" '
                            +'src="http://latte.lozi.vn/upload/images/1vtAFiOXC8vCwMtgrwSZO5kyOHcD3i5n-s-120.jpg">'
							+'<div class="marker-hover bg-dark">'    
							+'<a href="/mon-an/lau-buffet" role="product">'
							+	self.args.product
							+'</a>'       
							+'<a href="/nha-hang/gyu-jin-vincom-a-171-dong-khoi-p-ben-nghe-quan-1-tp-hcm-15" role="shop">'+self.args.shop+'</a></div>';
            div1 = this.div = document.createElement('div');

            div1.className = 'pulse';

            div1.style.position = 'absolute';
            div1.style.cursor = 'pointer';
            if (typeof(self.args.marker_id) !== 'undefined') {
                div.dataset.marker_id = self.args.marker_id;
                div1.dataset.marker_id = self.args.marker_id;
            }

            google.maps.event.addDomListener(div, "click", function(event) {
                alert('You clicked on a custom marker!');
                google.maps.event.trigger(self, "click");
            });
            var panes = this.getPanes();
            panes.overlayImage.appendChild(div);
            panes.overlayImage.appendChild(div1);
            //panes.overlayImage.appendChild('<div class="pulse"></div>');
        }

    var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

    if (point) {
        div.style.left = (point.x -50) + 'px';
        div.style.top = (point.y -80) + 'px';
		
        div1.style.left = (point.x+5) + 'px';
        div1.style.top = (point.y-12) + 'px';
    }
    };

    CustomMarker.prototype.remove = function() {
        if (this.div) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
        }
    };

    CustomMarker.prototype.getPosition = function() {
        return this.latlng;
    };
    return googleMap;
});