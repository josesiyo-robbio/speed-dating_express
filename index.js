


require('dotenv').config();
const express = require('express');
const cors = require('cors');



//------------------ROUTES IMPORTS---------------------------------------------------|
const routesEvents = require('./src/routes/eventRoutes');



//---------------------Cors Config & Other Stuff-------------------------------------|
const app = express();
const PORT = process.env.PORT || 3000;

//CORS
const corsOptions = { origin: 'http://localhost:8080' };
app.use(cors(corsOptions));

// Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//-----------APIs SECTION-------------------------------------------------------------|
app.use('/api', routesEvents);



//--------------------SERVER SECTION-------------------------------|
app.use((err, req, res, next) => {
    console.error('Error:', err); 
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
