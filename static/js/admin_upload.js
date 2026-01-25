document.addEventListener('DOMContentLoaded', function() {
    function setupUploadForm(formId, inputId, progressId, barId, textId, fieldName) {
        const form = document.getElementById(formId);
        if (!form) return;

        const input = document.getElementById(inputId);
        const progress = document.getElementById(progressId);
        const bar = document.getElementById(barId);
        const text = document.getElementById(textId);

        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            const files = input.files;
            if (files.length === 0) {
                alert('Please select at least one file to upload.');
                return;
            }

            const submitButton = form.querySelector('input[type="submit"]');
            submitButton.disabled = true;
            const originalValue = submitButton.value;
            submitButton.value = 'Uploading...';

            progress.style.display = 'block';
            const totalFiles = files.length;
            bar.max = totalFiles;
            bar.value = 0;
            text.textContent = `0/${totalFiles}`;
            const failedUploads = [];

            for (let i = 0; i < totalFiles; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append(fieldName, file, file.name);

                try {
                    const response = await fetch(form.action || window.location.href, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`Upload failed for ${file.name}`);
                    }

                } catch (error) {
                    console.error('Upload error:', error);
                    failedUploads.push(file.name);
                } finally {
                    bar.value = i + 1;
                    text.textContent = `${i + 1}/${totalFiles}`;
                }
            }

            if (failedUploads.length > 0) {
                alert(`The following files failed to upload:\n\n${failedUploads.join('\n')}`);
            } else {
                alert('All images uploaded successfully!');
            }

            window.location.reload();
        });
    }

    setupUploadForm('upload-form', 'images', 'upload-progress', 'progress-bar', 'progress-text', 'images');
    setupUploadForm('old-upload-form', 'old_images', 'old-upload-progress', 'old-progress-bar', 'old-progress-text', 'old_images');
});
