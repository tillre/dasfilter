
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
      open = !open;

      $('body').toggleClass('no-scroll', open);
      // delay to avoid transition bug in FF when overflow on parent is changed
      setTimeout(function() {
        $('body').toggleClass('open-off-canvas', open);
      }, 16);
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