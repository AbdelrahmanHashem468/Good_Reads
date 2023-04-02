const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { BaseError } = require('../libs'); 
require('dotenv').config();

const { JWT_SECRET } = process.env;

const login = async (email, password) => {
    const user = await User.findOne( { email } ).exec();
    if (!user){
        throw new BaseError('Authentication failed',401);
    }
    const valid = user.verfiyPassword(password);
    if (!valid){
        throw new BaseError('Authentication failed',401);
    }
    const token = jwt.sign( { id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' } );
    return {
        role: user.role,
        token
    };
};

const signUp = async (data) =>  User.create(data);


module.exports = {
    login,
    signUp
}; 