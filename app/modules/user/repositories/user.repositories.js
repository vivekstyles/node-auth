const mongoose = require('mongoose');
const User = require('../models/user.model');

const userRepository = {
    addNewUser : async (param) => {
        const user = User({
            user_name : param.user_name,
            email_id : param.email_id,
            password : param.password
        })        
        const is_insert = await user.save();

        console.log(is_insert)

        return is_insert;
    },

    updateUser: async (param) =>{
       console.log('updating..')
       const userUpdated = await User.updateOne({email_id:param.email_id},{$set : {email_id : param.new_email_id}}) 

       console.log(userUpdated);

       return userUpdated;
    },

    findUser : async (param) => {
        const userData = await User.find({email_id:param.email_id})
        console.log('------------------------------------')

        return userData;
    },

    deleteUser: async (param) => {
        const is_deleted = await User.deleteOne({email_id : param.email_id})
        console.log(is_deleted)

        return is_deleted;
    },

    signIn : async (param) => {
        const getData = await User.findOne({
            email_id:param.email_id,
            password : param.password}).select('id user_name').exec();
        
        return getData;
    },

    allUser : async () => {
        const getAllUser = await User.find().exec();
        return getAllUser;
    },

    save : async (data) => {
        try {
            
        } catch (error) {
            console.log(error)
        }
    } 
}

module.exports = userRepository;