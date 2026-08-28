import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '@/src/libs/models/entities/customer/Customer.entity';
import { ProductsModule } from '@/src/modules/products/products.module';
import { CategoriesModule } from '@/src/modules/categories/categories.module';
import { OrdersModule } from '@/src/modules/orders/orders.module';
import { AssistantController } from '@/src/modules/assistant/controllers/assistant.controller';
import { AssistantService } from '@/src/modules/assistant/services/assistant.service';
import { AssistantToolsService } from '@/src/modules/assistant/services/assistantTools.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity]),
    ProductsModule,
    CategoriesModule,
    OrdersModule,
  ],
  controllers: [AssistantController],
  providers: [AssistantService, AssistantToolsService],
})
export class AssistantModule {}
