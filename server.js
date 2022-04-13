const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();


const messages = [
    {id: 1,
     text: "подключить телефон к.201",
     created: "220222 9:10"
    },
];

let newId = 2;

app.use(koaBody({
    urlencoded: true,
    multipart: true,
  }));

  app.use(async (ctx, next) => {
    const origin = ctx.request.get('Origin');
    if (!origin) {
      return await next();
    }
    const headers = { 'Access-Control-Allow-Origin': '*', };
  
    if (ctx.request.method !== 'OPTIONS') {
      ctx.response.set({...headers});
      try {
        return await next();
      } catch (e) {
        e.headers = {...e.headers, ...headers};
        throw e;
      }
    }
  
    if (ctx.request.get('Access-Control-Request-Method')) {
      ctx.response.set({
        ...headers,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
      });
  
      if (ctx.request.get('Access-Control-Request-Headers')) {
        ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
      }
      ctx.response.status = 204;
    }
  });

app.use(async ctx => {
    ctx.response.body ='server response';

    const method = ctx.request.query.method;

    switch (method) {
        case 'allMessages':
            ctx.response.body = messages;
            return;
        case 'messageById':
          const id = Number(ctx.request.query.id);
          const message = messages.find(elem => id === elem.id);
          ctx.response.body = message;
          return;
        case 'createMessage':
           if (ctx.request.query.id) {
             //const { name, description, time, status } = ctx.request.body;
             const { text, time, status } = ctx.request.body;
             const editId = Number(ctx.request.query.id);
             messages.forEach((elem) => {
               if (editId === elem.id) {
                 if (!text) {
                   elem.status = status;
                 } else {
                  elem.test = test;
                  elem.time = time;
                  elem.status = status;
                 }  
               }
             });
           } else {
             messages.push(Object.assign({id: newId}, ctx.request.body));
             newId += 1;
           }
           ctx.response.body = true;
           return;
        case 'delMessageById':
          const delid = Number(ctx.request.query.id);
          const index = messages.findIndex(elem => delid === elem.id);
          messages.splice(index, 1);
          ctx.response.body = true;
          return;
        default:
            ctx.response.status = 404;
            return;
    }
});

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);
