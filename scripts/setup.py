#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
TopKafa Kurulum Script
======================

Proje kurulumu için yardımcı script.
"""

import os
import subprocess
import sys

def check_python_version():
    """Python versiyonunu kontrol et"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 veya üzeri gereklidir!")
        print(f"Mevcut versiyon: {sys.version}")
        return False
    print(f"✅ Python versiyonu uygun: {sys.version}")
    return True

def create_virtual_environment():
    """Sanal ortam oluştur"""
    try:
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
        print("✅ Sanal ortam oluşturuldu")
        return True
    except subprocess.CalledProcessError:
        print("❌ Sanal ortam oluşturulamadı")
        return False

def install_requirements():
    """Gereksinimleri yükle"""
    if os.path.exists("requirements.txt"):
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
            print("✅ Bağımlılıklar yüklendi")
            return True
        except subprocess.CalledProcessError:
            print("❌ Bağımlılıklar yüklenemedi")
            return False
    else:
        print("⚠️ requirements.txt bulunamadı")
        return True

def main():
    """Ana kurulum fonksiyonu"""
    print("🚀 TopKafa Kurulum Başlatılıyor...")
    
    if not check_python_version():
        return 1
    
    if not create_virtual_environment():
        return 1
    
    if not install_requirements():
        return 1
    
    print("✅ Kurulum tamamlandı!")
    print("Uygulamayı çalıştırmak için: python src/main.py")
    return 0

if __name__ == "__main__":
    sys.exit(main()) 