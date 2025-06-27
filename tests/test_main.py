#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
TopKafa Test Modülü
===================

Ana uygulama için unit testler.
"""

import unittest
import sys
import os

# Ana modülü import edebilmek için path'e ekle
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

import main

class TestMain(unittest.TestCase):
    """Ana uygulama test sınıfı"""
    
    def test_main_function_exists(self):
        """Main fonksiyonunun var olduğunu test et"""
        self.assertTrue(hasattr(main, 'main'))
        self.assertTrue(callable(main.main))
    
    def test_main_function_runs(self):
        """Main fonksiyonunun çalıştığını test et"""
        try:
            main.main()
        except Exception as e:
            self.fail(f"main() fonksiyonu hata verdi: {e}")

if __name__ == '__main__':
    unittest.main() 