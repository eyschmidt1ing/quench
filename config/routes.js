var express = require('express'),
    router  = new express.Router(),
    passport = require('passport');

// Require controllers
var venuesController = require('../controllers/venues.js'),
    drinksController = require('../controllers/drinks.js'),
    reviewsController = require('../controllers/reviews.js');

function authenticatedUser(req, res, next) {
  // If the user is authenticated, then we continue the execution
  if (req.isAuthenticated()) return next();

  // Otherwise the request is always redirected to the home page
  res.redirect('/');
}

router.get('/auth/google', passport.authenticate(
  'google',
  {scope: ['profile', 'email']}
));

router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/drinks/selectType',
    failureRedirect: '/'
  }
));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/', function(req, res) {
  res.render('home', { user: req.user })
})

//Routes for Venue
router.route('/venues')
  .post(venuesController.createVenue)

router.route('/api/venues')
  .get(venuesController.index)

router.route('/venues/:id/adddrink')
  .get(authenticatedUser, venuesController.addDrink)

router.route('/venues/new')
  .get(authenticatedUser, venuesController.newVenue)

router.route('/api/drinks')
  .get(drinksController.index)
  .post(drinksController.createDrink)

router.route('/drinks/selectType')
  .get(drinksController.selectType)

router.route('/drinks/new')
  .get(authenticatedUser, drinksController.newDrink)

  // routes for lists by drinkType
router.route('/drinks/wine')
  .get(drinksController.wine)

// router.route('/drinks/:id')
router.route('/api/drinks/:id')
  .get(drinksController.showDrink)
  // .patch(drinksController.updateDrink)
  .delete(authenticatedUser, drinksController.destroyDrink)

router.route('/drinks/:id')
  .get(drinksController.show)

// // Routes for reviews
router.route('/reviews')
  .get(reviewsController.index)

router.route('/drinks/:id/review/new')
  .get(authenticatedUser, drinksController.newReview)
  .post(authenticatedUser, drinksController.addReview)

// // // // //
router.route('/drinks/:drink_id/review/:id')
  .get(authenticatedUser, drinksController.getReview)
  .patch(authenticatedUser, drinksController.updateReview)//not implemented
  // .delete(drinksController.deleteReview)//not implemented
// // // // //

module.exports = router;
