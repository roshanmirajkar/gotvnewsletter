
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewsletter(newsletter: string, rawStories: string) {
  if (newsletter.length <= 750) {
    console.log("Newsletter is too short to send. See newsletter below:");
    console.log(newsletter);
    console.log("Raw stories below:");
    console.log(rawStories);
    return "Newsletter not sent due to insufficient length.";
  }

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

      console.log(`Sending newsletter to ${subscribers.length} subscribers`);

      for (const subscriber of subscribers) {
        const unsubscribe_link = `https://www.aginews.io/api/unsubscribe?email=${subscriber.email}`;
       
        await resend.emails.send({
          from: 'GOTV <geeks@geeksofthevalley.com>',
          to: subscriber.email,
          subject: 'Geeks of the Valley – Venture Insights Now',
          html: newsletter + `<br><br><a href="${unsubscribe_link}">Unsubscribe</a>`,
        });
        
      }

      start += batchSize;
    }
    return "Success sending newsletter on " + new Date().toISOString();
  } catch (error) {
    console.log(" SEND ERROR generating newsletter");
  }
}