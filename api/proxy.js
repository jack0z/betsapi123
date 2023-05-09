const axios = require('axios');

module.exports = async (req, res) => {
  const { apiUrl } = req.query;
  const newUrl = new URL(apiUrl);

  newUrl.searchParams.set('token', '154761-g9sYpS0kbXfwrV');
  console.log('(newUrl.toString', newUrl.toString());
  try {
    const response = await axios.get(newUrl.toString());
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch data from the API' });
  }
};
