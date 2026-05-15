import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductManagerComponent } from './components/product-manager/product-manager.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductManagerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('crud-firebase');
}
