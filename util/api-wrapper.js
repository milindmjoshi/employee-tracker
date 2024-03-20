const db = require("../db/connection");

// Wraps the given query and params in a promise
const dbAPIPromiseWrapper = function dbAPIPromiseWrapper(query, params) {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, rows, fields) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    })
}

module.exports = {dbAPIPromiseWrapper}