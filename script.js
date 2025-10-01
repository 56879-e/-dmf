// Security Features - Block right-click, prevent inspect, disable F12
(function() {
    'use strict';
    
    // Block right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Block keyboard shortcuts for developer tools
    document.addEventListener('keydown', function(e) {
        // Block F12 key
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        
        // Block Ctrl+Shift+I (Chrome/Firefox DevTools)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            return false;
        }
        
        // Block Ctrl+Shift+J (Chrome Console)
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            return false;
        }
        
        // Block Ctrl+U (View Source)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }
        
        // Block Ctrl+Shift+C (Chrome Elements Inspector)
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            return false;
        }
        
        // Block Ctrl+Shift+K (Firefox Console)
        if (e.ctrlKey && e.shiftKey && e.key === 'K') {
            e.preventDefault();
            return false;
        }
    });
    
    // Block developer tools detection
    let devtools = {
        open: false,
        orientation: null
    };
    
    setInterval(() => {
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
            if (!devtools.open) {
                devtools.open = true;
                devtools.orientation = widthThreshold ? 'vertical' : 'horizontal';
                // Redirect or show warning when devtools is detected
                window.location.href = 'about:blank';
            }
        } else {
            devtools.open = false;
            devtools.orientation = null;
        }
    }, 500);
    
    // Block console access
    console.log = function() {};
    console.warn = function() {};
    console.error = function() {};
    console.info = function() {};
    console.debug = function() {};
    
    // Block debugger statement
    setInterval(() => {
        debugger;
    }, 100);
    
    // Additional security measures
    // Block view source
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            return false;
        }
    });
    
    // Block print screen
    document.addEventListener('keydown', function(e) {
        if (e.key === 'PrintScreen') {
            e.preventDefault();
            return false;
        }
    });
    
    // Block save page
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            return false;
        }
    });
    
    // Disable browser back button
    history.pushState(null, null, location.href);
    window.onpopstate = function() {
        history.go(1);
    };
    
    // Block iframe embedding
    if (window.self !== window.top) {
        window.top.location = window.self.location;
    }
    
})();

// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add intersection observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate__animated');
            entry.target.classList.add(entry.target.dataset.animation || 'animate__fadeIn');
        }
    });
}, {
    threshold: 0.1
});

// Observe all elements with animation classes
document.querySelectorAll('.animate__animated').forEach(element => {
    observer.observe(element);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add hover effect to buttons
document.querySelectorAll('.nav-button, .grade-button, .media-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
    });
});

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - radius}px`;
    ripple.style.top = `${event.clientY - rect.top - radius}px`;
    ripple.classList.add('ripple');
    
    const rippleContainer = document.createElement('span');
    rippleContainer.classList.add('ripple-container');
    
    rippleContainer.appendChild(ripple);
    button.appendChild(rippleContainer);
    
    setTimeout(() => {
        rippleContainer.remove();
    }, 1000);
}

document.querySelectorAll('.nav-button, .grade-button, .media-button').forEach(button => {
    button.addEventListener('click', createRipple);
});

// Remove global link interception for .download-button and .play-button
// Only show popup and do not allow any content to be accessed until code is verified

// Remove any global link interception in script.js that could cause content to appear before code verification

// Handle form submissions (if any)
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form handling logic here
    });
});

// -----------------------------
// YouTube modal player (privacy / UI blocking)
// -----------------------------
// This code opens a modal with a YouTube IFrame created via API.
// It places a transparent overlay over the iframe to block YouTube's native UI (share/menu) so no share link is exposed.
// Interaction with the overlay will pause the video and keep the share/menu inaccessible.

let ytPlayer = null;
let currentVideoId = null;
let ytReady = false;

function onYouTubeIframeAPIReady() {
    ytReady = true;
}

function createPlayer(videoId) {
    if (!ytReady) {
        // If API not ready yet, try again shortly
        setTimeout(() => createPlayer(videoId), 200);
        return;
    }

    if (ytPlayer) {
        ytPlayer.loadVideoById(videoId);
        return;
    }

    ytPlayer = new YT.Player('ytPlayer', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            rel: 0,
            modestbranding: 1,
            controls: 1,
            disablekb: 0,
            fs: 1,
            iv_load_policy: 3,
            playsinline: 1
        },
        events: {
            onStateChange: function(e) {
                // When video ends or is paused, update UI if needed
            }
        }
    });
}

// Open modal and set up overlay behaviour
function openModal(videoId, title) {
    currentVideoId = videoId;
    createPlayer(videoId);
    const modal = document.getElementById('videoModal');
    const overlay = document.getElementById('playerOverlay');
    const modalTitle = document.getElementById('modalTitle');
    modalTitle.textContent = title || '';
    modal.style.display = 'flex';

    // Prevent pointer events reaching iframe (blocks share/menu)
    overlay.style.pointerEvents = 'auto';

    // Clicking overlay will pause the player and keep modal open
    overlay.onclick = function(e) {
        if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
            ytPlayer.pauseVideo();
        }
        // Optionally give a small visual feedback
        overlay.style.background = 'transparent';
    };
}

function closeModal() {
    const modal = document.getElementById('videoModal');
    modal.style.display = 'none';
    if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
        ytPlayer.stopVideo();
    }
}

// Hook custom buttons
document.addEventListener('click', function(e) {
    // Open video modal when clicking our play-button anchors
    const play = e.target.closest && e.target.closest('.play-button');
    if (play) {
        e.preventDefault();
        const vid = play.getAttribute('data-video-id');
        const titleEl = play.closest('.video-card') && play.closest('.video-card').querySelector('.video-title');
        const title = titleEl ? titleEl.textContent.trim() : '';
        if (vid) openModal(vid, title);
    }
});

// Modal control buttons
document.addEventListener('DOMContentLoaded', function() {
    const playPauseBtn = document.getElementById('modalPlayPause');
    const stopBtn = document.getElementById('modalStop');

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            if (!ytPlayer) return;
            const state = ytPlayer.getPlayerState();
            // 1 = playing, 2 = paused
            if (state === YT.PlayerState.PLAYING) ytPlayer.pauseVideo();
            else ytPlayer.playVideo();
        });
    }

    if (stopBtn) {
        stopBtn.addEventListener('click', function() {
            closeModal();
        });
    }
});

// Additional safety: intercept any attempt to open YouTube share links in target anchors
document.addEventListener('click', function(e) {
    const a = e.target.closest && e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    // If the link goes to youtube directly from within the app's video tiles, block navigation
    if (href.includes('youtube.com') || href.includes('youtu.be')) {
        // If it's an external social link in footer allow it; otherwise block to prevent direct share
        if (!a.classList.contains('external-allow')) {
            e.preventDefault();
            // If there's a data-video-id, open our modal instead
            const vid = a.getAttribute('data-video-id');
            if (vid) {
                openModal(vid);
            }
        }
    }
});