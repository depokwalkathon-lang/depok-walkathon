# Depok Walkathon Heritage 2026

Website pratinjau (statis) untuk Depok Walkathon Heritage 2026.

## Status

**BELUM SIAP UNTUK PENDAFTARAN ATAU PEMBAYARAN NYATA.** Form hanya simulasi dan tidak menyimpan data.

## Jalankan

Buka `index.html` di browser, atau deploy repository ke Vercel sebagai proyek statis tanpa build command.

## Tahap produksi berikutnya

1. Konfirmasi nama pemilik rekening dan detail acara.
2. Bangun database Supabase dengan Row Level Security, role admin, dan penyimpanan bukti transfer private.
3. Tambahkan API pendaftaran dan reservasi kuota Early Bird 100 orang secara atomik, dengan masa berlaku reservasi.
4. Tambahkan tagihan unik, unggah bukti, dan verifikasi berdasarkan mutasi rekening (jangan percaya bukti unggah saja).
5. Tambahkan autentikasi admin, audit log, QR tiket dan check-in aman.
6. Uji menyeluruh sebelum mengaktifkan pembayaran publik.

Jangan pernah commit password, token, service-role key, atau file `.env` ke GitHub.
