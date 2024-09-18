const canvas = document.getElementById("imageCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const images = [
    { src: 'public/images/personal/1.jpg',
        titleText: "Para la mujer más hermosa del mundo, Sandra Hernández",
        text: `
        Eres mi mejor amiga, mi mejor parte, la que me hace ser más fuerte todos los días. Cuando las cosas van mal o me caigo, tú eres la que me da la fuerza para poder levantarme. No sé cómo lo haces, pero siempre estás ahí cuando más te necesito, y eso es algo que no tiene precio. Eres todo para mí, y no hay forma de agradecer lo suficiente por ser quien eres.
        
        <br><br>
        Te amo con todo mi corazón ❤️
        <br><br>
        Tu Macho - Edgar R.
        `
    },
    {
        src: 'public/images/personal/caitlynn.jpg',
        titleText: "To the most wonderful mom in the entire universe!",
        text: `
        You’re the mom who never gives up on anyone, especially me. I know you’ll love me till the end of time and stand by my side forever and beyond. There’s no one like you, and I’m so lucky to have you as my mom.

        <br><br>
        Love you always,
        <br><br>
        Caitlynn
        `
    },
    {
        src: 'public/images/personal/jennifer.jpg',
        titleText: "Para La Mujer Mas Poderosa Del Mundo",
        text: `
        Mom, you are the hardest-working person I know, always pushing yourself for us, and never giving up no matter how tough things get. You’ve always been my biggest supporter, and I know that your love for me is endless. You’ve been there for me always, despite sometimes that I’m a little “crazy” or give you an attitude. You always try your best to make me and my siblings so happy, you’ve gave me the confidence I have today to express my style and the way I am. I can’t thank you for everything you’ve ever given me mama, you’re my everything.
        <br><br>
        Love you so much,
        <br><br>
        Jennifer
        `
    },
    {
        src: 'public/images/personal/jazlynn.jpg',
        titleText: "To the Frog-Hating, Brother-Wrangling, Wonder Woman of a Mom",
        text: `
        Mom, you are such a good person, and I think you're so beautiful, inside and out. You work really hard every single day, and even though you don’t like frogs (which is kinda funny), I still love you so much. You’re always there for me, like when you stop my little brother from beating me up, and honestly, you're just an incredible person.
        <br><br>
        I’m so lucky to have a mom like you. You’re wonderful in every way, and I love you with all my heart.
        <br><br>
        Love,
        Jazlynn
        `
    },
    {
        src: 'public/images/personal/cumpleanos.jpg',
        titleText: "De parte de todos nosotros",
        text: `
        Te deseamos que tengas un día increíble, aunque te toque ir a trabajar (LOL). Sabemos lo dura que eres, y aún así, esperamos que disfrutes tu día al máximo, porque te lo mereces como nadie.
            <br><br>
        ¡Te queremos mucho!
        `
    },

];
let currentImageIndex = 0;
let particles = [];
let imageLoaded = false;
let imageRendered = false;
let realImageVisible = false;

const pixelSize = 8; // Size of the pixels
const maxImageWidth = 500;
let animationFrame;
const imageText = document.getElementById("imageText");
const imageTitle = document.createElement('div'); // Title element
imageTitle.id = 'imageTitle';
document.body.appendChild(imageTitle);

// Load image and render it as pixels
function loadImageAsPixels() {
    const img = new Image();
    img.src = images[currentImageIndex].src;
    
    img.onload = () => {
        imageLoaded = true;
        createImageParticles(img);
    };
}

