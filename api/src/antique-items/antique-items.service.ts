import { Injectable } from '@nestjs/common';
import { IAntiqueItem } from './antique-item.model';

@Injectable()
export class AntiqueItemsService {
  private antiqueItems = [
    {
      id: '8e8d5d2f-8b11-4c3a-8f55-8e0f1c2c8a01',
      name: '12 Chairs',
      origin: 'Lithuania',
      year: 1890,
      priceEur: 1200,
    },
    {
      id: 'd4f1a0c8-6c44-4f30-9c40-8f64f4a1f102',
      name: 'Oak Table',
      origin: 'Germany',
      year: 1875,
      priceEur: 3500,
    },
    {
      id: '2c6a5c3b-3f35-48d8-a20f-7b6c7e7c5a03',
      name: 'Grandfather Clock',
      origin: 'England',
      year: 1860,
      priceEur: 7800,
    },
  ];

  findAll(): IAntiqueItem[] {
    return this.antiqueItems;
  }

  findOne(id: string): IAntiqueItem | undefined {
    return this.antiqueItems.find((item) => item.id === id);
  }
}
