import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { CustomersModule } from "./customers/customers.module";
import { MenuModule } from "./menu/menu.module";
import { OrdersModule } from "./orders/orders.module";
import { CartModule } from "./cart/cart.module";
import { InventoryModule } from "./inventory/inventory.module";
import { IngredientsModule } from "./ingredients/ingredients.module";
import { PrrismaModule } from './prrisma/prrisma.module';
import { SurveysModule } from "./surveys/surveys.module";
import { ApiAuthModule } from "./api/auth/api-auth.module";
import { ApiProfileModule } from "./api/profile/api-profile.module";
import { ApiMenuModule } from "./api/menu/api-menu.module";
import { ApiCartModule } from "./api/cart/api-cart.module";
import { ApiCheckoutModule } from "./api/checkout/api-checkout.module";
import { ApiOrdersModule } from "./api/orders/api-orders.module";
import { ApiReservationsModule } from "./api/reservations/api-reservations.module";
import { ApiSurveysModule } from "./api/surveys/api-surveys.module";
import { ApiAdminModule } from "./api/admin/api-admin.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CustomersModule,
    MenuModule,
    OrdersModule,
    CartModule,
    InventoryModule,
    IngredientsModule,
    PrrismaModule,
    SurveysModule,
    ApiAuthModule,
    ApiProfileModule,
    ApiMenuModule,
    ApiCartModule,
    ApiCheckoutModule,
    ApiOrdersModule,
    ApiReservationsModule,
    ApiSurveysModule,
    ApiAdminModule,
  ],
})
export class AppModule {}
