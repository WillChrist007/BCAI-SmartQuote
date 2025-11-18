// Struktur rate OJK berdasarkan tabel yang Anda berikan
const OJK_RATE = {
    // Tarif Premi atau Kontribusi Asuransi Harta Benda (‰) - Batas Bawah
    // ... (Data OJK_RATE yang sudah Anda berikan)
    "2976": {
        keterangan: "Dwelling house",
        konstruksi_1_min: 0.294,
        konstruksi_2_min: 0.397,
        konstruksi_3_min: 0.499
    },
    "29371": {
        keterangan: "Private Warehouse",
        konstruksi_1_min: 1.127,
        konstruksi_2_min: 1.691,
        konstruksi_3_min: 2.255
    },
    "2934": {
        keterangan: "Shops, non chain store",
        konstruksi_1_min: 1.520,
        konstruksi_2_min: 2.280,
        konstruksi_3_min: 3.040
    },
    "2933": {
        keterangan: "Chain Stores, convenience store, grocery store",
        konstruksi_1_min: 2.474,
        konstruksi_2_min: 3.711,
        konstruksi_3_min: 4.948
    },
    "2930": {
        keterangan: "Drug Store (apotek)",
        konstruksi_1_min: 0.889,
        konstruksi_2_min: 1.334,
        konstruksi_3_min: 1.778
    },
    "29313A": {
        keterangan: "Shopping mall/center Grade A",
        konstruksi_1_min: 0.893,
        konstruksi_2_min: 1.340,
        konstruksi_3_min: 1.787
    },
    "29313B": {
        keterangan: "Shopping mall/center Grade B",
        konstruksi_1_min: 2.234,
        konstruksi_2_min: 3.350,
        konstruksi_3_min: 4.467
    },
    "29395": {
        keterangan: "Show Rooms",
        konstruksi_1_min: 1.520,
        konstruksi_2_min: 2.280,
        konstruksi_3_min: 3.040
    },
    "2945": {
        keterangan: "Restaurants",
        konstruksi_1_min: 1.479,
        konstruksi_2_min: 2.218,
        konstruksi_3_min: 2.958
    },
    "2971": {
        keterangan: "Apartments/condominiums, offices",
        konstruksi_1_min: 0.368,
        konstruksi_2_min: 0.497,
        konstruksi_3_min: 0.625
    },
    "2941": {
        keterangan: "Hotels, motels, inns and the like",
        konstruksi_1_min: 0.886,
        konstruksi_2_min: 1.329,
        konstruksi_3_min: 1.772
    },
    "2932": {
        keterangan: "Mail Order Houses, online shopping",
        konstruksi_1_min: 1.673,
        konstruksi_2_min: 2.510,
        konstruksi_3_min: 3.346
    }
};

let isGenerated = false;

// Perluasan (Hanya Contoh Rate Minimal, Rate Sebenarnya Bervariasi)
const EXTENSIONS_RATE = {
    TSFWD: 0.500 / 1000, // 0.05 Permil (‰)
    RSMDCC: 0.005 / 1000, // 0.05 Permil (‰)
    OTHERS: 0.005 / 1000, // 0.02 Permil (‰)
};

const EQVET_RATE = {
    DWELLING: 0.00135, // 1.35 Permil (‰)
    NON_DWELLING: 0.00143 // 1.43 Permil (‰)
};

/**
 * Mengambil Rate Kebakaran (OJK) berdasarkan Kode Okupasi dan Kelas Konstruksi.
 * @param {string} okupasiCode - Kode okupasi (misal: "2976").
 * @param {string} konstruksi - Kelas Konstruksi (misal: "1", "2", "3").
 * @returns {number} Rate dalam permil (‰), atau 0 jika tidak ditemukan.
 */
function getRateKebakaran(okupasiCode, konstruksi) {
    const data = OJK_RATE[okupasiCode];
    if (!data) return 0;
    
    switch (konstruksi) {
        case "1": return data.konstruksi_1_min;
        case "2": return data.konstruksi_2_min;
        case "3": return data.konstruksi_3_min;
        default: return 0;
    }
}

/**
 * Format angka menjadi string mata uang Rupiah.
 * @param {number} amount - Nilai numerik.
 * @returns {string} String Rupiah.
 */
function formatRupiah(amount) {
    if (isNaN(amount) || amount === null) return 'Rp 0';
    return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
}

/**
 * Mengisi dropdown Jenis Okupasi berdasarkan data OJK_RATE.
 */
