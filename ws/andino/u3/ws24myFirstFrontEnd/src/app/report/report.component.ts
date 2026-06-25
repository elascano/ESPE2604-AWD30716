import { Component, OnInit, ElementRef, ViewChild, inject } from '@angular/core';
import { DishService } from '../services/dish.service';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  standalone: false,
})
export class ReportComponent implements OnInit {
  @ViewChild('reportContent', { static: true })
  private readonly reportContent!: ElementRef<HTMLElement>;

  protected readonly dishService = inject(DishService);

  ngOnInit(): void {
    this.dishService.fetchDishes();
  }

  handlePrint(): void {
    window.print();
  }

  handleDownloadPDF(): void {
    const element = this.reportContent.nativeElement;
    html2pdf()
      .set({
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: 'dish-report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' },
      })
      .from(element)
      .save();
  }
}
