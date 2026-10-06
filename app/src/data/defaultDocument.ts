import { SchoolDocument, SignatoryPreset } from '../types';

export const officialSignatoryPresets: SignatoryPreset[] = [
  {
    id: 'kepala-tk',
    role: 'Kepala TK ISLAM PLUS ARJUNA',
    name: 'TITIN HAMIDAH, S.Pd',
    nip: '',
    description: 'Kepala Sekolah TK Islam Plus Arjuna',
  },
  {
    id: 'ketua-yayasan',
    role: 'Ketua Yayasan',
    name: 'H. ARJUNA CENDEKIA, M.Pd',
    nip: '',
    description: 'Ketua Yayasan Arjuna Cendekia',
  },
  {
    id: 'sekretaris-yayasan',
    role: 'Sekretaris Yayasan',
    name: 'M. RIDWAN, S.Kom',
    nip: '',
    description: 'Sekretaris Yayasan Arjuna Cendekia',
  },
  {
    id: 'bendahara-yayasan',
    role: 'Bendahara Yayasan',
    name: 'NURUL HIDAYATI, S.E',
    nip: '',
    description: 'Bendahara Yayasan Arjuna Cendekia',
  },
  {
    id: 'guru-dwi',
    role: 'Guru Kelas / Koordinator Kurikulum',
    name: 'DWI RETNO SETYORINI',
    nip: '',
    description: 'Guru TK Islam Plus Arjuna',
  },
  {
    id: 'guru-merinda',
    role: 'Guru Kelas / Koordinator Kesiswaan',
    name: 'MERINDA EKA E.',
    nip: '',
    description: 'Guru TK Islam Plus Arjuna',
  },
];

