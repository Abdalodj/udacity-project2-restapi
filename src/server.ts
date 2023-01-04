import express from 'express';
import { sequelize } from './sequelize';

import { IndexRouter } from './controllers/v0/index.router';

import bodyParser from 'body-parser';

import { V0MODELS } from './controllers/v0/model.index';

import { config } from './config/config';

const c = config.dev;

(async () => {
  await sequelize.addModels(V0MODELS);
  await sequelize.sync();

  const app = express();
  const port = process.env.PORT || 8080; // default port to listen

  app.use(bodyParser.json());

  //CORS Should be restricted
  app.use(function (req, res, next) {
    console.log("------- REQUEST ----------");
    console.log(req.headers);
    res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header(
        'Access-Control-Allow-Methods',
        'GET,HEAD,PUT,PATCH,POST,DELETE'
      );
      res.header('Access-Control-Expose-Headers', 'Content-Length');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, Accept, Authorization, Content-Type, X-Requested-With, Range'
      );console.log("------- RESPONSE ----------");
      console.log(res.getHeaders());
      if (req.method === 'OPTIONS') {
        return res.send(200);
      } else {
        return next();
      }
    next();
  });

  app.use('/api/v0/', IndexRouter)

  // Root URI call
  app.get("/", async (req, res) => {
    res.send("/api/v0/");
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();