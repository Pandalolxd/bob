document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('upload-form');
    const imageUpload = document.getElementById('image-upload');
    const fileNameDisplay = document.getElementById('file-name');
    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');
    const loadingSpinner = document.getElementById('loading-spinner');

    // Display the selected file name
    imageUpload.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileNameDisplay.textContent = this.files[0].name;
        } else {
            fileNameDisplay.textContent = '';
        }
    });

    const resultOverlay = document.getElementById('full-screen-result');
    const closeOverlayBtn = document.getElementById('close-overlay');
    const slideshow = document.getElementById('slideshow');
    const overlayPlaceName = document.getElementById('overlay-place-name');
    const overlaySimilarity = document.getElementById('overlay-similarity');
    const overlayDescription = document.getElementById('overlay-description');
    const prevSlideBtn = document.getElementById('prev-slide');
    const nextSlideBtn = document.getElementById('next-slide');

    let currentSlide = 0;
    let totalSlides = 0;

    function showSlide(index) {
        const slides = document.querySelectorAll('.slide');
        if (slides.length === 0) return;

        slides.forEach(slide => slide.classList.remove('active'));

        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        slides[currentSlide].classList.add('active');
    }

    prevSlideBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    nextSlideBtn.addEventListener('click', () => showSlide(currentSlide + 1));

    closeOverlayBtn.addEventListener('click', function() {
        resultOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    });

    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData();
        if (imageUpload.files.length === 0) {
            alert("Please select an image file first.");
            return;
        }
        formData.append('image', imageUpload.files[0]);

        // Show loading spinner and hide previous results
        loadingSpinner.style.display = 'block';
        resultSection.style.display = 'none';
        resultContent.innerHTML = '';

        fetch('/predict', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            loadingSpinner.style.display = 'none';

            if (data.success) {
                // Populate Overlay
                overlayPlaceName.textContent = data.place_name;
                overlaySimilarity.textContent = data.similarity;
                overlayDescription.textContent = data.description;

                slideshow.innerHTML = '';
                if (data.old_images && data.old_images.length > 0) {
                    data.old_images.forEach((imgUrl, index) => {
                        const slide = document.createElement('div');
                        slide.className = 'slide' + (index === 0 ? ' active' : '');
                        slide.innerHTML = `<img src="${imgUrl}" alt="Old photo of ${data.place_name}">`;
                        slideshow.appendChild(slide);
                    });
                    totalSlides = data.old_images.length;
                    currentSlide = 0;
                    document.querySelector('.slideshow-controls').style.display = totalSlides > 1 ? 'flex' : 'none';
                } else {
                    slideshow.innerHTML = '<div class="slide active"><p style="color:white;">No old photos available for this place.</p></div>';
                    document.querySelector('.slideshow-controls').style.display = 'none';
                }

                // Show Overlay
                resultOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scroll
                feather.replace(); // Refresh icons
            } else {
                resultSection.style.display = 'block';
                resultContent.innerHTML = `<p class="error">${data.message || data.error}</p>`;
            }
        })
        .catch(error => {
            loadingSpinner.style.display = 'none';
            resultSection.style.display = 'block';
            resultContent.innerHTML = `<p class="error">An unexpected error occurred. Please try again.</p>`;
            console.error('Error:', error);
        });
    });
});
