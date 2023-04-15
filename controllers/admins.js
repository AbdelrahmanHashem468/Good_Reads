const { User } = require('../models');
const { Shelf } = require('../models');
const jwt = require('jsonwebtoken');
const { BaseError } = require('../libs');
require('dotenv').config();

const { JWT_SECRET } = process.env;

const login = async (email, password) => {
    const user = await User.findOne({ email }).exec();
    if (!user) {
        throw new BaseError('Authentication failed', 401);
    }
    const valid = user.verfiyPassword(password);
    if (!valid) {
        throw new BaseError('Authentication failed', 401);
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return {
        role: user.role,
        token
    };
};

const signUp = async (data) => {
    const user = await User.create(data);
    if (!user) {
        throw new BaseError('SignUp failed', 500);
    }
    Shelf.create({ userId: user.id });
    return;
};

const updateUser = async (id, data) => {
    const user = await User.findById(id)
    if (!user) throw new BaseError('user not found', 400)

    const newUser = await User.findByIdAndUpdate(id, data, { new: true })
    if (!newUser) throw new BaseError('error updating User', 500)
    return newUser;
}

const getUserById = async(id) => {
    const user = await User.findOne({ _id: id, role: 'user' })
    if (!user) throw new BaseError('user not found')
    return user
}

module.exports = {
    login,
    signUp,
    updateUser,
    getUserById
}; 