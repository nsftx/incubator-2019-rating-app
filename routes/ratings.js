const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');

const ratingsController = require('../controllers/ratings');


/* GET all ratings. */
router.get('/', auth, ratingsController.getAllRatings);

/* get count of ratings in specified intervals */
router.post('/range', auth, ratingsController.getRatingsByHour);

router.post('/days', auth, ratingsController.getRatingsByDays);

router.post('/report', auth, ratingsController.getCountOfRatings);

/* get count of ratings in one day */
router.post('/count', auth, ratingsController.getCountOfRatingsDay);

/* GET one rating */
router.get('/:id', auth, ratingsController.getOneRating);

/* CREATE bulk of ratings */
router.post('/many', auth, ratingsController.createManyRatings);

/* ADD new rating */
router.post('/', ratingsController.createRating);

/* UPDATE rating */
router.put('/:id', auth, ratingsController.updateRating);

/* DELETE rating */
router.delete('/:id', auth, ratingsController.deleteRating);

module.exports = router;
