import { Request, Response} from "express";
import { BadRequestError } from "./errors/badRequestError";
import { Password } from "./utilities/password";
import { User } from './models';
import { getJwt } from "./utilities/jwtoken";

class AuthController {

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new BadRequestError('invalid credentials');

    const ispassword = await Password.comparePassword(user.password, password);
    if (!ispassword) throw new BadRequestError('invalid credentials');

    const userJWT = getJwt(user);
    req.session =  { token: userJWT }
    res.status(200).send({ status: 'success', message: 'user successfully logged in', object: user });
  }

  static async register(req: Request, res: Response) {
    const { email, password, username } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) { throw new BadRequestError('Email already in use') };
    const user = User.build({ email, password, username });
    await user.save();

    res.status(201).send({ status: 'success', message: 'user successfully created', object: user });
  }


  static async getUser(req: Request, res: Response) {
    
      res.send({ status: 'success', message: 'current user', object: req.currentUser || null });
  }

  static async logout(req: Request, res: Response) {
    req.session = null;
    delete req.currentUser;
    res.send({ status: 'success', message: "Logged out", object: {} });
  }
}

module.exports = AuthController;