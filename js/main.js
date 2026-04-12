const overlay = document.getElementById('game-overlay');
const iframe = document.getElementById('game-iframe');
const tapToPlay = document.getElementById('tap-to-play');

function openGame(gameFolder) {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Disable scroll
    
    // Set source but don't show yet (handled by tap to play)
    // We use the folder name provided. Unity games usually have an index.html
    iframe.src = `${gameFolder}/index.html`;
    tapToPlay.style.display = 'flex';
}

function closeGame() {
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scroll
    iframe.src = ''; // Clear iframe memory
}

function startGame() {
    tapToPlay.style.transition = 'opacity 0.5s ease';
    tapToPlay.style.opacity = '0';
    setTimeout(() => {
        tapToPlay.style.display = 'none';
        iframe.focus();
    }, 500);
}

// Handle browser history for "Back" button to close modal
window.onpopstate = function() {
    if (overlay.style.display === 'flex') {
        closeGame();
    }
};
