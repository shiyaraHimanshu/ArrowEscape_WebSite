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

// Performance Optimization for Liquid Theme
// No canvas particles needed for this aesthetic.
function initParticles() {}
function animateParticles() {}

window.addEventListener('resize', initParticles);
initParticles();
animateParticles();

// Game Modal Logic
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

// Slider Logic
const slider = document.getElementById('game-slider');
const track = document.getElementById('game-track');

function initSlider() {
    if (!track) return;
    
    // Clone cards to create infinite effect
    const cards = Array.from(track.children);
    cards.forEach(card => track.appendChild(card.cloneNode(true)));
    cards.forEach(card => track.insertBefore(card.cloneNode(true), track.firstChild));

    // Calculate exact jump distance
    setTimeout(() => {
        const cardWidth = track.children[0].offsetWidth;
        const gap = 40;
        const originalCount = cards.length;
        slider.scrollLeft = (cardWidth + gap) * originalCount;
    }, 100);
}

function scrollSlider(direction) {
    const cardWidth = track.children[0].offsetWidth;
    const gap = 40;
    slider.scrollBy({
        left: direction * (cardWidth + gap),
        behavior: 'smooth'
    });
}

// Handle infinite jump to keep tiles centered
slider.addEventListener('scroll', () => {
    const cards = Array.from(track.children);
    const originalCount = cards.length / 3;
    const cardWidth = cards[0].offsetWidth;
    const gap = 40;
    const setWidth = (cardWidth + gap) * originalCount;
    
    if (slider.scrollLeft >= setWidth * 2) {
        slider.scrollLeft = setWidth;
    } else if (slider.scrollLeft <= 0) {
        slider.scrollLeft = setWidth;
    }
});

// Initialization
window.onload = () => {
    initSlider();
};

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
