// cookie.js
(function(){
  // Set a cookie
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days*24*60*60*1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/`;
  }
  // Read a cookie
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }
  // Hide the banner
  function hideBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.style.display = 'none';
  }

  // If consent already given or declined, hide immediately
  if (getCookie('cookieConsent')) {
    hideBanner();
    return;
  }

  // Wire up buttons
  document.getElementById('cookie-accept').addEventListener('click', function(){
    const prefs = { necessary: true, analytics: true, functionality: true };
    setCookie('cookieConsent', JSON.stringify(prefs), 365);
    hideBanner();
  });
  document.getElementById('cookie-decline').addEventListener('click', function(){
    const prefs = { necessary: true, analytics: false, functionality: false };
    setCookie('cookieConsent', JSON.stringify(prefs), 365);
    hideBanner();
  });
})();
