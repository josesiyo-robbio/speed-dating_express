


require('dotenv').config();
const moduleBODYPARSER  =   require('body-parser');
const moduleEXPRESS     =   require('express');
const moduleCORS        =   require('cors');



//------------------ROUTES IMPORTS---------------------------------------------------|

//KITTENS
const routesEvents            =   require('./src/routes/eventRoutes');




//------------------ROUTES IMPORTS---------------------------------------------------|





//---------------------Cors Config & Other Stuff-------------------------------------|

const app   = moduleEXPRESS();
const PORT  = process.env.PORT || 3000;

const corsOptions = {origin: 'http://localhost:8080', };
app.use(moduleEXPRESS.json());
app.use(moduleCORS(corsOptions));
app.use(moduleBODYPARSER.json());
app.use(moduleBODYPARSER.urlencoded({ extended: true }));

//---------------------Cors Config & Other Stuff-------------------------------------|





//-----------APIs SECTION-------------------------------------------------------------|

//KITTENS
app.use('/api',routesEvents);


//-----------APIs SECTION------------------------------------------------------------------|





//--------------------SERVER SECTION-------------------------------|

app.use((err, req, res, next) =>
{
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
});


//se inicia el servidor
app.listen(PORT, () =>
{
    console.log(`Server is running on port ${PORT}`);
});

//--------------------SERVER SECTION-------------------------------|