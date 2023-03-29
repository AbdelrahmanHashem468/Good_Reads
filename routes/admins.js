const express = require('express');
const { adminController } = require('../controllers');
const { asycnWrapper } = require('../libs')

const router = express.Router();


router.post('/login', async (req, res, next ) => {
    const { body : { email, password } } = req;
    const user = adminController.login(email, password);
    const [ error, data ] = await asycnWrapper(user);
    if(error){
        return next(error);
    }

    res.status(200).json(data);
});


module.exports = router;