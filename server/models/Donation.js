const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    foodType: {
      type: String,
      required: [true, 'Food type is required'],
      enum: ['cooked', 'packaged', 'raw', 'organic_waste', 'mixed'],
    },
    quantity: {
      type: String,
      required: [true, 'Quantity is required'],
    },
    description: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Pickup address is required'],
    },
    location: {
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.209 },
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiry time is required'],
    },
    status: {
      type: String,
      enum: ['available', 'accepted', 'completed', 'expired', 'rejected', 'scheduled'],
      default: 'available',
    },
    scheduledFor: {
      type: Date,
      default: null, // set when donor schedules for tomorrow
    },
    isOrganic: {
      type: Boolean,
      default: false,
    },
    images: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', DonationSchema);
