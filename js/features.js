/* ==========================================================================
   Aman Singh - Portfolio Enhancements
   Typed roles, magnetic buttons, card tilt, parallax, word reveals, kit switch,
   stadium audio, live GitHub stats, skills league table, CV detection, contact form.
   Every feature fails soft: if it cannot run, the page still works.
   ========================================================================== */

/* Contact form delivery. FormSubmit forwards submissions to this inbox.
   Swap this URL (for example a Formspree endpoint) to change the provider. */
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/amansingh06092004@gmail.com';
const CONTACT_EMAIL = 'amansingh06092004@gmail.com';
const GITHUB_USER = 'Aman-Singh0609';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

document.addEventListener('DOMContentLoaded', () => {
    initTypedRoles();
    initMagnetic();
    initCardTilt();
    initParallax();
    initTitleReveal();
    initResumeLinks();
    initKitToggle();
    initStadiumSound();
    initGithubStats();
    initSkillsTable();
    initContactFormDelivery();
    hidePreloader();
});

/* --- Preloader: leave as soon as the page is ready (CSS timer is the fallback) --- */
function hidePreloader() {
    const pre = document.getElementById('preloader');
    if (!pre) return;
    const finish = () => setTimeout(() => pre.classList.add('hide'), reduceMotion ? 0 : 1200);
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });
}

/* --- Typed role line in the hero --- */
function initTypedRoles() {
    const el = document.getElementById('typed-role');
    if (!el || reduceMotion) return;

    const roles = ['Backend Developer', 'Cloud Engineer', 'DevOps Enthusiast', 'Red Devil for life'];
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;

    function tick() {
        const word = roles[roleIndex];
        el.textContent = word.slice(0, charIndex);

        let delay = deleting ? 38 : 75;
        if (!deleting && charIndex === word.length) {
            deleting = true;
            delay = 1700;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 350;
        } else {
            charIndex += deleting ? -1 : 1;
        }
        setTimeout(tick, delay);
    }

    setTimeout(tick, 1800);
}

/* --- Magnetic buttons --- */
function initMagnetic() {
    if (!finePointer || reduceMotion) return;

    document.querySelectorAll('.hero-actions .btn, .hero-actions .btn-icon, .nav-cv, #goal-btn').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - (r.left + r.width / 2)) * 0.28;
            const y = (e.clientY - (r.top + r.height / 2)) * 0.35;
            el.style.setProperty('--mx', x.toFixed(1) + 'px');
            el.style.setProperty('--my', y.toFixed(1) + 'px');
        });
        el.addEventListener('mouseleave', () => {
            el.style.setProperty('--mx', '0px');
            el.style.setProperty('--my', '0px');
        });
    });
}

/* --- 3D tilt and glare on the player card --- */
function initCardTilt() {
    const wrap = document.querySelector('.profile-card-wrap');
    const card = document.querySelector('.player-card');
    if (!wrap || !card || !finePointer || reduceMotion) return;

    wrap.addEventListener('mousemove', (e) => {
        const r = wrap.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ry', ((px - 0.5) * 16).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - py) * 14).toFixed(2) + 'deg');
        card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
    });

    wrap.addEventListener('mouseleave', () => {
        ['--rx', '--ry'].forEach(p => card.style.setProperty(p, '0deg'));
        card.style.setProperty('--gx', '50%');
        card.style.setProperty('--gy', '20%');
    });
}

/* --- Parallax on the hero watermark --- */
function initParallax() {
    const mark = document.querySelector('.hero-watermark');
    if (!mark || reduceMotion) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            if (window.scrollY < window.innerHeight * 1.3) {
                mark.style.transform = `translateY(${(window.scrollY * -0.18).toFixed(1)}px)`;
            }
            ticking = false;
        });
    }, { passive: true });
}

