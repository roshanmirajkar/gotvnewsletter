import { scrapeSources } from '../services/scrapeSources';
import { getCronSources } from '../services/getCronSources';
import { generateNewsletter } from '../services/generateNewsletter';
import { sendNewsletter } from '../services/sendNewsletter';

export const handleCron = async (): Promise<void> => {
  try {
    console.log("Starting cron process...");

    // Step 1: Fetch cron sources
    console.log("Fetching cron sources...");
    const cronSources = await getCronSources();
    if (!cronSources || cronSources.length === 0) {
      throw new Error("No cron sources found.");
    }
    console.log(`Cron sources fetched: ${cronSources.length}`);
    console.log("Sources:", cronSources);

    // Step 2: Scrape sources for stories
    console.log("Scraping sources...");
    const rawStories = await scrapeSources(cronSources);
    if (!rawStories || rawStories.length === 0) {
      throw new Error("No stories scraped from sources.");
    }
    console.log(`Stories scraped: ${rawStories.length}`);

    // Step 3: Convert raw stories to string if necessary
    const rawStoriesString = typeof rawStories === "string" ? rawStories : JSON.stringify(rawStories);

    // Step 4: Generate the newsletter
    console.log("Generating newsletter...");
    const newsletter = await generateNewsletter(rawStoriesString);
    if (!newsletter) {
      throw new Error("Newsletter generation failed.");
    }
    console.log("Newsletter generated successfully.");

    // Step 5: Send the newsletter
    console.log("Sending newsletter...");
    const result = await sendNewsletter(newsletter, rawStoriesString);
    if (!result) {
      throw new Error("Newsletter sending failed.");
    }
    console.log("Newsletter sent successfully:", result);

  } catch (error) {
    // Enhanced error handling
    if (error instanceof Error) {
      console.error("Error during cron process:", error.message);
    } else {
      console.error("Unexpected error during cron process:", error);
    }
  }
};