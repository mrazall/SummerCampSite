const express = require('express');
const cors = require('cors');
const ExcelJS = require('exceljs');
const path = require('path');
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

// Путь к Excel-файлу
const excelFilePath = path.join(__dirname, 'registrations.xlsx');

// Функция для добавления данных в Excel
async function appendToExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const sheetName = 'Registrations';

    // Проверяем, существует ли файл
    let worksheet;
    try {
        await workbook.xlsx.readFile(excelFilePath);
        worksheet = workbook.getWorksheet(sheetName);
    } catch (error) {
        // Если файл не существует, создаем новый
        worksheet = workbook.addWorksheet(sheetName);
        // Добавляем заголовки
        worksheet.columns = [
            { header: 'Дата и время', key: 'timestamp', width: 20 },
            { header: 'Имя родителя', key: 'name', width: 20 },
            { header: 'Имя ребёнка', key: 'childName', width: 20 },
            { header: 'Класс', key: 'grade', width: 10 },
            { header: 'Программа', key: 'program', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Телефон', key: 'phone', width: 15 }
        ];
        // Стили для заголовков
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
    }

    // Добавляем новую строку с данными
    worksheet.addRow({
        timestamp: new Date().toLocaleString(),
        name: data.name,
        childName: data.childName,
        grade: data.grade,
        program: data.program,
        email: data.email,
        phone: data.phone
    });

    // Сохраняем изменения в файл
    await workbook.xlsx.writeFile(excelFilePath);
    console.log('Данные успешно записаны в registrations.xlsx');
}

// Обработчик POST-запроса
app.post('/register', async (req, res) => {
    try {
        console.log('Получен запрос на регистрацию:', req.body);
        const data = req.body;
        await appendToExcel(data);
        res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Ошибка на сервере:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});