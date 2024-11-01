import http from 'k6/http';
import { check, sleep } from 'k6';
import citiesAndHotels from './k6_cities.js';

export let options = {
    stages: [ //800 requests in total
        { duration: '30s', target: 40 }, // Ramp-up to 20 VUs 0->10 in 30 seconds = 5*30 = 150 requests
        { duration: '1m', target: 40 },  // Stay at 20 VUs for 1 minute 10 * 60 = 600 requests
        { duration: '10s', target: 0 },  // Ramp-down to 0 VUs 10->0 in 10 seconds = 5*10 = 50 requests
    ],
    // thresholds: {
    //     'http_req_duration': ['p(95)<1000'], // 95% of requests must complete below 500ms
    //     'my_trend': ['avg<200'], // Custom threshold for the custom metric
    // },
};

export default function () {
    // Визначаємо об'єкт, з яким працює поточний користувач
    const index = (__VU - 1) % citiesAndHotels.length;
    const cityData = citiesAndHotels[index];

    // Відправляємо запит для конкретного об'єкта
    let res = http.post(
        // 'https://nicola.ngrok.app/multicomplete',
        'https://tonhotels-web-server.vercel.app/multicomplete',
        JSON.stringify(cityData),
        {
            headers: { 'Content-Type': 'application/json' }
        }
    );

    // Перевіряємо статус відповіді
    check(res, {
        'status is 200': (r) => r.status === 200,
    });

    sleep(1); // Затримка перед завершенням
}