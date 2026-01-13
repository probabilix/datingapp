
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qtoqmcqiajvpnzwulniy.supabase.co'
const supabaseKey = 'sb_publishable_KapUf4kFYwJ7d2DBNF8cEw_C7XMz7F2'
const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
    console.log("Checking specific query for privacy-policy...");
    const { data, error } = await supabase
        .from('legal_documents')
        .select('title, content, last_updated')
        .eq('slug', 'privacy-policy')

    if (error) {
        console.error('Error fetching data:', error);
    } else {
        console.log(`Found ${data.length} records.`);
        if (data.length > 0) {
            console.log('Record 0:', data[0]);
        }
    }
}

check();
