import express            from 'express';
import favicon            from 'serve-favicon';
import bodyParser         from 'body-parser';

// Import self-generated methods
import { express_router } from './config/routes';

const app = express();
var router = express.Router();

var engines = require('consolidate');

app.set('views', './src/resources/templates');
app.engine('jade', engines.jade);
app.engine('swig', engines.swig);

// Set static & favicon paths
var root_dir = __dirname + '/../../..';
var static_res_dir = root_dir + '/public_assets';

app.use(express.static(static_res_dir));
app.use(favicon(static_res_dir + '/img/favicon.ico'));

// Set up request middleware
app.use(bodyParser.urlencoded(
  { extended: true }
));
app.use(bodyParser.json());

// Handle routing
express_router(app, router);

// Start the server
var server = app.listen(process.env.PORT || 8080, () => {
  var host = server.address().address;
  var port = server.address().port;
  var mode = app.settings.env;

  console.log('App listening at http://%s:%s in %s mode', host, port, mode);
});
