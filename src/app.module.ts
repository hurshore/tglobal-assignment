import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'tglobal',
      entities: [User],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
