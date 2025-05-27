import { NextRequest, NextResponse } from "next/server";

import { api } from "@/lib/utils";

type LoginTeamInput = {
    email: string;
    password: string;
};

export async function POST(request: NextRequest): Promise<NextResponse> {
    const data = await request.json() as LoginTeamInput;
    if (!(
        data.email &&
        typeof data.email === "string" &&
        data.email.endsWith("@students.nsbm.ac.lk")
    )) {
        return NextResponse.json({ success: false }, {
            status: 400
        })
    }

    const searchRes = await api({
        path: "/users",
        params: {
            q: data.email,
            field: "email"
        }
    });

    if (searchRes == null) {
        return NextResponse.json({ success: false }, {
            status: 500
        })
    }

    if (searchRes.meta.pagination.total == 0) {
        return NextResponse.json({ success: false }, {
            status: 400
        })
    }

    const user = searchRes.data[0]

    if (user.team_id) {
        return NextResponse.json({ success: false }, {
            status: 400
        })
    }
}
