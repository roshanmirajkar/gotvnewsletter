import { scrapeSources } from '../services/scrapeSources';
import { getCronSources } from '../services/getCronSources';
import { generateNewsletter } from '../services/generateNewsletter'

export const handleCron = async (): Promise<void> => {
  try {
   
    const cronSources = await getCronSources();
    const rawStories = await scrapeSources(cronSources);
    const newsletter = await generateNewsletter(rawStories);
    //await sendNewsletter(newsletter);
  } catch (error) {
    console.error(error);
  }
}