import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);


//conectar con el frontend
 app.enableCors({
    origin: [
      'http://localhost:3000',    //  dev server
      'http://localhost:3001',    // alternativo
      'http://127.0.0.1:3000',    // localhost alternativo
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });




app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true, // Valida si pasan más información de la necesaria 
    forbidNonWhitelisted: true,
  }));

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const port = 3001;
  await app.listen(AppModule.port || port);
  console.log(`Backend http://localhost:${port}`);
  console.log(`localhost:3000, localhost:3001`);
  
}
bootstrap();
