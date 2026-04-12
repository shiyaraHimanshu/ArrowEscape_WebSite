// Constants
const modal = document.getElementById('game-modal');
const iframe = document.getElementById('game-iframe');
const navbar = document.getElementById('navbar');

// Intersection Observer for Reveal Animations
const observerOptions = {
    threshold: 0.1
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // If it's a counter, start the count
            if (entry.target.querySelector('.counter')) {
                startCounters(entry.target);
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Counter Animation
function startCounters(section) {
    const counters = section.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / 50; // Speed of animation

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => startCounters(section), 20);
        } else {
            counter.innerText = target;
        }
    });
}

// Particle Background logic
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    
    // Optimized particle count for performance
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 15 : 25; 
    
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            color: Math.random() > 0.5 ? '#00f2ff' : '#ff007f'
        });
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', initParticles);
initParticles();
animateParticles();

// Game Logic
function openGame(gameFolder) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    iframe.src = `${gameFolder}/index.html`;
}

function closeGame() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    iframe.src = '';
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.padding = '0.8rem 5%';
        navbar.style.background = 'rgba(5, 5, 5, 0.95)';
    } else {
        navbar.style.padding = '1.5rem 5%';
        navbar.style.background = 'rgba(5, 5, 5, 0.8)';
    }
});

// Cursor Glow Effect (Optional subtle follow)
document.addEventListener('mousemove', (e) => {
    // We could add a div that follows the cursor here for 'Interactive hover trail'
});
