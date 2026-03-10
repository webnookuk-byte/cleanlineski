/* ============================================================
   CLEAN LINE SKI — main.js
   ============================================================ */

/* --- 1. Nav: transparent → solid on scroll ----------------- */
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function updateNav() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });
})();

/* --- 2. Mobile hamburger toggle ---------------------------- */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', function () {
    const isOpen = mobileNav.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();

/* --- 3. Scroll-triggered fade-in --------------------------- */
(function () {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  els.forEach(function (el) { observer.observe(el); });
})();

/* --- 4. FAQ accordion -------------------------------------- */
(function () {
  const questions = document.querySelectorAll('.faq-question');
  if (!questions.length) return;

  questions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const answer = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      questions.forEach(function (q) {
        q.setAttribute('aria-expanded', 'false');
        const a = q.nextElementSibling;
        if (a) a.classList.remove('open');
      });

      // Open clicked (unless it was already open)
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        if (answer) answer.classList.add('open');
      }
    });
  });
})();

/* --- 5. Contact form: Formspree fetch ---------------------- */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const msgEl = document.getElementById('form-msg');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const data = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          showMsg('success', 'Thanks — your enquiry has been sent. We\'ll be in touch shortly.');
        } else {
          return res.json().then(function (json) {
            throw new Error(json.error || 'Server error');
          });
        }
      })
      .catch(function () {
        showMsg('error', 'Something went wrong. Please email us directly at info@cleanlineski.co.uk');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Enquiry';
      });
  });

  function showMsg(type, text) {
    if (!msgEl) return;
    msgEl.className = 'form-msg ' + type;
    msgEl.textContent = text;
    msgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
})();
