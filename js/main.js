/* ==========================================================================
   Aman Singh - Portfolio Master Logic
   Stadium Embers, Goal Confetti, Command Palette, Custom Cursor, Modals
   Manchester United "Theatre of Dreams" theme
   Updated with Latest Resume Specs (Quarks Intern, IBM Intern, AWS Certs, 8.46 CGPA)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initParticleCanvas();
    initCustomCursor();
    initScrollNav();
    initScrollReveal();
    initCounterAnim();
    initFanCounters();
    initSkillBars();
    initCommandPalette();
    initProjectsSystem();
    initTerminalWidget();
    initContactForm();
    initMobileNav();
    initGoalButton();
});

/* --- Shared helpers: motion preference, pointer type, accessible modals --- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
let lastFocusedBeforeModal = null;

function openModal(el) {
    lastFocusedBeforeModal = document.activeElement;
    el.classList.add('active');
    el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const focusTarget = el.querySelector('input, [data-autofocus], button, a[href]');
    if (focusTarget) setTimeout(() => focusTarget.focus(), 60);
}

function closeModal(el) {
    if (!el.classList.contains('active')) return;
    el.classList.remove('active');
    el.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.modal-backdrop.active')) document.body.style.overflow = '';
    if (lastFocusedBeforeModal && lastFocusedBeforeModal.focus) lastFocusedBeforeModal.focus();
}

// Keep Tab focus inside whichever modal is open, and close it with Escape
document.addEventListener('keydown', (e) => {
    const modal = document.querySelector('.modal-backdrop.active');
    if (!modal) return;

    if (e.key === 'Escape') {
        closeModal(modal);
        return;
    }

    if (e.key === 'Tab') {
        const focusable = Array.from(modal.querySelectorAll('a[href], button, input, textarea, [tabindex]:not([tabindex="-1"])'))
            .filter(el => el.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
});

/* --- 1. Rising Embers / Flares Canvas (stadium-flare feel) --- */
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 14), 90);
    const palette = ['255, 59, 46', '218, 41, 28', '251, 225, 34', '255, 138, 61'];

    let mouse = { x: null, y: null, radius: 140 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Ember {
        constructor(initial) {
            this.reset(initial);
        }

        reset(initial) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + 10;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = -(Math.random() * 0.9 + 0.25);
            this.radius = Math.random() * 2.2 + 0.6;
            this.color = palette[Math.floor(Math.random() * palette.length)];
            this.alpha = Math.random() * 0.6 + 0.2;
            this.wobble = Math.random() * Math.PI * 2;
        }

        update() {
            this.wobble += 0.02;
            this.x += this.vx + Math.sin(this.wobble) * 0.3;
            this.y += this.vy;

            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius && dist > 0) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 2.5;
                    this.y -= (dy / dist) * force * 2.5;
                }
            }

            if (this.y < -10 || this.x < -10 || this.x > width + 10) this.reset(false);
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(${this.color}, 0.9)`;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Ember(true));
    }

    function animate() {
        if (document.hidden) {
            requestAnimationFrame(animate);
            return;
        }
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        ctx.shadowBlur = 0;
        requestAnimationFrame(animate);
    }

    animate();
}

/* --- Goal Celebration Confetti (red / gold / white) --- */
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#da291c', '#ff3b2e', '#fbe122', '#ffffff'];
    const pieces = Array.from({ length: 180 }, () => ({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.75,
        vx: (Math.random() - 0.5) * 22,
        vy: -(Math.random() * 20 + 8),
        size: Math.random() * 8 + 5,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)]
    }));

    let frames = 0;
    function tick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            p.vy += 0.45;
            p.vx *= 0.99;
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vr;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            ctx.restore();
        });
        frames++;
        if (frames < 200) {
            requestAnimationFrame(tick);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    tick();
}

/* --- Goal Button --- */
function initGoalButton() {
    const goalBtn = document.getElementById('goal-btn');
    if (!goalBtn) return;
    goalBtn.addEventListener('click', celebrateGoal);
}

function celebrateGoal() {
    launchConfetti();
    if (window.Stadium) window.Stadium.horn();
    showToast('GOAAAL! Glory Glory Man United!', 'fa-futbol');
}

/* --- 2. Custom Spring-Physics Cursor --- */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('custom-cursor-follower');
    if (!cursor || !follower || !hasFinePointer) return;

    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Delegated so dynamically rendered cards (projects) get the hover state too
    const hoverSelector = 'a, button, input, textarea, .project-card, .bento-card, .filter-btn, .tag, .command-item, .contact-method';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverSelector)) {
            cursor.classList.add('hover');
            follower.style.transform = 'translate(-50%, -50%) scale(1.4)';
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverSelector)) {
            cursor.classList.remove('hover');
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    });
}

/* --- 3. Scroll Header & Active Navigation --- */
function initScrollNav() {
    const nav = document.querySelector('nav');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const progressBar = document.querySelector('#scroll-progress span');

    window.addEventListener('scroll', () => {
        if (progressBar) {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
        }

        if (window.scrollY > 40) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 140;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* --- 4. Scroll Reveal Animations --- */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;

            // Stagger siblings so grids cascade in instead of popping together
            const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
            const position = Math.max(0, siblings.indexOf(el));
            if (!prefersReducedMotion) el.style.transitionDelay = Math.min(position, 5) * 90 + 'ms';

            el.classList.add('active');
            setTimeout(() => { el.style.transitionDelay = ''; }, 1400);
            observer.unobserve(el);
        });
    }, { threshold: 0.12 });

    reveals.forEach(el => observer.observe(el));
}

/* --- 5. Number Counters Animation --- */
function initCounterAnim() {
    const counters = document.querySelectorAll('.counter');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Wait for the hero entrance so the numbers count while they are visible
            if (entry.isIntersecting && !animated && document.documentElement.classList.contains('hero-ready')) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const isDecimal = target % 1 !== 0;
                    const duration = 1800;
                    const startTime = performance.now();

                    function updateNumber(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeProgress = 1 - Math.pow(2, -10 * progress);
                        const currentVal = easeProgress * target;

                        counter.innerText = isDecimal ? currentVal.toFixed(2) : Math.floor(currentVal);

                        if (progress < 1) {
                            requestAnimationFrame(updateNumber);
                        } else {
                            counter.innerText = isDecimal ? target.toFixed(2) : target;
                        }
                    }

                    requestAnimationFrame(updateNumber);
                });
            }
        });
    }, { threshold: 0.5 });

    const metricsSection = document.querySelector('.hero-metrics');
    if (metricsSection) {
        observer.observe(metricsSection);
        // Re-observe once the hero is revealed so the observer fires again
        document.addEventListener('hero-ready', () => {
            observer.unobserve(metricsSection);
            observer.observe(metricsSection);
        }, { once: true });
    }
}

/* --- Fan Zone Counters (Red Side) --- */
function initFanCounters() {
    const counters = document.querySelectorAll('.fan-counter');
    const grid = document.querySelector('.fan-grid');
    if (!grid || !counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 2000;
            const startTime = performance.now();

            function step(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4);
                counter.innerText = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(step);
                else counter.innerText = target;
            }
            requestAnimationFrame(step);
        });
    }, { threshold: 0.4 });

    observer.observe(grid);
}

/* --- 6. Skill Progress Bars Animation --- */
function initSkillBars() {
    const skillSection = document.querySelector('#skills');
    if (!skillSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.skill-bar-fill').forEach(bar => {
                    const val = bar.getAttribute('data-val');
                    bar.style.width = val + '%';
                });
            }
        });
    }, { threshold: 0.2 });

    observer.observe(skillSection);
}

/* --- 7. Command Palette Logic (Ctrl + K) --- */
function initCommandPalette() {
    const modalBackdrop = document.getElementById('command-palette');
    const cmdTriggers = document.querySelectorAll('.cmd-trigger-btn');
    const cmdInput = document.getElementById('cmd-input');
    const cmdItems = document.querySelectorAll('.command-item');
    let selectedIndex = 0;

    if (!modalBackdrop) return;

    function openPalette() {
        openModal(modalBackdrop);
        if (cmdInput) {
            cmdInput.value = '';
            filterCommands('');
        }
    }

    function closePalette() {
        closeModal(modalBackdrop);
    }

    cmdTriggers.forEach(btn => btn.addEventListener('click', openPalette));

    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closePalette();
    });

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            modalBackdrop.classList.contains('active') ? closePalette() : openPalette();
        }
    });

    if (cmdInput) {
        cmdInput.addEventListener('input', (e) => {
            filterCommands(e.target.value.toLowerCase());
        });

        cmdInput.addEventListener('keydown', (e) => {
            const visibleItems = Array.from(cmdItems).filter(item => item.style.display !== 'none');
            if (!visibleItems.length) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % visibleItems.length;
                updateSelection(visibleItems);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + visibleItems.length) % visibleItems.length;
                updateSelection(visibleItems);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (visibleItems[selectedIndex]) {
                    executeCommand(visibleItems[selectedIndex]);
                    closePalette();
                }
            }
        });
    }

    function filterCommands(query) {
        cmdItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        selectedIndex = 0;
        const visibleItems = Array.from(cmdItems).filter(item => item.style.display !== 'none');
        updateSelection(visibleItems);
    }

    function updateSelection(visibleItems) {
        cmdItems.forEach(item => item.classList.remove('selected'));
        if (visibleItems[selectedIndex]) {
            visibleItems[selectedIndex].classList.add('selected');
            visibleItems[selectedIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    cmdItems.forEach(item => {
        item.addEventListener('click', () => {
            executeCommand(item);
            closePalette();
        });
    });

    function executeCommand(item) {
        const action = item.getAttribute('data-action');
        const target = item.getAttribute('data-target');

        if (action === 'navigate' && target) {
            const element = document.querySelector(target);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'goal') {
            celebrateGoal();
        } else if (action === 'copy-email') {
            copyToClipboard('amansingh06092004@gmail.com', 'Email copied to clipboard!');
        } else if (action === 'copy-phone') {
            copyToClipboard('+91-9891096642', 'Phone number copied to clipboard!');
        } else if (action === 'open-url' && target) {
            window.open(target, '_blank');
        }
    }
}

/* --- 8. Projects & Lightbox Modal System (Sync with Resume) --- */
const projectsData = [
    {
        id: 'file-compress-cloud',
        pitch: { x: 50, y: 17, pos: 'ST', short: 'File Compression' },
        problem: 'Storing and moving large files is slow and costly without an automated, scalable pipeline.',
        solution: 'Containerized the compression service with Docker, ran it on AWS EC2 with S3 storage and IAM access control, and shipped changes through CI/CD.',
        outcome: 'Up to 70% better storage efficiency and 99.9% uptime, backed by logging and performance monitoring.',
        flow: [['fas fa-user', 'Client'], ['fab fa-docker', 'Docker on EC2'], ['fas fa-box-archive', 'S3 Storage'], ['fas fa-shield-halved', 'IAM + Logs'], ['fas fa-gears', 'CI/CD']],
        title: 'Cloud-Based File Compression Application',
        category: 'cloud-devops',
        categoryLabel: 'Cloud & System Infrastructure',
        image: 'Images/File-compression.webp',
        shortDesc: 'AWS-deployed cloud-native compression platform achieving up to 70% storage efficiency with Docker & CI/CD integration.',
        fullDesc: 'Designed and deployed a cloud-native file compression system on AWS (EC2, S3, IAM), boosting storage efficiency by up to 70% with scalable infrastructure setup. Containerized application services using Docker and built automated CI/CD pipelines with GitHub Actions / Jenkins for rapid deployment. Configured access control, logging, and performance monitoring to ensure 99.9% uptime.',
        tech: ['AWS EC2', 'AWS S3', 'IAM', 'Docker', 'CI/CD Pipelines', 'Jenkins', 'GitHub Actions'],
        github: 'https://github.com/Aman-Singh0609',
        demo: 'https://github.com/Aman-Singh0609'
    },
    {
        id: 'bakery-k8s',
        pitch: { x: 27, y: 41, pos: 'LM', short: 'Bakery on K8s' },
        problem: 'A multi-service bakery app needs services that talk reliably, stay fast under load, and deploy consistently.',
        solution: 'Docker Compose networking and volumes, RabbitMQ for async queues, Redis for caching, then Kubernetes with health checks and automated CI/CD.',
        outcome: 'A fully containerized, orchestrated stack with async processing, caching and automated deployments.',
        flow: [['fas fa-user', 'Client'], ['fas fa-server', 'Services'], ['fas fa-envelope-open-text', 'RabbitMQ'], ['fas fa-bolt', 'Redis'], ['fas fa-cubes', 'Kubernetes']],
        title: 'Bakery Management System – Containerized K8s Deployment',
        category: 'cloud-devops',
        categoryLabel: 'DevOps & Container Orchestration',
        image: 'Images/Docker.webp',
        shortDesc: 'Multi-service deployment orchestrated with Docker Compose, RabbitMQ async messaging, Redis cache, and Kubernetes.',
        fullDesc: 'Engineered a multi-service containerized architecture using Docker & Docker Compose with dynamic service networking and volume persistence. Integrated RabbitMQ and Redis for asynchronous message queueing, caching, and performance optimization. Deployed on Kubernetes clusters with health checks and automated CI/CD pipelines.',
        tech: ['Kubernetes', 'Docker Compose', 'RabbitMQ', 'Redis', 'CI/CD Automation', 'Microservices'],
        github: 'https://github.com/Aman-Singh0609/Combined-Docker-Projects-Repo',
        demo: 'https://github.com/Aman-Singh0609/Combined-Docker-Projects-Repo'
    },
    {
        id: 'smart-agri',
        pitch: { x: 73, y: 41, pos: 'RM', short: 'Smart Agriculture' },
        problem: 'Farmers need data-driven crop guidance and timely alerts when conditions change.',
        solution: 'A Random Forest model for crop recommendations, an AWS RDS (MySQL) data pipeline, and SNS plus CloudWatch for automated alerts, with IAM, EC2 and S3 best practices.',
        outcome: 'A working cloud platform delivering personalised crop recommendations and real-time alerts, built during the IBM internship.',
        flow: [['fas fa-seedling', 'Farm Data'], ['fas fa-brain', 'RF Model'], ['fas fa-database', 'RDS MySQL'], ['fas fa-chart-line', 'CloudWatch'], ['fas fa-bell', 'SNS Alerts']],
        title: 'Cloud-Based Smart Agriculture Platform (IBM)',
        category: 'cloud-devops',
        categoryLabel: 'AWS Cloud Architecture & ML',
        image: 'Images/Agriculture.webp',
        shortDesc: 'AWS solution using Random Forest ML models, AWS RDS (MySQL), SNS, and CloudWatch for automated crop alerts.',
        fullDesc: 'Developed during IBM Project Internship (Jun-Jul 2025). Built a cloud-based smart agriculture platform on AWS using a Random Forest machine learning model for crop recommendation. Designed a scalable data pipeline using AWS RDS (MySQL) with automated real-time alerts via Amazon SNS and CloudWatch. Applied AWS security and architectural best practices across IAM, EC2, and S3.',
        tech: ['AWS RDS (MySQL)', 'Amazon SNS', 'Amazon CloudWatch', 'AWS EC2 & S3', 'Random Forest ML', 'Python'],
        github: 'https://github.com/Aman-Singh0609/CloudBasedSmartAgriculture',
        demo: 'https://github.com/Aman-Singh0609/CloudBasedSmartAgriculture'
    },
    {
        id: 'search-engine',
        pitch: { x: 27, y: 65, pos: 'LB', short: 'Search Engine' },
        problem: 'Searching large text collections quickly takes more than scanning every document.',
        solution: 'An inverted index with custom tokenization, stop-word filtering, TF-IDF ranking and hash-map lookups.',
        outcome: 'Relevance-ranked results from an index designed for sub-millisecond document retrieval.',
        flow: [['fas fa-file-lines', 'Documents'], ['fas fa-scissors', 'Tokenizer'], ['fas fa-list-ol', 'Inverted Index'], ['fas fa-ranking-star', 'TF-IDF Rank'], ['fas fa-magnifying-glass', 'Results']],
        title: 'High-Performance Search Engine Indexer',
        category: 'systems-cli',
        categoryLabel: 'Algorithms & Systems',
        image: 'Images/Search-Engine.webp',
        shortDesc: 'Inverted-index search engine designed for rapid document parsing, TF-IDF ranking, and low query latency.',
        fullDesc: 'Designed and built an inverted-index search engine from scratch. Implemented custom string tokenization, stop-word filtering, term frequency-inverse document frequency (TF-IDF) ranking, and hash-map based indexing for sub-millisecond document retrieval across large text corpora.',
        tech: ['Java', 'Data Structures', 'TF-IDF Algorithm', 'File I/O', 'Search Systems'],
        github: 'https://github.com/Aman-Singh0609',
        demo: 'https://github.com/Aman-Singh0609'
    },
    {
        id: 'tcp-chat',
        pitch: { x: 73, y: 65, pos: 'RB', short: 'TCP Chat Server' },
        problem: 'Many clients need to chat at the same time without blocking each other.',
        solution: 'Multi-threaded connection handling with synchronization locks, room broadcast protocols and dynamic buffer management.',
        outcome: 'A concurrent chat server with room routing and low-latency message broadcast.',
        flow: [['fas fa-users', 'Clients'], ['fas fa-plug', 'TCP Listener'], ['fas fa-code-branch', 'Thread per Client'], ['fas fa-tower-broadcast', 'Room Broadcast']],
        title: 'Multithreaded TCP Chat CLI Server',
        category: 'systems-cli',
        categoryLabel: 'Networking & Systems',
        image: 'Images/TCP-chat-CLI.webp',
        shortDesc: 'Concurrent socket-level messaging server supporting multi-client communication, room routing, and low latency.',
        fullDesc: 'Low-level networking application created using BSD Sockets / POSIX threads. Features multi-threaded client connection handling, synchronization locks, room broadcast protocols, dynamic buffer management, and non-blocking IO event loop logic.',
        tech: ['C / Java', 'TCP/IP Sockets', 'Multithreading', 'Concurrency', 'Network Protocols'],
        github: 'https://github.com/Aman-Singh0609',
        demo: 'https://github.com/Aman-Singh0609'
    },
    {
        id: 'pwd-checker',
        pitch: { x: 50, y: 87, pos: 'GK', short: 'Password Analyzer' },
        problem: 'Weak passwords are still the easiest way into an account.',
        solution: 'Shannon entropy measurement, dictionary-attack checks and character-set diversity tests, scored in real time.',
        outcome: 'Instant strength feedback that shows why a password is weak and how to improve it.',
        flow: [['fas fa-key', 'Password'], ['fas fa-font', 'Charset Check'], ['fas fa-calculator', 'Entropy'], ['fas fa-book', 'Dictionary Check'], ['fas fa-gauge-high', 'Score']],
        title: 'Security Password Strength Analyzer',
        category: 'security-algo',
        categoryLabel: 'Security & Auth',
        image: 'Images/Password-Strength-Checker.webp',
        shortDesc: 'Cybersecurity utility calculating character entropy, checking common breaches, and evaluating password security.',
        fullDesc: 'Utility for checking password vulnerability and complexity metrics. Measures Shannon entropy bits, evaluates dictionary attack vectors, tests character set diversity (uppercase, numbers, symbols), and provides real-time vulnerability scoring.',
        tech: ['Python / JS', 'Entropy Calculation', 'Regex Security', 'Cryptography Basics'],
        github: 'https://github.com/Aman-Singh0609',
        demo: 'https://github.com/Aman-Singh0609'
    }
];

function initProjectsSystem() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectsGrid = document.getElementById('projects-grid');
    const pitchView = document.getElementById('pitch-view');
    const pitchPlayers = document.getElementById('pitch-players');
    const viewBtns = document.querySelectorAll('[data-projects-view]');
    const projectModal = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    if (!projectsGrid) return;

    let currentCategory = 'all';

    renderProjects();
    renderPitch();

    const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (allBtn) allBtn.textContent = `All Projects (${projectsData.length})`;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-filter');
            renderProjects();
            applyPitchFilter();
        });
    });

    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.getAttribute('data-projects-view');
            viewBtns.forEach(b => {
                const on = b === btn;
                b.classList.toggle('active', on);
                b.setAttribute('aria-pressed', String(on));
            });
            projectsGrid.hidden = view !== 'grid';
            if (pitchView) pitchView.hidden = view !== 'pitch';
        });
    });

    function visibleProjects() {
        return currentCategory === 'all' ? projectsData : projectsData.filter(p => p.category === currentCategory);
    }

    function renderProjects() {
        projectsGrid.innerHTML = '';

        visibleProjects().forEach((project) => {
            const number = projectsData.indexOf(project) + 1;
            const card = document.createElement('article');
            card.className = 'project-card reveal active';
            card.setAttribute('data-id', project.id);

            card.innerHTML = `
                <span class="shirt-no" aria-hidden="true">${number}</span>
                <div class="project-thumb">
                    <img src="${project.image}" alt="${project.title}" width="640" height="320" loading="lazy" decoding="async">
                    <div class="project-overlay">
                        <span class="project-category">${project.categoryLabel}</span>
                    </div>
                </div>
                <div class="project-body">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc">${project.shortDesc}</p>
                    <div class="project-tech">
                        ${project.tech.map(t => `<span class="project-tech-pill">${t}</span>`).join('')}
                    </div>
                    <div class="project-footer">
                        <button type="button" class="project-link-btn case-open" aria-label="Open case study: ${project.title}">Explore Case Study <i class="fas fa-arrow-right"></i></button>
                        <a href="${project.github}" target="_blank" rel="noopener" class="btn-icon" title="View Source Code" aria-label="View source code for ${project.title} on GitHub">
                            <i class="fab fa-github"></i>
                        </a>
                    </div>
                </div>
            `;

            // Whole card is clickable for mouse users; the button is the keyboard path
            card.addEventListener('click', (e) => {
                if (e.target.closest('a')) return;
                openProjectModal(project);
            });
            projectsGrid.appendChild(card);
        });
    }

    function renderPitch() {
        if (!pitchPlayers) return;
        pitchPlayers.innerHTML = '';

        projectsData.forEach((project, i) => {
            if (!project.pitch) return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'pitch-player';
            btn.dataset.category = project.category;
            btn.style.left = project.pitch.x + '%';
            btn.style.top = project.pitch.y + '%';
            btn.style.setProperty('--i', i);
            btn.setAttribute('aria-label', `${project.title}, position ${project.pitch.pos}. Open case study.`);
            btn.innerHTML = `
                <span class="pp-shirt">${i + 1}</span>
                <span class="pp-name">${project.pitch.short}</span>
                <span class="pp-pos">${project.pitch.pos}</span>
            `;
            btn.addEventListener('click', () => openProjectModal(project));
            pitchPlayers.appendChild(btn);
        });
    }

    function applyPitchFilter() {
        if (!pitchPlayers) return;
        pitchPlayers.querySelectorAll('.pitch-player').forEach(btn => {
            btn.classList.toggle('dim', currentCategory !== 'all' && btn.dataset.category !== currentCategory);
        });
    }

    function openProjectModal(project) {
        if (!projectModal) return;
        const img = document.getElementById('modal-project-img');
        img.src = project.image;
        img.alt = project.title;
        document.getElementById('modal-project-category').textContent = project.categoryLabel;
        document.getElementById('modal-project-title').textContent = project.title;
        document.getElementById('modal-project-desc').textContent = project.fullDesc;
        document.getElementById('case-problem').textContent = project.problem || '';
        document.getElementById('case-solution').textContent = project.solution || '';
        document.getElementById('case-outcome').textContent = project.outcome || '';

        const flow = document.getElementById('case-flow');
        const steps = project.flow || [];
        flow.innerHTML = steps.map(([icon, label]) =>
            `<div class="flow-node"><i class="${icon}" aria-hidden="true"></i><span>${label}</span></div>`
        ).join('<span class="flow-arrow" aria-hidden="true"><i class="fas fa-arrow-right"></i></span>');
        flow.setAttribute('aria-label', 'Architecture flow: ' + steps.map(s => s[1]).join(' to '));
        flow.previousElementSibling.hidden = flow.hidden = !steps.length;

        const techContainer = document.getElementById('modal-project-tech');
        techContainer.innerHTML = project.tech.map(t => `<span class="tag"><i class="fas fa-microchip" aria-hidden="true"></i> ${t}</span>`).join('');

        document.getElementById('modal-project-github').href = project.github;
        document.getElementById('modal-project-demo').href = project.demo;

        openModal(projectModal);
        projectModal.querySelector('.project-modal-content').scrollTop = 0;
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => closeModal(projectModal));
    }

    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) closeModal(projectModal);
        });
    }
}

/* --- 9. Interactive Terminal Simulator Widget --- */
function initTerminalWidget() {
    const terminalBody = document.getElementById('terminal-body');
    const terminalInput = document.getElementById('terminal-input');
    if (!terminalInput || !terminalBody) return;

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim().toLowerCase();
            terminalInput.value = '';

            appendTerminalLine(`<span class="prompt-user">aman@old-trafford</span>:<span class="prompt-path">~</span>$ ${escapeHtml(command)}`);

            handleTerminalCommand(command);
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    function appendTerminalLine(content) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = content;
        terminalBody.insertBefore(line, terminalInput.parentElement);
    }

    function handleTerminalCommand(cmd) {
        switch (cmd) {
            case 'help':
                appendTerminalLine('Available commands: <span style="color: var(--gold);">whoami, intern, education, skills, certs, projects, contact, uptime, glory, treble, siuu, clear</span>');
                break;
            case 'glory':
                appendTerminalLine('Glory, glory, Man United! Once a Red, always a Red. 🔴');
                break;
            case 'treble':
                appendTerminalLine('1999. Premier League + FA Cup + Champions League. Football, bloody hell!');
                break;
            case 'siuu':
                appendTerminalLine('SIUUUUUU! ⚽');
                celebrateGoal();
                break;
            case 'whoami':
                appendTerminalLine('Aman Singh | BTech CSE - CCVT @ UPES Dehradun (2022-2026, CGPA: 8.46) | Software Developer Intern @ Quarks.');
                break;
            case 'intern':
                appendTerminalLine('1. Quarks (Apr 2026 - Present): Backend Dev, Vendor Management System, Node.js, REST APIs, Jenkins CI/CD.\n2. IBM (Jun-Jul 2025): AWS Cloud Smart Agriculture, RDS MySQL, SNS, CloudWatch, Random Forest ML.');
                break;
            case 'education':
                appendTerminalLine('UPES Dehradun (July 2022 - June 2026) - BTech in CSE - CCVT | CGPA: 8.46');
                break;
            case 'certs':
                appendTerminalLine('- AWS Academy Cloud Security Foundations\n- AWS Cloud Quest: Cloud Practitioner\n- AWS Cloud Practitioner Essentials\n- Responsive Web Design (freeCodeCamp)');
                break;
            case 'skills':
                appendTerminalLine('Cloud: AWS (EC2, S3, IAM, VPC), Docker, Kubernetes, Jenkins, GitHub Actions, Terraform.\nDB: MySQL, MongoDB, Redis, RabbitMQ.\nLanguages: Java, Python, Node.js, C, SQL.');
                break;
            case 'projects':
                appendTerminalLine('1. Cloud-Based File Compression (AWS, 70% storage boost)\n2. Bakery Management System (K8s, RabbitMQ, Redis)\n3. Cloud Smart Agriculture Platform (AWS RDS, SNS)');
                break;
            case 'contact':
                appendTerminalLine('Email: amansingh06092004@gmail.com | Phone: +91-9891096642 | LinkedIn: /in/aman-singh-b30a72284');
                break;
            case 'uptime':
                appendTerminalLine('System Uptime: 99.999% | Currently working @ Quarks & open for Cloud / Software Engineering opportunities.');
                break;
            case 'clear':
                const lines = terminalBody.querySelectorAll('.terminal-line');
                lines.forEach(l => l.remove());
                break;
            case '':
                break;
            default:
                appendTerminalLine(`zsh: command not found: ${escapeHtml(cmd)}. Type <span style="color: var(--gold);">help</span> for available commands.`);
                break;
        }
    }
}

/* --- 10. Contact Form & Copy Toast Utilities --- */
function initContactForm() {
    const copyBtn = document.getElementById('copy-email-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            copyToClipboard('amansingh06092004@gmail.com', 'Email copied to clipboard!');
        });
    }

    const copyPhoneBtn = document.getElementById('copy-phone-btn');
    if (copyPhoneBtn) {
        copyPhoneBtn.addEventListener('click', () => {
            copyToClipboard('+91-9891096642', 'Phone number copied to clipboard!');
        });
    }

}

function copyToClipboard(text, successMessage) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(successMessage);
    }).catch(err => {
        showToast('Failed to copy text.');
    });
}

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function showToast(message, icon = 'fa-check-circle') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas ${icon}" style="color: var(--gold);"></i> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

/* --- 11. Mobile Navigation Drawer --- */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-nav-drawer');
    const overlay = document.getElementById('mobile-drawer-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!toggleBtn || !drawer || !overlay) return;

    function openDrawer() {
        drawer.classList.add('active');
        overlay.classList.add('active');
        toggleBtn.setAttribute('aria-expanded', 'true');
    }

    function closeDrawer() {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('active')) closeDrawer();
    });

    toggleBtn.addEventListener('click', openDrawer);
    overlay.addEventListener('click', closeDrawer);
    mobileLinks.forEach(link => link.addEventListener('click', closeDrawer));
}
