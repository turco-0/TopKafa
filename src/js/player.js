/**
 * TopKafa - Player Class
 * Oyuncu karakteri yönetimi ve animasyonları
 */

class Player {
    constructor(x, y, isPlayer1 = true) {
        // Pozisyon ve boyut
        this.x = x;
        this.y = y;
        this.width = GAME_CONFIG.PLAYER_WIDTH;
        this.height = GAME_CONFIG.PLAYER_HEIGHT;
        
        // Fizik özellikleri
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.speed = GAME_CONFIG.MOVE_SPEED;
        this.jumpForce = GAME_CONFIG.JUMP_FORCE;
        
        // Oyuncu bilgileri
        this.isPlayer1 = isPlayer1;
        this.color = isPlayer1 ? '#FF6347' : '#4169E1'; // Tomato vs Royal Blue
        this.headColor = isPlayer1 ? '#FFB347' : '#87CEEB'; // Light versions
        this.direction = 1; // 1 = sağa bakıyor, -1 = sola bakıyor
        
        // Animasyon durumu
        this.animationState = 'idle'; // idle, running, jumping, heading
        this.animationTime = 0;
        this.lastGroundY = y;
        
        // Input durumu
        this.input = {
            left: false,
            right: false,
            jump: false
        };
        
        // Kontrol tuşları
        this.controls = isPlayer1 ? {
            left: ['a', 'A'],
            right: ['d', 'D'],
            jump: ['w', 'W', ' '] // Space bar da ekledik
        } : {
            left: ['ArrowLeft'],
            right: ['ArrowRight'],
            jump: ['ArrowUp']
        };
    }

    update(deltaTime) {
        this.handleInput();
        this.updatePhysics(deltaTime);
        this.updateAnimation(deltaTime);
        this.checkBounds();
    }

    handleInput() {
        // Hareket hesaplama
        this.velocityX = 0;
        
        if (this.input.left) {
            this.velocityX = -this.speed;
            this.direction = -1;
            this.setAnimationState('running');
        } else if (this.input.right) {
            this.velocityX = this.speed;
            this.direction = 1;
            this.setAnimationState('running');
        } else if (this.onGround) {
            this.setAnimationState('idle');
        }

        // Zıplama
        if (this.input.jump && this.onGround) {
            this.velocityY = this.jumpForce;
            this.onGround = false;
            this.setAnimationState('jumping');
        }
    }

    updatePhysics(deltaTime) {
        // Yer çekimi uygula
        if (!this.onGround) {
            this.velocityY += GAME_CONFIG.GRAVITY * deltaTime;
        }

        // Pozisyon güncelle
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;

        // Zemin kontrolü
        const groundY = GAME_CONFIG.GROUND_Y - this.height;
        if (this.y >= groundY) {
            this.y = groundY;
            this.velocityY = 0;
            this.onGround = true;
            this.lastGroundY = this.y;
        }
    }

    updateAnimation(deltaTime) {
        this.animationTime += deltaTime;
    }

    setAnimationState(newState) {
        if (this.animationState !== newState) {
            this.animationState = newState;
            this.animationTime = 0;
        }
    }

    checkBounds() {
        // Saha sınırları içinde tut
        const leftBound = 60;
        const rightBound = GAME_CONFIG.CANVAS_WIDTH - 60 - this.width;
        
        if (this.x < leftBound) {
            this.x = leftBound;
        } else if (this.x > rightBound) {
            this.x = rightBound;
        }
    }

    render(ctx) {
        ctx.save();
        
        // Oyuncuyu çiz
        this.drawBody(ctx);
        this.drawHead(ctx);
        this.drawFace(ctx);
        
        ctx.restore();
    }

    drawBody(ctx) {
        // Gövde animasyonu
        let bodyOffsetY = 0;
        let bodyWidth = this.width;
        let bodyHeight = this.height * 0.7;

        // Animasyon efektleri
        if (this.animationState === 'running') {
            bodyOffsetY = Math.sin(this.animationTime * 8) * 2;
        } else if (this.animationState === 'jumping') {
            bodyOffsetY = -3;
            bodyWidth *= 0.9; // Zıplarken biraz incelt
        }

        // Gövde gölgesi
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(this.x + 3, this.y + bodyHeight + 3, bodyWidth, 10);

        // Ana gövde
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x + (this.width - bodyWidth) / 2, 
            this.y + bodyOffsetY + this.height * 0.25, 
            bodyWidth, 
            bodyHeight
        );

