/* Functions for JSON Viewer */

    /***** **                                                  
  ******  **** *                                               
 **   *  * ****  **                                            
*    *  *   **   **                                            
    *  *          **    ***    ****                            
   ** **           **    ***     ***  *    ***    ***  ****    
   ** **           **     ***     ****    * ***    **** **** * 
   ** ******       **      **      **    *   ***    **   ****  
   ** *****        **      **      **   **    ***   **    **   
   ** **           **      **      **   ********    **    **   
   *  **           **      **      **   *******     **    **   
      *            **      **      *    **          **    **   
  ****         *    ******* *******     ****    *   **    **   
 *  ***********      *****   *****       *******    ***   ***  
*     ******                              *****      ***   *** 
*               Written by Ewen McCahon                                               
 **          Attribute if you modify or use */

/* LISTENERS */
window.addEventListener("load", function load(event){ /* REQUEST NOTIFICATION PERMISSION */
    window.removeEventListener("load", load, false);
    Notification.requestPermission();
},false);
var control = document.getElementById("source-file"); /* BROWSE BUTTON */
control.addEventListener("change", function(event) {
    var files = control.files;
    readFile(files[0]);
}, false);
var target = document.getElementById("drag-drop"); /* DRAG AND DROP */
target.addEventListener("dragover", function(event) {
    event.preventDefault();
}, false);
target.addEventListener("drop", function(event) {
    event.preventDefault();
    var files = event.dataTransfer.files;
    readFile(files[0]);
}, false);

/* ACTUAL FUNCTIONS */
function readFile(source) { // Load file with FileReader and pop a notification
    document.getElementById("searches").innerHTML = "<li>Loading...</li>"; // Tell the user we're loading, should be less than a second
    var notification = new Notification("JSON Loaded", 
    {
            body: source.name + " Loaded Successfully",
            icon: 'resources/db.png'
    });
    var reader = new FileReader();
    reader.onload = function(e) {
        parse(reader.result); // Do something with loaded text
    }
    reader.readAsText(source);
}

function parse(input) { // Parse JSON from text
    searches = JSON.parse(input);
    events = searches.event.reverse();
    length = events.length;
    document.getElementById("searches").innerHTML = ""; // Remove the 'nothing to show yet'/'loading' message
    for(i = 0; i < length; i++) { // Loop over events array and get the bits we want
        querytext = events[i].query.query_text;
        querydate = prettyDate(events[i].query.id[0].timestamp_usec);
        render(querytext, querydate); // Show results
    }
}

function prettyDate(ugly) { // Function to extract info from timestamp
    var date = new Date(ugly / 1000); // Google uses uTime and Javascript uses Millisecond time, so divide by 1000
    var pretty = {"display":"", "year":"", "month":"", "day":"", "month_text":""};
    pretty.year = date.getFullYear();
    pretty.month = date.getMonth();
    pretty.day = date.getDate();
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    pretty.month_text = months[pretty.month - 1];
    return pretty;
}

function render(query, date) { // Add LI for each result
    var dest = document.getElementById("searches");
    var li = document.createElement("li");
    var span = document.createElement("span");
    li.appendChild(document.createTextNode(query));
    span.appendChild(document.createTextNode(date.day + "/" + date.month + "/" + date.year))
    li.appendChild(span);
    dest.appendChild(li);
    console.log(li);
}