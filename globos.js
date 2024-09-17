// Define Sandra's favorite colors
const favoriteColors = ['#E6E6FA', '#DDA0DD', '#EE82EE', '#FF00FF', '#FF00FF', '#4B0082', '#D8BFD8', '#DA70D6'];

// Particle class for balloon explosion effect
class Particle {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.width = Math.random() * 10 + 5; // Random rectangle width for confetti
        this.height = Math.random() * 5 + 2; // Random rectangle height for confetti
        this.speedX = (Math.random() * 4) - 2;
        this.speedY = (Math.random() * 4) - 2;
        this.color = favoriteColors[Math.floor(Math.random() * favoriteColors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.05; // Shrink over time
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.random() * Math.PI * 2); // Random rotation for confetti effect
        ctx.fillRect(0, 0, this.width, this.height); // Draw confetti rectangle
        ctx.restore();
    }
}

// Balloon class
class Balloon {
    constructor(image, x, y, speed, lifespan) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.initialX = x;
        this.speed = speed;
        this.lifespan = lifespan;
        this.size = Math.random() * 80 + 50;
        this.age = 0;
        this.particles = [];
        this.exploded = false;
        this.swayAmplitude = Math.random() * 50 + 20;
        this.swaySpeed = Math.random() * 0.05 + 0.02;
        this.horizontalOffset = 0;
    }

    update() {
        if (this.exploded) return;
        this.y -= this.speed;
        this.horizontalOffset = Math.sin(this.age * this.swaySpeed) * this.swayAmplitude;
        this.x = this.initialX + this.horizontalOffset;
        this.age++;
        this.speed *= 0.99;

        if (this.age > this.lifespan) {
            this.explode();
        }
    }

    draw(ctx) {
        if (this.exploded) {
            this.particles.forEach((particle, index) => {
                if (particle.size <= 0.1) {
                    this.particles.splice(index, 1);
                }
                particle.update();
                particle.draw(ctx);
            });
        } else {
            // Check if the image is valid before drawing it
            if (this.image instanceof HTMLImageElement && this.image.complete) {
                // Draw the curly string before the balloon image
                ctx.strokeStyle = '#FFFFFF';  // The color of the string
                ctx.lineWidth = 2;  // The thickness of the string
                ctx.beginPath();

                // Starting point: bottom middle of the balloon
                const startX = this.x + this.size / 2;
                const startY = this.y + this.size;

                // End point: 100 pixels down from the bottom of the balloon
                const endY = this.y + this.size + 100;

                // Curly string using bezier curves
                ctx.moveTo(startX, startY);
                ctx.bezierCurveTo(
                    startX - 20, startY + 30,  // Control point 1 (left curl)
                    startX + 20, startY + 60,  // Control point 2 (right curl)
                    startX, endY               // End point (bottom of the string)
                );
                ctx.stroke();

                // Now draw the balloon image
                ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
            } else {
                console.error('Image not loaded properly', this.image);
            }
        }
    }

    explode() {
        this.exploded = true;
        for (let i = 0; i < 50; i++) {
            this.particles.push(new Particle(this.x + this.size / 2, this.y + this.size / 2, Math.random() * 4 + 2));
        }
    }
}