// 1. Template SK Pembagian Tugas Mengajar (Bawaan Resmi dari Word Referensi)
export const initialSKPembagianTugas: SchoolDocument = {
  id: 'sk-pembagian-tugas-2026-2027',
  name: 'SK Pembagian Tugas Mengajar 2026/2027',
  docType: 'sk',
  updatedAt: new Date().toISOString(),
  institution: {
    yayasan: 'YAYASAN ARJUNA CENDEKIA',
    schoolName: 'TK ISLAM PLUS ARJUNA',
    subDistrict: 'KEC. BLIMBING KEL. PURWANTORO KOTA MALANG',
    address: 'Sekretariat : Jl. Citandui 15 B Malang Kodepos 65116 Telp. (0341) 4371932',
    showLogo: true,
    logoUrl: '/logo.png',
    showCornerGeometry: true,
  },
  documentInfo: {
    type: 'SK',
    title: 'SURAT KEPUTUSAN',
    number: 'Nomor : 01.013/TK-IPA/PTM/VII/2026',
    subjectTitle: 'TENTANG',
    subject: 'PEMBAGIAN TUGAS GURU DALAM PROSES BELAJAR MENGAJAR TAHUN PELAJARAN 2026/2027',
    signeeTitle: 'KEPALA TK ISLAM PLUS ARJUNA',
  },
  officialLetter: {
    letterNumber: '01.013/TK-IPA/VII/2026',
    attachment: '-',
    regarding: 'Pembagian Tugas Mengajar',
    recipient: 'Bapak/Ibu Pendidik dan Tenaga Kependidikan',
    recipientAddress: 'di Tempat',
    openingGreeting: 'Assalamu\'alaikum Warahmatullahi Wabarakatuh,',
    openingParagraph: 'Dengan ini disampaikan penugasan mengajar...',
    details: [],
    closingParagraph: 'Demikian untuk dilaksanakan dengan penuh tanggung jawab.',
    closingGreeting: 'Wassalamu\'alaikum Warahmatullahi Wabarakatuh,',
    tembusan: ['Ketua Yayasan Arjuna Cendekia', 'Arsip'],
  },
  freeText: {
    title: 'SURAT PEMBERITAHUAN',
    letterNumber: 'Nomor : 01.013/TK-IPA/VII/2026',
    rawText: 'Dengan ini kami sampaikan informasi penting terkait agenda pembelajaran tahun ajaran 2026/2027.\n\nSeluruh pendidik diharapkan hadir tepat waktu dan mempersiapkan administrasi pembelajaran secara lengkap.\n\nDemikian pemberitahuan ini kami sampaikan untuk menjadi perhatian.',
  },
  konsideran: {
    menimbang: [
      {
        id: 'menimbang-1',
        text: 'Bahwa dalam rangka memperlancar pelaksanaan Proses Belajar Mengajar atau Proses Bimbingan Konseling di TK ISLAM PLUS ARJUNA, perlu menetapkan pembagian tugas.',
      },
      {
        id: 'menimbang-2',
        text: 'Bahwa berdasarkan pertimbangan sebagaimana dimaksud pada butir a di atas, maka perlu menetapkan Keputusan Kepala TK ISLAM PLUS ARJUNA.',
      },
    ],
    mengingat: [
      {
        id: 'mengingat-1',
        text: 'Undang-undang RI Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional.',
      },
      {
        id: 'mengingat-2',
        text: 'Undang-undang Nomor 14 Tahun 2005 tentang Guru dan Dosen.',
      },
      {
        id: 'mengingat-3',
        text: 'Peraturan Pemerintah RI Nomor 19 Tahun 2005 tentang Standar Nasional Pendidikan.',
      },
      {
        id: 'mengingat-4',
        text: 'Peraturan Pemerintah RI Nomor 74 Tahun 2008 tentang Guru.',
      },
      {
        id: 'mengingat-5',
        text: 'Permendiknas Nomor 24 Tahun 2006 tentang Pelaksanaan Standar Isi dan Standar Kompetensi Kelulusan.',
      },
      {
        id: 'mengingat-6',
        text: 'Permendiknas Nomor 22 Tahun 2006 dan Nomor 23 Tahun 2006.',
      },
      {
        id: 'mengingat-7',
        text: 'Permendiknas Nomor 19 Tahun 2007 tentang Standar Pengelolaan.',
      },
      {
        id: 'mengingat-8',
        text: 'Permendiknas Nomor 41 Tahun 2007 tentang Standar Proses.',
      },
      {
        id: 'mengingat-9',
        text: 'Keputusan Menteri Negara Pendayagunaan Aparatur Negara Nomor 84 Tahun 1993 tentang Jabatan Fungsional Guru dan Angka Kreditnya.',
      },
      {
        id: 'mengingat-10',
        text: 'Surat Keputusan bersama Menteri Pendidikan dan Kebudayaan dan Kepala Badan Administrasi Kepegawaian Negara Nomor 0433/P/1993 dan Nomor 25 Tahun 1993 tentang Petunjuk Pelaksanaan Jabatan Fungsional Guru dan Angka Kreditnya.',
      },
    ],
    memperhatikan: [
      {
        id: 'memperhatikan-1',
        text: 'Rapat Pembagian Tugas Guru Tahun Ajaran 2026/2027 TK ISLAM PLUS ARJUNA.',
      },
    ],
  },
  diktum: [
    {
      id: 'diktum-1',
      label: 'PERTAMA',
      content:
        'Pembagian tugas guru dalam proses Belajar Mengajar pada tahun pelajaran 2026/2027 sebagaimana tersebut pada lampiran I.',
    },
    {
      id: 'diktum-2',
      label: 'KEDUA',
      content: 'Pembagian Jadwal Mengajar seperti tersebut pada lampiran II.',
    },
    {
      id: 'diktum-3',
      label: 'KETIGA',
      content:
        'Segala biaya yang timbul akibat pelaksanaan keputusan dibebankan pada Anggaran Belanja Sekolah.',
    },
    {
      id: 'diktum-4',
      label: 'KEEMPAT',
      content:
        'Apabila dikemudian hari terdapat kekeliruan dalam surat keputusan ini, akan diadakan pembetulan sebagaimana mestinya.',
    },
    {
      id: 'diktum-5',
      label: 'KELIMA',
      content: 'Keputusan ini mulai berlaku sejak tanggal ditetapkan.',
    },
  ],
  closing: {
    city: 'Malang',
    date: '01 Juli 2026',
    signeeRole: 'Kepala TK ISLAM PLUS ARJUNA',
    signeeName: 'TITIN HAMIDAH, S.Pd',
    signeeNip: '',
  },
  lampiran1: {
    enabled: true,
    title: 'LAMPIRAN 1',
    subtitle: 'Surat Keputusan Kepala TK Islam Plus Arjuna',
    documentNumber: 'Nomor : 01.013/TK-IPA/PTM/VII/2026',
    heading: ['PEMBAGIAN TUGAS / JADWAL MENGAJAR', 'TK ISLAM PLUS ARJUNA', 'TAHUN AJARAN 2026/2027'],
    headers: ['NO', 'HARI', 'NAMA GURU', 'KEGIATAN PEMBELAJARAN', 'JPM', 'KELOMPOK'],
    rows: [
      [
        '1.',
        'SELASA',
        'GURU A : DWI RETNO SETYORINI\nGURU B : MERINDA EKA E.',
        'I. KEGIATAN AWAL (30 MNT): AGAMA, SIKAP PERILAKU\nII. KEGIATAN INTI (60 MNT): BAHASA, KOGNITIF, FISIK MOTORIK\nIII. KEGIATAN AKHIR (30 MNT): SENI',
        '3',
        'A & B',
      ],
      [
        '2.',
        'RABU',
        'GURU A : DWI RETNO SETYORINI\nGURU B : MERINDA EKA E.',
        'I. KEGIATAN AWAL (30 MNT): AGAMA, SIKAP PERILAKU\nII. KEGIATAN INTI (60 MNT): BAHASA, KOGNITIF, FISIK MOTORIK\nIII. KEGIATAN AKHIR (30 MNT): SENI',
        '3',
        'A & B',
      ],
      [
        '3.',
        'KAMIS',
        'GURU A : DWI RETNO SETYORINI\nGURU B : MERINDA EKA E.',
        'I. KEGIATAN AWAL (30 MNT): AGAMA, SIKAP PERILAKU\nII. KEGIATAN INTI (60 MNT): BAHASA, KOGNITIF, FISIK MOTORIK\nIII. KEGIATAN AKHIR (30 MNT): SENI',
        '3',
        'A & B',
      ],
      [
        '4.',
        'JUMAT',
        'GURU A : DWI RETNO SETYORINI\nGURU B : MERINDA EKA E.',
        'I. KEGIATAN AWAL (30 MNT): AGAMA, SIKAP PERILAKU\nII. KEGIATAN INTI (60 MNT): BAHASA, KOGNITIF, FISIK MOTORIK\nIII. KEGIATAN AKHIR (30 MNT): SENI',
        '3',
        'A & B',
      ],
      [
        '5.',
        'SABTU',
        'GURU A : DWI RETNO SETYORINI\nGURU B : MERINDA EKA E.',
        'I. KEGIATAN AWAL (30 MNT): AGAMA, SIKAP PERILAKU\nII. KEGIATAN INTI (60 MNT): BAHASA, KOGNITIF, FISIK MOTORIK\nIII. KEGIATAN AKHIR (30 MNT): SENI',
        '3',
        'A & B',
      ],
    ],
  },
  lampiran2: {
    enabled: true,
    title: 'LAMPIRAN 2',
    subtitle: 'Surat Keputusan Kepala TK Islam Plus Arjuna',
    documentNumber: 'Nomor : 01.013/TK-IPA/PTM/VII/2026',
    heading: ['PEMBAGIAN TUGAS / JADWAL MENGAJAR', 'TK ISLAM PLUS ARJUNA', 'TAHUN AJARAN 2026/2027'],
    headers: ['NO', 'NAMA / NUPTK', 'JABATAN', 'KELAS', 'JUMLAH SISWA', 'JUMLAH JAM', 'BIDANG STUDI / TUGAS'],
    rows: [
      ['1.', 'GURU B : DWI RETNO SETYORINI', 'GURU TK', 'B', 'L = 4, P = 4', '30 JPM', 'GURU KELAS'],
      ['2.', 'GURU A : MERINDA EKA E.', 'GURU TK', 'A', 'L = 2, P = 3', '30 JPM', 'GURU KELAS'],
    ],
    notes: [
      '30 menit berbanding 1 jam pelajaran',
      'Pembiasaan awal sebelum kegiatan, selama 30 menit',
      'Jadi jumlah jam pelajaran per hari sama dengan 5 jam pelajaran',
    ],
  },
  formatSettings: {
    paperSize: 'A4',
    fontFamily: 'font-tnr',
    fontSize: '12pt', // Wajib 12pt standar kedinasan
    lineHeight: '1.25',
    marginTopMm: 10.5,
    marginBottomMm: 10.5,
    marginLeftMm: 20,
    marginRightMm: 15,
    showStampPlaceholder: true,
    textAlign: 'justify',
  },
};

