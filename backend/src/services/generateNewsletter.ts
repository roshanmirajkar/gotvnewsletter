
import FirecrawlApp from '@mendable/firecrawl-js';
import dotenv from 'dotenv';
import OpenAI from 'openai';


dotenv.config();

const app = new FirecrawlApp({apiKey: process.env.FIRECRAWL_API_KEY});
const fs = require('fs');

export async function generateNewsletter(rawStories: string) {

        try {
          const client = new OpenAI();

          const newsletterResponse = await client.chat.completions.create({
            messages: [{ role: 'user', content: `Given a list of raw AI and LLM-related stories sourced from various platforms, create a concise TL;DR-style email newsletter called 'AGI News' with up to the 10 most interesting and impactful stories in HTML format. Prioritize stories that cover the popular Twitter demos, notable product launches, and innovations in AI/LLM technology.

The newsletter should have the following structure:

Title: 'AGI News – Your Quick Daily Roundup'
Introduction: A one-sentence overview introducing the daily roundup and the newsletter which is a daily AI newsletter sourced by AI agents & Firecrawl 🔥.
Top X Stories: Select up to 10 most noteworthy stories, each summarized in 2-3 sentences with a clickable headline that links to the source.
Each story summary should briefly convey:

Headline: Capture attention with a short, engaging headline.
Highlights: Mention the key takeaway or significance of the story.
Link: Include a hyperlink to the original source for more information.
Example format for each story:

Headline: [Story Headline]
Summary: Brief, compelling summary of the story's main points or implications.
Link: [Insert link]
Choose stories that demonstrate major breakthroughs, popular AI demos, practical applications, or timely insights relevant to developers, researchers, and founders. Make sure the language is informative but engaging, keeping the overall tone professional and friendly. Do not include any stories that are not in raw stories or are not AI or LLM related. Ensure the newsletter is formatted in HTML. Do not include \`\`\`html or \`\`\` in the newsletter.  \n\nHere is the raw stories: ${rawStories}` }],
            model: 'gpt-4o',
          });

          return newsletterResponse.choices[0].message.content;
    
        } catch (error) {
          console.log("error generating newsletter")
      
        }
}
    
    