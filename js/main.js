document.addEventListener('DOMContentLoaded', function() {
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
    
    // Base image paths (without extension)
    const imageBases = [
        'bg-c32b7ea5',
        '10-4B8A2197',
        '11-4B8A1917 Kopie',
        '14-4B8A1925 Kopie',
        '16-4B8A2218',
        '17-4B8A2233',
        '19-4B8A2249',
        '21-4B8A1948 Kopie',
        '22-4B8A2253',
        '25-4B8A2273',
        '28-4B8A2286',
        '29-4B8A2298',
        '37-4B8A2319',
        '38-4B8A2335',
        '41-4B8A2355',
        '43-4B8A2359',
        '46-4B8A2388',
        '47-4B8A2394',
        '48-4B8A2398',
        '49-4B8A2402',
        '50-4B8A2405',
        '51-4B8A2406',
        '52-4B8A2410',
        '53-4B8A2413',
        '6-4B8A2185',
        'DSC00667 Kopie',
        'DSC00765 Kopie',
        'DSC00769 Kopie',
        'DSC00774 Kopie',
        'DSC00775 Kopie',
        'DSC00812 Kopie',
        'DSC00865 Kopie',
        'DSC00891 Kopie',
        'DSC00921 Kopie',
        'DSC00929 Kopie',
        'DSC00974 Kopie',
        'DSC01014 Kopie'
    ];

    // Function to get the appropriate image URL
    const getImageUrl = async (baseName) => {
        const useWebP = await supportsWebP();
        const extension = useWebP ? 'webp' : 'jpg';
        return `images/optimized/${baseName}${useWebP ? '' : '-optimized'}.${extension}`;
    };

    // Convert base names to full URLs with proper extensions
    let images = [];
    let webPInitialized = false;
    
    // Add remaining images to the base list
    imageBases.push('DSC01031 Kopie', 'DSC01040-2 Kopie');
    
    // Initialize images with placeholder, will be updated after WebP check
    images = imageBases.map(base => `images/optimized/${base}-optimized.jpg`);
    
    // Function to preload all images
    const preloadImages = async () => {
        const useWebP = await supportsWebP();
        const extension = useWebP ? 'webp' : 'jpg';
        
        // Update all image paths based on WebP support
        images = imageBases.map(base => 
            `images/optimized/${base}${useWebP ? '' : '-optimized'}.${extension}`
        );
        
        // Preload all images
        return Promise.all(images.map(src => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = img.onerror = resolve;
                img.src = src;
            });
        }));
    };
    
    // Initialize the slideshow immediately with the first image
    // Other images will be loaded on demand
    initSlideshow();
    
    // Start preloading other images in the background
    preloadImages().then(() => {
        console.log('All images preloaded in background');
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
            
            // Get the appropriate image URL based on WebP support
            const useWebP = await supportsWebP();
            const extension = useWebP ? 'webp' : 'jpg';
            const baseName = imageBases[index];
            const imgPath = `images/optimized/${baseName}${useWebP ? '' : '-optimized'}.${extension}`;
            
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
            const useWebP = await supportsWebP();
            const extension = useWebP ? 'webp' : 'jpg';
            const firstImgPath = `images/optimized/${imageBases[0]}${useWebP ? '' : '-optimized'}.${extension}`;
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