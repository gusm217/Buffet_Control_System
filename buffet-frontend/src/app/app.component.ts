import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { WeightScaleComponent } from './weight-scale/weight-scale.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
	constructor() {
		console.log('AppComponent initialized');
	}

	ngOnInit(){}

  title = 'buffet-frontend';
}