// 2. Template Surat Resmi / Surat Dinas (Undangan Wali Murid)
export const templateSuratUndangan: SchoolDocument = {
  ...initialSKPembagianTugas,
  id: 'template-undangan-wali-murid',
  name: 'Surat Undangan Pertemuan Wali Murid',
  docType: 'official_letter',
  updatedAt: new Date().toISOString(),
  officialLetter: {
    letterNumber: '025/TK-IPA/UND/X/2026',
    attachment: '-',
    regarding: 'Undangan Pertemuan Wali Murid',
    recipient: 'Bapak/Ibu Orang Tua / Wali Murid TK Islam Plus Arjuna',
    recipientAddress: 'di Tempat',
    openingGreeting: 'Assalamu\'alaikum Warahmatullahi Wabarakatuh,',
    openingParagraph:
      'Puji syukur senantiasa kita panjatkan ke hadirat Allah SWT atas limpahan rahmat, taufik, serta hidayah-Nya. Shalawat dan salam semoga senantiasa tercurahkan kepada junjungan kita Nabi Muhammad SAW.\n\nSehubungan dengan pelaksanaan evaluasi program belajar mengajar semester ganjil Tahun Pelajaran 2026/2027 serta pengenalan program parenting islami, kami mengundang Bapak/Ibu Wali Murid untuk hadir dalam kegiatan yang akan diselenggarakan pada:',
    details: [
      { id: 'd-1', label: 'Hari / Tanggal', value: 'Sabtu, 17 Oktober 2026' },
      { id: 'd-2', label: 'Waktu', value: '08.00 WIB s.d. 10.30 WIB' },
      { id: 'd-3', label: 'Tempat', value: 'Aula TK Islam Plus Arjuna, Malang' },
      { id: 'd-4', label: 'Agenda', value: 'Sosialisasi Evaluasi Belajar & Parenting Islami' },
    ],
    closingParagraph:
      'Mengingat sangat pentingnya agenda tersebut bagi perkembangan ananda tercinta, kami sangat mengharapkan kehadiran Bapak/Ibu tepat pada waktunya.\n\nDemikian surat undangan ini kami sampaikan. Atas perhatian, kerja sama, dan kehadiran Bapak/Ibu, kami haturkan terima kasih.',
    closingGreeting: 'Wassalamu\'alaikum Warahmatullahi Wabarakatuh,',
    tembusan: ['Ketua Yayasan Arjuna Cendekia', 'Arsip Sekolah'],
  },
  closing: {
    city: 'Malang',
    date: '10 Oktober 2026',
    signeeRole: 'Kepala TK ISLAM PLUS ARJUNA',
    signeeName: 'TITIN HAMIDAH, S.Pd',
    signeeNip: '',
  },
  lampiran1: { ...initialSKPembagianTugas.lampiran1, enabled: false },
  lampiran2: { ...initialSKPembagianTugas.lampiran2, enabled: false },
  formatSettings: {
    paperSize: 'A4',
    fontFamily: 'font-tnr',
    fontSize: '12pt',
    lineHeight: '1.3',
    marginTopMm: 20,
    marginBottomMm: 20,
    marginLeftMm: 25,
    marginRightMm: 20,
    showStampPlaceholder: true,
    textAlign: 'justify',
  },
};

