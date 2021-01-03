require('dotenv').config();

const app = require('./app');
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});
