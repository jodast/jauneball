document.addEventListener('DOMContentLoaded', function() {
    // Slideshow functionality
    const slideshow = document.getElementById('slideshow');
    if (!slideshow) {
        console.error('Slideshow element not found!');
        return;
    }
    
    // Make sure the slideshow is visible and properly positioned
    slideshow.style.position = 'fixed';
    slideshow.style.top = '0';
    slideshow.style.left = '0';
    slideshow.style.width = '100%';
    slideshow.style.height = '100%';
    slideshow.style.zIndex = '0';
    
    const images = [
        'images/10-4B8A2197.jpg',
        'images/11-4B8A1917 Kopie.jpg',
        'images/14-4B8A1925 Kopie.jpg',
        'images/16-4B8A2218.jpg',
        'images/17-4B8A2233.jpg',
        'images/19-4B8A2249.jpg',
        'images/21-4B8A1948 Kopie.jpg',
        'images/22-4B8A2253.jpg',
        'images/25-4B8A2273.jpg',
        'images/28-4B8A2286.jpg',
        'images/29-4B8A2298.jpg',
        'images/37-4B8A2319.jpg',
        'images/38-4B8A2335.jpg',
        'images/41-4B8A2355.jpg',
        'images/43-4B8A2359.jpg',
        'images/46-4B8A2388.jpg',
        'images/47-4B8A2394.jpg',
        'images/48-4B8A2398.jpg',
        'images/49-4B8A2402.jpg',
        'images/50-4B8A2405.jpg',
        'images/51-4B8A2406.jpg',
        'images/52-4B8A2410.jpg',
        'images/53-4B8A2413.jpg',
        'images/6-4B8A2185.jpg',
        'images/DSC00667 Kopie.jpg',
        'images/DSC00765 Kopie.jpg',
        'images/DSC00769 Kopie.jpg',
        'images/DSC00774 Kopie.jpg',
        'images/DSC00775 Kopie.jpg',
        'images/DSC00812 Kopie.jpg',
        'images/DSC00865 Kopie.jpg',
        'images/DSC00891 Kopie.jpg',
        'images/DSC00921 Kopie.jpg',
        'images/DSC00929 Kopie.jpg',
        'images/DSC00974 Kopie.jpg',
        'images/DSC01014 Kopie.jpg',
        'images/DSC01031 Kopie.jpg',
        'images/DSC01040-2 Kopie.jpg'
    ];
    
    // Function to get the correct image path
    const getImagePath = (src) => {
        // Remove any leading slashes and add ./ to ensure relative path
        const cleanPath = src.replace(/^\/+/, '');
        return `./${cleanPath}`;
    };
    
    // Preload images for smoother transitions
    images.forEach(src => {
        const img = new Image();
        const imgPath = getImagePath(src);
        img.src = imgPath;
        console.log('Preloading:', imgPath);
        img.onload = () => console.log('Successfully loaded:', imgPath);
        img.onerror = (e) => console.error('Error loading image:', imgPath, e);
    });
    
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
    let activeLayer = 0;
    
    const setImage = (index) => {
        const imgPath = getImagePath(images[index]);
        console.log('Setting image:', imgPath);
        
        // Set the new image on the inactive layer
        const inactiveLayer = (activeLayer + 1) % 2;
        slideshowLayers[inactiveLayer].style.backgroundImage = `url('${imgPath}')`;
        
        // Crossfade
        slideshowLayers[activeLayer].style.opacity = '0';
        slideshowLayers[inactiveLayer].style.opacity = '1';
        
        // Update active layer
        activeLayer = inactiveLayer;
        console.log('Image changed to:', imgPath);
    };
    
    // Set first image
    slideshowLayers[0].style.backgroundImage = `url('${getImagePath(images[0])}')`;
    
    // Change image every 5 seconds with fade effect
    setInterval(() => {
        // Fade out
        slideshow.style.transition = 'opacity 0.5s ease-in-out';
        slideshow.style.opacity = '0.5';
        
        // Change image after fade out starts
        setTimeout(() => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            setImage(currentImageIndex);
            // Fade in
            setTimeout(() => {
                slideshow.style.opacity = '1';
            }, 50);
        }, 500);
    }, 3000);
    
    // Overlay functionality
    const historyBtn = document.getElementById('historyBtn');
    const rulesBtn = document.getElementById('rulesBtn');
    const historyOverlay = document.getElementById('historyOverlay');
    const rulesOverlay = document.getElementById('rulesOverlay');
    const closeHistory = document.getElementById('closeHistory');
    const closeRules = document.getElementById('closeRules');
    
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
    
    // Close overlays when clicking outside content
    [historyOverlay, rulesOverlay].forEach(overlay => {
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
            [historyOverlay, rulesOverlay].forEach(overlay => {
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