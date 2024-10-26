const {app, DataBaseConnection} = require('./app.js'); 
require('dotenv').config(); 
const PORT = process.env.PORT || 3000; 


app.listen(PORT, async ()=>{
    console.log(`Running Server Link : http://localhost:${PORT}`); 
    await DataBaseConnection(); 
}); 