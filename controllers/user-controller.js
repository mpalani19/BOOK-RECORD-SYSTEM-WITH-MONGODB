const {UserModel, BookModel} = require("../models");

exports.getAllUsers = async (req,res)=>{

    const users = await UserModel.find();

    if(users.length === 0)
        return res.status(404).json({
    success:false,
    message:"No books found"
        })

    res.status(200).json({
        success: true,
        data:users
    })
}

exports.getSingleUserById = async (req,res)=>{
    const {id} = req.params;

    const user = await UserModel.findById(id);
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
}

// router.post("/",(req,res)=>{
//     const {id,name,surname,email,subscriptionType, subscriptionDate} = req.body;
//     const user=users.find((each)=>each.id===id);
//     if (user){
//         return res.status(404).json({
//             success:false,
//             message:"User with the given Id exist"
//         })
//     }
//     users.push(
//         {id,name,surname,email,subscriptionType, subscriptionDate
//         })
//         return res.status(201).json({
//             success: true,
//             data: users
//         })
// })


exports.addNewUser = async (req,res)=>{
    const {name,surname,email,subscriptionType, subscriptionDate} = req.body;

    //const user=users.find((each)=>each.id===id);
    // if (user){
    //     return res.status(404).json({
    //         success:false,
    //         message:"User with the given Id exist"
    //     })
    // }
    // users.push(
    //     {id,name,surname,email,subscriptionType, subscriptionDate
    //     })

    const newUser = await UserModel.create({
        name,surname,email,subscriptionType, subscriptionDate
    })

        return res.status(201).json({
            success: true,
            data: newUser
        })
}



// router.put('/:id', (req, res)=>{
//     const {id} = req.params;
//     const {data} = req.body;

//     const user = users.find((each)=> each.id === id);
//     if(!user){
//         return res.status(404).json({
//             success: false,
//             message: "User Not Found For The Given Id :-("
//         })
//     }

//     const updateUser = users.map((each)=>{
//         if(each.id===id){
//             return {
//                 ...each,
//                 ...data
//             }
//         }
//         return each;
//     })
//     return res.status(200).json({
//         success: true,
//         data: updateUser
//     })
// })

exports.updateUserById = async (req, res)=>{
    const {id} = req.params;
    const {data} = req.body;

    //const user = users.find((each)=> each.id === id);

    const updatedUserData = await UserModel.findOneAndUpdate({
        _id:id
    },{
        $set:{
            ...data,
        }
    },{new: true})

    if(!user){
        return res.status(404).json({
            success: false,
            message: "User Not Found For The Given Id :-("
        })
    }

    // const updateUser = users.map((each)=>{
    //     if(each.id===id){
    //         return {
    //             ...each,
    //             ...data
    //         }
    //     }
    //     return each;
    // })
    return res.status(200).json({
        success: true,
        data: updatedUserData
    })
}


// router.delete("/:id",(req,res)=>{
//     const {id} = req.params;

//     const user=users.find((each)=> each.id===id);
//     if(!user){
//         return res.status(404).json({
//             success:false,
//             message:"User not found for the given id"
//         })
//     }
//     const index = users.indexOf(user);
//     users.splice(index,1);

//     return res.status(200).json({
//         success:true,
//         data: users
//     })
// })


exports.deleteUser = async (req,res)=>{
    const {id} = req.params;

    //const user=users.find((each)=> each.id===id);
    
    const user = await UserModel.deleteOne({
        _id:id
    })
    if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found for the given id"
        })
    }
    // const index = users.indexOf(user);
    // users.splice(index,1);

    return res.status(200).json({
        success:true,
        data: user
    })
}




// router.get('/subscription-details/:id',(req,res)=>{
//     const {id} = req.params;

//     const user=users.find((each)=> each.id===id);
//     if(!user){
//         return res.status(404).json({
//             success:false,
//             message:"User not found for the subscription id"
//         })
//     }

//     const getDateInDays = (data = "")=>{
//         let date;
//         if(data===""){
//             //current Date
//             date = new Date();
//         }else{
//             //getting date on basis of data variable
//             date= new Date(data)
//         }
//         let days=Math.floor(date / (1000 * 60 * 60 * 24))
//         return days;
//     };

//     const subscriptionType = (date)=>{
//         if (user.subscriptionType === "Basic"){
//             date = date + 90;
//         }else if(user.subscriptionType === "Standard"){
//             date = date + 180;
//         }else if (user.subscriptionType === "Premium"){
//             date = date + 365;
//         }
//         return date;
//     };

//     //this always calculations based on // JAN 1, 1970 UTC // Milli seconds
//     let returnDate = getDateInDays(user.returnDate)
//     let currentDate = getDateInDays();
//     let subscriptionDate = getDateInDays(user.subscriptionDate);
//     let subscriptionExpiration = subscriptionType(subscriptionDate);

//     const data={
//         ...user,
//         subscriptionExpired: subscriptionDate < currentDate,
//         daysLeftForExpiration: subscriptionExpiration <= currentDate ? 0 : subscriptionExpiration - currentDate,
//         fine: returnDate < currentDate ? subscriptionExpiration <= currentDate ? 200 : 100  : 0 
//     }

//     return res.status(200).json({
//         success:true,
//         data,
//     })
// })


exports.getSubscriptionDetailsById = async (req,res)=>{
    const {id} = req.params;

    //const user=users.find((each)=> each.id===id);
    const user = await UserModel.findById(id);
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
}