import { api } from "@/lib/utils";

type LoginTeamInput = {
    email: string;
    password: string;
};

export async function login(data: LoginTeamInput) {
    const res = await api({
        path: "/users",
        params: {
            q: data.email,
            field: "email"
        }
    });

    console.log(res)
}
