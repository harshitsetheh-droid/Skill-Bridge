import 'dotenv/config';
import { getSupabaseAdmin } from '../services/supabase.js';

const KEEP = 'harshitseth.eh@gmail.com';
const sb = getSupabaseAdmin();

const { data, error } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (error) throw new Error(error.message);

const toDelete = data.users.filter((u) => u.email !== KEEP);
console.log(`Total users: ${data.total} | deleting: ${toDelete.length} (keeping ${KEEP})`);

for (const u of toDelete) {
  const { error: delErr } = await sb.auth.admin.deleteUser(u.id);
  if (delErr) console.log(`  FAIL ${u.email}: ${delErr.message}`);
  else console.log(`  deleted ${u.email}`);
}

const { data: after } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 });
console.log(`Remaining auth users: ${after.total}`);