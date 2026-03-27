import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { USERS } from '../store';

const router = Router();
router.use(requireAuth);

router.get('/me', (req, res) => {
  const { userId } = (req as any).user;
  const user = USERS.find(u => u.id === userId);
  if (!user) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found.' } });
    return;
  }
  res.json(user);
});

router.put('/me', (req, res) => {
  const { userId } = (req as any).user;
  const user = USERS.find(u => u.id === userId);
  if (!user) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found.' } });
    return;
  }
  Object.assign(user, req.body);
  res.json(user);
});

router.post('/me/abha', (req, res) => {
  const { userId } = (req as any).user;
  const user = USERS.find(u => u.id === userId);
  if (!user) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found.' } });
    return;
  }
  user.abhaId = req.body.abhaId;
  res.json({ success: true, abhaId: user.abhaId });
});

export default router;
