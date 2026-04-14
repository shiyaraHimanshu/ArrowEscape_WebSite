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
// Game Navigation Logic
function openGame(gameFolder) {
    // Navigate directly to the game folder to update the URL
    window.location.href = `./${gameFolder}/`;
}

function closeGame() {
    // This is now handled by browser navigation (Back button)
    window.location.href = '../';
}

// New Robust Slider Logic
const slider = document.getElementById('game-slider');
const track = document.getElementById('game-track');
let currentIndex = 0;
let originalCount = 0;
let isAnimating = false;

function getCardMetrics() {
    const cards = Array.from(track.children);
    if (cards.length === 0) return { width: 0, gap: 0 };
    const cardWidth = cards[0].offsetWidth;
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.gap) || 40;
    return { cardWidth, gap };
}

function updateSliderPosition(smooth = true) {
    const { cardWidth, gap } = getCardMetrics();
    if (cardWidth === 0) return;
    
    const sliderWidth = slider.offsetWidth;
    const centerOffset = (sliderWidth - cardWidth) / 2;
    const trackPadding = 40; // Matches CSS padding: 0 40px
    
    // Calculate offset to perfectly center the currentIndex card
    const offset = (currentIndex * (cardWidth + gap)) + trackPadding - centerOffset;
    
    track.style.transition = smooth ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
    track.style.transform = `translateX(-${offset}px)`;
}

function initSlider() {
    if (!track) return;
    
    const originalCards = Array.from(track.children);
    originalCount = originalCards.length;
    
    // Add clones for infinite effect (Set 1 | Original | Set 2)
    originalCards.forEach(card => track.appendChild(card.cloneNode(true)));
    [...originalCards].reverse().forEach(card => track.insertBefore(card.cloneNode(true), track.firstChild));
    
    // Start at the first original card (middle set)
    currentIndex = originalCount;
    
    // Wait for layout to calculate correctly
    setTimeout(() => {
        updateSliderPosition(false);
    }, 100);
}

function scrollSlider(direction) {
    if (isAnimating) return;
    
    isAnimating = true;
    currentIndex += direction;
    updateSliderPosition(true);
}

// Seamless loop at transition end
track.addEventListener('transitionend', () => {
    isAnimating = false;
    
    if (currentIndex >= originalCount * 2) {
        currentIndex -= originalCount;
        updateSliderPosition(false);
    } else if (currentIndex < originalCount) {
        currentIndex += originalCount;
        updateSliderPosition(false);
    }
});

// Auto slide
let autoSlideInterval;
function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
        scrollSlider(1);
    }, 3000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

window.addEventListener('load', () => {
    initSlider();
    startAutoSlide();
    
    // Interaction handling
    const container = document.querySelector('.slider-wrapper');
    container.addEventListener('mouseenter', stopAutoSlide);
    container.addEventListener('mouseleave', startAutoSlide);

    // Re-center on resize
    window.addEventListener('resize', () => {
        updateSliderPosition(false);
    });

    // Touch Support
    let touchStartX = 0;
    let isDragging = false;
    let startOffset = 0;

    track.addEventListener('touchstart', (e) => {
        if (isAnimating) return;
        touchStartX = e.touches[0].clientX;
        isDragging = true;
        stopAutoSlide();
        
        // Disable transition during drag
        track.style.transition = 'none';
        
        // Capture initial offset
        const style = window.getComputedStyle(track);
        const matrix = new WebKitCSSMatrix(style.transform);
        startOffset = matrix.m41;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - touchStartX;
        track.style.transform = `translateX(${startOffset + diff}px)`;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchEndX - touchStartX;
        
        // Threshold for swipe (50px)
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                scrollSlider(-1);
            } else {
                scrollSlider(1);
            }
        } else {
            // Snap back if swipe wasn't strong enough
            updateSliderPosition(true);
        }
        startAutoSlide();
    });
});

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
