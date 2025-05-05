"use client";
import * as React from "react";
import { auth } from "@/firebase/firebase";
import { signOut } from "firebase/auth";

export interface UserType{
    email:string;
    name:string;
    photo:string;
    token:string;
}
const useAuth=()=>{
    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
    const [user,setUser]=React.useState<UserType|null>(null);
    const [loading,setLoading]=React.useState<boolean>(false);
    const login=(userData:UserType)=>{
        setUser(userData);
        setIsLoggedIn(true);
    }
    const logout=async()=>{
        setLoading(true);
        await signOut(auth); 
        localStorage.clear();
        sessionStorage.clear(); 
        setUser(null);
        setIsLoggedIn(false);
    
        
    }
    return {isLoggedIn,user,login,logout,loading,setLoading,setIsLoggedIn,setUser};
}
export default useAuth;