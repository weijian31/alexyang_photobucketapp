import { getAuth, signOut, signInWithEmailAndPassword ,createUserWithEmailAndPassword,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getStorage, ref, uploadBytes,getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

var currentUsersemail

const firebaseConfig = {
  apiKey: "AIzaSyA9Q1m9U1de_E8TElEiZUeMuQsMEbVascs",
  authDomain: "photobuckeapp.firebaseapp.com",
  projectId: "photobuckeapp",
  storageBucket: "photobuckeapp.appspot.com",
  messagingSenderId: "946216345238",
  appId: "1:946216345238:web:564778cd274ddeb180ecb7",
  measurementId: "G-FLV5FH9ZTP"
};


var email = document.querySelector("#sign_in_email").value
var password = document.querySelector("#sign_in_pwd").value

function showAlert(div,type,msg){
    var putInDiv = document.getElementById(div)
    putInDiv.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert">' + msg +'</div>'
};
const signupForm = document.querySelector('#sign_up_form')
const signinForm = document.querySelector('#sign_in_form')
const app = initializeApp(firebaseConfig);
var auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
     currentUsersemail = user.email;
    document.getElementById('logoutBtn').style.display='block'
    document.getElementById('not_logged_in').style.display='none'
    document.getElementById('logged_in').style.display='block'
    mapinit()
    installalert()
    // ...
  } else {
    // User is signed out
    document.getElementById('logoutBtn').style.display='none'
    document.getElementById('not_logged_in').style.display='block'
    document.getElementById('logged_in').style.display='none'
  }
});
//Sign up
signupForm.addEventListener('submit',(function(e){
    e.preventDefault()
    var email = document.querySelector("#sign_up_email").value
    var pwd1 = document.querySelector("#sign_up_pwd1").value
    var pwd2 = document.querySelector("#sign_up_pwd2").value
    
    if (pwd1===pwd2){
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, pwd1)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          showAlert('sign_up_alerts','warning',errorMessage)
        });
    } else{
        showAlert('sign_up_alerts','warning','The Passwords doesn\'t match, please try again')
    }

}))

//Sign in
signinForm.addEventListener('submit',(function(e){
  e.preventDefault()
  var email = document.querySelector("#sign_in_email").value
  var pwd1 = document.querySelector("#sign_in_pwd").value

  signInWithEmailAndPassword(auth, email, pwd1)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    showAlert('sign_in_alerts','warning',errorMessage)
  });
}))


//log out
const logoutBtn = document.querySelector('#logoutUser')
logoutBtn.addEventListener('click',(function(e){
  e.preventDefault()
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}))

function installalert(){
  if (deferredPrompt){
    deferredPrompt.prompt()
    deferredPrompt = null
  }
}

//upload image to the base


window.submitPost = function submitPost(location){
  var progressbar = document.getElementById('imgprogressbar')
  var canvas = document.getElementById('capturedImg')
  canvas.toBlob(blob=>{
    var name = currentUsersemail +new Date().toISOString()
    const storage = getStorage();
    const storageRef = ref(storage, 'feed/'+name);
    progressbar.parentElement.style.display = 'flex'
  // 'file' comes from the Blob or File API
  uploadBytes(storageRef, blob)
  .then((snapshot) => {
      var percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      progressbar.style.width= percent+'%'
      return getDownloadURL(ref(snapshot.ref))
      // console.log(url.url)
    })
    .then(url=>{
      console.log(url)
      complete()
      fetch('https://photobuckeapp-default-rtdb.firebaseio.com/feed.json',{
        method :'POST',
        headers:{
          'Content-type':'application/json',
          'Accept':'application/json'
        },body:JSON.stringify({
          "email":currentUsersemail,
          "status":document.getElementById('feeling').value,
          "image":url,
          "location":location,
          "time":new Date().toISOString()
        })
      })
    })
      .then(res=>{
        console.log('entry added')
        var canvas = document.getElementById('capturedImg')
        var ctx = canvas.getContext('2d')
        ctx.clearRect(0,0,240,320)
        document.getElementById('feeling').value=''
        document.getElementById('addphotobtn').value=''
        // document.getElementById('position_info').innerHTML=''
        // $('#newentry').modal('hide')
      })
      .catch(function(err){
        console.log(err)
      })
    
    
    .then(err=>{
      console.log(err)
    })
    
  

  //   userToken.then(function(result) {
  //     console.log(result) // "Some User token"
  //  })
    // .then((snapshot) => {})
    // .then((url)=>{
    // })
});

}

function complete (){
  // progressbar.parentElement.style.display='none'
  progressbar.style.width='100%'
  document.getElementById('position_info').style.color='green'
  document.getElementById('position_info').innerHTML='<i class="fa-solid fa-check fa-bounce"></i> Successfully Uploaded! '

}