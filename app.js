import {
    Application,
    HttpServerStd,
    Router,
    Context,
} from 'https://deno.land/x/oak@v9.0.1/mod.ts';
import routes from './routes/routes.js';
import { configure } from './deps.js';


configure({
    views: `${Deno.cwd()}/views/`,
});


const app = new Application({
    serverConstructor: HttpServerStd,
});


let port = 7777;
if (Deno.args.length > 0) {
  const lastArgument = Deno.args[Deno.args.length - 1];
  port = Number(lastArgument);
}

app.use(routes);

app.listen(`:${port}`);

export {app};
