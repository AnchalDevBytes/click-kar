"use client";

import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignOut = () => {

    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const signOut = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get("/api/logout");
            if(!response || !response.data.success) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: response.data?.message,
                })
            }
            router.replace("/signup");

        } catch (error) {
            if(error instanceof AxiosError) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.response?.data?.message,
                })
                return;
            }
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong",
            })
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <button onClick={() => signOut()} className="bg-purple-600 text-white px-4 py-2 rounded-md">
    {
        isLoading ? "Signing out..." : "Sign out"
    }
  </button>
  )
}

export default SignOut