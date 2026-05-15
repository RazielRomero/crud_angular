import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-product-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.css']
})
export class ProductManagerComponent implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);

  productForm!: FormGroup;


  products: Product[] = [];

  isEditing = false;
  currentProductId: string | null = null;

  ngOnInit(): void {
    this.initForm();


    if (isPlatformBrowser(this.platformId)) {
      this.loadProducts();
    }
  }

  loadProducts(): void {

    setTimeout(() => {
      this.productService.getProducts().subscribe({
        next: (data) => {
          console.log('Productos cargados desde Firebase:', data);
          this.products = data;
        },
        error: (err) => {
          console.error('Error al obtener productos:', err);
        }
      });
    }, 100);
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const productData: Product = this.productForm.value;

    if (this.isEditing && this.currentProductId) {
      this.productService.updateProduct(this.currentProductId, productData)
        .then(() => {
          console.log('Producto actualizado');
          this.resetForm();
        })
        .catch(err => console.error(err));
    } else {
      this.productService.addProduct(productData)
        .then(() => {
          console.log('Producto agregado');
          this.resetForm();
        })
        .catch(err => console.error(err));
    }
  }

  editProduct(product: Product): void {
    this.isEditing = true;
    this.currentProductId = product.id!;
    this.productForm.patchValue(product);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteProduct(id: string): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.deleteProduct(id)
        .then(() => console.log('Producto eliminado'))
        .catch(err => console.error(err));
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentProductId = null;
    this.productForm.reset({ price: 0, stock: 0 });
  }
}
