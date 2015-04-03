var locations = [
    {
        name: 'Newport Rental Office',
        myLat: 40.726820,
        myLng: -74.033282,
        photo: 'img/newportrentals.jpg'
    },

    {
        name: 'Newport Mall',
        myLat: 40.727662,
        myLng: -74.038607,
        photo: 'img/newportmall.jpg'
    },

    {
        name: 'The National September 11 Memorial & Museum',
        myLat: 40.713160,
        myLng: -74.013365,
        photo: 'img/911 memorial.jpg'
    },

     {
         name: 'Holland Tunnel',
         myLat: 40.727416,
         myLng: -74.021116,
         photo: 'img/holland.jpg'
     },

     {
         name: 'Path Train',
         myLat: 40.726690,
         myLng: -74.034464,
         photo: 'img/path.jpg'
     },

     {
         name: 'US Post Office',
         myLat: 40.716313,
         myLng: -74.036905,
         photo: 'img/postoffice.jpg'
     }
]


var Place = function (data) {
    this.name = ko.observable(data.name);
    this.myLat = data.myLat;
    this.myLng = data.myLng;
    this.marker = data.marker;
    this.position = data.position;
    this.address =ko.observable(data.address);
    this.photo = data.photo;
    this.content = data.content;
    this.icon = data.icon;
    this.type = data.types;
}

