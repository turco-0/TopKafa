/**
 * TopKafa - Main Game File
 * Ana oyun motoru ve Canvas yönetimi
 */

class TopKafaGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameState = 'loading'; // loading, menu, playing, paused, gameover
        this.gameMode = 'single'; // single, two
        
        // Game settings
        this.settings = {
            canvasWidth: 1200,
            canvasHeight: 600,
            targetFPS: 60
        };

        // Game objects
        this.player1 = null;
        this.player2 = null;
        this.ball = null;

        // Game state
        this.score = { player1: 0, player2: 0 };
        this.gameTime = 90; // seconds
        this.timeRemaining = this.gameTime;

        this.init();
    }

    init() {
        this.setupCanvas();
        this.bindEvents();
        this.startGameLoop();
    }

    setupCanvas() {
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) {
            console.error('Canvas element not found!');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = this.settings.canvasWidth;
        this.canvas.height = this.settings.canvasHeight;

        // Make canvas responsive
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // Calculate scale to fit canvas in container
        const scaleX = containerWidth / this.settings.canvasWidth;
        const scaleY = containerHeight / this.settings.canvasHeight;
        const scale = Math.min(scaleX, scaleY);
        
        // Apply scale
        this.canvas.style.width = (this.settings.canvasWidth * scale) + 'px';
        this.canvas.style.height = (this.settings.canvasHeight * scale) + 'px';
        
        // Center canvas
        this.canvas.style.margin = '0 auto';
        this.canvas.style.display = 'block';
    }

    bindEvents() {
        // Keyboard input will be handled by separate input manager
        // For now, just basic setup
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(event) {
        if (this.gameState !== 'playing') return;

        // Forward input to players
        if (this.player1) {
            this.player1.handleKeyDown(event.key);
        }
        if (this.player2) {
            this.player2.handleKeyDown(event.key);
        }
    }

    handleKeyUp(event) {
        if (this.gameState !== 'playing') return;

        // Forward input to players
        if (this.player1) {
            this.player1.handleKeyUp(event.key);
        }
        if (this.player2) {
            this.player2.handleKeyUp(event.key);
        }
    }

    startGameLoop() {
        let lastTime = 0;
        const targetFrameTime = 1000 / this.settings.targetFPS;

        const gameLoop = (currentTime) => {
            const deltaTime = currentTime - lastTime;
            
            if (deltaTime >= targetFrameTime) {
                this.update(deltaTime / 1000); // Convert to seconds
                this.render();
                lastTime = currentTime;
            }
            
            requestAnimationFrame(gameLoop);
        };

        requestAnimationFrame(gameLoop);
    }

    update(deltaTime) {
        if (this.gameState === 'playing') {
            // Update game timer
            this.timeRemaining -= deltaTime;
            if (this.timeRemaining <= 0) {
                this.timeRemaining = 0;
                this.endGame();
            }

            // Update UI
            if (window.uiManager) {
                window.uiManager.updateTimer(this.timeRemaining);
            }

            // Update game objects
            if (this.player1) {
                this.player1.update(deltaTime);
            }
            if (this.player2) {
                this.player2.update(deltaTime);
            }
            
            // Update ball
            if (this.ball) {
                this.ball.update(deltaTime);
                
                // Check collisions
                this.checkCollisions();
                
                // Check goals
                const goalResult = this.ball.checkGoal();
                if (goalResult) {
                    this.handleGoal(goalResult);
                }
            }
        }
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.gameState === 'playing') {
            this.renderGame();
        } else {
            this.renderDemo();
        }
    }

    renderGame() {
        // Draw soccer field
        this.drawField();
        
        // Draw game objects
        this.drawPlayers();
        this.drawBall();
        
        // Draw goals
        this.drawGoals();
    }

    renderDemo() {
        // Draw the beautiful field for menu preview
        this.drawField();
        
        // Create temporary demo players if not exist
        if (!this.demoPlayer1) {
            this.demoPlayer1 = new Player(150, GAME_CONFIG.GROUND_Y - GAME_CONFIG.PLAYER_HEIGHT, true);
            this.demoPlayer2 = new Player(this.settings.canvasWidth - 190, GAME_CONFIG.GROUND_Y - GAME_CONFIG.PLAYER_HEIGHT, false);
            
            // Set demo animations
            this.demoPlayer1.setAnimationState('idle');
            this.demoPlayer2.setAnimationState('idle');
        }
        
        // Update demo animations
        this.demoPlayer1.animationTime += 0.016; // ~60 FPS
        this.demoPlayer2.animationTime += 0.016;
        
        // Occasionally change demo animations
        if (Math.random() < 0.01) {
            const states = ['idle', 'running', 'jumping'];
            this.demoPlayer1.setAnimationState(states[Math.floor(Math.random() * states.length)]);
            this.demoPlayer2.setAnimationState(states[Math.floor(Math.random() * states.length)]);
        }
        
        // Draw demo players
        this.demoPlayer1.render(this.ctx);
        this.demoPlayer2.render(this.ctx);
        
        // Draw animated ball
        const ballX = this.canvas.width / 2 + Math.sin(Date.now() * 0.001) * 50;
        const ballY = GAME_CONFIG.GROUND_Y - 15 + Math.abs(Math.sin(Date.now() * 0.003)) * 30;
        
        // Ball shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(ballX + 5, GAME_CONFIG.GROUND_Y + 5, 15, 8, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Ball
        this.ctx.fillStyle = '#FFD700';
        this.ctx.strokeStyle = '#FFA500';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(ballX, ballY, 15, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Ball pattern
        this.ctx.strokeStyle = '#FF8C00';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawField() {
        // Sky gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB'); // Sky blue
        gradient.addColorStop(0.6, '#98FB98'); // Pale green
        gradient.addColorStop(1, '#228B22'); // Forest green
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Field grass texture
        this.drawGrassTexture();
        
        // Stadium atmosphere
        this.drawStadiumBackground();
        
        // Field markings
        this.drawFieldMarkings();
        
        // Goals
        this.drawGoals();
        
        // Corner flags
        this.drawCornerFlags();
    }

    drawGrassTexture() {
        // Create grass pattern with alternating stripes
        const stripeWidth = 40;
        for (let x = 50; x < this.canvas.width - 50; x += stripeWidth) {
            const isEven = Math.floor((x - 50) / stripeWidth) % 2 === 0;
            this.ctx.fillStyle = isEven ? '#32CD32' : '#228B22';
            this.ctx.fillRect(x, 50, stripeWidth, this.canvas.height - 100);
        }
        
        // Add some grass texture noise
        this.ctx.fillStyle = 'rgba(34, 139, 34, 0.1)';
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * (this.canvas.width - 100) + 50;
            const y = Math.random() * (this.canvas.height - 100) + 50;
            this.ctx.fillRect(x, y, 2, 1);
        }
    }

    drawStadiumBackground() {
        // Stadium walls/stands
        this.ctx.fillStyle = '#696969'; // Dark gray
        this.ctx.fillRect(0, 0, this.canvas.width, 50); // Top wall
        this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, 50); // Bottom wall
        this.ctx.fillRect(0, 0, 50, this.canvas.height); // Left wall
        this.ctx.fillRect(this.canvas.width - 50, 0, 50, this.canvas.height); // Right wall
        
        // Stadium crowd suggestion (small rectangles)
        this.ctx.fillStyle = '#4169E1';
        for (let x = 60; x < this.canvas.width - 60; x += 20) {
            this.ctx.fillRect(x, 10, 8, 15);
            this.ctx.fillRect(x, this.canvas.height - 25, 8, 15);
        }
        
        // Floodlights
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(100, 5, 20, 10);
        this.ctx.fillRect(300, 5, 20, 10);
        this.ctx.fillRect(500, 5, 20, 10);
        this.ctx.fillRect(700, 5, 20, 10);
        this.ctx.fillRect(900, 5, 20, 10);
        this.ctx.fillRect(1100, 5, 20, 10);
    }

    drawFieldMarkings() {
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 4;
        
        // Main field border
        this.ctx.strokeRect(50, 50, this.canvas.width - 100, this.canvas.height - 100);
        
        // Center line
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 50);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height - 50);
        this.ctx.stroke();
        
        // Center circle
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 80, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Center spot
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Penalty areas
        const penaltyWidth = 120;
        const penaltyHeight = 200;
        const goalLineY1 = this.canvas.height / 2 - penaltyHeight / 2;
        const goalLineY2 = this.canvas.height / 2 + penaltyHeight / 2;
        
        // Left penalty area
        this.ctx.strokeRect(50, goalLineY1, penaltyWidth, penaltyHeight);
        // Left penalty spot
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(50 + penaltyWidth * 0.6, this.canvas.height / 2, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Right penalty area
        this.ctx.strokeRect(this.canvas.width - 50 - penaltyWidth, goalLineY1, penaltyWidth, penaltyHeight);
        // Right penalty spot
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width - 50 - penaltyWidth * 0.6, this.canvas.height / 2, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Goal areas (smaller boxes)
        const goalAreaWidth = 60;
        const goalAreaHeight = 120;
        const goalAreaY1 = this.canvas.height / 2 - goalAreaHeight / 2;
        
        this.ctx.strokeRect(50, goalAreaY1, goalAreaWidth, goalAreaHeight);
        this.ctx.strokeRect(this.canvas.width - 50 - goalAreaWidth, goalAreaY1, goalAreaWidth, goalAreaHeight);
    }

    drawCornerFlags() {
        this.ctx.strokeStyle = '#FFFF00';
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = '#FF0000';
        
        // Corner flag poles
        const flagHeight = 30;
        const corners = [
            [50, 50],
            [this.canvas.width - 50, 50],
            [50, this.canvas.height - 50],
            [this.canvas.width - 50, this.canvas.height - 50]
        ];
        
        corners.forEach(([x, y]) => {
            // Pole
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y - flagHeight);
            this.ctx.stroke();
            
            // Flag
            this.ctx.fillRect(x, y - flagHeight, 15, 10);
        });
        
        // Corner arcs
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        corners.forEach(([x, y]) => {
            this.ctx.beginPath();
            if (x === 50 && y === 50) {
                this.ctx.arc(x, y, 10, 0, Math.PI / 2);
            } else if (x === this.canvas.width - 50 && y === 50) {
                this.ctx.arc(x, y, 10, Math.PI / 2, Math.PI);
            } else if (x === 50 && y === this.canvas.height - 50) {
                this.ctx.arc(x, y, 10, -Math.PI / 2, 0);
            } else {
                this.ctx.arc(x, y, 10, Math.PI, 3 * Math.PI / 2);
            }
            this.ctx.stroke();
        });
    }

    drawGoals() {
        const goalWidth = 50;
        const goalHeight = 160;
        const goalY = this.canvas.height / 2 - goalHeight / 2;
        
        // Goal structure
        this.ctx.lineWidth = 6;
        this.ctx.strokeStyle = '#FFFFFF';
        
        // Left goal
        this.ctx.strokeRect(0, goalY, goalWidth, goalHeight);
        // Left goal net effect
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 1;
        for (let i = 10; i < goalHeight - 10; i += 15) {
            this.ctx.beginPath();
            this.ctx.moveTo(5, goalY + i);
            this.ctx.lineTo(goalWidth - 5, goalY + i);
            this.ctx.stroke();
        }
        for (let i = 10; i < goalWidth - 10; i += 15) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, goalY + 5);
            this.ctx.lineTo(i, goalY + goalHeight - 5);
            this.ctx.stroke();
        }
        
        // Right goal
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 6;
        this.ctx.strokeRect(this.canvas.width - goalWidth, goalY, goalWidth, goalHeight);
        // Right goal net effect
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 1;
        for (let i = 10; i < goalHeight - 10; i += 15) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.canvas.width - goalWidth + 5, goalY + i);
            this.ctx.lineTo(this.canvas.width - 5, goalY + i);
            this.ctx.stroke();
        }
        for (let i = 10; i < goalWidth - 10; i += 15) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.canvas.width - goalWidth + i, goalY + 5);
            this.ctx.lineTo(this.canvas.width - goalWidth + i, goalY + goalHeight - 5);
            this.ctx.stroke();
        }
        
        // Goal posts (3D effect)
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.fillRect(-5, goalY - 5, 10, 10); // Left top post
        this.ctx.fillRect(-5, goalY + goalHeight - 5, 10, 10); // Left bottom post
        this.ctx.fillRect(this.canvas.width - 5, goalY - 5, 10, 10); // Right top post
        this.ctx.fillRect(this.canvas.width - 5, goalY + goalHeight - 5, 10, 10); // Right bottom post
    }

    drawPlayers() {
        // Render actual players
        if (this.player1) {
            this.player1.render(this.ctx);
        }
        if (this.player2) {
            this.player2.render(this.ctx);
        }
    }

    drawBall() {
        // Render actual ball
        if (this.ball) {
            this.ball.render(this.ctx);
        }
    }

    checkCollisions() {
        if (!this.ball || !this.player1 || !this.player2) return;

        // Player 1 collisions
        const p1HeadCollision = this.ball.checkPlayerCollision(this.player1);
        if (p1HeadCollision) {
            console.log(`Player 1 ${p1HeadCollision} hit!`);
        }
        
        // Player 1 kick collision
        if (this.player1.checkBallKick(this.ball)) {
            console.log('Player 1 kicked the ball!');
        }

        // Player 2 collisions
        const p2HeadCollision = this.ball.checkPlayerCollision(this.player2);
        if (p2HeadCollision) {
            console.log(`Player 2 ${p2HeadCollision} hit!`);
        }
        
        // Player 2 kick collision
        if (this.player2.checkBallKick(this.ball)) {
            console.log('Player 2 kicked the ball!');
        }
    }

    handleGoal(side) {
        console.log(`Goal scored on ${side} side!`);
        
        if (side === 'left') {
            // Player 2 scored
            this.score.player2++;
            if (window.uiManager) {
                window.uiManager.updateScore(this.score.player1, this.score.player2);
            }
        } else if (side === 'right') {
            // Player 1 scored
            this.score.player1++;
            if (window.uiManager) {
                window.uiManager.updateScore(this.score.player1, this.score.player2);
            }
        }

        // Check win condition
        if (this.score.player1 >= 3 || this.score.player2 >= 3) {
            this.endGame();
        } else {
            // Reset ball position
            this.resetBallPosition();
        }
    }

    resetBallPosition() {
        if (this.ball) {
            this.ball.resetPosition(
                this.settings.canvasWidth / 2,
                GAME_CONFIG.GROUND_Y - GAME_CONFIG.BALL_RADIUS * 3
            );
        }
        
        // Reset player positions
        if (this.player1) {
            this.player1.resetPosition(150, GAME_CONFIG.GROUND_Y - GAME_CONFIG.PLAYER_HEIGHT);
        }
        if (this.player2) {
            this.player2.resetPosition(
                this.settings.canvasWidth - 190, 
                GAME_CONFIG.GROUND_Y - GAME_CONFIG.PLAYER_HEIGHT
            );
        }
    }

    // Game flow methods
    start(mode = 'single') {
        this.gameMode = mode;
        this.gameState = 'playing';
        this.score = { player1: 0, player2: 0 };
        this.timeRemaining = this.gameTime;
        
        // Create players
        this.initializePlayers();
        
        console.log(`Game started in ${mode} mode`);
    }

    initializePlayers() {
        // Player starting positions
        const player1X = 150;
        const player2X = this.settings.canvasWidth - 190;
        const playerY = GAME_CONFIG.GROUND_Y - GAME_CONFIG.PLAYER_HEIGHT;

        // Create players
        this.player1 = new Player(player1X, playerY, true);
        this.player2 = new Player(player2X, playerY, false);
        
        // Create ball in center
        this.ball = new Ball(
            this.settings.canvasWidth / 2,
            GAME_CONFIG.GROUND_Y - GAME_CONFIG.BALL_RADIUS * 3
        );
    }

    pause() {
        this.gameState = 'paused';
        console.log('Game paused');
    }

    resume() {
        this.gameState = 'playing';
        console.log('Game resumed');
    }

    restart() {
        this.start(this.gameMode);
        console.log('Game restarted');
    }

    stop() {
        this.gameState = 'menu';
        console.log('Game stopped');
    }

    endGame() {
        this.gameState = 'gameover';
        
        // Determine winner
        let winner;
        if (this.score.player1 > this.score.player2) {
            winner = this.gameMode === 'single' ? 'Sen' : 'Oyuncu 1';
        } else if (this.score.player2 > this.score.player1) {
            winner = this.gameMode === 'single' ? 'Bilgisayar' : 'Oyuncu 2';
        } else {
            winner = 'Berabere';
        }
        
        // Show game over screen
        if (window.uiManager) {
            setTimeout(() => {
                window.uiManager.showGameResult(winner, this.score.player1, this.score.player2);
            }, 1000);
        }
        
        console.log(`Game ended. Winner: ${winner}`);
    }

    // Utility methods
    handleResize() {
        this.resizeCanvas();
    }

    setAIDifficulty(difficulty) {
        console.log(`AI difficulty set to: ${difficulty}`);
    }

    setMatchDuration(duration) {
        this.gameTime = duration;
        console.log(`Match duration set to: ${duration} seconds`);
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new TopKafaGame();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TopKafaGame;
} 