/* --- Word-by-word reveal for section titles --- */
function initTitleReveal() {
    const titles = document.querySelectorAll('.section-title');
    if (!titles.length || reduceMotion || !('IntersectionObserver' in window)) return;

    titles.forEach(title => {
        const text = title.textContent.trim();
        title.setAttribute('aria-label', text);
        title.classList.add('split-title');
        title.innerHTML = text.split(/\s+/).map((word, i) =>
            `<span class="w" aria-hidden="true"><span style="--i:${i}">${word}</span></span>`
        ).join(' ');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    titles.forEach(t => observer.observe(t));
}

/* --- Show the CV buttons only when a PDF is published.
   The deploy workflow sets data-resume="true" on <html> if Aman_Singh_Resume.pdf
   exists in the repo; add that attribute by hand to test locally. --- */
function initResumeLinks() {
    if (document.documentElement.dataset.resume !== 'true') return;
    document.querySelectorAll('.resume-link').forEach(a => { a.hidden = false; });
}

/* --- Home / away kit (dark / light) --- */
function initKitToggle() {
    const btn = document.getElementById('kit-toggle');
    if (!btn) return;
    const root = document.documentElement;

    function apply(kit, announce) {
        const away = kit === 'away';
        if (away) root.setAttribute('data-kit', 'away');
        else root.removeAttribute('data-kit');
        btn.setAttribute('aria-pressed', String(away));
        btn.title = away ? 'Away kit on. Switch to home kit' : 'Home kit on. Switch to away kit';
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', away ? '#f7f2ef' : '#DA291C');
        try { localStorage.setItem('kit', kit); } catch (e) { /* storage unavailable */ }
        if (announce) showToast(away ? 'Away kit on. White strip, same fight.' : 'Home kit on. Red is the colour.', 'fa-shirt');
    }

    apply(root.getAttribute('data-kit') === 'away' ? 'away' : 'home', false);
    btn.addEventListener('click', () => apply(root.getAttribute('data-kit') === 'away' ? 'home' : 'away', true));
}

/* --- Stadium sound (synthesised with Web Audio, no files, off by default) --- */
window.Stadium = (() => {
    let ctx = null;
    let master = null;
    let crowdGain = null;
    let on = false;

    function build() {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return false;
        ctx = new AudioCtx();
        master = ctx.createGain();
        master.gain.value = 0;
        master.connect(ctx.destination);

        // Brown noise shaped into a distant crowd murmur that slowly swells
        const length = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let last = 0;
        for (let i = 0; i < length; i++) {
            const white = Math.random() * 2 - 1;
            last = (last + 0.02 * white) / 1.02;
            data[i] = last * 3.5;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const band = ctx.createBiquadFilter();
        band.type = 'bandpass';
        band.frequency.value = 520;
        band.Q.value = 0.5;

        crowdGain = ctx.createGain();
        crowdGain.gain.value = 0.5;

        const lfo = ctx.createOscillator();
        const lfoDepth = ctx.createGain();
        lfo.frequency.value = 0.18;
        lfoDepth.gain.value = 0.22;
        lfo.connect(lfoDepth);
        lfoDepth.connect(crowdGain.gain);

        source.connect(band);
        band.connect(crowdGain);
        crowdGain.connect(master);
        source.start();
        lfo.start();
        return true;
    }

    function toggle() {
        if (!ctx && !build()) return false;
        if (ctx.state === 'suspended') ctx.resume();
        on = !on;
        const t = ctx.currentTime;
        master.gain.cancelScheduledValues(t);
        master.gain.linearRampToValueAtTime(on ? 0.35 : 0, t + 0.6);
        return on;
    }

    function horn() {
        if (!on || !ctx) return;
        const t = ctx.currentTime;

        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 1100;

        const env = ctx.createGain();
        env.gain.setValueAtTime(0, t);
        env.gain.linearRampToValueAtTime(0.55, t + 0.05);
        env.gain.setValueAtTime(0.55, t + 1.0);
        env.gain.linearRampToValueAtTime(0, t + 1.6);

        [233, 311].forEach(freq => {
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.value = freq;
            osc.connect(lowpass);
            osc.start(t);
            osc.stop(t + 1.7);
        });
        lowpass.connect(env);
        env.connect(master);

        // The crowd roars: swell, then settle
        crowdGain.gain.cancelScheduledValues(t);
        crowdGain.gain.linearRampToValueAtTime(1.3, t + 0.4);
        crowdGain.gain.linearRampToValueAtTime(0.5, t + 3.5);
    }

    return { toggle, horn };
})();

function initStadiumSound() {
    const btn = document.getElementById('sound-toggle');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const isOn = window.Stadium.toggle();
        btn.setAttribute('aria-pressed', String(isOn));
        btn.title = isOn ? 'Stadium sound (on)' : 'Stadium sound (off)';
        btn.querySelector('i').className = isOn ? 'fas fa-volume-high' : 'fas fa-volume-xmark';
        showToast(isOn ? 'Stadium sound on. Hit GOAAAL for the horn.' : 'Stadium sound off.', isOn ? 'fa-volume-high' : 'fa-volume-xmark');
    });
}

/* --- Live GitHub stats (cached for an hour, hidden if the API is unreachable) --- */
function initGithubStats() {
    const strip = document.getElementById('gh-strip');
    if (!strip) return;

    const CACHE_KEY = 'gh-stats-v2';
    const TTL = 60 * 60 * 1000;

    function readCache() {
        try {
            const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
            if (cached && Date.now() - cached.time < TTL) return cached.data;
        } catch (e) { /* ignore */ }
        return null;
    }

    function writeCache(data) {
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), data })); } catch (e) { /* ignore */ }
    }

    function ago(iso) {
        const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
        if (days < 1) return 'Today';
        if (days === 1) return '1d ago';
        if (days < 30) return days + 'd ago';
        if (days < 365) return Math.floor(days / 30) + 'mo ago';
        return Math.floor(days / 365) + 'y ago';
    }

    function render(data) {
        document.getElementById('gh-repos').textContent = data.repos;
        document.getElementById('gh-stars').textContent = data.stars;
        document.getElementById('gh-languages').textContent = data.languageCount;
        document.getElementById('gh-recent').textContent = data.lastPush ? ago(data.lastPush) : '–';

        const colors = {
            Java: '#b07219', JavaScript: '#f1e05a', Python: '#3572A5', HTML: '#e34c26', CSS: '#563d7c',
            TypeScript: '#3178c6', Shell: '#89e051', C: '#9a9a9a', 'C++': '#f34b7d', Dockerfile: '#384d54',
            'Jupyter Notebook': '#DA5B0B'
        };
        const total = data.languages.reduce((sum, l) => sum + l[1], 0) || 1;
        const bar = document.getElementById('gh-langs');
        bar.innerHTML = data.languages.map(([name, count]) =>
            `<i style="width:${(count / total * 100).toFixed(1)}%;background:${colors[name] || '#8a6f6c'}" title="${name}"></i>`
        ).join('');

        let legend = strip.querySelector('.gh-legend');
        if (!legend) {
            legend = document.createElement('div');
            legend.className = 'gh-legend';
            bar.after(legend);
        }
        legend.innerHTML = data.languages.map(([name, count]) =>
            `<span style="--c:${colors[name] || '#8a6f6c'}">${name} ${(count / total * 100).toFixed(0)}%</span>`
        ).join('');

        strip.hidden = false;
    }

    const cached = readCache();
    if (cached) {
        render(cached);
        return;
    }

    Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USER}`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
        fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`).then(r => r.ok ? r.json() : Promise.reject(r.status))
    ]).then(([user, repos]) => {
        const own = repos.filter(r => !r.fork);
        const langCount = {};
        own.forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1; });
        const languages = Object.entries(langCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const languageCount = Object.keys(langCount).length;

        const data = {
            repos: user.public_repos,
            languageCount,
            stars: own.reduce((sum, r) => sum + r.stargazers_count, 0),
            lastPush: repos.length ? repos[0].pushed_at : null,
            languages
        };
        writeCache(data);
        render(data);
    }).catch(() => { /* rate limited or offline: leave the strip hidden */ });
}

