import express, {Request, Response, NextFunction} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { createConnection } from 'typeorm';

import { User } from './entities/User';

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
      entities: [User],
      synchronize: true,
      charset: 'UTF8_GENERAL_CI',
    });
    console.log('데이터베이스 연결 성공');
  }
  catch (err) {
    console.log('데이터베이스 연결 실패');
    console.error(err);
  }

  app.get('/', (req: Request, res: Response) => {
    res.json({signal: 'success~!'});
  });   //test code

  app.use(morgan(process.env.NODE_ENV || 'dev'));
  app.use(express.json());
  app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중 (컨테이너의 포트번호)');
  });
}

main();