function fillOkupasiDropdown() {
    const select = document.getElementById("jenisOkupasi");
    if (!select) return;

    // Tambahkan opsi default
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Pilih Jenis Okupasi";
    select.appendChild(defaultOption);

    // Isi opsi dari OJK_RATE
    for (const [code, data] of Object.entries(OJK_RATE)) {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = `[${code}] ${data.keterangan}`;
        select.appendChild(option);
    }
}

// Panggil fungsi saat dokumen selesai dimuat (seperti window.onload)
document.addEventListener('DOMContentLoaded', fillOkupasiDropdown);

// --- Total Pertanggungan Auto-Calculation ---
function calculateTotalSum() {
    const building = parseInt(document.getElementById("nilaiBangunan").value) || 0;
    const content = parseInt(document.getElementById("nilaiContent").value) || 0;
    const stock = parseInt(document.getElementById("nilaiStock").value) || 0;
    const machinery = parseInt(document.getElementById("nilaiMesin").value) || 0;
    
    const total = building + content + stock + machinery;
    
    document.getElementById("totalPertanggungan").value = total;
}

// Tambahkan event listener untuk menghitung total saat input berubah
document.querySelectorAll('input[type="number"]').forEach(input => {
    // Hanya tambahkan ke input nilai pertanggungan
    if (input.id.startsWith("nilai")) {
        input.addEventListener('input', calculateTotalSum);
    }
});

/**
 * Menghasilkan estimasi premi properti.
 */
