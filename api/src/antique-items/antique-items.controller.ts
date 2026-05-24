import { Controller, Get } from '@nestjs/common';

interface AntiqueItem {
  id: number;
  name: string;
  origin: string;
  year: number;
  priceEur: number;
}

@Controller('antique-items')
export class AntiqueItemsController {
  @Get()
  public findAll(): AntiqueItem[] {
    return [
      {
        id: 1,
        name: '12 Chairs',
        origin: 'Lithuania',
        year: 1890,
        priceEur: 1200,
      },
      {
        id: 2,
        name: 'Oak Table',
        origin: 'Germany',
        year: 1875,
        priceEur: 3500,
      },
      {
        id: 3,
        name: 'Grandfather Clock',
        origin: 'England',
        year: 1860,
        priceEur: 7800,
      },
    ];
  }
}
