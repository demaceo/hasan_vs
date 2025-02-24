//User authentication, optional 
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';

const app = express();

passport.use(new LocalStrategy(
  (username, password, done) => {
    if (username === 'admin' && password === 'admin') {
      return done(null, { username: 'admin' });
    } else {
      return done(null, false);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  done(null, { username });
});

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Routes requiring authentication
app.get('/protected', ensureAuthenticated, (req, res) => {
  res.send('You are authenticated!');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

//Login route
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate('local', { successRedirect: '/protected', failureRedirect: '/login' }));

//Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// login.ejs
<!DOCTYPE html>
<html>
<head>
  <title>Login</title>
</head>
<body>
  <h1>Login</h1>
  <form action="/login" method="post">
  <label for="username">Username:</label><br>
  <input type="text" id="username" name="username"><br>
  <label for="password">Password:</label><br>
    <input type="password" id="password" name="password"><br>
    <input type="submit" value="Login">
  </form>
  <a href="/">Go back</a>
  <script src="/socket.io/socket.io.js"></script>
  <script>
  const socket = io();
  socket.on('connect', () => {
    console.log('Connected to server');
  });
  </script>
  </body>
  </html>

// protected.ejs
<!DOCTYPE html>
<html>
<head>
  <title>Protected Page</title>
</head>
<body>
  <h1>Protected Page</h1>
  <p>You are authenticated. This is a protected page.</p>
  <a href="/logout">Logout</a>
  <script src="/socket.io/socket.io.js"></script>
  <script>
  const socket = io();
  socket.on('connect', () => {
    console.log('Connected to server');
  });
  </script>
  </body>
  </html>

// app.js
import express from 'express';
import session from 'express-session';
  