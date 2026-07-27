import { Module } from '@nestjs/common';
import { PrrismaService } from './prrisma.service';

@Module({
  providers: [PrrismaService]
})
export class PrrismaModule {}
