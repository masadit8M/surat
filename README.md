# SISTEM GENERATOR DOKUMEN & SURAT DINAS RESMI
## YAYASAN ARJUNA CENDEKIA — TK ISLAM PLUS ARJUNA

Aplikasi web modern untuk manajemen, penulisan, dan penerbitan Surat Keputusan (SK) serta segala jenis surat dinas/resmi dengan standardisasi tata naskah dinas otomatis:

- **Kop Surat & Logo Resmi Terkunci**: Menggunakan Logo Yayasan Arjuna Cendekia, ornamen geometri biru resmi di sudut kiri atas, teks yayasan & sekolah proporsional, serta garis ganda dinas (*double line*) yang rapat di bawah kop tanpa celah berlebih. Kop otomatis muncul di setiap halaman dokumen.
- **Standar Tipografi & Spasi Baku**:
  - **Font Size 12pt (Times New Roman)** di seluruh bagian surat.
  - **Spasi Baris 1.0 Single Line Spacing (240 twips)**: Standar resmi Tata Naskah Dinas, lega, proporsional, dan nyaman dibaca (tidak berhimpitan/terlalu rapat).
  - Paragraf rata kanan-kiri (*Justify*) dengan indentasi alinea standar.
- **Pilihan Ukuran Kertas 1-Klik**: Dukungan penuh untuk **A4 (210 x 297 mm)** dan **Folio / F4 (215 x 330 mm / 8.5" x 13")**.
- **Pilihan Penandatangan Fleksibel**: Dropdown preset penandatangan (Kepala TK — Titin Hamidah, S.Pd, Ketua Yayasan — H. Arjuna Cendekia, M.Pd, Sekretaris, Bendahara, atau kustom).
- **Mode Fleksibel untuk Admin**:
  1. **Surat Keputusan (SK)**: Konsideran (Menimbang, Mengingat, Memperhatikan), Diktum (Memutuskan, Menetapkan), Lampiran 1 (Jadwal Mengajar), dan Lampiran 2 (Pembagian Kelas & Beban Mengajar) yang otomatis pas **tepat 3 halaman**.
  2. **Surat Resmi Dinas**: Surat Undangan Pertemuan Wali Murid, Surat Tugas Pelatihan/Workshop, Surat Keterangan Aktif Bertugas, dan Surat Edaran.
  3. **Surat Bebas / Format Otomatis**: Admin cukup mengetik atau *paste* teks surat apa saja; aplikasi otomatis merapikan margin, spasi, alinea, dan menyematkan kop serta tanda tangan.
- **Dukungan Export Lengkap**:
  - 📥 **Export Word (.docx)**: Hasil berkas Microsoft Word rapi yang dapat diedit kembali.
  - 🖨️ **Cetak Langsung / PDF**: Presisi tinggi dengan print dialog browser.
  - 💾 **Simpan Draf Otomatis**: Progres tersimpan di memori browser (*localStorage*).

---

## 🛠️ Menjalankan Aplikasi di Komputer Lokal

1. Buka folder aplikasi:
   ```bash
   cd app
   ```
2. Pasang dependensi (jika baru pertama kali):
   ```bash
   npm install
   ```
3. Jalankan server lokal:
   ```bash
   npm run dev
   ```
4. Buka di browser:
   ```
   http://localhost:5173/
   ```

---

## 📦 Struktur Repositori

```
├── app/                      # Source code aplikasi web (React, Vite, Tailwind CSS, docx)
│   ├── public/               # Asset logo Yayasan, geometri kop, dan favicon
│   ├── src/
│   │   ├── components/       # Komponen UI (KopSurat, A4Preview, AdminEditor, Navbar, SignatureBlock)
│   │   ├── data/             # Template surat bawaan & preset penandatangan
│   │   ├── utils/            # Generator Word (.docx) & PDF export
│   │   ├── App.tsx           # State manajemen utama & auto-save
│   │   └── types.ts          # Definisi tipe dokumen & tata naskah
├── .gitignore                # File filter git (mengabaikan node_modules, dist, dll.)
└── README.md                 # Dokumentasi resmi sistem
```

---

## 🚀 Deploy Online (Vercel / Netlify)

Aplikasi ini adalah *Single Page Application (SPA)* berbasis React/Vite yang dapat di-deploy secara instan dan 100% gratis ke:
- **Vercel**: Hubungkan repository GitHub ini (`masadit8M/surat`) ke akun Vercel, tetapkan root directory ke `app`, dan klik **Deploy**.
- **Netlify**: Hubungkan repository ke Netlify dengan build command `npm run build` dan publish directory `app/dist`.
