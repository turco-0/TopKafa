/**
 * TopKafa - UI Manager
 */

class UIManager {
    constructor() {
        this.currentScreen = 'loading-screen';
        this.init();
    }

    init() {
        this.bindEvents();
        this.showLoadingScreen();
    }

    bindEvents() {
        // Menu buttons
        const btnSingle = document.getElementById('btn-single-player');
        const btnTwo = document.getElementById('btn-two-player');
        const btnSettings = document.getElementById('btn-settings');
        const btnAbout = document.getElementById('btn-about');

        // Game buttons
        const btnPause = document.getElementById('pause-btn');
        const btnResume = document.getElementById('btn-resume');
        const btnRestart = document.getElementById('btn-restart');
        const btnMainMenu = document.getElementById('btn-main-menu');
        const btnPlayAgain = document.getElementById('btn-play-again');
        const btnBackToMenu = document.getElementById('btn-back-to-menu');

        // Add event listeners
        if (btnSingle) btnSingle.addEventListener('click', () => this.startGame('single'));
        if (btnTwo) btnTwo.addEventListener('click', () => this.startGame('two'));
        if (btnSettings) btnSettings.addEventListener('click', () => this.showSettings());
        if (btnAbout) btnAbout.addEventListener('click', () => this.showAbout());

        if (btnPause) btnPause.addEventListener('click', () => this.pauseGame());
        if (btnResume) btnResume.addEventListener('click', () => this.resumeGame());
        if (btnRestart) btnRestart.addEventListener('click', () => this.restartGame());
        if (btnMainMenu) btnMainMenu.addEventListener('click', () => this.backToMainMenu());
        if (btnPlayAgain) btnPlayAgain.addEventListener('click', () => this.playAgain());
        if (btnBackToMenu) btnBackToMenu.addEventListener('click', () => this.backToMainMenu());

        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    showScreen(screenName) {
        // Hide all screens
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));

        // Show target screen
        const targetScreen = document.getElementById(screenName);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
        }
    }

    showLoadingScreen() {
        this.showScreen('loading-screen');
        setTimeout(() => this.showMainMenu(), 2000);
    }

    showMainMenu() {
        this.showScreen('main-menu');
    }

    showGameScreen() {
        this.showScreen('game-screen');
    }

    showPauseMenu() {
        this.showScreen('pause-menu');
    }

    showGameOver() {
        this.showScreen('game-over');
    }

    startGame(mode) {
        this.gameMode = mode;
        this.updatePlayerNames(mode);
        this.updateScore(0, 0);
        this.showGameScreen();
        this.showControlsHint();
    }

    pauseGame() {
        this.showPauseMenu();
    }

    resumeGame() {
        this.showGameScreen();
    }

    restartGame() {
        this.startGame(this.gameMode);
    }

    playAgain() {
        this.startGame(this.gameMode);
    }

    backToMainMenu() {
        this.showMainMenu();
    }

    updateScore(player1Score, player2Score) {
        const p1Score = document.getElementById('player1-score');
        const p2Score = document.getElementById('player2-score');
        if (p1Score) p1Score.textContent = player1Score;
        if (p2Score) p2Score.textContent = player2Score;
    }

    updateTimer(timeLeft) {
        const timer = document.getElementById('game-timer');
        if (timer) timer.textContent = Math.ceil(timeLeft);
    }

    updatePlayerNames(mode) {
        const p1Name = document.getElementById('player1-name');
        const p2Name = document.getElementById('player2-name');
        
        if (mode === 'single') {
            if (p1Name) p1Name.textContent = 'Sen';
            if (p2Name) p2Name.textContent = 'Bilgisayar';
        } else {
            if (p1Name) p1Name.textContent = 'Oyuncu 1';
            if (p2Name) p2Name.textContent = 'Oyuncu 2';
        }
    }

    showGameResult(winner, player1Score, player2Score) {
        const winnerText = document.getElementById('winner-text');
        const finalScore = document.getElementById('final-score-text');
        
        if (winnerText) winnerText.textContent = `${winner} Kazandı!`;
        if (finalScore) finalScore.textContent = `${player1Score} - ${player2Score}`;
        
        this.showGameOver();
    }

    showControlsHint() {
        const hint = document.getElementById('controls-hint');
        if (hint) {
            hint.style.display = 'block';
            setTimeout(() => {
                hint.style.display = 'none';
            }, 5000);
        }
    }

    handleKeyboard(event) {
        switch (event.key) {
            case 'Escape':
                if (this.currentScreen === 'game-screen') {
                    this.pauseGame();
                } else if (this.currentScreen === 'pause-menu') {
                    this.resumeGame();
                }
                break;
            case 'Enter':
                if (this.currentScreen === 'main-menu') {
                    this.startGame('single');
                }
                break;
        }
    }

    showSettings() {
        alert('Ayarlar sayfası henüz hazır değil!');
    }

    showAbout() {
        alert('TopKafa v1.0.0 - 2D Kafa Topu Oyunu');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.uiManager = new UIManager();
}); 