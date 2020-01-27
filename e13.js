// Initialiazes and creates the map
function createMap () {
  window.mymap = L.map('mapid').setView([61.497755, 23.760543], 3)
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibGl1a2FzbGF0dGlhIiwiYSI6ImNrMm90bjB3MjA5NjkzbXBwMDZmc3FnemgifQ.M1l8Ebl2hpQ0yTUqQHk9Jg', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(window.mymap)
  return window.mymap
}

// Fetches coordinates from local server and adds them to table
function get (map) {
  var init = {
    method: 'GET'
  }

  fetch('http://localhost:8080/locations', init).then(function (Response) {
    return Response.json()
  }).then(function (array) {
    console.log(array)
    var i
    for (i = 0; i < array.length; i++) {
      var marker = L.marker([array[i].lat, array[i].lon]).addTo(map)
       var table = document.getElementById("location").firstElementChild;
       var row = table.insertRow(0);
       var cell1 = row.insertCell(0);
       var cell2 = row.insertCell(1);
       cell1.innerHTML = array[i].lat;
       cell2.innerHTML = array[i].lon;
    }
  })
}

// Creates marker to the map
function createMarker (e) {
var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(window.mymap)
}

// Adds marker to the map and adds it to the server
function onMapClick (e) {
  console.log(e.latlng)
  
  var init = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({
      "lat": e.latlng.lat,
      "lon": e.latlng.lng})
  }

  fetch('http://localhost:8080/locations', init).then(createMarker(e))
  return e
}

var myHeaders = new Headers()
myHeaders.append('Content-type', 'application/json')

// loads on window load
window.addEventListener('load', (event) => {
  var map = createMap()
  get(map)
  map.doubleClickZoom.disable()
  map.on('dblclick', onMapClick)
})