/* --- Skills league table (built from the existing skill bars) --- */
function initSkillsTable() {
    const table = document.getElementById('skills-table');
    const bars = document.getElementById('skills-bars');
    const viewBtns = document.querySelectorAll('[data-skills-view]');
    if (!table || !bars) return;

    const rows = [];
    bars.querySelectorAll('.skill-category-card').forEach(card => {
        const domain = card.querySelector('.category-title').textContent.trim();
        card.querySelectorAll('.skill-item').forEach(item => {
            rows.push({
                name: item.querySelector('.skill-item-name').textContent.trim(),
                domain,
                rating: parseInt(item.querySelector('.skill-item-val').textContent, 10)
            });
        });
    });

    // Rank by rating once, so the position column stays meaningful when re-sorted
    [...rows].sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name))
        .forEach((row, i) => { row.rank = i + 1; });

    const tbody = table.querySelector('tbody');
    let sortKey = 'rating';
    let ascending = false;

    function draw() {
        const sorted = [...rows].sort((a, b) => {
            const dir = ascending ? 1 : -1;
            if (sortKey === 'rating') return (a.rating - b.rating) * dir || a.name.localeCompare(b.name);
            return a[sortKey].localeCompare(b[sortKey]) * (ascending ? 1 : -1) || b.rating - a.rating;
        });

        tbody.innerHTML = sorted.map(r => `
            <tr class="${r.rank <= 4 ? 'ucl' : ''}">
                <td>${r.rank}</td>
                <td>${r.name}</td>
                <td class="domain col-domain">${r.domain}</td>
                <td class="rating">${r.rating}</td>
                <td class="col-meter"><div class="meter"><i data-w="${r.rating}"></i></div></td>
            </tr>`).join('');

        requestAnimationFrame(() => requestAnimationFrame(() => {
            tbody.querySelectorAll('.meter i').forEach(i => { i.style.width = i.dataset.w + '%'; });
        }));
    }

    table.querySelectorAll('th button[data-sort]').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.sort;
            if (sortKey === key) ascending = !ascending;
            else { sortKey = key; ascending = key !== 'rating'; }

            table.querySelectorAll('th button').forEach(b => b.classList.remove('sorted', 'asc'));
            btn.classList.add('sorted');
            btn.classList.toggle('asc', ascending);
            btn.closest('th').setAttribute('aria-sort', ascending ? 'ascending' : 'descending');
            draw();
        });
    });

    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const showTable = btn.dataset.skillsView === 'table';
            viewBtns.forEach(b => {
                const on = b === btn;
                b.classList.toggle('active', on);
                b.setAttribute('aria-pressed', String(on));
            });
            bars.hidden = showTable;
            table.hidden = !showTable;
            if (showTable) draw();
        });
    });
}

