import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import usersRouter from "./routes/users.router.js";
import ticketsRouter from "./routes/ticket.router.js";
import mailingRouter from "./routes/mailing.router.js";
import mockingProducts from "./routes/mockingProducts.router.js";
import loggerTest from "./routes/loggerTest.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import __dirname from "./utils.js";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import initPassport from "./config/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import { addLogger, logger } from "./config/logger.js";

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const app = express();

//Data for post JSON
app.use(express.json());
app.use("/static", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //Conectamos cookies con nuestro sv
app.use(addLogger);

//Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Mongo session
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.dbURL,
      dbName: config.dbName,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 100,
    }),
    secret: "mysecret",
    resave: true,
    saveUninitialized: true,
  })
);

//Documentacion
const swaggerOptions = {
  definition:{
    openapi: "3.0.1",
    info:{
      title: "Documentacion de Ecommerce de SebAR FUTSAL",
      description: "Proyecto de Ecommerce de productos de Futsal"
    }
  },
  apis: [ `${__dirname}/docs/**/*.yaml` ]
}
const specs = swaggerJSDoc(swaggerOptions)

//Passport
initPassport();
app.use(passport.initialize());
app.use(passport.session());

//Rutas
app.use("/", loggerTest);
app.use("/", viewsRouter);
app.use("/", mailingRouter);
app.use("/api", mockingProducts);
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/api", usersRouter);
app.use("/api", ticketsRouter);
app.use("/api/sessions", sessionsRouter);

app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

mongoose.set("strictQuery", false);

mongoose
  .connect(config.dbURL, { dbName: config.dbName })
  .then(() => {
    logger.info("DB conectada");
    const httpServer = app.listen(config.port, () =>
      logger.http(`Listening on port ${config.port}`)
    );
    const io = new Server(httpServer);
    let messages = [];

    io.on("connection", (socket) => {
      socket.on("new", (user) =>
        logger.info(`${user} se acaba de conectar al chat`)
      );

      socket.on("message", (data) => {
        messages.push(data);
        io.emit("logs", messages);
      });
    });
  })
  .catch((e) => {
    logger.falal("Error al conectar la DB");
  });
