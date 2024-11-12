
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);


export async function sendNewsletter(newsletter: string) {

        try {
          const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
          const batchSize = 50;
          let start = 0;
          let hasMore = true;

          while (hasMore) {
            const { data: subscribers, error } = await supabase
              .from('users')
              .select('email')
              .range(start, start + batchSize - 1);

            if (error) {
              throw new Error(`Failed to fetch subscribers: ${error.message}`);
            }

            if (subscribers.length < batchSize) {
              hasMore = false;
            }

            const emails = subscribers.map(subscriber => subscriber.email);

            if (emails.length > 0) {
              await resend.emails.send({
                from: 'Eric <eric@tryfirecrawl.com>',
                to: emails,
                subject: 'Today in AI & LLMs – Your Quick Daily Roundup',
                html: newsletter,
              });
            }

            start += batchSize;
          }
          return "success";
        } catch (error) {
          console.log("error generating newsletter")
      
        }
}
    
    