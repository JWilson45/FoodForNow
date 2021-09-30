import db from "../models/database";

export async function getUsers(req: Request, res: any) {


  const results = await db(gettheuser, res)

  res.send(results)


    async function gettheuser(collections: any) {

    const users = await collections['user'].find({})

    console.log(users);

    return users

  }


}
