const _ = require('lodash');
// const moment = require('moment');
const User = require('../../../models/User');
const Customer = require('../../../models/Customer');
const validate = require('../../../common/validate');

function index(req, res, next) {
    User.find({}).then(users => {
        res.json(users);
    });
}

function checkMessage(req) {
    const resultUsername = validate.validateUserName(req.username);
    const resultEmail = validate.validateEmail(req.email);
    const resultPhone = validate.validatePhone(req.phone);
    let error = [];
    if (!resultUsername && !resultPhone && !resultEmail) {
        return;
    }
    if (resultUsername != null) {
        error.unshift('User name invalid');
    }
    if (resultPhone != null) {
        error.unshift('Phone invalid');
    }
    if (resultEmail != null) {
        error.unshift('Email invalid');
    }
    return error;
}

function addUser(req, res, next) {
    try {
        const body = req.body;
        const error = checkMessage(body);

        if (error && error.length === 0) {
            const newUser = new User({
                username: body.username,
                email: body.email,
                address: body.address,
                gender: body.gender,
                phone: body.phone,
                avatar: body.avatar,
                group: body.group,
                createdDate: new Date(),
            })
            newUser.save((err, dataSave) => {
                if (err) {
                    if (err.name === 'MongoError' && err.code === 11000) {
                        // Duplicate username
                        return res.status(500).send({ succes: false, message: 'User already exist!' });
                    }
                    console.log('[ERRORS]: save user error - ', err);
                    res.json({
                        status: 500,
                        message: 'Save User Error'
                    })
                }
                User.findOne
                res.json({
                    status: 200,
                    message: 'Save User successful',
                    dataSave
                })
            });
        } else {
            res.json({
                status: 400,
                message: error,
            })

        }
    } catch (error) {
        res.send('[ERROR]: save error: ', error);
        res.json({
            status: 500,
            message: 'Save user fail'
        })
    }

}

async function getAllUser(req, res, next) {
    const pageCurrent = parseInt(req.query.pageCurrent) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    try {
        let allUser = await new Promise((resolve, reject) => {
            User.find({}).limit(pageSize).skip((pageCurrent - 1) * pageSize).sort({ createdDate: 'desc' }).then(user => {
                if (user) {
                    resolve(user);
                }
                else {
                    reject({});
                }
            });
        });
        console.log(allUser);
        let totalUser = await new Promise((resolve, reject) => {
            User.countDocuments({}).exec((err, count) => {
                if (err) {
                    reject(0);
                } else {
                    resolve(count);
                }
            })
        });
        res.json({
            data: allUser,
            total: totalUser,
            message: 'Get data user success !'
        })
    } catch (error) {
        res.json({
            message: '[FAILURE]: get data user'
        })
    }
}

async function updateUser(req, res, next) {
    // cách 1: dùng findByIdAndUpdate(id, option, callback)
    // cách 2: dùng findbyId -> dùng save();
    let _id = req.body.id;
    // let _id = req.params.id;
    let body = req.body;
    const error = checkMessage(body);
    if (error && error.length === 0) {
        let updateUser = {
            username: body.username,
            email: body.email,
            address: body.address,
            gender: body.gender,
            phone: body.phone,
            avatar: body.avatar,
            group: body.group
        };
        User.findByIdAndUpdate(_id, { $set: updateUser }, { new: true })
            .then(data => {

                if (!data) {
                    res.json({
                        status: 404,
                        message: 'Data not found with id'
                    })
                }
                res.json({
                    status: 200,
                    message: 'Update user successful!',
                    data
                });
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    res.json({
                        status: 404,
                        message: 'User not found with id'
                    })
                } else {
                    res.json({
                        status: 500,
                        message: 'Error updating user with id'
                    })
                }
            });

    } else {
        res.json({
            status: 400,
            message: error
        })
    }

};
function deleteUser(req, res, next) {
    let _id = req.body.id;
    User.findByIdAndRemove(_id, (err, customer) => {
        if (err) {
            res.json({
                status: 500,
                message: 'Delete user fail !'
            })
        }
        res.json({
            status: 200,
            message: 'Delete user success'
        });
    });
}

async function sortData(req, res, next) {
    const sortName = req.query.sortname;
    let sortUser = await new Promise((resolve, reject) => {
        // if(sortName == 'username') 
        User.find({}).sort((a, b) => a.firstname.localeCompare(b.firstname)).then(user => {
            if (user) {
                resolve(user);
            }
            else {
                reject({});
            }
        });
    });
    res.json({
        data: sortUser,
        message: 'Get data user success !'
    })
}


module.exports = {
    index,
    addUser,
    getAllUser,
    updateUser,
    deleteUser,
    sortData
}