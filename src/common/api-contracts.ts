export interface WeightUpdate {
	scaleId: string;
	weight: number;
}

export interface OrderCreated {
	id: string;
	weight: number;
	price: number;
	type: 'per-kilo' | 'all-you-can-eat';
}

export interface ApiResponse<T> {
	data: T | null;
	message: string;
}
