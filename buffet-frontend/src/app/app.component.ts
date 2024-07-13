import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeightScaleComponent } from './weight-scale/weight-scale.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WeightScaleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'buffet-frontend';
}
