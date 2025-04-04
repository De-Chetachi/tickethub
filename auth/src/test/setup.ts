import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from 'supertest';


declare global {
    var getAuthCookie: () => Promise<string[]>;
}

let mongo: any;

beforeAll(async () => {
    process.env.JWT_TOKEN ='sdfghjkl';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
});


beforeEach(async () => {
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();
  
        for (let collection of collections) {
            await collection.deleteMany({});
      }
    }
});

afterAll(async () => {
    if (mongo) {
      await mongo.stop();
    }
    await mongoose.connection.close();
  });


global.getAuthCookie = async () => {
  await request(app)
    .post('/api/users/register')
    .send({
        email: 'cheta@gmail.com',
        password: 'password',
        username: 'cheta',
    })
    .expect(201);

  const loginResponse = await request(app)
    .post('/api/users/login')
    .send({
        email: 'cheta@gmail.com',
        password: 'password',
    })
    .expect(200);
  const cookie = loginResponse.get('Set-Cookie');
  if (!cookie) {
    throw new Error('cookie not set');
  }
  return cookie;
}