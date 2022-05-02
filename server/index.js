const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

//extra files
const config_path = require('./project/config/config');

const app = express();

//ENV VARIABLES
// console.log(process.env)
if (!process.env.NODE_ENV) {
    const result = dotenv.config();

    if (result.error) {
        throw result.error;
    }
}


// NODE ENV CONFIG
const node_env = process.env.NODE_ENV;
var config;
switch (node_env) {
    case 'local':
        config = config_path.local;
        console.log(`Server Running on ${node_env}`);
        app.locals.node_env = "local";
        break;
    case 'production':
        config = config_path.production;
        console.log(`Server Running on ${node_env}`);
        app.locals.node_env = "production";
        break;
    case 'development':
        config = config_path.development;
        console.log(`Server Running on ${node_env}`);
        app.locals.node_env = "development";
        break;
    case 'sandbox':
        config = config_path.sandbox;
        console.log(`Server Running on ${node_env}`);
        app.locals.node_env = "sandbox";
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config_path.auth.jwt_secret));

// CORS Config
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));
app.options("*", cors({
    origin: '*',
    optionsSuccessStatus: 200
}));

app.use((req, res, next) => {
	res.removeHeader("X-Powered-By");
	res.removeHeader("Date");
	res.removeHeader("Connection");
	res.setHeader("Server", "Blood, Sweat and Pain");
	next();
});


app.use(morgan((tokens, req, res) => {
    let path = decodeURI(tokens.url(req, res))
    var url = path.split('/');
    var extention_exception = ["html", "css", "js", "png", "jpg", "jpeg", "svg", "min", "ico", "woff2", "woff", "ttf", "eot", "map", "0", "1", "2", "3"];

    var last_part = url[url.length - 1];
    var extention = last_part.split(".")[last_part.split(".").length - 1];

    extention = extention.split("?")[0];

    var file_type_find = extention_exception.indexOf(extention);

    let path_exceptions = [
        "/health-check"
    ]

    if (file_type_find == -1 && path_exceptions.indexOf(path) == -1) {
        return [
            tokens.method(req, res),
            decodeURI(tokens.url(req, res)), // I changed this from the doc example, which is the 'dev' config.
            tokens.status(req, res),
            tokens.date(),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms'
        ].join(' ');
    }
}));

app.use(express.static('public'));

// MONGOOSE SETUP
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

//CONNECT TO DATABASE
mongoose.connect(config.db_url, options).then(
    () => {
        console.log(`Database Connected at URL: ${config.db_url}`);
    },
    err => {
        console.log(`Error connecting Database at URL: ${config.db_url} instance due to: `, err);
    }
);

// Router
app.use(require('./project/routes/routes'));

// Error Handler
app.use(require("./project/functions/error_handler"));

app.listen(config.port, function () {
    console.log('Server Started on http://localhost:' + config.port);
});
