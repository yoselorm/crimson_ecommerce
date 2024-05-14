const User = require("../models/userModel");
const mongoose = require('mongoose')




exports.getProfile = async (req, res) => {
    try {
        const userProfile = req.user;

        const { password, ...profileData } = userProfile.toObject();
        res.status(200).json({ profile: profileData });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {

    try {
        const { address, fullname } = req.body

        const userId = req.params.id
        const isUserIdTrue = mongoose.Types.ObjectId.isValid(userId)
        if(!isUserIdTrue){
            throw new Error()
        }

        let user = await User.findById(userId)
        user.fullname = fullname;
        user.address = address;

        await user.save()

        res.status(200).json({ messge: 'User profile updated successfully' })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'server error' })

    }

}