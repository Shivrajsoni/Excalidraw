// TRY IMPLEMENTING THE LOGIC OF .ENV FILE 

// import { config } from 'dotenv';
// import { resolve } from 'path';

// Load root .env first
// config({ path: resolve(__dirname, '../../.env') });

// Load backend-specific .env (if exists)
// config();

// console.log(process.env.SECRET_KEY);
// Load .env file from project root
// config({ path: resolve(__dirname, '../../../.env') });
// export const SECRET_KEY = process.env.SECRET_KEY || (() => {
//   throw new Error('SECRET_KEY environment variable is not set. Please check your .env file at project root.');
// })();