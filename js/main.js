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

let isJumping = false;

function initSlider() {
    if (!track) return;
    
    // Clone cards to create infinite effect (3 sets: [Clone] [Original] [Clone])
    const cards = Array.from(track.children);
    cards.forEach(card => track.appendChild(card.cloneNode(true)));
    cards.forEach(card => track.insertBefore(card.cloneNode(true), track.firstChild));

    // Wait for layout to calculate jump
    setTimeout(() => {
        const cardWidth = track.children[0].offsetWidth;
        const gap = 40;
        const originalCount = cards.length;
        const startPos = (cardWidth + gap) * originalCount;
        
        slider.style.scrollBehavior = 'auto'; // Disable temporalily for setup
        slider.scrollLeft = startPos;
        slider.style.scrollBehavior = 'smooth';
    }, 100);
}

function scrollSlider(direction) {
    if (isJumping) return;
    const cardWidth = track.children[0].offsetWidth;
    const gap = 40;
    
    slider.style.scrollBehavior = 'smooth';
    slider.scrollBy({
        left: direction * (cardWidth + gap)
    });
}

// Seamless Infinite Reset Logic
slider.addEventListener('scroll', () => {
    if (isJumping) return;

    const cards = Array.from(track.children);
    const originalCount = cards.length / 3;
    const cardWidth = cards[0].offsetWidth;
    const gap = 40;
    const setWidth = (cardWidth + gap) * originalCount;
    
    // Jump distance - only jump when far enough into the clones
    if (slider.scrollLeft >= setWidth * 2) {
        isJumping = true;
        slider.style.scrollBehavior = 'auto';
        slider.scrollLeft = setWidth;
        setTimeout(() => {
            slider.style.scrollBehavior = 'smooth';
            isJumping = false;
        }, 50);
    } else if (slider.scrollLeft <= 0) {
        isJumping = true;
        slider.style.scrollBehavior = 'auto';
        slider.scrollLeft = setWidth;
        setTimeout(() => {
            slider.style.scrollBehavior = 'smooth';
            isJumping = false;
        }, 50);
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
