var config = {
  apiKey: "AIzaSyAPau9vvY-PAiAHbwHqt0x3rqusKcGgw08",
  authDomain: "classroom-test-68049.firebaseapp.com",
  databaseURL: "https://classroom-test-68049.firebaseio.com",
  projectId: "classroom-test-68049",
  storageBucket: "classroom-test-68049.appspot.com",
  messagingSenderId: "874038179323"
};
firebase.initializeApp(config);

var clock;
$(document).ready(function() {
  clock = $(".clock").FlipClock({
    clockFace: "TwelveHourClock"
  });
});

var database = firebase.database();

var trainName = "";
var destination = "";
var trainFirstTime = "";
var trainFrequency = 0;

$("#submit").on("click", function(event) {
  event.preventDefault();

  trainName = $("#trainName")
    .val()
    .trim();
  destination = $("#trainDestination")
    .val()
    .trim();
  trainFrequency = $("#trainFrequency")
    .val()
    .trim();
  trainFirstTime = moment(
    $("#trainFirstTime")
      .val()
      .trim(),
    "HH:mm"
  ).format("HH:mm a");

  database.ref().push({
    trainName: trainName,
    destination: destination,
    trainFrequency: trainFrequency,
    trainFirstTime: trainFirstTime
  });

  $("#trainName").empty();
  $("#trainDestination").empty();
  $("#trainFirstTime").empty();
  $("#trainFrequency").empty();
});

database
  .ref()
  .orderByChild("dateAdded")
  .on(
    "child_added",
    function(snapshot) {
      var databaseRecalled = snapshot.val();

      var currentTime = moment();
      var trainStartConverted = moment(
        databaseRecalled.trainFirstTime,
        "HH:mm"
      ).subtract(1, "years");
      var diffTime = moment(currentTime).diff(
        moment(trainStartConverted),
        "minutes"
      );
      var remainder = diffTime % databaseRecalled.trainFrequency;
      var minutes = databaseRecalled.trainFrequency - remainder;
      var nextTrain = moment(
        moment(currentTime).add(minutes, "minutes")
      ).format("hh:mm");

      var tr = $("<tr>");
      tr.append("<td>" + databaseRecalled.trainName + "</td>");
      tr.append("<td>" + databaseRecalled.destination + "</td>");
      tr.append("<td>" + databaseRecalled.trainFrequency + "</td>");
      tr.append("<td>" + nextTrain + "</td>");
      tr.append("<td>" + minutes + "</td>");

      $("#contentForTable").append(tr);
    },
    function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    }
  );
