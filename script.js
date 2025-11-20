// Struktur rate OJK berdasarkan tabel yang Anda berikan
const OJK_RATE = {
    COMPREHENSIVE: {
        "Non Truck": [{
                max: 125000000,
                w1: 3.82,
                w2: 3.26,
                w3: 2.53
            },
            {
                max: 200000000,
                w1: 2.67,
                w2: 2.47,
                w3: 2.69
            },
            {
                max: 400000000,
                w1: 2.18,
                w2: 2.08,
                w3: 1.79
            },
            {
                max: 800000000,
                w1: 1.20,
                w2: 1.20,
                w3: 1.14
            },
            {
                max: 99999999999,
                w1: 1.05,
                w2: 1.05,
                w3: 1.05
            }
        ],
        "Truck": [{
                max: 99999999999,
                w1: 2.42,
                w2: 2.39,
                w3: 2.23
            } // kategori 6
        ],
        "Bus": [{
                max: 99999999999,
                w1: 1.04,
                w2: 1.04,
                w3: 0.88
            } // kategori 7
        ],
        "Roda 2": [{
                max: 99999999999,
                w1: 3.18,
                w2: 3.18,
                w3: 3.18
            } // kategori 8
        ]
    },

    TLO: {
        "Non Truck": [{
                max: 125000000,
                w1: 0.47,
                w2: 0.65,
                w3: 0.51
            },
            {
                max: 200000000,
                w1: 0.63,
                w2: 0.44,
                w3: 0.44
            },
            {
                max: 400000000,
                w1: 0.41,
                w2: 0.38,
                w3: 0.29
            },
            {
                max: 800000000,
                w1: 0.25,
                w2: 0.25,
                w3: 0.23
            },
            {
                max: 99999999999,
                w1: 0.20,
                w2: 0.20,
                w3: 0.20
            }
        ],
        "Truck": [{
            max: 99999999999,
            w1: 0.88,
            w2: 1.68,
            w3: 0.81
        }],
        "Bus": [{
            max: 99999999999,
            w1: 0.23,
            w2: 0.23,
            w3: 0.18
        }],
        "Roda 2": [{
            max: 99999999999,
            w1: 1.76,
            w2: 1.80,
            w3: 0.67
        }]
    }
};

const EV_RATE = {
    COMPREHENSIVE: {
        "Non Truck": [{
                max: 125000000,
                w1: 4.20,
                w2: 3.59,
                w3: 2.78
            },
            {
                max: 200000000,
                w1: 2.94,
                w2: 2.72,
                w3: 2.96
            },
            {
                max: 400000000,
                w1: 2.40,
                w2: 2.29,
                w3: 1.97
            },
            {
                max: 800000000,
                w1: 1.32,
                w2: 1.32,
                w3: 1.25
            },
            {
                max: 99999999999,
                w1: 1.16,
                w2: 1.16,
                w3: 1.16
            }
        ],
        "Truck": [{
                max: 99999999999,
                w1: 2.67,
                w2: 2.63,
                w3: 2.46
            } // kategori 6
        ],
        "Bus": [{
                max: 99999999999,
                w1: 1.14,
                w2: 1.14,
                w3: 0.97
            } // kategori 7
        ],
        "Roda 2": [{
                max: 99999999999,
                w1: 3.50,
                w2: 3.50,
                w3: 3.50
            } // kategori 8
        ]
    },

    TLO: {
        "Non Truck": [{
                max: 125000000,
                w1: 0.56,
                w2: 0.78,
                w3: 0.56
            },
            {
                max: 200000000,
                w1: 0.69,
                w2: 0.53,
                w3: 0.48
            },
            {
                max: 400000000,
                w1: 0.46,
                w2: 0.42,
                w3: 0.35
            },
            {
                max: 800000000,
                w1: 0.30,
                w2: 0.30,
                w3: 0.27
            },
            {
                max: 99999999999,
                w1: 0.24,
                w2: 0.24,
                w3: 0.24
            }
        ],
        "Truck": [{
            max: 99999999999,
            w1: 1.07,
            w2: 2.02,
            w3: 0.98
        }],
        "Bus": [{
            max: 99999999999,
            w1: 0.29,
            w2: 0.29,
            w3: 0.22
        }],
        "Roda 2": [{
            max: 99999999999,
            w1: 2.11,
            w2: 2.16,
            w3: 0.80
        }]
    }
};

let isGenerated = false;

function getOJKRate(type, jenis, wilayah, harga) {
    const isEV = document.getElementById("isEV").checked;
    const rateTable = isEV ? EV_RATE : OJK_RATE;
    const list = rateTable[type][jenis];

    for (let i of list) {
        if (harga <= i.max) {
            return wilayah == 1 ? i.w1 : wilayah == 2 ? i.w2 : i.w3;
        }
    }
    return 0;
}

function getLoadingRate(tahunKendaraan) {
    const currentYear = new Date().getFullYear();
    const umur = currentYear - tahunKendaraan;

    if (umur <= 5) return 0;

    const tahunLebih = umur - 5;
    return tahunLebih * 0.05; // 5% per tahun
}


