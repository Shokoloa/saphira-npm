export interface ApplicationOptions {
    apiToken: string;
    version: string;
}

export interface Review {
    author: {
        displayName: string;
        avatar: string | null;
    };
    content: string;
    rating: number;
}

export interface ReviewsResponse {
    reviews: Review[];
}

export interface Vote {
    userId: string;
    votedTimestamp: string | number;
    [key: string]: unknown;
}

export interface Bump {
    userId: string;
    bumpedTimestamp: string | number;
    [key: string]: unknown;
}

export interface CheckResponse {
    response: boolean;
}

export interface Achievement {
    [key: string]: unknown;
}

export default class Application {
    private readonly apiToken: string;
    private readonly version: string;

    constructor({ apiToken, version = '@latest' }: ApplicationOptions) {
        if (!apiToken) throw new Error('ERR_MISSING_FIELDS');
        this.apiToken = apiToken;
        this.version = version;
    }

    // Authentifie le token auprès de l'API publique
    static async login(options: ApplicationOptions): Promise<Application> {
        if (!options.apiToken) throw new Error('ERR_MISSING_FIELDS');

        const application = new Application(options);
        await application.request(`/check-token?version=${options.version || '@latest'}`);
        return application;
    }

    // Effectue une requête vers l'API publique Saphira.
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(`https://api.saphira-bump.fr${endpoint}?version=${this.version}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.apiToken,
                ...options.headers,
            },
        });

        if (!response.ok) {
            let error: unknown;
            try { error = await response.json(); } catch { error = null; }
            throw new Error(typeof error === 'object' && error !== null && 'response' in error && typeof error.response === 'string' ? error.response : `API error: ${response.status}`);
        }

        return response.json() as Promise<T>;
    }

    // Récupère les derniers votes d'un serveur.
    async getGuildVotes(guildId: string): Promise<Vote[]> {
        return this.request<Vote[]>(`/guild/${guildId}/votes`);
    }

    // Vérifie si un utilisateur a voté récemment pour un serveur.
    async hasUserVoted(guildId: string, userId: string): Promise<boolean> {
        const response = await this.request<CheckResponse>(`/guild/${guildId}/votes/check/${userId}`);
        return response.response;
    }

    // Récupère les derniers bumps d'un serveur.
    async getGuildBumps(guildId: string): Promise<Bump[]> {
        return this.request<Bump[]>(`/guild/${guildId}/bumps`);
    }

    // Vérifie si un utilisateur a bump récemment un serveur.
    async hasUserBumped(guildId: string, userId: string): Promise<boolean> {
        const response = await this.request<CheckResponse>(`/guild/${guildId}/bumps/check/${userId}`);
        return response.response;
    }

    // Récupère les avis d'un serveur.
    async getGuildReviews(guildId: string): Promise<ReviewsResponse> {
        return this.request<ReviewsResponse>(`/guild/${guildId}/reviews`);
    }

    // Récupère les achievements d'un serveur.
    async getGuildAchievements(guildId: string): Promise<Achievement[]> {
        return this.request<Achievement[]>(`/guild/${guildId}/achievements`);
    }

    // Récupère les achievements d'un utilisateur.
    async getUserAchievements(userId: string): Promise<Achievement[]> {
        return this.request<Achievement[]>(`/user/${userId}/achievements`);
    }
}