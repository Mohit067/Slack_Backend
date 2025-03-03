import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        uniqu: [true, 'Email is already exist'],
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'please fill a valid email address'
        ]
    },
    password: {
        type: String,
        require: [true, 'Password is required'],
    },
    userName: {
        type: String,
        require: [true, "Username is required"],
        unique: [true, "Username already exist"],
        match: [
            /^[a-zA-Z0-9]+$/,
            'Username must contain only letters and numbers'
        ]
    },
    avatar: {
        type: String, 
    }
}, { timestamps: true }); 

userSchema.pre('save', function saveUser(next){
    const user = this;
    user.avatar = `https://robohash.org/${user.userName}`,  
    next();
})

const User = mongoose.model('User', userSchema);

export default User;