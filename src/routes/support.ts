import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { requireAuth } from '../middleware/auth';
import { SUPPORT_TICKETS } from '../store';
import { notFound, badRequest } from '../helpers/respond';

const router = Router();
router.use(requireAuth);

router.get('/tickets', (req, res) => {
  const { userId } = (req as any).user;
  const results = SUPPORT_TICKETS.filter(t => t.userId === userId);
  res.json({ tickets: results, total: results.length });
});

router.post('/tickets', (req, res) => {
  const { userId } = (req as any).user;
  const { subject, category, message } = req.body;
  if (!subject || !message) { badRequest(res, 'subject and message are required'); return; }
  const ticket = {
    id: `TKT-${String(SUPPORT_TICKETS.length + 1).padStart(3, '0')}`,
    userId,
    subject,
    category: category ?? 'general',
    status: 'open',
    messages: [{
      senderId: userId,
      senderRole: 'patient',
      message,
      sentAt: new Date().toISOString(),
    }],
    createdAt: new Date().toISOString(),
  };
  SUPPORT_TICKETS.push(ticket);
  res.status(201).json(ticket);
});

router.get('/tickets/:ticketId', (req, res) => {
  const ticket = SUPPORT_TICKETS.find(t => t.id === req.params.ticketId);
  if (!ticket) { notFound(res, 'Support ticket'); return; }
  res.json(ticket);
});

router.post('/tickets/:ticketId/messages', (req, res) => {
  const { userId } = (req as any).user;
  const ticket = SUPPORT_TICKETS.find(t => t.id === req.params.ticketId);
  if (!ticket) { notFound(res, 'Support ticket'); return; }
  const msg = {
    senderId: userId,
    senderRole: 'patient',
    message: req.body.message ?? '',
    sentAt: new Date().toISOString(),
  };
  ticket.messages.push(msg);
  res.status(201).json(msg);
});

router.post('/callback-request', (req, res) => {
  const { userId } = (req as any).user;
  const { phone, reason, preferredTime } = req.body;
  res.status(201).json({
    requestId: `cb_${Date.now()}`,
    phone: phone ?? '',
    reason: reason ?? '',
    preferredTime: preferredTime ?? null,
    estimatedCallbackTime: '15 minutes',
    status: 'pending',
  });
});

router.post('/chat', (req, res) => {
  const { message } = req.body;
  res.json({
    reply: 'Thank you for reaching out. Our support team will respond shortly. For urgent issues, please call our helpline at 1800-XXX-XXXX.',
    timestamp: new Date().toISOString(),
  });
});

export default router;
