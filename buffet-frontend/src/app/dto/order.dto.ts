export interface OrderDto {
	id: string;
	weight: number;
	price: number;
	type: 'per-kilo' | 'all-you-can-eat';
}
