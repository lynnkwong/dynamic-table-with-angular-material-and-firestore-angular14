import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ProductElement } from './data-model';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private _firestore: AngularFirestore) {}

  getAllData(collection: string) {
    return this._firestore
      .collection<ProductElement>(collection)
      .valueChanges();
  }

  addData(collection: string, doc_id: string, document: { [id: string]: any }) {
    return this._firestore.collection(collection).doc(doc_id).set(document);
  }

  updateData(
    collection: string,
    doc_id: string,
    document: { [id: string]: any }
  ) {
    return this._firestore.collection(collection).doc(doc_id).update(document);
  }

  deleteData(collection: string, doc_id: string) {
    return this._firestore.collection(collection).doc(String(doc_id)).delete();
  }
}
