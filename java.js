function onSecondScanSuccess(decodedText) {
  document.getElementById('second-scanned-text').value = decodedText;
  secondHtml5QrCode.stop().then(() => {
    if (document.querySelector('input[name="status"]:checked').value === 'IN') {
      document.getElementById('second-reader').innerHTML = '<img src="qr.svg" alt="Scan QR code" width="180">';
    } else {
      document.getElementById('second-reader').innerHTML = '<img src="grayqr.svg" alt="Scan QR code" width="180">';
    }
  }).catch(err => {
    console.error("Error stopping second QR code scanner: ", err);
  });
}
