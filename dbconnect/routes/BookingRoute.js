const express = require('express');
const { createBooking } = require('../controller/createBooking');
const { getBookingsByUser } = require('../controller/getBookingByUser');
const { getBookingCount } = require('../controller/getBookingCount');
const Bookingrouter = express.Router();

Bookingrouter.post('/create', createBooking);
Bookingrouter.get('/user/:userId',getBookingsByUser)
Bookingrouter.get('/count/:userId',getBookingCount)
module.exports = Bookingrouter;