// 3. Template Surat Tugas Guru
export const templateSuratTugas: SchoolDocument = {
  ...initialSKPembagianTugas,
  id: 'template-surat-tugas',
  name: 'Surat Tugas Pelatihan / Workshop',
  docType: 'official_letter',
  updatedAt: new Date().toISOString(),
  officialLetter: {
    letterNumber: '042/ST/TK-IPA/X/2026',
    attachment: '1 (satu) Berkas Jadwal',
    regarding: 'Surat Tugas Mengikuti Workshop Pembelajaran PAUD',
    recipient: 'Nama Guru / Pendidik yang Ditugaskan',
    recipientAddress: 'di Tempat',
    openingGreeting: 'Assalamu\'alaikum Warahmatullahi Wabarakatuh,',
    openingParagraph:
      'Yang bertanda tangan di bawah ini, Kepala TK Islam Plus Arjuna Malang memberikan tugas kedinasan kepada pendidik di bawah ini untuk mengikuti Pelatihan Pengembangan Media Pembelajaran Interaktif PAUD:\n\n1. Nama : DWI RETNO SETYORINI\n   Jabatan : Guru Kelas / Pendidik\n\n2. Nama : MERINDA EKA E.\n   Jabatan : Guru Kelas / Pendidik\n\nAdapun pelaksanaan kegiatan tersebut adalah sebagai berikut:',
    details: [
      { id: 't-1', label: 'Hari / Tanggal', value: 'Senin - Selasa, 19 - 20 Oktober 2026' },
      { id: 't-2', label: 'Waktu', value: '08.00 WIB s.d. 15.00 WIB' },
      { id: 't-3', label: 'Tempat', value: 'Pusat Belajar Guru (PBG) Kota Malang' },
      { id: 't-4', label: 'Kegiatan', value: 'Workshop Kurikulum Merdeka & Media Kreatif PAUD' },
    ],
    closingParagraph:
      'Demikian surat tugas ini dibuat agar dapat dilaksanakan dengan penuh tanggung jawab dan melaporkan hasil kegiatan setelah selesai.',
    closingGreeting: 'Wassalamu\'alaikum Warahmatullahi Wabarakatuh,',
    tembusan: ['Ketua Yayasan Arjuna Cendekia', 'Yang Bersangkutan'],
  },
  closing: {
    city: 'Malang',
    date: '12 Oktober 2026',
    signeeRole: 'Kepala TK ISLAM PLUS ARJUNA',
    signeeName: 'TITIN HAMIDAH, S.Pd',
    signeeNip: '',
  },
  lampiran1: { ...initialSKPembagianTugas.lampiran1, enabled: false },
  lampiran2: { ...initialSKPembagianTugas.lampiran2, enabled: false },
  formatSettings: {
    paperSize: 'A4',
    fontFamily: 'font-tnr',
    fontSize: '12pt',
    lineHeight: '1.3',
    marginTopMm: 20,
    marginBottomMm: 20,
    marginLeftMm: 25,
    marginRightMm: 20,
    showStampPlaceholder: true,
    textAlign: 'justify',
  },
};

