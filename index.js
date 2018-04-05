const { getRandomAcceptLanguage, getRandomUserAgent } = require('./random');
const tr = require('tor-request');
const { sample } = require('lodash');
const { promisify } = require('util');
const request = promisify(require('request'));
const torRequest = promisify(tr.request);
const newTorSession = promisify(tr.newTorSession);
tr.TorControlPort.password = 'giraffe';

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function formatTime(ms) {
  const seconds = ms / 1000;
  const value = seconds > 60 ? seconds / 60 : seconds;
  const unit = seconds > 60 ? 'm' : 's';
  return { value, unit };
}

function delayAndLog(ms) {
  const { value, unit } = formatTime(ms);
  console.log(`Sleeping for ${value.toFixed(1)}${unit}`);
  return delay(ms);
}

async function run() {
  try {
    const randomUserAgent = getRandomUserAgent();
    const randomUid = getRandomUid();
    const randomAcceptLanguage = getRandomAcceptLanguage();
    const useTor = Math.random() >= 0.5;

    if (useTor) {
      await newTorSession();
    }

    console.log(
      JSON.stringify(
        {
          useTor,
          randomUid,
          randomUserAgent,
          randomAcceptLanguage
        },
        null,
        4
      )
    );

    const response = useTor ? await torRequest(requestOptions) : await request(requestOptions);

    await delay(delayTime * 2 / 3);
    await run();
  } catch (e) {
    console.log(e);
    await delayAndLog(10000);
    run();
  }
}

run().catch(e => console.log(e));
