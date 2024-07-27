const express=require("express")
const {users}=require("../data/users.json");
const router=express.Router();

/**
*route: /users
*method:get
*descriptions: get all users
*access:Public
*parameter:None
*/

router.get("/",(req,res)=>{
    res.status(200).json({
        success: true,
        data:users
    })
})

/**
*route: /users/:id
*method:get
*descriptions: get all users by their id
*access:Public
*parameter:id
*/

router.get("/:id",(req,res)=>{
    const {id} = req.params;
    const user=users.find((each)=> each.id === id);
    if (!user){
        res.status(404).json({
            success:false,
            message:"User Not Found For The Given Id"
        })
    }
    return res.status(200).json({
        success:true,
        data:user
    })
})

/**
*route: /users
*method:post
*descriptions: create new user
*access:Public
*parameter:None
*/

router.post("/",(req,res)=>{
    const {id,name,surname,email,subscriptionType, subscriptionDate} = req.body;
    const user=users.find((each)=>each.id===id);
    if (user){
        return res.status(404).json({
            success:false,
            message:"User with the given Id exist"
        })
    }
    users.push(
        {id,name,surname,email,subscriptionType, subscriptionDate
        })
        return res.status(201).json({
            success: true,
            data: users
        })
})

/**
*route: /users/:id
*method:put
*descriptions: update user by their ID
*access:Public
*parameter: ID
*/

router.put('/:id', (req, res)=>{
    const {id} = req.params;
    const {data} = req.body;

    const user = users.find((each)=> each.id === id);
    if(!user){
        return res.status(404).json({
            success: false,
            message: "User Not Found For The Given Id :-("
        })
    }

    const updateUser = users.map((each)=>{
        if(each.id===id){
            return {
                ...each,
                ...data
            }
        }
        return each;
    })
    return res.status(200).json({
        success: true,
        data: updateUser
    })

})

/**
*route: /users/:id
*method:Delete
*descriptions: Delete a user by their id
*access:Public
*parameter:id
*/

router.delete("/:id",(req,res)=>{
    const {id} = req.params;

    const user=users.find((each)=> each.id===id);
    if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found for the given id"
        })
    }
    const index = users.indexOf(user);
    users.splice(index,1);

    return res.status(200).json({
        success:true,
        data: users
    })
})

/*
route: /users/subscription-details/:id
*method:GET
*descriptions: Get all user subscription details ny their id
*access:Public
*parameter:id
*/

router.get('/subscription-details/:id',(req,res)=>{
    const {id} = req.params;

    const user=users.find((each)=> each.id===id);
    if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found for the subscription id"
        })
    }

    const getDateInDays = (data = "")=>{
        let date;
        if(data===""){
            //current Date
            date = new Date();
        }else{
            //getting date on basis of data variable
            date= new Date(data)
        }
        let days=Math.floor(date / (1000 * 60 * 60 * 24))
        return days;
    };

    const subscriptionType = (date)=>{
        if (user.subscriptionType === "Basic"){
            date = date + 90;
        }else if(user.subscriptionType === "Standard"){
            date = date + 180;
        }else if (user.subscriptionType === "Premium"){
            date = date + 365;
        }
        return date;
    };

    //this always calculations based on // JAN 1, 1970 UTC // Milli seconds
    let returnDate = getDateInDays(user.returnDate)
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);

    const data={
        ...user,
        subscriptionExpired: subscriptionDate < currentDate,
        daysLeftForExpiration: subscriptionExpiration <= currentDate ? 0 : subscriptionExpiration - currentDate,
        fine: returnDate < currentDate ? subscriptionExpiration <= currentDate ? 200 : 100  : 0 
    }

    return res.status(200).json({
        success:true,
        data,
    })
})

module.exports=router;