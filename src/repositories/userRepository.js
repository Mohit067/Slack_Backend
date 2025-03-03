import User from '../schema/user.js';
import crudRepository from './crudRepository.js';

const userRepository = {
    ...crudRepository,
    getUserByEmail: async function(email) {
        const user = await User.findOne({ email });
        return user;
    },
    getUserByName: async function(name)  {
        const user = await User.findOne({ name });
        return user;
    }
}

export default userRepository;