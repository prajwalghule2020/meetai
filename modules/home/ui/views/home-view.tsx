'use client'

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const HomeView = () =>{
  const router = useRouter();
  const {data : session} = authClient.useSession();
  if(!session){
    return(
      <p>Loading...</p>
    )
  }
  return (
    <div className="">
      Home view
    </div>
  )
}





