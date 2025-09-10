// Function to handle the transition from initial load to slideshow
function showSlideshow() {
    const initialLoad = document.getElementById('initial-load');
    const slideshow = document.getElementById('slideshow');
    
    // Fade out the initial load
    initialLoad.style.opacity = '0';
    
    // Fade in the slideshow
    slideshow.style.opacity = '1';
    
    // Remove the initial load after the transition
    setTimeout(() => {
        initialLoad.style.display = 'none';
    }, 1000);
}

// Detect mobile devices based on screen width and aspect ratio
const isMobile = () => {
    // Check screen width (common mobile breakpoint is 768px)
    const isSmallScreen = window.innerWidth <= 768;
    
    // Check aspect ratio (portrait orientation or very tall screens)
    const aspectRatio = window.innerWidth / window.innerHeight;
    const isPortrait = aspectRatio < 1;
    const isTallScreen = aspectRatio < 0.7; // Very tall/thin screens
    
    // Consider it mobile if either:
    // 1. Screen is small (width <= 768px) and in portrait mode, or
    // 2. Screen is very tall (ultra-wide or folded phones in portrait)
    return (isSmallScreen && isPortrait) || isTallScreen;
};

// Function to load the initial placeholder image
function loadInitialImage() {
    return new Promise((resolve) => {
        const initialLoad = document.getElementById('initial-load');
        if (!initialLoad) return resolve();
        
        fetch(isMobile() ? 'images/1-mobile.txt' : 'images/11.txt')
            .then(response => response.text())
            .then(base64Data => {
                initialLoad.style.backgroundImage = `url('data:image/jpeg;base64, ${base64Data}')`;
                resolve();
            })
            .catch(error => {
                console.error('Error loading placeholder image:', error);
                resolve(); // Resolve anyway to continue
            });
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    // Load initial placeholder immediately
    await loadInitialImage();
    
    // Slideshow functionality
    const slideshow = document.getElementById('slideshow');
    if (!slideshow) {
        console.error('Slideshow element not found!');
        return;
    }
    
    // Check WebP support
    const supportsWebP = () => {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(img.width > 0 && img.height > 0);
            img.onerror = () => resolve(false);
            img.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/'; // 1x1 WebP test image
        });
    };

    // Make sure the slideshow is visible and properly positioned
    slideshow.style.position = 'fixed';
    slideshow.style.top = '0';
    slideshow.style.left = '0';
    slideshow.style.width = '100%';
    slideshow.style.height = '100%';
    slideshow.style.zIndex = '0';
    
    const slideshowImageBases = [
        '10-4B8A2197-optimized',
        '14-4B8A1925 Kopie-optimized',
        '16-4B8A2218-optimized',
        '63-4B8A3170 Kopie-optimized',
        '58-4B8A3162 Kopie-optimized',
        '45-4B8A3134 Kopie-optimized',
        '38-4B8A3118 Kopie-optimized',
        '28-4B8A3096 Kopie-optimized',
        '25-4B8A2273-optimized',
        '29-4B8A2298-optimized',
        '38-4B8A2335-optimized',
        '41-4B8A2355-optimized',
        '46-4B8A2388-optimized',
        '47-4B8A2394-optimized',
        '51-4B8A2406-optimized',
        '52-4B8A2410-optimized',
        '53-4B8A2413-optimized',
        '1-4-4B8A3007 Kopie-optimized',
        'DSC00667 Kopie-optimized',
        'DSC00865 Kopie-optimized',
        'DSC00891 Kopie-optimized',
        'DSC00921 Kopie-optimized',
        'DSC00929 Kopie-optimized',
        'DSC01014 Kopie-optimized',
        'DSC01031 Kopie-optimized',
        'DSC01040-2 Kopie-optimized'
    ];

    const slideshowImageBasesMobile = [
        '10-4B8A2197-optimized',
        '17-4B8A2233-optimized',
        '19-4B8A2249-optimized',
        '25-4B8A2273-optimized',
        '29-4B8A2298-optimized',
        '37-4B8A2319-optimized',
        '38-4B8A2335-optimized',
        '41-4B8A2355-optimized',
        '46-4B8A2388-optimized',
        '47-4B8A2394-optimized',
        '49-4B8A2402-optimized',
        '53-4B8A2413-optimized',
        'DSC00812 Kopie 2-optimized',
        'DSC00921 Kopie-optimized',
        'DSC00929 Kopie-optimized',
        'DSC01014 Kopie-optimized',
        'DSC01040-2 Kopie-optimized'
    ];

    // Initialize WebP support flag
    let supportsWebPValue = false;
    
    // Initialize images array with proper extensions based on WebP support
    let images = [];
    let webPInitialized = false;
    
    
    // Initialize WebP support and image paths
    async function initializeWebPSupport() {
        if (webPInitialized) return;
        
        supportsWebPValue = await supportsWebP();
        console.log(`WebP support: ${supportsWebPValue ? 'Enabled' : 'Not available'}`);
        
        // Get base paths for images (mobile or desktop)
        const basePath = isMobile() ? 'images/slideshow/mobile/optimized/' : 'images/slideshow/optimized/';
        
        // Initialize image paths with correct extensions and naming
        images = (isMobile() ? slideshowImageBasesMobile : slideshowImageBases).map(base => {
            // Remove any existing path and get just the filename
            const filename = base.split('/').pop();
            const baseName = filename.replace(/-optimized$/, '');
            
            if (supportsWebPValue) {
                // For WebP, remove the -optimized suffix
                return `${basePath}${baseName}.webp`;
            } else {
                // For JPG, keep the -optimized suffix
                return `${basePath}${baseName}-optimized.jpg`;
            }
        });
        
        console.log(`Using ${isMobile() ? 'mobile' : 'desktop'} images`);
        webPInitialized = true;
    }
    
    // Function to preload all images with WebP support
    const preloadImages = async () => {
        // Ensure WebP support is checked first
        await initializeWebPSupport();
        
        return Promise.all(images.map(src => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    console.log(`Loaded: ${src}`);
                    resolve();
                };
                img.onerror = (e) => {
                    console.error(`Error loading: ${src}`, e);
                    resolve(); // Resolve anyway to not block the slideshow
                };
                img.src = src;
            });
        }));
    };
    
    // Initialize the slideshow timing variables first
    const minDisplayTime = 6000; // 6 seconds in milliseconds
    let loadStartTime;
    
    // Function to handle screen resize and orientation changes
    let resizeTimeout;
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(async () => {
            console.log('Screen size changed, reloading images...');
            // Reset the WebP initialization to reload images with the correct paths
            webPInitialized = false;
            await initializeWebPSupport();
            await preloadImages();
            console.log('Images reloaded for', isMobile() ? 'mobile' : 'desktop', 'view');
        }, 250); // Debounce resize events
    };

    // Add event listeners for resize and orientation change
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Initialize WebP support and then start the slideshow
    initializeWebPSupport().then(async () => {
        // Start preloading all slideshow images after WebP support is checked
        await preloadImages();
        console.log('All slideshow images loaded');
        
        // Initialize the slideshow (won't be visible yet)
        await initSlideshow();
        
        // Set the start time after everything is loaded
        loadStartTime = Date.now();
        
        const elapsedTime = Date.now() - loadStartTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
        
        console.log(`Waiting additional ${remainingTime}ms before showing slideshow`);
        
        // Show slideshow after the remaining time or immediately if already past min display time
        setTimeout(() => {
            console.log('Showing slideshow after minimum display time');
            showSlideshow();
        }, remainingTime);
    }).catch(error => {
        console.error('Error initializing slideshow:', error);
        // If we get here, something went wrong with initialization
        // Try to show the slideshow anyway after the minimum display time
        loadStartTime = loadStartTime || Date.now();
        const elapsedTime = Date.now() - loadStartTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
        
        setTimeout(() => {
            console.log('Showing slideshow after error');
            showSlideshow();
        }, remainingTime);
    });
    
    async function initSlideshow() {
        // Function to get the correct image path
        const getImagePath = (src) => {
            if (!src) return '';
            // Remove any leading slashes and add ./ to ensure relative path
            const cleanPath = src.replace(/^\/+/, '');
            return `./${cleanPath}`;
        };
        
        // Initialize WebP support for the slideshow (already done in preloadImages)
        if (!webPInitialized) {
            await initializeWebPSupport();
        }
        
        // Create two layers for crossfading
        const slideshowLayers = [
            document.createElement('div'),
            document.createElement('div')
        ];

        // Style the layers
        slideshowLayers.forEach((layer, index) => {
            layer.className = 'absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000';
            layer.style.opacity = index === 0 ? '1' : '0';
            slideshow.appendChild(layer);
        });

        // Set initial background
        let currentImageIndex = 0;
        let nextImageIndex = 1;
        let activeLayer = 0;
        let isTransitioning = false;
        let slideshowInterval;
        
        // Function to preload the next image in the background
        const preloadNextImage = () => {
            if (nextImageIndex >= images.length) return;
            
            const img = new Image();
            img.src = getImagePath(images[nextImageIndex]);
        };
        
        const setImage = async (index) => {
            if (isTransitioning) return;
            isTransitioning = true;
            
                // Get the image path from our images array which is already initialized with correct extensions
            const imgPath = images[index % images.length];
            
            console.log('Setting image:', imgPath);
            
            // Set the new image on the inactive layer
            const inactiveLayer = (activeLayer + 1) % 2;
            const newImg = new Image();
            
            newImg.onload = () => {
                // Use the correct path for the background image
                const finalPath = getImagePath(imgPath);
                slideshowLayers[inactiveLayer].style.backgroundImage = `url('${finalPath}')`;
                
                // Crossfade
                slideshowLayers[activeLayer].style.opacity = '0';
                slideshowLayers[inactiveLayer].style.opacity = '1';
                
                // Update active layer
                activeLayer = inactiveLayer;
                isTransitioning = false;
                console.log('Image changed to:', imgPath);
                
                // Preload the next image in the background
                nextImageIndex = (index + 1) % images.length;
                preloadNextImage();
            };
            
            newImg.onerror = (e) => {
                console.error('Error loading image:', imgPath, e);
                isTransitioning = false;
            };
            
            newImg.src = imgPath;
        };
        
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
        }
        
        // Change image every 5 seconds
        slideshowInterval = setInterval(() => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            setImage(currentImageIndex);
        }, 5000);
    }
    
    // Overlay functionality
    const historyBtn = document.getElementById('historyBtn');
    const rulesBtn = document.getElementById('rulesBtn');
    const showGetInvolvedBtn = document.getElementById('showGetInvolvedBtn');
    const showImpressionsBtn = document.getElementById('showImpressionsBtn');
    const historyOverlay = document.getElementById('historyOverlay');
    const rulesOverlay = document.getElementById('rulesOverlay');
    const getInvolvedOverlay = document.getElementById('getInvolvedOverlay');
    const impressionsOverlay = document.getElementById('impressionsOverlay');
    const closeHistory = document.getElementById('closeHistory');
    const closeRules = document.getElementById('closeRules');
    const closeGetInvolved = document.getElementById('closeGetInvolved');
    const closeImpressions = document.getElementById('closeImpressions');
    
    // Map of overlay IDs to their corresponding hash
    const overlayMap = {
        'historyOverlay': 'geschichte',
        'rulesOverlay': 'regelwerk',
        'impressionsOverlay': 'impressionen',
        'getInvolvedOverlay': 'turnier'
    };
    
    // Function to update URL and show overlay
    function showOverlay(overlay, hash) {
        // Hide all overlays first
        [historyOverlay, rulesOverlay, getInvolvedOverlay, impressionsOverlay].forEach(ov => {
            if (ov) ov.classList.add('hidden');
        });
        
        // Show the requested overlay
        if (overlay) {
            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Update URL with hash without page reload
            if (hash && history.pushState) {
                history.pushState(null, null, '#' + hash);
            }
        }
    }
    
    // Function to close all overlays and update URL
    function closeAllOverlays() {
        [historyOverlay, rulesOverlay, getInvolvedOverlay, impressionsOverlay].forEach(overlay => {
            if (overlay) overlay.classList.add('hidden');
        });
        document.body.style.overflow = 'auto';
        
        // Update URL to remove hash without page reload
        if (history.pushState) {
            history.pushState(null, null, ' ');
        } else {
            location.hash = '';
        }
    }
    
    // Check URL hash on page load
    function checkHashOnLoad() {
        const hash = window.location.hash.substring(1);
        if (!hash) return;
        
        // Find which overlay this hash corresponds to
        const overlayId = Object.keys(overlayMap).find(key => overlayMap[key] === hash);
        if (!overlayId) return;
        
        // Show the corresponding overlay
        const overlay = document.getElementById(overlayId);
        if (overlay) {
            showOverlay(overlay, hash);
        }
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.substring(1);
        if (!hash) {
            closeAllOverlays();
        } else {
            checkHashOnLoad();
        }
    });
    
    // Show history overlay
    if (historyBtn) {
        historyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showOverlay(historyOverlay, 'geschichte');
        });
    }
    
    // Show rules overlay
    if (rulesBtn) {
        rulesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showOverlay(rulesOverlay, 'regelwerk');
        });
    }
    
    // Show impressions overlay
    if (showImpressionsBtn && impressionsOverlay) {
        showImpressionsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showOverlay(impressionsOverlay, 'impressionen');
        });
    }
    
    // Show get involved overlay
    if (showGetInvolvedBtn && getInvolvedOverlay) {
        showGetInvolvedBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showOverlay(getInvolvedOverlay, 'turnier');
        });
    }
    
    // Close history overlay
    if (closeHistory) {
        closeHistory.addEventListener('click', closeAllOverlays);
    }
    
    // Close rules overlay
    if (closeRules) {
        closeRules.addEventListener('click', closeAllOverlays);
    }
    
    // Close impressions overlay
    if (closeImpressions) {
        closeImpressions.addEventListener('click', closeAllOverlays);
    }
    
    // Close get involved overlay
    if (closeGetInvolved) {
        closeGetInvolved.addEventListener('click', closeAllOverlays);
    }
    
    // Close overlays when clicking outside content
    [historyOverlay, rulesOverlay, getInvolvedOverlay, impressionsOverlay].forEach(overlay => {
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeAllOverlays();
                }
            });
        }
    });
    
    // Check for hash on page load
    document.addEventListener('DOMContentLoaded', checkHashOnLoad);
    
    // Also check hash in case DOMContentLoaded already fired
    checkHashOnLoad();
    
    // Close overlays with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllOverlays();
        }
    });
});