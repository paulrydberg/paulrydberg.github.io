_satellite.pushAsyncScript(function(event, target, $variables){
  if ( /google\./i.test(document.referrer) === true && /cid=/i.test(window.location.search) === false ) {
    var tripStartTime = (new Date).getTime();//in milliseconds
    _satellite.setCookie('trul_serpTimer',tripStartTime);
    var seoCounter = setInterval(seoEvents, 1000);
} else if (typeof _satellite.readCookie('trul_serpTimer') !== 'undefined') { //else if there's a timer cookie, it's still SERP traffic
    var seoCounter = setInterval(seoEvents, 1000);
}
function seoEvents() {
    var tripDuration = ((new Date().getTime() - _satellite.readCookie('trul_serpTimer'))/1e3).toFixed() - 0; //in seconds, rounded, auto-converted to number
    //if trip is more than 90 sec delete timer cookie to stop timer, else continue timer
    switch (true) {
        case (tripDuration >= 91):
            clearInterval(seoCounter);
            _satellite.removeCookie('trul_serpTimer');
            break;
        case (tripDuration == 90):
            trackSeoEvent('event106', tripDuration);
            break;
        case (tripDuration == 60):
            trackSeoEvent('event105', tripDuration);
            break;
        case (tripDuration == 35):
            trackSeoEvent('event104', tripDuration);
            break;
        default:
            _satellite.notify('SEO time ' + tripDuration + ' sec');
    }
}
function trackSeoEvent(e,t) {
    //handle mweb
    if (typeof s === 'undefined' || typeof s.account === 'undefined') {
        window.s = new AppMeasurement();
        window.s.account = window.location.host.indexOf('stage\.') == -1 ? 'truliaexternalapps' : 'truliamobiledev' ;
    }
    window.s = s_gi(window.s.account);
    //append event to s.events
    var events = window.s.events ? window.s.events.split(',') : [];
    events.push(e);
    window.s.events = events.join(',');

    window.s.linkTrackEvents = window.s.events;
    window.s.tl(true, 'o', 'seo timer '+t+' seconds');
    window.s.events = '';
    _satellite.notify('seo timer '+t+' sec, '+'seo event '+e, 4);
}
});
