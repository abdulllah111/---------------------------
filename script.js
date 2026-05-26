const canvas = document.getElementById('certificateCanvas');
const ctx = canvas.getContext('2d');
const nameInput = document.getElementById('nameInput');
const downloadBtn = document.getElementById('downloadBtn');

const img = new Image();
// Removed crossOrigin as it causes issues when running via file:// protocol
img.src = 'sert.png';

img.onload = () => {
    console.log("Image loaded successfully:", img.width, "x", img.height);
    canvas.width = img.width;
    canvas.height = img.height;

    document.fonts.ready.then(() => {
        drawCertificate();
    });
};

img.onerror = () => {
    console.error("Failed to load image 'sert.png'. Make sure the file exists in the same folder.");
    alert("Ошибка: Не удалось загрузить файл сертификата (sert.png).");
};

function drawCertificate() {
    if (!img.complete) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const name = nameInput.value.trim();
    if (name) {
        const fontSize = Math.floor(canvas.width * 0.04); 
        ctx.font = `italic 600 ${fontSize}px 'Playfair Display', serif`;
        ctx.fillStyle = '#4a3728';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const x = canvas.width / 2;
        const y = canvas.height * 0.38;

        ctx.fillText(name, x, y);

        const textWidth = ctx.measureText(name).width;
        const underlineY = y + (fontSize * 0.4);

        ctx.beginPath();
        ctx.moveTo(x - textWidth / 2, underlineY);
        ctx.lineTo(x + textWidth / 2, underlineY);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

nameInput.addEventListener('input', drawCertificate);

downloadBtn.addEventListener('click', () => {
    try {
        const name = nameInput.value.trim() || 'certificate';
        const dataUrl = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.download = `${name}.png`;
        link.href = dataUrl;
        document.body.appendChild(link); // Required for some browsers
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Download failed:", error);
        alert("Не удалось скачать изображение. Если вы открыли файл напрямую через браузер (file://), попробуйте запустить его через локальный сервер (например, Live Server в VS Code).");
    }
});
