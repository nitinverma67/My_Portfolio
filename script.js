(function () {
  var BIOME_SCRIMS = {
    home: 'linear-gradient(180deg, rgba(12, 18, 28, 0.56) 0%, rgba(10, 14, 18, 0.86) 100%)',
    certificates: 'linear-gradient(180deg, rgba(26, 20, 12, 0.58) 0%, rgba(16, 13, 9, 0.88) 100%)',
    internships: 'linear-gradient(180deg, rgba(22, 18, 12, 0.56) 0%, rgba(14, 12, 9, 0.88) 100%)',
    projects: 'linear-gradient(180deg, rgba(10, 22, 16, 0.58) 0%, rgba(9, 15, 12, 0.88) 100%)',
    contact: 'linear-gradient(180deg, rgba(28, 10, 12, 0.62) 0%, rgba(15, 7, 9, 0.90) 100%)'
  };

  var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var biomeLayers = Array.prototype.slice.call(document.querySelectorAll('.biome-layer'));
  var biomeScrim = document.getElementById('biomeScrim');
  var nav = document.getElementById('nav');
  var menuToggle = document.getElementById('menuToggle');
  var topbar = document.getElementById('topbar');

  function closeMobileMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    menuToggle.textContent = '☰';
  }

  function changeBackground(pageId) {
    biomeLayers.forEach(function (layer) {
      layer.classList.toggle('active', layer.getAttribute('data-biome') === pageId);
    });
    if (biomeScrim && BIOME_SCRIMS[pageId]) {
      biomeScrim.style.background = BIOME_SCRIMS[pageId];
    }
  }

  function showPage(id) {
    var target = document.getElementById(id);
    if (!target) return;

    changeBackground(id);

    pages.forEach(function (page) {
      var selected = page.id === id;
      page.classList.toggle('active', selected);
      page.setAttribute('aria-hidden', String(!selected));
    });

    navLinks.forEach(function (link) {
      var selected = link.getAttribute('data-page') === id;
      link.classList.toggle('active', selected);
      if (selected) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    closeMobileMenu();

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      var pageId = link.getAttribute('data-page');
      if (pageId) showPage(pageId);
    });
  });

  Array.prototype.slice.call(document.querySelectorAll('[data-goto]')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pageId = btn.getAttribute('data-goto');
      if (pageId) showPage(pageId);
    });
  });

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      menuToggle.textContent = isOpen ? '×' : '☰';
    });

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    window.addEventListener('mousedown', function (e) {
      if (nav.classList.contains('open') && topbar && e.target instanceof Node && !topbar.contains(e.target)) {
        closeMobileMenu();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860 && nav.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // Smooth custom scroll & pointer parallax
  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var pointerX = 0;
  var pointerY = 0;
  var rafId = 0;

  function clamp(val, min, max) {
    return Math.min(max, Math.max(min, val));
  }

  function applyParallax() {
    rafId = 0;
    if (reducedMotionQuery.matches) return;
    var safeScroll = Math.max(0, window.scrollY || 0);
    var bgX = (pointerX * -16).toFixed(2);
    var bgY = (pointerY * -10 - clamp(safeScroll * 0.08, 0, 44)).toFixed(2);
    var fgX = (pointerX * 8).toFixed(2);
    var fgY = (pointerY * 6).toFixed(2);
    var cloudShift = (pointerX * -24 - clamp(safeScroll * 0.14, 0, 72)).toFixed(2);

    var root = document.documentElement;
    root.style.setProperty('--parallax-bg-x', bgX + 'px');
    root.style.setProperty('--parallax-bg-y', bgY + 'px');
    root.style.setProperty('--parallax-fg-x', fgX + 'px');
    root.style.setProperty('--parallax-fg-y', fgY + 'px');
    root.style.setProperty('--parallax-cloud', cloudShift + 'px');
  }

  function scheduleParallax() {
    if (!rafId) rafId = window.requestAnimationFrame(applyParallax);
  }

  window.addEventListener('mousemove', function (e) {
    if (!window.innerWidth || !window.innerHeight) return;
    pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    scheduleParallax();
  }, { passive: true });

  window.addEventListener('scroll', scheduleParallax, { passive: true });
  applyParallax();

  // Certificate filtering & modal
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var certCards = Array.prototype.slice.call(document.querySelectorAll('.certificate-card'));
  var certCount = document.getElementById('certCount');
  var certModal = document.getElementById('certModal');
  var certModalNumber = document.getElementById('certModalNumber');
  var certModalCategory = document.getElementById('certModalCategory');
  var certModalTitle = document.getElementById('certModalTitle');
  var certModalIssuer = document.getElementById('certModalIssuer');
  var certModalPath = document.getElementById('certModalPath');
  var closeCertModalBtn = document.getElementById('closeCertModalBtn');

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var activeFilter = button.getAttribute('data-filter') || 'all';
      var visibleCount = 0;

      filterButtons.forEach(function (btn) {
        var selected = btn === button;
        btn.classList.toggle('active', selected);
        btn.setAttribute('aria-pressed', String(selected));
      });

      certCards.forEach(function (card) {
        var matches = activeFilter === 'all' || card.getAttribute('data-category') === activeFilter;
        card.hidden = !matches;
        if (matches) visibleCount += 1;
      });

      if (certCount) {
        certCount.textContent = visibleCount + (visibleCount === 1 ? ' FILE' : ' FILES');
      }
    });
  });

  

  

  if (closeCertModalBtn && certModal) {
    closeCertModalBtn.addEventListener('click', function () {
      certModal.hidden = true;
    });
    certModal.addEventListener('click', function (e) {
      if (e.target === certModal) certModal.hidden = true;
    });
  }

  // Resume modal
 var openResumeBtn = document.getElementById('openResumeBtn');
