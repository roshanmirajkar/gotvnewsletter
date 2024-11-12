import { handleCron } from "./controllers/cron"
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

//async function main() {
//  console.log('starting...');
//}
//main();

cron.schedule(`0 0 * * *`, async () => {
  console.log(`running your task...`);
  await handleCron();
});
