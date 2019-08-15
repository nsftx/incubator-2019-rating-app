const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const emoticonsGroupsController = require('../controllers/emoticonsGroups');


// get all
router.get('/', auth, emoticonsGroupsController.getAllGroups);
// post
router.post('/', auth, emoticonsGroupsController.createGroup);
//  array post
router.post('/many', auth, emoticonsGroupsController.createMany);
// put
router.put('/:id', auth, emoticonsGroupsController.updateGroup);
// get one
router.get('/:id', auth, emoticonsGroupsController.getOne);
// delete
router.delete('/:id', auth, emoticonsGroupsController.deleteGroup);


module.exports = router;