// 4. Template Surat Keterangan Aktif
export const templateSuratKeterangan: SchoolDocument = {
  ...initialSKPembagianTugas,
  id: 'template-surat-keterangan',
  name: 'Surat Keterangan Aktif Mengajar',
  docType: 'official_letter',
  updatedAt: new Date().toISOString(),
  officialLetter: {
    letterNumber: '088/KET/TK-IPA/X/2026',
    attachment: '-',
    regarding: 'Surat Keterangan Aktif Bertugas',
    recipient: 'Pihak yang Berkepentingan',
    recipientAddress: 'di Tempat',
    openingGreeting: 'Dengan hormat,',
    openingParagraph:
      'Yang bertanda tangan di bawah ini Kepala TK Islam Plus Arjuna Malang, dengan ini menerangkan dengan sebenarnya bahwa:\n\nNama Lengkap : DWI RETNO SETYORINI\nTempat/Tgl Lahir : Malang, 14 Mei 1992\nJabatan : Pendidik / Guru Kelas\nAlamat : Kota Malang\n\nAdalah benar-benar tenaga pendidik tetap yang aktif mengajar di TK Islam Plus Arjuna Kota Malang terhitung sejak Tahun Pelajaran 2021/2022 sampai dengan saat ini serta memiliki dedikasi dan kinerja yang sangat baik.',
    details: [],
    closingParagraph:
      'Demikian surat keterangan ini kami buat dengan sebenarnya dan diberikan kepada yang bersangkutan untuk dapat dipergunakan sebagaimana mestinya.',
    closingGreeting: 'Hormat kami,',
    tembusan: ['Arsip Sekolah'],
  },
  closing: {
    city: 'Malang',
    date: '14 Oktober 2026',
    signeeRole: 'Kepala TK ISLAM PLUS ARJUNA',
    signeeName: 'TITIN HAMIDAH, S.Pd',
    signeeNip: '',
  },
  lampiran1: { ...initialSKPembagianTugas.lampiran1, enabled: false },
  lampiran2: { ...initialSKPembagianTugas.lampiran2, enabled: false },
  formatSettings: {
    paperSize: 'A4',
    fontFamily: 'font-tnr',
    fontSize: '12pt',
    lineHeight: '1.3',
    marginTopMm: 20,
    marginBottomMm: 20,
    marginLeftMm: 25,
    marginRightMm: 20,
    showStampPlaceholder: true,
    textAlign: 'justify',
  },
};

