const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cors=require('cors');
const bodyParser=require('body-parser');
const {body, query, validationResult}=require('express-validator');
const validator=require('validator');

mongoose.connect('mongodb://localhost/exerciseLogger',{useUnifiedTopology:true, useNewUrlParser:true});

app.use(bodyParser.json({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));


const Schema=mongoose.Schema;
const Model=mongoose.model;

const userSchema=new Schema(
    {
        name:String,
        count:Number,
        logs:Array
    },
    {strict:false}
)
const userModel=Model('users',userSchema);


//two seperate collections: registration and exercise log doc because the project results will be similar to the demo's result
//-inefficiency: name and id are repeated in the second column. Might be better to store logs in an array in the registration document.
app.post('/api/exercise/new-user',[
    body('name').exists({checkNullL:true,checkFalsy:true})
] ,(req,res)=>{
    const {name} =req.body;
    console.log(name);
    console.log('name' in req.body);
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status('400').json({error:errors.array()});
    }else{
        userModel.findOne({name:name},(err,data)=>{
            if(err){
                res.json({error:err});
            }else{
                if(data){
                    return res.status('400').json({error:'The name entered already exists. Choose another name'});
                }else{
                    const user=new userModel({name:name});
                    user.count=0;
                    user.save((err,data)=>{
                        if(err){
                            return res.json({error:err});
                        }else{
                            res.json({id:data._id.toString(),name:name});
                        }
                    })
                }
            }
        })
    }
})

app.post('/api/exercise/add',[
    body('id').exists({checkNullL:true,checkFalsy:true}),
    body('description').exists({checkNullL:true,checkFalsy:true}),
    body('duration').exists({checkNullL:true,checkFalsy:true})
],(req,res)=>{
    const body=req.body;
    const {id}=body;
    const errors=validationResult(req);
    if(!errors.isEmpty()){//id filled in check. Could also require by front end
        res.status('400').json({error:errors.array()});
        return;
    }else{
        userModel.findById(id, (err,result)=>{
            if(err){
                res.json({error:err});
                return;
            }else{
                if(!result){//id exists check
                    res.status('404').json({error:'The id entered doesn\'t exist'});
                    return;
                }else{
                    const log={
                        description:body.description,
                        duration:body.duration
                    }                               //all required except  date
                    let {date}=body;    
                    console.log(date);  
                    if(date===undefined || date===""){
                        date=new Date();
                    }
                    else{
                        date=new Date(date);
                        if(isNaN(date)){
                            res.status('400').json({error:"invalid date"});
                            return;
                        }
                    }
                    log['date']=date; //if date was given, use it. If not, set the date to todays. 
         
                    result['logs'].push(log);
                    result['count']++;
                    result.save((err,result)=>{
                        if(err){
                           res.json({error:err});
                            return;
                        }else{
                            res.json(result);
                            return;
                        }
                    })
                }
            }
        })
    }
})

app.get('/api/exercise/log',
    [
        query('userId').exists({checkFalsy:true,checkNull:true})
    ],(req,res)=>{
        const errors=validationResult(req);
        if(!errors.isEmpty() ){
            res.status('400').json({error:errors.array()});
            return;
        }
        const {userId}=req.query;

        
        userModel.findById(userId, (err,data)=>{
            if(err){
                res.json({error:err});
            }else{
                if(!data){
                    return res.status('404').json({error:'The id entered doesn\'t exist'})
                }else{
                    let {from}=req.query;
                    let {to}=req.query;
                    let {limit}=req.query;
                    let noOptions=0;

                    //if statements account for single 'fors' and 'tos'/empty values and improper date formats. Missing or improper data don't stop the program. Instead, it
                    //uses the data inclusive default values
                    from=new Date(from);
                    if(isNaN(from)){
                        from=new Date(-8640000000000000);//min
                        noOptions++;
                    }

                    to=new Date(to);
                    if(isNaN(to)){
                        to=new Date(8640000000000000);//max
                        noOptions++;
                    }
                    
                    if(limit===undefined || !validator.isNumeric(limit)){
                        limit=-1
                        noOptions++;
                    }else{
                        limit=validator.toInt(limit);
                    }

                    const dataLogs=data.logs;
                    if(noOptions===3){//no specification therefore send all logs
                        return res.json({logs:dataLogs});
                    }
                    let result=[];
                    const size=data.logs.length;
                    for(let i=0, j=0; i<size && j!==limit;i++){
                        if(new Date(dataLogs[i].date)>=from && new Date(dataLogs[i].date)<=to && j!=limit){
                            result.push(dataLogs[i]);
                            ++j;
                        }
                    }
                    return res.json({logs:result});
                }
            }
        })
})

const PORT=process.env.PORT || 4000;
app.listen(PORT,()=>console.log(`port ${PORT} listening`));