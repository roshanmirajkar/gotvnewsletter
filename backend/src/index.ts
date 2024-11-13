import { handleCron } from "./controllers/cron"
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

//async function main() {
//  console.log(`Generating newsletter...`);
//  await handleCron();
//}
//main();

cron.schedule(`0 12 * * *`, async () => {
  console.log(`Generating newsletter...`);
  await handleCron();
});
