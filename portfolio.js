/**
 * SAVAN GADHIYA - MODERN 3D INTERACTIVE PORTFOLIO SCRIPT
 * Features:
 *  - 3D Interactive Particle Constellation Canvas
 *  - Vanilla 3D Perspective Card Tilt with Specular Glare
 *  - Dynamic Typing Animation
 *  - Bento/Project Category Filtering
 *  - Interactive Developer Terminal CLI
 *  - Client-Side GitHub Pages Compatible Contact Handler
 */

document.addEventListener('DOMContentLoaded', () => {
    initSecurityShield();
    init3DBackgroundCanvas();
    init3DCardTilt();
    initTypewriter();
    initProjectFilter();
    initInteractiveTerminal();
    initNavigation();
    initContactForm();
});

/* ==========================================================================
   1. 3D INTERACTIVE PARTICLE CONSTELLATION CANVAS
   ========================================================================== */
function init3DBackgroundCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
    });

    // Particle object in 3D coordinate space
    const particleCount = Math.min(Math.floor(window.innerWidth / 18), 75);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: (Math.random() - 0.5) * width * 1.5,
            y: (Math.random() - 0.5) * height * 1.5,
            z: Math.random() * 800 + 100, // Depth
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            vz: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1,
            color: Math.random() > 0.4 ? 'rgba(99, 102, 241, ' : 'rgba(6, 182, 212, '
        });
    }

    const fov = 400; // Field of view

    function render() {
        // Smooth mouse damping
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        const tiltX = (mouseY - height / 2) * 0.0003;
        const tiltY = (mouseX - width / 2) * 0.0003;

        ctx.clearRect(0, 0, width, height);

        const projected = [];

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Move particle
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;

            // Boundary wrapping in 3D box
            if (p.x < -width) p.x = width;
            if (p.x > width) p.x = -width;
            if (p.y < -height) p.y = height;
            if (p.y > height) p.y = -height;
            if (p.z < 50) p.z = 900;
            if (p.z > 900) p.z = 50;

            // 3D rotation based on mouse movement
            const rotX = p.x * Math.cos(tiltY) + p.z * Math.sin(tiltY);
            const rotZ = -p.x * Math.sin(tiltY) + p.z * Math.cos(tiltY);
            const rotY = p.y * Math.cos(tiltX) - rotZ * Math.sin(tiltX);
            const finalZ = p.y * Math.sin(tiltX) + rotZ * Math.cos(tiltX);

            // Project 3D to 2D screen coordinates
            const scale = fov / (fov + finalZ);
            const screenX = width / 2 + rotX * scale;
            const screenY = height / 2 + rotY * scale;
            const alpha = Math.max(0.1, Math.min(0.85, (1 - finalZ / 1000) * 0.9));

            projected.push({ x: screenX, y: screenY, alpha, color: p.color, scale, radius: p.radius });

            // Draw glowing particle node
            ctx.beginPath();
            ctx.arc(screenX, screenY, p.radius * scale, 0, Math.PI * 2);
            ctx.fillStyle = p.color + alpha + ')';
            ctx.fill();
        }

        // Draw connective constellation lines
        for (let i = 0; i < projected.length; i++) {
            for (let j = i + 1; j < projected.length; j++) {
                const dx = projected[i].x - projected[j].x;
                const dy = projected[i].y - projected[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 110) {
                    const lineAlpha = (1 - dist / 110) * projected[i].alpha * 0.35;
                    ctx.beginPath();
                    ctx.moveTo(projected[i].x, projected[i].y);
                    ctx.lineTo(projected[j].x, projected[j].y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(render);
    }

    render();
}

/* ==========================================================================
   2. 3D CARD PERSPECTIVE TILT (VANILLA JS)
   ========================================================================== */
function init3DCardTilt() {
    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -12; // Max 12deg
            const rotateY = ((x - centerX) / centerX) * 12;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // If glare shine exists, position it towards mouse
            const shine = card.querySelector('.card-glass-shine');
            if (shine) {
                const percentX = (x / rect.width) * 100;
                const percentY = (y / rect.height) * 100;
                shine.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 255, 255, 0.22) 0%, transparent 60%)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            const shine = card.querySelector('.card-glass-shine');
            if (shine) {
                shine.style.background = `linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, transparent 60%)`;
            }
        });
    });
}

/* ==========================================================================
   3. TYPEWRITER ANIMATION
   ========================================================================== */
function initTypewriter() {
    const textElement = document.getElementById('typewriter-text');
    if (!textElement) return;

    const phrases = [
        "Full-Stack Web Developer",
        "Data Science Enthusiast",
        "BCA Student @ Atmiya Univ",
        "Python & Machine Learning Builder",
        "Java & Database Specialist"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 90;

    function tick() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 45;
        } else {
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 90;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 1800; // Pause at end of phrase
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 400; // Pause before new phrase
        }

        setTimeout(tick, typeSpeed);
    }

    tick();
}

