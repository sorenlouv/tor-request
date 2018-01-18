const randomUseragent = require('random-useragent');
const tr = require('tor-request');
const { promisify } = require('util');
const request = promisify(tr.request);
const newTorSession = promisify(tr.newTorSession);

const requestOptions = {};

tr.TorControlPort.password = 'giraffe';

function getRandomNumber(max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomUid() {
  const max = 20000000000000000000;
  const min = 10000000000000000000;
  const base10 = getRandomNumber(max, min);
  return base10.toString(16);
}

function submitVote() {
  return request(requestOptions);
}

async function run() {
  try {
    await newTorSession();
    const res = await submitVote();
    console.log(res.body);

    const ms = getRandomNumber(600000, 4000000);
    console.log(`Sleeping for ${(ms / 1000 / 60).toFixed(1)}m`);
    await delay(ms);
    await run();
  } catch (e) {
    console.log(e);
    await delay(10000);
    run();
  }
}

run().catch(e => console.log(e));
