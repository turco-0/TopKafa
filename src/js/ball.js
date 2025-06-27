/**
 * TopKafa - Ball Class
 * Top fiziği ve animasyonları
 */

class Ball {
    constructor(x, y) {
        // Pozisyon ve boyut
        this.x = x;
        this.y = y;
        this.radius = GAME_CONFIG.BALL_RADIUS;
        
        // Fizik özellikleri
        this.velocityX = 0;
        this.velocityY = 0;
        this.friction = 0.98;
        this.bounciness = 0.8;
        this.gravity = GAME_CONFIG.GRAVITY;
        
        // Görsel özellikleri
        this.rotation = 0;
        this.rotationSpeed = 0;
        this.scale = 1;
        this.shadowOffset = 5;
        
        // Durum
        this.onGround = false;
        this.lastPlayerTouch = null;
        this.airTime = 0;
        
        // Efekt sistemi
        this.trails = [];
        this.sparkles = [];
        this.kickEffect = false;
        this.kickEffectTime = 0;
    }

    update(deltaTime) {
        // Pozisyon güncelleme
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
        
        // Yer çekimi
        if (!this.onGround) {
            this.velocityY += this.gravity * deltaTime;
            this.airTime += deltaTime;
        }
        
        // Rotasyon
        this.rotationSpeed = this.velocityX * 0.01;
        this.rotation += this.rotationSpeed;
        
        // Zemin collision
        this.checkGroundCollision();
        
        // Saha sınırları
        this.checkBounds();
        
        // Trail efekti
        this.updateTrails(deltaTime);
        
        // Kick efekti
        if (this.kickEffect) {
            this.kickEffectTime -= deltaTime;
            if (this.kickEffectTime <= 0) {
                this.kickEffect = false;
            }
        }
        
        // Hız azaltma (sürtünme)
        this.velocityX *= this.friction;
        
        // Durgun top kontrolü
        if (Math.abs(this.velocityX) < 10 && Math.abs(this.velocityY) < 10 && this.onGround) {
            this.velocityX *= 0.9;
        }
    }

    checkGroundCollision() {
        const groundY = GAME_CONFIG.GROUND_Y - this.radius;
        
        if (this.y >= groundY) {
            this.y = groundY;
            
            if (this.velocityY > 50) { // Sadece hızlı düşüşlerde bounce
                this.velocityY = -this.velocityY * this.bounciness;
                this.createBounceEffect();
            } else {
                this.velocityY = 0;
                this.onGround = true;
                this.airTime = 0;
            }
        } else {
            this.onGround = false;
        }
    }

    checkBounds() {
        // Sol ve sağ sınırlar
        if (this.x - this.radius < 50) {
            this.x = 50 + this.radius;
            this.velocityX = -this.velocityX * 0.7;
        } else if (this.x + this.radius > GAME_CONFIG.CANVAS_WIDTH - 50) {
            this.x = GAME_CONFIG.CANVAS_WIDTH - 50 - this.radius;
            this.velocityX = -this.velocityX * 0.7;
        }
        
        // Üst sınır
        if (this.y - this.radius < 50) {
            this.y = 50 + this.radius;
            this.velocityY = -this.velocityY * 0.5;
        }
    }

    // Oyuncu ile çarpışma
    checkPlayerCollision(player) {
        const headBounds = player.getHeadBounds();
        const bodyBounds = player.getBounds();
        
        // Kafa ile çarpışma (güçlü)
        if (this.checkHeadCollision(headBounds, player)) {
            return 'head';
        }
        
        // Vücut ile çarpışma (zayıf)
        if (GameUtils.circleRectCollision(this, bodyBounds)) {
            this.handleBodyCollision(player);
            return 'body';
        }
        
        return null;
    }

    checkHeadCollision(headBounds, player) {
        const distance = GameUtils.distance(
            this.x, this.y,
            headBounds.x + headBounds.width / 2,
            headBounds.y + headBounds.height / 2
        );
        
        if (distance < this.radius + headBounds.width / 2) {
            this.handleHeadCollision(player);
            return true;
        }
        
        return false;
    }

    handleHeadCollision(player) {
        // Çarpışma yönü hesapla
        const angle = Math.atan2(
            this.y - (player.y + player.height * 0.25),
            this.x - (player.x + player.width / 2)
        );
        
        // Güçlü kafa vuruşu
        const power = 400 + Math.abs(player.velocityX) * 0.5;
        this.velocityX = Math.cos(angle) * power;
        this.velocityY = Math.sin(angle) * power - 100; // Yukarı doğru kuvvet
        
        // Oyuncu yönüne göre ek kuvvet
        if (player.direction !== 0) {
            this.velocityX += player.direction * 200;
        }
        
        // Efektler
        this.createKickEffect();
        this.lastPlayerTouch = player;
        this.onGround = false;
    }

    handleBodyCollision(player) {
        // Hafif itiş
        const pushForce = 150;
        const angle = Math.atan2(
            this.y - (player.y + player.height / 2),
            this.x - (player.x + player.width / 2)
        );
        
        this.velocityX = Math.cos(angle) * pushForce;
        this.velocityY = Math.sin(angle) * pushForce;
        
        this.lastPlayerTouch = player;
    }

