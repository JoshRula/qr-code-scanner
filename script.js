document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('in-button').disabled = true;
    document.getElementById('out-button').disabled = true;

    document.getElementById('in-button').addEventListener('click', function() {
        submitForm('IN');
    });

    document.getElementById('out-button').addEventListener('click', function() {
        submitForm('OUT');
    });

    document.getElementById('qr-code-button').addEventListener('click', function() {
        initializeQrCodeScanner('qr-reader', 'scanned-text', 'qr-code-button');
    });
});

function initializeQrCodeScanner(readerId, inputId, qrCodeContainerId) {
    if (typeof Html5Qrcode === 'undefined') {
        console.error('Html5Qrcode is not defined. Ensure the html5-qrcode library is loaded correctly.');
        return;
    }
    
    const qrCodeContainer = document.getElementById(qrCodeContainerId);
    qrCodeContainer.innerHTML = '';
    
    const qrReader = document.createElement('div');
    qrReader.id = readerId;
    qrReader.classList.add('qr-reader');
    qrCodeContainer.appendChild(qrReader);

    const html5QrCode = new Html5Qrcode(readerId);
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        qrCodeMessage => {
            document.getElementById(inputId).value = qrCodeMessage;
            document.getElementById('in-button').disabled = false;
            document.getElementById('out-button').disabled = false;
            html5QrCode.stop().then(() => {
                qrCodeContainer.innerHTML = '<img src="qr-code.png" alt="QR Code">';
            });
        },
        errorMessage => {
            console.log(`QR Code no longer in front of camera. Error = ${errorMessage}`);
        }
    ).catch(err => {
        console.log(`Unable to start scanning, error: ${err}`);
    });
}

function submitForm(action) {
    const scannedText = document.getElementById('scanned-text').value;
    document.getElementById('field1').value = scannedText;
    document.getElementById(action.toLowerCase() + '-radio').checked = true;

    document.getElementById('google-form').submit();
}
