var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('transactions')

var service = {};
service.savetrx = savetrx;
service.getAllTransactions = getAllTransactions;

module.exports = service;

function getAllTransactions() {
    debugger;
    var deferred = Q.defer();

    db.transactions.find().toArray(function (err, transactions) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        // return transactions
        deferred.resolve(transactions);
    });

    return deferred.promise;
}

function savetrx(transaction) {
    debugger;
    var deferred = Q.defer();
    db.transactions.insert(
        transaction,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}