import db from "../models/database";
import { Request, Response } from 'express'


export async function getMeal(req: Request, res: Response) {


  const results = await db(getthemeal)

  res.send(results)


    async function getthemeal(collections: any) {

    const meal = await collections['meal'].find({}).toArray()

    console.log(meal);

    return meal

  }


}


export function test(req: Request, res: Response) {
  res.send('Hello from the default exported thing to make things super simple')
}
