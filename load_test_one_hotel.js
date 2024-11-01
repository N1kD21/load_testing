import http from 'k6/http';
import { check, sleep } from 'k6';
import hotelRequests from './k6_one_hotel.js';

export let options = {
    stages: [ //800 requests in total
        { duration: '30s', target: 10 }, // Ramp-up to 20 VUs 0->10 in 30 seconds = 5*30 = 150 requests
        { duration: '1m', target: 10 },  // Stay at 20 VUs for 1 minute 10 * 60 = 600 requests
        { duration: '10s', target: 0 },  // Ramp-down to 0 VUs 10->0 in 10 seconds = 5*10 = 50 requests
    ],
    // thresholds: {
    //     'http_req_duration': ['p(95)<1000'], // 95% of requests must complete below 500ms
    //     'my_trend': ['avg<200'], // Custom threshold for the custom metric
    // },
};

export default function () {
    // Визначаємо об'єкт, з яким працює поточний користувач
    const index = (__VU - 1) % hotelRequests.length;
    const hotelData = hotelRequests[index];
    console.log(hotelData, 'hotelData');

    // Відправляємо запит для конкретного об'єкта
    let res = http.post(
        'https://nicola.ngrok.app/hotel',
        // 'https://tonhotels-web-server.vercel.app/hotel',
        JSON.stringify({ hotelId: hotelData }),
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