    // Kale kontrolü
    checkGoal() {
        const ballCenterY = this.y;
        const goalTop = GAME_CONFIG.CANVAS_HEIGHT / 2 - GAME_CONFIG.GOAL_HEIGHT / 2;
        const goalBottom = GAME_CONFIG.CANVAS_HEIGHT / 2 + GAME_CONFIG.GOAL_HEIGHT / 2;
        
        // Sol kale
        if (this.x - this.radius <= GAME_CONFIG.GOAL_WIDTH && 
            ballCenterY >= goalTop && ballCenterY <= goalBottom) {
            return 'left';
        }
        
        // Sağ kale
        if (this.x + this.radius >= GAME_CONFIG.CANVAS_WIDTH - GAME_CONFIG.GOAL_WIDTH && 
            ballCenterY >= goalTop && ballCenterY <= goalBottom) {
            return 'right';
        }
        
        return null;
    }

    // Efekt sistemleri
    createKickEffect() {
        this.kickEffect = true;
        this.kickEffectTime = 0.3;
        
        // Parçacık efekti
        for (let i = 0; i < 5; i++) {
            this.sparkles.push({
                x: this.x + GameUtils.random(-this.radius, this.radius),
                y: this.y + GameUtils.random(-this.radius, this.radius),
                vx: GameUtils.random(-100, 100),
                vy: GameUtils.random(-100, 100),
                life: 0.3,
                maxLife: 0.3
            });
        }
    }

    createBounceEffect() {
        // Bounce parçacıkları
        for (let i = 0; i < 3; i++) {
            this.sparkles.push({
                x: this.x + GameUtils.random(-this.radius, this.radius),
                y: GAME_CONFIG.GROUND_Y,
                vx: GameUtils.random(-50, 50),
                vy: GameUtils.random(-150, -50),
                life: 0.2,
                maxLife: 0.2
            });
        }
    }

    updateTrails(deltaTime) {
        // Trail ekleme (hızlı hareket halinde)
        const speed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
        if (speed > 200) {
            this.trails.push({
                x: this.x,
                y: this.y,
                life: 0.15,
                maxLife: 0.15,
                alpha: 0.7
            });
        }
        
        // Trail güncelleme
        for (let i = this.trails.length - 1; i >= 0; i--) {
            const trail = this.trails[i];
            trail.life -= deltaTime;
            trail.alpha = trail.life / trail.maxLife;
            
            if (trail.life <= 0) {
                this.trails.splice(i, 1);
            }
        }
        
        // Sparkle güncelleme
        for (let i = this.sparkles.length - 1; i >= 0; i--) {
            const sparkle = this.sparkles[i];
            sparkle.x += sparkle.vx * deltaTime;
            sparkle.y += sparkle.vy * deltaTime;
            sparkle.life -= deltaTime;
            
            if (sparkle.life <= 0) {
                this.sparkles.splice(i, 1);
            }
        }
    }

    render(ctx) {
        // Trail çizimi
        this.drawTrails(ctx);
        
        // Gölge
        this.drawShadow(ctx);
        
        // Ana top
        this.drawBall(ctx);
        
        // Efektler
        this.drawEffects(ctx);
        
        // Sparkle'lar
        this.drawSparkles(ctx);
    }

    drawTrails(ctx) {
        for (const trail of this.trails) {
            ctx.save();
            ctx.globalAlpha = trail.alpha * 0.5;
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(trail.x, trail.y, this.radius * 0.7, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    drawShadow(ctx) {
        const shadowY = GAME_CONFIG.GROUND_Y + 10;
        const shadowSize = this.radius * 0.8;
        const shadowAlpha = Math.max(0.1, 0.5 - (this.y - GAME_CONFIG.GROUND_Y) / 200);
        
        ctx.save();
        ctx.globalAlpha = shadowAlpha;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x + this.shadowOffset, shadowY, shadowSize, shadowSize * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawBall(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Kick efekti ile büyütme
        if (this.kickEffect) {
            const effectScale = 1 + (this.kickEffectTime / 0.3) * 0.2;
            ctx.scale(effectScale, effectScale);
        }
        
        // Ana top (gradyan)
        const gradient = ctx.createRadialGradient(-5, -5, 0, 0, 0, this.radius);
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(0.3, '#FFD700');
        gradient.addColorStop(1, '#FFA500');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Top kenarı
        ctx.strokeStyle = '#FF8C00';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Top deseni (pentagon çizgileri)
        ctx.strokeStyle = '#FF6347';
        ctx.lineWidth = 1.5;
        
        // Pentagon deseni
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const x1 = Math.cos(angle) * this.radius * 0.3;
            const y1 = Math.sin(angle) * this.radius * 0.3;
            const x2 = Math.cos(angle) * this.radius * 0.8;
            const y2 = Math.sin(angle) * this.radius * 0.8;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        // Merkez daire
        ctx.fillStyle = '#FF6347';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    drawEffects(ctx) {
        if (this.kickEffect) {
            // Kick etki halkası
            ctx.save();
            ctx.globalAlpha = this.kickEffectTime / 0.3;
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + (1 - this.kickEffectTime / 0.3) * 20, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    drawSparkles(ctx) {
        for (const sparkle of this.sparkles) {
            ctx.save();
            ctx.globalAlpha = sparkle.life / sparkle.maxLife;
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(sparkle.x, sparkle.y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Yardımcı fonksiyonlar
    getBounds() {
        return {
            x: this.x - this.radius,
            y: this.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        };
    }

    resetPosition(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.rotation = 0;
        this.rotationSpeed = 0;
        this.trails = [];
        this.sparkles = [];
        this.kickEffect = false;
        this.lastPlayerTouch = null;
        this.airTime = 0;
    }

    applyForce(forceX, forceY) {
        this.velocityX += forceX;
        this.velocityY += forceY;
        this.onGround = false;
    }

    getSpeed() {
        return Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
    }
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.Ball = Ball;
} 