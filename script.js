/**
 * ==============================================================================
 * PORTFOLIO CLIENT-SIDE SCRIPT
 * Author: Ryali Venkata Sri Vijay Karthik
 * Description: Clean, lightweight interactive behaviors & dynamic hydration
 *              from config.js for the Positivus neo-brutalist portfolio.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------------------------------
  // 1. DYNAMIC HYDRATION FROM CONFIG.JS (Single Source of Truth)
  // ----------------------------------------------------------------------------
  function hydrateFromConfig() {
    if (typeof window.portfolioConfig === 'undefined') {
      console.info('portfolioConfig not found; using static HTML contents.');
      return;
    }

    const cfg = window.portfolioConfig;

    // --- Personal Information ---
    if (cfg.personal) {
      if (cfg.personal.bio) {
        const bioEl = document.querySelector('.hero-bio');
        if (bioEl) bioEl.innerHTML = cfg.personal.bio;
      }
      if (cfg.personal.statusBadge) {
        const statusEl = document.querySelector('.status-pill span:last-child');
        if (statusEl) statusEl.textContent = cfg.personal.statusBadge;
      }
      if (cfg.personal.avatarImage) {
        const heroImg = document.getElementById('hero-profile-img');
        if (heroImg) heroImg.src = cfg.personal.avatarImage;
      }
    }

    // --- Synchronize Document & Drive Links ---
    if (cfg.links) {
      if (cfg.links.resumeDriveLink) {
        document.querySelectorAll('[data-config="resume-link"]').forEach(el => {
          el.href = cfg.links.resumeDriveLink;
        });
      }
      if (cfg.links.transcriptDriveLink) {
        document.querySelectorAll('[data-config="transcript-link"]').forEach(el => {
          el.href = cfg.links.transcriptDriveLink;
        });
      }
    }

    // --- Dynamic Projects Grid Hydration ---
    if (Array.isArray(cfg.projects) && cfg.projects.length > 0) {
      const projectsGrid = document.getElementById('projects-grid');
      if (projectsGrid) {
        projectsGrid.innerHTML = cfg.projects.map(p => `
          <article class="project-card">
            <div class="project-header">
              <div class="project-meta">
                <span class="project-category">${p.category || 'Engineering'}</span>
                <span class="project-date">${p.date || ''}</span>
              </div>
              <h3 class="project-title">${p.title}</h3>
            </div>

            <p class="project-desc">${p.description}</p>

            ${Array.isArray(p.features) && p.features.length > 0 ? `
              <ul class="project-features">
                ${p.features.map(f => `<li>${f}</li>`).join('')}
              </ul>
            ` : ''}

            ${Array.isArray(p.tags) && p.tags.length > 0 ? `
              <div class="project-tech-tags">
                ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
              </div>
            ` : ''}

            <div class="project-footer">
              <a href="${p.githubUrl || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-primary project-btn">
                <span>${p.buttonText || 'View Repository'}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>
            </div>
          </article>
        `).join('');
      }
    }

    // --- Dynamic Experience Accordion Hydration ---
    if (Array.isArray(cfg.experience) && cfg.experience.length > 0) {
      const accordionList = document.getElementById('accordion-list');
      if (accordionList) {
        accordionList.innerHTML = cfg.experience.map((item, idx) => `
          <div class="accordion-item ${item.isOpen ? 'is-open' : ''}" data-accordion>
            <button class="accordion-header" aria-expanded="${item.isOpen ? 'true' : 'false'}">
              <div class="accordion-title-wrap">
                <span class="accordion-num">${item.num || String(idx + 1).padStart(2, '0')}</span>
                <div>
                  <h3 class="accordion-heading">${item.company} &bull; ${item.role}</h3>
                  <span class="accordion-meta">${item.meta || ''}</span>
                </div>
              </div>
              <span class="accordion-icon" aria-hidden="true"></span>
            </button>
            <div class="accordion-collapse">
              <div class="accordion-body">
                <p>${item.description}</p>
                ${Array.isArray(item.highlights) && item.highlights.length > 0 ? `
                  <ul class="detail-list">
                    ${item.highlights.map(h => `<li>${h}</li>`).join('')}
                  </ul>
                ` : ''}
                ${Array.isArray(item.links) && item.links.length > 0 ? `
                  <div class="accordion-actions">
                    ${item.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener noreferrer" class="inline-link">${l.label}</a>`).join('')}
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `).join('');
      }
    }

    // --- Dynamic Stats Grid Hydration ---
    if (Array.isArray(cfg.stats) && cfg.stats.length > 0) {
      const statsGrid = document.getElementById('stats-grid');
      if (statsGrid) {
        statsGrid.innerHTML = cfg.stats.map(s => `
          <div class="stat-card ${s.highlight ? 'highlight-card' : ''}">
            <div class="stat-number" data-count="${s.count}" data-suffix="${s.suffix || ''}">${s.count.toLocaleString()}${s.suffix || ''}</div>
            <div class="stat-title ${s.logo ? 'stat-title-flex' : ''}">
              ${s.logo ? `<img src="${s.logo}" alt="" class="stat-card-logo" />` : ''}
              <span>${s.title}</span>
            </div>
            <div class="stat-caption">${s.caption}</div>
          </div>
        `).join('');
      }
    }

    // --- Dynamic Certifications Grid Hydration ---
    if (Array.isArray(cfg.certifications) && cfg.certifications.length > 0) {
      const certGrid = document.getElementById('cert-grid');
      if (certGrid) {
        certGrid.innerHTML = cfg.certifications.map(c => `
          <a href="${c.verifyUrl || '#'}" target="_blank" rel="noopener noreferrer" class="cert-card">
            <div class="cert-icon">${c.icon || '📜'}</div>
            <div class="cert-info">
              <h4 class="cert-name">${c.title}</h4>
              <span class="cert-issuer">${c.issuer}</span>
            </div>
            <span class="cert-arrow">&nearr;</span>
          </a>
        `).join('');
      }
    }

    // --- Dynamic Education Hydration ---
    if (cfg.education) {
      const degreeEl = document.querySelector('.degree-title');
      if (degreeEl && cfg.education.degree) degreeEl.textContent = cfg.education.degree;

      const descEl = document.querySelector('.education-desc');
      if (descEl && cfg.education.description) descEl.textContent = cfg.education.description;

      const cgpaPill = document.querySelector('.education-header .meta-pill.highlight');
      if (cgpaPill && cfg.education.cgpa) cgpaPill.textContent = `CGPA: ${cfg.education.cgpa}`;

      const gradPill = document.querySelector('.education-header .meta-pill:last-child');
      if (gradPill && cfg.education.graduation) gradPill.textContent = cfg.education.graduation;

      if (Array.isArray(cfg.education.coursework) && cfg.education.coursework.length > 0) {
        const courseworkWrap = document.querySelector('.coursework-tags');
        if (courseworkWrap) {
          courseworkWrap.innerHTML = cfg.education.coursework.map(c => `<span class="course-tag">${c}</span>`).join('');
        }
      }
    }
  }

  // Hydrate page before binding interactive event handlers
  hydrateFromConfig();

  // ----------------------------------------------------------------------------
  // 2. DYNAMIC FOOTER YEAR
  // ----------------------------------------------------------------------------
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ----------------------------------------------------------------------------
  // 3. MOBILE NAVIGATION DRAWER TOGGLE
  // ----------------------------------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-active');
    });

    // Close menu upon tapping any navigation link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 4. INTERACTIVE ACCORDION (Experience & Project Detail)
  // ----------------------------------------------------------------------------
  function initAccordions() {
    const accordionItems = document.querySelectorAll('[data-accordion]');

    accordionItems.forEach(item => {
      const header = item.querySelector('.accordion-header');
      if (header) {
        // Remove existing listener if any to avoid duplicates
        header.onclick = null;
        header.addEventListener('click', () => {
          const isOpen = item.classList.contains('is-open');

          // Close all items for smooth accordion UX
          accordionItems.forEach(otherItem => {
            otherItem.classList.remove('is-open');
            const otherBtn = otherItem.querySelector('.accordion-header');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          });

          // Toggle current item if it wasn't open
          if (!isOpen) {
            item.classList.add('is-open');
            header.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });
  }

  initAccordions();

  // ----------------------------------------------------------------------------
  // 5. TOAST NOTIFICATION SYSTEM
  // ----------------------------------------------------------------------------
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message, duration = 3500) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // ----------------------------------------------------------------------------
  // 6. COPY EMAIL TO CLIPBOARD
  // ----------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'karthikryali2007@gmail.com';

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback for older browsers
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        showToast('✓ Email copied to clipboard!');
      } catch (err) {
        window.location.href = `mailto:${email}`;
      }
    });
  }

  // ----------------------------------------------------------------------------
  // 7. CONTACT FORM SUBMISSION (Node.js/Vercel SMTP with smart fallback)
  // ----------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const nameInput = document.getElementById('sender-name');
      const emailInput = document.getElementById('sender-email');
      const subjectInput = document.getElementById('sender-subject');
      const messageInput = document.getElementById('sender-message');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : 'Portfolio Inquiry';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        if (formFeedback) {
          formFeedback.textContent = 'Please fill out all fields before sending.';
          formFeedback.className = 'form-feedback error';
        }
        return;
      }

      // Basic client-side email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (formFeedback) {
          formFeedback.textContent = 'Please provide a valid email format (e.g., name@example.com).';
          formFeedback.className = 'form-feedback error';
        }
        return;
      }

      // Check if user is viewing as static file (file://)
      const isFileProtocol = window.location.protocol === 'file:';
      if (isFileProtocol) {
        if (formFeedback) {
          formFeedback.innerHTML = `⚠️ Viewing via <code>file://</code> protocol.<br>To send via SMTP with your <code>.env</code> credentials, run <code>npm start</code> in terminal and visit <strong>http://localhost:3000</strong>.<br>Launching your email client as fallback...`;
          formFeedback.className = 'form-feedback';
        }
        showToast('Launching default email client...');
        const mailSubject = encodeURIComponent(subject || `Portfolio Inquiry from ${name}`);
        const mailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        setTimeout(() => {
          window.location.href = `mailto:karthikryali2007@gmail.com?subject=${mailSubject}&body=${mailBody}`;
        }, 1200);
        return;
      }

      // Visual feedback: Sending state
      if (formFeedback) {
        formFeedback.textContent = 'Sending email via SMTP server...';
        formFeedback.className = 'form-feedback';
      }
      if (submitBtn) submitBtn.disabled = true;

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, subject, message })
        });

        const data = await response.json().catch(() => null);

        if (response.ok && data && data.success) {
          if (formFeedback) {
            formFeedback.textContent = '✓ Message sent successfully! An email confirmation has been sent to your address.';
            formFeedback.className = 'form-feedback success';
          }
          showToast('✓ Message sent successfully!');
          contactForm.reset();
        } else {
          // Explicit SMTP error message from backend
          const errorMsg = (data && data.message) ? data.message : `Server error (HTTP ${response.status})`;
          if (formFeedback) {
            formFeedback.textContent = `❌ ${errorMsg}`;
            formFeedback.className = 'form-feedback error';
          }
          console.error('SMTP Submission Failed:', data);
          showToast('⚠️ Failed to send via SMTP');
        }
      } catch (networkError) {
        // True network error: server is down or unreachable
        console.warn('Network error posting to /api/contact:', networkError);

        const mailSubject = encodeURIComponent(subject || `Portfolio Inquiry from ${name}`);
        const mailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoLink = `mailto:karthikryali2007@gmail.com?subject=${mailSubject}&body=${mailBody}`;

        if (formFeedback) {
          formFeedback.innerHTML = `⚠️ Node server unreachable at <code>/api/contact</code>. Run <code>npm start</code> to activate SMTP.<br>Opening default email client...`;
          formFeedback.className = 'form-feedback';
        }
        showToast('Opening default email client...');

        setTimeout(() => {
          window.location.href = mailtoLink;
        }, 1000);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        setTimeout(() => {
          if (formFeedback && formFeedback.classList.contains('success')) {
            formFeedback.textContent = '';
          }
        }, 8000);
      }
    });
  }

  // ----------------------------------------------------------------------------
  // 8. ACTIVE NAVIGATION SCROLLSPY
  // ----------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          activeLink.style.fontWeight = '700';
          activeLink.style.color = '#000';
        } else {
          activeLink.style.fontWeight = '';
          activeLink.style.color = '';
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ----------------------------------------------------------------------------
  // 9. PROFILE IMAGE ERROR HANDLING & FALLBACK
  // ----------------------------------------------------------------------------
  const profileImg = document.getElementById('hero-profile-img');
  if (profileImg) {
    profileImg.addEventListener('error', () => {
      profileImg.classList.add('fallback-active');
    });
  }

  // ----------------------------------------------------------------------------
  // 10. RELIABLE BACK-TO-TOP SCROLL (Fixes URL #top stuck issue)
  // ----------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const allTopLinks = document.querySelectorAll('a[href="#top"]');

  function scrollToTop(e) {
    if (e) e.preventDefault();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    // Cleanly remove #top from URL without reloading
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, null, window.location.pathname + window.location.search);
    }
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', scrollToTop);
  }

  allTopLinks.forEach(link => {
    link.addEventListener('click', scrollToTop);
  });

  // ----------------------------------------------------------------------------
  // 11. ANIMATED STATS NUMBER COUNTER (Scroll-Triggered)
  // ----------------------------------------------------------------------------
  function initStatsCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    let hasAnimatedStats = false;

    function animateCounters() {
      statNumbers.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'), 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 1600;
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Easing: easeOutExpo
          const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentCount = Math.floor(ease * target);

          counter.textContent = currentCount.toLocaleString() + suffix;

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            counter.textContent = target.toLocaleString() + suffix;
          }
        }

        requestAnimationFrame(update);
      });
    }

    if ('IntersectionObserver' in window && statNumbers.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimatedStats) {
            hasAnimatedStats = true;
            animateCounters();
            observer.disconnect();
          }
        });
      }, { threshold: 0.25 });

      const achievementsSection = document.getElementById('achievements');
      if (achievementsSection) {
        observer.observe(achievementsSection);
      }
    }
  }

  initStatsCounters();

});
