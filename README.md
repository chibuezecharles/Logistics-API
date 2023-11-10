# Logistics-API
Create a logistics api that could be used by customers to request for logistics services and riders to accept and deliver goods sent via the logistics service.
Customers should have routes to:

1. Register with full name, email and password
 
2. Login with Email and password
 
3. Submit a form to request for logistics service. The form should contain the following fields: address, destination address, item's weight (remember to save the customer's ID as an object id for each request and the rider's ID as string with a default value of null).
 
The cost of shipping any product should be N1000 by default. Every shipping request will have a status of “pending” by default once the shipping order is submitted.
 
4. See a list of shipping he has made and its status
 
5. See a list of notifications


Riders should have route to:

1. Register with full name, email and password
 
2. Login with email and password
 
1. See a list of orders he/she has delivered (pending, in-transit and delivered orders, you can sort the list of orders by the createdAt field). 
 
2. Change an order status from “pending” to “in-transit” and “delivered” (Should be done with socket.io). Note that each time the state of a user's shipping order is changed, a notification should be sent to the concerned customer via socket.io so theyll be a need for the a notification collection.
Note that once a shopper changes the status of a shipping order from “pending” to “in-transit”, the field for the rider's ID should be assigned to the value of the ID of the rider that is  delivering the product.
 

Note: You can use the same table for the customers and rider but they should have a role property to distinguish their role in the business. Apart from the notification, every other feature should be implemented using express.
