const { User } = require('../models');
const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'Good_Reads' } = process.env;
const login = async (email, password) => {
    const user = await User.findOne( { email } ).exec();
    if (!user){
        throw new Error('Authentication failed');
    }
    const valid = user.verfiyPassword(password);
    if (!valid){
        throw new Error('Authentication failed');
    }
    const token = jwt.sign( { id: user.id, email: user.email}, JWT_SECRET, { expiresIn: '7d' } );
    return {
        token
    };
};


module.exports = {
    login,
}; 