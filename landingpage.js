console.log("updated-12:36")
const canvas = document.getElementById("cakeCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let balloons = [];
let imageLoaded = false;
let vortexActive = false;
let showTextFallback = false;
let particleLimit = 2000; // Start with a lower particle limit
let fps = 60;
let lastFrameTime = performance.now();
let mouseX = 0;
let mouseY = 0;
let particleSize = 3.5;

const MAX_WIDTH = 662;  // Max width of the image
const MAX_HEIGHT = 408; // Max height of the image

let showingImage = true; // Track whether the image is displayed
let allParticlesStopped = false; // Track if particles have stopped moving

// Set canvas size to window size and make it responsive
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (imageLoaded) {
        createImageParticles(birthdayImage);
    }
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Load the Birthday image and convert it into particles
const birthdayImage = new Image();
birthdayImage.src = 'public/images/assets/Birthday.png';

birthdayImage.onload = () => {
    imageLoaded = true;
    createImageParticles(birthdayImage);
};

// Function to draw the image only if the flag `showingImage` is true
function drawImageWithParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    if (showingImage) {
        const scaleFactor = Math.min(canvas.width / MAX_WIDTH, canvas.height / MAX_HEIGHT, 1);
        const imageWidth = MAX_WIDTH * scaleFactor;
        const imageHeight = MAX_HEIGHT * scaleFactor;
        const imageX = (canvas.width - imageWidth) / 2;
        const imageY = (canvas.height - imageHeight) / 2;
        ctx.drawImage(birthdayImage, imageX, imageY, imageWidth, imageHeight); // Draw the image if showingImage is true
    }

    // Then render particles over the image
    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Create particles from the center-positioned and scaled image
function createImageParticles(image) {
    particles = [];
    allParticlesStopped = false; // Reset the stopped flag when recreating particles

    const scaleFactor = Math.min(canvas.width / MAX_WIDTH, canvas.height / MAX_HEIGHT, 1);
    const imageWidth = MAX_WIDTH * scaleFactor;
    const imageHeight = MAX_HEIGHT * scaleFactor;
    const imageX = (canvas.width - imageWidth) / 2;
    const imageY = (canvas.height - imageHeight) / 2;

    ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight);
    const imageData = ctx.getImageData(imageX, imageY, imageWidth, imageHeight);

    for (let i = 0; i < imageData.width; i += 10) {
        for (let j = 0; j < imageData.height; j += 10) {
            const pixelIndex = (j * imageData.width + i) * 4;
            const alpha = imageData.data[pixelIndex + 3];

            if (alpha > 128 && particles.length < particleLimit) {
                const particle = {
                    x: Math.random() * canvas.width * 2 - canvas.width,
                    y: Math.random() * canvas.height * 2 - canvas.height,
                    size: particleSize,
                    color: `rgba(${imageData.data[pixelIndex]}, ${imageData.data[pixelIndex + 1]}, ${imageData.data[pixelIndex + 2]}, ${imageData.data[pixelIndex + 3] / 255})`,
                    speedX: 0,
                    speedY: 0,
                    originalX: imageX + i,
                    originalY: imageY + j,
                    isStopped: false // Track if the particle has stopped
                };
                particles.push(particle);
            }
        }
    }
}

// Animate particles, balloons, and handle mouse interaction
function animate() {
    drawImageWithParticles(); // Draw the image and particles together

    adjustParticleCount(); // Check FPS and adjust particles dynamically

    // Animate balloons
    balloons.forEach(b => {
        if (vortexActive) {
            const angle = Math.atan2(canvas.height / 2 - b.y, canvas.width / 2 - b.x);
            const speed = Math.random() * 2 + 1;
            b.x += Math.cos(angle) * speed;
            b.y += Math.sin(angle) * speed;

            if (Math.hypot(b.x - canvas.width / 2, b.y - canvas.height / 2) < 50) {
                b.explode();
            }
        } else {
            b.update();
        }
        b.draw(ctx);
    });

    particles.forEach(p => {
        if (vortexActive) {
            const angle = Math.atan2(canvas.height / 2 - p.y, canvas.width / 2 - p.x);
            p.speedX += Math.cos(angle) * 0.5;
            p.speedY += Math.sin(angle) * 0.5;
        } else {
            p.x += (p.originalX - p.x) * 0.05;
            p.y += (p.originalY - p.y) * 0.05;
        }
    });

    requestAnimationFrame(animate); // Continue animation
}

