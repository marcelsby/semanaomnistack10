const { Router } = require('express');
const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);

routes.get('/search', SearchController.index);

routes.put('/dev/update', DevController.update);
routes.delete('/dev/delete/:id', DevController.destroy);

module.exports = routes;