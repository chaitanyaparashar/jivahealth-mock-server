import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { requireAuth } from '../middleware/auth';
import { VOICE_MESSAGES } from '../store';
import { notFound } from '../helpers/respond';

const router = Router();
router.use(requireAuth);

// Step 1: Get a presigned S3 URL
router.post('/upload-url', (req, res) => {
  const { userId } = (req as any).user;
  const { fileName, contentType, duration } = req.body;
  const voiceId = `vm_${uuid()}`;
  const uploadUrl = `https://mock-s3.jivahealth.in/voice/${userId}/${voiceId}/${fileName ?? 'voice.webm'}?X-Mock-Presigned=true`;
  res.json({
    voiceId,
    uploadUrl,
    expiresIn: 300,
  });
});

// Step 2: Client PUTs to S3 directly (external, not mocked here)

// Step 3: Confirm upload
router.post('/confirm', (req, res) => {
  const { userId } = (req as any).user;
  const { voiceId, fileName, duration, mimeType } = req.body;
  const msg = {
    id: voiceId ?? `vm_${uuid()}`,
    userId,
    fileName: fileName ?? 'voice.webm',
    mimeType: mimeType ?? 'audio/webm',
    duration: duration ?? 0,
    url: `https://mock-s3.jivahealth.in/voice/${userId}/${voiceId}/${fileName ?? 'voice.webm'}`,
    createdAt: new Date().toISOString(),
  };
  VOICE_MESSAGES.push(msg);
  res.status(201).json(msg);
});

router.get('/', (req, res) => {
  const { userId } = (req as any).user;
  const results = VOICE_MESSAGES.filter(v => v.userId === userId);
  res.json({ voiceMessages: results });
});

router.get('/:voiceId', (req, res) => {
  const msg = VOICE_MESSAGES.find(v => v.id === req.params.voiceId);
  if (!msg) { notFound(res, 'Voice message'); return; }
  res.json(msg);
});

router.delete('/:voiceId', (req, res) => {
  const idx = VOICE_MESSAGES.findIndex(v => v.id === req.params.voiceId);
  if (idx === -1) { notFound(res, 'Voice message'); return; }
  VOICE_MESSAGES.splice(idx, 1);
  res.json({ success: true });
});

export default router;
