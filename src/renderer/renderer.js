let selectedFilePath = '';

// Handle browse button click
document.getElementById('browse-button').addEventListener('click', () => {
    window.videoInfo.openFileDialog();
});

// Handle when a file is selected from the dialog
window.videoInfo.onFileSelected((filePath) => {
    selectedFilePath = filePath;
    document.getElementById('selected-file').textContent = filePath.split(/[\\/]/).pop(); // Show just the filename
    document.getElementById('file-path').value = filePath;
    document.getElementById('submit-button').disabled = false;
});

// Handle form submission
document.getElementById('video-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (selectedFilePath) {
        document.getElementById('result').textContent = 'Processing...';
        window.videoInfo.processVideo(selectedFilePath);
    }
});

// Handle receiving video metadata
window.videoInfo.receiveVideoMetadata((duration) => {
    document.getElementById('result').textContent = `Video is ${duration} seconds long.`;
});