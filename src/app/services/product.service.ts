import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, updateDoc, query, orderBy, CollectionReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private firestore = inject(Firestore);
  private collectionName = 'products';

  private productsRef = collection(this.firestore, this.collectionName) as CollectionReference<Product>;

  getProducts(): Observable<Product[]> {
    const q = query(this.productsRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  addProduct(product: Product) {
    product.createdAt = Date.now();
    return addDoc(this.productsRef, product);
  }

  updateProduct(id: string, product: Partial<Product>) {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return updateDoc(docRef, product);
  }

  deleteProduct(id: string) {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return deleteDoc(docRef);
  }
}
