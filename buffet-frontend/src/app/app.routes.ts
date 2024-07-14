import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { WeightScaleComponent } from './weight-scale/weight-scale.component';

export const routes: Routes = [
{ path: '', component: WeightScaleComponent },
{ path: 'weight-scale', component: WeightScaleComponent },
];
