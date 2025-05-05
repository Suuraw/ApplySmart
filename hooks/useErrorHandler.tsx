import { useRouter } from "next/navigation";
import { useState,useCallback } from "react";
export function useErrorHandler(){
    const [error,setError]=useState<String|null>(null);
    const router=useRouter();
    const handleError=useCallback((err:unknown)=>{
     let message="An Unexpected error occurred"
     if(err instanceof Error)
     {
        message=err.message;
     }
     else if(typeof err==='string'){
        message=err
     }
     if(message.toLowerCase().includes("jwt expired")){
        router.push("/login");
     }
     else
     {
        setError(message);
     }
    },[router])
    const clearError=useCallback(()=>{
        setError(null)
    },[])
    return {error,handleError,clearError}
}