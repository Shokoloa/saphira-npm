require("dotenv").config();

const Application = require("./dist").default;

const API_TOKEN = process.env.SAPHIRA_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const USER_ID = process.env.USER_ID;

if (!API_TOKEN) {
    throw new Error("SAPHIRA_TOKEN est manquant dans le fichier .env");
}

if (!GUILD_ID) {
    throw new Error("GUILD_ID est manquant dans le fichier .env");
}

if (!USER_ID) {
    throw new Error("USER_ID est manquant dans le fichier .env");
}

async function main() {
    console.log("🔑 Connexion à l'API Saphira...");

    try {
        const api = await Application.login({
            apiToken: API_TOKEN,
            version: "@latest"
        });

        console.log("✅ Token valide !\n");

        // ================================
        // VOTES
        // ================================

        console.log("🗳️ Récupération des votes...");

        const votes = await api.getGuildVotes(GUILD_ID);

        console.log(`✅ ${votes.length} vote(s) récupéré(s)`);
        console.dir(votes, { depth: null });

        console.log("\n🔎 Vérification du vote utilisateur...");

        const hasVoted = await api.hasUserVoted(
            GUILD_ID,
            USER_ID
        );

        console.log(`✅ A voté : ${hasVoted}`);

        // ================================
        // BUMPS
        // ================================

        console.log("\n🚀 Récupération des bumps...");

        const bumps = await api.getGuildBumps(GUILD_ID);

        console.log(`✅ ${bumps.length} bump(s) récupéré(s)`);
        console.dir(bumps, { depth: null });

        console.log("\n🔎 Vérification du bump utilisateur...");

        const hasBumped = await api.hasUserBumped(
            GUILD_ID,
            USER_ID
        );

        console.log(`✅ A bump : ${hasBumped}`);

        // ================================
        // REVIEWS
        // ================================

        console.log("\n⭐ Récupération des reviews...");

        const reviews = await api.getGuildReviews(GUILD_ID);

        console.log(
            `✅ ${reviews.reviews.length} review(s) récupérée(s)`
        );

        console.dir(reviews, { depth: null });

        // ================================
        // ACHIEVEMENTS SERVEUR
        // ================================

        console.log("\n🏆 Récupération des achievements du serveur...");

        const guildAchievements =
            await api.getGuildAchievements(GUILD_ID);

        console.log(
            `✅ ${guildAchievements.length} achievement(s) récupéré(s)`
        );

        console.dir(guildAchievements, { depth: null });

        // ================================
        // ACHIEVEMENTS UTILISATEUR
        // ================================

        console.log("\n🏆 Récupération des achievements utilisateur...");

        const userAchievements =
            await api.getUserAchievements(USER_ID);

        console.log(
            `✅ ${userAchievements.length} achievement(s) récupéré(s)`
        );

        console.dir(userAchievements, { depth: null });

        console.log("\n🎉 Tous les tests ont réussi !");
    } catch (error) {
        console.error("\n❌ Le test a échoué.");

        if (error instanceof Error) {
            console.error(`Message : ${error.message}`);

            if (error.stack) {
                console.error("\nStack :");
                console.error(error.stack);
            }
        } else {
            console.error(error);
        }

        process.exitCode = 1;
    }
}

main();