function generateQuote() {

    const tertanggung = document.getElementById("tertanggung").value;
    const kendaraan = document.getElementById("namaKendaraan").value;
    const tahun = document.getElementById("tahun").value;
    const jenisKendaraan = document.getElementById("jenisKendaraan").value;
    const wilayah = parseInt(document.getElementById("wilayah").value);
    const tpl = parseInt(document.getElementById("tpl").value || 0);
    const authorizedValue = document.querySelector('input[name="authorized"]:checked').value;
    const diskon = parseInt(document.getElementById("diskon").value || 0);
    const opsi = document.getElementById("opsi").value;
    const harga = parseInt(document.getElementById("harga").value || 0);

    if (!kendaraan || !tahun || !harga) {
        const myModal = new bootstrap.Modal(document.getElementById("modalValidasi"));
        myModal.show();
        return;
    }

    isGenerated = true;

    let html = `
        <img src="logo.png" alt="BCA Insurance" style="width:300px; margin-bottom:20px;">
        <h3>Estimasi Premi Kendaraan Bermotor</h3>

        <span><b>Nama:</b> ${tertanggung}</span><br>
        <span><b>Tipe Kendaraan:</b> ${kendaraan} (${tahun})</span><br>
        <span><b>Harga OTR:</b> Rp ${harga.toLocaleString()}</span><br>
    `;

    // Ambil rate OJK yang benar
    const rateComp = getOJKRate("COMPREHENSIVE", jenisKendaraan, wilayah, harga) / 100;
    const rateTLO = getOJKRate("TLO", jenisKendaraan, wilayah, harga) / 100;

    // TARIF PERLUASAN
    const PERLUASAN = [{
            name: "TSHFL",
            rate: 0.001
        },
        {
            name: "RSCCTS",
            rate: 0.001
        },
        {
            name: "EqVet",
            rate: 0.001
        }
    ];

    function generateComprehensiveTable(perluasan = true) {

        // PREMI DASAR
        let premiDasar = harga * rateComp;

        // LOADING RATE (umur kendaraan > 5 tahun)
        let loadingRate = getLoadingRate(tahun);
        let loadingValue = premiDasar * loadingRate;

        let total = premiDasar + loadingValue;

        let rows = `
            <tr>
                <td>Comprehensive</td>
                <td>Rp ${harga.toLocaleString()}</td>
                <td>x ${(rateComp * 100).toFixed(2)}%</td>
                <td>Rp ${premiDasar.toLocaleString()}</td>
            </tr>
        `;

        // tambah baris loading hanya jika ada loading
        if (loadingValue > 0) {
            rows += `
                <tr>
                    <td>Loading (Umur Kendaraan)</td>
                    <td>${(loadingRate * 100).toFixed(2)}%</td>
                    <td></td>
                    <td>Rp ${loadingValue.toLocaleString()}</td>
                </tr>
            `;
        }

        let info ='';

        // PERLUASAN
        if (perluasan) {
            PERLUASAN.forEach(p => {
                const val = harga * p.rate;
                total += val;
                info = ' + Perluasan';

                rows += `
                <tr><td>${p.name}</td>
                <td>Rp ${harga.toLocaleString()}</td>
                <td>x ${(p.rate*100).toFixed(2)}%</td>
                <td>Rp ${val.toLocaleString()}</td></tr>`;
            });
        }

        // TPL 1%
        let tplVal = tpl * 0.01;
        total += tplVal;
        rows += `
        <tr><td>TPL</td><td>Rp ${tpl.toLocaleString()}</td>
        <td>x 1%</td><td>Rp ${tplVal.toLocaleString()}</td></tr>`;

        // BENGKEL RESMI
        if (authorizedValue === "Yes") {
            let rateAuthorized = 0.0;

            // jika isEV, tarifnya 0.0%
            if (document.getElementById("isEV").checked) {
                rateAuthorized = 1.0;
            } else {
                rateAuthorized = 0.2;
            }

            let authorizedVal = harga * (rateAuthorized / 100);
            total += authorizedVal;

            rows += `
            <tr><td>Bengkel Resmi</td>
            <td>Rp ${harga.toLocaleString()}</td>
            <td>x ${(rateAuthorized).toFixed(2)}%</td>
            <td>Rp ${authorizedVal.toLocaleString()}</td></tr>`;
        }

        // DISKON & ADMIN
        const discountValue = total * (diskon / 100);
        const after = total - discountValue;
        const admin = after < 6000000 ? 25000 : 35000;
        const final = after + admin;

        if (discountValue > 0) {
            rows += `
                <tr><th colspan="3">Total Sebelum Diskon</th><th>Rp ${total.toLocaleString()}</th></tr>
                <tr><td>Diskon ${diskon}%</td><td colspan="2"></td><td>Rp ${discountValue.toLocaleString()}</td></tr>
                <tr><th colspan="3">Setelah Diskon</th><th>Rp ${after.toLocaleString()}</th></tr>
                <tr><td>Admin Fee</td><td colspan="2"></td><td>Rp ${admin.toLocaleString()}</td></tr>
                <tr><th colspan="3">Total Premi</th><th>Rp ${final.toLocaleString()}</th></tr>
            `;
        } else {
            rows += `
                <tr><th colspan="3">Total Sebelum Admin Fee</th><th>Rp ${total.toLocaleString()}</th></tr>
                <tr><td>Admin Fee</td><td colspan="2"></td><td>Rp ${admin.toLocaleString()}</td></tr>
                <tr><th colspan="3">Total Premi</th><th>Rp ${final.toLocaleString()}</th></tr>
            `;
        }

        return `<h3>Opsi: Comprehensive ${info}</h3><table>${rows}</table>`;
    }

    function generateTLOTable() {
        let total = harga * rateTLO;

        let rows = `
            <tr><td>TLO</td><td>Rp ${harga.toLocaleString()}</td>
            <td>x ${(rateTLO*100).toFixed(2)}%</td>
            <td>Rp ${(harga*rateTLO).toLocaleString()}</td></tr>
        `;

        let tplVal = tpl * 0.01;
        total += tplVal;
        rows +=
            `<tr><td>TPL</td><td>Rp ${tpl.toLocaleString()}</td><td>x 1%</td><td>Rp ${(tplVal).toLocaleString()}</td></tr>`;

        const discountValue = total * (diskon / 100);
        const after = total - discountValue;
        const admin = after < 6000000 ? 25000 : 35000;
        const final = after + admin;

        rows += `
            <tr><th colspan="3">Total Sebelum Diskon</th><th>Rp ${total.toLocaleString()}</th></tr>
            <tr><td>Diskon ${diskon}%</td><td colspan="2"></td><td>Rp ${discountValue.toLocaleString()}</td></tr>
            <tr><th colspan="3">Setelah Diskon</th><th>Rp ${after.toLocaleString()}</th></tr>
            <tr><td>Admin Fee</td><td colspan="2"></td><td>Rp ${admin.toLocaleString()}</td></tr>
            <tr><th colspan="3">Total Premi</th><th>Rp ${final.toLocaleString()}</th></tr>
        `;

        return `<h3>Opsi: TLO + TPL</h3><table>${rows}</table>`;
    }

    function generateNote() {
        return `
        <h3>Catatan Penting</h3>
        <div style="font-size:14px; line-height:1.5; margin-top:10px">

            <b>Own Risk (OR)</b> untuk Comprehensive sebesar <b>Rp 300.000 / kejadian</b>.
            <br><br>

            <b>Penjelasan Jaminan:</b>
            <ul>
                <li><b>COMPREHENSIVE</b> : Pengcoveran tabrakan, terbalik, tergelincir, terpelosok, dan kehilangan.</li>
                <li><b>TSHFL</b> (Typhoon, Storm, Hail, Flood, Landslide): Topan, badai, hujan es, banjir, tanah longsor.</li>
                <li><b>RSCCTS</b> (Riots, Strike, Civil Commotion, Terrorism & Sabotage): Kerusuhan, pemogokan, huru-hara, terorisme, dan sabotase.</li>
                <li><b>EQVET</b> (Earth Quake, Volcanic Eruption, Tsunami): Gempa bumi, letusan gunung berapi, dan tsunami.</li>
                <li><b>TPL</b> (Third Party Liability): Tanggung jawab hukum kepada pihak ketiga, 
                    <br>contoh jika ada pihak yang dirugikan dan menuntut, dijamin maksimal <b>Rp 20.000.000</b>.
                </li>
            </ul>

            <b>NOTE:</b>
            <ul>
                <li>Apabila terdapat kerusakan kendaraan sebelumnya, mohon untuk diperbaiki terlebih dahulu sebelum diasuransikan karena <b>kerusakan lama tidak dijamin</b> oleh asuransi.</li>
                <li>Perhitungan ini merupakan <b>estimasi</b> dan dapat berubah sewaktu-waktu sesuai persetujuan Tim Teknik kami.</li>
            </ul>
        </div>
    `;
    }

    // OUTPUT SESUAI OPSI
    if (opsi == 1) {
        html += generateComprehensiveTable(true);
        html += "<br>" + generateComprehensiveTable(false);
    } else if (opsi == 2) {
        html += generateComprehensiveTable(true);
        html += "<br>" + generateComprehensiveTable(false);
        html += "<br>" + generateTLOTable();
    } else {
        html += generateTLOTable();
    }

    html += "<br>" + generateNote();


    document.getElementById("result").innerHTML = html;
}

async function savePDF() {
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

    // Ambil library jsPDF
    const {
        jsPDF
    } = window.jspdf;

    // Gunakan html2canvas untuk screenshot
    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");

    // Buat ukuran PDF A4
    const pdf = new jsPDF("p", "pt", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Hitung scaling proporsional
    const imgWidth = pageWidth - 40; // margin 20 px kiri kanan
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 20;

    // Halaman pertama
    pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Jika tinggi konten lebih dari satu halaman → buat halaman berikutnya
    while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeight + 20;
        pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }

    pdf.save("SmartQuote.pdf");
}