import { Mongoose } from 'mongoose';
import { RefreshTokenSchema } from './schemas/refresh-token.schema';

export const refreshTokenMongooseConnection = [
  {
    provide: 'REFRESH_TOKEN_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('REFRESH_TOKEN', RefreshTokenSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
