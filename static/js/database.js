//==============================
// get data from database
//==============================
	
	var searchTopic;
	var newsFeed = [];

	init();
	function init () {
		

	}

	$(".index-btn a").click(function(){

		searchTopic = $(this).attr("class");

		takeAction();

		$.get("http://localhost:8888/get/tweets/db", { txt: searchTopic }, function(res){

			for(var i = 0; i<res.result.length; i++){
				
				newsFeed.push(res.result[i]);
			}

			newCanvas(0, newsFeed);
			clearAction();

			$("#page-1").fadeOut(150);
          	//$("body").css("background", "#eee");
          	$("#page-2").fadeIn(150);
          	$(".back-search a p").html("#"+searchTopic);
          	$(".back-search").fadeIn(150);
          	$(".back-search").css("background-color", borderColor[styleIndex]);

		});

		
	});

	function takeAction () {
		$(".loading-outer").fadeIn(150);
	}
	function clearAction(){
		$(".loading-outer").fadeOut(150);
	}
