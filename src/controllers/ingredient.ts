import db from "../models/database";
import { Request, Response } from 'express'


export async function getIngredient(req: Request, res: Response) {


  const results = await db(gettheIngredient)

  res.send(results)


    async function gettheIngredient(collections: any) {

    const ingredient = await collections['ingredient'].find({}).toArray()

    console.log(ingredient);

    return ingredient

  }


}
