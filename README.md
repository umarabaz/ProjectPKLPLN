"Project Bot Kalender PKL PLN"

Proyek ini merupakan bot Telegram yang dirancang untuk membantu melacak jadwal peserta PKL (Praktik Kerja Lapangan). Bot ini terintegrasi dengan sistem kalender berbasis web dan menyediakan miniapp melalui Telegram.

## Fitur
- Menampilkan jadwal peserta PKL berdasarkan tanggal yang dipilih.
- Kalender interaktif dengan informasi peserta yang terperinci.
- Terintegrasi dengan Telegram BotFather sebagai aplikasi mini.

### 1. Jalankan Bot
- Jalankan bot dengan mengeksekusi `bot.py`.
- Pastikan bot berjalan dan terhubung ke Telegram menggunakan token yang diperoleh dari BotFather.

### 2. Deploy Aplikasi Web
- Deploy aplikasi web yang menyediakan HTTPS untuk aplikasi berbasis. pastikan web bisa mengakses database yang berupa file excel (.xlsx)
- Setelah berhasil di-deploy, salin URL HTTPS dari aplikasi web tersebut.

### 3. Edit Bot di BotFather
- Buka Telegram dan masuk ke BotFather.
- Pilih bot yang sudah dibuat dan edit pengaturannya untuk menambahkan URL HTTPS dari aplikasi web yang sudah di-deploy sebagai miniapp.
- Uji bot dengan berinteraksi melalui Telegram dan pastikan kalender serta data peserta PKL ditampilkan dengan benar.
