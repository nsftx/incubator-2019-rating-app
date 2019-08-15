const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config('/.env');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const settingsRouter = require('./routes/settings');
const ratingsRouter = require('./routes/ratings');
const messagesRouter = require('./routes/messages');
const emoticonsRouter = require('./routes/emoticons');
const emoticonsGroupsRouter = require('./routes/emoticonsGroups');
const InvitesRouter = require('./routes/invites');

const app = express();

app.use(cors());


// view engine setup
app.set('views', path.join(__dirname, 'views'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false,
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/settings', settingsRouter);
app.use('/api/v1/ratings', ratingsRouter);
app.use('/api/v1/messages', messagesRouter);
app.use('/api/v1/emoticons', emoticonsRouter);
app.use('/api/v1/emoticonsGroups', emoticonsGroupsRouter);
app.use('/api/v1/invites', InvitesRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
