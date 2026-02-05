import { db } from "@/db";
import { agents } from "@/db/schema";

export const getAgent = async ()=>{
     const data = await db
     .select()
     .from(agents);

     return data ;
}