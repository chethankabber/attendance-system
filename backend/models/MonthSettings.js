const mongoose = require('mongoose');

const MonthSettingsSchema = new mongoose.Schema({
  month: String,   // "02"
  year: String,    // "2026"
  sundays: { type: Number, default: 0 },
  saturdays: { type: Number, default: 0 }
});

module.exports = mongoose.model('MonthSettings', MonthSettingsSchema);
