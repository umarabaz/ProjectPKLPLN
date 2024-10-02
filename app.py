from flask import Flask, render_template
import calendar
import datetime

app = Flask(__name__)

# Contoh data peserta PKL berdasarkan tanggal
active_pkl = {
    1: ['Umar Alfarizi Ramadhan', 'Siti Nurhaliza Maulana'],
    2: ['Abdul Rafiq Hakimullah'],
    3: [],
    4: [],
    5: ['Ahmad Fauzan Maulana'],
    6: [],
    7: [],
    8: [],
    9: [],
    10: ['Aziz Rahman Wiryawan'],
    11: [],
    12: [],
    13: [],
    14: [],
    15: ['Budi Setiawan Pratama'],
    16: [],
    17: [],
    18: [],
    19: [],
    20: [],
    21: [],
    22: [],
    23: [],
    24: [],
    25: [],
    26: [],
    27: [],
    28: [],
    29: [],
    30: [],
    31: [],
}

# Halaman utama untuk kalender
@app.route('/')
def index():
    now = datetime.datetime.now()
    year = now.year
    month = now.month
    # Buat data kalender bulanan
    cal = calendar.Calendar(firstweekday=0)
    calendar_data = []
    for week in cal.monthdayscalendar(year, month):
        calendar_data.append(week)

    # Render template HTML dengan data kalender
    return render_template('calendar.html', month_name=calendar.month_name[month], year=year, calendar_data=calendar_data)

# Rute untuk menampilkan peserta PKL pada hari tertentu
@app.route('/pkl-day/<int:day>')
def show_pkl_day(day):
    # Ambil peserta aktif pada hari yang dipilih
    participants = active_pkl.get(day, ['Tidak ada peserta'])
    return render_template('pkl_day.html', day=day, participants=participants)

if __name__ == "__main__":
    app.run(debug=True)
