//==============================
// google map api related codes
//==============================


   var levelNum = 0;
   var levelCanvasNum = new Array(0, 0, 0); // 
   var displayRatio = new Array([1, 1], [0.7, 0.3], [0.6, 0.2], [0.55, 0.15], [0.6, 0.1]);
   var curLevel = 0;
   var curIndex = 0;
   var centerHeight = 0.6;
   var winwidth = window.innerWidth;
   var winheight = window.innerHeight;
   var lastScrolledLeft = 0;
   var lastScrolledTop = 0;
   var xMousePos = 0;
   var yMousePos = 0;
  

   function newCanvas(level, feeds, bnds) {
      // google map 
      var tempHTML; // html of a new level
      curLevel = level;
      levelCanvasNum[level]++; // canvas numbers for each level from 1, 2, 3, 4, 5. 
      curIndex = levelCanvasNum[level] - 1; // index from 0, 1, 2, ...

      tempHTML = "<div id='level-" + curLevel + "' class='canvasBox' style='width:" + (winwidth - 12) + "px;height:" + (winheight - 12) + "px'>\
			            <div class='canvas' id='map-" + curLevel + "' ></div>\
			        </div>"
      $("#page-2").append(tempHTML);
      levelNum++;
      

      //console.log(bnds);



      var mapOptions = {
         scrollwheel: false,
         mapTypeControl: false,
         scaleControl: false,
         center: new google.maps.LatLng(40, -30),
         zoom: 3,
         disableDoubleClickZoom: true,
         mapTypeId: google.maps.MapTypeId.ROADMAP,
         draggable: false,
         zoomControl: false,
         streetViewControl: false,
         panControl: false
      };
      var map = new google.maps.Map(document.getElementById("map-" + curLevel),
      mapOptions);



      
      
      if (typeof bnds !== "undefined") {
         z = map.getZoom();
         map.fitBounds(bnds);
         if (map.getZoom() < z) {
            map.setZoom(z);
         }
		 //$("map-" + curLevel + "-" + curIndex).css('borderColor',$("#").css('borderColor'))
		 
      }
      var getMousePosition = function (e, map) {
         var zoomValue = ($("#" + $($("#" + (map.getDiv().getAttribute('id'))).parent()).attr("id")).css('zoom'));
         //console.log(zoomValue);
         e = e || window.event;
         if (typeof e.pageX !== "undefined") {
            xMousePos = (e.clientX + (lastScrolledLeft)) / zoomValue;
            yMousePos = (e.clientY + ((lastScrolledTop))) / zoomValue;
            //console.log( (yMousePos*zoomValue),e .clientY,lastScrolledTop,"test");
         }
         return {
            left: xMousePos,
            top: yMousePos
         };
      };
      $("#page-2").scroll(function (e) {
         if (lastScrolledLeft != $("#page-2").scrollLeft()) {
            xMousePos -= lastScrolledLeft;
            lastScrolledLeft = $("#page-2").scrollLeft();
            xMousePos += lastScrolledLeft;
         }
         if (lastScrolledTop != $("#page-2").scrollTop()) {
            yMousePos -= lastScrolledTop;
            lastScrolledTop = $("#page-2").scrollTop();
            //yMousePos += lastScrolledTop;
         }
      });
      /*
	  We need to work here on getting the relative position to work with real-time drawing
	  */
      var getElementPosition = function (h) {
         var posX = h.offsetLeft;
         var posY = h.offsetTop;
         var parent = h.offsetParent;
         // Add offsets for all ancestors in the hierarchy
         while (parent !== null) {
            if (parent !== document.body && parent !== document.documentElement) {
               //posX -= parent.scrollLeft;
               //posY -= parent.scrollTop;
               //console.log(posX, posY, parent.scrollTop, $(h).attr('id'), "testelem");
            }
            // See http://groups.google.com/group/google-maps-js-api-v3/browse_thread/thread/4cb86c0c1037a5e5
            // Example: http://notebook.kulchenko.com/maps/gridmove
            var m = parent;
            // This is the "normal" way to get offset information:
            var moffx = m.offsetLeft;
            var moffy = m.offsetTop;
            // This covers those cases where a transform like scale is used:
            if (!moffx && !moffy && window.getComputedStyle) {
               var matrix = document.defaultView.getComputedStyle(m, null).MozTransform || document.defaultView.getComputedStyle(m, null).WebkitTransform;
               if (matrix) {
                  if (typeof matrix === "string") {
                     var parms = matrix.split(",");
                     moffx += parseInt(parms[4], 10) || 0;
                     moffy += parseInt(parms[5], 10) || 0;
                  }
               }
            }
            posX += moffx;
            posY += moffy;
            parent = parent.offsetParent;
         }
         return {
            left: posX,
            top: posY
         };
      };
      var setVals = function (obj, vals) {
         if (obj && vals) {
            for (var x in vals) {
               if (vals.hasOwnProperty(x)) {
                  obj[x] = vals[x];
               }
            }
         }
         return obj;
      };
      var setOpacity = function (h, op) {
         if (typeof op !== "undefined") {
            h.style.opacity = op;
         }
      };

      function DragZoom(map, opt_zoomOpts) {
         var me = this;
         var ov = new google.maps.OverlayView();
         ov.onAdd = function () {
            me.init_(map, opt_zoomOpts);
         };
         ov.draw = function () {};
         ov.onRemove = function () {};
         ov.setMap(map);
         this.prjov_ = ov;
      }
      DragZoom.prototype.init_ = function (map, opt_zoomOpts) {
         var i;
         var me = this;
         this.map_ = map;
         this.key_ = "shift";
         this.key_ = this.key_.toLowerCase();
         // this.borderWidths_ = getBorderWidths(this.map_.getDiv());
         this.veilDiv_ = [];
         for (i = 0; i < 4; i++) {
            this.veilDiv_[i] = document.createElement("div");
            // Apply default style values for the veil:
            setVals(this.veilDiv_[i].style, {
               backgroundColor: "gray",
               opacity: 0.25,
               cursor: "crosshair"
            });
            // Apply mandatory style values:
            setVals(this.veilDiv_[i].style, {
               position: "absolute",
               overflow: "hidden",
               display: "none"
            });
            setOpacity(this.veilDiv_[i]);
            this.map_.getDiv().appendChild(this.veilDiv_[i]);
         }
         this.listeners_ = [
         google.maps.event.addDomListener(document, "keydown", function (e) {
            me.onKeyDown_(e);
         }),
         google.maps.event.addDomListener(document, "keyup", function (e) {
            me.onKeyUp_(e);
         }),
         google.maps.event.addDomListener(this.veilDiv_[0], "mousedown", function (e) {
            me.onMouseDown_(e);
         }),
         google.maps.event.addDomListener(this.veilDiv_[1], "mousedown", function (e) {
            me.onMouseDown_(e);
         }),
         google.maps.event.addDomListener(this.veilDiv_[2], "mousedown", function (e) {
            me.onMouseDown_(e);
         }),
         google.maps.event.addDomListener(this.veilDiv_[3], "mousedown", function (e) {
            me.onMouseDown_(e);
         }),
         google.maps.event.addDomListener(document, "mousedown", function (e) {
            me.onMouseDownDocument_(e);
         }),
         google.maps.event.addDomListener(document, "mousemove", function (e) {
            me.onMouseMove_(e);
         }),
         google.maps.event.addDomListener(document, "dblclick", function (e) {
            me.onMouseDblClick_(e);
         }),
         google.maps.event.addDomListener(document, "mouseup", function (e) {
            me.onMouseUp_(e);
         }), ];
         this.hotKeyDown_ = false;
         this.mouseDown_ = false;
         this.dragging_ = false;
         this.startPt_ = null;
         this.endPt_ = null;
         this.mapWidth_ = null;
         this.mapHeight_ = null;
         this.mousePosn_ = null;
         this.mapPosn_ = null;
      };
      DragZoom.prototype.onMouseDblClick_ = function (e) {
         //var temp = $(this.map_.getDiv()).parent().attr("id").split("-");
         //console.log(temp[1]);
         //toggleZoomCanvas(temp[1],temp[2]);
      };
      DragZoom.prototype.isHotKeyDown_ = function (e) {
         var isHot;
         e = e || window.event;

         isHot = (e.shiftKey && this.key_ === "shift");
         if (!isHot) {
            if ((this.key_ === "shift") && (e.keyCode === 16)) {
               isHot = true;
            }
         }
         return isHot;
      };
      DragZoom.prototype.isMouseOnMap_ = function () {
         var mousePosn = this.mousePosn_;
         if (mousePosn) {
            var mapPosn = this.mapPosn_;
            var mapDiv = this.map_.getDiv();
            //console.log($(mapDiv).attr('id'), mousePosn.top, mapPosn.top, mapDiv.offsetHeight, (mapPosn.top + mapDiv.offsetHeight), "test2");
            return mousePosn.left > mapPosn.left && mousePosn.left < (mapPosn.left + mapDiv.offsetWidth) && mousePosn.top > mapPosn.top && mousePosn.top < (mapPosn.top + mapDiv.offsetHeight);
         } else {
            // if user never moved mouse
            return false;
         }
      };
      DragZoom.prototype.setVeilVisibility_ = function () {
         var i;
         if (this.map_ && this.hotKeyDown_ && this.isMouseOnMap_()) {
            var mapDiv = this.map_.getDiv();
            this.mapWidth_ = mapDiv.offsetWidth;
            this.mapHeight_ = mapDiv.offsetHeight;
            if (this.activatedByControl_) { // Veil covers entire map (except control)
               var left = parseInt(this.buttonDiv_.style.left, 10);
               var top = parseInt(this.buttonDiv_.style.top, 10);
               var width = this.visualSize_.width;
               var height = this.visualSize_.height;
               // Left veil rectangle:
               this.veilDiv_[0].style.top = "0px";
               this.veilDiv_[0].style.left = "0px";
               this.veilDiv_[0].style.width = left + "px";
               this.veilDiv_[0].style.height = this.mapHeight_ + "px";
               // Right veil rectangle:
               this.veilDiv_[1].style.top = "0px";
               this.veilDiv_[1].style.left = (left + width) + "px";
               this.veilDiv_[1].style.width = (this.mapWidth_ - (left + width)) + "px";
               this.veilDiv_[1].style.height = this.mapHeight_ + "px";
               // Top veil rectangle:
               this.veilDiv_[2].style.top = "0px";
               this.veilDiv_[2].style.left = left + "px";
               this.veilDiv_[2].style.width = width + "px";
               this.veilDiv_[2].style.height = top + "px";
               // Bottom veil rectangle:
               this.veilDiv_[3].style.top = (top + height) + "px";
               this.veilDiv_[3].style.left = left + "px";
               this.veilDiv_[3].style.width = width + "px";
               this.veilDiv_[3].style.height = (this.mapHeight_ - (top + height)) + "px";
               for (i = 0; i < this.veilDiv_.length; i++) {
                  this.veilDiv_[i].style.display = "block";
               }
            } else {
               this.veilDiv_[0].style.left = "0px";
               this.veilDiv_[0].style.top = "0px";
               this.veilDiv_[0].style.width = this.mapWidth_ + "px";
               this.veilDiv_[0].style.height = this.mapHeight_ + "px";
               for (i = 1; i < this.veilDiv_.length; i++) {
                  this.veilDiv_[i].style.width = "0px";
                  this.veilDiv_[i].style.height = "0px";
               }
               for (i = 0; i < this.veilDiv_.length; i++) {
                  this.veilDiv_[i].style.display = "block";
               }
            }
         } else {
            for (i = 0; i < this.veilDiv_.length; i++) {
               this.veilDiv_[i].style.display = "none";
            }
         }
      };
      DragZoom.prototype.onKeyDown_ = function (e) {
         if (this.map_ && !this.hotKeyDown_ && this.isHotKeyDown_(e) && curLevel!=2) {
            this.mapPosn_ = getElementPosition(this.map_.getDiv());
            this.hotKeyDown_ = true;
            this.activatedByControl_ = false;
            this.setVeilVisibility_();

         }
      };
      DragZoom.prototype.getMousePoint_ = function (e) {
         var mousePosn = getMousePosition(e, this.map_);
         var p = new google.maps.Point();
         p.x = mousePosn.left - this.mapPosn_.left;
         p.y = mousePosn.top - this.mapPosn_.top;
         p.x = Math.min(p.x, this.mapWidth_);
         p.y = Math.min(p.y, this.mapHeight_);
         p.x = Math.max(p.x, 0);
         p.y = Math.max(p.y, 0);
         return p;
      };
      DragZoom.prototype.onMouseDown_ = function (e) {
         if (this.map_ && this.hotKeyDown_) {
            this.mapPosn_ = getElementPosition(this.map_.getDiv());
            this.dragging_ = true;
            this.startPt_ = this.endPt_ = this.getMousePoint_(e);
            var prj = this.prjov_.getProjection();
            var latlng = prj.fromContainerPixelToLatLng(this.startPt_);
            this.boxDiv_ = document.createElement("div");
            this.boxDiv_.setAttribute("id", "selectDiv" + curLevel);
            this.boxDiv_.setAttribute("class", "selectDiv"); //!!!

            // Apply mandatory style values:
            setVals(this.boxDiv_.style, {
               position: "absolute",
               display: "none"
            });
            setOpacity(this.boxDiv_);
            this.map_.getDiv().appendChild(this.boxDiv_);
            //this.boxBorderWidths_ = getBorderWidths(this.boxDiv_);
            this.boxDiv_.style.width = this.boxDiv_.style.height = "0px";
         }
      };
      DragZoom.prototype.onMouseDownDocument_ = function (e) {
         this.mouseDown_ = true;
      };
      DragZoom.prototype.onMouseMove_ = function (e) {
         this.mousePosn_ = getMousePosition(e, this.map_);
         if (this.dragging_) {
            this.endPt_ = this.getMousePoint_(e);
            var left = Math.min(this.startPt_.x, this.endPt_.x);
            var top = Math.min(this.startPt_.y, this.endPt_.y);
            var width = Math.abs(this.startPt_.x - this.endPt_.x);
            var height = Math.abs(this.startPt_.y - this.endPt_.y);
            var boxWidth = Math.max(0, width);
            var boxHeight = Math.max(0, height);
            // Left veil rectangle:
            this.veilDiv_[0].style.top = "0px";
            this.veilDiv_[0].style.left = "0px";
            this.veilDiv_[0].style.width = left + "px";
            this.veilDiv_[0].style.height = this.mapHeight_ + "px";
            // Right veil rectangle:
            this.veilDiv_[1].style.top = "0px";
            this.veilDiv_[1].style.left = (left + width) + "px";
            this.veilDiv_[1].style.width = (this.mapWidth_ - (left + width)) + "px";
            this.veilDiv_[1].style.height = this.mapHeight_ + "px";
            // Top veil rectangle:
            this.veilDiv_[2].style.top = "0px";
            this.veilDiv_[2].style.left = left + "px";
            this.veilDiv_[2].style.width = width + "px";
            this.veilDiv_[2].style.height = top + "px";
            // Bottom veil rectangle:
            this.veilDiv_[3].style.top = (top + height) + "px";
            this.veilDiv_[3].style.left = left + "px";
            this.veilDiv_[3].style.width = width + "px";
            this.veilDiv_[3].style.height = (this.mapHeight_ - (top + height)) + "px";
            // Selection rectangle:
            this.boxDiv_.style.top = top + "px";
            this.boxDiv_.style.left = left + "px";
            this.boxDiv_.style.width = boxWidth + "px";
            this.boxDiv_.style.height = boxHeight + "px";
            this.boxDiv_.style.display = "block";
         } else if (!this.mouseDown_) {
            this.mapPosn_ = getElementPosition(this.map_.getDiv());
            this.setVeilVisibility_();
         }
      };
      DragZoom.prototype.onMouseUp_ = function (e) {
         var z;
         var me = this;
         this.mouseDown_ = false;
         if (this.dragging_) {
            if ((this.getMousePoint_(e).x === this.startPt_.x) && (this.getMousePoint_(e).y === this.startPt_.y)) {
               this.onKeyUp_(e); // Cancel event
               return;
            }
            var left = Math.min(this.startPt_.x, this.endPt_.x);
            var top = Math.min(this.startPt_.y, this.endPt_.y);
            var width = Math.abs(this.startPt_.x - this.endPt_.x);
            var height = Math.abs(this.startPt_.y - this.endPt_.y);
            var prj = this.prjov_.getProjection();
            var sw = prj.fromContainerPixelToLatLng(new google.maps.Point(left, top + height));
            var ne = prj.fromContainerPixelToLatLng(new google.maps.Point(left + width, top));
            var bnds = new google.maps.LatLngBounds(sw, ne);
            // var transform = ['scale(' + 0.5 + ')'];
            // $("#map_outer").css('-webkit-transform', transform.join(' '));
            var temp = this.map_.getDiv().id.split("-");
            if (++temp[1] > 2) showTip("Sorry, no more than three levels ");
            else if (levelCanvasNum[temp[1]] == 5) //maximum 5 canvas per level
            showTip("Sorry, no more than five children per level ");
            else newCanvas(temp[1], feeds, bnds);
            this.dragging_ = false;
            this.onMouseMove_(e);
            if (!this.isHotKeyDown_(e)) {
               this.onKeyUp_(e);
            }
         }
      };
      DragZoom.prototype.onKeyUp_ = function (e) {
         var i;
         var left, top, width, height, prj, sw, ne;
         var bnds = null;
         if (this.map_ && this.hotKeyDown_) {
            this.hotKeyDown_ = false;
            if (this.dragging_) {
               this.boxDiv_.style.display = "none";
               this.dragging_ = false;
               // Calculate the bounds when drag zoom was cancelled
            }
            for (i = 0; i < this.veilDiv_.length; i++) {
               this.veilDiv_[i].style.display = "none";
            }
         }
      };
      google.maps.Map.prototype.enableKeyDragZoom = function (opt_zoomOpts) {
         this.dragZoom_ = new DragZoom(this, opt_zoomOpts);
      };
      map.enableKeyDragZoom({});
      /*
		if(levelCanvasNum[level] == 1){ // create a new level
			
			tempHTML = "<div id='level-"+curLevel+"' class='levelBox'>\
				          	<div id='level-"+curLevel+"-"+curIndex+"' class='canvasBox' style='width:"+(winwidth-12)+"px;height:"+(winheight-12)+"px'>\
				            	<div class='canvas' id='map-"+curLevel+"-"+curIndex+"' ></div>\
				          	</div>\
				        </div>"
			$("#page-2").append(tempHTML);
			levelNum ++;
		}
		else{ // add a new canvas to an existed level

			tempHTML = "<div id='level-"+curLevel+"-"+curIndex+"' class='canvasBox' style='width:"+(winwidth-12)+"px;height:"+(winheight-12)+"px'>\
				            <div class='canvas' id='map-"+curLevel+"-"+curIndex+"' ></div>\
				        </div>"
			$("#level-"+curLevel).append(tempHTML);

		}
*/
      // create a google map object
      // draw a rectangle and create a new map
      //resetStyle();

      generateMarker(level, feeds, map, bnds);


   }

   function resetStyle() {
      var defaultHeight = 100 / levelNum;
      var levelHeight = new Array(0, 0, 0);
      for (var i = levelNum - 1; i > 0; i--) {
         levelHeight[i] = 100 / levelCanvasNum[i];
         if (levelHeight[i] > defaultHeight) {
            levelHeight[i] = defaultHeight;
         }
         $("#level-"+i).css("height", levelHeight[i] + "%");
         for (var j = 0; j < levelCanvasNum[i]; j++) {
            $("#level-" + i + "-" + j + ".canvasBox").css("zoom", (levelHeight[i]-2) + "%");
            /*
				$("#level-"+i+"-"+j+".canvasBox").css("height", levelHeight[i]+"%");
				$("#level-"+i+"-"+j+".canvasBox").css("width", levelHeight[i]+"%");
				*/
         }
      }
      // for level 0
      levelHeight[0] = 100 - levelHeight[1] - levelHeight[2];
      $("#level-0").css("height", levelHeight[0] + "%");
      $("#level-0-0.canvasBox").css("zoom", levelHeight[0] + "%");
      /*
		$("#level-0-0.canvasBox").css("height", levelHeight[0]+"%");
		$("#level-0-0.canvasBox").css("width", levelHeight[0]+"%");
*/
   }

   function showTip(tip) {}



