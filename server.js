// 2. START SERVER
const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

console.log(app.get('env'));
// console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//mongoose.connect(process.env.DATABASE_LOCAL

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('the DB is connected succesfully');
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
