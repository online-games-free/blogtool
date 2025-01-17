const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('preview-container');
const preview = document.getElementById('preview');
const convertWebPButton = document.getElementById('convertWebP');
const convertJPEGButton = document.getElementById('convertJPEG');
const convertPNGButton = document.getElementById('convertPNG');
const downloadLink = document.getElementById('downloadLink');

let currentFile = null;

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropArea.classList.add('dragover');
}

function unhighlight() {
    dropArea.classList.remove('dragover');
}

dropArea.addEventListener('drop', handleDrop, false);
dropArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    if (files.length > 0) {
        currentFile = files[0];
        previewFile(currentFile);
        enableConvertButtons();
    }
}

function previewFile(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
        preview.src = reader.result;
        previewContainer.hidden = false;
    }
}

function enableConvertButtons() {
    convertWebPButton.disabled = false;
    convertJPEGButton.disabled = false;
    convertPNGButton.disabled = false;
}

convertWebPButton.addEventListener('click', () => convertImage('webp'));
convertJPEGButton.addEventListener('click', () => convertImage('jpeg'));
convertPNGButton.addEventListener('click', () => convertImage('png'));

async function convertImage(format) {
    if (!currentFile) return;

    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    };

    // Adjust options for WebP to reduce file size further
    if (format === 'webp') {
        options.maxSizeMB = 0.5; // Reduce max size for WebP
        options.quality = 0.8; // Slightly reduce quality for WebP
    }

    try {
        const compressedFile = await imageCompression(currentFile, options);
        const blob = await imageCompression.getFilefromDataUrl(
            await imageCompression.getDataUrlFromFile(compressedFile),
            format === 'webp' ? 'image/webp' : format === 'jpeg' ? 'image/jpeg' : 'image/png'
        );
        
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = `converted_image.${format}`;
        downloadLink.hidden = false;
    } catch (error) {
        console.error('Error converting image:', error);
        alert('Error converting image. Please try again.');
    }
}

// Handle paste event
document.addEventListener('paste', (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            currentFile = file;
            previewFile(file);
            enableConvertButtons();
            break;
        }
    }
});
