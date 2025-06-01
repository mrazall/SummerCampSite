const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const app = express();
const port = 3000;

// Настройка CORS
app.use(cors({
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Базовый GET-роут
app.get('/', (req, res) => {
    res.send('Добро пожаловать на сервер ИнтелЛето! Используйте /register для отправки формы.');
});

app.post('/register', async (req, res) => {
    try {
        console.log('Получен запрос на регистрацию:', req.body);
        const data = req.body;
        await fs.appendFile('registrations.json', JSON.stringify(data) + '\n');
        console.log('Данные успешно записаны в registrations.json');
        res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Ошибка на сервере:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});