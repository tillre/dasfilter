
(function() {

  //
  // helpers
  //

  function byId(id) {
    return document.getElementById(id);
  }

  function bySel(elem, selector) {
	  if (elem && !selector) {
      selector = elem;
      elem = document;
    }
    return elem.querySelectorAll(selector);
  }

  function bySel1(elem, selector) {
	  var elems = bySel(elem, selector);
	  return elems.length > 0 ? elems[0] : null;
  }

  function byTagName1(name) {
    var elems = document.getElementsByTagName(name);
    return elems.length > 0 ? elems[0] : null;
  }

  function createNode(html, elemType) {
    var d = document.createElement(elemType || 'div');
    d.innerHTML = html;
    return d.firstChild;
  }

  function forEach(nodes, iterator) {
    Array.prototype.forEach.call(nodes, iterator);
  }


  function enableWindowScroll() {
    document.body.style.overflow = 'scroll';
  }
  function disableWindowScroll() {
    document.body.style.overflow = 'hidden';
  }

  //
  // main header
  //
  function mainHeader() {
    var header = byId('header');
    var bar = byId('nav-bar');
    var drawer = byId('nav-drawer');
    var cloak = byId('header-cloak');
    var main = byTagName1('main');

    if (!header) return;
    var open = false;

    function toggleMenu() {
      if (!open) {
        disableWindowScroll();
        cloak.style.display = 'block';
        drawer.style.left = '0px';
        main.style.left = drawer.offsetWidth + 'px';
      }
      else {
        enableWindowScroll();
        cloak.style.display = 'none';
        drawer.style.left = -drawer.offsetWidth + 'px';
        main.style.left = '0px';
      }
      open = !open;
    }

    bySel1(bar, '.drawer-btn').addEventListener('click', function(e) {
      e.preventDefault();
      toggleMenu();
    });

    cloak.addEventListener('click', function(e) {
      toggleMenu();
    });
  }

  //
  // slideshows
  //
  function slideshows(rootNode) {

    function createSlideshow(node) {
      var thumbs = bySel(node, '.thumb');
      var slides = bySel(node, '.slide-image img');
      var captions = bySel(node, '.slide-caption small');

      var numSlides = thumbs.length;
      var curIndex = 0;
      var isOpen = false;

      var modal = bySel1(node, '.modal');
      var slide = bySel1(modal, '.slide-image');

      var closeButton = bySel1(modal, '.close');
      var prevButton = bySel1(modal, '.prev');
      var nextButton = bySel1(modal, '.next');

      prevButton.style.display = 'none';
      nextButton.style.display = numSlides > 0 ? 'block' : 'none';

      function loadImage(index) {
        if (index >= slides.length) {
          index = 0;
        }
        if (index < 0) {
          index = slides.length - 1;
        }
        prevButton.style.display = index > 0 ? 'block' : 'none';
        nextButton.style.display = index < slides.length - 2 ? 'block' : 'none';

        curIndex = index;
        var src = slides[index].getAttribute('data-src');
        slide.style.backgroundImage = 'url(' + src + ')';

        forEach(captions, function(caption, i) {
          caption.style.display = i === index ? 'block' : 'none';
        });
      }

      function onKeyUp(e) {
        switch(e.keyCode) {
        case 37: // left arrow
          return loadImage(curIndex - 1);
        case 39: // right arrow
        case 32: // space
          return loadImage(curIndex + 1);
        case 27: // escape
          return hideModal();
        }
      }

      function showModal(index) {
        modal.style.display = 'block';
        loadImage(index);
        isOpen = true;
        window.addEventListener('keyup', onKeyUp);
        disableWindowScroll();
      }

      function hideModal(index) {
        modal.style.display = 'none';
        isOpen = false;
        window.removeEventListener('keypress', onKeyUp);
        enableWindowScroll();
      }

      forEach(thumbs, function(thumb, index) {
        thumb.addEventListener('click', function(e) {
          e.preventDefault();
          showModal(index);
        });
      });

      closeButton.addEventListener('click', function(e) {
        e.preventDefault();
        hideModal();
      });

      prevButton.addEventListener('click', function(e) {
        e.preventDefault();
        loadImage(curIndex - 1);
      });

      nextButton.addEventListener('click', function(e) {
        e.preventDefault();
        loadImage(curIndex + 1);
      });
    }

    var nodes = bySel(rootNode, '.slideshow');
    forEach(nodes, function(node) {
      createSlideshow(node);
    });
  }


  //
  // ready
  //
  document.addEventListener('DOMContentLoaded', function(e) {
    mainHeader();
    slideshows(document.body);

    // open external links that start with http(s) in a new window
    var l = document.location;
    var r = new RegExp('^(?!' + l.protocol + '\/\/(www.)?' + l.host + ')http');
    var links = document.getElementsByTagName('a');
    forEach(links, function(link) {
      if (r.test(link.getAttribute('href'))) {
        link.setAttribute('target', '_blank');
      }
    });
  });

})();