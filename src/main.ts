import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);


//conectar con el frontend
if(process.env.NODE_ENV !== 'production'){
 app.enableCors({
    origin: [
      'http://localhost:3000',    //  dev server
      'http://localhost:3001',    // alternativo
      'http://127.0.0.1:3000',    // localhost alternativo
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

} else {
  app.enableCors({
    origin: ['https://constructora-c-chang.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
     exposedHeaders: ['set-cookie'],//esto es para que el frontend pueda leer las cookies
  });
}   

 // Middleware para cookies
  app.use(cookieParser());

app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true, // Valida si pasan mqs información de la necesaria 
    forbidNonWhitelisted: true,
    transformOptions: {//con esto los tipos se convierten automaticamente
      enableImplicitConversion: true,
    }
  }));

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

   const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend ejecutandose en el puerto ${port}`);
  
}
bootstrap();
