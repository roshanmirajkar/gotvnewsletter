import { scrapeSources } from '../services/scrapeSources';
import { getCronSources } from '../services/getCronSources';
import { generateNewsletter } from '../services/generateNewsletter'
import { sendNewsletter } from '../services/sendNewsletter'
import fs from 'fs';
export const handleCron = async (): Promise<void> => {
  try {
   
    //const cronSources = await getCronSources();
    //const rawStories = await scrapeSources(cronSources).toString();
    const rawStories = fs.readFileSync('./combinedText.json', 'utf8').toString();
    const newsletter = await generateNewsletter(rawStories);
    const result = await sendNewsletter(newsletter!);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}