import React from 'react';
import { InstitutionInfo } from '../types';

interface KopSuratProps {
  institution: InstitutionInfo;
  pageNumber?: number;
  className?: string;
  compact?: boolean;
}

export const KopSurat: React.FC<KopSuratProps> = ({
  institution,
  pageNumber = 1,
  className = '',
  compact = false,
}) => {
  const showGeom = institution.showCornerGeometry !== false;

  if (compact) {
    return (
      <header className={`w-full relative select-none ${className}`}>
        {/* Ornamen Garis Miring Geometri Sudut Kiri Atas (Compact Version) */}
        {showGeom && (
          <div className="absolute -top-2.5 -left-2.5 w-24 h-10 pointer-events-none z-0 overflow-hidden">
            <img
              src="/header_corner_geometry.svg"
              alt="Ornamen Garis Miring Kop Yayasan"
              className="w-full h-full object-contain object-left-top"
            />
          </div>
        )}

        <div className="flex items-center relative min-h-[92px] z-10">
          {/* Kolom Kiri: Logo Resmi Yayasan Arjuna Cendekia (Dimensi Proper & Mantap) */}
          <div className="w-24 h-[92px] flex-shrink-0 flex items-center justify-center">
            {institution.showLogo && (
              <img
                src={institution.logoUrl || '/logo.png'}
                alt="Logo Yayasan Arjuna Cendekia"
                className="h-[92px] max-h-[92px] w-auto object-contain drop-shadow-sm"
              />
            )}
          </div>

          {/* Kolom Tengah: Hierarki Teks Kop Surat Resmi (100% Terpusat di Halaman A4) */}
          <div className="flex-1 text-center px-2">
            <p className="text-[10.5pt] font-bold tracking-wide uppercase leading-tight text-black">
              {institution.yayasan}
            </p>
            <h1 className="text-[13.5pt] font-black tracking-wider uppercase leading-none text-black my-0.5">
              {institution.schoolName}
            </h1>
            <p className="text-[9pt] font-bold tracking-wide uppercase leading-tight text-black">
              {institution.subDistrict}
            </p>
            <p className="text-[8pt] font-normal leading-tight text-black mt-0.5">
              {institution.address}
            </p>
          </div>

          {/* Kolom Kanan: Spacer Penyeimbang Simetris */}
          <div className="w-24 flex-shrink-0" aria-hidden="true" />
        </div>

        {/* Garis Pembatas Resmi Kop Surat (Compact) */}
        <div className="kop-separator-compact" />
      </header>
    );
  }

  return (
    <header className={`w-full relative select-none ${className}`}>
      {/* 1. Ornamen Garis Miring Geometri Sudut Kiri Atas (Absolute, tidak menggeser logo atau teks) */}
      {showGeom && (
        <div className="absolute -top-3 -left-3 w-32 h-14 pointer-events-none z-0 overflow-hidden">
          <img
            src="/header_corner_geometry.svg"
            alt="Ornamen Garis Miring Kop Yayasan"
            className="w-full h-full object-contain object-left-top"
          />
        </div>
      )}

      <div className="flex items-center relative min-h-[120px] z-10">
        {/* 2. Kolom Kiri: Logo Resmi Yayasan Arjuna Cendekia (Dimensi Proper, Gagah & Berwibawa) */}
        <div className="w-28 h-[120px] flex-shrink-0 flex items-center justify-center">
          {institution.showLogo && (
            <img
              src={institution.logoUrl || '/logo.png'}
              alt="Logo Yayasan Arjuna Cendekia"
              className="h-[120px] max-h-[120px] w-auto object-contain drop-shadow-sm"
            />
          )}
        </div>

        {/* 3. Kolom Tengah: Hierarki Teks Kop Surat Resmi (100% Terpusat di Tengah Halaman A4) */}
        <div className="flex-1 text-center px-2">
          <p className="text-[12pt] font-bold tracking-wide uppercase leading-tight text-black">
            {institution.yayasan}
          </p>
          <h1 className="text-[15.5pt] font-black tracking-wider uppercase leading-none text-black my-1">
            {institution.schoolName}
          </h1>
          <p className="text-[9.5pt] font-bold tracking-wide uppercase leading-tight text-black">
            {institution.subDistrict}
          </p>
          <p className="text-[8.5pt] font-normal leading-tight text-black mt-0.5">
            {institution.address}
          </p>
        </div>

        {/* 4. Kolom Kanan: Penyeimbang Simetris (Memastikan Teks Tidak Condong ke Kanan) */}
        <div className="w-28 flex-shrink-0" aria-hidden="true" />
      </div>

      {/* Garis Pembatas Resmi Kop Surat (Garis Ganda Pakem Dinas) */}
      <div className="kop-separator" />
    </header>
  );
};