// Adjust particle count based on FPS
function adjustParticleCount() {
    const now = performance.now();
    const deltaTime = now - lastFrameTime;
    lastFrameTime = now;

    fps = 1000 / deltaTime;

    if (fps < 30 && particleLimit > 1000) {
        particleLimit -= 200;
        particleSize += 1;
    } else if (fps > 50 && particleLimit < 3000) {
        particleLimit += 100;
        particleSize = Math.max(2, particleSize - 1);
    }

    if (fps < 20) {
        showTextFallback = true;
    }
}

// Create a balloon
function createBalloon() {
    const randomBalloonImage = balloonImages[Math.floor(Math.random() * balloonImages.length)];
    const x = Math.random() * canvas.width;
    const y = canvas.height;
    const speed = Math.random() * 8 + 1;
    const lifespan = Math.random() * 100 + 300;
    const balloon = new Balloon(randomBalloonImage, x, y, speed, lifespan);
    balloons.push(balloon);
}

// Load balloons
const balloonImages = [];

function loadBalloons() {
    for (let i = 1; i <= 34; i++) {
        const img = new Image();
        img.src = `public/images/Balloons/Form1/balloon_form_1_${i}.png`;
        balloonImages.push(img);
    }
    for (let i = 1; i <= 9; i++) {
        const img = new Image();
        img.src = `public/images/Balloons/Form2/balloon_form_2_${i}.png`;
        balloonImages.push(img);
    }
    for (let i = 1; i <= 18; i++) {
        const img = new Image();
        img.src = `public/images/Balloons/Form3/balloon_form_3_${i}.png`;
        balloonImages.push(img);
    }
    console.log(balloonImages)
}

// Handle mouse movement over the canvas
canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Trigger vortex effect on click and hide the image
const vortextFUnction = () => {
    vortexActive = !vortexActive;

    if (vortexActive) {
        particles.forEach(p => {
            const angle = Math.atan2(canvas.height / 2 - p.y, canvas.width / 2 - p.x);
            const speed = Math.random() * 5 + 2;
            p.speedX = Math.cos(angle) * speed;
            p.speedY = Math.sin(angle) * speed;
        });

        //balloons.forEach(b => {
            //const angle = Math.atan2(canvas.height / 2 - b.y, canvas.width / 2 - b.x);
            //const speed = Math.random() * 5 + 2;
            //b.speedX = Math.cos(angle) * speed;
            //b.speedY = Math.sin(angle) * speed;
        //});

        // Trigger page transition 3 seconds after explosion
        setTimeout(() => {
            window.location.href = "secpage.html";  // Replace with your actual page URL
        }, 6000);  // 3-second delay
    }
};

// On click, remove the image and activate the vortex
canvas.addEventListener("click", () => {
    showingImage = false; // Hide the image when clicked
    vortextFUnction();    // Trigger vortex effect if particles are shown again
});

// Start animation
document.fonts.ready.then(() => {

    // Get elements for audio and the permission button
    const audio = document.getElementById('backgroundMusic');
    const audioPermissionButton = document.getElementById('audioPermission');
    const buttonWrap = document.getElementById('buttonWrap');

    // Function to handle the user granting permission
    function enableAudio() {
        // Play the audio
        audio.play()
            .then(() => {
                // If playback starts, hide the permission button
                audioPermissionButton.style.display = 'none';
                buttonWrap.style.display = 'none';

                loadBalloons();
                setInterval(createBalloon, 2000);

                animate();

            })
            .catch(error => {
                console.error('Failed to start audio playback:', error);
            });

        // Listen for the audio to end
        audio.addEventListener('ended', () => {
            vortextFUnction();
        });
    }

    // Add event listener to the button for starting the audio
    audioPermissionButton.addEventListener('click', enableAudio);

});
