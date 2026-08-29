import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/src/libs/models/entities/user/User.entity';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';
import { ProductsModule } from '@/src/modules/product/products.module';
import { OrdersModule } from '@/src/modules/orders/orders.module';
import { CustomersModule } from '@/src/modules/customers/customers.module';
import { InventoryModule } from '@/src/modules/inventory/inventory.module';
import { AssistantController } from '@/src/modules/assistant/controllers/assistant.controller';
import { AssistantService } from '@/src/modules/assistant/services/assistant.service';
import { AssistantToolsService } from '@/src/modules/assistant/services/assistantTools.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProductEntity]),
    ProductsModule,
    OrdersModule,
    CustomersModule,
    InventoryModule,
  ],
  controllers: [AssistantController],
  providers: [AssistantService, AssistantToolsService],
})
export class AssistantModule {}
