const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { BaseError } = require('../libs'); 

const { JWT_SECRET = 'Good_Reads' } = process.env;

const login = async (email, password) => {
    const user = await User.findOne( { email } ).exec();
    if (!user){
        throw new BaseError('Authentication failed',401);
    }
    const valid = user.verfiyPassword(password);
    if (!valid){
        throw new BaseError('Authentication failed',401);
    }
    const token = jwt.sign( { id: user.id, email: user.email}, JWT_SECRET, { expiresIn: '7d' } );
    return {
        token
    };
};


module.exports = {
    login,
}; 