// Create particles from the image
function createImageParticles(image) {
    particles = [];
    realImageVisible = false; // Ensure real image is hidden

    // Calculate the scale factor based on the max width of 500px or the canvas size
    const scaleFactor = Math.min(maxImageWidth / image.width, canvas.width / image.width, canvas.height / image.height);
    const imgWidth = Math.min(image.width * scaleFactor, maxImageWidth); // Ensure max width doesn't exceed 500px
    const imgHeight = image.height * scaleFactor;
    const imgX = (canvas.width - imgWidth) / 2;
    const imgY = (canvas.height - imgHeight) / 2;

    ctx.drawImage(image, imgX, imgY, imgWidth, imgHeight);
    const imgData = ctx.getImageData(imgX, imgY, imgWidth, imgHeight);
    
    for (let x = 0; x < imgData.width; x += pixelSize) {
        for (let y = 0; y < imgData.height; y += pixelSize) {
            const pixelIndex = (y * imgData.width + x) * 4;
            const r = imgData.data[pixelIndex];
            const g = imgData.data[pixelIndex + 1];
            const b = imgData.data[pixelIndex + 2];
            const a = imgData.data[pixelIndex + 3];
            
            if (a > 0) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    targetX: imgX + x,
                    targetY: imgY + y,
                    color: `rgba(${r},${g},${b},${a / 255})`,
                    size: pixelSize,
                    speed: Math.random() * 3 + 1
                });
            }
        }
    }

    requestAnimationFrame(animateParticlesToFormImage);
}

// Animate particles to move towards their target position to form the image
function animateParticlesToFormImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let completed = true;
    
    particles.forEach(particle => {
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 1) {
            completed = false;
            particle.x += dx * 0.05 * particle.speed;
            particle.y += dy * 0.05 * particle.speed;
        }

        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    });
    
    if (completed) {
        imageRendered = true;
        showRealImage(); // Show real image
    } else {
        requestAnimationFrame(animateParticlesToFormImage);
    }
}

// Show the real image after the particles have finished moving
function showRealImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the pixels

    const img = new Image();
    img.src = images[currentImageIndex].src;

    img.onload = () => {
        const scaleFactor = Math.min(maxImageWidth / img.width, canvas.width / img.width, canvas.height / img.height);
        const imgWidth = Math.min(img.width * scaleFactor, maxImageWidth);
        const imgHeight = img.height * scaleFactor;
        const imgX = (canvas.width - imgWidth) / 2;
        const imgY = (canvas.height - imgHeight) / 2;
        
        ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
        realImageVisible = true;
        showTitleAndText(); // Show title and text after image is rendered
        canvas.addEventListener('click', handleImageClick);  // Enable click to explode image
    };
}

// Show the title and accompanying text when the image is fully rendered
function showTitleAndText() {
    imageTitle.innerHTML = images[currentImageIndex].titleText;
    imageTitle.style.opacity = 1;
    imageText.innerHTML = images[currentImageIndex].text;
    imageText.style.opacity = 1;
}

// Handle image click and explode it into pixels
function handleImageClick() {
    if (!realImageVisible) return; // Ignore clicks before the real image is shown
    canvas.removeEventListener('click', handleImageClick);  // Disable further clicks
    explodeImage();
}

// Explode image into pixels
function explodeImage() {
    requestAnimationFrame(animateParticlesExplosion);
}

// Animate particles exploding outwards
function animateParticlesExplosion() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.x += (Math.random() - 0.5) * 10;
        particle.y += (Math.random() - 0.5) * 10;
        particle.size *= 0.98;  // Shrink the particles
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    });

    if (particles[0].size > 0.5) {
        requestAnimationFrame(animateParticlesExplosion);
    } else {
        loadNextImage();
    }
}

// Load the next image
function loadNextImage() {
    imageRendered = false;
    realImageVisible = false;
    imageText.style.opacity = 0;
    imageTitle.style.opacity = 0;

    currentImageIndex++;
    if (currentImageIndex >= images.length) {
        currentImageIndex = 0;
    }

    loadImageAsPixels();
}








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

            // Start by loading the first image
            loadImageAsPixels();

        })
        .catch(error => {
            console.error('Failed to start audio playback:', error);
        });

}

// Add event listener to the button for starting the audio
audioPermissionButton.addEventListener('click', enableAudio);