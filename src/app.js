import express from 'express';
import routes from './routes/app.routes.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { __dirname, connectMongo, connectSocket } from './utils.js';
import path from 'path';
import handebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import { iniPassport } from './config/passport.config.js';
import passport from 'passport';
import env from './config/env.config.js';
import compression from 'express-compression';
import errorHandler from './middlewares/error.js'
import { addLogger, logger } from './middlewares/logger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';


const mongoKey = env.DB_PASSWORD
const PORT = env.PORT || 8080;
const app = express();



// Middlewares
app.use(addLogger);
app.use(express.json()); // es para parsear el body que viene en el post
app.use(compression()); // es para comprimir los json que se trafiquen. La configuración extra '{brotli: {enabled: true, zlib: {}}}' es para que utilice Brotli
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));  // Para aclarar que 'public' está dentro de /src

// Handlebars
app.engine('handlebars', handebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Sessions
app.use(cookieParser());
app.use(
    session({
      store: MongoStore.create({ mongoUrl:`mongodb+srv://rechleandroluis1:${mongoKey}@cluster0.kpxjltn.mongodb.net/ecommerce?retryWrites=true&w=majority`, ttl: 1000 }),
      secret: 'sebaquerido',
      resave: true,
      saveUninitialized: true,
    })
  );

// Passport
iniPassport();
app.use(passport.initialize());
app.use(passport.session());

// Documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentation CoderBackend API REST',
      description: 'Documentation example using Swagger.',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api`,
        description: 'Development server',
      },
    ],
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Routes
app.use('/', routes);

// Middleware de error
app.use(errorHandler);


// ---- || ----

const httpServer = app.listen(PORT, () => {
    logger.info(`🚀 Server is up and run on port ${PORT} 🚀`);
});

httpServer.on('error', (error) => {
    logger.error(error.message)
});


// MongoDB
connectMongo();

// Socket
connectSocket(httpServer);
