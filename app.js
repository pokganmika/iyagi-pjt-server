const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
const RedisStore = require('connect-redis')(session);
require('dotenv').config();

const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const storiesRouter = require('./routes/stories');
const usersRouter = require('./routes/users');
const sequelize = require('./models').sequelize;
const passportConfig = require('./passport');
const winston = require('./winston'); //

const app = express();
sequelize.sync({ logging: console.log }) // { force: true }
passportConfig(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('port', process.env.PORT || 8001);

if (process.env.NODE._ENV === 'production') {
  app.use(logger('combined'));
  app.use(helmet());
  app.use(hpp());
} else {
  app.use(logger('dev'));
}
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  store: new RedisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    pass: process.env.REDIS_PASSWORD,
    logErrors: true,
  }),
}

if (process.env.NODE_ENV === 'production') {
  sessionOption.proxy = true;
  // sessionOption.cookie.secure = true;
}
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/stories', storiesRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => { // winston 추가
  const err = new Error('Not Found');
  err.status = 404;
  winston.info('hello');
  winston.error(err.message);
  next(err);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

