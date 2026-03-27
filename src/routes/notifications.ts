import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { NOTIFICATIONS } from '../store';
import { notFound } from '../helpers/respond';

const router = Router();
router.use(requireAuth);

const DEFAULT_NOTIFICATIONS = [
  { id: 'dn1', type: 'appointment', title: 'Appointment Reminder', body: 'Your appointment with Dr. Ramesh Kumar is tomorrow at 10:30 AM.', read: false, createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 'dn2', type: 'reminder', title: 'Medicine Reminder', body: 'Time to take Metformin 500mg. Please take it after meals.', read: false, createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: 'dn3', type: 'report', title: 'Lab Report Ready', body: 'Your blood test report is now available. Tap to view.', read: true, createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
];

router.get('/', (req, res) => {
  const { userId } = (req as any).user;
  const { read, type } = req.query as any;
  // Fall back to defaults for any user without seeded notifications
  if (!NOTIFICATIONS[userId]) {
    NOTIFICATIONS[userId] = DEFAULT_NOTIFICATIONS.map(n => ({ ...n }));
  }
  let results = NOTIFICATIONS[userId];
  if (read !== undefined) results = results.filter((n: any) => n.read === (read === 'true'));
  if (type) results = results.filter((n: any) => n.type === type);
  const unreadCount = NOTIFICATIONS[userId].filter((n: any) => !n.read).length;
  res.json({ notifications: results, total: results.length, unreadCount });
});

router.put('/:notificationId/read', (req, res) => {
  const { userId } = (req as any).user;
  const notifs = NOTIFICATIONS[userId] ?? [];
  const notif = notifs.find((n: any) => n.id === req.params.notificationId);
  if (!notif) { notFound(res, 'Notification'); return; }
  notif.read = true;
  res.json({ success: true });
});

router.put('/read-all', (req, res) => {
  const { userId } = (req as any).user;
  (NOTIFICATIONS[userId] ?? []).forEach((n: any) => { n.read = true; });
  res.json({ success: true });
});

router.delete('/:notificationId', (req, res) => {
  const { userId } = (req as any).user;
  if (!NOTIFICATIONS[userId]) { notFound(res, 'Notification'); return; }
  const idx = NOTIFICATIONS[userId].findIndex((n: any) => n.id === req.params.notificationId);
  if (idx === -1) { notFound(res, 'Notification'); return; }
  NOTIFICATIONS[userId].splice(idx, 1);
  res.json({ success: true });
});

// Update push notification settings (store on user preferences; mock just returns success)
router.put('/settings', (_req, res) => {
  res.json({ success: true });
});

export default router;
