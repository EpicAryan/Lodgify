import { RegisterFormData } from "./pages/Register";

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    if (!API_BASE_URL) {
        throw new Error("API_BASE_URL is not defined");
    }
    
export const register = async (FormData: RegisterFormData) => {
    
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(FormData)
    });

    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
};

export const validateToken = async () =>{
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        credentials: "include"
    });

    if(!response.ok){
        throw new Error("Token invalid");
    }
    return response.json();
}