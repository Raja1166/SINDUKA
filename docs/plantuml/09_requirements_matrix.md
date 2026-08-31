# Matriks Kebutuhan Aplikasi SINDUKA Guardian

## 1. Kebutuhan Fungsional

| ID | Kebutuhan | Deskripsi |
|----|-----------|-----------|
| F01 | Autentikasi | Pengguna dapat mendaftar dan login ke aplikasi. |
| F02 | Profil | Pengguna dapat mengelola data profil dan kontak darurat. |
| F03 | Safe Journey | Pengguna dapat memulai, menjeda, melanjutkan, dan mengakhiri perjalanan. |
| F04 | Check-In | Sistem memunculkan pop-up check-in berkala dan menerima respons aman. |
| F05 | GPS Tracking | Sistem menampilkan live location dan status perjalanan. |
| F06 | Telemetri Sensor | Sistem mengolah data accelerometer, gyroscope, dan GPS. |
| F07 | Incident Detection | Sistem mendeteksi benturan, rollover, dan timeout check-in. |
| F08 | Silent SOS | Pengguna dapat mengirim penanda darurat tanpa alarm. |
| F09 | Dispatch | Sistem mengirimkan notifikasi dan dispatch ambulans ke lokasi. |
| F10 | Admin Monitoring | Admin memantau kejadian aktif dan riwayat insiden. |
| F11 | Reporting | Admin dapat menghasilkan statistik dan laporan. |

## 2. Kebutuhan Non-Fungsional

| ID | Kebutuhan | Deskripsi |
|----|-----------|-----------|
| NF01 | Keamanan | Password disimpan dalam bentuk hash sederhana dan session disimpan aman di browser. |
| NF02 | Kinerja | Antarmuka menanggapi dalam waktu cepat. |
| NF03 | Reliabilitas | Sistem tetap berjalan meskipun server tidak aktif secara penuh karena data lokal tersedia. |
| NF04 | Usability | Antarmuka sederhana, modern, dan mudah dipahami. |
| NF05 | Maintainability | Struktur kode dibuat modular agar mudah dikembangkan. |

## 3. Kebutuhan Pengguna

- Pengguna umum membutuhkan feature routing dan perlindungan selama perjalanan.
- Kontak darurat membutuhkan pengiriman notifikasi darurat.
- Admin membutuhkan dashboard monitoring real-time.
- Rumah sakit dan ambulans membutuhkan informasi rujukan dan lokasi kejadian.
