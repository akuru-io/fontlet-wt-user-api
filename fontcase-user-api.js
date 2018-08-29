'use latest';
import bodyParser from 'body-parser';
import express from 'express';
import Webtask from 'webtask-tools';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import helmet from 'helmet';

const collection = 'my-collection';
const server = express();

server.use(helmet.xssFilter());
server.use(helmet.hidePoweredBy());
server.use(helmet.noSniff());
server.use(cors());
server.use(bodyParser.json());

server.post('/registeruser', (req, res, next) => {
  const { MONGO_URL } = req.webtaskContext.secrets;
  const {email} = req.body;


  MongoClient.connect(MONGO_URL, (err, client) => {
    const db = client.db('fontcase');
    
    if (err) return next(err);
    db.collection(collection).insertOne({email}, (insertError) => {
      client.close();
      if (insertError) return next(insertError);
      res.status(201).send('Success');
    });
  });
});
module.exports = Webtask.fromExpress(server);
