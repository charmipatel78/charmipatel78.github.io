// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Particle Network Animation
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const numberOfParticles = 80;

// Mouse position
let mouse = {
    x: null,
    y: null,
    radius: 150
};

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Particle class with glow effect
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.opacity = Math.random() * 0.5 + 0.5;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        
        // Add glow effect
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        gradient.addColorStop(0, `rgba(167, 139, 250, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(167, 139, 250, ${this.opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(167, 139, 250, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw solid center
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }

    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Check collision with mouse
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 5;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 5;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 5;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 5;
            }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        
        // Pulsing effect
        this.opacity = Math.sin(Date.now() * 0.001 + this.x) * 0.3 + 0.7;
        
        this.draw();
    }
}

// Initialize particles
function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2.5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.5) - 0.25;
        let directionY = (Math.random() * 0.5) - 0.25;
        let color = 'rgba(167, 139, 250, 0.8)';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Connect particles with lines
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                
                // Gradient line
                const gradient = ctx.createLinearGradient(
                    particlesArray[a].x, particlesArray[a].y,
                    particlesArray[b].x, particlesArray[b].y
                );
                gradient.addColorStop(0, `rgba(167, 139, 250, ${opacityValue * 0.5})`);
                gradient.addColorStop(0.5, `rgba(124, 58, 237, ${opacityValue * 0.3})`);
                gradient.addColorStop(1, `rgba(167, 139, 250, ${opacityValue * 0.5})`);
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Resize event
window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = 150;
    init();
});

// Mouse out event
window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Initialize and start animation
init();
animate();
