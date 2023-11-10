const express = require('express');
const bcrypt = require('bcrypt');
const Users = require('../models/usersSchema');
const {createToken,} = require('../jwtAuth');

const router = express.Router();  


// Register route.
router.post('/register', async(req, res) => {
    try {
        const {fullName, email, password, role } = req.body;

        const existingUser = await Users.findOne({
            $or:[
                { fullName: fullName},
                { email: email}
            ]
        });

        if(password === ""){
            return res.status(400).json({message: "Please enter a password"});
        }
        if(existingUser ) {
            return res.status(302).json({message: 'Already registered, please Login'});
        }

        const harshedPassword = await bcrypt.hash(password, 10);

        const newUser = await Users.create({
            fullName:fullName,
            email: email,
            password: harshedPassword,
            role:role,
        }, );

        if(!newUser){
            return res.status(400).json({
                status:false, 
                message: "failed to create user"
            });
        }

        return res.status(201).json({
            status:true, 
            message: "user created successfully", 
            user: newUser 
        });

        
    } catch (error) {
        return res.status(500).json({
            status:false, 
            message: error.message
        });
    }
});

// Login route.
router.post('/login', async (req, res) => {

    const { email, password } = req.body;

   try {
        const existingUser = await Users.findOne({ email: email});

        if(!existingUser || password === ""){
            return  res.status(404).json({
                status:false, 
                message: 'User not found'
            });
        }

        const matchpassword = await bcrypt.compare(password, existingUser.password);

        if(!matchpassword){
           return res.status(400).json({
            status:false, 
            message: 'incorrect user Details, please use the correct user Details'
        });
        }

        const accessToken = createToken(existingUser);
        return res.status(200).json({
            status:true, 
            message: 'login successful', 
            existingUser,
            accessToken:accessToken
        });
    
   } catch (error) {
    return res.status(500).json({
        status:false, 
        message: error.message
    });
   }

});




module.exports = router;