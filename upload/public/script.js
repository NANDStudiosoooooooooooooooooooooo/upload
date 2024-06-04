// script.js
document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const preview = document.getElementById('preview');
    const linkContainer = document.getElementById('linkContainer');
    const imageLink = document.getElementById('imageLink');
    const copyButton = document.getElementById('copyButton');

    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', handleFiles);

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles({ target: { files } });
    });

    function handleFiles(event) {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const formData = new FormData();
                formData.append('image', file);

                fetch('/upload', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.filePath) {
                        preview.innerHTML = `<img src="${data.filePath}" alt="Uploaded Image">`;
                        imageLink.href = data.filePath;
                        imageLink.textContent = data.filePath;
                        linkContainer.style.display = 'block';
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while uploading the file.');
                });
            } else {
                alert('Please upload a valid image file.');
            }
        }
    }

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(imageLink.href)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Error copying link: ', err);
            });
    });
});
