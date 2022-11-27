import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { FirestoreService } from './firestore.service';

export interface ProductElement {
  id: number;
  name: string | undefined;
  brand: string | undefined;
  price: number;
  quantity: number;
  isNew?: boolean;
}

export class ProductDataSource extends DataSource<ProductElement> {
  private _dataStream = new ReplaySubject<ProductElement[]>();
  private _subscription: Subscription;
  private _documents!: ProductElement[];

  constructor(firestore: FirestoreService) {
    super();
    this._subscription = firestore
      .getAllData('laptops')
      .subscribe((documents) => {
        this._documents = documents;
        this.setData();
      });
  }

  connect(): Observable<readonly ProductElement[]> {
    return this._dataStream;
  }

  disconnect() {
    this._subscription.unsubscribe();
  }

  addRow(newRow: ProductElement) {
    if (newRow && !this._documents.find((doc) => doc.id == newRow?.id)) {
      this._documents.push(newRow);
    }
    this.setData();
  }

  removeRow(row: ProductElement) {
    const index = this._documents.findIndex((doc) => (doc.id == row.id));

    if (index > -1) {
      this._documents.splice(index, 1);
    }

    this.setData();
  }

  setData() {
    this._dataStream.next(this._documents);
  }

  getNewId() {
    if (!this._documents.length) {
      return 1;
    }

    const currentIds: number[] = this._documents.map((doc) => doc.id);
    const maxId = Math.max(...currentIds);

    return maxId + 1;
  }
}
