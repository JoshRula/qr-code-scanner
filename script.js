document.getElementById('in-button').addEventListener('click', function() {
    switchContent(`
        <div>
            <p>Scan LOCATION</p>
            <div class="qr-code">
                <img src="qr-code.png" alt="QR Code">
            </div>
            <input type="text" placeholder="SCANNED TEXT">
            <button>SUBMIT</button>
        </div>
    `);
});

document.getElementById('out-button').addEventListener('click', function() {
    switchContent(`
        <div>
            <input type="text" placeholder="ENTER ORDER #" style="margin-bottom: 10px;">
            <button>SUBMIT</button>
        </div>
    `);
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
