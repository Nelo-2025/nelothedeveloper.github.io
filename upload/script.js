const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const fileList = document.getElementById('file-list');
const uploadForm = document.getElementById('upload-form');
const statusBox = document.getElementById('status-box');

const acceptedTypes = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'text/html',
  'application/zip'
];

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function validateFile(file) {
  if (acceptedTypes.includes(file.type) || file.name.match(/\.(csv|pdf|png|jpe?g|html|zip|xlsx)$/i)) {
    return true;
  }
  return false;
}

function updateFileList(files) {
  fileList.innerHTML = '';
  statusBox.textContent = '';

  if (!files.length) {
    statusBox.textContent = 'No files selected yet.';
    return;
  }

  const validFiles = [];
  const invalidFiles = [];

  Array.from(files).forEach(file => {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.innerHTML = `<strong>${file.name}</strong><span>${formatBytes(file.size)} • ${file.type || 'Unknown type'}</span>`;

    if (!validateFile(file)) {
      item.innerHTML += `<p style="color: #b33; margin-top: 0.6rem;">Unsupported file type. Allowed: CSV, ZIP, PDF, HTML, JPG, PNG, XLSX.</p>`;
      invalidFiles.push(file.name);
    } else {
      validFiles.push(file);
      if (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')) {
        const preview = document.createElement('pre');
        preview.style.marginTop = '0.75rem';
        preview.style.background = '#f4f8ff';
        preview.style.padding = '0.8rem';
        preview.style.borderRadius = '10px';
        preview.style.whiteSpace = 'pre-wrap';
        preview.textContent = 'Loading CSV preview...';
        item.appendChild(preview);
        readCsvPreview(file, preview);
      }
    }

    fileList.appendChild(item);
  });

  if (invalidFiles.length) {
    statusBox.textContent = `The following files are not allowed: ${invalidFiles.join(', ')}.`;
    statusBox.style.color = '#8b1e1e';
    statusBox.style.background = '#fdecea';
    return;
  }

  statusBox.textContent = `${validFiles.length} file(s) ready for preview. Choose "Preview Upload" to continue.`;
  statusBox.style.color = '#164e85';
  statusBox.style.background = '#e8f2ff';
}

function readCsvPreview(file, outputElement) {
  const reader = new FileReader();
  reader.onload = () => {
    const lines = reader.result.split(/\r?\n/).slice(0, 6);
    outputElement.textContent = lines.join('\n');
  };
  reader.onerror = () => {
    outputElement.textContent = 'Unable to read CSV preview.';
  };
  reader.readAsText(file);
}

function handleFiles(files) {
  fileInput.files = files;
  updateFileList(files);
}

fileInput.addEventListener('change', () => {
  handleFiles(fileInput.files);
});

['dragenter', 'dragover'].forEach(eventName => {
  dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    dropZone.classList.add('dragover');
  });
});

['dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    dropZone.classList.remove('dragover');
  });
});

dropZone.addEventListener('drop', event => {
  const droppedFiles = event.dataTransfer.files;
  if (droppedFiles.length) {
    handleFiles(droppedFiles);
  }
});

dropZone.addEventListener('click', () => {
  fileInput.click();
});

uploadForm.addEventListener('submit', event => {
  event.preventDefault();

  const files = fileInput.files;
  if (!files.length) {
    statusBox.textContent = 'Please select at least one file to upload.';
    statusBox.style.color = '#8b1e1e';
    statusBox.style.background = '#fdecea';
    return;
  }

  const invalidFile = Array.from(files).find(file => !validateFile(file));
  if (invalidFile) {
    statusBox.textContent = `Please remove invalid file: ${invalidFile.name}`;
    statusBox.style.color = '#8b1e1e';
    statusBox.style.background = '#fdecea';
    return;
  }

  statusBox.textContent = 'Files are validated and ready to submit. Add a backend endpoint to store uploads permanently.';
  statusBox.style.color = '#164e85';
  statusBox.style.background = '#e8f2ff';

  // Example upload code for a server endpoint (uncomment when backend is available):
  // const formData = new FormData(uploadForm);
  // Array.from(files).forEach(file => formData.append('files', file));
  // fetch('/api/upload', { method: 'POST', body: formData })
  //   .then(response => response.json())
  //   .then(result => console.log('Upload complete', result))
  //   .catch(error => console.error('Upload failed', error));
});
