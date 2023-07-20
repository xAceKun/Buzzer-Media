// Libraries//

/* Description: Custom JS file */

(function ($) {
  "use strict";

  /* Navbar Scripts */
  // jQuery to collapse the navbar on scroll
  $(window).on("scroll load", function () {
    if ($(".navbar").offset().top > 60) {
      $(".fixed-top").addClass("top-nav-collapse");
    } else {
      $(".fixed-top").removeClass("top-nav-collapse");
    }
  });

  window.addEventListener("scroll", function () {
    var header = document.querySelector(".header");
    header.classList.toggle("sticky", window.scrollY > 0);
  });

  // jQuery for page scrolling feature - requires jQuery Easing plugin
  $(function () {
    $(document).on("click", "a.page-scroll", function (event) {
      var $anchor = $(this);
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $($anchor.attr("href")).offset().top,
          },
          600,
          "easeInOutExpo"
        );
      event.preventDefault();
    });
  });

  // offcanvas script from Bootstrap + added element to close menu on click in small viewport
  $('[data-toggle="offcanvas"], .navbar-nav li a:not(.dropdown-toggle').on(
    "click",
    function () {
      $(".offcanvas-collapse").toggleClass("open");
    }
  );

  // hover in desktop mode
  function toggleDropdown(e) {
    const _d = $(e.target).closest(".dropdown"),
      _m = $(".dropdown-menu", _d);
    setTimeout(
      function () {
        const shouldOpen = e.type !== "click" && _d.is(":hover");
        _m.toggleClass("show", shouldOpen);
        _d.toggleClass("show", shouldOpen);
        $('[data-toggle="dropdown"]', _d).attr("aria-expanded", shouldOpen);
      },
      e.type === "mouseleave" ? 300 : 0
    );
  }
  $("body")
    .on("mouseenter mouseleave", ".dropdown", toggleDropdown)
    .on("click", ".dropdown-menu a", toggleDropdown);

  /* Move Form Fields Label When User Types */
  // for input and textarea fields
  $("input, textarea").keyup(function () {
    if ($(this).val() != "") {
      $(this).addClass("notEmpty");
    } else {
      $(this).removeClass("notEmpty");
    }
  });

  /* Back To Top Button */
  // create the back to top button
  $("body").prepend(
    '<a href="body" class="back-to-top page-scroll">Back to Top</a>'
  );
  var amountScrolled = 700;
  $(window).scroll(function () {
    if ($(window).scrollTop() > amountScrolled) {
      $("a.back-to-top").fadeIn("500");
    } else {
      $("a.back-to-top").fadeOut("500");
    }
  });

  /* Removes Long Focus On Buttons */
  $(".button, a, button").mouseup(function () {
    $(this).blur();
  });
})(jQuery);

// Magnet function

const lerp = (current, target, factor) => {
  return current * (1 - factor) + target * factor;
};

let mousePosition = { x: 0, y: 0 };
window.addEventListener("mousemove", (e) => {
  mousePosition.x = e.pageX;
  mousePosition.y = e.pageY;
});

const calculateDistance = (x1, y1, x2, y2) => {
  return Math.hypot(x1 - x2, y1 - y2);
};

class MagneticObject {
  constructor(domElement) {
    this.domElement = domElement;
    this.boundingClientRect = this.domElement.getBoundingClientRect();
    this.triggerArea = 1000;
    this.interpolationFactor = 0.8;

    this.lerpingData = {
      x: { current: 0, target: 0 },
      y: { current: 0, target: 0 },
    };
    this.resize();
    this.render();
  }
  resize() {
    window,
      addEventListener("resize", (e) => {
        this.boundingClientRect = this.domElement.getBoundingClientRect();
      });
  }

  render() {
    const distanceFromMouseToCenter = calculateDistance(
      mousePosition.x,
      mousePosition.y,
      this.boundingClientRect.left + this.boundingClientRect.width / 2,
      this.boundingClientRect.top + this.boundingClientRect.height / 2
    );
    let targetHolder = { x: 0, y: 0 };
    if (distanceFromMouseToCenter < this.triggerArea) {
      this.domElement.classList.add("focus");
      targetHolder.x =
        mousePosition.x -
        (this.boundingClientRect.left + this.boundingClientRect.width / 2);
      targetHolder.y =
        mousePosition.y -
        (this.boundingClientRect.top + this.boundingClientRect.height / 2);
    } else {
      this.domElement.classList.remove("focus");
    }
    this.lerpingData["x"].target = targetHolder.x;
    this.lerpingData["y"].target = targetHolder.y;
    for (const item in this.lerpingData) {
      this.lerpingData[item].current = lerp(
        this.lerpingData[item].current,
        this.lerpingData[item].target,
        this.interpolationFactor
      );
    }

    this.domElement.style.transform = `translate(${this.lerpingData["x"].current}px, ${this.lerpingData["y"].current}px`;

    window.requestAnimationFrame(() => this.render());
  }
}

var magnets = document.querySelectorAll(".magnetic");
var strength = 50;

magnets.forEach((magnet) => {
  magnet.addEventListener("mousemove", moveMagnet);
  magnet.addEventListener("mouseout", function (event) {
    TweenMax.to(event.currentTarget, 1, { x: 0, y: 0, ease: Power4.easeOut });
  });
});

function moveMagnet(event) {
  var magnetButton = event.currentTarget;
  var bounding = magnetButton.getBoundingClientRect();

  //console.log(magnetButton, bounding)

  TweenMax.to(magnetButton, 1, {
    x:
      ((event.clientX - bounding.left) / magnetButton.offsetWidth - 0.5) *
      strength,
    y:
      ((event.clientY - bounding.top) / magnetButton.offsetHeight - 0.5) *
      strength,
    ease: Power4.easeOut,
  });

  //magnetButton.style.transform = 'translate(' + (((( event.clientX - bounding.left)/(magnetButton.offsetWidth))) - 0.5) * strength + 'px,'+ (((( event.clientY - bounding.top)/(magnetButton.offsetHeight))) - 0.5) * strength + 'px)';
}
