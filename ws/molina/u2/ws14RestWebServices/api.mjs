import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const port = process.env.API_PORT || 4010;
const mongoURI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

const messageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Message = mongoose.model('Message', messageSchema);

app.get('/', (req, res) => {
    res.json({
        message: 'API funcionando correctamente',
        endpoint: 'POST /messages'
    });
});

app.post('/messages', async (req, res) => {
    try {
        const { name, message } = req.body;

        const newMessage = new Message({
            name,
            message
        });

        await newMessage.save();

        res.status(201).json({
            message: 'Message saved successfully',
            data: newMessage
        });
    } catch (error) {
        res.status(400).json({
            message: 'Failed to save message',
            error: error.message
        });
    }
});

mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB');

        app.listen(port, () => {
            console.log(`API server running at http://localhost:${port}/`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });