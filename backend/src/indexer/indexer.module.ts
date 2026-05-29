import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { IndexerService } from './indexer.service';
import { IndexerWorker } from './indexer.worker';
import { ReindexWorkerService } from './reindex.worker';
import { BackfillWorkerService } from './backfill.worker';
import { ReconciliationService } from './reconciliation.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RpcModule } from '../rpc/rpc.module';
import { EventsModule } from '../events/events.module';
import { CacheModule } from '../cache/cache.module';
import { MetricsModule } from '../metrics/metrics.module';
import { ClaimSummaryCacheService } from '../claims/services/claim-summary-cache.service';
import { VotePubSubService } from '../graphql/vote-pubsub.service';

@Module({
  imports: [
    PrismaModule,
    RpcModule,
    ConfigModule,
    ScheduleModule.forRoot(),
    EventsModule,
    CacheModule,
    MetricsModule,
  ],
  providers: [
    IndexerService,
    IndexerWorker,
    ReindexWorkerService,
    BackfillWorkerService,
    ReconciliationService,
    ClaimSummaryCacheService,
    VotePubSubService,
  ],
  exports: [IndexerService, ReconciliationService],
})
export class IndexerModule {}
