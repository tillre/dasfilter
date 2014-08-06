
(function() {

  function createMenu() {
    var $drawerBtn = $('.menu-btn');
    var $cloak = $('#content-cloak');

    var open = false;

    function toggleMenu(toggle) {
      if (typeof toggle !== 'undefined') {
        if ((open && toggle) || (!open && !toggle)) {
          return;
        }
      }
      $('body').toggleClass('open-off-canvas', !open);
      open = !open;
    }

    $drawerBtn.on('click', function(e) {
      e.preventDefault();
      toggleMenu();
    });
    $cloak.on('click', function() {
      toggleMenu(false);
    });
  }


  $(function() {
    createMenu();

    // open external links that start with http(s) in a new window
    var l = document.location;
    var r = new RegExp('^(?!' + l.protocol + '\/\/(www.)?' + l.host + ')http');
    $('a').each(function() {
      if (r.test(this.getAttribute('href'))) {
        this.setAttribute('target', '_blank');
      }
    });
  });

})();