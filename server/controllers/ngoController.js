const NGO  = require('../models/NGO');
const User = require('../models/User');

/* Haversine formula — returns distance in km */
const haversine = (lat1, lng1, lat2, lng2) => {
  const R    = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// @desc    Get all active NGOs
// @route   GET /api/ngos
const getAllNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find({ isActive: true })
      .populate('user', 'name email phone address location organization')
      .sort({ createdAt: -1 });
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get nearby ACTIVE NGOs within radius (default 10 km)
// @route   GET /api/ngos/nearby?lat=&lng=&radius=10
const getNearbyNGOs = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: 'lat and lng are required' });

    const donorLat = parseFloat(lat);
    const donorLng = parseFloat(lng);
    const maxKm    = parseFloat(radius);

    // Step 2: only active NGOs
    const ngos = await NGO.find({ isActive: true }).populate('user', 'name email phone organization location');

    // Step 3: filter by distance
    const nearby = ngos
      .map((ngo) => {
        const dist = haversine(donorLat, donorLng, ngo.location.lat, ngo.location.lng);
        return { ...ngo.toObject(), distanceKm: parseFloat(dist.toFixed(2)) };
      })
      .filter((ngo) => ngo.distanceKm <= maxKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({
      count: nearby.length,
      hasAvailable: nearby.length > 0,
      ngos: nearby,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get nearest NGOs (legacy — kept for compatibility)
// @route   GET /api/ngos/nearest
const getNearestNGO = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: 'lat and lng required' });

    const ngos = await NGO.find({ isActive: true }).populate('user');
    const withDistance = ngos
      .map((ngo) => ({
        ...ngo.toObject(),
        distanceKm: parseFloat(haversine(parseFloat(lat), parseFloat(lng), ngo.location.lat, ngo.location.lng).toFixed(2)),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json(withDistance.slice(0, 5));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update NGO profile
// @route   POST /api/ngos
const createNGOProfile = async (req, res) => {
  try {
    const { ngoName, registrationNumber, focusArea, serviceRadius, location } = req.body;

    let ngo = await NGO.findOne({ user: req.user._id });
    if (ngo) {
      ngo.ngoName             = ngoName             || ngo.ngoName;
      ngo.registrationNumber  = registrationNumber  || ngo.registrationNumber;
      ngo.focusArea           = focusArea           || ngo.focusArea;
      ngo.serviceRadius       = serviceRadius       || ngo.serviceRadius;
      ngo.location            = location            || ngo.location;
    } else {
      ngo = new NGO({ user: req.user._id, ngoName, registrationNumber, focusArea, serviceRadius, location: location || req.user.location });
    }

    await ngo.save();
    res.status(201).json(ngo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle NGO active status (admin)
// @route   PUT /api/ngos/:id/toggle
const toggleNGOStatus = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    if (!ngo) return res.status(404).json({ message: 'NGO not found' });
    ngo.isActive = !ngo.isActive;
    await ngo.save();
    res.json({ message: `NGO is now ${ngo.isActive ? 'active' : 'inactive'}`, isActive: ngo.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllNGOs, getNearbyNGOs, getNearestNGO, createNGOProfile, toggleNGOStatus };
