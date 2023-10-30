const express = require('express')
const User = require ('../models/user')
const auth  = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, sendCancelationEmail} = require('../emails/account')

//for signup
router.post('/users',async(req,res)=>{
    // console.log(req.body)
    // res.send("testing")
    const user = new User(req.body)

    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
         res.status(201).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }

}) 

router.post('/users/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((Token)=>{
            return Token.token!=req.token
            
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens= []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
    
})



router.get('/users/me',auth,async(req,res)=>{
    try{
        // const users = await User.find({})
        // res.send(users)
        res.send(req.user)
    }
    catch(e){
        res.status(500).send()
    }
})

// router.get('/users/:id',async(req,res)=>{
//     const _id = req.params.id
//     try{
//         const user = await User.findById(_id)

//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }
//     catch(e){
//         res.status(500).send()
//     }
    
//})

router.patch('/users/me',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowed = ['name','age','email','password']
    const isvalid = updates.every((update)=>allowed.includes(update))
    if(!isvalid){
        return res.status(400).send({error:'Invalid values'})
    }
    try{
       // const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true})
        //const user = await User.findByIdAndUpdate(req.user._id)

        updates.forEach((update)=> req.user[update]=req.body[update]) 
        await req.user.save()
       
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth,async(req,res)=>{
    try{
        const user =await User.findByIdAndDelete(req.user._id)
         if(!user){
            return res.status(404).send()
         }
      // await req.user.remove()
        sendCancelationEmail(user.email,user.name)
        res.send(user)
      
    }
    catch(e){
        res.status(500).send(e)
    }
})

const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
          return  cb(new Error('It must be of type jpg, jpeg or png'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})


module.exports = router