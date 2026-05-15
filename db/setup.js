require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs = require('fs');
const path = require('path');
const { supabaseAdmin } = require('../config/supabase');

async function runSetup() {
  console.log('NSS JBay — Database Setup');
  console.log('========================\n');

  const sqlPath = path.join(__dirname, '..', 'config', 'database.sql');

  if (!fs.existsSync(sqlPath)) {
    console.error('ERROR: database.sql not found at', sqlPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Found ${statements.length} SQL statements to execute.\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      const { error } = await supabaseAdmin.rpc('exec_sql', { sql: stmt + ';' });
      if (error) {
        const fallback = await supabaseAdmin.from('_exec_sql').select('*').limit(0);
        if (fallback.error) {
          console.log(`  [${i + 1}/${statements.length}] Executing statement...`);
          const { error: directError } = await supabaseAdmin.from('units').select('count', { count: 'exact', head: true });
          if (directError) {
            console.log(`  ⚠  Statement ${i + 1}: Supabase RPC not available. Run database.sql manually in Supabase SQL Editor.`);
            failed++;
            break;
          }
        }
      } else {
        success++;
      }
    } catch (err) {
      if (i === 0) {
        console.log('  ℹ  Execute the contents of config/database.sql in your Supabase SQL Editor.');
        console.log('  ℹ  This script requires the exec_sql function or direct database access.\n');
        failed++;
        break;
      }
      failed++;
    }
  }

  console.log(`\nDone: ${success} succeeded, ${failed} failed.\n`);

  if (failed > 0) {
    console.log('NOTE: For first-time setup, copy the contents of config/database.sql');
    console.log('      and paste it into your Supabase dashboard SQL Editor.\n');
  }

  process.exit(failed > 0 ? 1 : 0);
}

runSetup();
