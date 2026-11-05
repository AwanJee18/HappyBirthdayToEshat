
/* ==================================
   SETTINGS
================================== */

const VIDEO_SRC = 'video.mp4';
const MOMENTS = [];


/* ==================================
   HELPERS
================================== */

const $ = id => document.getElementById(id);

const COLORS = [
    '#ff4b82',
    '#8a2be2',
    '#ffd700',
    '#00e5ff',
    '#ff5722'
];

function fire(options) {
    try {
        if (typeof confetti === 'function') {
            confetti(options);
        }
    } catch (e) {
        console.log('Confetti error:', e);
    }
}


/* ==================================
   CREATE FLOWERS
================================== */

(function () {

    const garden = $('garden');

    if (!garden) return;

    const names = [
        'back-left',
        'left',
        'main',
        'right',
        'back-right'
    ];

    let html = '';

    names.forEach(name => {

        let petals = '';

        for (let angle = 0; angle < 360; angle += 30) {

            petals += `
                <div class="petal"
                     style="--angle:${angle}deg">
                </div>
            `;

        }

        html += `
            <div class="flower ${name}">

                <div class="stem"></div>

                <div class="leaf left-leaf"></div>

                <div class="leaf right-leaf"></div>

                <div class="flower-head">

                    ${petals}

                    <div class="seed-center"></div>

                </div>

            </div>
        `;

    });

    garden.innerHTML = html;

})();


/* ==================================
   INTRO ANIMATION
   MOBILE COUNTDOWN FIX
================================== */

function letters(element, text, delay) {

    if (!element) return;

    [...text].forEach((char, index) => {

        const span = document.createElement('span');

        span.textContent = char;

        span.style.color = COLORS[index % COLORS.length];

        span.style.animationDelay =
            (delay * 0.1 + index * 0.1) + 's';

        element.appendChild(span);

    });

}

let started = false;
let done = false;
let count = 3;
let introTimer = null;

function endIntro() {

    if (done) return;

    done = true;

    clearInterval(introTimer);

    const intro = $('intro');

    if (intro) {
        intro.classList.add('hide');
    }

    fire({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.4 }
    });

    document.body.classList.add('mode-flower');

    const stageFlower = $('stageFlower');

    if (stageFlower) {
        stageFlower.classList.add('go');
    }

    setTimeout(() => {
        goToSiteStage();
    }, 5000);

}

function reveal() {

    if (started || done) return;

    started = true;

    clearInterval(introTimer);

    const countElement = $('count');

    if (countElement) {
        countElement.style.display = 'none';
    }

    letters($('w1'), 'HAPPY', 0);

    letters($('w2'), 'BIRTHDAY', 5);

    setTimeout(() => {

        fire({
            particleCount: 90,
            angle: 60,
            spread: 70,
            origin: { x: 0, y: 0.7 }
        });

        fire({
            particleCount: 90,
            angle: 120,
            spread: 70,
            origin: { x: 1, y: 0.7 }
        });

    }, 1800);

    setTimeout(endIntro, 5600);

}

function updateCountdown() {

    if (started || done) {
        clearInterval(introTimer);
        return;
    }

    count--;

    if (count > 0) {

        const countElement = $('count');

        if (countElement) {
            countElement.textContent = count;
        }

    } else {

        clearInterval(introTimer);

        reveal();

    }

}

// Start countdown
if ($('count')) {

    $('count').textContent = count;

    introTimer = setInterval(updateCountdown, 1000);

}

// Tap intro to skip countdown
if ($('intro')) {

    $('intro').addEventListener('click', () => {

        if (done) return;

        clearInterval(introTimer);

        endIntro();

    });

}


/* ==================================
   STAGE TRANSITIONS
================================== */

function goToSiteStage() {

    document.body.classList.remove(
        'mode-flower',
        'mode-heart'
    );

    document.body.classList.add('mode-site');

    showPage('page1');

    playVid();

}

function goToFinaleHeart() {

    document.body.classList.remove('mode-site');

    document.body.classList.add('mode-heart');

    initThreeHeart();

}


/* ==================================
   VIDEO
================================== */

const vid = $('heroVideo');

const soundBtn = $('soundBtn');

