document.addEventListener('DOMContentLoaded', () => {
    const startCameraButton = document.getElementById('start-camera');
    const captureButton = document.getElementById('capture-btn');
    const switchCameraButton = document.getElementById('switch-camera-btn');
    const cameraSection = document.getElementById('camera-section');
    const videoFeed = document.getElementById('camera-feed');
    const imageCanvas = document.getElementById('image-canvas');
    const uploadForm = document.getElementById('upload-form');
    const fileInput = document.getElementById('image-upload');
    const fileNameDisplay = document.getElementById('file-name');

    let stream = null;
    let currentFacingMode = 'user'; // Default to front camera

    // Function to check for multiple cameras and show the switch button
    const checkForMultipleCameras = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoInputs = devices.filter(device => device.kind === 'videoinput');
            if (videoInputs.length > 1) {
                switchCameraButton.style.display = 'block';
            }
        } catch (error) {
            console.error("Error enumerating devices:", error);
        }
    };

    // Function to stop the current camera stream
    const stopCameraStream = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
    };

    // Function to start the camera with a specific facing mode
    const startCamera = async (facingMode) => {
        stopCameraStream(); // Ensure any existing stream is stopped first
        const constraints = { video: { facingMode: facingMode } };

        try {
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            videoFeed.srcObject = stream;
            cameraSection.style.display = 'block';
            fileNameDisplay.textContent = 'Camera is active.';
            fileInput.value = ''; // Clear any selected file

            // Re-render icons since the buttons are now visible
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        } catch (error) {
            console.error("Error accessing the camera:", error);
            alert("Could not access the camera. Please ensure you have given permission and are not using it elsewhere.");
        }
    };

    // Event listener to open the camera for the first time
    startCameraButton.addEventListener('click', async () => {
        await startCamera(currentFacingMode);
        await checkForMultipleCameras();
    });

    // Event listener to switch the camera
    switchCameraButton.addEventListener('click', () => {
        currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
        startCamera(currentFacingMode);
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

        imageCanvas.toBlob(blob => {
            const capturedFile = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(capturedFile);
            fileInput.files = dataTransfer.files;

            fileNameDisplay.textContent = 'Image captured: capture.jpg';
            stopCameraStream();
            cameraSection.style.display = 'none'; // Hide the camera section after capture
            uploadForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

        }, 'image/jpeg');
    });
});
