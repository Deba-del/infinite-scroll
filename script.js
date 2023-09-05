const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesloaded = 0;
let totalImages = 0;
let photosArray = [];
let isInitialLoad = true;

// Unsplash API
let initialCount = 5;
const apiKey = 'UE_kZyPY7KPUuHW3CQuFSmvVR5jamcc3u5Bq5wyRknw';
let apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${initialCount}`;

function updateAPIURLWithNewCount (picCount) {
    apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${picCount}`;
}

// Check if all images were loaded
function imageLoaded() {
    imagesloaded++;
    if(imagesloaded === totalImages) {
        ready = true;
        loader.hidden = true;
    }
}

// Helper function to setAttribute on DOM Elements
function setAttributes(element, attributes) {
    for(const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Create elements for links and photos, Add to DOM
function displayPhotos() {
    imagesloaded = 0;
    totalImages = photosArray.length;

    // Run function for each object in photosArray
    photosArray.forEach((photo) => {

        // Create <a> to link to Unsplash
        const item = document.createElement('a');

        setAttributes(item, {
            href: photo.links.html,
            target: '_blank'
        });

        // Create <img> for Photo
        const img = document.createElement('img');

        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        });

        // Event listener, check when each has finished loading
        img.addEventListener('load', imageLoaded);

        // Put <img> inside <a>, then put both inside imageContainer Element
        item.appendChild(img);
        imageContainer.appendChild(item);
    });
}

// Get photos from Unsplash APi
async function getPhotos() {
    try {
        const response = await fetch(apiUrl);
        photosArray = await response.json();
        displayPhotos();

        if(isInitialLoad) {
            updateAPIURLWithNewCount(30);
            isInitialLoad = false;
        }
    } catch(error) {
        // Get error here
    }
}

// check scroll reaches bottom, Load more photos
window.addEventListener('scroll', () => {
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotos();
    }
})

// on load
getPhotos();