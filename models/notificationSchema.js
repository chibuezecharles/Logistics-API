const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    message: {
        type: String,
    }
  }, 
  { timestamps: true }
  );


  const Notifications = mongoose.model('notifications', notificationSchema);

module.exports = Notifications;