        // Gövde detayları (forma çizgileri)
        ctx.strokeStyle = this.isPlayer1 ? '#DC143C' : '#191970';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            this.x + (this.width - bodyWidth) / 2, 
            this.y + bodyOffsetY + this.height * 0.25, 
            bodyWidth, 
            bodyHeight
        );

        // Kollar
        this.drawArms(ctx, bodyOffsetY);
        
        // Bacaklar
        this.drawLegs(ctx, bodyOffsetY);
    }

    drawArms(ctx, bodyOffsetY) {
        const armY = this.y + bodyOffsetY + this.height * 0.4;
        let armSwing = 0;

        if (this.animationState === 'running') {
            armSwing = Math.sin(this.animationTime * 8) * 15;
        }

        ctx.fillStyle = this.headColor;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;

        // Sol kol
        ctx.beginPath();
        ctx.moveTo(this.x + 5, armY);
        ctx.lineTo(this.x - 8, armY + 15 + armSwing * this.direction);
        ctx.stroke();

        // Sağ kol  
        ctx.beginPath();
        ctx.moveTo(this.x + this.width - 5, armY);
        ctx.lineTo(this.x + this.width + 8, armY + 15 - armSwing * this.direction);
        ctx.stroke();
    }

    drawLegs(ctx, bodyOffsetY) {
        const legY = this.y + bodyOffsetY + this.height * 0.85;
        let legSwing = 0;

        if (this.animationState === 'running') {
            legSwing = Math.sin(this.animationTime * 8) * 10;
        }

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4;

        // Sol bacak
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.3, legY);
        ctx.lineTo(this.x + this.width * 0.3 - 5, legY + 20 + legSwing);
        ctx.stroke();

        // Sağ bacak
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.7, legY);
        ctx.lineTo(this.x + this.width * 0.7 + 5, legY + 20 - legSwing);
        ctx.stroke();

        // Ayaklar
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x + this.width * 0.3 - 8, legY + 18 + legSwing, 12, 6);
        ctx.fillRect(this.x + this.width * 0.7 - 2, legY + 18 - legSwing, 12, 6);
    }

    drawHead(ctx) {
        const headRadius = this.width * 0.35;
        const headX = this.x + this.width / 2;
        let headY = this.y + headRadius + 5;

        // Animasyon efektleri
        if (this.animationState === 'running') {
            headY += Math.sin(this.animationTime * 8) * 1;
        } else if (this.animationState === 'jumping') {
            headY -= 2;
        }

        // Kafa gölgesi
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.arc(headX + 2, headY + 2, headRadius, 0, Math.PI * 2);
        ctx.fill();

        // Ana kafa
        ctx.fillStyle = this.headColor;
        ctx.beginPath();
        ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
        ctx.fill();

        // Kafa kenarı
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Saç
        ctx.fillStyle = this.isPlayer1 ? '#8B4513' : '#000000';
        ctx.beginPath();
        ctx.arc(headX, headY - headRadius * 0.3, headRadius * 0.8, Math.PI, 0);
        ctx.fill();
    }

    drawFace(ctx) {
        const headX = this.x + this.width / 2;
        let headY = this.y + this.width * 0.35 + 5;

        if (this.animationState === 'running') {
            headY += Math.sin(this.animationTime * 8) * 1;
        } else if (this.animationState === 'jumping') {
            headY -= 2;
        }

        // Gözler
        ctx.fillStyle = '#000000';
        const eyeSize = 3;
        ctx.fillRect(headX - 8, headY - 5, eyeSize, eyeSize);
        ctx.fillRect(headX + 5, headY - 5, eyeSize, eyeSize);

        // Ağız (oyun durumuna göre değişebilir)
        if (this.animationState === 'jumping') {
            // Heyecanlı ağız
            ctx.beginPath();
            ctx.arc(headX, headY + 5, 4, 0, Math.PI);
            ctx.stroke();
        } else {
            // Normal ağız
            ctx.fillRect(headX - 3, headY + 8, 6, 2);
        }
    }

    // Input handling methods
    handleKeyDown(key) {
        if (this.controls.left.includes(key)) {
            this.input.left = true;
        } else if (this.controls.right.includes(key)) {
            this.input.right = true;
        } else if (this.controls.jump.includes(key)) {
            this.input.jump = true;
        }
    }

    handleKeyUp(key) {
        if (this.controls.left.includes(key)) {
            this.input.left = false;
        } else if (this.controls.right.includes(key)) {
            this.input.right = false;
        } else if (this.controls.jump.includes(key)) {
            this.input.jump = false;
        }
    }

    // Collision detection
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    // Kafa vuruşu için özel collision box
    getHeadBounds() {
        const headRadius = this.width * 0.35;
        return {
            x: this.x + this.width / 2 - headRadius,
            y: this.y,
            width: headRadius * 2,
            height: headRadius * 2
        };
    }

    // Reset position (for goal scored, etc.)
    resetPosition(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.setAnimationState('idle');
    }
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.Player = Player;
} 