(function(){
  function setCookie(name, value, days){
    var d = new Date();
    d.setTime(d.getTime() + days*24*60*60*1000);
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }
  function getCookie(name){
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }
  function hideBanner(){
    var banner = document.getElementById('cookie-banner');
    if (banner) banner.style.display = 'none';
  }
  function pushConsent(analytics){
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: analytics ? 'cookie_analytics_accepted' : 'cookie_analytics_declined', analytics_consent: analytics ? 'granted' : 'denied' });
  }
  window.wdaCookieConsent = { getCookie:getCookie, pushConsent:pushConsent };
  document.addEventListener('DOMContentLoaded', function(){
    var saved = getCookie('cookieConsent');
    if (saved) {
      try { pushConsent(!!JSON.parse(saved).analytics); } catch(e) {}
      hideBanner();
      return;
    }
    var accept = document.getElementById('cookie-accept');
    var decline = document.getElementById('cookie-decline');
    if (accept) accept.addEventListener('click', function(){
      setCookie('cookieConsent', JSON.stringify({ necessary:true, analytics:true }), 365);
      pushConsent(true);
      hideBanner();
    });
    if (decline) decline.addEventListener('click', function(){
      setCookie('cookieConsent', JSON.stringify({ necessary:true, analytics:false }), 365);
      pushConsent(false);
      hideBanner();
    });
  });
})();
