"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useState } from "react";


export default function Home() {
  const [name , setName] = useState("");
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");

  const onSubmit = async ()=>{
    authClient.signUp.email({
      email,
      name,
      password
    },{
      onError: (ctx) => {
            // display the error message
            alert(ctx.error.message);
        }
    })
  }

  const {data: session} = authClient.useSession();
  
  if(session){
    return(
      <div className="flex flex-col p-4 gap-y-4">
        <p>Logged in as {session.user?.name}</p>
        <Button onClick={() => authClient.signOut()}>
          Sign Out
        </Button>

      </div>
    )
  }
  
  return (
    <div>
      <Input
      placeholder="name"
      value={name}
      onChange={(e)=>setName(e.target.value)}
      />
       <Input
      placeholder="email"
      value={email}
      onChange={(e)=>setEmail(e.target.value)}
      />
       <Input
      placeholder="password"
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
      />
      <Button onClick={onSubmit}>
        Register
      </Button>
    </div>

  );
}
