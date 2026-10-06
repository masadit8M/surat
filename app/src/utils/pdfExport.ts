import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SchoolDocument } from '../types';

export async function exportToPdf(doc: SchoolDocument, onProgress?: (msg: string) => void) {
  const printRoot = document.getElementById('print-root');
  const originalDisplay = printRoot?.style.display || '';
  const originalPos = printRoot?.style.position || '';
  const originalLeft = printRoot?.style.left || '';
  const originalTop = printRoot?.style.top || '';
  const originalZIndex = printRoot?.style.zIndex || '';

  const paperSize = doc.formatSettings.paperSize || 'A4';
  const isF4 = paperSize === 'F4';
  const paperWidthMm = isF4 ? 215 : 210;
  const paperHeightMm = isF4 ? 330 : 297;

  try {
    if (onProgress) onProgress('Menyiapkan format kertas ' + paperSize + '...');

    // Temporarily make print-root active in DOM for high-precision capture
    if (printRoot) {
      printRoot.style.display = 'block';
      printRoot.style.position = 'fixed';
      printRoot.style.left = '0';
      printRoot.style.top = '0';
      printRoot.style.width = `${paperWidthMm}mm`;
      printRoot.style.zIndex = '-9999';
      printRoot.style.pointerEvents = 'none';
      printRoot.style.backgroundColor = '#ffffff';
    }

    // Short tick to allow browser layout calculation
    await new Promise((r) => setTimeout(r, 100));

    // Target the print-root elements or the preview elements
    const pageElements = document.querySelectorAll<HTMLElement>('#print-root .print-page');
    let targets: HTMLElement[] = Array.from(pageElements);

    // If print-root isn't rendered or is empty, fallback to screen preview pages
    if (targets.length === 0) {
      const screenPages = document.querySelectorAll<HTMLElement>('.paper-a4, .paper-f4, .a4-page, .folio-page');
      targets = Array.from(screenPages);
    }

    if (targets.length === 0) {
      throw new Error('Tidak ada halaman dokumen yang ditemukan.');
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: isF4 ? [215, 330] : 'a4',
      compress: true,
    });

    for (let i = 0; i < targets.length; i++) {
      if (onProgress) onProgress(`Memproses halaman ${i + 1} dari ${targets.length}...`);

      const target = targets[i];

      // Capture element with sharp 2x scaling
      const canvas = await html2canvas(target, {
        scale: 2, // 2x scale for sharp text and crisp logos
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: isF4 ? 1050 : 1000,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        pdf.addPage(isF4 ? [215, 330] : 'a4', 'portrait');
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, paperWidthMm, paperHeightMm, undefined, 'FAST');
    }

    if (onProgress) onProgress('Menyimpan berkas PDF...');
    const safeFilename = (doc.name || 'Surat_Resmi').replace(/[^a-zA-Z0-9_\-]/g, '_');
    pdf.save(`${safeFilename}_${paperSize}.pdf`);

    return true;
  } catch (err) {
    console.error('Error generating PDF:', err);
    throw err;
  } finally {
    if (printRoot) {
      printRoot.style.display = originalDisplay;
      printRoot.style.position = originalPos;
      printRoot.style.left = originalLeft;
      printRoot.style.top = originalTop;
      printRoot.style.width = '';
      printRoot.style.zIndex = originalZIndex;
      printRoot.style.pointerEvents = '';
      printRoot.style.backgroundColor = '';
    }
  }
}
