const Donation = require('../models/Donation');
const User = require('../models/User');

// @desc    Get all available donations
// @route   GET /api/donations
const getDonations = async (req, res) => {
  try {
    const { status, foodType } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (foodType) filter.foodType = foodType;

    const donations = await Donation.find(filter)
      .populate('donor', 'name email organization address location phone')
      .populate('acceptedBy', 'name email organization')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get donations by logged-in donor
// @route   GET /api/donations/my
const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .populate('acceptedBy', 'name email organization')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a donation
// @route   POST /api/donations
const createDonation = async (req, res) => {
  try {
    const { foodType, quantity, description, address, location, expiresAt, isOrganic } = req.body;

    const donation = await Donation.create({
      donor: req.user._id,
      foodType,
      quantity,
      description,
      address,
      location: location || req.user.location,
      expiresAt,
      isOrganic: isOrganic || false,
    });

    const populated = await donation.populate('donor', 'name email organization address phone');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept a donation (NGO)
// @route   PUT /api/donations/:id/accept
const acceptDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    if (donation.status !== 'available') {
      return res.status(400).json({ message: 'Donation is no longer available' });
    }

    donation.status = 'accepted';
    donation.acceptedBy = req.user._id;
    await donation.save();

    const populated = await donation.populate([
      { path: 'donor', select: 'name email organization' },
      { path: 'acceptedBy', select: 'name email organization' },
    ]);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject a donation (NGO)
// @route   PUT /api/donations/:id/reject
const rejectDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    donation.status = 'rejected';
    await donation.save();
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark donation as completed
// @route   PUT /api/donations/:id/complete
const completeDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    donation.status = 'completed';
    await donation.save();
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analytics (admin)
// @route   GET /api/donations/analytics
const getAnalytics = async (req, res) => {
  try {
    const total     = await Donation.countDocuments();
    const available = await Donation.countDocuments({ status: 'available' });
    const accepted  = await Donation.countDocuments({ status: 'accepted' });
    const completed = await Donation.countDocuments({ status: 'completed' });
    const organic   = await Donation.countDocuments({ isOrganic: true });
    const scheduled = await Donation.countDocuments({ status: 'scheduled' });
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalNGOs   = await User.countDocuments({ role: 'ngo' });

    res.json({
      total, available, accepted, completed, organic, scheduled,
      totalDonors, totalNGOs,
      wasteReducedKg: completed * 5,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Schedule donation for tomorrow (Step 5-6)
// @route   PUT /api/donations/:id/schedule
const scheduleDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    if (donation.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0); // retry at 8 AM tomorrow

    // Extend expiry to tomorrow evening
    const tomorrowEvening = new Date(tomorrow);
    tomorrowEvening.setHours(20, 0, 0, 0);

    donation.status      = 'scheduled';
    donation.scheduledFor = tomorrow;
    donation.expiresAt   = tomorrowEvening;
    await donation.save();

    res.json({
      message: 'Donation scheduled for tomorrow at 8:00 AM',
      scheduledFor: tomorrow,
      donation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Re-activate scheduled donations (called by cron)
const retryScheduledDonations = async () => {
  try {
    const now  = new Date();
    const due  = await Donation.find({
      status: 'scheduled',
      scheduledFor: { $lte: now },
    });

    for (const d of due) {
      d.status = 'available';
      await d.save();
      console.log(`[CRON] Re-activated scheduled donation: ${d._id}`);
    }

    if (due.length > 0) console.log(`[CRON] ${due.length} scheduled donation(s) made available.`);
  } catch (err) {
    console.error('[CRON] Error retrying scheduled donations:', err.message);
  }
};

module.exports = {
  getDonations,
  getMyDonations,
  createDonation,
  acceptDonation,
  rejectDonation,
  completeDonation,
  getAnalytics,
  scheduleDonation,
  retryScheduledDonations,
};
