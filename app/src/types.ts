export type PaperSize = 'A4' | 'F4'; // A4 (210x297mm) or Folio/F4 (215x330mm)

export type DocumentType = 'official_letter' | 'sk' | 'letter_of_assignment' | 'free_text';

export interface InstitutionInfo {
  yayasan: string;
  schoolName: string;
  subDistrict: string;
  address: string;
  showLogo: boolean;
  logoUrl: string;
  showCornerGeometry?: boolean;
}

export interface DocumentInfo {
  type: string;
  title: string;
  number: string;
  subjectTitle: string;
  subject: string;
  signeeTitle: string;
}

export interface KonsideranItem {
  id: string;
  text: string;
}

export interface Konsideran {
  menimbang: KonsideranItem[];
  mengingat: KonsideranItem[];
  memperhatikan: KonsideranItem[];
}

export interface DiktumItem {
  id: string;
  label: string; // e.g. "PERTAMA", "KEDUA"
  content: string;
}

export interface ClosingInfo {
  city: string;
  date: string;
  signeeRole: string;
  signeeName: string;
  signeeNip?: string;
  secondarySignee?: {
    enabled: boolean;
    role: string;
    name: string;
    nip?: string;
  };
}

export interface SignatoryPreset {
  id: string;
  role: string;
  name: string;
  nip?: string;
  description?: string;
}

export interface KeyValueItem {
  id: string;
  label: string;
  value: string;
}

export interface OfficialLetterData {
  letterNumber: string;
  attachment: string; // e.g. "-" or "1 (satu) Berkas"
  regarding: string; // Hal / Perihal
  recipient: string; // Yth. Bapak/Ibu Orang Tua Siswa
  recipientAddress: string; // di Tempat
  openingGreeting: string; // Assalamu'alaikum Wr. Wb. / Dengan hormat,
  openingParagraph: string;
  details: KeyValueItem[]; // Hari, Tanggal, Pukul, Tempat, Acara
  closingParagraph: string;
  closingGreeting: string; // Wassalamu'alaikum Wr. Wb. / Hormat kami,
  tembusan: string[];
}

export interface FreeTextData {
  title: string; // Judul Surat (Opsional)
  letterNumber: string; // Nomor Surat (Opsional)
  rawText: string; // Teks bebas yang otomatis dirapikan oleh aplikasi
}

export interface Lampiran1Data {
  enabled: boolean;
  title: string;
  subtitle: string;
  documentNumber: string;
  heading: string[];
  headers: string[];
  rows: string[][];
}

export interface Lampiran2Data {
  enabled: boolean;
  title: string;
  subtitle: string;
  documentNumber: string;
  heading: string[];
  headers: string[];
  rows: string[][];
  notes: string[];
}

export interface FormatSettings {
  paperSize: PaperSize; // 'A4' or 'F4' (Folio)
  fontFamily: 'font-tnr' | 'font-arial' | 'font-bookman';
  fontSize: string; // Default '12pt'
  lineHeight: string; // Default '1.3'
  marginTopMm: number; // Default 20
  marginBottomMm: number; // Default 20
  marginLeftMm: number; // Default 25
  marginRightMm: number; // Default 20
  showStampPlaceholder: boolean;
  textAlign?: 'justify' | 'left';
}

export interface SchoolDocument {
  id: string;
  name: string;
  docType: DocumentType; // 'official_letter' | 'sk' | 'letter_of_assignment' | 'free_text'
  updatedAt: string;
  institution: InstitutionInfo;
  documentInfo: DocumentInfo;
  officialLetter: OfficialLetterData;
  freeText: FreeTextData;
  konsideran: Konsideran;
  diktum: DiktumItem[];
  closing: ClosingInfo;
  lampiran1: Lampiran1Data;
  lampiran2: Lampiran2Data;
  formatSettings: FormatSettings;
}
