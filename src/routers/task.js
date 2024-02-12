const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Task = require('../models/task')

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=0
//GET /tasks?sortBy=createdAt:asc or desc

router.get('/tasks',auth,async(req,res)=>{
    const match = {}
    const sort = {}

   if(req.query.completed){
     match.completed = req.query.completed ==='true'
   }

   if(req.query.sortBy){
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] ==='desc'?-1:1
   }
    try{
      // const tasks = await Task.find({owner:req.user._id})
      await req.user.populate({
        path:'tasks',
        match,
        options:{
            limit:parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort
        }
      })
       res.send(req.user.tasks)
     // res.send(tasks)
    }
    catch(e){
        res.status(500).send(e)
    }
  
})

router.get('/tasks/:id',auth,async(req,res)=>{
    const  _id  = req.params.id
    try{
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task)
        {
             return res.status(404).send()
        }
        
             res.send(task)
    }
    catch(e){
        res.status(500).send()
    }
    
})

router.post('/tasks',auth,async(req,res)=>{
    //const task = new Task(req.body)
   
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
    
})


router.patch('/tasks/:id',auth,async(req,res)=>{
    console.log(req.params.id)
    const update = Object.keys(req.body)
    const allowed = ['completed']
    const valid = update.every((updates)=>allowed.includes(updates))
    if(!valid){
        return res.status(500).send({error:'Invalid values'})
    }
    try{
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})
        if(!task){
            return res.status(404).send()
        }
        await task.save();
        res.status(200).send(task);
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task =await Task.findByIdAndDelete({ _id: req.params.id})
        if(!task){
            return res.status(404).send(e)
        }

        res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})


module.exports=router