var resumeModal = document.getElementById('resumeModal');
var closeResumeModalBtn = document.getElementById('closeResumeModalBtn');
var downloadResumeBtn = document.getElementById('downloadResumeBtn');

if (openResumeBtn && resumeModal) {
    openResumeBtn.addEventListener('click', function () {
        resumeModal.hidden = false;
    });
}

if (closeResumeModalBtn && resumeModal) {
    closeResumeModalBtn.addEventListener('click', function () {
        resumeModal.hidden = true;
    });

    resumeModal.addEventListener('click', function (e) {
        if (e.target === resumeModal) {
            resumeModal.hidden = true;
        }
    });
}

if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', function () {
        window.open('assets/Nitin%20Verma.pdf', '_blank');
    });
}

  // Contact form validation & local persistence
  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');
  var recentWrap = document.getElementById('recentMessagesWrap');
  var recentCount = document.getElementById('recentMessagesCount');
  var recentList = document.getElementById('recentMessagesList');
  var MOBILE_REGEX = /^[+0-9() -]{7,20}$/;
  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function loadMessages() {
    try {
      var raw = localStorage.getItem('nv_portfolio_messages');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function renderMessages() {
    if (!recentWrap || !recentCount || !recentList) return;
    var items = loadMessages();
    if (!items.length) {
      recentWrap.hidden = true;
      return;
    }
    recentWrap.hidden = false;
    recentCount.textContent = 'RECENT DISPATCHED MESSAGES (' + items.length + ')';
    recentList.innerHTML = '';
    items.forEach(function (msg) {
      var li = document.createElement('li');
      var strong = document.createElement('strong');
      strong.textContent = msg.name;
      li.appendChild(strong);
      li.appendChild(document.createTextNode(' · ' + msg.reason + ' · ' + msg.submittedAt));
      recentList.appendChild(li);
    });
  }

  function setFieldError(inputId, errorId, message) {
    var input = document.getElementById(inputId);
    var errEl = document.getElementById(errorId);
    if (input) {
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }
    if (errEl) {
      errEl.textContent = message || '';
      errEl.hidden = !message;
    }
  }

  if (contactForm) {
    renderMessages();

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameEl = /** @type {HTMLInputElement | null} */ (document.getElementById('name'));
      var mobileEl = /** @type {HTMLInputElement | null} */ (document.getElementById('mobile'));
      var emailEl = /** @type {HTMLInputElement | null} */ (document.getElementById('email'));
      var reasonEl = /** @type {HTMLSelectElement | null} */ (document.getElementById('reason'));
      var messageEl = /** @type {HTMLTextAreaElement | null} */ (document.getElementById('message'));

      var name = nameEl ? nameEl.value.trim() : '';
      var mobile = mobileEl ? mobileEl.value.trim() : '';
      var email = emailEl ? emailEl.value.trim() : '';
      var reason = reasonEl ? reasonEl.value.trim() : '';
      var message = messageEl ? messageEl.value.trim() : '';

      var errName = name.length < 2 ? 'Please enter your full name (at least 2 characters).' : '';
      var errMobile = !MOBILE_REGEX.test(mobile) ? 'Enter a valid mobile number (7 to 20 digits/symbols).' : '';
      var errEmail = !EMAIL_REGEX.test(email) ? 'Please provide a valid email address.' : '';
      var errReason = !reason ? 'Please select a reason for connecting.' : '';

      setFieldError('name', 'errorName', errName);
      setFieldError('mobile', 'errorMobile', errMobile);
      setFieldError('email', 'errorEmail', errEmail);
      setFieldError('reason', 'errorReason', errReason);

      if (errName || errMobile || errEmail || errReason) {
        if (formStatus) {
          formStatus.className = 'form-status error';
          formStatus.textContent = 'Please fix the highlighted fields before sending.';
          formStatus.hidden = false;
        }
        return;
      }

      var now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      var saved = loadMessages();
      saved.unshift({ name: name, mobile: mobile, email: email, reason: reason, message: message, submittedAt: now });
      saved = saved.slice(0, 5);
      try {
        localStorage.setItem('nv_portfolio_messages', JSON.stringify(saved));
      } catch (err) {
        // Ignore storage errors
      }

      contactForm.reset();
      renderMessages();

      if (formStatus) {
        formStatus.className = 'form-status success';
        formStatus.textContent = 'Message from ' + name + ' recorded (' + reason + '). Nitin will reply via ' + email + '.';
        formStatus.hidden = false;
      }
    });
  }

  showPage('home');
})();
