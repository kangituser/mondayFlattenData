const { mainFunction } = require('../controllers/mainFunction');

module.exports = router => {

  router.get('/', mainFunction);

  return router;
}