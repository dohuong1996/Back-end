const userController = require('../api/controllers/user/user-controller');
const customerController = require('../api/controllers/customer/customer-controller');

function router(app) {
    app.get('/', (req, res, next) => {
       userController.index(req, res, next);
    }),

    app.post('/add-user', (req, res, next) => {
        userController.addUser(req, res, next);
    }),

    app.get('/get-data-customer', (req, res, next) => {
        customerController.getAllCustomer(req, res, next);
    }),
    app.post('/add-customer', (req, res, next) => {
        customerController.addCustomer(req, res, next);
    }),
    app.delete('/delete-customer', (req, res, next) => {
        customerController.deleteCustomer(req, res, next);
    })

    app.get('/get-user', (req, res, next) => {
        userController.getAllUser(req, res, next);
    }),
    app.post('/add-user', (req, res, next) => {
        userController.addUser(req, res, next);
    }),
    app.put('/update-user', (req, res, next) => {
        userController.updateUser(req, res, next);
    }),
    app.delete('/delete-user', (req, res, next) => {
        userController.deleteUser(req, res, next);
    })
}

module.exports = router;