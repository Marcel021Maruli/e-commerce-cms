'use strict'
require('dotenv').config()
const { User } = require('../models')
const bcrypt = require('../helpers/bcrypt')

class UserController {
  static registerAdmin(req, res, next) {
    const { username, password, email } = req.body
    User
      .create({
        username,
        password,
        email,
        admin = true
      })
      .then(data => {
        res.status(201).json(data)
      })
      .catch(err => {
        next(err)
      })
  }
  static registerUser(req, res, next) {
    const { username, password, email } = req.body
    User
      .create({
        username,
        password,
        email,
        admin = false,
      })
      .then(data => {
        res.status(201).json(data)
      })
      .catch(err => {
        next(err)
      })
  }

  static allUsers(req, res, next) {
    User
      .findAll()
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => {
        next(err)
      })
  }
  static login(req, res, next) {
    const { email, password } = req.body
    User
      .findOne({
        where: {
          email: email
        }
      })
      .then(data => {
        if (!data) {
          throw {
            status: 400,
            msg: 'Your email not found!'
          }
        } else {
          if (data && bcrypt.compare(password, data.password)) {
            const payload = {
              id: data.id,
              email: data.email,
              username: data.username
            }
            const token = jwt.sign(payload, process.env.SECRET)
            res.status(200).json(token)
          } else if (data && !bcrypt.compare(password, data.password)) {
            throw {
              status: 400,
              msg: 'Wrong Password!!!'
            }
          }
        }
      })
      .catch(err => {
        next(err)
      })
  }
}

module.exports = UserController