const express = require('express')
const model = require('../models')
const bcrypt = require('bcryptjs')
const client = require('../middleware/redis-client')

const {
User
} = model



module.exports = {
    async finduser(req,res,next){
        try{
            const user = await User.findAll({
               attributes :  {exclude : ['createdAt', 'updatedAt', 'password']}
            })
            const users = JSON.parse(JSON.stringify(user))
            await client.getAsync(JSON.stringify(users))
                
            return res.status(200).send({
                    status : true,
                    message : 'Sukses mendapatkan List User',
                    data :{ users }
                })

        }catch(error){
            console.log(error)
            return res.status(500).send({
                status : false,
                message : 'Gagal Menampilkan List User'
        })
    }
  },
  async updateUser(req, res, next) {
      try{
        const {id} = req.params
        const hashPassword = bcrypt.hashSync(req.body.password, 2);
        const user = await User.update({
            lastName : req.body.lastName,
            firstName : req.body.firstName,
            email : req.body.email,
            password: hashPassword,
            image : req.file.filename
        }, {where : {id : id}})

        return res.status(200).send({
            status : true,
            message : 'Sukses mengedit User',
            data :{ user }
        })
      }catch(error){
        console.log(error)
        return res.status(500).send({
            status : false,
            message : 'Gagal Mengedit Data'
    })
    }
  },
  async deleteUser(req, res, next){
      try{
        const {id} = req.params
        await User.destroy({
            where : {id : id}
        })
        return res.status(200).send({
            status : true,
            message : 'Sukses Mendelete User',
            data :{  }
        })
      }catch(err){
        console.log(error)
        return res.status(500).send({
            status : false,
            message : 'Gagal Delete Data'
    })
      }
  }
}