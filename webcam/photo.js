const width = 640, height = 480;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

let video = null, isSetup = false;
let bubbles = [];

Setup();
function Setup() {
    if (!isSetup) {
        canvas.width = width;
        canvas.height = height;

        video = document.getElementById('camera');
        document.addEventListener('click', takePhoto);

        // Start generating bubbles
        setInterval(generateBubble, 1000);

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then((stream) => {
                video.srcObject = stream;
                video.play();
            }).catch((err) => {
                console.error(`Error obtaining video stream:\n ${err}`);
            });

        isSetup = true;
    }
}

function takePhoto(e) {
    e.preventDefault();
    ctx.drawImage(video, 0, 0, width, height);

 
    // Add coral
    const coralImage = new Image();
    coralImage.src = 'img/Coral1.webp'; // Replace with the path to your coral image
    coralImage.onload = function () {
        ctx.drawImage(coralImage, 0, 110, 200, 440); // Adjust the position and size as needed
        ctx.drawImage(coralImage, 500, 250, 120, 270); // Adjust the position and size as needed
    };

    // Draw bubbles
    bubbles.forEach(bubble => {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
        ctx.closePath();
        bubble.y -= bubble.speed;

        // Remove bubbles that are off-screen
        if (bubble.y + bubble.radius < 0) {
            bubbles.splice(bubbles.indexOf(bubble), 1);
        }
    });

    // Simulate underwater effect
    ctx.fillStyle = 'rgba(0, 100, 255, 0.5)'; // Semi-transparent blue
    ctx.fillRect(0, 0, width, height);
}

function generateBubble() {
    const bubble = {
        x: Math.random() * width,
        y: height,
        radius: Math.random() * 10 + 5, // Random radius between 5 and 15
        speed: Math.random() * 2 + 1 // Random speed between 1 and 3
    };
    bubbles.push(bubble);
}