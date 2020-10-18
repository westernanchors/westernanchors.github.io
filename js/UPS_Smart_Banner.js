if(getMobileOperatingSystem() == "iOS") {
    document.write('<meta name="apple-itunes-app" content="app-id=336377331">');
} else if(getMobileOperatingSystem() == "Android") {
    document.write('<link rel="manifest" href="/assets/resources/.well-known/manifest.json">');
}

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }
    
    if (/android/i.test(userAgent)) {
        return "Android";
    }
    
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }
    
    return "unknown";
}
