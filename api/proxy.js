const axios = require('axios');

module.exports = async (req, res) => {
  const { apiUrl, ...restQueryParams } = req.query;
  const newUrl = new URL(apiUrl);

  // Set token and additional query parameters
  newUrl.searchParams.set('token', '154761-g9sYpS0kbXfwrV');
  for (const [key, value] of Object.entries(restQueryParams)) {
    newUrl.searchParams.set(key, value);
  }

  try {
    const response = await axios.get(newUrl.toString());
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch data from the API' });
  }
};
