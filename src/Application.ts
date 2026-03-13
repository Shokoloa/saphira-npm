export interface ApplicationOptions {
    clientId?: string
    apiToken: string
}

export default class Application {
    clientId: string | null;
    apiToken: string;

    constructor({ clientId, apiToken }: ApplicationOptions) {
        if (!apiToken) throw new Error("ERR_MISSING_FIELDS");

        this.clientId = clientId ?? null;
        this.apiToken = apiToken;
    }

    static async login(options: ApplicationOptions) {
        if (!options.apiToken) throw new Error("ERR_MISSING_FIELDS");

        const res = await fetch(`https://api.saphira-bump.fr/check-token?version=v6`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": options.apiToken
            }
        });

        if (!res.ok) throw new Error("ERR_INVALID_TOKEN");

        return new Application(options);
    }

    async getApplicationStats(): Promise<number> {
        if (!this.clientId || !this.apiToken) throw new Error("ERR_MISSING_FIELDS");

        const res = await fetch(`https://api.saphira-bump.fr/apps/${this.clientId}/stats`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.apiToken
            }
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        return res.status;
    }

    async postApplicationStats(data: {
        guild_count: number,
        user_count: number,
        shard_count?: number
    }): Promise<number> {

        if (!this.clientId || !this.apiToken)
            throw new Error("ERR_MISSING_FIELDS");

        const res = await fetch(`https://api.saphira-bump.fr/apps/${this.clientId}/stats`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.apiToken
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        return res.status;
    }
}