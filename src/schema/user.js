import bcrypt from "bcrypt";
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists'],
        match: [
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          'Please fill a valid email address'
        ]
    },
    
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username already exists'],
        minLength: [3, 'Username must be at least 3 characters'],
        match: [/^[a-zA-Z0-9]+$/, 'Username must contain only letters and numbers'],
       
    },
    
    avatar: {
        type: String, 
    }
}, { timestamps: true }); 

userSchema.pre('save', function saveUser(next) {
    if (this.isNew) {
      const user = this;
      const SALT = bcrypt.genSaltSync(9);
      const hashedPassword = bcrypt.hashSync(user.password, SALT);
      user.password = hashedPassword;
      user.avatar = `https://robohash.org/${user.username}`;
    }
    next();
});


const User = mongoose.model('User', userSchema);

export default User;