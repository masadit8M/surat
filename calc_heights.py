# Calculate exact heights in mm
# 1 pt = 0.352778 mm
# 1 px (96 DPI) = 0.264583 mm

def calc_text_height(text, width_mm, font_pt, line_spacing=1.25):
    # approximate characters per line for Times New Roman
    # at 10pt, average char width is ~2.2mm
    char_width_mm = font_pt * 0.22
    chars_per_line = int(width_mm / char_width_mm)
    lines = (len(text) // chars_per_line) + 1
    line_height_mm = font_pt * 0.3528 * line_spacing
    return lines * line_height_mm

print("Calculated element heights:")
# Page width: 210mm, Left: 20mm, Right: 15mm => Content width: 175mm
# Konsideran right column width: 175 - 35 = 140mm
mengingat_list = [
    "Undang-undang RI Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional.",
    "Undang-undang Nomor 14 Tahun 2005 tentang Guru dan Dosen.",
    "Peraturan Pemerintah RI Nomor 19 Tahun 2005 tentang Standar Nasional Pendidikan.",
    "Peraturan Pemerintah RI Nomor 74 Tahun 2008 tentang Guru.",
    "Permendiknas Nomor 24 Tahun 2006 tentang Pelaksanaan Standar Isi dan Standar Kompetensi Kelulusan.",
    "Permendiknas Nomor 22 Tahun 2006 dan Nomor 23 Tahun 2006.",
    "Permendiknas Nomor 19 Tahun 2007 tentang Standar Pengelolaan.",
    "Permendiknas Nomor 41 Tahun 2007 tentang Standar Proses.",
    "Keputusan Menteri Negara Pendayagunaan Aparatur Negara Nomor 84 Tahun 1993 tentang Jabatan Fungsional Guru dan Angka Kreditnya.",
    "Surat Keputusan bersama Menteri Pendidikan dan Kebudayaan dan Kepala Badan Administrasi Kepegawaian Negara Nomor 0433/P/1993 dan Nomor 25 Tahun 1993 tentang Petunjuk Pelaksanaan Jabatan Fungsional Guru dan Angka Kreditnya."
]

total_mengingat = sum([calc_text_height(m, 140, 10, 1.25) + 1.2 for m in mengingat_list])
print("Mengingat total mm:", total_mengingat)
