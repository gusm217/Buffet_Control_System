import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { WeightUpdateDto } from '../dto/weight-update.dto';
import { OrderDto } from '../dto/order.dto';
import { Subscription } from 'rxjs';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-weight-scale',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './weight-scale.component.html',
  styleUrl: './weight-scale.component.css'
})
export class WeightScaleComponent implements OnInit, OnDestroy {
	currentWeight: number = 0;
	lastOrder: OrderDto | null = null;
	private weightSubscription: Subscription | null = null;
	private orderSubscription: Subscription | null = null;

	constructor(private WebsocketService: WebsocketService) {}

	ngOnInit() {
		console.log('ngOnInit initialized');
		this.WebsocketService.connect();
		this.weightSubscription = this.WebsocketService.onWeightUpdate().subscribe((data: WeightUpdateDto) => {
			this.currentWeight = data.weight;
		});
		this.orderSubscription = this.WebsocketService.onOrderCreated().subscribe((data: OrderDto) => {
			this.lastOrder = data;
		});
		this.WebsocketService.requestCurrentWeight();
	}

	ngOnDestroy() {
		this.weightSubscription?.unsubscribe();
		this.orderSubscription?.unsubscribe();
		this.WebsocketService.disconnect();
	}
}
