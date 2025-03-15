import jwt from 'jsonwebtoken';
import { UserDoc } from '../models';


const getJwt = (user: UserDoc) => {
    const authJwt = jwt.sign({
        id: user._id,
        usernmae: user.username,
        email: user.email
    }, process.env.JWT_TOKEN!, { expiresIn:  3 * 24 * 60 * 60 });
    return authJwt;
};

export { getJwt };