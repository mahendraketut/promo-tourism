import { Injectable } from '@angular/core';
import * as jspdf from 'jspdf';
import domtoimage from 'dom-to-image';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  public exportToPdf(elementId: string, fileName: string): void {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found!');
      return;
    }

    domtoimage.toPng(element).then((dataUrl) => {
      const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
      pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 0); // Adjust width and height as needed

      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);

      // Open the PDF in a custom-sized popup
      const popupWidth = 600;
      const popupHeight = 800;
      const popup = window.open(
        '',
        '_blank',
        `width=${popupWidth}, height=${popupHeight}`
      );
      if (popup) {
        popup.document.write(
          '<iframe width="100%" height="100%" src="' +
            url +
            '" frameborder="0"></iframe>'
        );
      } else {
        console.error('Failed to open the PDF in a popup.');
      }

      // Optionally, you can close the popup after a certain delay
      // setTimeout(() => {
      //   if (popup) {
      //     popup.close();
      //   }
      // }, 5000); // Adjust the delay as needed

      pdf.save(fileName + '.pdf');
    });
  }
}
