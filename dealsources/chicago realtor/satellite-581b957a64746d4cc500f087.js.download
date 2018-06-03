_satellite.pushAsyncScript(function(event, target, $variables){
  trulia.analytics._event_data = undefined; //FIX: this line is causing errors; it resets the object that is needed by EBRs later

//reset evars in dataelements
_satellite.removeCookie('temp_interactedWith');
_satellite.setVar('trul_interactedWith', '');
_satellite.getVar('trul_interactedWith');

_satellite.setVar('trul_postListingCTADetails', null);
_satellite.getVar('trul_postListingCTADetails');

_satellite.setVar('trul_userGeneratedContentID', null);
_satellite.getVar('trul_userGeneratedContentID');

_satellite.setVar('trul_leadCTADetails', null);
_satellite.getVar('trul_leadCTADetails');

_satellite.setVar('trul_registrationCTADetails', null);
_satellite.getVar('trul_registrationCTADetails');

_satellite.setVar('trul_saveSearchCTADetails', null);
_satellite.getVar('trul_saveSearchCTADetails');

_satellite.setVar('trul_unsaveSearchCTADetails', null);
_satellite.getVar('trul_unsaveSearchCTADetails');

_satellite.setVar('trul_mortgageRequestCTADetails', null);
_satellite.getVar('trul_mortgageRequestCTADetails');

_satellite.setVar('trul_formError', null);
_satellite.getVar('trul_formError');

_satellite.setVar('trul_saveHomeCTADetails', null);
_satellite.getVar('trul_saveHomeCTADetails');

_satellite.setVar('trul_unsaveHomeCTADetails', null);
_satellite.getVar('trul_unsaveHomeCTADetails');

_satellite.getToolsByType('sc')[0].getS().events = undefined;
_satellite.getToolsByType('sc')[0].getS().list1 = undefined;
_satellite.getToolsByType('sc')[0].getS().list2 = undefined;
_satellite.notify('cleared trulia.analytics._event_data, events-related dataelements and s.events', 4);
});
