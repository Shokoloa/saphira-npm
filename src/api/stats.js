const request = require("../utils/request");

async function getStats(client) {
    return request(client, "/stats");
}

module.exports = {
    getStats
};