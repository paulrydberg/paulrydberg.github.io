_satellite.pushAsyncScript(function(event, target, $variables){
  trulia.dataLayer.eventSendingInProgress = false
if (trulia.dataLayer && typeof trulia.dataLayer.queuedTrackingCalls == "object" && trulia.dataLayer.queuedTrackingCalls.length) {
  var event = trulia.dataLayer.queuedTrackingCalls.shift()
  trulia.dataLayer.handleEvent(event['event_name'], event['data']);
}
});
