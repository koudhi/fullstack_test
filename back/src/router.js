const express      = require('express'),
  router           = express.Router(),
  devController    = require('./controllers/devController.js'),
  mainController    = require('./controllers/mainController.js'),
  levelController  = require('./controllers/levelController.js');

    // export router
  module.exports = router;

router.get('/', mainController.main)

router.get('/api/levels', levelController.showAllLevels)

router.get('/api/levels/:id', levelController.showOneLevel)

router.post('/api/levels', levelController.createNewLevel)

router.delete('/api/levels/:id', levelController.deleteLevel)

router.put('/api/levels/:id', levelController.editLevel)

router.get('/api/devs',  devController.showAllDevs)

router.get('/api/devs/:id', devController.showOneDev)

router.post('/api/devs',  devController.createNewDev)

router.put('/api/devs/:id', devController.editDev)

router.delete('/api/devs/:id', devController.deleteDev)
