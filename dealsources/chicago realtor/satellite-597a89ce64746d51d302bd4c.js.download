_satellite.pushAsyncScript(function(event, target, $variables){
  var hitTime = (new Date).getTime();
if (!_satellite.readCookie('trul_visitTimer')
    || ((hitTime - _satellite.readCookie('trul_visitTimer').split('_')[1]) > 1800000) ) {
    _satellite.setCookie('trul_visitTimer',hitTime+'_'+hitTime);
}
var visitStartTime = _satellite.readCookie('trul_visitTimer').split('_')[0];
if ( (hitTime - visitStartTime) < 91000) { 
    var secondsCounter = setInterval(visitEvents, 1000);
}
_satellite.setCookie('trul_visitTimer',visitStartTime+'_'+hitTime);

function visitEvents() {
    var visitTime = ((new Date().getTime() - visitStartTime)/1e3).toFixed() - 0; //in seconds, rounded, auto-converted to number
    switch (true) {
        case (visitTime >= 91):
            clearInterval(secondsCounter);
            break;
        case (visitTime == 90):
            trackTimerEvent('event103', visitTime);
            break;
        case (visitTime == 60):
            trackTimerEvent('event102', visitTime);
            break;
        case (visitTime == 35):
            trackTimerEvent('event101', visitTime);
            break;
        default:
            _satellite.notify(visitTime + ' sec');
    }
}
function trackTimerEvent(e,t) {
    _satellite.notify('event = ' + e, 4);
    if (typeof s === 'undefined' || typeof s.account === 'undefined') {
        window.s = new AppMeasurement();
        window.s.account = window.location.host.indexOf('stage\.') == -1 ? 'truliaexternalapps' : 'truliamobiledev' ;
    }
    window.s = s_gi(window.s.account);
    window.s.events = e;
    window.s.linkTrackEvents = window.s.events;
    window.s.tl(true, 'o', 'visit timer '+t+' seconds');
    window.s.events = '';
}
});
