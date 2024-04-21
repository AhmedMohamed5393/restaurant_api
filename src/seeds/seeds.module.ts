import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { ProductsSeed } from './products.seeds';

@Module({
    imports: [CommandModule],
    providers: [ProductsSeed],
    exports: [ProductsSeed],
})
export class SeedsModule {}
