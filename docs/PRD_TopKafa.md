# TopKafa - Product Requirements Document (PRD)

## 🎯 Proje Özeti

**Proje Adı:** TopKafa  
**Proje Türü:** 2D Web Tabanlı Kafa Topu Oyunu  
**Platform:** Web Browser (HTML5, CSS3, JavaScript)  
**Hedef Kitle:** 8-99 yaş arası casual oyun severler  

## 📋 Oyun Konsepti

2 boyutlu perspektiften oynanan, basit kontrollere sahip kafa topu oyunu. Oyuncular karakterlerini kontrol ederek topu kaleye atma ve rakibi engelleme amacıyla yarışırlar.

## 🎮 Temel Oynanış Mekaniği

### Oyuncu Kontrolleri
- **Hareket:** Sol/Sağ ok tuşları veya A/D tuşları
- **Zıplama:** Yukarı ok tuşu veya W tuşu / Space
- **Özel Hareket:** Shift tuşu ile güçlü kafa vuruşu

### Oyun Kuralları
- 2 oyunculu (veya oyuncu vs AI) maç formatı
- İlk 3 gole ulaşan kazanır
- Maç süresi: 90 saniye (isteğe bağlı)
- Top sahada rastgele başlar

### Fizik Sistemi
- Gerçekçi top fiziği (gravity, bounce, friction)
- Karakterlerin momentum tabanlı hareketi
- Kafa vuruşlarında topun hızı ve yönü

## 🛠️ Teknik Gereksinimler

### Frontend
- **HTML5 Canvas** - Oyun render motoru
- **JavaScript ES6+** - Oyun mantığı
- **CSS3** - UI ve animasyonlar
- **Web Audio API** - Ses efektleri
- **LocalStorage** - Skor kaydetme

### Oyun Motoru Özellikleri
- 60 FPS hedefi
- Responsive tasarım
- Çoklu input desteği (klavye, touch)
- Collision detection sistemi

## 🎨 Görsel Tasarım

### Grafik Stili
- **2D Pixel Art** veya **Modern Flat Design**
- Renkli ve canlı palet
- Basit ama etkileyeş animasyonlar

### UI Elementleri
- Ana menü ekranı
- Oyun içi HUD (skor, süre)
- Duraklama menüsü
- Sonuç ekranı

### Karakter Tasarımı
- Basit stick figure veya chibi stil karakterler
- 2-3 farklı karakter seçeneği
- Temel animasyonlar (koşma, zıplama, kafa atma)

## 🔊 Ses Tasarımı

### Ses Efektleri
- Top çarpma sesleri
- Karakter zıplama sesleri
- Gol sesleri
- UI click sesleri

### Müzik
- Enerji dolu background müziği
- Menü müziği
- Gol kutlama müziği

## 📱 Platform Desteği

### Desteklenen Tarayıcılar
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Cihaz Desteği
- **Desktop:** Tam özellik desteği
- **Tablet:** Touch kontrolleri
- **Mobile:** Optimize edilmiş kontroller

## 🚀 Geliştirme Aşamaları

### Faz 1: Core Gameplay (MVP)
- Temel oyun motoru
- Basit karakter kontrolü
- Top fiziği
- Basit AI
- Skor sistemi

### Faz 2: Polish & Features
- Gelişmiş AI
- Ses sistemi
- Görsel efektler
- Çoklu karakter desteği

### Faz 3: Advanced Features
- Online multiplayer (isteğe bağlı)
- Tournament modu
- Achievements sistemi
- Leaderboard

## 📊 Başarı Metrikleri

### Kullanıcı Deneyimi
- Ortalama oyun süresi: 5+ dakika
- Tekrar oynama oranı: %60+
- Sayfa terk oranı: <%30

### Performans
- İlk yüklenme: <3 saniye
- FPS: Sabit 60 FPS
- Memory kullanımı: <100MB

## 🎯 Minimum Viable Product (MVP) Özellikleri

1. ✅ **Oyun Alanı:** 2D futbol sahası
2. ✅ **2 Karakter:** Oyuncu 1 vs Oyuncu 2/AI
3. ✅ **Top Fiziği:** Gerçekçi hareket
4. ✅ **Temel Kontroller:** Hareket + Zıplama
5. ✅ **Skor Sistemi:** İlk 3 gol kazanır
6. ✅ **Basit UI:** Skor göstergesi + Kontrol talimatları

## 🔧 Gelişmiş Özellikler (Nice-to-Have)

1. 🎮 **Power-ups:** Süper hız, büyük kafa, vs.
2. 🏆 **Tournament Modu:** Bracket sistemi
3. 🎨 **Tema Desteği:** Farklı sahalar
4. 📱 **Progressive Web App:** Offline oynama
5. 🌐 **Çoklu Dil Desteği:** EN, TR, vs.
6. 📊 **İstatistikler:** Maç geçmişi, win rate 