import { scrapeSources } from '../services/scrapeSources';
import { getCronSources } from '../services/getCronSources';

export const handleCron = async (): Promise<void> => {
  try {
   
    const cronSources = await getCronSources();
    await scrapeSources(cronSources);
    


  } catch (error) {
    console.error(error);
  }
}