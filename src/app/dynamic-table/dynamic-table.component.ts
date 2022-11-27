import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FirestoreService } from '../firestore.service';
import { ProductElement, ProductDataSource } from '../data-model';

const PRODUCT_DATA: ProductElement[] = [
  { id: 1, name: 'Lenovo ThinkPad', brand: 'Lenovo', price: 500, quantity: 6 },
  { id: 2, name: 'Lenovo IdeaPad', brand: 'Lenovo', price: 1300, quantity: 3 },
  { id: 3, name: 'Dell Latitude', brand: 'Dell', price: 1600, quantity: 8 },
  { id: 4, name: 'Dell Inspiron', brand: 'Dell', price: 1500, quantity: 10 },
  {
    id: 5,
    name: 'Apple MacBook Air',
    brand: 'Apple',
    price: 1200,
    quantity: 9,
  },
  {
    id: 6,
    name: 'Apple MacBook Pro',
    brand: 'Apple',
    price: 2000,
    quantity: 7,
  },
];

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css'],
})
export class DynamicTableComponent implements AfterViewInit {
  columns = [
    {
      columnDef: 'id',
      header: 'No.',
      type: 'number',
      cell: (element: ProductElement) => `${element.id}`,
    },
    {
      columnDef: 'name',
      header: 'Name',
      type: 'text',
      cell: (element: ProductElement) => `${element.name}`,
    },
    {
      columnDef: 'brand',
      header: 'Brand',
      type: 'text',
      cell: (element: ProductElement) => `${element.brand}`,
    },
    {
      columnDef: 'price',
      header: 'Price',
      type: 'number',
      cell: (element: ProductElement) => `${element.price}`,
    },
    {
      columnDef: 'quantity',
      header: 'Quantity',
      type: 'number',
      cell: (element: ProductElement) => `${element.quantity}`,
    },
  ];

  numericColumns: string[] = ['id', 'price', 'quantity'];
  displayedColumns = this.columns.map((c) => c.columnDef);

  dataSource = new ProductDataSource(this._firestore);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  activeRow?: ProductElement;

  constructor(
    private _firestore: FirestoreService,
    private _cd: ChangeDetectorRef
  ) {
    this.displayedColumns.push('action');
  }

  ngAfterViewInit() {}

  applyFilter(event: Event) {}

  upsertRow(row: ProductElement) {
    if (row.isNew) {
      delete row.isNew;
      this._firestore.addData('laptops', String(row.id), row).finally(() => {
        this.cancelEditing();
        console.log(`Doc with id = ${row.id} is updated.`);
      });
    }

    this._firestore.updateData('laptops', String(row.id), row).finally(() => {
      this.cancelEditing();
      console.log(`Doc with id = ${row.id} is updated.`);
    });
  }

  cancelEditing() {
    if (this.activeRow?.isNew) {
      this.dataSource.removeRow(this.activeRow);
    }

    this.activeRow = undefined;
  }

  deleteRow(row: any) {
    this._firestore
      .deleteData('laptops', row.id)
      .finally(() => console.log(`Doc with id = ${row.id} is deleted.`));
  }

  addNewRow() {
    this.activeRow = {
      id: this.dataSource.getNewId(),
      name: undefined,
      brand: undefined,
      price: 0,
      quantity: 1,
      isNew: true,
    };
    this.dataSource.addRow(this.activeRow);
  }
}
