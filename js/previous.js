
//initialize function called when the script loads.
//only the debug assignment is called. All parts work though and do
//just like the directions specify.
function initialize(){
		cities();
		//jsAjax and jQueryAjax were examples completed in class
	  //jsAjax();
	  //jQueryAjax();
		debugAjax();

};
//function to create a table with cities and their populations
function cities(){
	//define two arrays for cities and population
	var cityPop = [
		{
			city: 'Madison',
			population: 233209
		},
		{
			city: 'Milwaukee',
			population: 594833
		},
		{
			city: 'Green Bay',
			population: 104057
		},
		{
			city: 'Superior',
			population: 27244
		}
	];

	//append the table element to the div
	$("#mydiv").append("<table>");

	//append a header row to the table
	$("table").append("<tr>");

	//add the "City" and "Population" columns to the header row
	$("tr").append("<th>City</th><th>Population</th>");

	//loop to add a new row for each city
    for (var i = 0; i < cityPop.length; i++){
        //assign longer html strings to a variable
        var rowHtml = "<tr><td>" + cityPop[i].city + "</td><td>" + cityPop[i].population + "</td></tr>";
        //add the row's html string to the table
        $("table").append(rowHtml);
    };
		//call other functions described below
    addColumns(cityPop);
    addEvents();
};
//function used to add column categorizing population size
function addColumns(cityPop){
		//runs function for each row element in HTML
    $('tr').each(function(i){
			//counter variable checked
    	if (i == 0){
				//appending "City Size" to the new column
    		$(this).append('<th>City Size</th>');
    	} else {
				//empty variable created
    		var citySize;
				//conditional that assigns classification to citySize based on population of that city
    		if (cityPop[i-1].population < 100000){
    			citySize = 'Small';
					//conditional that assigns classification to citySize based on population of that city
    		} else if (cityPop[i-1].population < 500000){
    			citySize = 'Medium';
					//conditional that assigns classification to citySize if it doesn't fit the criteria above
    		} else {
    			citySize = 'Large';
    		};
				//appending citySize to the table in a cell
    		$(this).append('<td>' + citySize + '</td>');
    	};
    });
};

//function to carry out actions with certain events
function addEvents(){
	//function for whenever user hovers over any table element
	$('table').mouseover(function(){
		//variable defined and assigned start of an rgb code
		var color = "rgb(";
		//counter and conditional to assign three numeric values to color variable
		for (var i=0; i<3; i++){
			//variable assigned to random integer between 0 and 255
			var random = Math.round(Math.random() * 255);
			//random concatenated to color
			color += random;
			//comma added to properly separate values in color
			if (i<2){
				color += ",";
			//closing parenthesis appended to end of color
			} else {
				color += ")";
		};
		//color of the element changed through css command
		$(this).css('color', color);
	}});
	//function that alerts user when element has been clicked
	function clickme(){
		//alert message created
		alert('Hey, you clicked me!');
	};
	//applying alert whenever user clicks any table element
	$('table').on('click', clickme);
};

//AJAX using plain JS
function jsAjax(){
  //instantiate an ajax request object
  var ajaxRequest = new XMLHttpRequest();

  //create an event handler for the request
  ajaxRequest.onreadystatechange = function(){
    //console.log(ajaxRequest.readyState);
    if (ajaxRequest.readyState == 4){
      //call a callback function and pass data to it
      jsCallback(ajaxRequest.response);
			console.log(ajaxRequest.response);
    }
  };
  //a console.log(ajaxRequest.response) yields nothing because it would
  // execute before the response comes in. Need readystate to be 4 so data has
  // been returned
  console.log(ajaxRequest.response);


//open ajax request
//'get' request to get data from server, the place where you wanna get the data from
// and true to be asynchronous
ajaxRequest.open('GET', 'data/MegaCitiesGeoJSON.geojson', true);

//set data type
ajaxRequest.responseType = 'json';

//send the call
ajaxRequest.send()
};

function jsCallback(data){
  //console.log(data)
  var htmlString = "<h3>GeoJSON Data:</h3>";
  //can't just concatenate JS object onto a string, so the following statement
  // just yields [object Object]
  //   htmlString += data;

  //following line turns JSON object into a string
  htmlString += JSON.stringify(data);
  //creating a paragraph element
  var p = document.createElement("p");
  //assigning htmlString to the paragraph
  p.innerHTML = htmlString
  //append paragraph to mydiv
  document.getElementById("mydiv").appendChild(p);
};


//ajax using jquery
function jQueryAjax(){
  //two arguments: location of data, object with settings
  $.ajax("data/MegaCitiesGeoJSON.geojson",{
    dataType: "json",
    //referencing function by name. Success means it will execute what data is
    // available and automatically sends data to it.
    success: jQueryCallback
  });
  //can also use $.getJSON. Does the same as the three lines above
  //$.getJSON("data/MegaCitiesGeoJSON.geojson", jQueryCallback);


};

//callback function for jQuery
function jQueryCallback(data){
  //console.log(data);
  var htmlString = "<h3>GeoJSON Data:</h3>";
  htmlString += JSON.stringify(data);
  $("#mydiv").append("<p>"+htmlString+"</p>");
};



//callback function for jQuery
function debugCallback(response){
	//using jquery to append the response from the server to the html element
	// with the label of "mydiv." The returned JSON object must be appended as
	// a string so it can be read on the page.
	$("#mydiv").append('<h3>GeoJSON Data:</h3>' + JSON.stringify(response));
};

function debugAjax(){
	//jQuery AJAX call, asking for specific file of the file type.
	$.ajax("data/MegaCitiesGeoJSON.geojson", {
		dataType: "json",
		//on a successful return the data is then entered into the "debugCallback"
		// function.
		success: debugCallback
	});
};

//$("#mydiv").append('GeoJSON data: ' + JSON.stringify(mydata));

//call the initialize function when the document has loaded
$(document).ready(initialize);
