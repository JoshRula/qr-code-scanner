document.getElementById('in-button').addEventListener('click', function() {
    switchContent(`
        <div>
            <p>Scan LOCATION</p>
            <div class="qr-code" id="qr-code-location">
                <img src="qr-code.png" alt="QR Code">
            </div>
            <input type="text" id="scanned-text-location" placeholder="SCANNED TEXT">
            <button>SUBMIT</button>
            <div id="qr-reader-location" style="display:none;">
                <div id="reader-location"></div>
            </div>
        </div>
    `);
    initializeQrCodeScanner('reader-location', 'scanned-text-location');
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
    initializeQrCodeScanner('reader', 'scanned-text');
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

function initializeQrCodeScanner(readerId, inputId) {
    const qrReader = document.getElementById('qr-reader');
    qrReader.style.display = 'block';

    const html5QrCode = new Html5Qrcode(readerId);
    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: 250
        },
        qrCodeMessage => {
            document.getElementById(inputId).value = qrCodeMessage;
            html5QrCode.stop().then(() => {
                document.getElementById(readerId).innerHTML = "";
                qrReader.style.display = 'none';
            });
        },
        errorMessage => {
            console.log(`QR Code no longer in front of camera. Error = ${errorMessage}`);
        })
        .catch(err => {
            console.log(`Unable to start scanning, error: ${err}`);
        });
}
