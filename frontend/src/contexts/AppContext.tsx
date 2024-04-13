import React
, { useContext } from "react";

type ToastMessage = {
    message: string;
    type: "SUCCESS"|"ERROR";
}
//type for toast messages
type AppContext = {
    showToast: (toastMessage: ToastMessage)=>void;
}
//Constructing the context
const AppContext = React.createContext<AppContext | undefined>(undefined);
//Constructing the provider
export const AppContextProvider = ({ children } : { children: React.ReactNode }) => {
    return (
        <AppContext.Provider value={{
            showToast: (toastMessage) => {
                console.log(toastMessage);
            }
        }}>
            {children}
        </AppContext.Provider>
    );
};
//constructing the hook
export const useAppContext = () => {
    const context = useContext(AppContext);
    return context as AppContext;
}