import { DynamicModule } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Type } from "class-transformer";
import { Environment } from "src/common/enum/environment.enum";
import { ConnectionOptions } from "typeorm";
import { parse } from 'pg-connection-string';

export const DatabaseProvide: DynamicModule = TypeOrmModule.forRootAsync({
    inject : [ConfigService],
    async useFactory (config: ConfigService){
        const environment = config.get('NODE_ENV') !== Environment.Production;
        const databaseUrl = config.get<string>('DATABASE_URL');
        


         if (databaseUrl) {

            const parsed = parse(databaseUrl);
            
            return {
                type: 'postgres',
                host: parsed.host || 'localhost',
                port: parseInt(parsed.port || '5432'),
                username: parsed.user || 'postgres',
                password: parsed.password || '',
                database: parsed.database || 'constructora',
                ssl: { rejectUnauthorized: false }, // SSL obligatorio en Render
                autoLoadEntities: true,
                synchronize: true, //false en produccion
                logging: true,
                extra: {
                    max: 20,
                    connectionTimeoutMillis: 10000,
                },
            };
        } 

        else {

            
            return {
                type: 'postgres',
                host: config.get('DB_HOST') || 'localhost',
                port: +(config.get('DB_PORT') || 5432),
                database: config.get<string>('DB_NAME') || 'postgres',
                username: config.get<string>('DB_USERNAME') || 'postgres',
                password: config.get('DB_PASSWORD') || '1234',
                autoLoadEntities: true,
                synchronize: true, // true para desarrollo
                logging: true,
                ssl: false,
            };
        }
    },
});