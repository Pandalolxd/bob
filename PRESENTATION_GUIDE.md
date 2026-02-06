# Panduan Presentasi AI Place Recognition

Panduan ini dirancang untuk membantumu menjelaskan proyek ini kepada guru dan teman-teman sekelas dengan cara yang jelas, profesional, dan percaya diri.

---

## 1. Ringkasan Proyek
**Apa ini?**
Sebuah aplikasi web yang dapat mengenali landmark atau bangunan dari sebuah foto. Aplikasi ini menggunakan Kecerdasan Buatan (khususnya "Computer Vision") untuk "melihat" gambar dan membandingkannya dengan database lokasi yang sudah diketahui.

---

## 2. "Otak" di Baliknya - Cara Kerja Machine Learning
Ini adalah bagian terpenting untuk dijelaskan kepada gurumu. Kami menggunakan teknik yang disebut **Feature Extraction** (Ekstraksi Fitur).

### A. Model: MobileNetV2
*   **Apa itu:** Kami menggunakan model AI yang sudah dilatih sebelumnya bernama **MobileNetV2**.
*   **Analoginya:** Bayangkan MobileNetV2 sebagai seorang "Kritikus Seni Profesional" yang telah melihat jutaan gambar berbeda (mobil, anjing, pohon, bangunan).
*   **Apa fungsinya:** Alih-alih melihat pixel demi pixel, AI ini melihat *pola*—seperti bentuk, tekstur, dan garis-garis bangunan.

### B. Feature Extraction (Sidik Jari Digital)
*   Saat kamu mengunggah foto, AI tidak langsung melihat "Monas" atau "Candi Borobudur". AI melihat daftar angka yang sangat panjang (disebut "vektor").
*   Daftar angka ini seperti **Sidik Jari Digital**. Setiap tempat unik memiliki sidik jari yang sedikit berbeda.
*   **Dalam kode:** Ini terjadi di file `ml_core.py` pada fungsi `extract_features`.

### C. Cosine Similarity (Proses Pencocokan)
*   **Cara AI memutuskan:** Setelah kita punya "sidik jari" dari foto yang diunggah, kita membandingkannya dengan semua "sidik jari" yang sudah ada di database kita.
*   Kami menggunakan rumus matematika bernama **Cosine Similarity**.
*   **Penjelasan sederhana:** Rumus ini mengukur seberapa "dekat" atau mirip dua buah sidik jari. Jika kemiripannya di atas 90%, kita bisa bilang "Ini cocok!"
*   **Dalam kode:** Ini terjadi di file `ml_core.py` pada fungsi `find_most_similar`.

---

## 3. Teknologi yang Digunakan (Tech Stack)
*   **Frontend (Tampilan):** HTML5, CSS3 (Modern UI), dan JavaScript. Kami menggunakan "Feather Icons" untuk desain ikonnya.
*   **Backend (Mesin):** **Flask** (framework web berbasis Python). Ini yang menangani permintaan pengguna dan menghubungkannya dengan logika AI.
*   **Database:** **SQLite** dengan **SQLAlchemy**. Ini digunakan untuk menyimpan nama tempat, deskripsi, dan "Sidik Jari Digital" mereka.
*   **Library AI:** **TensorFlow/Keras** (untuk menjalankan model MobileNetV2) dan **NumPy** (untuk perhitungan matematika).

---

## 4. Alur Kerja (Workflow)

### Sisi Admin (Menyiapkan Data)
1.  Admin masuk (login).
2.  Admin membuat data "Tempat" baru (misal: "Perpustakaan").
3.  Admin mengunggah "Foto Latihan". Untuk setiap foto, AI akan membuat "Sidik Jari Digital" dan menyimpannya di database.
4.  Admin juga bisa mengunggah "Foto Jadul" untuk ditampilkan dalam slideshow sejarah.

