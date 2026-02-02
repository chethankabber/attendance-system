// backend/routes/attendance.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const authMiddleware = require('../middleware/auth');

// Separate Check-In endpoint
router.post('/checkin', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Please provide password' });
    }

    const users = await User.find({ role: 'user' });
    let matchedUser = null;

    for (const user of users) {
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const today = new Date().toISOString().split('T')[0];

    let attendance = await Attendance.findOne({
      userId: matchedUser._id,
      date: today
    });

    // If already checked in
    if (attendance) {
      return res.status(400).json({
        message: `${matchedUser.name}, you are already checked in for today`,
        action: 'already_checkedin'
      });
    }

    // Create new check-in
    attendance = new Attendance({
      userId: matchedUser._id,
      date: today,
      checkInTime: new Date()
    });
    await attendance.save();

    return res.json({
      message: 'Check-in successful',
      action: 'checkin',
      user: {
        name: matchedUser.name,
        checkInTime: attendance.checkInTime
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Separate Check-Out endpoint
router.post('/checkout', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Please provide password' });
    }

    const users = await User.find({ role: 'user' });
    let matchedUser = null;

    for (const user of users) {
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const today = new Date().toISOString().split('T')[0];

    let attendance = await Attendance.findOne({
      userId: matchedUser._id,
      date: today
    });

    // If not checked in yet
    if (!attendance) {
      return res.status(400).json({
        message: `${matchedUser.name}, you need to check in first`,
        action: 'not_checkedin'
      });
    }

    // If already checked out
    if (attendance.checkOutTime) {
      return res.status(400).json({
        message: `${matchedUser.name}, you have already checked out for today`,
        action: 'already_checkedout'
      });
    }

    // Update with check-out time
    attendance.checkOutTime = new Date();
    await attendance.save();

    return res.json({
      message: 'Check-out successful',
      action: 'checkout',
      user: {
        name: matchedUser.name,
        checkInTime: attendance.checkInTime,
        checkOutTime: attendance.checkOutTime
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get today's dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const users = await User.find({ role: 'user' }).select('name email');
    const todayAttendance = await Attendance.find({ date: today });

    const dashboardData = users.map(user => {
      const attendance = todayAttendance.find(
        att => att.userId.toString() === user._id.toString()
      );

      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        checkIn: attendance ? attendance.checkInTime : null,
        checkOut: attendance ? attendance.checkOutTime : null,
        status: attendance ? 'Present' : 'Absent'
      };
    });

    res.json({
      date: today,
      day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      attendance: dashboardData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get monthly history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: 'Please provide month and year' });
    }

    const users = await User.find({ role: 'user' }).select('name email');
    const daysInMonth = new Date(year, month, 0).getDate();
    
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-${daysInMonth}`;

    const attendanceRecords = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    });

    const historyData = users.map(user => {
      const userAttendance = attendanceRecords.filter(
        att => att.userId.toString() === user._id.toString()
      );

      const presentDays = userAttendance.length;
      const absentDays = daysInMonth - presentDays;

      let totalMinutes = 0;
      userAttendance.forEach(att => {
        if (att.checkOutTime) {
          const diffMs = att.checkOutTime - att.checkInTime;
          totalMinutes += diffMs / (1000 * 60);
        }
      });

      const avgMinutes = presentDays > 0 ? totalMinutes / presentDays : 0;
      const avgHours = Math.floor(avgMinutes / 60);
      const avgMins = Math.floor(avgMinutes % 60);

      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        totalAbsent: absentDays,
        totalPresent: presentDays,
        avgWorkHours: `${avgHours}h ${avgMins}m`
      };
    });

    res.json({
      month: `${new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long' })} ${year}`,
      totalDays: daysInMonth,
      history: historyData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;