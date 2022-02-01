import passport from "passport";
import * as passportLocal from 'passport-local';
import bcrypt from 'bcrypt';

import { User } from '../entities';

const LocalStrategy = passportLocal.Strategy;

//Local Strategy (사용자 보내준 아이디, 비번을 이용한 로그인 전략)
export default () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',   //아이디에 해당하는 req.body 속성
    passwordField: 'password',    //비밀번호에 해당하는 req.body 속성
  }, async (email, password, done) => {   //실제 로그인 전략
    try {
      const exUser = await User.findOne({ where: { email } });
      if (exUser) {
        const result = await bcrypt.compare(password, exUser.password);
        if (result)  //아이디, 비번 일치
          done(null, exUser, { message: 'correct' });
        else  //아이디, 비번 불일치
          done(null, false, { message: 'incorrect password' });
      }
      else {    //아이디가 존재하지 않음
        done(null, false, { message: 'email not found' });
      }
    }
    catch (err) {
      console.error(err);
      done(err);
    }
  }));

}
