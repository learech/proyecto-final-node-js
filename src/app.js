import express from 'express'
import __dirname from './utils/path.js'
const app = express()
import { port, mongoUrl, secret} from './config/env.config.js'

// Public Folder
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))

//Sessions 
import session from 'express-session'
import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'

app.use(cookieParser())
app.use(session({
  store: MongoStore.create({
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    mongoUrl: mongoUrl
  }),
  secret: secret,
  resave: false,
  saveUninitialized: false

}))

// Passport Local-Passport
import initializePassport from './config/passport.config.js'
import passport from "passport"
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Logger
import addLogger from './utils/logger.js'
app.use(addLogger)

// Swagger
import { swaggerSpecs } from './utils/swaggerSpecs.js'
import swaggerUi from 'swagger-ui-express'
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs)) // Documentación

// Routes
import { homeView } from './controller/views.controller.js'
app.get('/', homeView)

//Views
import {routesViews} from './routes/views.routes.js'
app.use('/views', routesViews)

// Admin
import {routesAdmin} from './routes/admin.routes.js'
app.use('/api/admin', routesAdmin)

//Products
import routesProduct from './routes/products.routes.js'
app.use('/api/product', routesProduct)

//Cart
import routesCart from './routes/cart.routes.js'
app.use('/api/cart', routesCart)

// Users 
import {routesUsers} from './routes/user.routes.js'
app.use('/api/user', routesUsers)

// Sessions
import sessions from './routes/sessions.routes.js'
app.use('/session', sessions)

// Auth.Passport
import authPassport from './routes/passport.routes.js'
app.use('/auth', authPassport)

// Mailing
import emailRoute from './routes/email.routes.js'
app.use('/api/email', emailRoute)

// Twilio
import smsRoute from './routes/sms.routes.js'
app.use('/api/sms', smsRoute)

// Mocks
import mocksRoute from './routes/mocks.routes.js'
app.use('/api/mocks', mocksRoute)

// Logger
import loggerRoute from './routes/logger.routes.js'
app.use('/api/logger', loggerRoute)

// Handlebars
import handlebars from 'express-handlebars'

app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views')
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'));

// Sockets
import http from 'http'
const server = http.createServer(app);
import connectSocket from './utils/socket.js'
connectSocket(server)


// Server
server.listen(port, () => {
  console.log('Server is running on port: ' + port)

})

app.get("*", (req, res) => {
  return res.status(404).json({
    status: "error",
    message: "Not Found"
  })
})
