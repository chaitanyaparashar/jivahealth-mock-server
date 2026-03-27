import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { USERS, OTP_STORE } from '../store';
import { signToken, requireAuth } from '../middleware/auth';

const router = Router();

router.post('/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'phone is required.' } });
    return;
  }
  const otpId = `otp_${uuid()}`;
  OTP_STORE[otpId] = phone;
  res.json({ success: true, otpId, expiresIn: 300 });
});

router.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (otp !== '123456') {
    res.status(400).json({ error: { code: 'INVALID_OTP', message: 'Invalid OTP.' } });
    return;
  }
  let user = USERS.find(u => u.phone === phone);
  const isNewUser = !user;
  if (!user) {
    user = { id: `user_${uuid()}`, name: phone, phone, role: 'patient', avatar: '👤', blocked: false, createdAt: new Date().toISOString() };
    USERS.push(user);
  }
  const token = signToken({ userId: user.id, role: user.role, phone: user.phone });
  const refreshToken = `rt_${uuid()}`;
  res.json({ token, refreshToken, user: { ...user, isNewUser } });
});

router.post('/set-role', requireAuth, (req, res) => {
  const { role } = req.body;
  const authUser = (req as any).user;
  const user = USERS.find(u => u.id === authUser.userId);
  if (!user) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found.' } });
    return;
  }
  user.role = role;
  const token = signToken({ userId: user.id, role: user.role, phone: user.phone });
  res.json({ token, user });
});

router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'refreshToken required.' } });
    return;
  }
  const user = USERS[0];
  const token = signToken({ userId: user.id, role: user.role, phone: user.phone });
  res.json({ token, refreshToken: `rt_${uuid()}` });
});

router.post('/logout', requireAuth, (_req, res) => {
  res.json({ success: true });
});

export default router;
