self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('v1').then(function(cache) {
        return cache.addAll([
            'PurposeCalendarManager.html',
            'PurposeCalendarManager.js',
            'PurposeCalendar.html',
            'PurposeCalendar.js',
            'CumulativeGraphCalendar/c(n).png',
            'CumulativeGraphCalendar/CumulativeGraphCalendar.html',
            'CumulativeGraphCalendar/CumulativeGraphCalendar.js',
            'CumulativeGraphCalendar/n.png',
            'favicon48.png',
            'favicon72.png',
            'favicon128.png',
            'favicon256.png',
            'favicon512.png',
            'index.html',
            'sw.js'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then(function(response) {
      // caches.match() always resolves
      // but in case of success response will have value
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request).then(function (response) {
          // response may be used only once
          // we need to save clone to put one copy in cache
          // and serve second one
          let responseClone = response.clone();
          
          caches.open('v1').then(function (cache) {
            cache.put(event.request, responseClone);
          });
          return response;
        }).catch(function () {
          return caches.match('favicon.png');
        });
      }
    }));
  });