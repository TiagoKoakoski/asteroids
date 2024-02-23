const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    angle: 0,
    rotationSpeed: 0.1,
    speed: 0,
    acceleration: 0.5,
    friction: 0.99,
    movingForward: false,
    rotatingLeft: false,
    rotatingRight: false,
    alive: true
};

let asteroids = [];
let bullets = []; // Lista para armazenar os projéteis

function createAsteroid(x, y, radius) {
    return {
        x: x,
        y: y,
        radius: radius,
        dx: Math.random() * 2 - 1,
        dy: Math.random() * 2 - 1
    };
}

function createBullet(x, y, angle) {
    return {
        x: x,
        y: y,
        radius: 2,
        dx: Math.sin(angle) * 5,
        dy: -Math.cos(angle) * 5
    };
}

function drawShip() {
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    ctx.strokeStyle = ship.alive ? "#fff" : "#f00";
    ctx.beginPath();
    ctx.moveTo(0, -ship.radius);
    ctx.lineTo(ship.radius, ship.radius);
    ctx.lineTo(0, ship.radius * 0.6);
    ctx.lineTo(-ship.radius, ship.radius);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

function drawAsteroids() {
    ctx.fillStyle = "#fff";
    asteroids.forEach(asteroid => {
        ctx.beginPath();
        ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawBullets() {
    ctx.fillStyle = "#f00";
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function checkCollision() {
    asteroids.forEach((asteroid, asteroidIndex) => {
        const distance = Math.sqrt(Math.pow(ship.x - asteroid.x, 2) + Math.pow(ship.y - asteroid.y, 2));
        if (distance < ship.radius + asteroid.radius) {
            ship.alive = false;
        }

        bullets.forEach((bullet, bulletIndex) => {
            const distance = Math.sqrt(Math.pow(bullet.x - asteroid.x, 2) + Math.pow(bullet.y - asteroid.y, 2));
            if (distance < bullet.radius + asteroid.radius) {
                asteroids.splice(asteroidIndex, 1); // Remove o asteroide
                bullets.splice(bulletIndex, 1); // Remove o projétil
            }
        });
    });
}

function updateBulletsPosition() {
    bullets.forEach(bullet => {
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;
    });
}

function updateAsteroidsPosition() {
    asteroids.forEach(asteroid => {
        if (asteroid.x < 0) {
            asteroid.x = canvas.width;
        } else if (asteroid.x > canvas.width) {
            asteroid.x = 0;
        }
        if (asteroid.y < 0) {
            asteroid.y = canvas.height;
        } else if (asteroid.y > canvas.height) {
            asteroid.y = 0;
        }

        asteroid.x += asteroid.dx;
        asteroid.y += asteroid.dy;
    });
}

function restartGame() {
    ship = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 15,
        angle: 0,
        rotationSpeed: 0.1,
        speed: 0,
        acceleration: 0.5,
        friction: 0.99,
        movingForward: false,
        rotatingLeft: false,
        rotatingRight: false,
        alive: true
    };
    asteroids = [];
    bullets = [];
    init();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (ship.alive) {
        ship.x += ship.speed * Math.sin(ship.angle);
        ship.y -= ship.speed * Math.cos(ship.angle);
    }

    if (ship.alive) {
        ship.speed *= ship.friction;

        if (ship.movingForward) {
            ship.speed += ship.acceleration;
        }
        if (ship.rotatingLeft) {
            ship.angle -= ship.rotationSpeed;
        }
        if (ship.rotatingRight) {
            ship.angle += ship.rotationSpeed;
        }
    }

    updateAsteroidsPosition();
    updateBulletsPosition();

    if (ship.alive) {
        checkCollision();
    }

    drawShip();
    drawAsteroids();
    drawBullets();

    requestAnimationFrame(update);
}

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") {
        ship.rotatingLeft = true;
    } else if (event.key === "ArrowRight") {
        ship.rotatingRight = true;
    } else if (event.key === "ArrowUp") {
        ship.movingForward = true;
    } else if (event.key === " ") { // Tecla de espaço para disparar
        const bullet = createBullet(ship.x, ship.y, ship.angle);
        bullets.push(bullet);
    }
});

document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowLeft") {
        ship.rotatingLeft = false;
    } else if (event.key === "ArrowRight") {
        ship.rotatingRight = false;
    } else if (event.key === "ArrowUp") {
        ship.movingForward = false;
    }
});

document.getElementById("restartButton").addEventListener("click", restartGame);

function init() {
    for (let i = 0; i < 5; i++) {
        let radius = Math.random() * 20 + 10;
        asteroids.push(createAsteroid(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            radius
        ));
    }
    update();
}

init();
