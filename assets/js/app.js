// Wait for the DOM and scripts to load
document.addEventListener('DOMContentLoaded', () => {
    // Check if Amplify is defined
    if (typeof window.Amplify === 'undefined') {
        console.error('Amplify is not defined. Ensure aws-amplify.min.js is loaded correctly.');
        return;
    }

    // Log to confirm Amplify is loaded
    console.log('Amplify:', window.Amplify);
    console.log('Storage:', window.Storage);

    // Configure Amplify Storage
    window.Amplify.configure({
        Storage: {
            AWSS3: {
                bucket: 'cyclist-3d-files-artbybike',
                region: 'eu-north-1',
                level: 'public' // Allow public access (temporary for this stage)
            }
        }
    });

    // DOM elements
    const uploadForm = document.getElementById('upload-form');
    const fileInput = document.getElementById('file-input');
    const uploadStatus = document.getElementById('upload-status');
    const fileInputLabel = document.querySelector('.file-input-label');

    // Check if DOM elements are found
    if (!uploadForm || !fileInput || !uploadStatus || !fileInputLabel) {
        console.error('One or more DOM elements not found. Check your HTML.');
        return;
    }

    // Update the label when a file is selected
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            fileInputLabel.textContent = `Selected: ${fileInput.files[0].name}`;
            fileInputLabel.style.backgroundColor = '#d4edda';
            fileInputLabel.style.borderColor = '#28a745';
            fileInputLabel.style.color = '#28a745';
        } else {
            fileInputLabel.textContent = 'Drag & Drop or Click to Select a GPX File';
            fileInputLabel.style.backgroundColor = '#e9ecef';
            fileInputLabel.style.borderColor = '#6c757d';
            fileInputLabel.style.color = '#6c757d';
        }
    });

    // Form submission handler for file upload
    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission (page refresh)

        const file = fileInput.files[0];
        if (!file) {
            uploadStatus.textContent = 'Please select a file';
            uploadStatus.style.color = '#dc3545';
            return;
        }

        // Validate file type
        if (!file.name.endsWith('.gpx')) {
            uploadStatus.textContent = 'Please upload a valid GPX file';
            uploadStatus.style.color = '#dc3545';
            return;
        }

        try {
            uploadStatus.textContent = 'Uploading...';
            uploadStatus.style.color = '#007bff';

            // Upload file to S3 (public access)
            const result = await window.Storage.put(`uploads/${file.name}`, file);

            uploadStatus.textContent = `File uploaded successfully: ${result.key}`;
            uploadStatus.style.color = '#28a745';
        } catch (error) {
            uploadStatus.textContent = `Upload failed: ${error.message}`;
            uploadStatus.style.color = '#dc3545';
        }
    });
});