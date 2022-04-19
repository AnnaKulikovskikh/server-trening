//экспорт
const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();


//пример сохраняемого объекта
const messages = [
    {
     name: "JOe",
     phone: "+7-125-456-78-45"
    },
];

app.use(koaBody({
    urlencoded: true,
    multipart: true,
  }));

app.use(async ctx => {
  const {name, phone} = ctx.request.querystring;
  console.log(ctx.request.querystring);
  console.log(ctx.request.body);
  ctx.response.body = 'server response';
  ctx.response.set({
    'Access-Control-Allow-Origin': '*'
  });
  if (subscriptions.has(phone)) {
    ctx.response.status = 400
    ctx.response.body = 'You already subscribed'
    return;
  }
  subscriptions.set(phone, name);
  ctx.response.body = 'Ok';
})

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);
