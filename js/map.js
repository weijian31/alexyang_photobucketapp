
mapboxgl.accessToken = 'pk.eyJ1IjoieTIyMzI0NjI0MjAiLCJhIjoiY2xqOXp2MTc3MHEyZzNsdGgwcDZjdHRmcCJ9.BqT0pVDbiM7EiY1mT-N27w';
var map
function mapinit(){
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/y2232462420/clja1qn7s003o01pwcpvlagp6',
      center: [-80.532470, 43.467539], // starting center in [lng, lat]
      zoom: 10 // starting zoom
    });
    map.addControl(
      new mapboxgl.GeolocateControl({
      positionOptions: {
      enableHighAccuracy: true
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true
      })
      );
      map.addControl(new mapboxgl.NavigationControl());
      var mq = window.matchMedia( "(min-width: 420px)" );

      if (mq.matches){
          map.setZoom(10); //set map zoom level for desktop size
      } else {
          map.setZoom(7); //set map zoom level for mobile size
      };

    feedData()}




function feedData(){
  fetch('https://photobuckeapp-default-rtdb.firebaseio.com/feed.json')
  .then((response)=>{
    return response.json()
  })
  .then((data)=>{
    var ids = Object.keys(data)
    for (i=0;i<ids.length;i++){
      // create the popup
  var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
  '<p> Status: ' + data[ids[i]].status + '<p> <img src='+data[ids[i]].image + '> <p> Email:' + data[ids[i]].email+'</p>'
  );
   
  // create DOM element for the marker
  const el = document.createElement('div');
  el.id = 'marker';
   
  // create the marker
  new mapboxgl.Marker()
  .setLngLat([data[ids[i]].location.longitude,data[ids[i]].location.latitude])
  .setPopup(popup) // sets a popup on this marker
  .addTo(map);
    }
  })
}