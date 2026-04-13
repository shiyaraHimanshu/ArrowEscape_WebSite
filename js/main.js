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

function getSliderMetrics() {
    const card = track.children[0];
    const cardWidth = card.offsetWidth;
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.gap) || 40;
    return { cardWidth, gap };
}

function initSlider() {
    if (!track) return;
    
    // Set initial layout
    const originalCards = Array.from(track.children);
    const originalCount = originalCards.length;
    
    // Clone cards to create infinite effect (3 sets total)
    originalCards.forEach(card => track.appendChild(card.cloneNode(true)));
    [...originalCards].reverse().forEach(card => track.insertBefore(card.cloneNode(true), track.firstChild));

    // Wait for layout to settle, then center the first original card
    setTimeout(() => {
        const { cardWidth, gap } = getSliderMetrics();
        const sliderWidth = slider.offsetWidth;
        
        // Calculate the base scroll position: Start of second set
        let startPos = (cardWidth + gap) * originalCount;
        
        // Offset to center the card within the container
        const centerOffset = (sliderWidth - cardWidth) / 2;
        startPos -= centerOffset;

        slider.style.scrollBehavior = 'auto'; 
        slider.scrollLeft = startPos;
    }, 250);
}

function scrollSlider(direction) {
    if (isJumping) return;
    const { cardWidth, gap } = getSliderMetrics();
    
    slider.style.scrollBehavior = 'smooth';
    slider.scrollBy({
        left: direction * (cardWidth + gap)
    });
}

// Seamless Infinite Reset Logic
slider.addEventListener('scroll', () => {
    if (isJumping) return;

    const { cardWidth, gap } = getSliderMetrics();
    const originalCount = track.children.length / 3;
    const setWidth = (cardWidth + gap) * originalCount;
    
    // Threshold depends on screen width
    const threshold = 50; 
    
    if (slider.scrollLeft >= (setWidth * 2) - (slider.offsetWidth / 2)) {
        isJumping = true;
        slider.style.scrollBehavior = 'auto';
        slider.scrollLeft -= setWidth;
        setTimeout(() => { isJumping = false; }, 50);
    } else if (slider.scrollLeft <= threshold) {
        isJumping = true;
        slider.style.scrollBehavior = 'auto';
        slider.scrollLeft += setWidth;
        setTimeout(() => { isJumping = false; }, 50);
    }
});

// Initialization
let autoSlideInterval;

function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
        scrollSlider(1);
    }, 3000);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
}

window.onload = () => {
    initSlider();
    startAutoSlide();
    
    // Pause on interaction
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
    slider.addEventListener('touchstart', stopAutoSlide);
    slider.addEventListener('touchend', startAutoSlide);
};

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.padding = '1rem 5%';
        navbar.style.background = 'rgba(255, 255, 255, 0.05)';
        navbar.style.backdropFilter = 'blur(30px)';
    } else {
        navbar.style.padding = '1.5rem 5%';
        navbar.style.background = 'transparent';
        navbar.style.backdropFilter = 'none';
    }
});

// Cursor Glow Effect (Optional subtle follow)
document.addEventListener('mousemove', (e) => {
    // We could add a div that follows the cursor here for 'Interactive hover trail'
});
