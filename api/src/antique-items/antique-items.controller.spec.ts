import { Test, TestingModule } from '@nestjs/testing';
import { AntiqueItemsController } from './antique-items.controller';

describe('AntiqueItemsController', () => {
  let controller: AntiqueItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntiqueItemsController],
    }).compile();

    controller = module.get<AntiqueItemsController>(AntiqueItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
