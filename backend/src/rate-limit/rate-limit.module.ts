import { Module } from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';
import { RateLimitGuard } from './rate-limit.guard';
import { WalletRateLimitGuard } from './wallet-rate-limit.guard';
import { CacheModule } from '../cache/cache.module';
import { RpcModule } from '../rpc/rpc.module';

@Module({
  imports: [CacheModule, RpcModule],
  providers: [RateLimitService, RateLimitGuard, WalletRateLimitGuard],
  exports: [RateLimitService, RateLimitGuard, WalletRateLimitGuard],
})
export class RateLimitModule {}
