_satellite.pushAsyncScript(function(event, target, $variables){
  //www Lead sent listener v1.1 - doesn't work on for sale?
if (typeof(window._ENVIRONMENT) !== "undefined" && typeof(o_track_lead_email_sent) !== "undefined") {
    var wrapped_o_track_lead_email_sent = o_track_lead_email_sent;
    o_track_lead_email_sent = function(type, email, extra, propertyData) {
        if (propertyData.isRentalCommunity !== false) {
            window.callDtmDirectRule('leadForRentBDP');
        } else if (propertyData.isRental !== false) {
            window.callDtmDirectRule('leadForRent');
        } else {
            window.callDtmDirectRule('leadForSale');
        }
        return wrapped_o_track_lead_email_sent(type, email, extra, propertyData);
    }
}
});
