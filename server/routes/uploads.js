import { Router } from 'express';
import { authMiddleware, roleGuard } from '../middleware/auth.js';
import { getSupabaseAdmin } from '../services/supabase.js';

const router = Router();

const BUCKET = (process.env.SUPABASE_STORAGE_BUCKET || 'resumes').trim();

function sanitizeFileName(name) {
  return (name || 'file')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 80);
}

// POST /api/uploads/resume
// body: { fileName, mimeType, base64 } — base64 of the file contents.
router.post('/resume', authMiddleware, roleGuard('student'), async (req, res) => {
  try {
    const { fileName, mimeType, base64 } = req.body || {};
    if (!fileName || !base64) {
      return res.status(400).json({ error: 'fileName and base64 file contents are required' });
    }

    const safeFile = sanitizeFileName(fileName);
    const objectPath = `${req.user.id}/${Date.now()}_${safeFile}`;
    const buffer = Buffer.from(base64, 'base64');

    if (buffer.length === 0) return res.status(400).json({ error: 'Empty file' });
    if (buffer.length > 10 * 1024 * 1024) return res.status(400).json({ error: 'File too large (max 10MB)' });

    const admin = getSupabaseAdmin();

    // Ensure bucket exists (ignore if already present).
    await admin.storage.createBucket(BUCKET, { public: true, fileSizeLimit: 10 * 1024 * 1024 }).catch(() => {});

    const { error } = await admin.storage
      .from(BUCKET)
      .upload(objectPath, buffer, { contentType: mimeType || 'application/pdf', upsert: true });

    if (error) {
      return res.status(500).json({ error: `Upload failed: ${error.message}` });
    }

    const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(objectPath);
    const publicUrl = urlData?.publicUrl;

    // Persist the resume URL on the student profile.
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.studentProfile.update({
      where: { userId: req.user.id },
      data: { resumeUrl: publicUrl },
    });
    await prisma.$disconnect();

    res.status(201).json({ url: publicUrl, path: objectPath });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;