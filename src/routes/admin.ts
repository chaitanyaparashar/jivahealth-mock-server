import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { USERS, APPOINTMENTS, ORDERS, SUPPORT_TICKETS } from '../store';
import { paginate } from '../helpers/paginate';
import { notFound } from '../helpers/respond';

const router = Router();
router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/users', (req, res) => {
  const { role, blocked, q, page = '1', limit = '20' } = req.query as any;
  let results = [...USERS];
  if (role) results = results.filter(u => u.role === role);
  if (blocked !== undefined) results = results.filter(u => u.blocked === (blocked === 'true'));
  if (q) results = results.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.phone.includes(q));
  const p = paginate(results, Number(page), Number(limit));
  res.json({ users: p.data, total: p.total, page: p.page, limit: p.limit });
});

router.put('/users/:userId/block', (req, res) => {
  const user = USERS.find(u => u.id === req.params.userId);
  if (!user) { notFound(res, 'User'); return; }
  user.blocked = req.body.blocked ?? true;
  res.json({ success: true, userId: user.id, blocked: user.blocked });
});

router.get('/dashboard', (_req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  res.json({
    totalUsers: USERS.length,
    totalPatients: USERS.filter(u => u.role === 'patient').length,
    totalDoctors: USERS.filter(u => u.role === 'doctor').length,
    totalAshas: USERS.filter(u => u.role === 'asha').length,
    totalAppointments: APPOINTMENTS.length,
    todayAppointments: APPOINTMENTS.filter(a => a.date === today).length,
    totalOrders: ORDERS.length,
    openSupportTickets: SUPPORT_TICKETS.filter(t => t.status === 'open').length,
  });
});

export default router;
