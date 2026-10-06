import React from 'react';
import { ClosingInfo } from '../types';

interface SignatureBlockProps {
  closing: ClosingInfo;
  showDate?: boolean;
  showStampPlaceholder?: boolean;
  isOfficialLetter?: boolean; // If true: format 'Malang, 10 Oktober 2026', else 'Ditetapkan di: ...'
  fontSizeClass?: string;
}

export const SignatureBlock: React.FC<SignatureBlockProps> = ({
  closing,
  showDate = false,
  showStampPlaceholder = true,
  isOfficialLetter = false,
  fontSizeClass = 'text-[12pt]',
}) => {
  // Parsing role into clean lines
  const roleTitle = closing.signeeRole || 'Kepala TK Islam Plus Arjuna';
  
  let roleLines: string[] = [];
  if (roleTitle.toLowerCase().startsWith('kepala ')) {
    roleLines = ['Kepala', roleTitle.slice(7).trim()];
  } else if (roleTitle.includes('\n')) {
    roleLines = roleTitle.split('\n').filter(Boolean);
  } else {
    roleLines = [roleTitle];
  }

  return (
    <div className="w-full flex justify-between items-start mt-6 break-inside-avoid">
      {/* Secondary Signatory (e.g. Mengetahui / Disetujui) if enabled */}
      {closing.secondarySignee?.enabled ? (
        <div className="w-64 text-left relative">
          <p className="text-[11pt] font-normal mb-1">Mengetahui,</p>
          <div className="text-[12pt] font-bold leading-tight">
            <p>{closing.secondarySignee.role}</p>
          </div>
          <div className="h-16 flex items-center justify-center relative my-1">
            {showStampPlaceholder && (
              <div className="absolute left-0 w-16 h-16 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-[7.5pt] text-slate-400 select-none print:hidden pointer-events-none">
                Cap / TTD
              </div>
            )}
          </div>
          <div className="text-[12pt] font-bold leading-tight">
            <p className="underline underline-offset-2 font-bold">{closing.secondarySignee.name}</p>
            {closing.secondarySignee.nip && (
              <p className="text-[10pt] font-normal mt-0.5">NIP: {closing.secondarySignee.nip}</p>
            )}
          </div>
        </div>
      ) : (
        <div /> // Empty spacer for flex justify-between
      )}

      {/* Primary Signatory (Right aligned) */}
      <div className="w-72 text-left relative">
        {showDate && closing.city && closing.date && (
          <div className="text-[12pt] leading-snug mb-1">
            {isOfficialLetter ? (
              <p>{closing.city}, {closing.date}</p>
            ) : (
              <>
                <p>Ditetapkan di : {closing.city}</p>
                <p>Pada Tanggal : {closing.date}</p>
              </>
            )}
          </div>
        )}

        <div className={`${fontSizeClass} font-bold leading-tight`}>
          {roleLines.map((line, idx) => (
            <p key={idx} className={idx > 0 && !isOfficialLetter ? 'uppercase' : ''}>
              {line}
            </p>
          ))}
        </div>

        {/* Ruang tanda tangan & cap stempel */}
        <div className="h-16 flex items-center justify-start relative my-1">
          {showStampPlaceholder && (
            <div className="absolute left-4 w-16 h-16 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-[8pt] text-slate-400 select-none print:hidden pointer-events-none">
              Cap / TTD
            </div>
          )}
        </div>

        {/* Nama penandatangan */}
        <div className={`${fontSizeClass} font-bold leading-tight`}>
          <p className="underline underline-offset-2">({closing.signeeName})</p>
          {closing.signeeNip ? (
            <p className="text-[10pt] font-normal mt-0.5">NIP/NUPTK: {closing.signeeNip}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
