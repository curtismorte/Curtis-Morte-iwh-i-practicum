require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Do NOT put a real private app token in the repo. Use .env only.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS || '';
// Custom object type ID / FQN from your developer test account (e.g. 2-xxxxx or pxxxxx_pets)
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE || '';

// Three custom properties for the practicum custom object (Pets): Name + two more
const CUSTOM_PROPERTIES = ['name', 'breed', 'age'];

function hubspotHeaders() {
  return {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };
}

function customObjectsUrl(extraQuery = '') {
  const base = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
  return extraQuery ? `${base}?${extraQuery}` : base;
}

// ROUTE 1 — Homepage: retrieve custom object records and render table
app.get('/', async (req, res) => {
  const title = 'Custom Objects | Integrating With HubSpot I Practicum';

  if (!PRIVATE_APP_ACCESS || !CUSTOM_OBJECT_TYPE) {
    return res.render('homepage', {
      title,
      data: [],
      notice:
        'Set PRIVATE_APP_ACCESS and CUSTOM_OBJECT_TYPE in a local .env file (see .env.example) to load HubSpot data. The page still renders without a token.'
    });
  }

  const props = CUSTOM_PROPERTIES.join(',');
  const url = customObjectsUrl(`properties=${encodeURIComponent(props)}&limit=100`);

  try {
    const resp = await axios.get(url, { headers: hubspotHeaders() });
    const data = resp.data.results || [];
    res.render('homepage', { title, data, notice: null });
  } catch (error) {
    console.error('GET / HubSpot error:', error.response?.data || error.message);
    res.render('homepage', {
      title,
      data: [],
      notice:
        'Could not load custom object records from HubSpot. Check your token, scopes, and CUSTOM_OBJECT_TYPE.'
    });
  }
});

// ROUTE 2 — Form to create a new custom object record
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

// ROUTE 3 — Create custom object record, then redirect home
app.post('/update-cobj', async (req, res) => {
  if (!PRIVATE_APP_ACCESS || !CUSTOM_OBJECT_TYPE) {
    console.error('POST /update-cobj: missing PRIVATE_APP_ACCESS or CUSTOM_OBJECT_TYPE');
    return res.status(503).send(
      'HubSpot credentials not configured. Copy .env.example to .env and add your developer test account token and custom object type.'
    );
  }

  const properties = {
    name: req.body.name || '',
    breed: req.body.breed || '',
    age: req.body.age || ''
  };

  try {
    await axios.post(
      customObjectsUrl(),
      { properties },
      { headers: hubspotHeaders() }
    );
    res.redirect('/');
  } catch (error) {
    console.error('POST /update-cobj HubSpot error:', error.response?.data || error.message);
    res.status(500).send('Failed to create custom object record. Check server logs.');
  }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
