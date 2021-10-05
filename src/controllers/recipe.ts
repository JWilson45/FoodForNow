import db from "../models/database";
import { Request, Response } from 'express'


export async function getRecipe(req: Request, res: Response) {


  const results = await db(gettherecipe)

  res.send(results)


  async function gettherecipe(collections: any) {

    const recipe = await collections['recipe'].find({}).toArray()

    console.log(recipe);

    return recipe

  }


}


export function test(req: Request, res: Response) {
  res.send('Hello from the default exported thing to make things super simple')
}
