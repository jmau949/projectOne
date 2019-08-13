M.AutoInit();
const firebaseConfig = {
    apiKey: "AIzaSyCfITc5Pg5rZxa_yTvo3lhsOg79bNdmghY",
    authDomain: "runtrackdb.firebaseapp.com",
    databaseURL: "https://runtrackdb.firebaseio.com",
    projectId: "runtrackdb",
    storageBucket: "",
    messagingSenderId: "267990846579",
    appId: "1:267990846579:web:a9a0af5fed16bb0a"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create a variable to reference the database.


  
  // Create a variable to reference the database.
  var database = firebase.database();
//   var startTime = "";
//   var endTime = "";
//   var date = "";
//   var location = "";

  

  database.ref().on("child_added", function(snapshot) {
  
    
    var first = $('<tr scope="row">');
    $(first).append('<td>' + snapshot.val().startTime + '</td>')
    $(first).append('<td>' + snapshot.val().endTime + '</td>')
    $(first).append('<td>' + snapshot.val().date + '</td>')
    $(first).append('<td>' + snapshot.val().location + '</td>')

    $('#results').prepend(first);
  
    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

  M.AutoInit();