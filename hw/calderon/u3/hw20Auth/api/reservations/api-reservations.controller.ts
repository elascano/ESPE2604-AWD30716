import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
} from "@nestjs/common";
import { ApiReservationsService } from "./api-reservations.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";

@Controller("api/v1/reservations")
export class ApiReservationsController {
  constructor(private readonly apiReservationsService: ApiReservationsService) {}

  @Post()
  @HttpCode(201)
  create(@Headers("x-user-id") userId: string, @Body() dto: CreateReservationDto) {
    return this.apiReservationsService.create(userId, dto);
  }

  @Get()
  findAll(@Headers("x-user-id") userId: string) {
    return this.apiReservationsService.findAll(userId);
  }

  @Put(":reservationId")
  updatePut(
    @Headers("x-user-id") userId: string,
    @Param("reservationId") reservationId: string,
    @Body() dto: UpdateReservationDto,
  ) {
    return this.apiReservationsService.update(userId, reservationId, dto);
  }

  @Patch(":reservationId")
  updatePatch(
    @Headers("x-user-id") userId: string,
    @Param("reservationId") reservationId: string,
    @Body() dto: UpdateReservationDto,
  ) {
    return this.apiReservationsService.update(userId, reservationId, dto);
  }

  @Delete(":reservationId")
  @HttpCode(204)
  remove(@Headers("x-user-id") userId: string, @Param("reservationId") reservationId: string) {
    return this.apiReservationsService.remove(userId, reservationId);
  }
}
