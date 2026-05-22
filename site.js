document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  function trackEvent(name, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, params || {}));
    if (window.gtag) window.gtag('event', name, params || {});
  }

  document.querySelectorAll('form[data-track-form]').forEach(function (form) {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      var page = form.querySelector('[name="page_source"]');
      var pos = form.querySelector('[name="form_position"]');
      var button = form.querySelector('button[type="submit"]');
      var originalText = button ? button.textContent : '';
      trackEvent('form_submit_attempt', { page_source: page ? page.value : '', form_position: pos ? pos.value : '' });

      if (button) { button.disabled = true; button.textContent = 'Sending...'; }
      try {
        var formData = new FormData(form);
        var response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        var data = await response.json().catch(function(){ return {}; });
        if (response.ok) {
          trackEvent('form_submit_success', { page_source: page ? page.value : '', form_position: pos ? pos.value : '' });
          if (window.Swal) {
            await Swal.fire({
              icon: 'success',
              title: 'Thank you',
              text: 'Your request has been sent. We will review it and reply by WhatsApp or email.',
              confirmButtonColor: '#c52037'
            });
          } else {
            alert('Thank you. Your request has been sent.');
          }
          form.reset();
          window.location.href = 'thank-you.html';
        } else {
          throw new Error(data.message || 'Form submission failed');
        }
      } catch (error) {
        trackEvent('form_submit_error', { page_source: page ? page.value : '', form_position: pos ? pos.value : '' });
        if (window.Swal) {
          Swal.fire({
            icon: 'error',
            title: 'Sorry, something went wrong',
            text: 'Please try again, or email jesse@cleandesignuk.com directly.',
            confirmButtonColor: '#c52037'
          });
        } else {
          alert('Sorry, something went wrong. Please email jesse@cleandesignuk.com directly.');
        }
      } finally {
        if (button) { button.disabled = false; button.textContent = originalText; }
      }
    });
  });

  document.querySelectorAll('[data-track-click]').forEach(function (link) {
    link.addEventListener('click', function () {
      trackEvent('contact_click', { contact_type: link.getAttribute('data-track-click') });
    });
  });
});

// V15: Mobile horizontal card controls for homepage sections
(function(){
  function setupSwipeControls(){
    document.querySelectorAll('.mobile-swipe-wrap').forEach(function(wrap){
      var track = wrap.querySelector('.mobile-swipe-track');
      if(!track) return;
      wrap.querySelectorAll('[data-swipe]').forEach(function(btn){
        if(btn.dataset.boundSwipe) return;
        btn.dataset.boundSwipe = 'true';
        btn.addEventListener('click', function(){
          var direction = btn.getAttribute('data-swipe') === 'prev' ? -1 : 1;
          var amount = Math.round(track.clientWidth * 0.88);
          track.scrollBy({ left: direction * amount, behavior: 'smooth' });
        });
      });
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupSwipeControls);
  else setupSwipeControls();
})();
