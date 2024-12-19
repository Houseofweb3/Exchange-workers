import cron from 'node-cron';
import axios from 'axios';
import { AppDataSource } from './config/data-source';
import { Coin } from './entity'; // Import the Coin entity

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/coins/markets';
const PAGES = 2;
const VS_CURRENCY = 'usd';

async function fetchAndUpdateCoins() {
    try {
        const coinRepository = AppDataSource.getRepository(Coin);
        const coinDataArray: Coin[] = []; // Collect all coins for batch processing

        for (let page = 1; page <= PAGES; page++) {
            console.log(`Fetching data for page ${page}...`);
            const response = await axios.get(COINGECKO_API_URL, {
                params: { vs_currency: VS_CURRENCY, page },
            });

            const coins = response.data;

            for (const coin of coins) {
                // Prepare coin data for batch upsert
                coinDataArray.push({
                    id: coin.id,
                    symbol: coin.symbol,
                    name: coin.name,
                    image: coin.image,
                    current_price: coin.current_price,
                    market_cap: coin.market_cap,
                    market_cap_rank: coin.market_cap_rank,
                    fully_diluted_valuation: coin.fully_diluted_valuation,
                    total_volume: coin.total_volume,
                    high_24h: coin.high_24h,
                    low_24h: coin.low_24h,
                    price_change_24h: coin.price_change_24h,
                    price_change_percentage_24h: coin.price_change_percentage_24h,
                    market_cap_change_24h: coin.market_cap_change_24h,
                    market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
                    circulating_supply: coin.circulating_supply,
                    total_supply: coin.total_supply,
                    max_supply: coin.max_supply,
                    ath: coin.ath,
                    ath_change_percentage: coin.ath_change_percentage,
                    ath_date: new Date(coin.ath_date),
                    atl: coin.atl,
                    atl_change_percentage: coin.atl_change_percentage,
                    atl_date: new Date(coin.atl_date),
                });
            }

            // Small delay between pages to avoid rate limits
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        // Batch upsert all coins
        console.log('Upserting coin data...');
        await coinRepository.upsert(coinDataArray, ['id']); // Use 'id' as the unique key for upsert

        console.log('Coins updated successfully.');
    } catch (error: any) {
        console.error('Error updating coins:', error.message);
    }
}

// Schedule the cron job to run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
    console.log('Cron job started...');
    await fetchAndUpdateCoins();
});

async function notifyOnError(jobName: string, error: any) {
    console.error(`Error in ${jobName}:`, error);
    // Add your notification logic here, e.g., send an email, Slack message, etc.
    // Example:
    // await sendSlackNotification(`Error in ${jobName}: ${error.message}`);
}

AppDataSource.initialize()
    .then(() => {
        console.log('Connected to the database');

        console.log('Cron jobs scheduled');

        cron.schedule('*/5 * * * *', async () => {
            console.log('5 mins Cron job started...');
            try {
                await fetchAndUpdateCoins();
                console.log('5 mins job completed.');
            } catch (error) {
                await notifyOnError('Hourly Job', error);
            }
        });

        // Optionally, run jobs immediately for testing (skip in production)
        if (process.env.NODE_ENV !== 'production') {
            (async () => {
                try {
                    console.log('Running jobs immediately for testing...');
                    await fetchAndUpdateCoins();
                    console.log('Initial job run completed.');
                } catch (error) {
                    console.error('Error running initial jobs for testing:', error);
                }
            })();
        }
    })
    .catch(error => {
        console.error('Error connecting to the database', error);
    });
