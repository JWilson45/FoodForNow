import db from "../models/database";
import { Request, Response } from 'express'


export async function getUsers(req: Request, res: Response) {


  const results = await db(gettheuser, res)

  res.send(results)


    async function gettheuser(collections: any) {

    const user = await collections['user'].find({})

    console.log(user);

    return user

  }


}


export function test(req: Request, res: Response) {
  res.send('Hello from the default exported thing to make things super simple')
}
