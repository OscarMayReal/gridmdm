import { createContext, useContext, useEffect } from "react";
import { useAuth, useResources, AuthState, ResourcesState } from "keystone-lib";

const authContext = createContext({
    auth: null as AuthState | null,
    resources: null as ResourcesState | null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const auth = useAuth({ appId: process.env.NEXT_PUBLIC_KEYSTONE_APPID as string, keystoneUrl: process.env.NEXT_PUBLIC_KEYSTONE_URL as string });
    const resources = useResources({ appId: process.env.NEXT_PUBLIC_KEYSTONE_APPID as string, keystoneUrl: process.env.NEXT_PUBLIC_KEYSTONE_URL as string });
    useEffect(() => {
        if (auth.data?.user) {
            document.cookie = `keystone_session=${auth.data.sessionId}; path=/; max-age=3600; samesite=lax`;
        } else if (!auth.data?.user && auth.loaded) {
            window.location.href = process.env.NEXT_PUBLIC_KEYSTONE_URL + "/auth/signin?redirectTo=" + window.location.href;
        }
    }, [auth]);
    return <authContext.Provider value={{ auth, resources }}>{children}</authContext.Provider>
}

export function useAuthContext() {
    return useContext(authContext);
}