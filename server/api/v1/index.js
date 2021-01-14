const { Router } = require('express');
const router = Router();

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

router.use('/scheduling', require('./scheduling'));
router.use('/equipment', require('./equipment'));
// router.use('/image',checkToken, require('./image'));

router.use(unknownEndpoint);

module.exports = router;
