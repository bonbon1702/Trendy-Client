/**
 * Created by tuan on 12/11/2014.
 */
(function (root, factory) {
    root.googleMap = factory(root);
})(this, function (root) {

    'use strict';
	var markerHome;
    var googleMap = {};

    var map, markers = [];
    //------------------------------------------Map init--------------------------------------------------------------
    googleMap.init = function (data, shop) {
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
				"featureType": "administrative",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#444444"
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
                        "color": "rgb(231, 231, 231)"
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
                        "color": "#46bcec"
                    },
					{ invert_lightness: true }
                ]
            }
        ];
        var mapOptions = {
            zoom: 12,
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
        };

        map = new google.maps.Map(document.getElementById('map'), mapOptions);

        googleMap.createMarker(shop);


        searchBox();
        homeButton(data['user_avatar']);
		//hideMap();
		google.maps.event.addDomListener($('[role=zoom-in]')[0], 'click', function () {
			map.setZoom(map.getZoom()+1);
		});
		google.maps.event.addDomListener($('[role=zoom-out]')[0], 'click', function () {
			map.setZoom(map.getZoom()-1);
		});
		google.maps.event.addDomListener($('[role=toggle-size]')[0], 'click', function () {
		var map = document.getElementById('map');
		var btn = $('[role=toggle-size]')[0];
		if (btn.style.transform=="rotate(180deg)")
			{
				map.style.height='308px';
				btn.style.transform= "";
			}
		else 
			{
				map.style.height='608px';
				btn.style.transform= "rotate(180deg)";
			}
		});
    }
    //----------------------------------------------------------------------------------------------------------------

    //--------------------------------------Search Button ----------------------------------------------------------
    var searchBox = function () {
		var defaultBounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(-33.8902, 151.1759),
		new google.maps.LatLng(-33.8474, 151.2631));
		
		var input = /** @type {HTMLInputElement} */(
			  document.getElementById('pac-input'));
		  var searchBox = new google.maps.places.SearchBox(
			/** @type {HTMLInputElement} */(input));

		  // Listen for the event fired when the user selects an item from the
		  // pick list. Retrieve the matching places for that item.
		  google.maps.event.addListener(searchBox, 'places_changed', function() {
			var places = searchBox.getPlaces();

			if (places.length == 0) {
                alert("No result that you want search");
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

			  // Create a marker for each place.
			  var marker = new google.maps.Marker({
				map: map,
				icon: image,
				title: place.name,
				position: place.geometry.location
			  });
			
			  markers.push(marker);
				//new CustomMarker(place.geometry.location,map,{marker_id:'12',product:'short',shop:'435 ha noi zzzzzzzzzzzzzzzzzzzzzzzzzzzzz'});
			  bounds.extend(place.geometry.location);
			}

			map.fitBounds(bounds);
            map.setZoom(15);
        });

        // Bias the SearchBox results towards places that are within the bounds of the
        // current map's viewport.
        google.maps.event.addListener(map, 'bounds_changed', function () {
            var bounds = map.getBounds();
            searchBox.setBounds(bounds);
        });
    }
    //----------------------------------------------------------------------------------------------------------------


    //--------------------------------------------Home Button---------------------------------------------------------
    var homeButton = function (icon) {
        // homeControlDiv = document.createElement('div');
        //var homeControl = new HomeControl(homeControlDiv, map);

        //homeControlDiv.index = 1;
        //map.controls[google.maps.ControlPosition.TOP_LEFT].push(homeControlDiv);
		// Setup the click event listeners: simply set the map to
		var controlUI = $('[role=current-location]')[0];
		google.maps.event.addDomListener(controlUI, 'click', function () {
			getLocation();
		});
		
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
			if (markerHome!= null)
			markerHome.setMap(null);

			var img_user= $('[alt="user"]')[0].src;
			if (img_user != undefined)
			markerHome = new CustomMarker(myLatlng,map,{marker_id:'myPos',shop:'It is your location',img:icon});
			else
			markerHome = new CustomMarker(myLatlng,map,{marker_id:'myPos',shop:'It is your location',img: icon});
			markerHome.setMap(map);

            map.setCenter(myLatlng);
        }

        function HomeControl(controlDiv, map) {

            // Set CSS styles for the DIV containing the control
            // Setting padding to 5 px will offset the control
            // from the edge of the map
            controlDiv.style.padding = '16px';

            // Set CSS for the control border
            var controlUI = document.createElement('div');
			controlUI.className = "btn-home";
            //controlUI.style.backgroundColor = 'white';
            //controlUI.style.borderStyle = 'solid';
            //controlUI.style.borderWidth = '1px';
            //controlUI.style.cursor = 'pointer';
            //controlUI.style.textAlign = 'center';
            //controlUI.style.height = '32px';
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

            
        }
    }
    //----------------------------------------------------------------------------------------------------------------



	//-----------------------------------------------Marker drawable----------------------------------------
	var markerDrawable;
	googleMap.addMyMarker = function () { 
			if (markerDrawable != null)  markerDrawable.setMap(null);
			//function that will add markers on button click
            markerDrawable = new google.maps.Marker({
				height: '30px',
                position:map.getCenter(),
                map: map,
                draggable:true,
                animation: google.maps.Animation.DROP,
                title:"Center of search fashion",
				zIndex:9999999,
				icon: "assets/img/images/marker/marker1.png",
            });
			markerDrawable.setMap(map);
			markerDrawable.setZIndex(google.maps.Marker.MAX_ZINDEX + 9);
        }
	googleMap.getPos = function () {
		return markerDrawable.getPosition();	
	}
	
	
	
	
	//----------------------------------------------------------------------------------------------------------------





	//-----------------------------------------------Create Marker shop on map----------------------------------------
	googleMap.createMarker = function (data) {
		var shop = data.data;
		for (var i = 0; i < data.length; i++) {
        //var marker =
		new CustomMarker(
						new google.maps.LatLng(data[i].lat, data[i].long),
						map,
						{	marker_id:data[i].id,
							name:data[i].name,
							address:data[i].address,
							img:data[i].image_url
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
			var name = "";
			var address = "";
			if (self.args.img != null && self.args.img != '') img = self.args.img;
			if (self.args.name != null && self.args.name != '') name = self.args.name;
			if (self.args.address != null && self.args.address != '') address = self.args.address;
            div.innerHTML ='<div class="marker"><img class="img-marker" '
                            +'src="'+img+'">'
							+'<div class="marker-hover">'    
							+'<a role="product">'
							+	name
							+'</a>'       
							+'<a role="shop">'+address+'</a></div></div>';
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

            if (self.args.marker_id != null && self.args.marker_id != '') {
            google.maps.event.addDomListener(div, "click", function(event) {
                window.location='/shop/'+self.args.marker_id;
                google.maps.event.trigger(self, "click");
            });}
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
    //----------------------------------------------------------------------------------------------------------------


    return googleMap;
});