//  Jilmar Calderon port 3003
import { createClient } from '@supabase/supabase-js';
const port = 3003;
import express from 'express';
import customerRoutes from './routes/customerRoutes.js';

//mongoose.connect(`mongodb+srv://jhoelcalderon1711_db_user:qEOi2ZUQOA0xIQ8c@cluster0.d6bnurd.mongodb.net/?appName=Cluster0`);

const supabaseUrl = 'https://kljlrchsawiteqearbgy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsamxyY2hzYXdpdGVxZWFyYmd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2Njg3ODQsImV4cCI6MjA5MzI0NDc4NH0.scWeGSJmm7xgxKg6F2sGqMTQsIATdX58AB0ZSZrXnvI';

export const supabase = createClient(supabaseUrl, supabaseKey);

app.use('/customers', customerRoutes);

app.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));
/*
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Calderon System connected to MongoDb Database"));
app.use(express.json());
const customerRouter = require("./routes/customerRoutes");
app.use("/computerstore", customerRouter);
app.listen(port, () => console.log("Calderon Computers Store Server is running on port --> " + port));*/