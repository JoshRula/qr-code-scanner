document.getElementById('in-button').addEventListener('click', function() {
    switchContent(`
        <div>
            <p>Scan LOCATION</p>
            <div class="qr-code" id="qr-code-location">
                <img src="qr-code.png" alt="QR Code">
            </div>
            <input type="text" id="scanned-text-location" placeholder="SCANNED TEXT">
            <button>SUBMIT</button>
            <div id="qr-reader-location" style="display:none;"></div> <!-- Added for QR scanning -->
        </div>
    `);
    initializeQrCodeScanner('qr-reader-location', 'scanned-text-location'); // Initialize QR scanner
});

document.getElementById('out-button').addEventListener('click', function() {
    switchContent(`
        <div>
            <input type="text" placeholder="ENTER ORDER #" style="margin-bottom: 10px;">
            <button>SUBMIT</button>
        </div>
    `);
});

document.getElementById('qr-code-button').addEventListener('click', function() {
    initializeQrCodeScanner('qr-reader', 'scanned-text'); // Initialize QR scanner
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
    }, 500); // Match this duration to the exit animation duration
}

// Function to initialize QR code scanner
function initializeQrCodeScanner(readerId, inputId) {
    const qrReader = document.getElementById(readerId);
    qrReader.style.display = 'block';

    const html5QrCode = new Html5Qrcode(readerId);
    html5QrCode.start(
        { facingMode: "environment" }, // Use the environment (rear) camera
        {
            fps: 10, // Set the frame rate to 10 fps
            qrbox: 250 // Define the size of the QR code box
        },
        qrCodeMessage => {
            // When a QR code is scanned successfully
            document.getElementById(inputId).value = qrCodeMessage; // Set the scanned message in the input field
            html5QrCode.stop().then(() => {
                qrReader.style.display = 'none'; // Hide the QR reader after scanning
            });
        },
        errorMessage => {
            console.log(`QR Code no longer in front of camera. Error = ${errorMessage}`);
        })
        .catch(err => {
            console.log(`Unable to start scanning, error: ${err}`);
        });
}
