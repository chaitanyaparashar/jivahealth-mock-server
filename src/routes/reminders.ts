import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { requireAuth } from '../middleware/auth';
import { REMINDERS } from '../store';
import { notFound } from '../helpers/respond';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const { userId } = (req as any).user;
  const { type, active } = req.query as any;
  let results = REMINDERS.filter(r => r.userId === userId);
  if (type) results = results.filter(r => r.type === type);
  if (active !== undefined) results = results.filter(r => r.active === (active === 'true'));
  res.json({ reminders: results, total: results.length });
});

router.post('/', (req, res) => {
  const { userId } = (req as any).user;
  const reminder = {
    id: `rem_${uuid()}`,
    userId,
    active: true,
    snoozedUntil: null,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  REMINDERS.push(reminder);
  res.status(201).json(reminder);
});

router.put('/:reminderId', (req, res) => {
  const reminder = REMINDERS.find(r => r.id === req.params.reminderId);
  if (!reminder) { notFound(res, 'Reminder'); return; }
  Object.assign(reminder, req.body);
  res.json(reminder);
});

router.delete('/:reminderId', (req, res) => {
  const idx = REMINDERS.findIndex(r => r.id === req.params.reminderId);
  if (idx === -1) { notFound(res, 'Reminder'); return; }
  REMINDERS.splice(idx, 1);
  res.json({ success: true });
});

router.put('/:reminderId/snooze', (req, res) => {
  const reminder = REMINDERS.find(r => r.id === req.params.reminderId);
  if (!reminder) { notFound(res, 'Reminder'); return; }
  const { minutes = 15 } = req.body;
  reminder.snoozedUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString();
  res.json(reminder);
});

export default router;