### Sisi Pengguna (Mengenali Tempat)
1.  Pengguna mengunggah foto atau menggunakan kamera.
2.  Website mengirim foto tersebut ke backend Python.
3.  Backend mengekstrak "sidik jari" dan mencari kecocokan terbaik di database.
4.  Jika ditemukan kecocokan, muncul halaman hasil yang keren dengan nama tempat, skor kemiripan, deskripsi, dan slideshow foto sejarah.

---

## 5. FAQ (Siap-siap Pertanyaan Ini!)

**T: Mengapa menggunakan MobileNetV2?**
*   **J:** Karena model ini dirancang untuk cepat dan efisien. Bisa dijalankan di HP atau server kecil tanpa butuh komputer super besar, jadi sangat cocok untuk aplikasi web.

**T: Apa yang terjadi jika saya mengunggah foto kucing?**
*   **J:** AI akan tetap membuat "sidik jari" untuk kucing itu, tapi saat dibandingkan dengan sidik jari gedung di database, skor kemiripannya akan sangat rendah (misal cuma 0.2). Kode kita punya **ambang batas (0.6)**; jika skor di bawah itu, sistem akan bilang "Tempat tidak dikenal."

**T: Di mana foto-foto tersebut disimpan?**
*   **J:** File foto asli disimpan di folder `uploads/`, sedangkan nama tempat dan "sidik jari" AI-nya disimpan di database SQLite.

**T: Bisakah ia mengenali tempat yang belum pernah didaftarkan?**
*   **J:** Tidak. Ia hanya bisa mengenali tempat yang sudah ditambahkan oleh Admin dan sudah "dilatih" dengan mengunggah foto-fotonya ke sistem.

---

## 6. Contoh Naskah Presentasi (5-7 Menit)

### Menit 1: Pembukaan & Demo
*   "Halo semuanya! Hari ini saya akan mempresentasikan proyek AI Place Recognition saya."
*   "Tujuannya sederhana: Anda ambil foto sebuah bangunan bersejarah, dan AI akan memberi tahu itu bangunan apa, sejarahnya, serta menunjukkan foto-foto jadul dari tempat tersebut."
*   *(Aksi: Tunjukkan halaman utama dan coba unggah foto jika ada contohnya).*

### Menit 2-3: Bagian "Bagaimana Ini Bekerja" (Machine Learning)
*   "Mungkin teman-teman bertanya: 'Apakah AI cuma membandingkan gambar biasa?' Jawabannya tidak."
*   "Saya menggunakan **MobileNetV2**. Anggap saja ini sebagai 'mata' AI. Saat melihat gambar, AI mengabaikan hal-hal seperti pencahayaan dan fokus pada bentuk unik bangunan tersebut untuk membuat **Sidik Jari Digital**."
*   "Saat kita upload foto, sistem membuat sidik jari baru dan membandingkannya dengan database menggunakan **Cosine Similarity**—cara matematika untuk menghitung seberapa mirip dua sidik jari tersebut."

### Menit 4: Admin & Data
*   "Di balik layar, ada panel Admin. Di sinilah proses 'belajar' terjadi."
*   "Untuk menambahkan tempat baru, saya mengunggah beberapa foto. AI akan mengambil sidik jari dari setiap foto itu dan menyimpannya. Dengan begitu, AI bisa mengenali bangunan dari berbagai sudut."

### Menit 5: Teknologi
*   "Secara teknis, ini adalah aplikasi full-stack berbasis Python."
*   "Saya menggunakan **Flask** untuk server web, **TensorFlow** untuk model AI-nya, dan **SQLAlchemy** untuk database. Tampilannya menggunakan CSS modern agar terlihat seperti aplikasi profesional."

### Menit 6-7: Penutup & Tanya Jawab
*   "Pelajaran yang saya ambil: Bagian tersulit bukan AI-nya, tapi memastikan AI dan website bisa berkomunikasi dengan lancar."
*   "Ke depannya, saya bisa menambahkan lebih banyak tempat atau fitur GPS."
*   "Apakah ada yang ingin ditanyakan?"
