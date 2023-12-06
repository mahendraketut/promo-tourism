import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-merchant-review',
  templateUrl: './merchant-review.component.html',
  styleUrls: ['./merchant-review.component.css'],
})
export class MerchantReviewComponent implements OnInit {
  dtOptions: any = {};
  merchants: any[] = [
    {
      id: 'mr347234efnccvsdlkfh9',
      name: 'HELP Merchant Sdn. Bhd.',
      contact: '+608103734748',
      email: 'help@merchant.com',
      description: 'lorem ipsum dolor sit amet',
      status: 'approved',
      license: {
        licenseFile: 'lorem.pdf',
        description: 'lorem ipsum dolor sit amet',
      },
      testimonials: {
        testimonialFile: 'lorem.pdf',
        description: 'lorem ipsum dolor sit amet',
      },
    },
    {
      id: 'mr347234efnccvsdlkfh9',
      name: 'Gloves Merchant Sdn. Bhd.',
      contact: '+608103734748',
      email: 'gloves@merchant.com',
      description: 'lorem ipsum dolor sit amet',
      status: 'pending',
      license: {
        licenseFile: 'lorem.pdf',
        description: 'lorem ipsum dolor sit amet',
      },
      testimonials: {
        testimonialFile: 'lorem.pdf',
        description: 'lorem ipsum dolor sit amet',
      },
    },
    {
      id: 'mr347234efnccvsdlkfh9',
      name: 'Poor Merchant Sdn. Bhd.',
      contact: '+608103734748',
      email: 'poor@merchant.com',
      description: 'lorem ipsum dolor sit amet',
      status: 'pending',
      license: {
        licenseFile: 'lorem.pdf',
        description: 'lorem ipsum dolor sit amet',
      },
      testimonials: {
        testimonialFile: 'lorem.pdf',
        description: 'lorem ipsum dolor sit amet',
      },
    },
  ];
  ngOnInit(): void {
    //the datatable
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      lengthMenu: [5, 15, 5, 5, 5, 10, 10],
      responsive: true,
      dom: 'Bfrtip',
      buttons: ['copy', 'print', 'excel', 'pdf'],
    };
  }
}
