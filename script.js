import http from 'k6/http';
import { sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  thresholds: {
    http_req_duration: ["p(95)<1000"]
  },
  // A number specifying the number of VUs to run concurrently.
  vus: 50,
  // A string specifying the total duration of the test run.
  duration: '600s',
};

// Function to generate a random MAC address
function generateRandomMacAddress() {
  const characters = 'ABCDEF0123456789';
  let macAddress = '';
  for (let i = 0; i < 12; i++) {
      macAddress += characters.charAt(Math.floor(Math.random() * characters.length));
      if (i % 2 === 1 && i < 11) {
          macAddress += ':';
      }
  }
  return macAddress;
}

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Function to generate a random object with macAddress, type, and rssi
function generateRandomObject() {
  return {
      macAddress: generateRandomMacAddress(),
      type: getRandomInt(0, 1),
      rssi: getRandomInt(-100, 0)
  };
}

// Number of objects you want in the array
const numberOfObjects = 100; // Change this as needed

// The function that defines VU logic.
//
// See https://grafana.com/docs/k6/latest/examples/get-started-with-k6/ to learn more
// about authoring k6 scripts.
//
export default function() {
  // Generate the final object with trackerId and the array of objects
  let requestBody = {
    trackerId: getRandomInt(1, 100),
    measurements: Array.from({ length: numberOfObjects }, generateRandomObject)
  };

  let res = http.post('http://10.0.0.1:8081/measurements/add', JSON.stringify(requestBody),{headers: { 'Content-Type': 'application/json' }});

  if(res == null) {
    console.log("No Response");
  }
  else{
    console.log(res.json());
  }
  
  sleep(30);
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
