import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { requireAuth } from '../middleware/auth';
import { MEDICINES, CART, ORDERS, PHARMACY_PARTNERS } from '../store';
import { paginate } from '../helpers/paginate';
import { notFound, badRequest } from '../helpers/respond';

const router = Router();
router.use(requireAuth);

// ─── Partners ──────────────────────────────────────────────────────────────

router.get('/partners', (req, res) => {
  res.json({ partners: PHARMACY_PARTNERS, total: PHARMACY_PARTNERS.length });
});

// ─── Medicines ─────────────────────────────────────────────────────────────

router.get('/medicines', (req, res) => {
  const { q, form, prescriptionRequired, page = '1', limit = '20' } = req.query as any;
  let results = [...MEDICINES];
  if (q) results = results.filter(m => m.name.toLowerCase().includes(q.toLowerCase()) || m.genericName.toLowerCase().includes(q.toLowerCase()));
  if (form) results = results.filter(m => m.form.toLowerCase() === form.toLowerCase());
  if (prescriptionRequired !== undefined) results = results.filter(m => m.prescriptionRequired === (prescriptionRequired === 'true'));
  const p = paginate(results, Number(page), Number(limit));
  res.json({ medicines: p.data, total: p.total, page: p.page, limit: p.limit });
});

router.get('/medicines/:medicineId', (req, res) => {
  const med = MEDICINES.find(m => m.id === req.params.medicineId);
  if (!med) { notFound(res, 'Medicine'); return; }
  res.json(med);
});

// ─── Cart ───────────────────────────────────────────────────────────────────

router.get('/cart', (req, res) => {
  const { userId } = (req as any).user;
  const items = CART[userId] ?? [];
  const subtotal = items.reduce((sum: number, i: any) => sum + i.discountedPrice * i.quantity, 0);
  res.json({ items, subtotal, itemCount: items.length });
});

router.post('/cart', (req, res) => {
  const { userId } = (req as any).user;
  const { medicineId, quantity = 1 } = req.body;
  const med = MEDICINES.find(m => m.id === medicineId);
  if (!med) { notFound(res, 'Medicine'); return; }
  if (!CART[userId]) CART[userId] = [];
  const existing = CART[userId].find((i: any) => i.medicineId === medicineId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    CART[userId].push({ medicineId, name: med.name, price: med.price, discountedPrice: med.discountedPrice, quantity });
  }
  const items = CART[userId];
  res.json({ items, subtotal: items.reduce((s: number, i: any) => s + i.discountedPrice * i.quantity, 0) });
});

router.put('/cart/:medicineId', (req, res) => {
  const { userId } = (req as any).user;
  const { quantity } = req.body;
  if (!CART[userId]) { notFound(res, 'Cart item'); return; }
  const item = CART[userId].find((i: any) => i.medicineId === req.params.medicineId);
  if (!item) { notFound(res, 'Cart item'); return; }
  if (quantity <= 0) {
    CART[userId] = CART[userId].filter((i: any) => i.medicineId !== req.params.medicineId);
  } else {
    item.quantity = quantity;
  }
  const items = CART[userId] ?? [];
  res.json({ items, subtotal: items.reduce((s: number, i: any) => s + i.discountedPrice * i.quantity, 0) });
});

router.delete('/cart/:medicineId', (req, res) => {
  const { userId } = (req as any).user;
  if (!CART[userId]) { notFound(res, 'Cart item'); return; }
  CART[userId] = CART[userId].filter((i: any) => i.medicineId !== req.params.medicineId);
  res.json({ success: true });
});

// ─── Orders ─────────────────────────────────────────────────────────────────

router.get('/orders', (req, res) => {
  const { userId } = (req as any).user;
  const results = ORDERS.filter(o => o.userId === userId);
  res.json({ orders: results, total: results.length });
});

router.post('/orders', (req, res) => {
  const { userId } = (req as any).user;
  const { items, deliveryAddress, paymentMethod, paymentId, prescriptionId } = req.body;
  if (!items || items.length === 0) { badRequest(res, 'items is required'); return; }
  const subtotal = items.reduce((s: number, i: any) => s + (i.discountedPrice ?? i.price) * i.quantity, 0);
  const order = {
    id: `ord_${uuid()}`,
    userId,
    items,
    subtotal,
    deliveryFee: 40,
    total: subtotal + 40,
    deliveryAddress: deliveryAddress ?? '',
    paymentMethod: paymentMethod ?? 'online',
    paymentId: paymentId ?? null,
    prescriptionId: prescriptionId ?? null,
    status: 'confirmed',
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    placedAt: new Date().toISOString(),
  };
  ORDERS.push(order);
  if (CART[userId]) CART[userId] = [];
  res.status(201).json(order);
});

router.get('/orders/:orderId', (req, res) => {
  const order = ORDERS.find(o => o.id === req.params.orderId);
  if (!order) { notFound(res, 'Order'); return; }
  res.json(order);
});

router.get('/orders/:orderId/tracking', (req, res) => {
  const order = ORDERS.find(o => o.id === req.params.orderId);
  if (!order) { notFound(res, 'Order'); return; }
  res.json({
    orderId: order.id,
    status: order.status,
    steps: [
      { label: 'Order Placed', completed: true, time: order.placedAt },
      { label: 'Confirmed', completed: order.status !== 'pending', time: order.placedAt },
      { label: 'Packed', completed: ['shipped', 'out_for_delivery', 'delivered'].includes(order.status), time: null },
      { label: 'Shipped', completed: ['out_for_delivery', 'delivered'].includes(order.status), time: null },
      { label: 'Delivered', completed: order.status === 'delivered', time: null },
    ],
  });
});

export default router;
