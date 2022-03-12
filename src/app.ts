import express, {Request, Response, NextFunction} from 'express';
import morgan from 'morgan';
import passport from 'passport';
import { createConnection } from 'typeorm';

import passportConfig from './passport';

import authRouter from './routes/auth';
import v1Router from './routes/v1';
import communityRouter from './routes/community';
import { User, ComComment, ComPost, DelUser, DelComPost } from './entities';

const app = express();

app.set('port', process.env.PORT || 80);

const main = async () => {
  try {
    await createConnection({
      type: 'mysql',
      host: process.env.DB_URL,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_NAME,
      entities: [User, ComPost, ComComment, DelUser, DelComPost],
      synchronize: true,
      charset: 'UTF8_GENERAL_CI',
    });
    console.log('데이터베이스 연결 성공');
  }
  catch (err) {
    console.log('데이터베이스 연결 실패');
    console.error(err);
  }

  app.use(morgan(process.env.NODE_ENV || 'dev'));
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(passport.initialize());
  passportConfig();

  app.use('/auth', authRouter);
  app.use('/v1', v1Router);
	app.use('/community', communityRouter);

  app.get('/', (req: Request, res: Response) => {
    res.json({signal: 'success~!'});
  });   //test code
  
  app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중 (컨테이너의 포트번호)');
  });
}

main();



