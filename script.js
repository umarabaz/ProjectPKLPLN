const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventSubmit = document.querySelector(".add-event-btn ");



let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const eventsArr = [];
getEvents();
console.log(eventsArr);

function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListner();
}

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

function addListner() {
  const days = document.querySelectorAll(".day");

  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      let dayClicked = Number(e.target.innerHTML); // Simpan tanggal yang diklik

      // Hapus kelas aktif dari semua elemen di kalender
      days.forEach((d) => {
        d.classList.remove("active");
      });

      // Tambahkan kelas aktif pada tanggal yang diklik
      e.target.classList.add("active");

      // Handle jika klik pada tanggal di bulan sebelumnya
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === dayClicked.toString()
            ) {
              day.classList.add("active");
              getActiveDay(dayClicked);
              updatePKLData(new Date(year, month, dayClicked));
            }
          });
        }, 100);
      }
      // Handle jika klik pada tanggal di bulan berikutnya
      else if (e.target.classList.contains("next-date")) {
        nextMonth();
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === dayClicked.toString()
            ) {
              day.classList.add("active");
              getActiveDay(dayClicked);
              updatePKLData(new Date(year, month, dayClicked));
            }
          });
        }, 100);
      }
      // Handle klik pada tanggal biasa di bulan yang sama
      else {
        getActiveDay(dayClicked);
        updatePKLData(new Date(year, month, dayClicked));
      }
    });
  });
}


  todayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
  });
  
  dateInput.addEventListener("input", (e) => {
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
    if (dateInput.value.length === 2) {
      dateInput.value += "/";
    }
    if (dateInput.value.length > 7) {
      dateInput.value = dateInput.value.slice(0, 7);
    }
    if (e.inputType === "deleteContentBackward") {
      if (dateInput.value.length === 3) {
        dateInput.value = dateInput.value.slice(0, 2);
      }
    }
  });
  
  gotoBtn.addEventListener("click", gotoDate);
  
  function gotoDate() {
    const dateArr = dateInput.value.split("/");
    if (dateArr.length === 2) {
      if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
        month = dateArr[0] - 1;
        year = dateArr[1];
        initCalendar();
        return;
      }
    }
    alert("Tanggal Tidak Valid");
  }
  
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];

  const daysInIndonesian = {
    Sun: "Minggu",
    Mon: "Senin",
    Tue: "Selasa",
    Wed: "Rabu",
    Thu: "Kamis",
    Fri: "Jum'at",
    Sat: "Sabtu"
  };

  // Tampilkan hari dan tanggal di elemen event-day dan event-date
  eventDay.innerHTML = daysInIndonesian[dayName];
  eventDate.innerHTML = date + " " + months[month] + " " + year;

  // Pemanggilan langsung untuk memutakhirkan data PKL berdasarkan tanggal yang dipilih
  updatePKLData(day); // Tambahkan fungsi ini untuk update tabel PKL
}

function updatePKLData(selectedDate) {
    fetch('/Database PKL PLN WEB.xlsx')
        .then(response => response.blob())
        .then(blob => readXlsxFile(blob))
        .then((rows) => {
            let filteredRows = rows.filter((row, index) => {
                if (index === 0) return true; // Tetap simpan baris header
                let tanggalMasuk = new Date(row[4]);  // Tanggal Masuk
                let tanggalKeluar = new Date(row[5]); // Tanggal Keluar

                // Strip time part to only compare dates
                tanggalMasuk.setHours(0, 0, 0, 0);
                tanggalKeluar.setHours(0, 0, 0, 0);

                // Tambahkan 1 hari pada tanggalKeluar agar periode PKL mencakup tanggalKeluar
                tanggalKeluar.setDate(tanggalKeluar.getDate() + 1);

                // Pastikan selectedDate adalah objek Date dan hanya mempertimbangkan tanggalnya
                selectedDate = new Date(selectedDate);
                selectedDate.setHours(0, 0, 0, 0);  // Set time to midnight to ignore time part

                // Periksa apakah selectedDate berada dalam periode PKL (termasuk tanggal masuk dan tanggal keluar)
                return (selectedDate >= tanggalMasuk && selectedDate < tanggalKeluar);
            });

            // Bersihkan tabel
            table.innerHTML = '';

            if (filteredRows.length <= 1) {  // <=1 karena baris pertama adalah header
                // Jika tidak ada peserta, tampilkan pesan dalam tabel tanpa header
                table.style.display = ''; // Tampilkan tabel

                // Buat baris dengan pesan "Tidak Ada Peserta PKL"
                let emptyRow = table.insertRow(); // Tambahkan baris baru
                let emptyCell = emptyRow.insertCell(); // Tambahkan sel baru
                emptyCell.colSpan = 1; // Set kolom ke 1 karena tidak perlu header
                emptyCell.textContent = 'Tidak Ada Peserta PKL'; // Tampilkan pesan
                emptyRow.style.textAlign = 'center'; // Atur agar teks berada di tengah
            } else {
                // Jika ada data, tampilkan tabel dan header
                table.style.display = ''; // Tampilkan tabel

                let headerRow = table.createTHead(); // Buat header baru
                let headerData = filteredRows[0].slice(1); // Abaikan kolom pertama (No)

                // Bersihkan header sebelumnya jika ada
                if (headerRow.rows.length > 0) {
                    headerRow.innerHTML = '';
                }

                generateTableHead(headerRow, headerData); // Buat header tabel

                // Hapus baris header dari filteredRows dan tampilkan data
                filteredRows.slice(1).forEach((row, index) => {
                    let rowData = row.slice(1); // Abaikan kolom pertama (No)
                    generateTableRows(table, rowData, index);
                });
            }
        });
}



  function updateEvents(date) {
    let events = "";
    eventsArr.forEach((event) => {
      if (
        date === event.day &&
        month + 1 === event.month &&
        year === event.year
      ) {
        event.events.forEach((event) => {
          events += `<div class="event">
              <div class="title">
                <i class="fas fa-circle"></i>
                <h3 class="event-title">${event.title}</h3>
              </div>
              <div class="event-time">
                <span class="event-time">${event.time}</span>
              </div>
          </div>`;
        });
      }
    });
    eventsContainer.innerHTML = events;
    saveEvents();
  }
  
  function saveEvents() {
    localStorage.setItem("events", JSON.stringify(eventsArr));
  }
  
  function getEvents() {
    if (localStorage.getItem("events") === null) {
      return;
    }
    eventsArr.push(...JSON.parse(localStorage.getItem("events")));
  }
  
  function convertTime(time) {
    let timeArr = time.split(":");
    let timeHour = timeArr[0];
    let timeMin = timeArr[1];
    let timeFormat = timeHour >= 12 ? "PM" : "AM";
    timeHour = timeHour % 12 || 12;
    time = timeHour + ":" + timeMin + " " + timeFormat;
    return time;
  }
  
  // Data Tabel
