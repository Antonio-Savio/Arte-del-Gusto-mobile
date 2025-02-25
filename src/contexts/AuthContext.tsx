import { useState, useEffect, createContext, ReactNode } from "react";
import { api } from "../services/api";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from "expo-router";

interface AuthContextData{
    user: UserProps | null;
    isAuthenticated: boolean;
    signIn: (credential: SignInProps) => Promise<void>;
    loadingAuth: boolean;
    signOut: () => Promise<void>;
    loading: boolean;
}

interface UserProps{
    id: string;
    name: string;
    email: string;
    token: string;
}

interface SignInProps{
    email: string;
    password: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({children}: {children: ReactNode}){
    const [user, setUser] = useState<UserProps | null>(null)
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function getUser(){
            const storagedItems = await AsyncStorage.getItem("user");
            let userInfo: UserProps = JSON.parse(storagedItems || '{}');
            
            const hasUser = Object.keys(userInfo).length > 0

            if(hasUser){
                api.defaults.headers.common['Authorization'] = `Bearer ${userInfo.token}`
            
                setUser({
                    id: userInfo.id,
                    name: userInfo.name,
                    email: userInfo.email,
                    token: userInfo.token
                })
            }

            setLoading(false)
        }

        getUser();
    }, [])

    const isAuthenticated = !!user;

    async function signIn({ email, password }: SignInProps){
        setLoadingAuth(true);

        try{
            const response = await api.post('/session', {
                email,
                password
            })

            const { id, name, token } = response.data;
            await AsyncStorage.setItem('user', JSON.stringify(response.data));
            
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`

            setUser({
                id,
                name,
                email,
                token
            })

            setLoadingAuth(false);

        } catch(err){
            console.log("Erro ao acessar", err);
            setLoadingAuth(false)
            return;
        }
    }

    async function signOut(){
        await AsyncStorage.clear()
        .then(() => setUser(null))
    }

    return(
        <AuthContext.Provider 
            value={{ 
                user, 
                isAuthenticated, 
                signIn, 
                loadingAuth, 
                signOut,
                loading
            }}>
            {children}
        </AuthContext.Provider>
    )
}