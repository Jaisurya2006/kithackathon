const express = require('express');
const router  = express.Router();
const { getAllNGOs, getNearbyNGOs, getNearestNGO, createNGOProfile, toggleNGOStatus } = require('../controllers/ngoController');
const { protect, ngoOnly, adminOnly } = require('../middleware/auth');

router.get('/',        protect, getAllNGOs);
router.get('/nearby',  protect, getNearbyNGOs);   // Step 2-4: active NGOs within radius
router.get('/nearest', protect, getNearestNGO);
router.post('/',       protect, ngoOnly, createNGOProfile);
router.put('/:id/toggle', protect, adminOnly, toggleNGOStatus); // Step 7: admin test toggle

module.exports = router;
