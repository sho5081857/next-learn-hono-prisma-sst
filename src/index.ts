import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import router from './adapter/router/router';

const app = new Hono();

app.route("", router);

export const handler = handle(app)
