import passport from "passport";
import * as passportJwt from 'passport-jwt';
import jwt from 'jsonwebtoken';

import { User } from '../entities';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

export default () => {
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  }, async (jwtPayload, done) => {
    try {
      const exUser = await User.findOne({ where: {id: jwtPayload.id} });
      if (exUser) 
        done(null, exUser as User);
      else 
        done(null, false, { message: 'incorrect account info in jwt' });
    }
    catch (err) {
      console.error(err);
    }
    
  }));
}

