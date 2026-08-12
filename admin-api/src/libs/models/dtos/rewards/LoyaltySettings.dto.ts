import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { RewardsGrantedOn } from '@/src/utils/enums/RewardEnums';
export class LoyaltySettingsDto {
  @IsBoolean() pointsEnabled: boolean;
  @IsNumber({ maxDecimalPlaces: 4 }) @Min(0) pointsPerCurrencyUnit: number;
  @IsNumber({ maxDecimalPlaces: 4 }) @Min(0.0001) pointsPerCurrencyRedemptionUnit: number;
  @IsInt() @Min(0) minimumPointsToRedeem: number;
  @IsNumber() @Min(0) @Max(100) maximumPointsRedemptionPercent: number;
  @IsOptional() @IsInt() @Min(1) pointsExpirationDays: number | null;
  @IsBoolean() cashbackEnabled: boolean;
  @IsNumber() @Min(0) @Max(100) cashbackPercent: number;
  @IsNumber() @Min(0) cashbackMinimumOrderAmount: number;
  @IsOptional() @IsNumber() @Min(0) cashbackMaximumPerOrder: number | null;
  @IsOptional() @IsInt() @Min(1) cashbackExpirationDays: number | null;
  @IsNumber() @Min(0) @Max(100) maximumCashbackUsePercent: number;
  @IsEnum(RewardsGrantedOn) rewardsGrantedOn: RewardsGrantedOn;
}
