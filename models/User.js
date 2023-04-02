const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        email: {
          type: String,
          required: true,
          unique: true,
        },
        firstName: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 15,
        },
        lastName: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 15,
        },
        role: {
          type: String,
          required: true,
          default: 'user',
          enum: ['user', 'admin'],
        },
        password: {
          type: String,
          required: true,
        },
        DOB: {
          type: Date,
          required: true,
      },
      photo: {
          type: String,
          required: true,
      }
    },
    {
        timestamps: true,
        toJSON: {
          transform(doc, ret) {
            delete ret.password;
          },
        },
    },
);

userSchema.pre('save', function preSave(next) {
  this.password = bcrypt.hashSync(this.password,10);
  next();
})

userSchema.methods.verfiyPassword = function verfiyPassword(password){
    return bcrypt.compareSync(password,this.password);
};

const User = mongoose.model('User',userSchema);

module.exports = User; 