// Trivix Main JavaScript

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeMusicPlayer();
    initializeWalletConnection();
    initializeAnimations();
    initializeForms();
    initializeNFTInteractions();
    initializeSearch();
    initializeNotifications();
});

// Navigation functionality
function initializeNavigation() {
    const mobileMenuButton = document.querySelector('[data-mobile-menu]');
    const mobileMenu = document.querySelector('[data-mobile-menu-items]');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Active navigation highlighting
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a[href]');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('text-cyan-400');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Music Player functionality
function initializeMusicPlayer() {
    const playButtons = document.querySelectorAll('[data-play]');
    const audioPlayer = document.querySelector('#audio-player');
    const playPauseBtn = document.querySelector('#play-pause');
    const progressBar = document.querySelector('#progress-bar');
    const volumeControl = document.querySelector('#volume-control');
    const currentTimeEl = document.querySelector('#current-time');
    const durationEl = document.querySelector('#duration');

    let currentlyPlaying = null;
    let isPlaying = false;

    // Play/Pause functionality
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            if (isPlaying) {
                audioPlayer.pause();
                this.innerHTML = '<i data-lucide="play"></i>';
            } else {
                audioPlayer.play();
                this.innerHTML = '<i data-lucide="pause"></i>';
            }
            isPlaying = !isPlaying;
            lucide.createIcons();
        });
    }

    // Progress bar
    if (audioPlayer && progressBar) {
        audioPlayer.addEventListener('timeupdate', function() {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.style.width = progress + '%';

            // Update time display
            if (currentTimeEl) {
                currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
            }
        });

        audioPlayer.addEventListener('loadedmetadata', function() {
            if (durationEl) {
                durationEl.textContent = formatTime(audioPlayer.duration);
            }
        });
    }

    // Volume control
    if (volumeControl) {
        volumeControl.addEventListener('input', function() {
            audioPlayer.volume = this.value / 100;
        });
    }

    // Track selection
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const trackId = this.dataset.trackId;
            const trackTitle = this.dataset.trackTitle;
            const trackArtist = this.dataset.trackArtist;

            // Update currently playing indicator
            if (currentlyPlaying) {
                currentlyPlaying.classList.remove('text-green-400');
            }
            this.classList.add('text-green-400');
            currentlyPlaying = this;

            // Update player info
            document.querySelector('#now-playing-title').textContent = trackTitle;
            document.querySelector('#now-playing-artist').textContent = trackArtist;

            // Load and play audio (in a real app, this would load actual audio files)
            console.log(`Playing: ${trackTitle} by ${trackArtist}`);
        });
    });
}

// Wallet connection functionality
function initializeWalletConnection() {
    const walletButtons = document.querySelectorAll('[data-wallet-connect]');

    walletButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const walletType = this.dataset.walletType;

            try {
                // Show connecting state
                this.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Connecting...';
                this.disabled = true;

                // Simulate wallet connection
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Success state
                this.innerHTML = '<i data-lucide="check"></i> Connected';
                this.classList.add('bg-green-600', 'hover:bg-green-700');

                // Update navigation
                const connectButton = document.querySelector('nav [data-wallet-connect]');
                if (connectButton) {
                    connectButton.innerHTML = '<i data-lucide="wallet"></i> 0x1234...5678';
                    connectButton.classList.add('bg-green-600', 'hover:bg-green-700');
                }

                // Show success notification
                showNotification('Wallet connected successfully!', 'success');

            } catch (error) {
                // Error state
                this.innerHTML = '<i data-lucide="x"></i> Failed';
                this.classList.add('bg-red-600', 'hover:bg-red-700');

                // Show error notification
                showNotification('Failed to connect wallet. Please try again.', 'error');

                // Reset after 3 seconds
                setTimeout(() => {
                    this.innerHTML = '<i data-lucide="wallet"></i> Connect Wallet';
                    this.disabled = false;
                    this.classList.remove('bg-green-600', 'hover:bg-green-700', 'bg-red-600', 'hover:bg-red-700');
                }, 3000);
            }

            lucide.createIcons();
        });
    });
}

// Animation utilities
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero sections
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');

        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Form handling
