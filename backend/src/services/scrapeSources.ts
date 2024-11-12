
import FirecrawlApp from '@mendable/firecrawl-js';
import dotenv from 'dotenv';
import OpenAI from 'openai';


dotenv.config();

const app = new FirecrawlApp({apiKey: process.env.FIRECRAWL_API_KEY});
const fs = require('fs');

export async function scrapeSources(sources: string[]) {
    console.log(sources);
    let combinedText: { stories: any[] } = { stories: [] };
    const useTwitter = true;
    const useScrape = true;

    for (const source of sources) {
 
      if (source.includes('x.com')) {
        if (useTwitter) {
        const usernameMatch = source.match(/x\.com\/([^\/]+)/);

        if (usernameMatch) {
            const username = usernameMatch[1];
          
            // Construct and encode the query
            const query = `from:${username} has:media -is:retweet -is:reply`;
            const encodedQuery = encodeURIComponent(query);
          
            // Encode the start time
            const startTime = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
            const encodedStartTime = encodeURIComponent(startTime);
          
            // Corrected API URL with encoded parameters to get tweets and attachments
            const apiUrl = `https://api.x.com/2/tweets/search/recent?query=${encodedQuery}&max_results=10&start_time=${encodedStartTime}`;
          
            // Fetch recent tweets from the Twitter API
            const response = await fetch(apiUrl, {
                headers: {
                  'Authorization': `Bearer ${process.env.X_API_BEARER_TOKEN}`
                }
              });
            
              if (!response.ok) {
                throw new Error(`Failed to fetch tweets for ${username}: ${response.statusText}`);
              }
            
              const tweets = await response.json();
             
            
              if (tweets.meta?.result_count === 0) {
       
          
              } else if (Array.isArray(tweets.data)) {
                console.log(`Tweets found from username ${username}`);
                const stories = tweets.data.map((tweet: any) => {
                  return {
                    headline: tweet.text,
                    link: `https://x.com/i/status/${tweet.id}`
                  };
                });
                combinedText.stories.push(...stories);
              } else {
                console.error('Expected tweets.data to be an array:', tweets.data);
              }
           
            
          }
        }
      } else {
        if (useScrape) {
        const scrapeResponse = await app.scrapeUrl(source, {
          formats: ['markdown'],
        });
        
        if (!scrapeResponse.success) {
          throw new Error(`Failed to scrape: ${scrapeResponse.error}`)
        }

        // Feed the scrape response to GPT-4o and get only stories from today
        
        try {
          const client = new OpenAI();

          const LLMFilterResponse = await client.chat.completions.create({
            messages: [{ role: 'user', content: `Today is ${new Date().toLocaleDateString()}. Return only today's AI or LLM related story or post headlines and links in JSON format from the following scraped content. The format should be {"stories": [{"headline": "headline1", "link": "link1"}, {"headline": "headline2", "link": "link2"}, ...]}. If there are no stories or posts related to AI or LLMs from today, return {"stories": []}. The source link is ${source}. If the story or post link is not absolute, make it absolute with the source link. RETURN ONLY JSON IN THE SPECIFIED FORMAT DO NOT INCLUDE MARKDOWN OR ANY OTHER TEXT JUST THE PURE JSON. Do not include \`\`\`json or \`\`\` or any other markdown formatting. Scraped Content:\n\n\n${scrapeResponse.markdown} JSON:` }],
            model: 'gpt-4o',
          });

          // Validate the response using the schema
          const todayStories = JSON.parse(LLMFilterResponse.choices[0].message.content!.trim());
          combinedText.stories.push(...todayStories.stories);
      
        } catch (error) {
          console.error('Error processing LLM response:', error);
        
        }
      }
    }
    }
    fs.writeFileSync('./combinedText.json', JSON.stringify(combinedText, null, 2));
    const rawStories = combinedText.stories;
    return rawStories;
  }  
