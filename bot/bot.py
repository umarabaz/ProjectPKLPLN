import pandas as pd
import matplotlib.pyplot as plt
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Updater, CommandHandler, CallbackContext, CallbackQueryHandler
import logging
import io

# Logging untuk notifikasi di terminal
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()


# Fungsi untuk menampilkan notifikasi di terminal saat bot siap
def start_bot_notification():
    logger.info("Bot is ready and waiting for messages...")


# Fungsi untuk memuat data dari file Excel
def get_excel_data():
    # Baca data dari Excel
    #df = pd.read_excel('Database PKL PLN UP3 Bandung.xlsx')
    df = pd.read_excel('Database PKL PLN UP3 Bandung.xlsx', sheet_name='IT')
    # Memformat tanggal untuk hanya menampilkan tanggal tanpa waktu
    df['Tanggal Masuk'] = pd.to_datetime(df['Tanggal Masuk']).dt.strftime('%d/%m/%Y')
    df['Tanggal Keluar'] = pd.to_datetime(df['Tanggal Keluar']).dt.strftime('%d/%m/%Y')

    return df

def generate_table_image():
    df = get_excel_data()

    # Mengatur ukuran gambar berdasarkan panjang teks dan jumlah baris
    rows = len(df)
    total_width = 0.8 * len(df.columns)  # Ukuran dinamis berdasarkan jumlah kolom
    fig, ax = plt.subplots(figsize=(total_width, 0.3 * rows))  # Ukuran tinggi dinamis

    ax.axis('tight')
    ax.axis('off')

    # Membuat tabel dari DataFrame
    table = ax.table(cellText=df.values, colLabels=df.columns, cellLoc='center', loc='center')

    # Mengatur lebar kolom sesuai dengan panjang teks
    for i in range(len(df.columns)):
        table.auto_set_column_width(i)

    # Mengurangi padding dan margin
    table.scale(1.2, 1.2)  # Skala tabel agar lebih besar dan mengurangi ruang kosong

    # Menghapus ruang kosong di bagian atas dan bawah
    plt.subplots_adjust(left=0.05, right=0.95, top=0.95, bottom=0.05)

    # Menyimpan gambar ke dalam buffer
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', dpi=200)  # Menggunakan bbox_inches='tight' untuk mengurangi ruang kosong
    buf.seek(0)
    plt.close()

    return buf


# Fungsi untuk menampilkan ucapan selamat datang dan tombol "Lihat Data"
def start(update: Update, context: CallbackContext):
    welcome_message = "Selamat datang di bot PKL PLN UP3 Bandung. Tekan tombol di bawah untuk melihat data PKL. t.me/PKLUP3bdg_bot/dataPKLUP3Bandung"

    # Membuat tombol "Lihat Data"
    keyboard = [[InlineKeyboardButton("Lihat Data", callback_data='lihat_data')]]
    reply_markup = InlineKeyboardMarkup(keyboard)

    # Kirim pesan selamat datang dengan tombol
    update.message.reply_text(welcome_message, reply_markup=reply_markup)


# Fungsi untuk menangani ketika tombol "Lihat Data" ditekan
def button(update: Update, context: CallbackContext):
    query = update.callback_query
    query.answer()

    # Jika tombol "Lihat Data" ditekan
    if query.data == 'lihat_data':
        image = generate_table_image()

        # Kirim gambar ke user
        query.message.reply_photo(photo=image)


# Fungsi utama untuk memulai bot
def main():
    # Token dari BotFather
    updater = Updater(token='8190318206:AAGb0M6vARN_JJ7wMLkp6TUGpyOsZvtXIB4', use_context=True)
    dispatcher = updater.dispatcher

    # Tambahkan handler untuk perintah /start dan callback tombol
    dispatcher.add_handler(CommandHandler("start", start))
    dispatcher.add_handler(CallbackQueryHandler(button))

    # Notifikasi bahwa bot siap
    start_bot_notification()

    # Memulai polling untuk menerima pesan
    updater.start_polling()
    updater.idle()


if __name__ == '__main__':
    main()
