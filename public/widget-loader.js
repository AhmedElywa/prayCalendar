/**
 * Prayer Calendar Widget Loader
 * Lightweight (~1KB) script to embed prayer times widget
 * Usage: Add <div id="pray-calendar-widget" data-lat="30.0" data-lng="31.0"></div>
 *        and include this script
 */
(() => {
  // Find container
  var container = document.getElementById('pray-calendar-widget');
  if (!container) return;

  // Read data attributes
  var lat = container.getAttribute('data-lat');
  var lng = container.getAttribute('data-lng');
  var address = container.getAttribute('data-address');
  var method = container.getAttribute('data-method') || '5';
  var lang = container.getAttribute('data-lang') || 'en';
  var theme = container.getAttribute('data-theme') || 'dark';
  var compact = container.getAttribute('data-compact') === 'true';
  var width = container.getAttribute('data-width') || '300';
  var height = container.getAttribute('data-height') || (compact ? '60' : '400');

  // Early exit if no location
  if (!lat && !lng && !address) {
    container.innerHTML = '<p style="color:#666;text-align:center;">No location specified</p>';
    return;
  }

  // Build widget URL
  var baseUrl = 'https://pray.ahmedelywa.com';
  var params = [];
  if (lat && lng) {
    params.push('lat=' + encodeURIComponent(lat));
    params.push('lng=' + encodeURIComponent(lng));
  } else if (address) {
    params.push('address=' + encodeURIComponent(address));
  }
  params.push('method=' + encodeURIComponent(method));
  params.push('lang=' + encodeURIComponent(lang));
  params.push('theme=' + encodeURIComponent(theme));
  if (compact) params.push('compact=true');

  var widgetUrl = baseUrl + '/widget?' + params.join('&');

  // Create iframe
  var iframe = document.createElement('iframe');
  iframe.src = widgetUrl;
  iframe.width = width;
  iframe.height = height;
  iframe.style.border = 'none';
  iframe.style.borderRadius = '8px';
  iframe.style.maxWidth = '100%';
  iframe.setAttribute('title', 'Prayer Times');
  iframe.setAttribute('loading', 'lazy');

  // Handle height messages from widget
  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'pray-calendar-widget-height') {
      iframe.height = e.data.height;
    }
  });

  // Insert iframe
  container.innerHTML = '';
  container.appendChild(iframe);
})();
