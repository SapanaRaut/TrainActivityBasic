// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCNayDf2PcGPfdaOxPYjzhtK7BaVuwXPKA",
    authDomain: "train-schedule-7659b.firebaseapp.com",
    databaseURL: "https://train-schedule-7659b.firebaseio.com",
    projectId: "train-schedule-7659b",
    storageBucket: "train-schedule-7659b.appspot.com",
    messagingSenderId: "539374469025"
  };
  firebase.initializeApp(config);
// Create a variable to reference the database.
	var database = firebase.database();
	$(document).ready(function() {
 //Get input values
  var trainName = null;
  var traindestination = null;
  var trainTime = null;
  var frequency = null;
});

  $("#submit").on("click", function(event) {
    event.preventDefault();
    console.log('submit clicked');
// Getting values from text boxes
    trainName = $("#train-name").val().trim();
    trainDestination = $("#destination").val().trim();
    trainTime = $("#train-time").val().trim();
    frequency = $("#frequency").val().trim();
// Console log input to verify it is captured
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainTime);
    console.log(frequency);
// Clear out the text boxes after submit
  $("#train-name").val("");
  $("#destination").val("");
  $("#train-time").val("");
  $("#frequency").val("");
// Code for pushing the data to Firebase
  database.ref().push({
    trainName: trainName,
    trainDestination: trainDestination,
    trainTime: trainTime,
    frequency: frequency,
  });
});

 // Firebase watcher for new data
database.ref().on("child_added", function(childSnapshot) {
 // Log everything that is coming out of snapshot to the console
 console.log(childSnapshot.val().trainName);
 console.log(childSnapshot.val().trainDestination);
 console.log(childSnapshot.val().trainTime);
 console.log(childSnapshot.val().frequency);
// trainTime needs to be defined, need help with this...
  var trainTime = childSnapshot.val().trainTime;
    var trainTimePretty = moment.unix(trainTime).format("HH:mm");
    // console.log(trainTimePretty);
// First Time (pushed back 1 year to make sure it comes before current time)
    var trainTimeConverted = moment(trainTime, "hh:mm").subtract(1, "years");
    console.log(trainTimeConverted);
// Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
// Difference between the times
    var diffTime = moment().diff(trainTimeConverted, "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
// Time apart (remainder)
    var tRemainder = diffTime % childSnapshot.val().frequency;
    console.log(tRemainder);
// Minutes Until Train
    var tMinutesTillTrain = childSnapshot.val().frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    // Add data to the table
$("#train-list").append("<tr><td>" + childSnapshot.val().trainName + "</td><td>" + childSnapshot.val().trainDestination + "</td><td>" +
  childSnapshot.val().frequency + "</td><td>" + moment(nextTrain).format("hh:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");
},
  function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
