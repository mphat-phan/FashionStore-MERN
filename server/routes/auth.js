require('dotenv').config();
const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const User = require('./../models/User');

// POST : /api/auth/register
router.post('/register', async(req, res, next) => {
    const {username,password} = req.body;
    //Validation
    if(!username || !password){
        return res
        .status(400)
        .json({
            success: false,
            message: 'Missing username or password',
        });
    }
    try {
        //Check Exists
        const user = await User.findOne({username});
        if(user){
            return res
            .status(400)
            .json({
                success: false,
                message: 'Already User Existed '
            });
        }

        //All true
        //--Hash Password
        const hashPassword = await argon2.hash(password);
        const newUser = new User({
            username,
            password:hashPassword,
        });

        //--Save user
        await newUser.save();

        //--Return token
        const accessToken = jwt.sign({
            userID: newUser._id,
        }, process.env.ACCESS_TOKEN_SECRET);

        return res.json({
            success: true,
            message: 'Create user successfully',
            accessToken,
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// POST : /api/auth/login
router.post('/login', async(req,res,next) => {
    const {username,password} = req.body;
    if(!username || !password){
        return res
        .status(400)
        .json({
            success: false,
            message: 'Missing username or password',
        })
    }

    try {
        const user = await User.findOne({username});
        //Not found user
        if(!user){
            return res
            .status(400)
            .json({
                success: false,
                message: 'Incorrect username or password',
            })
        }

        //Check password
        const passwordValid = await argon2.verify(user.password,password);
        if(!passwordValid){
            return res
            .status(400)
            .json({
                success: false,
                message: 'Incorrect username or password',
            })
        }

        //All true
        const accessToken = jwt.sign({
            userID: user._id,
        }, process.env.ACCESS_TOKEN_SECRET);

        return res
        .json({
            success: true,
            message: 'Logged in successfully',
            accessToken,
        });

    } catch (error) {
        console.log(error.message);
        return res
        .status(500)
        .json({
            success: false,
            message:'Internal server error',
        });
    }

});
module.exports = router;