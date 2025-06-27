# TopKafa Kurulum Rehberi

Bu dokümantasyon TopKafa projesinin kurulum adımlarını açıklamaktadır.

## Sistem Gereksinimleri

- Python 3.8 veya üzeri
- Git

## Kurulum Adımları

### 1. Repository'yi Klonlama

```bash
git clone https://github.com/turco-0/TopKafa.git
cd TopKafa
```

### 2. Sanal Ortam Oluşturma (Opsiyonel ama Önerilen)

```bash
python -m venv venv
```

#### Windows'ta:
```bash
venv\Scripts\activate
```

#### Linux/macOS'ta:
```bash
source venv/bin/activate
```

### 3. Bağımlılıkları Yükleme

```bash
pip install -r requirements.txt
```

### 4. Uygulamayı Çalıştırma

```bash
python src/main.py
```

## Sorun Giderme

Kurulum sırasında karşılaştığınız sorunlar için [Issues](https://github.com/turco-0/TopKafa/issues) sayfasını ziyaret edebilirsiniz. 