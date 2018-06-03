_satellite.pushAsyncScript(function(event, target, $variables){
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','//connect.facebook.net/en_US/fbevents.js');
// Line to enable Manual Only mode.
fbq('set', 'autoConfig', false, '472542819592762');
//Insert Your Facebook Pixel ID below.
fbq('init', '472542819592762');
fbq('track', "PageView");

var property_id = _satellite.getVar('trul_listingID');
//Facebook Events on Trulia Pages (ForSale HDP, ForRent HDP, ForRent BDP, Not For Sale HDP, SRP)
if (typeof(window.trulia) !== "undefined"
     && typeof(window.trulia.analytics) !== "undefined"
     && typeof(window.trulia.analytics._event_data) !== "undefined"
     && typeof(window.trulia.analytics._event_data.trul) !== "undefined"){
       //Search Event on SRP Pages
      if (window.trulia.analytics._event_data.trul.pageType == "srp") {
         fbq('track', 'Search', {content_type: 'product'});
      }
       //ViewContent Events on PDP Pages
      if (window.trulia.analytics._event_data.trul.pageType == "pdp"){
         if (window.trulia.analytics._event_data.trul.siteSection == "buy") {
           fbq('track', 'ViewContent', {content_type: 'product', PageType: 'ForSale HDP', content_ids: property_id});
        }
        else if (window.trulia.analytics._event_data.trul.siteSection == "rent") {
          if (window.trulia.analytics._event_data.trul.additionalListingTypes == "community"){
            fbq('track', 'ViewContent', {content_type: 'product', PageType: 'ForRent BDP', content_ids: property_id});
          }
          else if (window.trulia.analytics._event_data.trul.additionalListingTypes == "single"){
            fbq('track', 'ViewContent', {content_type: 'product', PageType: 'ForRent HDP', content_ids: property_id});
          }
        }
        else if (window.trulia.analytics._event_data.trul.siteSection == "sold") {
           fbq('track', 'ViewContent', {content_type: 'product', PageType: 'Not For Sale HDP'});
        }
      }
}
else {
  var urlPath = window.location.pathname;
  var urlPathSplit = urlPath.split('/');
  var urlAddress = urlPathSplit[1];
  if ((urlAddress == "p" || urlAddress == "c")
    && typeof(window.trulia.analytics.data) !== "undefined"
    && window.trulia.analytics.data.pageType == "pdp") {
      if (window.trulia.analytics.data.siteSection == "buy") {
        fbq('track', 'ViewContent', {content_type: 'product', PageType: 'ForSale HDP', content_ids: trulia.analytics.data.listingID});
      }
      else if (window.trulia.analytics.data.siteSection == "rent") {
        if (trulia.analytics.data.additionalListingTypes == "community"){
          fbq('track', 'ViewContent', {content_type: 'product', PageType: 'ForRent BDP', content_ids: trulia.analytics.data.listingID});          
        }
        else if (trulia.analytics.data.additionalListingTypes == "single") {
          fbq('track', 'ViewContent', {content_type: 'product', PageType: 'ForRent HDP', content_ids: trulia.analytics.data.listingID});
        }
        else {
          fbq('track', 'ViewContent', {content_type: 'product', PageType: 'ForRent Unknown', content_ids: trulia.analytics.data.listingID});
        }
      }
  }
}

//ViewContent Event on Seller Pages
if (/sell/.test(window.location.pathname) == true) {
  fbq('track', 'ViewContent', {content_type: 'product', PageType: 'SellerBoostLP'});
  //AddToWishlist Event on Seller Report Pages
  if (document.getElementById("report_header") != 'undefined'
      && document.getElementById("report_header") != null) {
    fbq('track', 'AddToWishlist', {content_type: 'product'});
 }
}
});