let tanggalInput = document.getElementById('tanggal');
let table = document.getElementById('tableData');
let messageContainer = document.createElement('div'); // Container for the message
document.body.appendChild(messageContainer); // Append it to the body or any desired container

// Set default date to today
tanggalInput.valueAsDate = new Date();

// Fetch and display data when the date changes
tanggalInput.addEventListener('change', () => {
    let tanggalValue = tanggalInput.value;
    fetch('/Database PKL PLN WEB.xlsx')
        .then(response => response.blob())
        .then(blob => readXlsxFile(blob))
        .then((rows) => {
            let filteredRows = rows.filter((row, index) => {
                if (index === 0) return true; // Keep the header row
                let tanggalMasuk = new Date(row[4]);
                let tanggalKeluar = new Date(row[5]);
                let tanggalFilter = new Date(tanggalValue);
                return tanggalFilter >= tanggalMasuk && tanggalFilter <= tanggalKeluar;
            });

            table.innerHTML = ''; // Clear the table
            messageContainer.innerHTML = ''; // Clear the message

            if (filteredRows.length === 0) {
                // If there are no participants, hide the table and display the message
                table.style.display = 'none'; // Hide the table
                messageContainer.innerHTML = '<h3>Tidak Ada Peserta PKL</h3>'; // Display the message
            } else {
                table.style.display = ''; // Show the table
                let headerRow = table.createTHead(); // Create a new header
                let headerData = filteredRows[0].slice(1); // Ignore the first column (No)

                // Clear previous headers if they exist
                if (headerRow.rows.length > 0) {
                    headerRow.innerHTML = '';
                }

                generateTableHead(headerRow, headerData); // Create the table header

                // Remove the header row from filtered rows
                filteredRows.slice(1).forEach((row, index) => {
                    let rowData = row.slice(1); // Ignore the first column (No)
                    generateTableRows(table, rowData, index);
                });
            }
        });
});

function generateTableHead(table, data) {
    let row = table.insertRow();
    let th = document.createElement('th');
    let text = document.createTextNode('No');
    th.appendChild(text);
    row.appendChild(th);

    for (let key of data) {
        th = document.createElement('th');
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function formatDate(date) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName}, ${day} ${monthName} ${year}`;
}

function generateTableRows(table, data, index) {
    let newRow = table.insertRow(-1);
    let newCell = newRow.insertCell();
    let newText = document.createTextNode(index + 1); // Use index + 1 for the "No" column
    newCell.appendChild(newText);

    data.map((cell, cellIndex) => {
        newCell = newRow.insertCell();
        if (cellIndex === 3 || cellIndex === 4) { // Tanggal Masuk and Tanggal Keluar columns
            let date = new Date(cell);
            newText = document.createTextNode(formatDate(date));
        } else {
            newText = document.createTextNode(cell);
        }
        newCell.appendChild(newText);
    });
}

// Trigger the data fetch and display on page load
window.addEventListener('DOMContentLoaded', () => {
    tanggalInput.dispatchEvent(new Event('change'));
});
