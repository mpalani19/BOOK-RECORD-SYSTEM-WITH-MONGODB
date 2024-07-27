const express=require("express")
const {books}=require("../data/books.json");
const {users}=require("../data/users.json");

const router=express.Router();



/**
*route: /books
*method:get
*descriptions: all books available
*access:Public
*parameter:None
*/

router.get("/",(req,res)=>{
    res.status(200).json({
        success: true,
        data:books
    })
})

/**
*route: /books/:id
*method:get
*descriptions: get single books by their id
*access:Public
*parameter:id
*/

router.get("/:id",(req,res)=>{
    const {id} = req.params;
    const book=books.find((each)=> each.id === id);
    if (!book){
        res.status(404).json({
            success:false,
            message:"User Not Found For The Given Id"
        })
    }
    return res.status(200).json({
        success:true,
        data:book
    })
})

/**
*route: /books
*method:post
*descriptions: create NEW BOOK
*access:Public
*parameter:None
*/

router.post("/",(req,res)=>{
    const {id,name,author,genre,price, publisher} = req.body;
    const book=books.find((each)=>each.id===id);
    if (book){
        return res.status(404).json({
            success:false,
            message:"Book with the given Id exist"
        })
    }
    books.push(
        {id,name,author,genre,price, publisher
        })
        return res.status(201).json({
            success: true,
            data: books
        })
})

/**
*route: /books/:id
*method:put
*descriptions: update book by their ID
*access:Public
*parameter: ID
*/

router.put('/:id', (req, res)=>{
    const {id} = req.params;
    const {data} = req.body;

    const book = books.find((each)=> each.id === id);
    if(!book){
        return res.status(404).json({
            success: false,
            message: "Book Not Found For The Given Id :-("
        })
    }

    const updateBook = books.map((each)=>{
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
        data: updateBook
    })

})

/**
*route: /books/:issued/by-user
*method:GET
*descriptions: Get all issued books
*access:Public
*parameter: None
*/

router.get("/issued/by-user",(req,res)=>{
    const userWithIssuedBooks = users.find((each)=>{
        if (each.issuedBook) return each;
    })

    const issuedbooks = [];

    

    userWithIssuedBooks.forEach((each)=>{
        const book = books.find((book)=> book.id === each.issueBook);

        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedbooks.push(book);
    })

    if (issuedbooks.length===0){
        return res.status(404).json({
            success:false,
            message: "No Books issued Yet"
        })
    }

    return res.status(200).json({
        success:true,
        data:issuedbooks,
    })
})

module.exports = router;