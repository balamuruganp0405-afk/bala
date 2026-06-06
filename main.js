/* ==========================================
   1. PRELOADER (Runs immediately to prevent blocking)
   ========================================== */
(function() {
  const preloader = document.querySelector('.loader-overlay');
  if (preloader) {
    const hideLoader = () => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
        document.body.classList.add('page-loaded');
      }, 500);
    };

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
    }

    // Fallback: hide loader if loading takes too long
    setTimeout(hideLoader, 2000);
  }
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     2. DARK/LIGHT MODE TOGGLER (Permanently locked to dark mode)
     ========================================== */
  document.documentElement.setAttribute('data-theme', 'dark');

  /* ==========================================
     3. STICKY NAVBAR & ACTIVE NAV LINKS
     ========================================== */
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Sticky Class
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll Active Link highlighter
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}` || link.getAttribute('href') === `index.html#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  /* ==========================================
     4. MOBILE NAVIGATION DRAWER
     ========================================== */
  const burger = document.querySelector('.burger');
  const navMenu = document.querySelector('.nav-menu');
  const mobileLinks = document.querySelectorAll('.nav-link');

  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      burger.classList.toggle('toggle');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        burger.classList.remove('toggle');
      });
    });
  }

  /* ==========================================
     5. HERO ANIMATED TYPING EFFECT
     ========================================== */
  const typedSpan = document.querySelector('.typed-text');
  if (typedSpan) {
    const toTypeArray = JSON.parse(typedSpan.getAttribute('data-words') || '[]');
    const typingDelay = 100;
    const erasingDelay = 60;
    const newLetterDelay = 2000;
    let charIndex = 0;
    let arrayIndex = 0;

    function type() {
      if (charIndex < toTypeArray[arrayIndex].length) {
        typedSpan.textContent += toTypeArray[arrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
      } else {
        setTimeout(erase, newLetterDelay);
      }
    }

    function erase() {
      if (charIndex > 0) {
        typedSpan.textContent = toTypeArray[arrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
      } else {
        arrayIndex++;
        if (arrayIndex >= toTypeArray.length) arrayIndex = 0;
        setTimeout(type, typingDelay + 500);
      }
    }

    if (toTypeArray.length) {
      setTimeout(type, 1000);
    }
  }

  /* ==========================================
     6. SCROLL REVEAL ANIMATIONS
     ========================================== */
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if ('IntersectionObserver' in window && reveals.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if observer not supported
    reveals.forEach(el => el.classList.add('active'));
  }

  /* ==========================================
     7. ANIMATED STATS COUNTERS
     ========================================== */
  const counters = document.querySelectorAll('.counter');
  
  if ('IntersectionObserver' in window && counters.length > 0) {
    let countTriggered = false;

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countTriggered) {
          countTriggered = true;
          startCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    // Observe the stats section
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
      counterObserver.observe(statsSection);
    }

    function startCounters() {
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const stepTime = Math.max(Math.floor(duration / target), 15);
        let start = 0;

        const timer = setInterval(() => {
          start += Math.ceil(target / (duration / stepTime));
          if (start >= target) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = start;
          }
        }, stepTime);
      });
    }
  } else {
    // Fallback: fill targets immediately
    counters.forEach(counter => {
      counter.textContent = counter.getAttribute('data-target');
    });
  }

  /* ==========================================
     8. ANIMATED SKILL BARS (ABOUT PAGE)
     ========================================== */
  const skillSection = document.querySelector('.skills-grid');
  const skillBars = document.querySelectorAll('.skill-progress-bar');

  if ('IntersectionObserver' in window && skillSection && skillBars.length > 0) {
    const skillObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    skillObserver.observe(skillSection);
  } else if (skillBars.length > 0) {
    // Fallback
    skillBars.forEach(bar => {
      bar.style.width = bar.getAttribute('data-width') + '%';
    });
  }

  /* ==========================================
     9. PORTFOLIO TABS FILTER (HOME PAGE)
     ========================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  if (filterBtns.length > 0 && portfolioCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from other buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        portfolioCards.forEach(card => {
          const category = card.getAttribute('data-category');
          
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  /* ==========================================
     10. BLOG SEARCH & FILTER (BLOG PAGE)
     ========================================== */
  const blogSearch = document.getElementById('blog-search');
  const blogFilterBtns = document.querySelectorAll('.blog-filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');

  if (blogCards.length > 0) {
    let currentCategory = 'all';
    let searchQuery = '';

    function filterBlogPosts() {
      blogCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const title = card.querySelector('h3').textContent.toLowerCase();
        const desc = card.querySelector('p').textContent.toLowerCase();
        const matchesCategory = currentCategory === 'all' || category === currentCategory;
        const matchesSearch = title.includes(searchQuery) || desc.includes(searchQuery);

        if (matchesCategory && matchesSearch) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    }

    if (blogSearch) {
      blogSearch.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterBlogPosts();
      });
    }

    if (blogFilterBtns.length > 0) {
      blogFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          blogFilterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentCategory = btn.getAttribute('data-filter');
          filterBlogPosts();
        });
      });
    }
  }

  /* ==========================================
     11. TESTIMONIAL CAROUSEL
     ========================================== */
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  
  if (track && slides.length > 0 && dots.length > 0) {
    let slideIndex = 0;
    let autoSlideInterval;

    function updateCarousel() {
      const offset = -slideIndex * 100;
      track.style.transform = `translateX(${offset}%)`;
      
      dots.forEach(dot => dot.classList.remove('active'));
      dots[slideIndex].classList.add('active');
    }

    function startAutoSlide() {
      autoSlideInterval = setInterval(() => {
        slideIndex++;
        if (slideIndex >= slides.length) {
          slideIndex = 0;
        }
        updateCarousel();
      }, 5000);
    }

    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        slideIndex = index;
        updateCarousel();
        stopAutoSlide();
        startAutoSlide();
      });
    });

    // Pause on hover
    const carouselWrapper = document.querySelector('.testimonial-carousel');
    if (carouselWrapper) {
      carouselWrapper.addEventListener('mouseenter', stopAutoSlide);
      carouselWrapper.addEventListener('mouseleave', startAutoSlide);
    }

    startAutoSlide();
  }

  /* ==========================================
     12. FAQ ACCORDION
     ========================================== */
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  if (faqQuestions.length > 0) {
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const item = question.parentNode;
        const answer = item.querySelector('.faq-answer');
        const isActive = item.classList.contains('active');

        // Close other accordions
        document.querySelectorAll('.faq-item').forEach(el => {
          if (el !== item) {
            el.classList.remove('active');
            el.querySelector('.faq-answer').style.maxHeight = null;
          }
        });

        // Toggle self
        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* ==========================================
     13. BACK TO TOP BUTTON
     ========================================== */
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================
     14. CONTACT FORM SUBMISSION & SUCCESS MODAL
     ========================================== */
  const contactForm = document.getElementById('contact-form');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal');

  if (contactForm && successModal) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Perform validation check
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const service = document.getElementById('form-service').value;
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !service || !message) {
        alert('Please fill in all required fields.');
        return;
      }

      // Basic email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      // Show success modal
      successModal.classList.add('show');
      contactForm.reset();
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        successModal.classList.remove('show');
      });
    }

    // Close on outside click
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('show');
      }
    });
  }

  /* ==========================================
     15. NEWSLETTER FORM SUBMISSION
     ========================================== */
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        alert('Thank you for subscribing to our newsletter!');
        newsletterForm.reset();
      }
    });
  }

});
