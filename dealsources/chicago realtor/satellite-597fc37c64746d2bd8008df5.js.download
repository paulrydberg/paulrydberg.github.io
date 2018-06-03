_satellite.pushAsyncScript(function(event, target, $variables){
  //www new user registration listener v1.1
if (typeof(window._ENVIRONMENT) !== "undefined" && typeof(s) !== "undefined") {
    var wrappedStlFunction = s.tl;
    s.tl = function() {
        if (arguments[2] == "Registration") {   //new user registration sent by s.tl()
            window.callDtmDirectRule('registeredNewUser');
        }
        return wrappedStlFunction.apply(this, arguments);
    }
}
});
