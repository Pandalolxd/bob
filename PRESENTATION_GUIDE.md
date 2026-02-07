# Panduan Teknis Proyek Place Recognition

Dokumen ini menjelaskan detail teknologi yang digunakan dalam aplikasi AI Place Recognition ini, mencakup Flask, TensorFlow, SQLAlchemy, dan Frontend modern.

---

## 1. Flask (Web Server)
Flask bertindak sebagai pusat kendali (backend) yang menghubungkan semua komponen aplikasi.
- **Routing & API**: Mengelola endpoint seperti `/predict` untuk identifikasi gambar dan area admin untuk pengelolaan data.
- **Session Management**: Menangani autentikasi admin secara aman.
- **Cache Busting**: Implementasi `dated_url_for` memastikan browser selalu memuat file CSS dan JS terbaru dengan menambahkan timestamp modifikasi file pada URL.
- **Jinja2 Templating**: Memungkinkan pembuatan halaman HTML dinamis berdasarkan data dari database.

## 2. TensorFlow (AI Model)
Bagian AI menggunakan framework TensorFlow/Keras untuk mengenali tempat melalui analisis visual.
- **Arsitektur MobileNetV2**: Dipilih karena efisiensinya yang tinggi dan ukuran yang ringan, sangat cocok untuk aplikasi berbasis mobile atau web yang responsif.
- **Feature Extraction**: Model digunakan sebagai *extractor*. Gambar yang diunggah dikonversi menjadi vektor fitur (digital fingerprint) berdimensi 1280.
- **Similarity Matching**: Menggunakan **Cosine Similarity** dari pustaka `scikit-learn` untuk membandingkan vektor fitur gambar user dengan data latih di database. Jika skor kemiripan di atas ambang batas (threshold 0.6), tempat akan teridentifikasi.

## 3. SQLAlchemy (Database)
SQLAlchemy digunakan sebagai ORM (Object-Relational Mapper) untuk berinteraksi dengan database SQLite.
- **Model Data**:
    - `Place`: Menyimpan nama dan deskripsi detail lokasi.
    - `Image`: Menyimpan data latih, termasuk nama file dan vektor fitur AI yang sudah di-ekstrak (disimpan dalam format `PickleType`).
    - `OldImage`: Menyimpan referensi ke foto-foto sejarah/informasi tambahan.
- **Integrasi**: Memudahkan pengelolaan relasi *one-to-many* antara satu tempat dengan banyak foto pendukungnya.

## 4. Modern Frontend (CSS & JavaScript)
Frontend dirancang untuk memberikan pengalaman aplikasi mobile profesional di dalam browser.
- **Modern CSS**:
    - Menggunakan **CSS Variables** untuk manajemen tema yang konsisten.
    - Layout responsif menggunakan **Flexbox** dan **CSS Grid**.
    - Estetika modern dengan font Poppins, efek Glassmorphism (`backdrop-filter`), dan animasi halus.
- **JavaScript (ES6+)**:
    - **Camera API**: Mengakses kamera perangkat secara langsung menggunakan `navigator.mediaDevices.getUserMedia`.
    - **AJAX (Fetch API)**: Mengirim foto ke server dan menerima hasil prediksi secara *asynchronous* tanpa memuat ulang halaman.
    - **Interactive Slideshow**: Menampilkan koleksi foto sejarah tempat dalam bentuk overlay yang interaktif.
- **Feather Icons**: Pustaka ikon ringan yang menambah kesan profesional pada antarmuka.

---
*Dibuat untuk mempermudah penjelasan teknis saat presentasi proyek.*
