// Start of Maphorm plugin
(function ( $ ) {
 
 	// Initialize the plugin
    $.fn.maphorm = function( options ) {

        // Merge options with default settings
        var settings = $.extend({
        	// Option to show the marker when the user clicks on the map
            showMarker: true,
            // Zoom level of the map instance
            zoom: 16,
            // Default location for center in case the geolocation doesn't works
            defaultLocation: {lat: 26.12295, lng: -80.17122},
            // Location defined by the user to not use the geolocation
            location: false,
            // Marker in the initial position
            initialMarker: false,
            // Selector for the marker cleaner
            markerCleaner: false
        }, options );

        // Variable to keep the context
        var context = this;

        // Variable to store the map
        var map;
        // Variable to store the markers in the map
        var markers = [];

        var methods = {
        	// Function to initilize the plugin
        	init: function(){

        		// By default the coords are the defaultLocation
	        	var coords = settings.defaultLocation;

	        	// If the user had set some location
	        	if(settings.location){
	        		// Use it as coords for the map
	        		coords = settings.location;
	        		// Draw the map
	        		methods.drawMaps(coords);
	        	}else{
	        		// If there isn't a defined location try to use the geolocalization
	        		if (navigator.geolocation) {
	        			// Get the position and use a function to transform the position in coords
				        navigator.geolocation.getCurrentPosition(methods.transformPosition);
				    }else{
				    	// If the browser doesn't support geolocalization draw the normal map
				    	methods.drawMaps(coords);
				    }
	        	}

	        	// If there is a selector passed to be a marker cleaner
	        	if(settings.markerCleaner){
	        		// Attach a click event in this selector
	        		$(settings.markerCleaner).click(function(event) {
	        			// Call the method that cleans the markers
	        			methods.clearMarkers();
	        		});
	        	}
        		
			},
			// Function to draw the map on the elements
			drawMaps: function(coords){

				// For each element that was in the selector
		        $(context).each(function(index, el) {

		        	// Define the options for Google Maps using 
		        	var opts = {
		        		// Center position of the map
		        		'center': new google.maps.LatLng(coords), 
		        		// Zoom level of the map
		        		'zoom': settings.zoom, 
		        		// Type of the map
		        		'mapTypeId': google.maps.MapTypeId.ROADMAP 
		        	}
		        	// Create the map
				    map = new google.maps.Map(el, opts);
				    // Variable to use in case that the plugin is instancied in more than one element
				    var additionalIndex = "";
				    // If it isn't the first element
				    if(index > 0){
				    	// Add the index in the end of the name attribute for the input elements
				    	additionalIndex = "-" + index;
				    }

				    // Append the latitude hidden element
				    $(el).append('<input type="hidden" name="latitude' + additionalIndex + '">');
				    // Append the longitude hidden element
				    $(el).append('<input type="hidden" name="longitude' + additionalIndex + '">');
				    
				    // Create the variable used for the marker
		        	var marker;

		        	// If it is set to show the marker in the initial position
		        	if(settings.initialMarker){
		        		marker = new google.maps.Marker({
	                        position: coords,
	                        map: map,
	                        draggable: false
	                    });	  
	                    // Put the marker in the markers array                  
	                    markers.push(marker);

	                    // Set the latitude value in the correct hidden input
		                $('input[name="latitude' + additionalIndex +'"]').val(coords.lat);
		                // Set the longitude value in the correct hidden input
		                $('input[name="longitude' + additionalIndex +'"]').val(coords.lng);
		        	}

				    // Adds a listener for click event that handdles all the magic for the marker appearing at the right position
				    google.maps.event.addListener(map, 'click', function(event) {
				    	// If the marker isn't created then creates it
		                if(!marker){
		                	// Creates the marker at the clicked position
		                    marker = new google.maps.Marker({
		                        position: event.latLng,
		                        map: map,
		                        draggable: false
		                    });
		                    // Put the marker in the markers array
		                    markers.push(marker);
		                }else{
		                	// Set the map in the marker to be sure that it will appear
		                	marker.setMap(map);
		                	// If already exists a marker then just set its new position
		                    marker.setPosition(event.latLng);
		                }

		                // Set the latitude value in the correct hidden input
		                $('input[name="latitude' + additionalIndex +'"]').val(event.latLng.lat());
		                // Set the longitude value in the correct hidden input
		                $('input[name="longitude' + additionalIndex +'"]').val(event.latLng.lng());
		                
		            });

		        });
			},
			// Function that transform a position element in the coords format
			transformPosition: function(position){

				// Variable that will be passed as parameter
				var coords = {
					// Latitude
					lat: position.coords.latitude,
					// Longitude
					lng: position.coords.longitude
				}

				// Call the method that draws the map
				methods.drawMaps(coords);
				
			},
			// Function to clear the markers in the map
			clearMarkers: function() {
				// Iterate in the markers and set their map as null to exclude them
				for (var i = 0; i < markers.length; i++) {
					// Set the marker map as null
					markers[i].setMap(null);
				}
			}
        }

        // Call the init method
        methods.init(this);
 
    };
 
}( jQuery ));
// End of Maphorm plugin











