var canvas = document.getElementById('capturedImg')
var userLocation
var geoRecall = true
var progressbar = document.getElementById('imgprogressbar')



function addimgtocanvas(e){
    var reader = new FileReader()
    reader.onload= function(event){
        var img = new Image()
        img.onload=function(){
            var ctx = canvas.getContext('2d')
            ctx.drawImage(img,0,0,240,320)
        }
        img.src = event.target.result
    }
    reader.readAsDataURL(e.files[0])
}

function showPosition(position){
    document.getElementById('position_info').innerHTML = 'Position received, saving the post'
    progressbar.style.width='0%'
    document.getElementById('position_info').style.color='green'
    userLocation={
        longitude:position.coords.longitude,
        latitude:position.coords.latitude
    }
    console.log(userLocation)
    submitPost(userLocation)
    geoRecall = false
}

function positionError(){
    document.getElementById('position_info').innerHTML = 'Plz turn on your GPS!!!'
    document.getElementById('position_info').style.color='red'
    userLocation=undefined
    if (geoRecall){
        geolocagain()
    }
}

function geolocagain(){
    navigator.geolocation.getCurrentPosition(showPosition, positionError)

}
function getlocation(){
    navigator.geolocation.getCurrentPosition(showPosition, positionError)
}

var myInput = document.getElementById('addphotobtn');

function sendPic() {
    var file = myInput.files[0];

    // Send file here either by adding it to a `FormData` object 
    // and sending that via XHR, or by simply passing the file into 
    // the `send` method of an XHR instance.
}

myInput.addEventListener('change', sendPic, false);