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

// Function to load the initial placeholder image
function loadInitialImage() {
    return new Promise((resolve) => {
        const initialLoad = document.getElementById('initial-load');
        if (!initialLoad) return resolve();
        
        fetch('images/1.txt')
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
    
    // Image paths for the slideshow
    const slideshowImages = [
        'images/slideshow/optimized/10-4B8A2197-optimized.jpg',
        'images/slideshow/optimized/14-4B8A1925 Kopie-optimized.jpg',
        'images/slideshow/optimized/16-4B8A2218-optimized.jpg',
        'images/slideshow/optimized/25-4B8A2273-optimized.jpg',
        'images/slideshow/optimized/29-4B8A2298-optimized.jpg',
        'images/slideshow/optimized/38-4B8A2335-optimized.jpg',
        'images/slideshow/optimized/41-4B8A2355-optimized.jpg',
        'images/slideshow/optimized/46-4B8A2388-optimized.jpg',
        'images/slideshow/optimized/47-4B8A2394-optimized.jpg',
        'images/slideshow/optimized/51-4B8A2406-optimized.jpg',
        'images/slideshow/optimized/52-4B8A2410-optimized.jpg',
        'images/slideshow/optimized/53-4B8A2413-optimized.jpg',
        'images/slideshow/optimized/DSC00667 Kopie-optimized.jpg',
        'images/slideshow/optimized/DSC00865 Kopie-optimized.jpg',
        'images/slideshow/optimized/DSC00891 Kopie-optimized.jpg',
        'images/slideshow/optimized/DSC00921 Kopie-optimized.jpg',
        'images/slideshow/optimized/DSC00929 Kopie-optimized.jpg',
        'images/slideshow/optimized/DSC01014 Kopie-optimized.jpg',
        'images/slideshow/optimized/DSC01031 Kopie-optimized.jpg',
        'images/slideshow/optimized/DSC01040-2 Kopie-optimized.jpg'
    ];

    // Function to get the appropriate image URL
    const getImageUrl = async (index) => {
        return slideshowImages[index];
    };

    // Initialize images array
    let images = [...slideshowImages];
    let webPInitialized = false;
    
    // Function to preload all images
    const preloadImages = async () => {
        return Promise.all(slideshowImages.map(src => {
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
    
    // Start preloading all slideshow images
    const preloadPromise = preloadImages();
    
    // Initialize the slideshow (won't be visible yet)
    initSlideshow();
    
    // When all images are loaded, wait until at least 5 seconds have passed before showing slideshow
    const minDisplayTime = 6000; // 5 seconds in milliseconds
    const loadStartTime = Date.now();
    
    preloadPromise.then(() => {
        console.log('All slideshow images loaded');
        const elapsedTime = Date.now() - loadStartTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
        
        console.log(`Waiting additional ${remainingTime}ms before showing slideshow`);
        
        // Show slideshow after the remaining time or immediately if already past 5 seconds
        setTimeout(() => {
            console.log('Showing slideshow after minimum display time');
            showSlideshow();
        }, remainingTime);
    }).catch(error => {
        console.error('Error preloading images:', error);
        // Still respect the minimum display time even if there were errors
        const elapsedTime = Date.now() - loadStartTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
        
        setTimeout(() => {
            console.log('Showing slideshow after error and minimum display time');
            showSlideshow();
        }, remainingTime);
    });
    
    function initSlideshow() {
        // Function to get the correct image path
        const getImagePath = (src) => {
            // Remove any leading slashes and add ./ to ensure relative path
            const cleanPath = src.replace(/^\/+/, '');
            return `./${cleanPath}`;
        };
        
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
            
                // Get the image path directly from our slideshow images array
            const imgPath = slideshowImages[index % slideshowImages.length];
            
            console.log('Setting image:', imgPath);
            
            // Set the new image on the inactive layer
            const inactiveLayer = (activeLayer + 1) % 2;
            const newImg = new Image();
            
            newImg.onload = () => {
                slideshowLayers[inactiveLayer].style.backgroundImage = `url('${imgPath}')`;
                
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
        
        // Set first image (load immediately)
        (async () => {
            const firstImgPath = slideshowImages[0];
            const firstImg = new Image();
            
            firstImg.onload = () => {
                slideshowLayers[0].style.backgroundImage = `url('${firstImgPath}')`;
                // Start slideshow after first image is loaded
                startSlideshow();
                // Start preloading the next image
                preloadNextImage();
            };
            firstImg.src = firstImgPath;
        })();
        
        function startSlideshow() {
            // Clear any existing interval
            if (slideshowInterval) {
                clearInterval(slideshowInterval);
            }
            
            // Change image every 5 seconds
            slideshowInterval = setInterval(() => {
                currentImageIndex = (currentImageIndex + 1) % images.length;
                setImage(currentImageIndex);
            }, 5000);
        }
    }
    
    // Overlay functionality
    const historyBtn = document.getElementById('historyBtn');
    const rulesBtn = document.getElementById('rulesBtn');
    const showGetInvolvedBtn = document.getElementById('showGetInvolvedBtn');
    const historyOverlay = document.getElementById('historyOverlay');
    const rulesOverlay = document.getElementById('rulesOverlay');
    const getInvolvedOverlay = document.getElementById('getInvolvedOverlay');
    const closeHistory = document.getElementById('closeHistory');
    const closeRules = document.getElementById('closeRules');
    const closeGetInvolved = document.getElementById('closeGetInvolved');
    
    // Show history overlay
    if (historyBtn) {
        historyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            historyOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Show rules overlay
    if (rulesBtn) {
        rulesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            rulesOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close history overlay
    if (closeHistory) {
        closeHistory.addEventListener('click', () => {
            historyOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close rules overlay
    if (closeRules) {
        closeRules.addEventListener('click', () => {
            rulesOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Show get involved overlay
    if (showGetInvolvedBtn && getInvolvedOverlay) {
        showGetInvolvedBtn.addEventListener('click', (e) => {
            e.preventDefault();
            getInvolvedOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close get involved overlay
    if (closeGetInvolved) {
        closeGetInvolved.addEventListener('click', () => {
            getInvolvedOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close overlays when clicking outside content
    [historyOverlay, rulesOverlay, getInvolvedOverlay].forEach(overlay => {
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.add('hidden');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    });
    
    // Close overlays with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            [historyOverlay, rulesOverlay, getInvolvedOverlay].forEach(overlay => {
                if (overlay && !overlay.classList.contains('hidden')) {
                    overlay.classList.add('hidden');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    });
});

// Image gallery functionality for impressions page
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.createElement('div');
    const modalContent = document.createElement('img');
    const closeBtn = document.createElement('span');
    
    modal.className = 'modal';
    modalContent.className = 'modal-content';
    closeBtn.className = 'close';
    closeBtn.innerHTML = '&times;';
    
    modal.appendChild(modalContent);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            modal.style.display = 'block';
            modalContent.src = item.querySelector('img').src;
            document.body.style.overflow = 'hidden';
        });
    });
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Initialize gallery if on impressions page
if (document.querySelector('.gallery')) {
    initGallery();
}