/* ==========================================================================
   4. PROJECTS FILTER SYSTEM
   ========================================================================== */
function initProjectFilter() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-3d-card');

    if (!filterTabs.length || !projectCards.length) return;

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category') || '';

                if (filterValue === 'all' || category.includes(filterValue)) {
                    card.classList.remove('hide');
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 30);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });
}

/* ==========================================================================
   5. INTERACTIVE DEVELOPER TERMINAL CLI
   ========================================================================== */
function initInteractiveTerminal() {
    const terminalForm = document.getElementById('terminal-form');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const cmdPills = document.querySelectorAll('.cmd-pill');

    if (!terminalForm || !terminalInput || !terminalOutput) return;

    const commands = {
        help: () => `Available commands:
  • <strong class="text-accent">skills</strong>    : View full technical stack
  • <strong class="text-accent">projects</strong>  : List key projects & repositories
  • <strong class="text-accent">bio</strong>       : Read background & education summary
  • <strong class="text-accent">contact</strong>   : Get direct contact channels
  • <strong class="text-accent">github</strong>    : Open GitHub profile
  • <strong class="text-accent">clear</strong>     : Wipe terminal console`,

        skills: () => `Languages : Python, Java, PHP, JavaScript (ES6+), SQL
Web Dev   : HTML5, CSS3, Responsive Design, REST APIs, DOM
Data/ML   : Scikit-Learn, Pandas, NumPy, Matplotlib, K-Means
Systems   : MySQL Database, Git/GitHub, Linux CLI, Windows`,

        projects: () => `🚀 Flagship Production Project:
• Volt Shop — Full-Stack E-Commerce Web Platform & Admin Suite
  - Tech Stack : PHP, MySQL, JavaScript ES6, AI Chatbot
  - Highlights : Storefront, Cart, Product Reviews, Comprehensive Admin Suite
  - Live View  : http://localhost:8080/volt/index.html (Storefront & Admin Suite)
  - Repository : https://github.com/savangadhiya1/savangadhiyaportfolio`,

        bio: () => `Savan Gadhiya (Gadhiya Savan)
BCA Student at Atmiya University, Rajkot (2024 - 2026).
Seeking web engineering and data science internship opportunities.`,

        contact: () => `Email    : gadhiyasavan1@gmail.com
Phone    : +91 93281 98570
WhatsApp : https://wa.me/919328198570
Location : Rajkot, Gujarat, India`,

        github: () => {
            window.open('https://github.com/savangadhiya1', '_blank');
            return 'Opening https://github.com/savangadhiya1 in a new tab...';
        },

        sudo: () => 'Permission denied: guest user cannot execute administrative operations.',
        clear: () => {
            terminalOutput.innerHTML = '';
            return null;
        }
    };

    function runCommand(rawCmd) {
        const cmd = rawCmd.trim().toLowerCase();
        if (!cmd) return;

        // Append user line
        const userLine = document.createElement('p');
        userLine.className = 'term-line';
        userLine.innerHTML = `<span class="prompt">guest@portfolio:~$</span> ${escapeHTML(rawCmd)}`;
        terminalOutput.appendChild(userLine);

        if (commands[cmd]) {
            const result = commands[cmd]();
            if (result !== null) {
                const responseLine = document.createElement('div');
                responseLine.className = 'term-response';
                responseLine.innerHTML = `<pre style="font-family: inherit; margin: 0; white-space: pre-wrap;">${result}</pre>`;
                terminalOutput.appendChild(responseLine);
            }
        } else {
            const errorLine = document.createElement('p');
            errorLine.className = 'term-response';
            errorLine.style.color = '#F87171';
            errorLine.innerHTML = `command not found: "${escapeHTML(cmd)}". Type <strong class="text-accent">help</strong> for valid commands.`;
            terminalOutput.appendChild(errorLine);
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    terminalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = terminalInput.value;
        terminalInput.value = '';
        runCommand(value);
    });

    cmdPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const cmd = pill.getAttribute('data-cmd');
            runCommand(cmd);
        });
    });

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
}

