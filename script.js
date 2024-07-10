// with sheets v2

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz3qPuWPYmnKu91nUyW25KTOzBP7yeGZ9oRRZW3L2q7FmG6Kdxm69G2uFZPhUn4sEDWiQ/exec'; // Replace with your web app URL

document.addEventListener("DOMContentLoaded", function() {
    // Disable the buttons initially
    document.getElementById('in-button').disabled = true;
    document.getElementById('out-button').disabled = true;
});

document.getElementById('in-button').addEventListener('click', function() {
    switchContent(`
        <div>
            <p>Scan LOCATION</p>
            <div class="qr-code" id="qr-code-location">
                <img src="qr-code.png" alt="QR Code">
            </div>
            <input type="text" id="scanned-text-location" placeholder="SCANNED TEXT">
            <button id="submit-location">SUBMIT</button>
            <div id="qr-reader-location" class="qr-reader" style="display:none;"></div>
        </div>
    `);

    // Add the event listener after the element is created
    document.getElementById('qr-code-location').addEventListener('click', function() {
        initializeQrCodeScanner('qr-reader-location', 'scanned-text-location', 'qr-code-location');
    });

    document.getElementById('submit-location').addEventListener('click', function() {
        const scannedText = document.getElementById('scanned-text').value;
        const scannedTextLocation = document.getElementById('scanned-text-location').value;
        sendDataToGoogleSheets({ scannedText, scannedTextLocation });
    });
});

document.getElementById('out-button').addEventListener('click', function() {
    switchContent(`
        <div>
            <input type="text" id="order-number" placeholder="ENTER ORDER #" style="margin-bottom: 10px;">
            <button id="submit-order">SUBMIT</button>
        </div>
    `);

    document.getElementById('submit-order').addEventListener('click', function() {
        const scannedText = document.getElementById('scanned-text').value;
        const orderNumber = document.getElementById('order-number').value;
        sendDataToGoogleSheets({ scannedText, orderNumber });
    });
});

document.getElementById('qr-code-button').addEventListener('click', function() {
    initializeQrCodeScanner('qr-reader', 'scanned-text', 'qr-code-button');
});

function switchContent(content) {
    const additionalContent = document.getElementById('additional-content');
    
    // Apply exit animation
    additionalContent.style.animation = 'slide-down 0.5s forwards';
    
    // Wait for the exit animation to complete
    setTimeout(() => {
        additionalContent.innerHTML = content;
        additionalContent.style.display = 'block';
        
        // Apply entry animation
        additionalContent.style.animation = 'slide-up 0.5s forwards';
        
        // Add the event listener for the dynamically created QR code location button
        if (document.getElementById('qr-code-location')) {
            document.getElementById('qr-code-location').addEventListener('click', function() {
                initializeQrCodeScanner('qr-reader-location', 'scanned-text-location', 'qr-code-location');
            });
        }
    }, 500); // Match this duration to the exit animation duration
}

function initializeQrCodeScanner(readerId, inputId, qrCodeContainerId) {
    // Check if Html5Qrcode is defined
    if (typeof Html5Qrcode === 'undefined') {
        console.error('Html5Qrcode is not defined. Ensure the html5-qrcode library is loaded correctly.');
        return;
    }
    
    const qrCodeContainer = document.getElementById(qrCodeContainerId);
    qrCodeContainer.innerHTML = ''; // Clear the QR code image
    
    const qrReader = document.createElement('div'); // Create a new div for the video
    qrReader.id = readerId;
    qrReader.classList.add('qr-reader'); // Add class for styling
    qrCodeContainer.appendChild(qrReader); // Append the video div to the container

    const html5QrCode = new Html5Qrcode(readerId);
    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: 250 // Set the size of the QR code box
        },
        qrCodeMessage => {
            document.getElementById(inputId).value = qrCodeMessage;
            // Enable the buttons after a QR code is scanned
            document.getElementById('in-button').disabled = false;
            document.getElementById('out-button').disabled = false;
            html5QrCode.stop().then(() => {
                qrCodeContainer.innerHTML = '<img src="qr-code.png" alt="QR Code">'; // Restore the QR code image
            });
        },
        errorMessage => {
            console.log(`QR Code no longer in front of camera. Error = ${errorMessage}`);
        })
        .catch(err => {
            console.log(`Unable to start scanning, error: ${err}`);
        });
}

function sendDataToGoogleSheets(data) {
    fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
