import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { requireAuth } from '../middleware/auth';
import { FAMILY_MEMBERS } from '../store';
import { notFound } from '../helpers/respond';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const { userId } = (req as any).user;
  let members = FAMILY_MEMBERS.filter(m => m.userId === userId);
  // For mock: if no members exist for this user, seed defaults and return them
  if (members.length === 0) {
    const defaults = [
      { id: `fm_${uuid()}`, userId, name: 'You (Self)', relation: 'Self', age: 30, gender: 'Male', avatar: '👤', conditions: [] },
      { id: `fm_${uuid()}`, userId, name: 'Family Member', relation: 'Spouse', age: 28, gender: 'Female', avatar: '👩', conditions: [] },
    ];
    defaults.forEach(m => FAMILY_MEMBERS.push(m));
    members = defaults;
  }
  res.json({ members });
});

router.post('/', (req, res) => {
  const { userId } = (req as any).user;
  const member = { id: `fm_${uuid()}`, userId, ...req.body };
  FAMILY_MEMBERS.push(member);
  res.status(201).json(member);
});

router.put('/:memberId', (req, res) => {
  const idx = FAMILY_MEMBERS.findIndex(m => m.id === req.params.memberId);
  if (idx === -1) { notFound(res, 'Family member'); return; }
  Object.assign(FAMILY_MEMBERS[idx], req.body);
  res.json(FAMILY_MEMBERS[idx]);
});

router.delete('/:memberId', (req, res) => {
  const idx = FAMILY_MEMBERS.findIndex(m => m.id === req.params.memberId);
  if (idx === -1) { notFound(res, 'Family member'); return; }
  FAMILY_MEMBERS.splice(idx, 1);
  res.json({ success: true });
});

export default router;
