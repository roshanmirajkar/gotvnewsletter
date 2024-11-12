import { handleCron } from "./controllers/cron"
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('starting...');
  await handleCron();
}

main();

// cron.schedule(`*/1 * * * *`, async () => {
//   console.log(`running your task...`);
// });
