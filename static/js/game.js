class GameObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Ball extends GameObject {
  constructor(x, y, radius, dx, dy, imageSrc) {
    super(x, y);
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.image = new Image();
    this.image.src = imageSrc;
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  bounce(canvasWidth, canvasHeight) {
    // Bounce off walls
    if (
      this.x + this.dx > canvasWidth - this.radius ||
      this.x + this.dx < this.radius
    ) {
      this.dx = -this.dx;
    }
    if (this.y + this.dy < this.radius) {
      this.dy = -this.dy;
    }
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.dx = 2;
    this.dy = -2;
  }
}

class Paddle extends GameObject {
  constructor(x, y, width, height, speed, imageSrc) {
    super(x, y);
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = 0;
    this.image = new Image();
    this.image.src = imageSrc;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  move(canvasWidth) {
    this.x += this.direction * this.speed;
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.direction = 0;
  }
}

class Game {
  constructor(canvas, scoreBoard, highScoreBoard, leftBtn, rightBtn) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.scoreBoard = scoreBoard;
    this.highScoreBoard = highScoreBoard;
    this.leftBtn = leftBtn;
    this.rightBtn = rightBtn;
    this.backgroundImage = new Image();
    this.backgroundImage.src = "/static/assets/lapangan2.png";
    this.ball = new Ball(200, 300, 10, 2, -2, "/static/assets/bola.png");
    this.paddle = new Paddle(
      300,
      500,
      100,
      100,
      7,
      "/static/assets/ronaldo.png"
    );
    this.score = 0;

    this.initControls();
  }

  initControls() {
    // Keyboard controls
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "a") {
        this.paddle.direction = -1;
      } else if (event.key === "ArrowRight" || event.key === "d") {
        this.paddle.direction = 1;
      }
    });

    document.addEventListener("keyup", (event) => {
      if (
        event.key === "ArrowLeft" ||
        event.key === "a" ||
        event.key === "ArrowRight" ||
        event.key === "d"
      ) {
        this.paddle.direction = 0;
      }
    });

    // Mobile controls
    this.leftBtn.addEventListener(
      "mousedown",
      () => (this.paddle.direction = -1)
    );
    this.rightBtn.addEventListener(
      "mousedown",
      () => (this.paddle.direction = 1)
    );
    this.leftBtn.addEventListener("mouseup", () => (this.paddle.direction = 0));
    this.rightBtn.addEventListener(
      "mouseup",
      () => (this.paddle.direction = 0)
    );

    this.leftBtn.addEventListener(
      "touchstart",
      () => (this.paddle.direction = -1)
    );
    this.rightBtn.addEventListener(
      "touchstart",
      () => (this.paddle.direction = 1)
    );
    this.leftBtn.addEventListener(
      "touchend",
      () => (this.paddle.direction = 0)
    );
    this.rightBtn.addEventListener(
      "touchend",
      () => (this.paddle.direction = 0)
    );
  }

  drawBackground() {
    this.ctx.drawImage(
      this.backgroundImage,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  drawScore() {
    this.scoreBoard.textContent = `Score: ${this.score}`;
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground();
    this.ball.draw(this.ctx);
    this.paddle.draw(this.ctx);
    this.drawScore();

    this.paddle.move(this.canvas.width);
    this.ball.move();
    this.ball.bounce(this.canvas.width, this.canvas.height);

    // Paddle collision
    if (
      this.ball.y + this.ball.dy > this.paddle.y - this.ball.radius &&
      this.ball.x > this.paddle.x &&
      this.ball.x < this.paddle.x + this.paddle.width
    ) {
      this.ball.dy = -this.ball.dy;
      this.score++;
    }

    // Game over
    if (this.ball.y + this.ball.dy > this.canvas.height - this.ball.radius) {
      alert("Game Over!");
      this.submitScore();
      this.resetGame();
    }
  }

  async submitScore() {
    const response = await fetch(`/submit_score/${this.score}`, {
      method: "POST",
    });
    const data = await response.json();
    this.highScoreBoard.textContent = `High Score: ${data.high_score}`;
  }

  resetGame() {
    this.ball.reset(200, 300);
    this.paddle.reset(300, 500);
    this.score = 0;
  }

  start() {
    const gameLoop = () => {
      this.update();
      requestAnimationFrame(gameLoop);
    };
    gameLoop();
  }
}

// Initialize game
const game = new Game(
  document.getElementById("gameCanvas"),
  document.getElementById("scoreBoard"),
  document.getElementById("highScoreBoard"),
  document.getElementById("leftBtn"),
  document.getElementById("rightBtn")
);

game.start();