var ViewModel = function () {
    var self = this;
    var map;
    var markers = [];
    var infoBoxes = [];
    var newport = new google.maps.LatLng(40.722576, -74.035428);
    self.placeList = ko.observableArray([]);
    self.impPlaceList = ko.observableArray([]);
    self.searchTerm = ko.observable('restaurant');
    self.couponList = ko.observableArray([]);
    self.filter = ko.observable('');
    self.filterDeal = ko.observable('');

   
    self.filteredItems = ko.computed(function () {
        var filter = this.filter().toLowerCase();
        if (!filter) {
            return self.placeList();
        } else {
            return ko.utils.arrayFilter(self.placeList(), function (item) {
                var results = (item.name().toLowerCase().indexOf(filter) !== -1) || (item.address().toLowerCase().indexOf(filter) !== -1);
                return results;
            });
        }
    }, self);

    self.filteredDeals = ko.computed({
        read: function () {
            var filter = this.filterDeal().toLowerCase();
            if (!filter) {
                return self.couponList();
            } else {
                return ko.utils.arrayFilter(self.couponList(), function (item) {
                    var results = (item.name().toLowerCase().indexOf(filter) !== -1) || (item.address().toLowerCase().indexOf(filter) !== -1);

                    return results;
                });
            }
        }
    }, self);
    self.togglePlacesMarkers = ko.dependentObservable(function () {
        //find out the categories that are missing from uniqueNames
        var differences = ko.utils.compareArrays(self.placeList(), self.filteredItems());
        //return a flat list of differences
        var results = [];
        var retained = [];
        ko.utils.arrayForEach(differences, function (difference) {
            if (difference.status === "deleted") {
                results.push(difference.value);
            }
            else if (difference.status === "retained") {
                retained.push(difference.value);
            }
        });

        for (i = 0; i < results.length; i++) {
            var place = results[i];
            place.marker.setMap(null);
        };

        for (i = 0; i < retained.length; i++) {
            var place = retained[i];
            place.marker.setMap(map);
        };

        return results;
    }, self);

    self.toggleDealsMarkers = ko.dependentObservable(function () {
        //find out the categories that are missing from uniqueNames
        var differences = ko.utils.compareArrays(self.couponList(), self.filteredDeals());
        //return a flat list of differences
        var results = [];
        var retained = [];
        ko.utils.arrayForEach(differences, function (difference) {
            if (difference.status === "deleted") {
                results.push(difference.value);
            }
            else if (difference.status === "retained") {
                retained.push(difference.value);
            }
        });

        for (i = 0; i < results.length; i++) {
            var place = results[i];
            place.marker.setMap(null);
        };

        for (i = 0; i < retained.length; i++) {
            var place = retained[i];
            place.marker.setMap(map);
        };

        return results;
    }, self);

    self.clickMarker = function (place) {
        map.panTo(place.position);
        place.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () { stopBounce(place); }, 4000);
    }

    self.showMarkers = function () {
        for (i = 0; i < self.filteredItems().length; i++) {
            var marker = self.filteredItems()[i].marker;
            marker.setMap(map);
        };
    }

    self.hideMarkerDeals = function () {
        for (i = 0; i < self.couponList().length; i++) {
            var marker = self.couponList()[i].marker;
            marker.setVisible(false);
        };
        for (i = 0; i < self.filteredDeals().length; i++) {
            var markerb = self.filteredDeals()[i].marker;
            markerb.setVisible(true);
        };
    }

    function stopBounce(place) {
        place.marker.setAnimation(null);
    }

    function initialize() {
        var mapOptions = {
            zoom: 15,
            center: newport,
            draggablecursur: null,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_CENTER
            },
            panControl: true,
            panControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            },
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.LEFT_TOP
            },
            scaleControl: true,  // fixed to BOTTOM_RIGHT
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            }
        };
        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
        var request = {
            location: newport,
            radius: 2500,
            query: self.searchTerm()
        };
        var couponList = (document.getElementById('couponList'));
        map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(couponList);
        var impList = (document.getElementById('impList'));
        map.controls[google.maps.ControlPosition.RIGHT_TOP].push(impList);
        var list = (document.getElementById('list'));
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(list);
        var input = (document.getElementById('search-input'));
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        var searchBox = new google.maps.places.SearchBox(
          (input));

        var service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);
        searchListener(searchBox);
        getDeals();
        setImpPlaces();
    }

    function callback(results, status) {
        var service = new google.maps.places.PlacesService(map);
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                var search = {
                    placeId: place.place_id
                };
                service.getDetails(search, callbackDetails);
            }
        }
    }

    function callbackDetails(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            place.address = place.formatted_address;
            place.phone = place.formatted_phone_number;
            place.position = place.geometry.location;
            if (place.reviews) {
                place.review = place.reviews[0].text;
                //for (i = 0; i > place.reviews.length; i++) {
                //    var fullReviews = place.reviews[i];
                //var rev = fullReviews.aspect[0].rating;
                //var tev = fullReviews.aspect[0].type;
                //console.log(rev + tev);
                //}
            }
            if (place.photos) {
                place.photo = place.photos[0].getUrl({ 'maxWidth': 200, 'maxHeight': 200 });
            }
            place.content = '<div id="infobox"><img src="' + place.photo + '"><p>' + place.name + '</p><p>' + place.phone + '</p><p>' + place.address + '</p><p> Avg. Rating:' + place.rating + '</p><p>' + place.review + '</p></div>'
            place.icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            place.marker = createSearchMarker(place);
            self.placeList.push(new Place(place));
            markerListener(place);
        }
    }

    function createSearchMarker(place) {
        var marker = new google.maps.Marker({
            map: map,
            position: place.position,
            animation: google.maps.Animation.DROP,
            icon: place.icon
          
            
        });
        //marker.setVisible(false);
        return marker;
        markers.push(marker);
    }

    function markerListener(place) {
        google.maps.event.addListener(place.marker, 'click', function () {
            closeAllBoxes();
            infoBox = new InfoBox({
                content: place.content,
                disableAutoPan: false,
                maxWidth: 150,
                pixelOffset: new google.maps.Size(-140, 0),
                zIndex: null,
                boxStyle: {
                    background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
                    opacity: 0.75,
                    width: "280px"
                },
                closeBoxMargin: "12px 4px 2px 2px",
                closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
                infoBoxClearance: new google.maps.Size(1, 1)
            });
            infoBoxes.push(infoBox);
            infoBox.open(map, this);
            setTimeout(function () { infoBox.close(); }, 10000);
        });
    }

    function searchListener(searchBox) {
        var service = new google.maps.places.PlacesService(map);

        google.maps.event.addListener(searchBox, 'places_changed', function () {
            var bounds = map.getBounds();
            var input = $('#search-input').val();
            var request = {
                location: newport,
                radius: 2000,
                query: input
            };
            removeMarkers(self.placeList);
            removeMarkers(self.couponList)
            self.placeList.removeAll();
            self.couponList.removeAll();
            getDeals();
            service.textSearch(request, callback);
            map.fitBounds(bounds);
            map.setZoom(15);
        });
        google.maps.event.addListener(map, 'bounds_changed', function () {
            var bounds = map.getBounds();
            searchBox.setBounds(bounds);
        });
    }

    function getDeals() {

        // load wikipedia data
        var couponsUrl = 'http://api.8coupons.com/v1/getdeals?key=aa790cd6591f41e79107106f31e1f7ac7e49e42b87087d2b01ad22925d563beb6e24f8a729609425014d48c126143c40&zip=07310&mileradius=2&limit=8';
        //var wikiRequestTimeout = setTimeout(function () {
        //    $wikiElem.text("failed to get wikipedia resources");
        //}, 8000);

        $.ajax({
            url: couponsUrl,
            dataType: "jsonp",
            //jsonp: "callback",
            success: function (response) {
                for (var i = 0; i < response.length; i++) {
                    var coupon = response[i];
                    getDealPlaces(coupon);
                };

                // clearTimeout(wikiRequestTimeout);
            }
        });
    }

    function getDealPlaces(coupon) {
        var lat = coupon.lat;
        var lng = coupon.lon;
        coupon.position = new google.maps.LatLng(lat, lng);
        var title = coupon.name;
        coupon.icon = 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png';
        coupon.photo = coupon.showImageStandardSmall;
        coupon.address = coupon.address + '<br/>' + coupon.city + ', ' + coupon.state;

        coupon.marker = createSearchMarker(coupon);
        coupon.content = '<div id="infobox"><img src="' + coupon.photo + '"><p>' + coupon.name + '</p><p>' + coupon.phone + '</p><p>' + coupon.address + '</p><p> Coupon:<br/>' + coupon.dealTitle + '</p><p> Savings: $' + coupon.dealSavings + '</p></div>';
        self.couponList.push(new Place(coupon));
        markerListener(coupon);
    }

    function setImpPlaces() {
        for (i = 0; i < locations.length; i++) {
            var place = locations[i];
            place.position = new google.maps.LatLng(place.myLat, place.myLng);
            place.icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            place.marker = createSearchMarker(place);
            place.content = '<div id="infobox"><img class="photo" src="' + place.photo + '"><p>' + place.name + '</p></div>'
            self.impPlaceList.push(new Place(place));
            markerListener(place);
        }
    }

    function closeAllBoxes() {
        //remove all markers from map
        for (var i = 0; i < infoBoxes.length; i++) {
            infoBoxes[i].close();
        }
    }

    function removeMarkers(list) {
        //remove all markers from map
        for (var i = 0; i < list().length; i++) {
            var marker = list()[i].marker;
            marker.setVisible(false);
        }
    }

    google.maps.event.addDomListener(window, 'load', initialize);


}

ko.applyBindings(new ViewModel());