document.addEventListener('DOMContentLoaded', function() {
    const inputTextarea = document.getElementById('input');
    const outputTextarea = document.getElementById('output');
    const separatorSelect = document.getElementById('separator');
    const separateByLineCheckbox = document.getElementById('separateByLine');
    const separateButton = document.getElementById('separateButton');
    const clearInputButton = document.getElementById('clearInput');
    const copyOutputButton = document.getElementById('copyOutput');
    const clearOutputButton = document.getElementById('clearOutput');

    separateButton.addEventListener('click', handleSeparate);
    clearInputButton.addEventListener('click', clearInput);
    copyOutputButton.addEventListener('click', copyOutput);
    clearOutputButton.addEventListener('click', clearOutput);

    function handleSeparate() {
        const input = inputTextarea.value;
        const separator = separatorSelect.value;
        const separateByLine = separateByLineCheckbox.checked;

        const items = input.split(/\s+/).filter(item => item.trim() !== '');
        let result;

        if (separateByLine) {
            result = items.join(separator + '\n');
        } else {
            result = items.join(separator);
        }

        outputTextarea.value = result;
    }

    function clearInput() {
        inputTextarea.value = '';
    }

    function copyOutput() {
        outputTextarea.select();
        document.execCommand('copy');
        alert('Result copied to clipboard!');
    }

    function clearOutput() {
        outputTextarea.value = '';
    }
});

