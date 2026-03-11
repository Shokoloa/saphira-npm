async function request(client, endpoint) {
    const url = `${client.baseUrl}${endpoint}`;

    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "x-client-id": client.clientId,
            "x-client-secret": client.clientSecret
        }
    });

    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    return res.json();
}

module.exports = request;