// 5. Template Surat Bebas / Kosong (Admin Bisa Paste Apa Saja)
export const templateSuratBebas: SchoolDocument = {
  ...initialSKPembagianTugas,
  id: 'template-surat-bebas',
  name: 'Surat Bebas / Format Fleksibel',
  docType: 'free_text',
  updatedAt: new Date().toISOString(),
  freeText: {
    title: 'SURAT PEMBERITAHUAN',
    letterNumber: 'Nomor : 099/YAC/X/2026',
    rawText:
      'Dengan ini diberitahukan kepada seluruh keluarga besar Yayasan Arjuna Cendekia dan unit pendidikan di bawah naungannya bahwa dalam rangka peringatan Hari Besar Islam, seluruh kegiatan belajar mengajar pada hari Senin diliburkan.\n\nKegiatan pembelajaran aktif akan kembali berjalan normal seperti biasa pada hari Selasa.\n\nDemikian pemberitahuan ini disampaikan agar dapat menjadi perhatian bersama. Atas kerja sama dan pengertian Bapak/Ibu sekalian kami ucapkan terima kasih.',
  },
  closing: {
    city: 'Malang',
    date: '15 Oktober 2026',
    signeeRole: 'Ketua Yayasan',
    signeeName: 'H. ARJUNA CENDEKIA, M.Pd',
    signeeNip: '',
  },
  lampiran1: { ...initialSKPembagianTugas.lampiran1, enabled: false },
  lampiran2: { ...initialSKPembagianTugas.lampiran2, enabled: false },
  formatSettings: {
    paperSize: 'A4',
    fontFamily: 'font-tnr',
    fontSize: '12pt',
    lineHeight: '1.3',
    marginTopMm: 20,
    marginBottomMm: 20,
    marginLeftMm: 25,
    marginRightMm: 20,
    showStampPlaceholder: true,
    textAlign: 'justify',
  },
};

export const documentPresetsList = [
  {
    id: 'sk-pembagian-tugas',
    title: 'SK Pembagian Tugas Mengajar',
    badge: 'Surat Keputusan (3 Hal)',
    type: 'sk',
    data: initialSKPembagianTugas,
  },
  {
    id: 'surat-undangan',
    title: 'Surat Undangan Wali Murid',
    badge: 'Surat Resmi Dinas',
    type: 'official_letter',
    data: templateSuratUndangan,
  },
  {
    id: 'surat-tugas',
    title: 'Surat Tugas Pendidik / Guru',
    badge: 'Surat Tugas',
    type: 'official_letter',
    data: templateSuratTugas,
  },
  {
    id: 'surat-keterangan',
    title: 'Surat Keterangan Aktif Mengajar',
    badge: 'Surat Keterangan',
    type: 'official_letter',
    data: templateSuratKeterangan,
  },
  {
    id: 'surat-bebas',
    title: 'Surat Bebas / Format Otomatis',
    badge: 'Input Bebas / Paste',
    type: 'free_text',
    data: templateSuratBebas,
  },
];