if (vid) {

    vid.src = VIDEO_SRC;

    vid.classList.add('on');

}

function playVid() {

    if (!vid) return;

    const promise = vid.play();

    if (promise && promise.catch) {

        promise.catch(() => {
            console.log('Video playback needs user interaction.');
        });

    }

}

function syncSound() {

    if (!vid || !soundBtn) return;

    soundBtn.textContent = vid.muted ? '🔇' : '🔊';

}

if (soundBtn && vid) {

    soundBtn.addEventListener('click', () => {

        vid.muted = !vid.muted;

        syncSound();

        playVid();

    });

}

syncSound();


/* ==================================
   PAGE NAVIGATION
================================== */

function showPage(id) {

    const element = $(id);

    if (!element) return;

    if (id !== 'page1' && vid) {
        vid.pause();
    }

    document.querySelectorAll('.page').forEach(page => {

        page.classList.remove('active');

    });

    element.classList.add('active');

    document.querySelectorAll('.topnav button').forEach(button => {

        button.classList.toggle(
            'on',
            button.dataset.p === id
        );

    });

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    if (id === 'page1') {
        playVid();
    }

    if (id === 'pageMoments') {
        playMoments();
    }

}


/* ==================================
   MOMENTS HEART LIGHTS
================================== */

(function () {

    const lightsHeart = $('lightsHeart');

    const momentsGrid = $('momentsGrid');

    const colors = [
        '#ff5d94',
        '#ffd54a',
        '#ff3399',
        '#b76cff',
        '#ff8a5b',
        '#5fd0ff'
    ];

    if (lightsHeart) {

        let html = '';

        for (let i = 0; i < 40; i++) {

            const angle = i / 40 * Math.PI * 2;

            const x = 16 * Math.pow(Math.sin(angle), 3);

            const y =
                13 * Math.cos(angle)
                - 5 * Math.cos(2 * angle)
                - 2 * Math.cos(3 * angle)
                - Math.cos(4 * angle);

            html += `
                <span class="bulb"
                    style="
                    left:${50 + x * 3}%;
                    top:${45 - y * 2.9}%;
                    --c:${colors[i % colors.length]};
                    animation-delay:${i * 0.075}s">
                </span>
            `;

        }

        lightsHeart.innerHTML = html;

    }

    const tiles = [

        ['🌙', 'Late night chats', '#ff4b82,#8a2be2'],

        ['🕵️', 'Partner in crime', '#8a2be2,#3da5ff'],

        ['🤝', 'Always strong', '#ffc533,#ff5a5f'],

        ['😂', 'Endless laughter', '#ec4899,#f59e0b'],

        ['🌟', 'Pure soul', '#6366f1,#ec4899'],

        ['🎁', 'Best friend', '#14b8a6,#8b5cf6']

    ];

    if (momentsGrid) {

        momentsGrid.innerHTML = (

            MOMENTS.length ? MOMENTS : tiles

        ).map((memory, index) => {

            if (MOMENTS.length) {

                return `
                    <figure class="glass">
                        <img
                            src="${memory}"
                            alt="Memory ${index + 1}">
                    </figure>
                `;

            }

            return `
                <figure style="
                    background:linear-gradient(135deg,${memory[2]});
                ">
                    <span>${memory[0]}</span>
                    <figcaption>${memory[1]}</figcaption>
                </figure>
            `;

        }).join('');

    }

})();


function playMoments() {

    const element = $('momentsGrid');

    if (!element) return;

    element.classList.remove('play');

    void element.offsetWidth;

    element.classList.add('play');

}


/* ==================================
   BIRTHDAY CAKE
================================== */

function blowCandles() {

    if ($('cake')) {
        $('cake').classList.add('blown');
    }

    if ($('wishReveal')) {
        $('wishReveal').classList.add('show');
    }

    if ($('blowBtn')) {
        $('blowBtn').disabled = true;
    }

    fire({
        particleCount: 200,
        spread: 110,
        origin: { y: 0.6 }
    });

}


/* ==================================
   FINAL PAGE CONFETTI
================================== */

