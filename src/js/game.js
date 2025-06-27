/**
 * TopKafa - Game Utilities
 * Oyun yardımcı fonksiyonları ve sabitler
 */

// Game Constants
const GAME_CONFIG = {
    CANVAS_WIDTH: 1200,
    CANVAS_HEIGHT: 600,
    GROUND_Y: 500,
    GOAL_WIDTH: 50,
    GOAL_HEIGHT: 160,
    BALL_RADIUS: 15,
    PLAYER_WIDTH: 40,
    PLAYER_HEIGHT: 80,
    GRAVITY: 800,
    JUMP_FORCE: -400,
    MOVE_SPEED: 300
};

// Utility Functions
class GameUtils {
    // Check collision between two rectangles
    static rectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    // Check collision between circle and rectangle
    static circleRectCollision(circle, rect) {
        const distX = Math.abs(circle.x - rect.x - rect.width / 2);
        const distY = Math.abs(circle.y - rect.y - rect.height / 2);

        if (distX > (rect.width / 2 + circle.radius)) return false;
        if (distY > (rect.height / 2 + circle.radius)) return false;

        if (distX <= (rect.width / 2)) return true;
        if (distY <= (rect.height / 2)) return true;

        const dx = distX - rect.width / 2;
        const dy = distY - rect.height / 2;
        return (dx * dx + dy * dy <= (circle.radius * circle.radius));
    }

    // Distance between two points
    static distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    // Clamp value between min and max
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // Linear interpolation
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Random number between min and max
    static random(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Random integer between min and max (inclusive)
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// Simple Vector2 class
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    normalize() {
        const length = this.length();
        if (length > 0) {
            this.x /= length;
            this.y /= length;
        }
        return this;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    copy() {
        return new Vector2(this.x, this.y);
    }

    static distance(v1, v2) {
        return Math.sqrt((v2.x - v1.x) ** 2 + (v2.y - v1.y) ** 2);
    }
}

// Game State Manager
class GameState {
    constructor() {
        this.state = 'menu';
        this.previousState = null;
        this.transitions = {};
    }

    setState(newState) {
        this.previousState = this.state;
        this.state = newState;
        
        // Call transition callback if exists
        if (this.transitions[newState]) {
            this.transitions[newState]();
        }
    }

    onStateChange(state, callback) {
        this.transitions[state] = callback;
    }

    isState(state) {
        return this.state === state;
    }

    getPreviousState() {
        return this.previousState;
    }
}

// Simple Animation class
class Animation {
    constructor(frames, duration) {
        this.frames = frames;
        this.duration = duration;
        this.currentFrame = 0;
        this.currentTime = 0;
        this.frameTime = duration / frames.length;
        this.loop = true;
        this.playing = false;
    }

    play() {
        this.playing = true;
        this.currentTime = 0;
        this.currentFrame = 0;
    }

    stop() {
        this.playing = false;
    }

    update(deltaTime) {
        if (!this.playing) return;

        this.currentTime += deltaTime;
        
        if (this.currentTime >= this.frameTime) {
            this.currentFrame++;
            this.currentTime = 0;
            
            if (this.currentFrame >= this.frames.length) {
                if (this.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = this.frames.length - 1;
                    this.playing = false;
                }
            }
        }
    }

    getCurrentFrame() {
        return this.frames[this.currentFrame];
    }
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.GAME_CONFIG = GAME_CONFIG;
    window.GameUtils = GameUtils;
    window.Vector2 = Vector2;
    window.GameState = GameState;
    window.Animation = Animation;
} 