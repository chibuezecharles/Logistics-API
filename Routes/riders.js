// riders.js
const express = require('express');
const { validateToken, ridersOnly } = require('../jwtAuth');
const Requests = require('../models/requestSchema');
const Notifications = require('../models/notificationSchema');

const router = express.Router();
router.use(validateToken);

// List of orders the rider has delivered (sorted by createdAt)
router.get('/orders', ridersOnly, async (req, res) => {
    try {
        const id = req.userDetails.id;

        const orders = await Requests.find({riderId: id }).sort({ createdAt: 'desc' });

        if (!orders) {
            return res.status(400).json({
                status: false, 
                message: "Failed to fetch all orders" 
            });
        }

        return res.status(200).json({
            status: true, 
            message: "Successful", data: orders 
        });

    } catch (error) {
        console.error("Error in /orders route:", error);
        return res.status(500).json({ 
            status: false, 
            message: error.message 
        });
    }
});

// Change an order status from “pending” to “in-transit” and “delivered”
router.post('/change-status', ridersOnly, async (req, res) => {
    try {
        const { requestId, status } = req.body;
        const riderId = req.userDetails.id;

        console.log("Attempting to change order status...");

        const request = await Requests.findById(requestId);

        if (!request) {
            console.error("Failed to fetch request in /change-status route");
            return res.status(400).json({
                status: false, 
                message: "Failed to fetch request" 
            });
        }

        request.status = status;

        if (status === 'in-transit' || status === 'delivered') {
            request.riderId = riderId;
        }

        await request.save();

        // Notify the customer via socket.io
        const userId = request.customerId;
        const notification = await Notifications.create({
            userId: userId,
            message: `Your shipping request is now ${status}`,
        });

        if (!notification) {
            console.error("Failed to create notification in /change-status route");
            return res.status(400).json({
                status: false, 
                message: "Failed to create notification" 
            });
        }

        // Emit the notification to the customer using req.io.to(userId.toString())
        console.log("Emitting notification to customer...");
        req.io.to(userId.toString()).emit('notification', notification);
        return res.status(200).json({
            status: true, 
            message: "Order status updated successfully", 
            data: notification 
        });

    } catch (error) {
        console.error("Error in /change-status route:", error);
        return res.status(500).json({ 
            status: false, 
            message: error.message 
        });
    }
});

module.exports = router;
