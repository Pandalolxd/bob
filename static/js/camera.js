document.addEventListener('DOMContentLoaded', () => {
    const startCameraButton = document.getElementById('start-camera');
    const captureButton = document.getElementById('capture-btn');
    const cameraSection = document.getElementById('camera-section');
    const videoFeed = document.getElementById('camera-feed');
    const imageCanvas = document.getElementById('image-canvas');
    const uploadForm = document.getElementById('upload-form');
    const fileInput = document.getElementById('image-upload');
    const fileNameDisplay = document.getElementById('file-name');

    let stream = null;

    // Event listener to open the camera
    startCameraButton.addEventListener('click', async () => {
        if (stream) {
            // If camera is already open, do nothing or close it
            return;
        }
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoFeed.srcObject = stream;
            cameraSection.style.display = 'block';
            fileNameDisplay.textContent = 'Camera is active.';
            fileInput.value = ''; // Clear file input
        } catch (error) {
            console.error("Error accessing the camera:", error);
            alert("Could not access the camera. Please ensure you have given permission and are not using it elsewhere.");
        }
    });

    // Event listener to capture the image
    captureButton.addEventListener('click', () => {
        if (!stream) {
            alert("Camera is not active.");
            return;
        }

        const context = imageCanvas.getContext('2d');
        imageCanvas.width = videoFeed.videoWidth;
        imageCanvas.height = videoFeed.videoHeight;
        context.drawImage(videoFeed, 0, 0, imageCanvas.width, imageCanvas.height);

        // Convert canvas to a blob
        imageCanvas.toBlob(blob => {
            // Create a file from the blob
            const capturedFile = new File([blob], 'capture.jpg', { type: 'image/jpeg' });

            // Use the DataTransfer API to create a FileList
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(capturedFile);
            fileInput.files = dataTransfer.files;

            // Update UI and stop camera
            fileNameDisplay.textContent = 'Image captured: capture.jpg';
            stopCameraStream();
            uploadForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); // Trigger form submission

        }, 'image/jpeg');
    });

    function stopCameraStream() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
            cameraSection.style.display = 'none';
        }
    }
});