function generateQuote() {
    // 1. Ambil semua input
    const tertanggung = document.getElementById("tertanggung").value;
    const alamat = document.getElementById("alamat").value;
    const okupasiCode = document.getElementById("jenisOkupasi").value;
    const konstruksi = document.getElementById("kelasKonstruksi").value;
    const nilaiBangunan = parseInt(document.getElementById("nilaiBangunan").value) || 0;
    const nilaiContent = parseInt(document.getElementById("nilaiContent").value) || 0;
    const nilaiStock = parseInt(document.getElementById("nilaiStock").value) || 0;
    const nilaiMesin = parseInt(document.getElementById("nilaiMesin").value) || 0;
    const diskonPersen = parseFloat(document.getElementById("diskon").value) || 0;
    const opsi = document.getElementById("opsi").value;
    const totalPertanggungan = nilaiBangunan + nilaiContent + nilaiStock + nilaiMesin;
    
    const okupasiText = okupasiCode ? OJK_RATE[okupasiCode].keterangan : '';

    // 2. Validasi Input
    if (!tertanggung || !alamat || !okupasiCode || totalPertanggungan <= 0 || diskonPersen < 0 || diskonPersen > 15) {
        const myModal = new bootstrap.Modal(document.getElementById("modalValidasi"));
        myModal.show();
        return;
    }

    isGenerated = true;

    // 3. Ambil Rate
    const rateKebakaran_permil = getRateKebakaran(okupasiCode, konstruksi);
    const rateKebakaran = rateKebakaran_permil / 1000; // Rate dalam bentuk desimal

    // Rate perluasan (dalam desimal)
    const rateEQVET = (okupasiCode === "2976") ? EQVET_RATE.DWELLING : EQVET_RATE.NON_DWELLING;
    const rateRSMDCC = EXTENSIONS_RATE.RSMDCC;
    const rateTSFWD = EXTENSIONS_RATE.TSFWD;
    const rateOTHERS = EXTENSIONS_RATE.OTHERS;

    // 4. Perhitungan Premi
    function calculatePremi(baseRate, extensions = []) {
        let premiDasar = totalPertanggungan * baseRate;
        let totalPremiBruto = premiDasar;
        let rows = ``;

        // Baris Premi Dasar (Kebakaran, PAR, atau FLEXAS)
        rows += `
            <tr>
                <td>${baseRate === rateKebakaran ? 'Kebakaran (Standard)' : (baseRate === rateFLEXAS ? 'FLEXAS' : 'PAR')}</td>
                <td>${formatRupiah(totalPertanggungan)}</td>
                <td>x ${(baseRate * 1000).toFixed(4)}‰</td>
                <td>${formatRupiah(premiDasar)}</td>
            </tr>
        `;

        // Baris Perluasan (jika ada)
        extensions.forEach(ext => {
            const extRate = ext.rate;
            const extValue = totalPertanggungan * extRate;
            totalPremiBruto += extValue;
            
            rows += `
                <tr>
                    <td>${ext.name}</td>
                    <td>${formatRupiah(totalPertanggungan)}</td>
                    <td>x ${(extRate * 1000).toFixed(4)}‰</td>
                    <td>${formatRupiah(extValue)}</td>
                </tr>
            `;
        });
        
        // DISKON
        const diskonValue = totalPremiBruto * (diskonPersen / 100);
        const premiSetelahDiskon = totalPremiBruto - diskonValue;

        console.log("Total Premi:", premiSetelahDiskon);

        // ADMIN FEEx
        let adminFee = (premiSetelahDiskon < 6000000) ? 25000 : 35000;
        
        // Tambahkan adminFee EQVET jika ada EQVET
        if (extensions.some(ext => ext.name === "EQVET")) {
            // AdminFee (25.000 atau 35.000 tergantung rateEQVET * totalPertanggungan)
            const adminFeeEQVET = (rateEQVET * totalPertanggungan < 6000000) ? 25000 : 35000;
            adminFee += adminFeeEQVET;
        }
        
        const premiFinal = premiSetelahDiskon + adminFee;

        // Rangkuman
        rows += `
            <tr><th colspan="3">Total Premi Bruto</th><th>${formatRupiah(totalPremiBruto)}</th></tr>
        `;

        // Tampilkan baris diskon **hanya jika diskon > 0**
        if (diskonValue > 0) {
            rows += `
                <tr><td>Diskon ${diskonPersen}%</td><td colspan="2"></td><td>${formatRupiah(diskonValue)}</td></tr>
                <tr><th colspan="3">Premi Setelah Diskon</th><th>${formatRupiah(premiSetelahDiskon)}</th></tr>
            `;
        }

        rows += `
            <tr><td>Admin Fee</td><td colspan="2"></td><td>${formatRupiah(adminFee)}</td></tr>
            <tr><th colspan="3">Total Premi Bayar</th><th>${formatRupiah(premiFinal)}</th></tr>
        `;

        return `<table class="table table-bordered mt-3">
                    <thead><tr><th>Jaminan</th><th>Nilai Pertanggungan</th><th>Rate</th><th>Premi</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>`;
    }

    // 5. Generate Output HTML Header
    let html = `
        <img src="logo.png" alt="BCA Insurance" style="width:300px; margin-bottom:20px;">
        <h3>Estimasi Premi Properti</h3>
        <b>Nama Tertanggung:</b> ${tertanggung}<br>
        <b>Alamat Pertanggungan:</b> ${alamat}<br>
        <b>Jenis Okupasi:</b> ${okupasiText} (Kode: ${okupasiCode})<br>
        <b>Konstruksi:</b> Konstruksi ${konstruksi}<br>        
        <b>Nilai Bangunan:</b> ${formatRupiah(nilaiBangunan)}<br>
        <b>Nilai Content:</b> ${formatRupiah(nilaiContent)}<br>
        <b>Nilai Stock:</b> ${formatRupiah(nilaiStock)}<br>
        <b>Nilai Mesin:</b> ${formatRupiah(nilaiMesin)}<br>
        <b>Total Pertanggungan:</b> ${formatRupiah(totalPertanggungan)}<br>
        <hr>
    `;

    // 6. Generate Tabel Premi Berdasarkan Opsi
    const opsi1_PAR = [{ name: "TSFWD", rate: rateTSFWD }, { name: "RSMDCC", rate: rateRSMDCC }, { name: "OTHERS", rate: rateOTHERS }];
    const opsi2_PAR_TSFWD = [{ name: "RSMDCC", rate: rateRSMDCC }, { name: "OTHERS", rate: rateOTHERS }];
    const opsi3_PAR_EQVET = [{ name: "TSFWD", rate: rateTSFWD }, { name: "RSMDCC", rate: rateRSMDCC }, { name: "OTHERS", rate: rateOTHERS }, { name: "EQVET", rate: rateEQVET }];
    const opsi4_FLEXAS = []; // FLEXAS only

    if (opsi === "1") {
        // PAR, PAR (Exc. TSFWD), PAR + EQVET (Saya asumsikan ini PAR Standar, PAR Exc TSFWD, PAR + EQVET)
        html += `<h5>1. Opsi PAR</h5>` + calculatePremi(rateKebakaran, opsi1_PAR);
        html += `<hr class="my-4"><h5>2. Opsi PAR (Exc. TSFWD)</h5>` + calculatePremi(rateKebakaran, opsi2_PAR_TSFWD);
        html += `<hr class="my-4"><h5>3. Opsi PAR + EQVET</h5>` + calculatePremi(rateKebakaran, opsi3_PAR_EQVET);
        
    } else if (opsi === "2") {
        // FLEXAS, PAR, PAR (Exc. TSFWD), PAR + EQVET
        html += `<h5>1. Opsi FLEXAS Only</h5>` + calculatePremi(rateKebakaran, opsi4_FLEXAS);
        html += `<hr class="my-4"><h5>2. Opsi PAR</h5>` + calculatePremi(rateKebakaran, opsi1_PAR);
        html += `<hr class="my-4"><h5>3. Opsi PAR (Exc. TSFWD)</h5>` + calculatePremi(rateKebakaran, opsi2_PAR_TSFWD);
        html += `<hr class="my-4"><h5>4. Opsi PAR + EQVET</h5>` + calculatePremi(rateKebakaran, opsi3_PAR_EQVET);
    }

    html += generateNoteProperti();

    document.getElementById("result").innerHTML = html;
}

