// This file was made for the purpose of initializing the database with some data.
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initdata = require("./data.js");

async function main()
{
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    }

    main().then(()=>
    {
        console.log("Connected to database");
    }).catch(err => console.log(err));

    const initdb = async () => {
    //await Listing.deleteMany({});  // delte existing
   // initdata.data = initdata.data.map((obj)=>({...obj,owner :"67ae4cd469acd783a6d88863"})) // we are assigning same owner , we accessed initdata.data .data means accessed array then ...obj is we are applying owner functionality to all the listing in arrays
    await Listing.insertMany(initdata.data).catch(e => console.log(e));// inserted new data
        console.log("Data inserted");
    }

    initdb(); // call the function