/* ========================================
   Insaf Legal Associates - Main JavaScript
   v2.0 - Bilingual + Animations + Scroll-to-Top
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {

  /* ===== Mobile Nav Toggle ===== */
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (navToggle && nav) {
    const closeMenu = () => {
      navToggle.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
    navToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      nav.classList.toggle('open');
      // Lock body scroll while menu is open (prevents cross icon drift)
      const locked = nav.classList.contains('open');
      document.body.style.overflow = locked ? 'hidden' : '';
      document.documentElement.style.overflow = locked ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    // Close menu on outside click (menu overlay area)
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') &&
          !nav.contains(e.target) &&
          !navToggle.contains(e.target)) {
        closeMenu();
      }
    });
    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* ===== Sticky Header Shrink ===== */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 16px rgba(26,43,72,0.12)';
      } else {
        header.style.boxShadow = '0 2px 8px rgba(26,43,72,0.08)';
      }
    });
  }

  /* ===== Language Toggle (BN / EN) ===== */
  const langToggleBtns = document.querySelectorAll('.lang-toggle button');
  function applyLanguage(lang) {
    document.body.classList.remove('lang-bn', 'lang-en');
    document.body.classList.add('lang-' + lang);
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
    // Swap text using data attributes
    document.querySelectorAll('[data-bn][data-en]').forEach(el => {
      const newText = el.getAttribute('data-' + lang);
      if (!newText) return;
      // If element has child elements, only update first text node (preserve children)
      const firstTextNode = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
      if (firstTextNode) {
        firstTextNode.textContent = newText;
      } else if (el.children.length === 0) {
        // Pure text element (no children)
        el.textContent = newText;
      } else {
        // Element has child elements but no direct text - prepend text node
        // Check if data-bn-init was already applied to avoid duplicate
        if (!el.getAttribute('data-lang-init')) {
          const label = document.createTextNode(newText + ' ');
          el.insertBefore(label, el.firstChild);
          el.setAttribute('data-lang-init', lang);
        } else {
          // Update existing first text node
          el.firstChild.textContent = newText + ' ';
        }
      }
    });
    // Swap placeholder using data-placeholder-bn/en
    document.querySelectorAll('[data-placeholder-bn]').forEach(el => {
      const ph = el.getAttribute('data-placeholder-' + lang);
      if (ph) el.placeholder = ph;
    });
    // Update active button
    langToggleBtns.forEach(b => {
      const bLang = b.getAttribute('data-lang');
      b.classList.toggle('active', bLang === lang);
    });
    try { localStorage.setItem('insaf-lang', lang); } catch(e) {}
  }
  langToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      applyLanguage(lang);
    });
  });
  // Restore saved language
  let savedLang = 'bn';
  try { savedLang = localStorage.getItem('insaf-lang') || 'bn'; } catch(e) {}
  applyLanguage(savedLang);

  /* ===== Area Tabs (The Area / About) ===== */
  const areaTabs = document.querySelectorAll('.area-tab');
  const areaPanels = document.querySelectorAll('.area-panel');
  areaTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      areaTabs.forEach(t => t.classList.remove('active'));
      areaPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('panel-' + target);
      if (panel) {
        panel.classList.add('active');
        // re-trigger reveal animation on panel children
        panel.querySelectorAll('[data-reveal]').forEach(el => {
          el.classList.remove('revealed');
          setTimeout(() => el.classList.add('revealed'), 30);
        });
      }
    });
  });

  /* ===== Practice Area Filter ===== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('[data-category]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterItems.forEach((item, idx) => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = '';
          item.classList.remove('revealed');
          setTimeout(() => item.classList.add('revealed'), 30 + idx * 60);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ===== Contact Form Submit ===== */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const successBox = document.getElementById('formSuccess');
      if (successBox) {
        successBox.classList.add('show');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      contactForm.reset();
      setTimeout(() => {
        if (successBox) successBox.classList.remove('show');
      }, 6000);
    });
  }

  /* ===== Consultation Modal ===== */
  const modalTriggers = document.querySelectorAll('[data-modal="consult"]');
  const modal = document.getElementById('consultModal');
  if (modalTriggers.length && modal) {
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    const modalClose = modal.querySelector('.modal-close');
    if (modalClose) {
      modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    // Esc to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    // modal form
    const modalForm = modal.querySelector('form');
    if (modalForm) {
      modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const lang = document.body.classList.contains('lang-en') ? 'en' : 'bn';
        const msg = lang === 'en'
          ? 'Your consultation request has been received! We will contact you within 24 hours.'
          : 'আপনার কনসালটেশন রিকোয়েস্ট গ্রহণ করা হয়েছে! আমরা ২৪ ঘণ্টার মধ্যে যোগাযোগ করব।';
        alert(msg);
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modalForm.reset();
      });
    }
  }

  /* ===== Stats Counter Animation ===== */
  const statNumbers = document.querySelectorAll('.stat-item .number[data-count]');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'));
    const lang = document.body.classList.contains('lang-bn') ? 'bn' : 'en';
    const suffix = el.getAttribute('data-suffix-' + lang) || el.getAttribute('data-suffix') || '';
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      // Convert to Bengali numerals if lang is bn
      const val = current + suffix;
      if (document.body.classList.contains('lang-bn')) {
        el.textContent = toBengaliNumerals(val);
      } else {
        el.textContent = val;
      }
    }, 25);
  };
  const toBengaliNumerals = (str) => {
    const map = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};
    return String(str).replace(/[0-9]/g, d => map[d]);
  };
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => statObserver.observe(el));

  /* ===== Scroll Reveal Animations ===== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  // Footer columns reveal
  const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        footerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.footer-col').forEach((el, idx) => {
    el.style.transitionDelay = (idx * 0.15) + 's';
    footerObserver.observe(el);
  });

  /* ===== Smooth Scroll for Anchor Links ===== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length <= 1) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 90;
        const pos = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });
  });

  /* ===== Set Active Nav Based on Current Page ===== */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ===== Scroll-to-Top Button ===== */
  // Create button dynamically
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.className = 'scroll-top';
  scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
  scrollTopBtn.innerHTML = '↑';
  document.body.appendChild(scrollTopBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ===== Scroll Progress Bar ===== */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (scrollTop / docHeight) * 100;
    progressBar.style.width = pct + '%';
  });

  /* ===== Parallax on Hero Background ===== */
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < 700) {
        hero.style.backgroundPositionY = (scrolled * 0.4) + 'px';
      }
    }, { passive: true });
  }

  /* ===== Tilt Effect on Cards (optional, subtle) ===== */
  document.querySelectorAll('.practice-card, .amenity-item, .team-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const tiltX = (y - cy) / cy * 4;
      const tiltY = (cx - x) / cx * 4;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
