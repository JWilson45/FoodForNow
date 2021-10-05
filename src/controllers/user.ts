import db from "../models/database";
import { Request, Response } from 'express'

import User from "../models/user";


const jason = new User('6153c5f91647639b2fa518b5', "Jason", "Wilson", "jwil", 'jwil', 'password', 'json', true, 'USPS')

console.log(jason);

export async function getUser(req: Request, res: Response) {


  const results = await db(gettheuser)

  res.send(results)


  async function gettheuser(collections: any) {

    const userList: Array<User> = []

    await collections['user'].find({}).forEach((doc) => {

      userList.push(new User(doc._id, doc.fisrtname, doc.lastname, doc.username,
        doc.displayname, doc.email, doc.password, doc.sex, doc.gender))

    })


    return userList

  }


}


export function test(req: Request, res: Response) {
  res.send('Hello from the default exported thing to make things super simple')
}
