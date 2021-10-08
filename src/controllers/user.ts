import db from "../models/database";
import { Request, Response } from 'express'

import User from "../models/user";


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

export async function createNewUser(req: Request, res: Response) {

  const body = req.body

  if (!body) {
    res.status(300).send("Body is required for this route.")
    return
  } else {
    let message: string = "Required fields left blank: ["
    let errored: boolean = false

    if (!body.firstname) {
      message += " firstname "
      errored = true
    }
    if (!body.lastname) {
      message += " lastname "
      errored = true
    }
    if (!body.username) {
      message += " username "
      errored = true
    }
    if (!body.password) {
      message += " password "
      errored = true
    }
    if (!body.email) {
      message += " email "
      errored = true
    }

    console.log(body);



    if (errored === true) {
      message += "]"
      res.status(300).send(message)
    }
  }

  console.log(req.body);


  const NEW_USER = {
    firstname: body.firstname, // required
    lastname: body.lastname,  // required
    username: body.username, // required
    displayname: body.displayname || body.username,
    email: body.email, // required
    password: body.password, // required
    sex: body.sex || false,
    gender: body.gender || 'FexEx',
    profilepicture: null
  }

  const result = await db(uploadUser)

  console.log(result);

  res.send(result)


  async function uploadUser(collections: any) {
    const result = await collections['user'].insertOne(NEW_USER)

    return result
  }

  //   new User(body._id, body.firstname, body.lastname,
  // body.username, body.displayname, body.email, body.password, body.sex, body.gender)


}