function createConfetti() {

    const emojis = [
        '❤️',
        '💕',
        '💖',
        '✨',
        '🎉',
        '🥳',
        '🎂'
    ];

    for (let i = 0; i < 100; i++) {

        const item = document.createElement('div');

        item.className = 'confetti';

        item.textContent =
            emojis[Math.floor(Math.random() * emojis.length)];

        item.style.left = Math.random() * 100 + 'vw';

        item.style.animationDuration =
            (2 + Math.random() * 4) + 's';

        item.style.animationDelay =
            Math.random() * 2 + 's';

        document.body.appendChild(item);

        setTimeout(() => item.remove(), 7000);

    }

}


/* ==================================
   FINAL THREE.JS PARTICLE HEART
================================== */

let heartInited = false;

function initThreeHeart() {

    if (heartInited) return;

    // Check libraries before starting
    if (typeof THREE === 'undefined') {
        console.error('Three.js library is not loaded.');
        return;
    }

    if (typeof gsap === 'undefined') {
        console.error('GSAP library is not loaded.');
        return;
    }

    const wrapper = $('stageHeartFS');

    if (!wrapper) return;

    heartInited = true;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        65,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );

    camera.position.z = 750;

    let renderer;

    try {

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

    } catch (error) {

        console.error('WebGL is not available:', error);

        heartInited = false;

        return;

    }

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 2)
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    wrapper.appendChild(renderer.domElement);


    // Heart particles
    const total = 2500;

    const positions = new Float32Array(total * 3);

    const startPositions = [];

    const targetPositions = [];

    const scale = Math.min(
        window.innerWidth,
        window.innerHeight
    ) / 38;


    for (let i = 0; i < total; i++) {

        const angle = Math.random() * Math.PI * 2;

        const fill = Math.sqrt(Math.random());

        const hx = 16 * Math.pow(Math.sin(angle), 3);

        const hy =
            13 * Math.cos(angle)
            - 5 * Math.cos(2 * angle)
            - 2 * Math.cos(3 * angle)
            - Math.cos(4 * angle);

        const tx = hx * scale * fill;

        const ty = hy * scale * fill;

        const tz = (Math.random() - 0.5) * 35;

        const sx = (Math.random() - 0.5) * 900;

        const sy = (Math.random() - 0.5) * 900;

        const sz = (Math.random() - 0.5) * 500;

        startPositions.push({
            x: sx,
            y: sy,
            z: sz
        });

        targetPositions.push({
            x: tx,
            y: ty,
            z: tz
        });

        positions[i * 3] = sx;

        positions[i * 3 + 1] = sy;

        positions[i * 3 + 2] = sz;

    }


    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    );


    const material = new THREE.PointsMaterial({

        color: 0xff3399,

        size: 3,

        transparent: true,

        opacity: 0.9,

        blending: THREE.AdditiveBlending,

        depthWrite: false

    });


    const points = new THREE.Points(
        geometry,
        material
    );

    scene.add(points);


    // Animate particles into a heart
    const animation = {
        progress: 0
    };

    gsap.to(animation, {

        progress: 1,

        duration: 4,

        ease: 'power3.inOut',

        onUpdate: function () {

            const progress = animation.progress;

            for (let i = 0; i < total; i++) {

                const start = startPositions[i];

                const target = targetPositions[i];

                positions[i * 3] =
                    start.x + (target.x - start.x) * progress;

                positions[i * 3 + 1] =
                    start.y + (target.y - start.y) * progress;

                positions[i * 3 + 2] =
                    start.z + (target.z - start.z) * progress;

            }

            geometry.attributes.position.needsUpdate = true;

        }

    });


    // Reveal final birthday message
    gsap.to('#birthday-text-fs', {

        opacity: 1,

        duration: 2,

        delay: 3.5,

        ease: 'power2.out'

    });


    // Continuous heart animation
    function animate() {

        requestAnimationFrame(animate);

        points.rotation.y =
            Math.sin(Date.now() * 0.0005) * 0.12;

        points.rotation.z =
            Math.sin(Date.now() * 0.0003) * 0.04;

        renderer.render(scene, camera);

    }

    animate();


    // Responsive resizing
    window.addEventListener('resize', () => {

        camera.aspect =
            window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    });


    // Final celebration
    fire({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.5 }
    });

}
