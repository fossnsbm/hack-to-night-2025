type ApiRequest = {
    path: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    params?: Record<string, string>;
    body?: Record<string, any>;
};

export async function api({ path, method, params, body }: ApiRequest): Promise<Record<string, any> | null> {
    const init: RequestInit = {
        method: method ?? "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.CTFD_TOKEN}`
        },
    }

    const url = new URL("/api/v1" + path, process.env.CTFD_URL)

    if (params) {
        for (const param in params) {
            url.searchParams.set(param, params[param])
        }
    }

    if (body) {
        init.body = JSON.stringify(body)
    }

    try {
        const res = await fetch(url, init);
        const json = await res.json();

        return json
    } catch (e) {
        console.error("error while fetching", url, e);
    }

    return null
}

type ApiQueryRequest = {
    q: string;
    field: string;
    entity: string;
};

export async function apiQuery({ q, field, entity }: ApiQueryRequest): Promise<any[] | null> {
    const res = await api({
        path: "/" + entity,
        params: {
            q,
            field,
        }
    });

    if (res == null || !res.success || !res.data) {
        return null;
    }

    return res.data.filter((e: any) => e[field] == q)
}
