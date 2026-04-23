const express = require('express');
const router  = express.Router();
const {
  getDonations, getMyDonations, createDonation,
  acceptDonation, rejectDonation, completeDonation,
  getAnalytics, scheduleDonation,
} = require('../controllers/donationController');
const { protect, adminOnly, ngoOnly } = require('../middleware/auth');

router.get('/analytics', protect, getAnalytics);
router.get('/',          getDonations);           // public

router.get('/my',            protect, getMyDonations);
router.post('/',             protect, createDonation);
router.put('/:id/accept',    protect, ngoOnly, acceptDonation);
router.put('/:id/reject',    protect, ngoOnly, rejectDonation);
router.put('/:id/complete',  protect, completeDonation);
router.put('/:id/schedule',  protect, scheduleDonation); // Step 5-6

module.exports = router;
