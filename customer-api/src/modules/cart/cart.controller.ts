import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/src/libs/guards/auth.guard'; import type { GuardedApiResponse } from '@/src/utils/types/api.type';
import { AddCartItemDto, UpdateCartItemDto } from './cart.dto'; import { CartService } from './cart.service';
@Controller('cart') @UseGuards(AuthGuard)
export class CartController { constructor(private readonly carts: CartService) {} @Get() get(@Req() r: GuardedApiResponse){return this.carts.read(r.user.id)} @Post('items') add(@Req() r: GuardedApiResponse,@Body() d:AddCartItemDto){return this.carts.add(r.user.id,d)} @Put('items/:id') update(@Req() r:GuardedApiResponse,@Param('id')id:string,@Body()d:UpdateCartItemDto){return this.carts.update(r.user.id,id,d.quantity)} @Delete('items/:id') remove(@Req()r:GuardedApiResponse,@Param('id')id:string){return this.carts.remove(r.user.id,id)} @Delete() clear(@Req()r:GuardedApiResponse){return this.carts.clear(r.user.id)} }
