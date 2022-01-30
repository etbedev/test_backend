const express = require('express')
const model = require('../models')
const {
    Op
} = require("sequelize");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const multer = require('multer')
const fs = require('fs');
const { uploadFile } = require('../utils/imageupload');
const {
    User,
    AccessToken,
    RefreshToken
} = model


module.exports = {
    async register(req, res, next) {
        try {

            const user = await User.findOne({where : {email : {[Op.like] : req.body.email}}})
            if(user){
                return res.status(200).send({
                    success: false,
                    message: 'email sudah terdaftar silakan gunakan email yang lain',
                    data: {}
                })
            }
            const hashPassword = bcrypt.hashSync(req.body.password, 2);
            await User.create({
                lastName : req.body.lastName,
                firstName : req.body.firstName,
                email : req.body.email,
                password: hashPassword,
                image : req.file.filename
            })
            return res.status(200).send({
                success: true,
                message: 'Berhasil Daftar',
                data: {}
            })
        } catch (error) {
            console.log(error)
            return res.status(500).send({
                status: false,
                message: error
            })
        }
    },
    async login(req, res, next) {
        try {
            const {
                email,
                password
            } = req.body;
            const user = await User.findOne({
                where: {
                    email: email.toLowerCase()
                }
            })
            if (!bcrypt.compareSync(password, user.password)) {
                return res.status(401).send({
                    success: false,
                    message: 'Password salah'
                })
            }

            const access_token = crypto.randomBytes(20).toString('hex');
            const access_token_expires = new Date();
            access_token_expires.setDate(access_token_expires.getDate() + 7);
            await AccessToken.create({
                user_id: user.id,
                access_token,
                expire: access_token_expires,
            });

            const refresh_token = crypto.randomBytes(20).toString('hex');
            const refresh_token_expires = new Date();
            refresh_token_expires.setDate(refresh_token_expires.getDate() + 30);
            await RefreshToken.create({
                ser_id: user.id,
                refresh_token,
                expire: refresh_token_expires,
            })

            return res.status(200).send({
                success: true,
                message: 'Berhasil Login',
                data: {
                    access_token,
                    refresh_token,
                    email: user.email,
                    name: user.firstName
                }
            })
        } catch (error) {
            console.log(error)
            return res.status(500).send({
                status: false,
                message: error
            })
        }
    },
    async refreshToken(req, res) {
        try {
          const { refresh_token } = req.body;
          const refreshToken = await RefreshToken.findOne({ where: { refresh_token } });
          if (!refreshToken) {
            return res.status(400).send({
              success: false,
              message: 'Refresh token tidak valid'
            })
          };
    
          await refreshToken.destroy();
          
          const new_access_token = crypto.randomBytes(20).toString('hex');
          const access_token_expires = new Date();
          access_token_expires.setDate(access_token_expires.getDate() + 7);
          await AccessToken.create({
            user_id: refreshToken.user_id,
            access_token: new_access_token,
            expire: access_token_expires,
          });
          const new_refresh_token = crypto.randomBytes(20).toString('hex');
          const refresh_token_expires = new Date();
          refresh_token_expires.setDate(refresh_token_expires.getDate() + 30);
          await RefreshToken.create({
            user_id: refreshToken.user_id,
            refresh_token: new_refresh_token,
            expire: refresh_token_expires,
          })
          
          return res.status(200).send({
            success: true,
            message: 'Berhasil refresh token',
            data: { access_token: new_access_token, refresh_token: new_refresh_token }
          })
        } catch (error) {
          return res.status(500).send({
            success: false,
            message: error.message || 'Gagal memperbarui token, silahkan coba lagi',
          });
        }
      },
}