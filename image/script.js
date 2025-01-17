const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('preview-container');
const previewScroll = document.getElementById('preview-scroll');
const convertButtons = document.querySelectorAll('.convert-btn');
const downloadBtn = document.getElementById('downloadBtn');
const selectedFormat = document.getElementById('selected-format');
const formatText = document.getElementById('format-text');

let currentFiles = [];
let convertedFiles = [];
let selectedConvertFormat = '';

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
    currentFiles = Array.from(files);
    previewFiles(currentFiles);
    enableConvertButtons();
}

function previewFiles(files) {
    previewScroll.innerHTML = '';
    files.forEach((file, index) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function() {
            const img = document.createElement('img');
            img.src = reader.result;
            img.className = 'preview-image';
            img.setAttribute('data-index', index);
            img.addEventListener('click', () => removeImage(index));
            previewScroll.appendChild(img);
        }
    });
    previewContainer.hidden = false;
}

function removeImage(index) {
    currentFiles.splice(index, 1);
    previewFiles(currentFiles);
    if (currentFiles.length === 0) {
        disableConvertButtons();
        previewContainer.hidden = true;
    }
}

function enableConvertButtons() {
    convertButtons.forEach(btn => btn.disabled = false);
}

function disableConvertButtons() {
    convertButtons.forEach(btn => btn.disabled = true);
}

convertButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        selectedConvertFormat = btn.getAttribute('data-format');
        formatText.textContent = selectedConvertFormat.toUpperCase();
        selectedFormat.hidden = false;
        convertImages(selectedConvertFormat);
    });
});

async function convertImages(format) {
    convertedFiles = [];
    const options = {
        maxSizeMB: format === 'webp' ? 0.5 : 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        quality: format === 'webp' ? 0.8 : 0.9
    };

    for (const file of currentFiles) {
        try {
            const compressedFile = await imageCompression(file, options);
            const blob = await imageCompression.getFilefromDataUrl(
                await imageCompression.getDataUrlFromFile(compressedFile),
                format === 'webp' ? 'image/webp' : format === 'jpeg' ? 'image/jpeg' : 'image/png'
            );
            convertedFiles.push({
                blob: blob,
                name: `${file.name.split('.')[0]}.${format}`
            });
        } catch (error) {
            console.error('Error converting image:', error);
        }
    }

    downloadBtn.hidden = false;
}

downloadBtn.addEventListener('click', async () => {
    if (convertedFiles.length === 0) return;

    if (convertedFiles.length === 1) {
        const url = URL.createObjectURL(convertedFiles[0].blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = convertedFiles[0].name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else {
        const zip = new JSZip();
        convertedFiles.forEach((file, index) => {
            zip.file(file.name, file.blob);
        });
        const content = await zip.generateAsync({type: "blob"});
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted_images.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});

// Handle paste event
document.addEventListener('paste', (event) => {
    const items = event.clipboardData.items;
    const files = [];
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            files.push(file);
        }
    }
    if (files.length > 0) {
        handleFiles(files);
    }
});
