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

        // Basic movement for testing
        switch (event.key) {
            case 'a':
            case 'A':
                console.log('Player 1 left');
                break;
            case 'd':
            case 'D':
                console.log('Player 1 right');
                break;
            case 'w':
            case 'W':
                console.log('Player 1 jump');
                break;
            case 'ArrowLeft':
                console.log('Player 2 left');
                break;
            case 'ArrowRight':
                console.log('Player 2 right');
                break;
            case 'ArrowUp':
                console.log('Player 2 jump');
                break;
        }
    }

    handleKeyUp(event) {
        // Handle key release
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

            // Update game objects (players, ball, etc.)
            // Will be implemented when we have player and ball classes
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
        // Draw a simple demo/preview
        this.drawField();
        
        // Draw placeholder players
        this.ctx.fillStyle = '#FF6347';
        this.ctx.fillRect(100, 500, 40, 80); // Player 1
        
        this.ctx.fillStyle = '#4169E1';
        this.ctx.fillRect(1060, 500, 40, 80); // Player 2
        
        // Draw ball
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(600, 540, 20, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawField() {
        // Field background
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Field lines
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 4;
        
        // Border
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
        
        // Ground line
        this.ctx.strokeStyle = '#32CD32';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(50, this.canvas.height - 100);
        this.ctx.lineTo(this.canvas.width - 50, this.canvas.height - 100);
        this.ctx.stroke();
    }

    drawGoals() {
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 6;
        
        // Left goal
        this.ctx.strokeRect(0, this.canvas.height / 2 - 80, 50, 160);
        
        // Right goal
        this.ctx.strokeRect(this.canvas.width - 50, this.canvas.height / 2 - 80, 50, 160);
    }

    drawPlayers() {
        // Placeholder - will be replaced with actual player rendering
        this.ctx.fillStyle = '#FF6347';
        this.ctx.fillRect(200, 450, 40, 80);
        
        this.ctx.fillStyle = '#4169E1';
        this.ctx.fillRect(960, 450, 40, 80);
    }

    drawBall() {
        // Placeholder ball
        this.ctx.fillStyle = '#FFD700';
        this.ctx.strokeStyle = '#FFA500';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, 520, 15, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
    }

    // Game flow methods
    start(mode = 'single') {
        this.gameMode = mode;
        this.gameState = 'playing';
        this.score = { player1: 0, player2: 0 };
        this.timeRemaining = this.gameTime;
        
        console.log(`Game started in ${mode} mode`);
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