/* ==========================================================================
   6. NAVIGATION & ACTIVE SCROLL MONITOR
   ========================================================================== */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Navbar scroll background blur intensification
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile hamburger menu toggle
    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            hamburgerBtn.setAttribute('aria-expanded', isOpen);
        });

        navItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ScrollSpy active state
    window.addEventListener('scroll', () => {
        let currentSection = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   7. DIRECT GMAIL SUBMISSION HANDLER (FORMSUBMIT AJAX API)
   Sends inquiries directly to gadhiyasavan1@gmail.com
   ========================================================================== */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');

    if (!contactForm || !formMessage) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            formMessage.textContent = 'Please fill out all required fields.';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span>`;
        formMessage.className = 'form-message info';
        formMessage.style.display = 'block';
        formMessage.textContent = "Sending your inquiry directly to Savan's Gmail...";

        try {
            const response = await fetch("https://formsubmit.co/ajax/gadhiyasavan1@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    _subject: `Portfolio Inquiry from ${name}: ${subject || 'New Message'}`,
                    message: message,
                    _template: "table",
                    _captcha: "false"
                })
            });

            const data = await response.json();

            if (response.ok || data.success === "true" || data.success === true) {
                formMessage.className = 'form-message success';
                formMessage.innerHTML = `✅ Thank you <strong>${escapeHTML(name)}</strong>! Your message was sent directly to <strong>gadhiyasavan1@gmail.com</strong>. I will get back to you shortly!`;
                contactForm.reset();
            } else {
                throw new Error(data.message || 'Error sending message');
            }
        } catch (error) {
            console.warn('FormSubmit AJAX fallback:', error);
            const mailtoUrl = `mailto:gadhiyasavan1@gmail.com?subject=${encodeURIComponent(subject + " (from " + name + ")")}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)}`;
            formMessage.className = 'form-message success';
            formMessage.innerHTML = `Message prepared! If direct network send had a delay, <a href="${mailtoUrl}" style="color: #fff; text-decoration: underline; font-weight: bold;">click here to send via your Gmail client</a>.`;
            window.location.href = mailtoUrl;
            contactForm.reset();
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>Send Message</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
        }
    });

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
}

/* ==========================================================================
   8. CLIENT-SIDE INTELLECTUAL PROPERTY & ANTI-INSPECTION SECURITY SHIELD
   ========================================================================== */
function initSecurityShield() {
    // 1. Disable Right-Click Context Menu with security notification
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showSecurityNotice('🔒 Protected: Source code inspection is restricted to protect intellectual property.');
        return false;
    });

    // 2. Disable Keyboard Inspection Shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S)
    document.addEventListener('keydown', (e) => {
        // F12 key
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            showSecurityNotice('🔒 Developer Tools inspection is disabled.');
            return false;
        }

        const isCtrlOrMeta = e.ctrlKey || e.metaKey;

        // Ctrl/Cmd + Shift + I/J/C
        if (isCtrlOrMeta && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
            e.preventDefault();
            showSecurityNotice('🔒 Developer Console inspection is restricted.');
            return false;
        }

        // Ctrl/Cmd + U (View Source)
        if (isCtrlOrMeta && (e.key === 'u' || e.key === 'U')) {
            e.preventDefault();
            showSecurityNotice('🔒 View Page Source is disabled.');
            return false;
        }

        // Ctrl/Cmd + S (Save Page)
        if (isCtrlOrMeta && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            showSecurityNotice('🔒 Page saving is disabled.');
            return false;
        }
    });

    // 3. Disable image dragging
    document.querySelectorAll('img').forEach(img => {
        img.setAttribute('draggable', 'false');
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    // 4. Stylized Console Security Warning
    try {
        console.clear();
        console.log(
            '%c🛑 STOP! %cThis portfolio and all accompanying source code are the proprietary intellectual property of Savan Gadhiya.\nUnauthorized copying, reverse engineering, scraping, or redistribution is strictly prohibited.',
            'color: #EF4444; font-size: 24px; font-weight: 800; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);',
            'color: #06B6D4; font-size: 14px; font-weight: 600;'
        );
    } catch (_) {}

    // Security Notice Toast Helper
    let toastTimeout;
    function showSecurityNotice(msg) {
        let toast = document.getElementById('security-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'security-toast';
            toast.style.cssText = [
                'position: fixed',
                'bottom: 24px',
                'left: 50%',
                'transform: translateX(-50%) translateY(20px)',
                'background: rgba(15, 23, 42, 0.95)',
                'color: #F87171',
                'border: 1px solid rgba(239, 68, 68, 0.4)',
                'padding: 12px 24px',
                'border-radius: 100px',
                'font-size: 0.88rem',
                'font-weight: 700',
                'z-index: 999999',
                'box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7)',
                'backdrop-filter: blur(10px)',
                'opacity: 0',
                'pointer-events: none',
                'transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                'font-family: system-ui, sans-serif'
            ].join(';');
            document.body.appendChild(toast);
        }

        toast.textContent = msg;
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
        }, 2500);
    }
}

