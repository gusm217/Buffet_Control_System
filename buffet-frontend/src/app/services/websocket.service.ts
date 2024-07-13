import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { ObjectUnsubscribedError, Observable } from 'rxjs';
import { WeightUpdateDto } from '../dto/weight-update.dto';
import { OrderDto } from '../dto/order.dto';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
	private socket: Socket;

  constructor() {
		this.socket = io('http://localhost:3000');
	}

	connect(): void {
		this.socket.connect();
	}

	disconnect(): void {
		this.socket.disconnect();
	}

	onWeightUpdate(): Observable<WeightUpdateDto> {
		return new Observable<WeightUpdateDto>((observer) => {
			this.socket.on('weightUpdate', (data: WeightUpdateDto) => {
				observer.next(data);
			});
		});
	}

	onOrderCreated(): Observable<OrderDto> {
		return new Observable<OrderDto>((observer) => {
			this.socket.on('orderCreated', (data: OrderDto) => {
				observer.next(data);
			});
		});
	}

	requestCurrentWeight(): void {
		this.socket.emit('requestCurrentWeight');
	}

	onCurrentWeights(): Observable<WeightUpdateDto[]> {
		return new Observable<WeightUpdateDto[]>((observer) => {
			this.socket.on('currentWeights', (data: WeightUpdateDto[]) => {
				observer.next(data);
			});
		});
	}
}
