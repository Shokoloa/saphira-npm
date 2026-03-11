const { getStats } = require("./api/stats");

class client {
    constructor({ clientId, clientSecret, baseUrl = "https://api.saphira-bump.fr" }) {
        if (!clientId || !clientSecret) {
            throw new Error("clientId et clientSecret sont requis");
        }

        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.baseUrl = baseUrl;
    }

    async getStats() {
        return getStats(this);
    }
}

module.exports = client;