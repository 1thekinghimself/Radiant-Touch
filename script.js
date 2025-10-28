// Performance optimization: Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add loaded class to body for smooth transition
    document.body.classList.add('critical-css-loaded');

    // Mobile menu toggle with smooth animation
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = mobileMenuBtn.contains(event.target) || navLinks.contains(event.target);
            if (!isClickInside && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        });

        // Close mobile menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
                }
            });
        });
    }

    // Star rating functionality with smooth transitions
    const stars = document.querySelectorAll('.rating-input i');
    const ratingValue = document.getElementById('rating-value');

    if (stars.length && ratingValue) {
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                ratingValue.value = value;
                updateStars(value);
                
                // Add a small bounce animation
                stars.forEach(s => {
                    if (s.getAttribute('data-value') <= value) {
                        s.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            s.style.transform = 'scale(1)';
                        }, 200);
                    }
                });
            });
            
            star.addEventListener('mouseover', function() {
                const value = this.getAttribute('data-value');
                updateStars(value);
            });
            
            star.addEventListener('mouseout', function() {
                if (ratingValue.value) {
                    updateStars(ratingValue.value);
                } else {
                    updateStars(0);
                }
            });
        });

        function updateStars(value) {
            stars.forEach(s => {
                if (s.getAttribute('data-value') <= value) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                    s.style.color = '#fbbf24';
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                    s.style.color = '#ddd';
                }
            });
        }
    }

    // Smooth scroll for anchor links with requestAnimationFrame
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    // Use requestAnimationFrame for smooth scrolling
                    const startPosition = window.pageYOffset;
                    const distance = offsetPosition - startPosition;
                    const duration = 1000;
                    let startTime = null;

                    function animation(currentTime) {
                        if (startTime === null) startTime = currentTime;
                        const timeElapsed = currentTime - startTime;
                        const run = ease(timeElapsed, startPosition, distance, duration);
                        window.scrollTo(0, run);
                        if (timeElapsed < duration) requestAnimationFrame(animation);
                    }

                    function ease(t, b, c, d) {
                        t /= d / 2;
                        if (t < 1) return c / 2 * t * t + b;
                        t--;
                        return -c / 2 * (t * (t - 2) - 1) + b;
                    }

                    requestAnimationFrame(animation);
                }
            }
        });
    });

    // Header scroll effect with throttling
    let lastScroll = 0;
    const header = document.querySelector('header');
    let ticking = false;

    function updateHeader() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // Intersection Observer for fade-in animations with performance optimization
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translate3d(0, 0, 0)';
                });
            }
        });
    }, observerOptions);

    // Observe service cards with staggered animation
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translate3d(0, 30px, 0)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe testimonials
    document.querySelectorAll('.testimonial').forEach((testimonial, index) => {
        testimonial.style.opacity = '0';
        testimonial.style.transform = 'translate3d(0, 30px, 0)';
        testimonial.style.transition = `all 0.6s ease ${index * 0.15}s`;
        observer.observe(testimonial);
    });

    // Observe founder section
    const founderContainer = document.querySelector('.founder-container');
    if (founderContainer) {
        founderContainer.style.opacity = '0';
        founderContainer.style.transform = 'translate3d(0, 30px, 0)';
        founderContainer.style.transition = 'all 0.6s ease 0.2s';
        observer.observe(founderContainer);
    }

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translate3d(0, 30px, 0)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Advanced lazy loading for images with Intersection Observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    delete img.dataset.src;
                }
                
                if (img.dataset.bg) {
                    img.style.backgroundImage = `url(${img.dataset.bg})`;
                    delete img.dataset.bg;
                }
                
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    // Lazy load all images and background images
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });

    document.querySelectorAll('[data-bg]').forEach(element => {
        imageObserver.observe(element);
    });

    // Service card background image lazy loading with error handling
    document.querySelectorAll('.service-img[data-bg]').forEach(serviceImg => {
        const bgImage = serviceImg.dataset.bg;
        if (bgImage) {
            const img = new Image();
            img.onload = function() {
                requestAnimationFrame(() => {
                    serviceImg.style.backgroundImage = `url(${bgImage})`;
                    serviceImg.style.opacity = '0';
                    setTimeout(() => {
                        serviceImg.style.transition = 'opacity 0.5s ease';
                        serviceImg.style.opacity = '1';
                    }, 100);
                });
            };
            img.onerror = function() {
                // Fallback background color if image fails to load
                serviceImg.style.backgroundColor = '#e5e7eb';
            };
            img.src = bgImage;
        }
    });

    // Parallax effect for hero section with requestAnimationFrame
    let parallaxEnabled = true;
    
    function updateParallax() {
        if (!parallaxEnabled) return;
        
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            const yPos = -(scrolled * 0.5);
            heroBackground.style.transform = `translate3d(0, ${yPos}px, 0)`;
        }
        
        requestAnimationFrame(updateParallax);
    }

    // Only enable parallax if user doesn't prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        requestAnimationFrame(updateParallax);
    } else {
        parallaxEnabled = false;
    }

    // Form submission enhancement with proper FormSubmit integration
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const loader = submitBtn.querySelector('.loader');
            
            if (submitBtn) {
                btnText.style.display = 'none';
                loader.style.display = 'inline-block';
                submitBtn.disabled = true;
                
                // Let FormSubmit handle the submission naturally
                // Forms will redirect to thank-you.html as specified in the _next parameter
                
                // For better UX, you can optionally use AJAX submission
                // Uncomment the following code if you want to use AJAX instead:
                /*
                e.preventDefault();
                
                // Collect form data
                const formData = new FormData(this);
                
                // Use Fetch API to submit to FormSubmit
                fetch(this.action, {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (response.ok) {
                        // Redirect to thank you page
                        window.location.href = 'thank-you.html';
                    } else {
                        throw new Error('Form submission failed');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was a problem with your submission. Please try again or contact us directly.');
                    btnText.style.display = 'inline';
                    loader.style.display = 'none';
                    submitBtn.disabled = false;
                });
                */
            }
        });
    });

    // Add animation to stats with requestAnimationFrame
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }

    // Initialize stats animation
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats-section');

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count'));
                    animateValue(stat, 0, target, 2000);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Scroll indicator fade out
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            scrollIndicator.style.opacity = Math.max(1 - scrolled / 300, 0);
        });
    }

    // Add ripple effect to buttons with performance optimization
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Back to top button with smooth scrolling
    const backToTopBtn = document.querySelector('.back-to-top');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    backToTopBtn.addEventListener('click', function() {
        const startPosition = window.pageYOffset;
        const duration = 1000;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, -startPosition, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    });

    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Rate Us Modal functionality
    const rateModal = document.getElementById('rateModal');
    const openRateModalBtn = document.querySelector('.open-rate-modal');
    const closeRateModalBtn = document.querySelector('.modal-close');
    const cancelRateModalBtn = document.querySelector('.modal-cancel');
    const rateUsButtons = document.querySelectorAll('.rate-us-btn');

    function openRateModal() {
        rateModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeRateModal() {
        rateModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Open modal when clicking "Rate Your Experience" button
    if (openRateModalBtn) {
        openRateModalBtn.addEventListener('click', openRateModal);
    }

    // Open modal when clicking any "Rate Us" button
    rateUsButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openRateModal();
        });
    });

    // Close modal when clicking close button
    if (closeRateModalBtn) {
        closeRateModalBtn.addEventListener('click', closeRateModal);
    }

    // Close modal when clicking cancel button
    if (cancelRateModalBtn) {
        cancelRateModalBtn.addEventListener('click', closeRateModal);
    }

    // Close modal when clicking outside the modal
    if (rateModal) {
        rateModal.addEventListener('click', function(e) {
            if (e.target === rateModal) {
                closeRateModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && rateModal && rateModal.classList.contains('active')) {
            closeRateModal();
        }
    });

    // Performance optimization: Preload above-the-fold images
    function preloadCriticalImages() {
        const criticalImages = document.querySelectorAll('img[loading="eager"]');
        criticalImages.forEach(img => {
            const src = img.getAttribute('src');
            if (src) {
                const image = new Image();
                image.src = src;
            }
        });
    }

    // Initialize preloading
    preloadCriticalImages();

    // Console welcome message
    console.log('%c🎨 Website Developed by GrowithAI', 'color: #1a9ee5; font-size: 16px; font-weight: bold;');
    console.log('%c🚀 Modern, Fast, and Responsive', 'color: #00d4ff; font-size: 14px;');
    console.log('%c⚡ Performance Optimized with Lazy Loading & Frame Motion', 'color: #10b981; font-size: 12px;');
});

// Performance optimization: Load non-critical resources after page load
window.addEventListener('load', function() {
    // Load non-critical CSS (if any)
    const nonCriticalCSS = [
        // Add any non-critical CSS files here
    ];

    nonCriticalCSS.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print';
        link.onload = function() {
            this.media = 'all';
        };
        document.head.appendChild(link);
    });

    // Preload below-the-fold images
    const belowFoldImages = document.querySelectorAll('img[loading="lazy"]');
    belowFoldImages.forEach(img => {
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            img.src = img.dataset.src || img.src;
        }
    });
});

// Service Worker registration for performance (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
            
            console.log(`Page Load Time: ${pageLoadTime}ms`);
            console.log(`DOM Ready Time: ${domReadyTime}ms`);
            
            // Send to analytics if needed
            if (pageLoadTime > 3000) {
                console.warn('Page load time is slow. Consider optimizing.');
            }
        }, 0);
    });
}