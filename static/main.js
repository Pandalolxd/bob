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
            resultSection.style.display = 'block';

            if (data.success) {
                resultContent.innerHTML = `
                    <h3>${data.place_name}</h3>
                    <p>${data.description}</p>
                    <small>Similarity Score: ${data.similarity}</small>
                `;
            } else {
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
