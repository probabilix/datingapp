
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qtoqmcqiajvpnzwulniy.supabase.co'
const supabaseKey = 'sb_publishable_KapUf4kFYwJ7d2DBNF8cEw_C7XMz7F2'
const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
    console.log("Checking legal_documents table...");
    const { data, error } = await supabase
        .from('legal_documents')
        .select('*')

    if (error) {
        console.error('Error fetching data:', error);
    } else {
        console.log(`Found ${data.length} records.`);
        data.forEach(d => console.log(`- ${d.slug}: ${d.title}`));
    }
}

check();
