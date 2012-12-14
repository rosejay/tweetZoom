// map style!
var styleIndex = Math.floor((Math.random()*5));

function initTip(level){

	$(".systemTip").css("display", "none");
	if(level !=2){
		$(".systemTip").fadeIn(150).css("background-color", borderColor[styleIndex]).delay(1000).fadeOut(150);
	}
}

function generateMarker(level, feeds, map, bounds) {

	initTip(level);
	
	var mapstyle = styles[styleIndex];
	// attach map style!!
	map.setOptions({styles: mapstyle});
	$("#level-" + level + ".canvasBox").css("border-top", "5px solid "+borderColor[styleIndex]);
	$("#level-" + level + ".canvasBox").addClass("style"+styleIndex);

	var markers = [];

	var s, w, n, e; // south 
	if (typeof bounds !== "undefined") {
		var sw = bounds.getSouthWest();
		var ne = bounds.getNorthEast();
		s = sw.lat();
		w = sw.lng();
		n = ne.lat();
		e = ne.lng();
		//console.log(sw.lat(), sw.lng(), ne.lat(), ne.lng());
		//console.log(sw, ne);
	}
	//var tempcanvas = document.createElement('canvas');
	//processingInstance = new Processing(tempcanvas, drawObj);


	// markers for level 0
	if (level == 0) {
		
		/*  cluster!!
			for (var i = 0; i < feeds.length; i++) {

				var x = feeds[i].lat; // lat vertical
			var y = feeds[i].lng; // lng horizontal
			var content = feeds[i].content;
			var username = feeds[i].username;

			var latLng = new google.maps.LatLng(feeds[i].lat, feeds[i].lng);
			var marker = new google.maps.Marker({'position': latLng});
			markers.push(marker);
		}
		var markerCluster = new MarkerClusterer(map, markers);
		*/

		for (var i = 0; i < feeds.length; i++) {

			var x = feeds[i].lat; // lat vertical
			var y = feeds[i].lng; // lng horizontal

			if (x != 0 || y != 0) {

				var image = new google.maps.MarkerImage(markerimage[styleIndex],
									new google.maps.Size(20, 20), 
									new google.maps.Point(0,0), 
									new google.maps.Point(10, 10));

				
				var content = feeds[i].content;
				var username = feeds[i].username;

				var txt = username + ": " + content;
				var point = new google.maps.LatLng(x, y); 

			    var marker = new google.maps.Marker({
			       position: point,
			       map: map,
			       title: txt,
			       icon: image
			    });

			}
		}
	}

			/*  normal marker

			var txt = username + ": " + content;
			var point = new google.maps.LatLng(x, y);
			new google.maps.Marker({
			   position: point,
			   map: map,
			   title: txt
			});

			*/
	//markers for level 1
	else if (level == 1) {

		for (var i = 0; i < feeds.length; i++) {

			var x = feeds[i].lat; // lat vertical
			var y = feeds[i].lng; // lng horizontal

			if (x != 0 || y != 0) {

				if (x <= n && x >= s && y <= e && y >= w) { // if the point is in the area

					var content = feeds[i].content;
					var username = feeds[i].username;

					var x = feeds[i].lat; // lat vertical
					var y = feeds[i].lng; // lng horizontal
					var content = feeds[i].content;
					var username = feeds[i].username;

					var latLng = new google.maps.LatLng(feeds[i].lat, feeds[i].lng);
					var marker = new google.maps.Marker({'position': latLng});
					markers.push(marker);
			
				}

			}

		}// end for
		var markerCluster = new MarkerClusterer(map, markers,{
			gridSize: 20,
			minimumClusterSize: 1,
			styles: markerstyles[styleIndex]
        });

	}
	
    //markers for level 2
    else if (level == 2) {

    	for (var i = 0; i < feeds.length; i++) {
    		
    		var x = feeds[i].lat; // lat vertical
			var y = feeds[i].lng; // lng horizontal

			if (x != 0 || y != 0) {

		        if (x <= n && x >= s && y <= e && y >= w) { // if the point is in the area
		        	
		        	var content = feeds[i].content;
					var username = feeds[i].username;

					// normal marker
					var image = new google.maps.MarkerImage(markerimage[styleIndex],
									new google.maps.Size(20, 20), 
									new google.maps.Point(0,0), 
									new google.maps.Point(10, 10));

					var txt = username + ": " + content;
					var point = new google.maps.LatLng(x, y); 

				    var marker = new google.maps.Marker({
				       position: point,
				       map: map,
				       title: txt,
				       icon: image
				    });
				    //end normal marker


		            overlay = new google.maps.OverlayView();
		            overlay.draw = function () {};
		            overlay.setMap(map);
		            var latlng = new google.maps.LatLng(x, y);
		            var containerPixel = overlay.getProjection().fromLatLngToContainerPixel(latlng);
		            //var point = map.getProjection().fromLatLngToPoint(latlng);

		            var tempcanvas = document.createElement('canvas');
		    		processingInstance = new Processing(tempcanvas, drawObj);
		    		$(tempcanvas).css("top", containerPixel.y+"px")
		    					.css("left", containerPixel.x+"px")
		    					.addClass("tweetCanvas");


					function drawObj(processing){

						var borderWidth = 40;
						var fontSize = 27;
			    		var lineHeight = 36;
			   			var strokeWeight = 1;
			    		var corner = 10;
						var canvasWidth = 600;
						var canvasHeight = (parseInt(content.length/40) + 2) * lineHeight + borderWidth*2;
						var triWidth = 40;
						var div = 0;

						var colorBG = [ processing.color(75,75,75),
										processing.color(229, 75, 75),
										processing.color(68, 102, 157),
										processing.color(111, 168, 88),
										processing.color(255, 153, 0)];

						var fontColor = processing.color[255,255,255];

						processing.size(canvasWidth, canvasHeight + triWidth);
						processing.background(255,255,255,0);

						processing.fill( colorBG[styleIndex] );
						processing.stroke( colorBG[styleIndex] );
						processing.strokeWeight(strokeWeight);
						processing.rect(strokeWeight, strokeWeight, canvasWidth-strokeWeight*2, canvasHeight-strokeWeight*2, 
										corner, corner, corner, corner);

						processing.fill(fontColor);
						processing.noLoop();


						var font = processing.loadFont("css/Helvetica Bold.Ttf"); 
						processing.textFont(font, fontSize); 
						processing.textLeading(lineHeight);

						processing.text(username, borderWidth, borderWidth, 
										canvasWidth - borderWidth*2, canvasHeight - borderWidth*2);


						var font = processing.loadFont("css/Helvetica.Ttf"); 
						processing.textFont(font, fontSize); 
						processing.textLeading(lineHeight);

						processing.text(content, borderWidth, borderWidth + lineHeight, 
										canvasWidth - borderWidth*2, canvasHeight - borderWidth*2);

						processing.fill( colorBG[styleIndex] );
						processing.stroke( colorBG[styleIndex] );

						processing.beginShape();
						processing.vertex((canvasWidth-triWidth)/2, canvasHeight-strokeWeight*2 -div);
						processing.vertex((canvasWidth-triWidth)/2 + triWidth, canvasHeight-strokeWeight*2 -div);
						processing.vertex((canvasWidth-triWidth)/2, canvasHeight-strokeWeight*2 + triWidth -div);
						processing.endShape();

						/*
						processing.stroke(255,255,205);
						processing.line( (canvasWidth-triWidth)/2, canvasHeight-strokeWeight*2,
										(canvasWidth-triWidth)/2 + triWidth, canvasHeight-strokeWeight*2 );
						processing.line( (canvasWidth-triWidth)/2 + triWidth, canvasHeight-strokeWeight*2,
										 (canvasWidth-triWidth)/2, canvasHeight-strokeWeight*2 + triWidth -div );
						processing.line( (canvasWidth-triWidth)/2, canvasHeight-strokeWeight*2 + triWidth -div,
										 (canvasWidth-triWidth)/2, canvasHeight-strokeWeight*2);
						*/
					
						$(tempcanvas).css("margin-top",-canvasHeight-triWidth + "px");
						$(tempcanvas).css("margin-left",-canvasWidth/2 + triWidth/2 + "px");

						$("#level-" + level).append(tempcanvas);
					}// end draw

				}// end point is in area
			}// end x y == 0
		}// end for

		playMarker(level);
	}// end level 2	



/*
            content = content.replace(searchTopic, '<span>'+searchTopic+'</span>');

            var mark = "<div class='spot-2' style='top:"+containerPixel.y+"px; left:"+containerPixel.x+"px'>\
						<div class='spot-2-inner'>\
							<p><span><a href='http://twitter.com/"+ username +"'>"+ username +"</a>: </span>\
							"+ content +"</p>\
						</div>\
						<div class='tri'></div>\
					</div>";


            //var mark = "<div class='spot' style='top:" + containerPixel.y + "px;left:" + containerPixel.x + "px'><div class='spot-inner'></div></div>";
            $("#level-" + level + "-" + index).append(mark);
            */

				/*
				var url = tempcanvas.toDataURL();
				//var bounds = generateBounds(x,y,100,40);
				var swBound = new google.maps.LatLng(x,y);
				var neBound = new google.maps.LatLng(x,y);
				var bounds = new google.maps.LatLngBounds(swBound, neBound);

				var overlay ;
				USGSOverlay.prototype = new google.maps.OverlayView();
				overlay = new USGSOverlay(bounds, url, map);

				function USGSOverlay(bounds, image, map) {

					// Now initialize all properties.
					this.bounds_ = bounds;
					this.image_ = image;
					this.map_ = map;

					// We define a property to hold the image's
					// div. We'll actually create this div
					// upon receipt of the add() method so we'll
					// leave it null for now.
					this.div_ = null;

					// Explicitly call setMap() on this overlay
					this.setMap(map);
				}


				USGSOverlay.prototype.onAdd = function() {

					// Note: an overlay's receipt of onAdd() indicates that
					// the map's panes are now available for attaching
					// the overlay to the map via the DOM.

					// Create the DIV and set some basic attributes.
					var div = document.createElement('div');
					div.style.border = "none";
					div.style.borderWidth = "0px";
					div.style.position = "absolute";

					// Create an IMG element and attach it to the DIV.
					var img = document.createElement("img");
					img.src = this.image_;
					img.style.width = "100%";
					img.style.height = "100%";
					div.appendChild(img);

					// Set the overlay's div_ property to this DIV
					this.div_ = div;

					// We add an overlay to a map via one of the map's panes.
					// We'll add this overlay to the overlayImage pane.
					var panes = this.getPanes();
					panes.overlayLayer.appendChild(div);
				}
				USGSOverlay.prototype.draw = function() {

					// Size and position the overlay. We use a southwest and northeast
					// position of the overlay to peg it to the correct position and size.
					// We need to retrieve the projection from this overlay to do this.
					var overlayProjection = this.getProjection();

					// Retrieve the southwest and northeast coordinates of this overlay
					// in latlngs and convert them to pixels coordinates.
					// We'll use these coordinates to resize the DIV.
					var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
					var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

					// Resize the image's DIV to fit the indicated dimensions.
					var div = this.div_;
					div.style.left = sw.x + 'px';
					div.style.top = ne.y + 'px';
					div.style.width = (ne.x - sw.x) + 'px';
					div.style.height = (sw.y - ne.y) + 'px';
				}
				USGSOverlay.prototype.onRemove = function() {
					this.div_.parentNode.removeChild(this.div_);
					this.div_ = null;
				}
				// Note that the visibility property must be a string enclosed in quotes
				USGSOverlay.prototype.hide = function() {
					if (this.div_) {
						this.div_.style.visibility = "hidden";
					}
				}

				USGSOverlay.prototype.show = function() {
					if (this.div_) {
						this.div_.style.visibility = "visible";
					}
				}

				USGSOverlay.prototype.toggle = function() {
					if (this.div_) {
						if (this.div_.style.visibility == "hidden") {
							this.show();
						} else {
							this.hide();
						}
					}
				}

				USGSOverlay.prototype.toggleDOM = function() {
					if (this.getMap()) {
						this.setMap(null);
					} else {
						this.setMap(this.map_);
					}
				}
	*/


   
}

$(".tweetCanvas").live({
	mouseenter: function(){
		$(".tweetCanvas").css("opacity", 0.4).css("z-index", 10);
		$(this).css("opacity", 1).css("z-index", 100);
	},
	mouseleave: function(){
		$(".tweetCanvas").css("opacity", 0.4).css("z-index", 10);
	}
});


function playMarker(level){

	var canvas = $("#level-"+level).children(".tweetCanvas");

	$("#level-"+level+" .tweetCanvas").css("opacity", 0.3).css("z-index", 10);

	function walk(index){

		if(index== canvas.length){

			return;
		}
			
		$(canvas[index-1]).css("opacity", 0.3).css("z-index", 10);
		$(canvas[index]).css("opacity", 1).css("z-index", 100).fadeIn(150, function () {   
		    setTimeout(function()
		    {
				walk(index+1);
		    }, 3000);
		});


	}
	walk(0);

}

$(".back-search").live("click", function(){

	var maps = $("#page-2").children();
	//console.log(maps.length);

	if(maps.length == 1){
		window.location.href=""; 
	}
	else{
		$(maps[maps.length-1]).remove();
		$(maps[maps.length-2]).find(".selectDiv").remove();
	}

}); 

