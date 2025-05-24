type LoginTeamInput = {
};

export async function login(data: LoginTeamInput) {
    try {
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "Failed to login member" };
    }
}
