import { Module } from "@nestjs/common";
import { ApiReservationsController } from "./api-reservations.controller";
import { ApiReservationsService } from "./api-reservations.service";

@Module({
  controllers: [ApiReservationsController],
  providers: [ApiReservationsService],
})
export class ApiReservationsModule {}
