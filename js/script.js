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
  // 7. CONTACT FORM SUBMISSION & EMAIL OTP VERIFICATION
  // ----------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const otpCard = document.getElementById('otp-card');
  const otpForm = document.getElementById('otp-form');
  const otpInput = document.getElementById('otp-code-input');
  const otpTargetEmail = document.getElementById('otp-target-email');
  const otpVerifyBtn = document.getElementById('otp-verify-btn');
  const otpResendBtn = document.getElementById('otp-resend-btn');
  const otpResendCountdown = document.getElementById('otp-resend-countdown');
  const otpBackBtn = document.getElementById('otp-back-btn');
  const otpFeedback = document.getElementById('otp-feedback');

  let currentVerificationToken = null;
  let resendCountdownTimer = null;

  function startResendCooldown(seconds = 60) {
    if (!otpResendBtn) return;
    if (resendCountdownTimer) clearInterval(resendCountdownTimer);

    let remaining = seconds;
    otpResendBtn.disabled = true;
    if (otpResendCountdown) otpResendCountdown.textContent = remaining;
    otpResendBtn.innerHTML = `Resend code (<span id="otp-resend-countdown">${remaining}</span>s)`;

    resendCountdownTimer = setInterval(() => {
      remaining -= 1;
      const countSpan = document.getElementById('otp-resend-countdown');
      if (countSpan) countSpan.textContent = remaining;

      if (remaining <= 0) {
        clearInterval(resendCountdownTimer);
        resendCountdownTimer = null;
        otpResendBtn.disabled = false;
        otpResendBtn.innerHTML = `Resend code`;
      }
    }, 1000);
  }

  // --- Step 1: Submit Initial Contact Form (Triggers OTP Send) ---
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
        formFeedback.textContent = 'Verifying email & sending 6-digit confirmation code...';
        formFeedback.className = 'form-feedback';
      }
      if (submitBtn) submitBtn.disabled = true;

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'send_otp',
            name,
            email,
            subject,
            message
          })
        });

        const data = await response.json().catch(() => null);

        if (response.ok && data && data.success && data.step === 'otp_required') {
          // Success: Store verification token & transition to OTP card
          currentVerificationToken = data.verificationToken;

          if (formFeedback) formFeedback.textContent = '';
          if (otpTargetEmail) otpTargetEmail.textContent = email;

          // Transition to OTP verification card
          contactForm.classList.add('is-hidden');
          if (otpCard) {
            otpCard.classList.remove('is-hidden');
          }

          if (otpInput) {
            otpInput.value = '';
            otpInput.focus();
          }

          startResendCooldown(60);
          showToast('✓ 6-Digit code sent to your email!');
        } else {
          // Explicit error message from backend
          const errorMsg = (data && data.message) ? data.message : `Server error (HTTP ${response.status})`;
          if (formFeedback) {
            formFeedback.textContent = `❌ ${errorMsg}`;
            formFeedback.className = 'form-feedback error';
          }
          console.error('Submission Error:', data);
          showToast('⚠️ Could not send verification code');
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
      }
    });
  }

  // --- Step 2: Submit OTP Verification Code ---
  if (otpForm) {
    otpForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const enteredOtp = otpInput ? otpInput.value.trim() : '';

      if (!enteredOtp || enteredOtp.length !== 6) {
        if (otpFeedback) {
          otpFeedback.textContent = 'Please enter the complete 6-digit code sent to your inbox.';
          otpFeedback.className = 'form-feedback error';
        }
        return;
      }

      if (!currentVerificationToken) {
        if (otpFeedback) {
          otpFeedback.textContent = 'Verification session expired. Please edit and submit again.';
          otpFeedback.className = 'form-feedback error';
        }
        return;
      }

      if (otpFeedback) {
        otpFeedback.textContent = 'Verifying code & delivering message...';
        otpFeedback.className = 'form-feedback';
      }
      if (otpVerifyBtn) otpVerifyBtn.disabled = true;

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'verify_otp',
            verificationToken: currentVerificationToken,
            otp: enteredOtp
          })
        });

        const data = await response.json().catch(() => null);

        if (response.ok && data && data.success) {
          if (otpFeedback) {
            otpFeedback.textContent = '✓ Email verified! Your message has been delivered to Vijay Karthik.';
            otpFeedback.className = 'form-feedback success';
          }
          showToast('✓ Message delivered successfully!');

          // Reset forms
          currentVerificationToken = null;
          if (contactForm) contactForm.reset();

          // After 4 seconds, reset view back to clean contact form
          setTimeout(() => {
            if (otpCard) otpCard.classList.add('is-hidden');
            if (contactForm) contactForm.classList.remove('is-hidden');
            if (otpFeedback) otpFeedback.textContent = '';
          }, 4000);
        } else {
          const errorMsg = (data && data.message) ? data.message : 'Verification failed. Please try again.';
          if (otpFeedback) {
            otpFeedback.textContent = `❌ ${errorMsg}`;
            otpFeedback.className = 'form-feedback error';
          }
          showToast('⚠️ Incorrect verification code');
        }
      } catch (err) {
        console.error('OTP verification error:', err);
        if (otpFeedback) {
          otpFeedback.textContent = '❌ Network connection error. Please try again.';
          otpFeedback.className = 'form-feedback error';
        }
      } finally {
        if (otpVerifyBtn) otpVerifyBtn.disabled = false;
      }
    });
  }

  // --- Step 2 Controls: Edit Message / Back ---
  if (otpBackBtn) {
    otpBackBtn.addEventListener('click', () => {
      if (otpCard) otpCard.classList.add('is-hidden');
      if (contactForm) contactForm.classList.remove('is-hidden');
      if (otpFeedback) otpFeedback.textContent = '';
      if (formFeedback) formFeedback.textContent = '';
    });
  }

  // --- Step 2 Controls: Resend OTP Code ---
  if (otpResendBtn) {
    otpResendBtn.addEventListener('click', async () => {
      if (!currentVerificationToken || otpResendBtn.disabled) return;

      if (otpFeedback) {
        otpFeedback.textContent = 'Sending a fresh verification code...';
        otpFeedback.className = 'form-feedback';
      }
      otpResendBtn.disabled = true;

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'resend_otp',
            verificationToken: currentVerificationToken
          })
        });

        const data = await response.json().catch(() => null);

        if (response.ok && data && data.success) {
          if (data.verificationToken) {
            currentVerificationToken = data.verificationToken;
          }
          if (otpFeedback) {
            otpFeedback.textContent = '✓ A fresh 6-digit code has been sent to your email.';
            otpFeedback.className = 'form-feedback success';
          }
          showToast('✓ Fresh code sent to your email!');
          startResendCooldown(60);
        } else {
          const errorMsg = (data && data.message) ? data.message : 'Failed to resend code.';
          if (otpFeedback) {
            otpFeedback.textContent = `❌ ${errorMsg}`;
            otpFeedback.className = 'form-feedback error';
          }
        }
      } catch (err) {
        console.error('Resend error:', err);
        if (otpFeedback) {
          otpFeedback.textContent = '❌ Network error resending code.';
          otpFeedback.className = 'form-feedback error';
        }
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
