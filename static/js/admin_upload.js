document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('upload-form');
    const imagesInput = document.getElementById('images');
    const uploadProgress = document.getElementById('upload-progress');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    uploadForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const files = imagesInput.files;
        if (files.length === 0) {
            alert('Please select at least one file to upload.');
            return;
        }

        uploadProgress.style.display = 'block';
        const totalFiles = files.length;
        progressBar.max = totalFiles;
        progressBar.value = 0;
        progressText.textContent = `0/${totalFiles}`;
        const failedUploads = [];

        for (let i = 0; i < totalFiles; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append('images', file, file.name);

            try {
                const response = await fetch(uploadForm.action, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Upload failed for ${file.name}`);
                }

            } catch (error) {
                console.error('Upload error:', error);
                failedUploads.push(file.name);
            } finally {
                progressBar.value = i + 1;
                progressText.textContent = `${i + 1}/${totalFiles}`;
            }
        }

        if (failedUploads.length > 0) {
            alert(`The following files failed to upload:\n\n${failedUploads.join('\n')}`);
        } else {
            alert('All images uploaded successfully!');
        }

        window.location.reload();
    });
});