// Catatan Kaki Properti yang disesuaikan
function generateNoteProperti() {
    // cek apakah okupasi adalah dwelling atau bukan
    const okupasiCode = document.getElementById("jenisOkupasi").value;
    const isDwelling = (okupasiCode === "2976");

    // jika dwelling, deductible = 'nil'
    const deductible = isDwelling ? 'nil' : '10% dari jumlah klaim yang dapat disetujui atau 0.1% dari nilai pertanggungan, mana yang lebih besar';

    return `
    <h3>Catatan Penting</h3>
    <div style="font-size:14px; line-height:1.5; margin-top:10px">

        <b>Note:</b> Perhitungan tersebut merupakan estimasi. Rate dan T&C dapat berubah sesuai dengan hasil akseptasi dari Analis kami.
        <br><br>

        <b>Detail Coverage:</b>
        <ul>
            <li><b>FLEXAS</b> : Kebakaran (Fire), Sambaran Petir (Lightning), Ledakan (Explosion), Kejatuhan Pesawat Terbang (Aircraft Damage), dan Asap (Smoke)</li>
            <li><b>RSMDCC</b> : Kerusuhan (Riot), Pemogokan (Strike), Perbuatan Jahat (Malicious Damage), Huru-Hara (Civil Commotion)</li>
            <li><b>TSFWD</b> : Angin Topan (Typhoon), Badai (Storm), Banjir (Flood), dan Kerusakan Akibat Air (Water Damage)</li>
            <li><b>EQVET</b> : Gempa Bumi (Earthquake), Letusan Gunung Berapi (Volcano Eruption), dan Tsunami</li>
            <li><b>OTHER</b> : Pencurian</li>
        </ul>

        <b>Deductible:</b>
        <ul>
            <li><b>Fire, Lightning, Explosion, Falling of Aircraft, Smoke</b> : ${deductible}</li>
            <li><b>Typhoon, Storm, Flood, Water Damage</b> : 10% dari jumlah klaim yang dapat disetujui, minimum IDR 10,000,000 per kejadian</li>
            <li><b>Riot, Strike, Malicious Damage</b> : 10% dari jumlah klaim yang dapat disetujui, minimum IDR 10,000,000 per kejadian</li>
            <li><b>Civil Commotion</b> : 15% dari jumlah klaim yang dapat disetujui, minimum IDR 15,000,000 per kejadian</li>
            <li><b>Others</b> : IDR 2,500,000 per kejadian</li>
            <li><b>Gempa Bumi, Letusan Gunung Berapi, Tsunami</b> : 2.5% dari Total Nilai Pertanggungan per kejadian</li>
        </ul>

    </div>
    `;
}

// Fungsi savePDF tidak berubah, karena menggunakan html2canvas dan jsPDF.
async function savePDF() {
    // ... (Logika savePDF yang sudah Anda berikan)
    if (!isGenerated) {
        const modalGenerate = new bootstrap.Modal(document.getElementById("modalBelumGenerate"));
        modalGenerate.show();
        return;
    }

    const element = document.getElementById("result");
    if (!element) {
        alert("Tidak ada data untuk dicetak.");
        return;
    }

    const {
        jsPDF
    } = window.jspdf;

    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth - 40; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 20;

    pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeight + 20;
        pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }

    const tertanggung = document.getElementById("tertanggung").value || "Penawaran";
    pdf.save(`SmartQuote_${tertanggung.replace(/\s/g, '_')}.pdf`);
}