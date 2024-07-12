document.addEventListener("DOMContentLoaded", function() {
    var submitted = false;

    document.getElementById('in-button').disabled = true;
    document.getElementById('out-button').disabled = true;

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
        addLocationEventListeners();
    });

    document.getElementById('out-button').addEventListener('click', function() {
        switchContent(`
            <div>
                <input type="text" id="order-number" placeholder="ENTER ORDER #" style="margin-bottom: 10px;">
                <button id="submit-order">SUBMIT</button>
            </div>
        `);
        addOrderEventListeners();
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

function switchContent(content) {
    const additionalContent = document.getElementById('additional-content');
    additionalContent.style.animation = 'slide-down 0.5s forwards';

    setTimeout(() => {
        additionalContent.innerHTML = content;
        additionalContent.style.display = 'block';
        additionalContent.style.animation = 'slide-up 0.5s forwards';
        if (document.getElementById('submit-location')) {
            addLocationEventListeners();
        }
        if (document.getElementById('submit-order')) {
            addOrderEventListeners();
        }
    }, 500);
}

function addLocationEventListeners() {
    const qrCodeLocation = document.getElementById('qr-code-location');
    if (qrCodeLocation) {
        qrCodeLocation.addEventListener('click', function() {
            initializeQrCodeScanner('qr-reader-location', 'scanned-text-location', 'qr-code-location');
        });
    }

    const submitLocation = document.getElementById('submit-location');
    if (submitLocation) {
        submitLocation.addEventListener('click', function() {
            submitForm('IN');
        });
    }
}

function addOrderEventListeners() {
    const submitOrder = document.getElementById('submit-order');
    if (submitOrder) {
        submitOrder.addEventListener('click', function() {
            submitForm('OUT');
        });
    }
}

function submitForm(action) {
    const scannedText = document.getElementById('scanned-text').value;
    const scannedTextLocation = document.getElementById('scanned-text-location') ? document.getElementById('scanned-text-location').value : '';
    const orderNumber = document.getElementById('order-number') ? document.getElementById('order-number').value : '';
    
    document.getElementById('field1').value = scannedText;
    document.getElementById('field2').value = action === 'IN' ? scannedTextLocation : orderNumber;
    document.getElementById(action.toLowerCase() + '-radio').checked = true;

    submitted = true;
    document.getElementById('google-form').submit();
}
