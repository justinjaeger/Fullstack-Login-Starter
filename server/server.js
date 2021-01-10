const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;
const dbConnection = require('./connections/connect');
// const cookieParser = require('cookie-parser');
const session = require('express-session'); // if keep, don't need cookieParser
// const store = session.MemoryStore();
const MySQLStore = require('express-mysql-session')(session);
const { v4: uuidv4 } = require('uuid');

const routes = require('./routes/mainRouter');

//=============================//

// Parsers
app.use(express.json());
// app.use(cookieParser());

// For creating sessions
const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hour expiration
  },
  saveUninitialized: false,
  genid: function(req) { // call function to generate unique session ID
    return uuidv4();
  },
  resave: true, // it communicates to session store that it is still active
  store: new MySQLStore({ // connect the session store to mysql pool
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 3306,
  }),
};

// If we're serving in production mode, do these
if (process.env.NODE_ENV === 'production') {
  app.use('/dist', express.static(path.resolve(__dirname, '../dist'))); // statically serve everything in the dist folder on the route
  app.get('/', (req, res) => { // serve index.html on the route '/'
    res.status(200).sendFile(path.resolve(__dirname, '../client/src/index.html'));
  });
  app.set('trust proxy', 1) // trust proxy -- not positive I need this
  sess.cookie.secure = true // serve secure cookies
};

// configure session IDs (sess object declared above)
app.use(session(sess));

// MAIN ROUTER
app.use('/', routes);

// catch-all endpoint handler
app.use((req, res) => res.status(400).send('Page not found.'));

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error!',
    status: 500,
    message: { err: 'A 500 error occurred!' },
  };
  const errorObj = Object.assign(defaultErr, err);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Magic happening on ${PORT}`);
});

module.exports = app;
