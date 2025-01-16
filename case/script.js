// Utility functions
function convertCase(text, caseType) {
    switch (caseType) {
        case 'upper':
            return text.toUpperCase();
        case 'lower':
            return text.toLowerCase();
        case 'title':
            return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        case 'sentence':
            return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        case 'capitalize':
            return text.replace(/\b\w/g, c => c.toUpperCase());
        case 'link':
            return text.toLowerCase().replace(/\s+/g, '-');
        default:
            return text;
    }
}

function addText(text, textToAdd) {
    return text + (text && textToAdd ? ' ' : '') + textToAdd;
}

function removeText(text, textToRemove) {
    return text.replace(new RegExp(textToRemove, 'g'), '');
}

function replaceText(text, from, to) {
    return text.replace(new RegExp(from, 'g'), to);
}

// DOM elements
const inputText = document.getElementById('inputText');
const textInfo = document.getElementById('textInfo');
const addTextInput = document.getElementById('addText');
const removeTextInput = document.getElementById('removeText');
const replaceFromInput = document.getElementById('replaceFrom');
const replaceToInput = document.getElementById('replaceTo');

// Event listeners
inputText.addEventListener('input', updateTextInfo);

// Functions
function updateTextInfo() {
    const text = inputText.value;
    const charCount = text.length;
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    textInfo.textContent = `Characters: ${charCount} | Words: ${wordCount}`;
}

function convertCase(caseType) {
    inputText.value = convertCase(inputText.value, caseType);
    updateTextInfo();
}

function handleAddText() {
    inputText.value = addText(inputText.value, addTextInput.value);
    addTextInput.value = '';
    updateTextInfo();
}

function handleRemoveText() {
    inputText.value = removeText(inputText.value, removeTextInput.value);
    removeTextInput.value = '';
    updateTextInfo();
}

function handleReplaceText() {
    inputText.value = replaceText(inputText.value, replaceFromInput.value, replaceToInput.value);
    replaceFromInput.value = '';
    replaceToInput.value = '';
    updateTextInfo();
}

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Initial text info update
updateTextInfo();
