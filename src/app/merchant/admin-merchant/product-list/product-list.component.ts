import { Component, OnInit } from '@angular/core';
import { TempService } from 'src/app/temp.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {

  dtOptions: any = {};
  products: any = [
    // {
    //   id: 1,
    //   name: 'Product 1',
    //   price: 100,
    //   quantity: 10,
    //   description: 'Description 1',
    //   image: 'assets/images/product-1.jpg',
    //   category: 'Category 1',
    //   // availability: '20/12/2023 - 20/1/2024',
    //   status: 'Active',
    // },
    // {
    //   id: 2,
    //   name: 'Product 2',
    //   price: 200,
    //   quantity: 20,
    //   description: 'Description 2',
    //   image: 'assets/images/product-2.jpg',
    //   category: 'Category 2',
    //   // availability: '20/12/2023 - 20/1/2024',
    //   status: 'Active',
    // },
    // {
    //   id: 3,
    //   name: 'Product 3',
    //   price: 300,
    //   quantity: 30,
    //   description: 'Description 3',
    //   image: 'assets/images/product-3.jpg',
    //   category: 'Category 3',
    //   // availability: '20/12/2023 - 20/1/2024',
    //   status: 'Active',
    // },
    // {
    //   id: 4,
    //   name: 'Product 4',
    //   price: 400,
    //   quantity: 40,
    //   description: 'Description 4',
    //   image: 'assets/images/product-4.jpg',
    //   category: 'Category 4',
    //   availability: '20/12/2023 - 20/1/2024',
    //   status: 'Active',
    // },
    // {
    //   id: 5,
    //   name: 'Product 5',
    //   price: 500,
    //   quantity: 50,
    //   description: 'Description 5',
    //   image: 'assets/images/product-5.jpg',
    //   category: 'Category 5',
    //   availability: '20/12/2023 - 20/1/2024',
    //   status: 'Active',
    // },
  ];
  constructor(private tempService: TempService, private router: Router) {
    this.products = this.tempService.getProducts();
    console.log('all prod: ', this.products);
  }

  ngOnInit(): void {
    //the datatable
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      lengthMenu: [5, 15, 5, 5, 5, 10, 5],
      responsive: true,
      dom: 'Bfrtip',
      buttons: [
        'copy',
        'print',
        'excel',
        'pdf',
        {
          text: 'New Product',
          key: '1',
          className:
            'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
          action: (e, dt, node, config) => {
            this.router.navigate(['/merchant/add-product']);
          },
        },
      ],
    };
  }
}
