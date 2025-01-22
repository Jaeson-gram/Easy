import express from 'express';
import writersController from '../controllers/writersController.js';
import Writer from '../models/Writer.js';
// import passport from 'passport';

const router = express.Router();

//register a new user
router.post('/register', writersController.createAccount);

//login
router.post('/login', writersController.login);

//home page upon auth
router.get('/home', async (request, response) => {

    // if (request.isAuthenticated()) {
    //     return response.status(200).json()
    // }

    // response.status(401).json({msg: 'Unauthorised'});
})

router.get('/find/:id', writersController.findWriter);
router.get('/get-all', writersController.getWriters);

//logout
router.get('/logout', writersController.logout);
export default router;