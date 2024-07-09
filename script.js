document.getElementById('in-button').addEventListener('click', function() {
    switchContent(`
        <div>
            <p>Scan LOCATION</p>
            <div class="qr-code" id="qr-code-location">
                <img src="qr-code.PNG" alt="QR Code">
            </div>
            <input type="text" id="scanned-text-location" placeholder="SCANNED TEXT">
            <button>SUBMIT</button>
            <div id="qr-reader-location" style="display:none;">
                <video id="preview-location"></video>
            </div>
        </div>
    `);
    initializeQrCodeScanner('qr-reader-location', 'scanned-text-location', 'preview-location');
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
    initializeQrCodeScanner('qr-reader', 'scanned-text', 'preview');
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

function initializeQrCodeScanner(readerId, inputId, previewId) {
    console.log(`Initializing QR Code Scanner for ${readerId}`);
    const qrReader = document.getElementById(readerId);
    qrReader.style.display = 'block';

    let scanner = new Instascan.Scanner({ video: document.getElementById(previewId) });
    scanner.addListener('scan', function (content) {
        console.log(`Scanned content: ${content}`);
        document.getElementById(inputId).value = content;
        scanner.stop();
        qrReader.style.display = 'none';
    });

    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            console.error('No cameras found.');
        }
    }).catch(function (e) {
        console.error(e);
    });
}
