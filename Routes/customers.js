const express = require('express');
const {validateToken, customersOnly,} = require('../jwtAuth');
const Requests = require('../models/requestSchema');
const Notifications = require('../models/notificationSchema');



const router = express.Router();  
router.use(validateToken);

// form to request for logistics service
router.post('/', customersOnly, async (req, res) =>{
    try {
        const {address, destinationAddress, weight} = req.body;
        const customerId = req.userDetails.id;
        
        const newRequest = await Requests.create({
            address:address,
            destinationAddress:destinationAddress,
            weight: weight ,
            cost:weight * 1000,
            customerId: customerId,
        });

        if(!newRequest){
        return res.status(400).json({
            status:false, 
            message: "failed to create a new request"
        }); 
        }
        return res.status(200).json({
            status:true, 
            message: " successfull", 
            data: newRequest 
        });

    } catch (error) {
        return res.status(500).json({
            status:false, 
            message: error.message
        });
    }
});

// list of shipping the customer has made
router.get('/', customersOnly, async (req, res) => {
    try {
        const customerId = req.userDetails.id;

        const requestsData = await Requests.find({ customerId: customerId });

        if (!requestsData) {
            return res.status(400).json({ 
                status: false, 
                message: "Failed to fetch all requests" 
            });
        }

        return res.status(200).json({
            status: true, 
            message: "Successful", 
            data: requestsData 
        });

    } catch (error) {
        return res.status(500).json({ 
            status: false, 
            message: error.message 
        });
    }
});

// list of customer's notifications
router.get('/notifications', customersOnly, async (req, res) => {
    try {
        const customerId = req.userDetails.id;

        const notifications = await Notifications.find({ userId: customerId});

        if (!notifications) {
            return res.status(400).json({ 
                status: false, 
                message: "Failed to fetch all notifications" 
            });
        }

        return res.status(200).json({
            status: true, 
            message: "Successful", 
            data: notifications 
        });

    } catch (error) {
        return res.status(500).json({ 
            status: false, 
            message: error.message 
        });
    }
});

module.exports = router;
