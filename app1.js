const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure passport middleware
const jwtOptions = {
    secretOrKey: 'my-secret-key',
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
};

passport.use(new passportJWT.Strategy(jwtOptions, (payload, done) => {
    // Perform authorization logic here
    done(null, payload);
})
);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Define calculator routes
app.get('/add/:a/:b', passport.authenticate('jwt', { session: false }), (req, res) => {
    const a = parseInt(req.params.a);
    const b = parseInt(req.params.b);
    const result = a + b;
    res.send(result.toString());
});

app.get('/subtract/:a/:b', passport.authenticate('jwt', { session: false }), (req, res) => {
    const a = parseInt(req.params.a);
    const b = parseInt(req.params.b);
    const result = a - b;
    res.send(result.toString());
});

app.get('/multiply/:a/:b', passport.authenticate('jwt', { session: false }), (req, res) => {
    const a = parseInt(req.params.a);
    const b = parseInt(req.params.b);
    const result = a * b;
    res.send(result.toString());
});

app.get('/divide/:a/:b', passport.authenticate('jwt', { session: false }), (req, res) => {
    const a = parseInt(req.params.a);
    const b = parseInt(req.params.b);
    const result = a / b;
    res.send(result.toString());
});

// Define authentication routes
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
        const payload = { id: 1, username: 'admin' };
        const token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({ success: true, token: token });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});

