const { Application } = require("saphira-bump");

(async () => {
    const app = await Application.create({
        clientId: "VOTRE_CLIENT_ID",
        apiToken: "VOTRE_API_TOKEN"
    });

    const stats = await app.getApplicationStats();
    console.log(stats);
})();