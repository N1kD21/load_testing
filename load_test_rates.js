import http from 'k6/http';
import { check, sleep } from 'k6';
import ratesRequests from './k6_rates.js';

export let options = {
    stages: [ //800 requests in total
        { duration: '30s', target: 100 }, // Ramp-up to 20 VUs 0->10 in 30 seconds = 5*30 = 150 requests
        { duration: '1m', target: 100 },  // Stay at 20 VUs for 1 minute 10 * 60 = 600 requests
        { duration: '10s', target: 0 },  // Ramp-down to 0 VUs 10->0 in 10 seconds = 5*10 = 50 requests
    ],
    cloud: {
        // Project: Default project
        projectID: 3708601,
        // Test runs with the same name groups test runs together.
        name: 'rates LOCAL SERVER 100 VUs',
      }
};

export default function () {
    // Визначаємо об'єкт, з яким працює поточний користувач
    const index = (__VU - 1) % ratesRequests.length;
    const rateData = ratesRequests[index];
    console.log(rateData, 'rateData');

    // Відправляємо запит для конкретного об'єкта
    let res = http.post(
        'https://nicola.ngrok.app/rates',
        // 'https://tonhotels-web-server.vercel.app/rates',
        JSON.stringify(rateData),
        {
            headers: { 'Content-Type': 'application/json' }
        }
    );
    console.log(res.body.length, 'res.body');
    
    // Перевіряємо статус відповіді
    check(res, {
        'status is 200': (r) => r.status === 200,
    });

    sleep(1); // Затримка перед завершенням
}