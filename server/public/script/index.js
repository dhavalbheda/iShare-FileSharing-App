// Drag and Drop Area
const dropZone = document.querySelector('.drop-zone');
const shareIcon = document.querySelector('.share-icon')
const openBoxIcon = document.querySelector('.open-box-icon')
const uploadIcon = document.querySelector('.upload-icon')
const mailSendIcon = document.querySelector('.mail-send-icon')
const fileInput = document.querySelector('#fileinput')
const browseButton = document.querySelector('.browse-button')

// Progress Bar
const bgProgress = document.querySelector('.bg-progress')
const percent = document.querySelector('#percent')
const progressContainer = document.querySelector('.progress-container');

// Sharing Container
const sharingContainer = document.querySelector('.sharing-container');
const fileURL = document.querySelector('#fileURL');
const copyButton = document.querySelector('#copy-button');

// Email Form
const emailForm = document.querySelector('#email-form');

// alert Box
const alertBox = document.querySelector('.alert-box');

const BASE_URL = "https://dhaval-ishare.herokuapp.com/api/files";

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    if(!shareIcon.classList.contains('hide-icon')) {
        shareIcon.classList.add('hide-icon');
        openBoxIcon.classList.remove('hide-icon')
        dropZone.classList.add('dragged-drop-zone');
    }
})

dropZone.addEventListener('dragleave', () => {  
    // Add and remove class
    dropZone.classList.remove('dragged-drop-zone');
    shareIcon.classList.remove('hide-icon')
    openBoxIcon.classList.add('hide-icon')
})

dropZone.addEventListener('drop', (event) => {  
    // Add and remove class
    event.preventDefault();
    dropZone.classList.remove('dragged-drop-zone');
    uploadIcon.classList.remove('hide-icon')
    openBoxIcon.classList.add('hide-icon')

    // Add file in fileInput 
    const files = event.dataTransfer.files;
    if(files.length) {
        fileInput.files = files;
        uploadFile()
    }

})

// File input click
browseButton.addEventListener('click', () => {
    fileInput.click()
})

fileInput.addEventListener('change', () => {
    uploadFile()
})

// Upload File 
const uploadFile = () => {
    if(fileInput.files.length > 1) {
        showAlertBox('Only Upload One File');
        return;
    }
    const file = fileInput.files[0]
    const formData = new FormData()

    if(file.size > (50*1024*1024)) {
        showAlertBox(`Can't Upload More Then 50MB...`);
        resetFileInput();
        return;
    }
    progressContainer.style.display = 'block';
    formData.append('uploadFile', file)
    
    const ajax = new XMLHttpRequest()
    ajax.onreadystatechange = () => {

        if(ajax.readyState === XMLHttpRequest.DONE) {
        sharingContainer.style.display = 'block';
            showLink(JSON.parse(ajax.response))
            uploadIcon.classList.add('hide-icon')
            shareIcon.classList.remove('hide-icon')

        }
    }

    ajax.upload.onprogress = updateProgress;

    ajax.onerror = () => {
        resetFileInput();
        showAlertBox(`Error While Uploadin: ${ajax.statusText}`);
    }

    ajax.open('POST', BASE_URL)
    ajax.send(formData)

}
// Progress Bar
const updateProgress = (event) => {
    const percentage = Math.round((event.loaded/event.total) * 100)
    bgProgress.style.width = `${percentage}%`
    percent.innerText = `${percentage}`
}

// Show Link
const showLink = ({url}) => {
    progressContainer.style.display = 'none';
    fileURL.value = url;
    emailForm.elements['submit'].removeAttribute('disabled', 'true');
    emailForm.elements['sender-email'].value = ''
    emailForm.elements['receiver-email'].value = '';
    resetFileInput();
}

// Link Copy Button Click
copyButton.addEventListener('click', () => {
    fileURL.select();
    document.execCommand('copy');
    showAlertBox('Link Copied...');
});

// Email Sent Button Click 
emailForm.addEventListener('submit', (e) => {
    e.preventDefault()
    emailForm.elements['submit'].setAttribute('disabled', 'true');
    shareIcon.classList.add('hide-icon')
    mailSendIcon.classList.remove('hide-icon')

    const formData = {
        uuid: (fileURL.value).split('/').splice(-1, 1)[0],
        sender: emailForm.elements['sender-email'].value,
        receiver: emailForm.elements['receiver-email'].value
    }

    let url = BASE_URL + '/sendEmail';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            sharingContainer.style.display = 'none';
            showAlertBox('Email Has Been Sent..')
        } else {
            sharingContainer.style.display = 'none';
            showAlertBox('Email Already Sent..')
        }
        shareIcon.classList.remove('hide-icon')
        mailSendIcon.classList.add('hide-icon')
    })
})

// Show Alert Box
let timer;
const showAlertBox = (message) => {
    alertBox.innerText = message;
    alertBox.style.transform = "translate(-50%, 0)";
    
    clearTimeout(timer);
    timer = setTimeout(() => hideAlertBox(), 2000)
}

// Remove Alert Box
const hideAlertBox = () => {
    alertBox.innerText = '';
    alertBox.style.transform = "translate(-50%, 60px)";
}

// Reset File input field
const resetFileInput = () => {
    fileInput.value = '';
}