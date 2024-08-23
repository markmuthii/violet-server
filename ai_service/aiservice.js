const axios = require('axios');

const generateBookDetails = async ({bookName, bookAuthor }) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const prompt = `Provide detailed information about the book titled "${bookName}" written by ${bookAuthor}. Include author, genre, description, image, rating from goodreads application and any other relevant details.`;

  const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
    prompt,
    max_tokens: 150,
    n: 1,
    stop: null,
    temperature: 0.7,
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });

  const bookDetails = response.data.choices[0].text.trim();
  return bookDetails;
};

module.exports = { generateBookDetails };