/* --- Contact form: validation, real delivery, graceful fallback --- */
function initContactFormDelivery() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = document.getElementById('form-submit');
    const status = document.getElementById('form-status');
    const fields = {
        name: { el: form.elements.name, err: document.getElementById('err-name') },
        email: { el: form.elements.email, err: document.getElementById('err-email') },
        message: { el: form.elements.message, err: document.getElementById('err-message') }
    };

    function validate() {
        let valid = true;
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        const checks = {
            name: v => v.trim().length < 2 ? 'Please tell me who you are (at least 2 characters).' : '',
            email: v => !emailOk.test(v.trim()) ? 'Please enter a valid email address.' : '',
            message: v => v.trim().length < 10 ? 'Please write a little more (at least 10 characters).' : ''
        };

        Object.entries(fields).forEach(([key, { el, err }]) => {
            const msg = checks[key](el.value);
            err.textContent = msg;
            el.setAttribute('aria-invalid', msg ? 'true' : 'false');
            if (msg) valid = false;
        });
        return valid;
    }

    Object.values(fields).forEach(({ el, err }) => {
        el.addEventListener('input', () => {
            if (el.getAttribute('aria-invalid') === 'true') {
                el.setAttribute('aria-invalid', 'false');
                err.textContent = '';
            }
        });
    });

    function setStatus(html, kind) {
        status.className = 'form-status ' + (kind || '');
        status.innerHTML = html;
    }

    function mailtoFallback(data) {
        const subject = encodeURIComponent('Portfolio enquiry from ' + data.name);
        const body = encodeURIComponent(`${data.message}\n\n${data.name}\n${data.email}`);
        return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        setStatus('');

        if (!validate()) {
            const firstBad = Object.values(fields).find(f => f.el.getAttribute('aria-invalid') === 'true');
            if (firstBad) firstBad.el.focus();
            return;
        }

        // Bots fill the hidden field; pretend success and send nothing
        if (form.elements._honey && form.elements._honey.value) {
            setStatus('Thanks! Your message is on its way.', 'ok');
            return;
        }

        // Basic throttle: one message every 30 seconds per browser
        try {
            const last = Number(localStorage.getItem('contact-last')) || 0;
            if (Date.now() - last < 30000) {
                setStatus('Hold on a moment before sending another message.', 'err');
                return;
            }
        } catch (err) { /* storage unavailable */ }

        const data = {
            name: fields.name.el.value.trim(),
            email: fields.email.el.value.trim(),
            message: fields.message.el.value.trim()
        };

        submitBtn.classList.add('loading');
        submitBtn.querySelector('.btn-label').textContent = 'Sending...';
        submitBtn.querySelector('i').className = 'fas fa-futbol';

        try {
            const res = await fetch(FORM_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    _subject: 'Portfolio message from ' + data.name,
                    _replyto: data.email,
                    _template: 'table',
                    _captcha: 'false'
                })
            });
            const result = await res.json().catch(() => ({}));
            if (!res.ok || result.success === 'false' || result.success === false) throw new Error(result.message || 'Request failed');

            try { localStorage.setItem('contact-last', String(Date.now())); } catch (err) { /* ignore */ }
            form.reset();
            setStatus('GOAAAL! Message delivered. I will get back to you soon.', 'ok');
            showToast('GOAAAL! Message delivered.', 'fa-futbol');
            launchConfetti();
            if (window.Stadium) window.Stadium.horn();
        } catch (err) {
            setStatus(`Could not send right now. <a href="${mailtoFallback(data)}">Email me directly</a> instead.`, 'err');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.querySelector('.btn-label').textContent = 'Send The Offer';
            submitBtn.querySelector('i').className = 'fas fa-paper-plane';
        }
    });
}
