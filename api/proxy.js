const axios = require('axios');

module.exports = async (req, res) => {
  const apiUrl = req.query.apiUrl;
  const event_id = req.query.event_id;

  try {
    const response = await axios.get(apiUrl, {
      params: {
        token: '154761-g9sYpS0kbXfwrV',
        ...(event_id && { event_id }),
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from the API' });
  }
};