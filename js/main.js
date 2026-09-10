/* ==========================================================================
   Aman Singh - Portfolio Master Logic
   Interactive Particle Canvas, Command Palette, Custom Cursor, Modals
   Updated with Latest Resume Specs (Quarks Intern, IBM Intern, AWS Certs, 8.46 CGPA)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initParticleCanvas();
    initCustomCursor();
    initScrollNav();
    initScrollReveal();
    initCounterAnim();
    initSkillBars();
    initCommandPalette();
    initProjectsSystem();
    initTerminalWidget();
    initContactForm();
    initMobileNav();
});

/* --- 1. Interactive Constellation Canvas --- */
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = Math.min(Math.floor(width / 18), 70);
    
    let mouse = { x: null, y: null, radius: 160 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 1;
            this.color = Math.random() > 0.4 ? 'rgba(0, 245, 212, ' : 'rgba(99, 102, 241, ';
            this.alpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            if (mouse.x && mouse.y) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 2;
                    this.y -= (dy / dist) * force * 2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.alpha + ')';
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const opacity = (1 - dist / 130) * 0.25;
                    ctx.strokeStyle = `rgba(0, 245, 212, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* --- 2. Custom Spring-Physics Cursor --- */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('custom-cursor-follower');
    if (!cursor || !follower) return;

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

    document.querySelectorAll('a, button, input, textarea, .project-card, .bento-card, .filter-btn, .tag, .command-item, .contact-method').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.style.transform = 'translate(-50%, -50%) scale(1.4)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

/* --- 3. Scroll Header & Active Navigation --- */
function initScrollNav() {
    const nav = document.querySelector('nav');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
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
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
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
            if (entry.isIntersecting && !animated) {
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
    if (metricsSection) observer.observe(metricsSection);
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
        modalBackdrop.classList.add('active');
        if (cmdInput) {
            cmdInput.value = '';
            cmdInput.focus();
            filterCommands('');
        }
    }

    function closePalette() {
        modalBackdrop.classList.remove('active');
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
        if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
            closePalette();
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
        title: 'High-Performance Search Engine Indexer',
        category: 'systems-cli',
        categoryLabel: 'Algorithms & Systems',
        image: 'Images/Search-Engine.png',
        shortDesc: 'Inverted-index search engine designed for rapid document parsing, TF-IDF ranking, and low query latency.',
        fullDesc: 'Designed and built an inverted-index search engine from scratch. Implemented custom string tokenization, stop-word filtering, term frequency-inverse document frequency (TF-IDF) ranking, and hash-map based indexing for sub-millisecond document retrieval across large text corpora.',
        tech: ['Java', 'Data Structures', 'TF-IDF Algorithm', 'File I/O', 'Search Systems'],
        github: 'https://github.com/Aman-Singh0609',
        demo: 'https://github.com/Aman-Singh0609'
    },
    {
        id: 'tcp-chat',
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
    const projectModal = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    if (!projectsGrid) return;

    renderProjects('all');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-filter');
            renderProjects(category);
        });
    });

    function renderProjects(category) {
        projectsGrid.innerHTML = '';
        const filtered = category === 'all' ? projectsData : projectsData.filter(p => p.category === category);

        filtered.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card reveal active';
            card.setAttribute('data-id', project.id);

            card.innerHTML = `
                <div class="project-thumb">
                    <img src="${project.image}" alt="${project.title}" loading="lazy">
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
                        <span class="project-link-btn">Explore Case Study <i class="fas fa-arrow-right"></i></span>
                        <a href="${project.github}" target="_blank" onclick="event.stopPropagation();" class="btn-icon" title="View Source Code">
                            <i class="fab fa-github"></i>
                        </a>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => openProjectModal(project));
            projectsGrid.appendChild(card);
        });
    }

    function openProjectModal(project) {
        if (!projectModal) return;
        document.getElementById('modal-project-img').src = project.image;
        document.getElementById('modal-project-category').innerText = project.categoryLabel;
        document.getElementById('modal-project-title').innerText = project.title;
        document.getElementById('modal-project-desc').innerText = project.fullDesc;
        
        const techContainer = document.getElementById('modal-project-tech');
        techContainer.innerHTML = project.tech.map(t => `<span class="tag"><i class="fas fa-microchip"></i> ${t}</span>`).join('');

        document.getElementById('modal-project-github').href = project.github;
        document.getElementById('modal-project-demo').href = project.demo;

        projectModal.classList.add('active');
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => projectModal.classList.remove('active'));
    }

    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) projectModal.classList.remove('active');
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

            appendTerminalLine(`<span class="prompt-user">aman@cloud-node</span>:<span class="prompt-path">~</span>$ ${command}`);

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
                appendTerminalLine('Available commands: <span style="color: var(--primary);">whoami, intern, education, skills, certs, projects, contact, clear, uptime</span>');
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
                appendTerminalLine(`zsh: command not found: ${cmd}. Type <span style="color: var(--primary);">help</span> for available commands.`);
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

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Message dispatched! Aman will get back to you shortly.');
            contactForm.reset();
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

function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--primary);"></i> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
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
    }

    function closeDrawer() {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
    }

    toggleBtn.addEventListener('click', openDrawer);
    overlay.addEventListener('click', closeDrawer);
    mobileLinks.forEach(link => link.addEventListener('click', closeDrawer));
}
