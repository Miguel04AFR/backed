import { Module } from '@nestjs/common';
import { DatabaseProvide } from './database.provider';

@Module({
    imports: [DatabaseProvide],
    exports: [DatabaseProvide],


})
export class DatabaseModule {}
