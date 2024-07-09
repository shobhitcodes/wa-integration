require('dotenv').config();

const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('supp!');
  // sendMessage('+919785057113', 'something');
  // send();
});

function send() {
  const url = 'https://graph.facebook.com/v17.0/405781202600002/messages';
  const token =
    'EAAEw3iFNUckBOzeh73xMGvV4SfmcxagOm2NjvsPwdEpRi21xnySZBmYP4wAdlLhKK4SBETkcChBhvZANwleuZBwo2ON7ZBdR3lK617GXb8ka9OzZCCDv4if6yVYUZAQjVVnOLmB0pTtviYub66krwHfGEMgVHSfoAZCSpFY70NLczda5lakb2tel1FjOTrjAx0ZBIA6rWrn9xzD85NhNyZC3l9cVIMCEZD';

  const data = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: '918929999699',
    type: 'text',
    text: {
      preview_url: true,
      body: "Here's the info you requested! https://www.meta.com/quest/quest-3/",
    },
  };

  axios
    .post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(
        'Error:',
        error.response ? error.response.data : error.message
      );
    });

  // const url = 'https://graph.facebook.com/v19.0/405781202600002/messages';
  // const token =
  //   'EAAEw3iFNUckBOzeh73xMGvV4SfmcxagOm2NjvsPwdEpRi21xnySZBmYP4wAdlLhKK4SBETkcChBhvZANwleuZBwo2ON7ZBdR3lK617GXb8ka9OzZCCDv4if6yVYUZAQjVVnOLmB0pTtviYub66krwHfGEMgVHSfoAZCSpFY70NLczda5lakb2tel1FjOTrjAx0ZBIA6rWrn9xzD85NhNyZC3l9cVIMCEZD';

  // const data = {
  //   messaging_product: 'whatsapp',
  //   to: '918929999699',
  //   type: 'template',
  //   template: {
  //     name: 'hello_world',
  //     language: {
  //       code: 'en_US',
  //     },
  //   },
  // };

  // axios
  //   .post(url, data, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //   .then((response) => {
  //     console.log(response.data);
  //   })
  //   .catch((error) => {
  //     console.error(
  //       'Error:',
  //       error.response ? error.response.data : error.message
  //     );
  //   });
}

app.get('/webhook', (req, res) => {
  console.log('2222');
  const VERIFY_TOKEN = 'mascru';

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('777');
  console.log({ mode, token, challenge });

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    return res.status(200).send('tokens missing');
  }
});

app.post('/webhook', (req, res) => {
  const data = req.body;

  if (data.object) {
    if (
      data.entry &&
      data.entry[0].changes &&
      data.entry[0].changes[0].value.messages &&
      data.entry[0].changes[0].value.messages[0]
    ) {
      const message = data.entry[0].changes[0].value.messages[0];
      const from = message.from;
      const msgBody = message.text.body;

      console.log('Received message:', msgBody);

      const responseMessage = `- Shobhit Agarwal`;
      sendMessage(from, responseMessage);
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

const sendMessage = async (phoneNumber, message) => {
  try {
    const response = await axios.post(
      process.env.WHATSAPP_API_URL,
      {
        // messaging_product: 'whatsapp',
        // recipient_type: 'individual',
        // to: phoneNumber,
        // type: 'text',
        // text: { body: message },
        // "messaging_product": "whatsapp",
        // "recipient_type": "individual",
        // "to": "+16505555555",
        // "type": "text",
        // "text": {
        //   "preview_url": true,
        //   "body": "Here'\''s the info you requested! https://www.meta.com/quest/quest-3/"
        // }
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: {
          preview_url: false,
          body: 'check101',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Message sent:', response.data);
  } catch (error) {
    console.error(
      'Error sending message:',
      error.response ? error.response.data : error.message
    );
  }
};

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