function initializeForms() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Processing...';
            submitButton.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                // Success state
                submitButton.innerHTML = '<i data-lucide="check"></i> Success!';
                submitButton.classList.add('bg-green-600', 'hover:bg-green-700');

                // Show success notification
                showNotification('Form submitted successfully!', 'success');

                // Reset form after 2 seconds
                setTimeout(() => {
                    form.reset();
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    submitButton.classList.remove('bg-green-600', 'hover:bg-green-700');
                }, 2000);
            }, 1500);

            lucide.createIcons();
        });
    });
}

// NFT interactions
function initializeNFTInteractions() {
    const nftCards = document.querySelectorAll('.nft-card');

    nftCards.forEach(card => {
        card.addEventListener('click', function() {
            const nftId = this.dataset.nftId;
            const nftTitle = this.dataset.nftTitle;

            // Show NFT details modal (in a real app)
            console.log(`Viewing NFT: ${nftTitle} (${nftId})`);

            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // NFT purchase/bid buttons
    document.querySelectorAll('[data-action="buy-nft"], [data-action="bid-nft"]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();

            const action = this.dataset.action;
            const nftTitle = this.dataset.nftTitle;

            if (action === 'buy-nft') {
                showNotification(`Purchasing ${nftTitle}...`, 'info');
            } else {
                showNotification(`Bidding on ${nftTitle}...`, 'info');
            }
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInputs = document.querySelectorAll('[data-search]');

    searchInputs.forEach(input => {
        let searchTimeout;

        input.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value;

            // Debounce search
            searchTimeout = setTimeout(() => {
                if (query.length >= 2) {
                    performSearch(query);
                } else {
                    clearSearchResults();
                }
            }, 300);
        });
    });
}

function performSearch(query) {
    // Simulate search results
    console.log(`Searching for: ${query}`);

    // In a real app, this would make an API call
    const mockResults = [
        { title: 'Digital Dreams', artist: 'CryptoBeats', type: 'track' },
        { title: 'Blockchain Beats', artist: 'Web3Sounds', type: 'track' },
        { title: 'NFT Symphony', artist: 'NFTunes', type: 'album' }
    ].filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.artist.toLowerCase().includes(query.toLowerCase())
    );

    displaySearchResults(mockResults);
}

function displaySearchResults(results) {
    // Create or update search results container
    let resultsContainer = document.querySelector('#search-results');

    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'search-results';
        resultsContainer.className = 'absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-xl border border-purple-500/20 rounded-xl mt-2 max-h-64 overflow-y-auto z-50';
        document.querySelector('[data-search]').parentNode.appendChild(resultsContainer);
    }

    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="p-4 text-gray-400">No results found</div>';
    } else {
        resultsContainer.innerHTML = results.map(result => `
            <div class="p-3 hover:bg-purple-500/10 cursor-pointer border-b border-gray-700/50 last:border-b-0">
                <div class="font-semibold">${result.title}</div>
                <div class="text-sm text-gray-400">${result.artist} • ${result.type}</div>
            </div>
        `).join('');
    }
}

function clearSearchResults() {
    const resultsContainer = document.querySelector('#search-results');
    if (resultsContainer) {
        resultsContainer.remove();
    }
}

// Notification system
function initializeNotifications() {
    // Create notification container
    const notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    notificationContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
    document.body.appendChild(notificationContainer);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification-${type} p-4 rounded-xl backdrop-blur-xl border max-w-sm transform translate-x-full opacity-0 transition-all duration-300`;

    const colors = {
        success: 'bg-green-500/20 border-green-500/30 text-green-400',
        error: 'bg-red-500/20 border-red-500/30 text-red-400',
        info: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
        warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
    };

    notification.className += ` ${colors[type]}`;

    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : type === 'warning' ? 'alert-triangle' : 'info'}"></i>
            <span>${message}</span>
        </div>
    `;

    document.querySelector('#notification-container').appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full', 'opacity-0');
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);

    lucide.createIcons();
}

// Utility functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Export functions for external use
window.Trivix = {
    showNotification,
    formatTime,
    debounce,
    throttle
};
