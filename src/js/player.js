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
        
        // Big Head özellikler (head soccer tarzı)
        this.headRadius = this.width * 0.8; // Çok büyük kafa!
        this.bodyHeight = this.height * 0.4; // Küçük vücut
        this.legLength = this.height * 0.3;
        
        // Fizik özellikleri
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.speed = GAME_CONFIG.MOVE_SPEED;
        this.jumpForce = GAME_CONFIG.JUMP_FORCE;
        
        // Oyuncu bilgileri (head soccer karakterleri)
        this.isPlayer1 = isPlayer1;
        this.color = isPlayer1 ? '#FF6347' : '#4169E1'; // Tomato vs Royal Blue
        this.headColor = isPlayer1 ? '#FFD700' : '#FF69B4'; // Gold vs Hot Pink
        this.shirtColor = isPlayer1 ? '#DC143C' : '#191970'; // Crimson vs Navy
        this.pantsColor = isPlayer1 ? '#FFFFFF' : '#000000'; // White vs Black
        this.shoeColor = isPlayer1 ? '#8B4513' : '#2F4F4F'; // Brown vs Dark Slate Gray
        this.direction = 1; // 1 = sağa bakıyor, -1 = sola bakıyor
        
        // Animasyon durumu
        this.animationState = 'idle'; // idle, running, jumping, kicking
        this.animationTime = 0;
        this.lastGroundY = y;
        
        // Kicking sistemi
        this.kickCooldown = 0;
        this.kickPower = 0;
        this.isKicking = false;
        this.kickAnimation = 0;
        
        // Input durumu
        this.input = {
            left: false,
            right: false,
            jump: false,
            kick: false
        };
        
        // Kontrol tuşları
        this.controls = isPlayer1 ? {
            left: ['a', 'A'],
            right: ['d', 'D'],
            jump: ['w', 'W'],
            kick: ['s', 'S', ' '] // Space bar için kick
        } : {
            left: ['ArrowLeft'],
            right: ['ArrowRight'],
            jump: ['ArrowUp'],
            kick: ['ArrowDown', 'Enter']
        };
        
        // Özel yetenekler (head soccer tarzı)
        this.specialAbility = isPlayer1 ? 'power_shot' : 'speed_boost';
        this.abilityReady = true;
        this.abilityCooldown = 0;
    }

    update(deltaTime) {
        this.handleInput();
        this.updatePhysics(deltaTime);
        this.updateAnimation(deltaTime);
        this.updateKicking(deltaTime);
        this.updateAbilities(deltaTime);
        this.checkBounds();
    }

    handleInput() {
        // Hareket hesaplama
        this.velocityX = 0;
        
        if (this.input.left) {
            this.velocityX = -this.speed;
            this.direction = -1;
            if (!this.isKicking) this.setAnimationState('running');
        } else if (this.input.right) {
            this.velocityX = this.speed;
            this.direction = 1;
            if (!this.isKicking) this.setAnimationState('running');
        } else if (this.onGround && !this.isKicking) {
            this.setAnimationState('idle');
        }

        // Zıplama
        if (this.input.jump && this.onGround && !this.isKicking) {
            this.velocityY = this.jumpForce;
            this.onGround = false;
            this.setAnimationState('jumping');
        }

        // Tekme atma
        if (this.input.kick && this.kickCooldown <= 0 && !this.isKicking) {
            this.startKick();
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

    updateKicking(deltaTime) {
        // Kick cooldown azaltma
        if (this.kickCooldown > 0) {
            this.kickCooldown -= deltaTime;
        }

        // Kick animasyonu
        if (this.isKicking) {
            this.kickAnimation += deltaTime;
            if (this.kickAnimation >= 0.3) { // 300ms kick animasyonu
                this.isKicking = false;
                this.kickAnimation = 0;
                this.kickCooldown = 0.5; // 500ms cooldown
                if (this.onGround) {
                    this.setAnimationState('idle');
                }
            }
        }
    }

    updateAbilities(deltaTime) {
        // Özel yetenek cooldown
        if (this.abilityCooldown > 0) {
            this.abilityCooldown -= deltaTime;
            if (this.abilityCooldown <= 0) {
                this.abilityReady = true;
            }
        }
    }

    startKick() {
        this.isKicking = true;
        this.kickAnimation = 0;
        this.setAnimationState('kicking');
        
        // Kick power hesaplama (direction'a göre)
        this.kickPower = 600; // Base kick power
        if (this.specialAbility === 'power_shot' && this.abilityReady) {
            this.kickPower *= 1.5; // Power shot
            this.abilityReady = false;
            this.abilityCooldown = 5.0; // 5 saniye cooldown
        }
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
        
        // Big Head Soccer karakteri çiz
        this.drawShadow(ctx);
        this.drawLegs(ctx);
        this.drawShoes(ctx);
        this.drawBody(ctx);
        this.drawArms(ctx);
        this.drawBigHead(ctx);
        this.drawFace(ctx);
        this.drawSpecialEffects(ctx);
        
        ctx.restore();
    }

    drawShadow(ctx) {
        // Karakter gölgesi
        const shadowWidth = this.width * 1.2;
        const shadowHeight = 8;
        const shadowY = GAME_CONFIG.GROUND_Y + 5;
        
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, shadowY, shadowWidth / 2, shadowHeight / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawBody(ctx) {
        // Küçük gövde (big head soccer tarzı)
        let bodyOffsetY = 0;
        let bodyWidth = this.width * 0.7; // Küçük gövde
        const bodyY = this.y + this.headRadius * 1.2; // Kafanın altında

        // Animasyon efektleri
        if (this.animationState === 'running') {
            bodyOffsetY = Math.sin(this.animationTime * 8) * 1;
        } else if (this.animationState === 'jumping') {
            bodyOffsetY = -2;
        }

        // Gömlek (forma)
        ctx.fillStyle = this.shirtColor;
        ctx.fillRect(
            this.x + (this.width - bodyWidth) / 2, 
            bodyY + bodyOffsetY, 
            bodyWidth, 
            this.bodyHeight
        );

        // Forma numarası
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            this.isPlayer1 ? '1' : '2',
            this.x + this.width / 2,
            bodyY + bodyOffsetY + this.bodyHeight / 2 + 4
        );

        // Gömlek kenarı
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            this.x + (this.width - bodyWidth) / 2, 
            bodyY + bodyOffsetY, 
            bodyWidth, 
            this.bodyHeight
        );
    }

    drawArms(ctx) {
        const bodyY = this.y + this.headRadius * 1.2;
        const armY = bodyY + 5;
        let armSwing = 0;
        let armWidth = 4;

        if (this.animationState === 'running') {
            armSwing = Math.sin(this.animationTime * 8) * 10;
        } else if (this.animationState === 'kicking') {
            armSwing = Math.sin(this.kickAnimation * 20) * 20;
            armWidth = 5;
        }

        ctx.strokeStyle = this.headColor;
        ctx.lineWidth = armWidth;
        ctx.lineCap = 'round';

        // Sol kol
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.2, armY);
        ctx.lineTo(this.x + this.width * 0.2 - 10, armY + 15 + armSwing);
        ctx.stroke();

        // Sağ kol (kicking sırasında farklı)
        if (this.animationState === 'kicking') {
            ctx.beginPath();
            ctx.moveTo(this.x + this.width * 0.8, armY);
            ctx.lineTo(this.x + this.width * 0.8 + 15, armY + 10 - armSwing);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(this.x + this.width * 0.8, armY);
            ctx.lineTo(this.x + this.width * 0.8 + 10, armY + 15 - armSwing);
            ctx.stroke();
        }

        // El detayları (küçük daireler)
        ctx.fillStyle = this.headColor;
        ctx.beginPath();
        ctx.arc(this.x + this.width * 0.2 - 10, armY + 15 + armSwing, 3, 0, Math.PI * 2);
        ctx.fill();
        
        if (this.animationState === 'kicking') {
            ctx.beginPath();
            ctx.arc(this.x + this.width * 0.8 + 15, armY + 10 - armSwing, 3, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(this.x + this.width * 0.8 + 10, armY + 15 - armSwing, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawLegs(ctx) {
        const bodyY = this.y + this.headRadius * 1.2;
        const legStartY = bodyY + this.bodyHeight;
        let legSwing = 0;
        let kickLegExtension = 0;

        if (this.animationState === 'running') {
            legSwing = Math.sin(this.animationTime * 8) * 8;
        } else if (this.animationState === 'kicking') {
            kickLegExtension = Math.sin(this.kickAnimation * 15) * 15;
        }

        // Pantolon
        ctx.fillStyle = this.pantsColor;
        ctx.fillRect(
            this.x + this.width * 0.25,
            legStartY,
            this.width * 0.5,
            this.legLength * 0.6
        );

        // Bacaklar
        ctx.strokeStyle = this.headColor;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';

        // Sol bacak
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.35, legStartY + this.legLength * 0.6);
        ctx.lineTo(this.x + this.width * 0.35 - 3, legStartY + this.legLength + legSwing);
        ctx.stroke();

        // Sağ bacak (kicking bacağı)
        if (this.animationState === 'kicking') {
            ctx.beginPath();
            ctx.moveTo(this.x + this.width * 0.65, legStartY + this.legLength * 0.6);
            ctx.lineTo(
                this.x + this.width * 0.65 + kickLegExtension * this.direction,
                legStartY + this.legLength - 5
            );
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(this.x + this.width * 0.65, legStartY + this.legLength * 0.6);
            ctx.lineTo(this.x + this.width * 0.65 + 3, legStartY + this.legLength - legSwing);
            ctx.stroke();
        }
    }

    drawShoes(ctx) {
        const bodyY = this.y + this.headRadius * 1.2;
        const legStartY = bodyY + this.bodyHeight;
        const shoeY = legStartY + this.legLength;
        let legSwing = 0;
        let kickLegExtension = 0;

        if (this.animationState === 'running') {
            legSwing = Math.sin(this.animationTime * 8) * 8;
        } else if (this.animationState === 'kicking') {
            kickLegExtension = Math.sin(this.kickAnimation * 15) * 15;
        }

        // Sol ayakkabı
        ctx.fillStyle = this.shoeColor;
        const leftShoeX = this.x + this.width * 0.35 - 8;
        const leftShoeY = shoeY + legSwing - 3;
        ctx.fillRect(leftShoeX, leftShoeY, 14, 8);
        
        // Sol ayakkabı detayları
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.strokeRect(leftShoeX, leftShoeY, 14, 8);

        // Sağ ayakkabı (kicking ayakkabısı)
        const rightShoeX = this.x + this.width * 0.65 - 6 + (this.animationState === 'kicking' ? kickLegExtension * this.direction : 0);
        const rightShoeY = shoeY - (this.animationState === 'kicking' ? 5 : legSwing) - 3;
        
        ctx.fillStyle = this.shoeColor;
        ctx.fillRect(rightShoeX, rightShoeY, 14, 8);
        
        // Sağ ayakkabı detayları
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.strokeRect(rightShoeX, rightShoeY, 14, 8);

        // Kicking efekti
        if (this.animationState === 'kicking' && this.kickAnimation > 0.1) {
            ctx.save();
            ctx.globalAlpha = 0.7;
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(rightShoeX + 7, rightShoeY + 4, 12, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    drawBigHead(ctx) {
        const headX = this.x + this.width / 2;
        let headY = this.y + this.headRadius;

        // Animasyon efektleri
        if (this.animationState === 'running') {
            headY += Math.sin(this.animationTime * 8) * 2;
        } else if (this.animationState === 'jumping') {
            headY -= 3;
        } else if (this.animationState === 'kicking') {
            headY += Math.sin(this.kickAnimation * 20) * 1;
        }

        // Kafa gölgesi
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(headX + 3, headY + 3, this.headRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Ana kafa (büyük!)
        const gradient = ctx.createRadialGradient(
            headX - this.headRadius * 0.3, 
            headY - this.headRadius * 0.3, 
            0,
            headX, 
            headY, 
            this.headRadius
        );
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(0.7, this.headColor);
        gradient.addColorStop(1, this.color);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(headX, headY, this.headRadius, 0, Math.PI * 2);
        ctx.fill();

        // Kafa kenarı
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Saç (head soccer tarzı)
        ctx.fillStyle = this.isPlayer1 ? '#8B4513' : '#000000';
        ctx.beginPath();
        ctx.arc(headX, headY - this.headRadius * 0.2, this.headRadius * 0.9, Math.PI, 0);
        ctx.fill();

        // Saç detayları
        ctx.strokeStyle = this.isPlayer1 ? '#654321' : '#333333';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            const angle = Math.PI + (i * Math.PI) / 4;
            const startX = headX + Math.cos(angle) * this.headRadius * 0.7;
            const startY = headY + Math.sin(angle) * this.headRadius * 0.7;
            const endX = headX + Math.cos(angle) * this.headRadius * 0.9;
            const endY = headY + Math.sin(angle) * this.headRadius * 0.9;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }

    drawFace(ctx) {
        const headX = this.x + this.width / 2;
        let headY = this.y + this.headRadius;

        if (this.animationState === 'running') {
            headY += Math.sin(this.animationTime * 8) * 2;
        } else if (this.animationState === 'jumping') {
            headY -= 3;
        } else if (this.animationState === 'kicking') {
            headY += Math.sin(this.kickAnimation * 20) * 1;
        }

        // Gözler (büyük ve ifadeli)
        const eyeSize = this.headRadius * 0.15;
        const eyeOffsetX = this.headRadius * 0.25;
        const eyeOffsetY = -this.headRadius * 0.1;

        // Sol göz
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(headX - eyeOffsetX, headY + eyeOffsetY, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Sol göz bebeği
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(
            headX - eyeOffsetX + (this.direction * 2), 
            headY + eyeOffsetY, 
            eyeSize * 0.6, 0, Math.PI * 2
        );
        ctx.fill();

        // Sağ göz
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(headX + eyeOffsetX, headY + eyeOffsetY, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Sağ göz bebeği
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(
            headX + eyeOffsetX + (this.direction * 2), 
            headY + eyeOffsetY, 
            eyeSize * 0.6, 0, Math.PI * 2
        );
        ctx.fill();

        // Ağız (durum bazlı)
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        if (this.animationState === 'jumping') {
            // Heyecanlı ağız (açık)
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(headX, headY + this.headRadius * 0.2, this.headRadius * 0.15, 0, Math.PI);
            ctx.fill();
            ctx.stroke();
        } else if (this.animationState === 'kicking') {
            // Kararlı ağız (çizgi)
            ctx.beginPath();
            ctx.moveTo(headX - this.headRadius * 0.1, headY + this.headRadius * 0.2);
            ctx.lineTo(headX + this.headRadius * 0.1, headY + this.headRadius * 0.2);
            ctx.stroke();
        } else {
            // Gülücük
            ctx.beginPath();
            ctx.arc(headX, headY + this.headRadius * 0.1, this.headRadius * 0.2, 0, Math.PI);
            ctx.stroke();
        }

        // Burun (küçük nokta)
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(headX, headY, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSpecialEffects(ctx) {
        // Özel yetenek göstergesi
        if (this.abilityReady) {
            const headX = this.x + this.width / 2;
            const headY = this.y + this.headRadius;
            
            ctx.save();
            ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.01) * 0.3;
            ctx.strokeStyle = this.specialAbility === 'power_shot' ? '#FF0000' : '#00FF00';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(headX, headY, this.headRadius + 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // Kick cooldown göstergesi
        if (this.kickCooldown > 0) {
            const shoeX = this.x + this.width * 0.65;
            const shoeY = this.y + this.headRadius * 1.2 + this.bodyHeight + this.legLength;
            
            ctx.save();
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = '#FF6347';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('!', shoeX, shoeY - 10);
            ctx.restore();
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
        } else if (this.controls.kick.includes(key)) {
            this.input.kick = true;
        }
    }

    handleKeyUp(key) {
        if (this.controls.left.includes(key)) {
            this.input.left = false;
        } else if (this.controls.right.includes(key)) {
            this.input.right = false;
        } else if (this.controls.jump.includes(key)) {
            this.input.jump = false;
        } else if (this.controls.kick.includes(key)) {
            this.input.kick = false;
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

    // Kafa vuruşu için özel collision box (big head)
    getHeadBounds() {
        return {
            x: this.x + this.width / 2 - this.headRadius,
            y: this.y,
            width: this.headRadius * 2,
            height: this.headRadius * 2
        };
    }

    // Kick collision box
    getKickBounds() {
        if (!this.isKicking) return null;
        
        const bodyY = this.y + this.headRadius * 1.2;
        const legStartY = bodyY + this.bodyHeight;
        const kickExtension = Math.sin(this.kickAnimation * 15) * 15;
        
        return {
            x: this.x + this.width * 0.65 + kickExtension * this.direction - 10,
            y: legStartY + this.legLength - 10,
            width: 20,
            height: 15
        };
    }

    // Top ile kick etkileşimi
    checkBallKick(ball) {
        const kickBounds = this.getKickBounds();
        if (!kickBounds) return false;

        // Ball ile kick collision
        if (GameUtils.circleRectCollision(ball, kickBounds)) {
            // Kick direction ve power
            const kickDirection = this.direction;
            const kickAngle = -0.3; // Yukarı doğru açı
            
            ball.velocityX = Math.cos(kickAngle) * this.kickPower * kickDirection;
            ball.velocityY = Math.sin(kickAngle) * this.kickPower;
            ball.onGround = false;
            ball.lastPlayerTouch = this;
            ball.createKickEffect();
            
            return true;
        }
        
        return false;
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