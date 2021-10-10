import db from "../models/database";
import { Request, Response } from 'express'

import User from "../models/user";



/**************************************************
 *
 *                  Get New User
 *
***************************************************/
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


/**************************************************
 *
 *                  Create New User
 *
***************************************************/

export async function createNewUser(req: Request, res: Response) {

  const body = req.body


  // check the body for request errors
  if (!body) {
    res.status(300).send("Body is required for this route.")
    return
  } else {
    let message: string = "Required fields left blank: ["
    let badRequest: boolean = false

    if (!body.firstname) {
      message += " firstname "
      badRequest = true
    }
    if (!body.lastname) {
      message += " lastname "
      badRequest = true
    }
    if (!body.username) {
      message += " username "
      badRequest = true
    }
    if (!body.password) {
      message += " password "
      badRequest = true
    }
    if (!body.email) {
      message += " email "
      badRequest = true
    }

    console.log(body);



    if (badRequest === true) {
      message += "]"
      res.status(300).send(message)
      return
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



  // Database Interaction Function
  async function uploadUser(collections: any) {
    const result = await collections['user'].insertOne(NEW_USER)

    return result
  }

  //   new User(body._id, body.firstname, body.lastname,
  // body.username, body.displayname, body.email, body.password, body.sex, body.gender)


}
