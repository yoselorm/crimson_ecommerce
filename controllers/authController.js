const User = require('../models/userModel')
const BlacklistedToken = require('../models/blacklistedTokenModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { default: axios } = require('axios');
const crypto = require('crypto');
const sendMail = require('../utils/sendMail');

exports.register = async (req, res) => {
    try {
        const { email, password,fullname, address, role } = req.body;
        
        if(!email || !password || !fullname || !address ){
            return res.status(422).json({error:'Please fill all required fields',})
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'Email already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            email,
            password: hashedPassword,
            fullname,
            address,
            role
        })
        res.status(201).json({ message: 'User added succesfully' , user})

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Server error' })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email }).select('+password')
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }
        if(user.status === 'suspended'){
            return res.status(401).json({error:'User account suspended'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' })
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5h' });
        // Set cookie with token
        res.cookie('token', token, {
            httpOnly: true,
        });

        res.status(200).json({ token, message: 'login succesful' ,user})
        console.log(req);
        

    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: 'Server error' })
    }
}

exports.revokeToken = async (req, res) => {
    try {
        const { token } = req.body
        await BlacklistedToken.create({ token })

        res.status(200).json({ mesaage: 'Token revoked succesful' })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: 'Server error' })
    }
}

exports.logout = async(req,res)=>{
    try {
        const token = req.header('Authorization').replace('Bearer ','');
        await axios.post('https://crimson-ecommerce.onrender.com/api/v1/revoke-token',{token})
        res.clearCookie('token');
        // console.log(token);
        
        res.status(200).json({message:"Logout successful"})
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: 'Server error' })
    }
}


exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.params.id

        const user = await User.findById(req.user._id).select('+password')

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if(userId === req.user._id){
            return res.status(404).json({ error: 'User not found' });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect old password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.sendResetPasswordEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; 

        await user.save();

        const resetPasswordLink = `https://crimson-ecommerce.onrender.com/reset-password/${resetToken}`;
        const mailOptions = {
            to: email,
            subject: 'Reset Password',
            text: `To reset your password, click on the following link: ${resetPasswordLink}`,
        };

        await sendMail(mailOptions);

        res.status(200).json({ message: 'Reset password email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};