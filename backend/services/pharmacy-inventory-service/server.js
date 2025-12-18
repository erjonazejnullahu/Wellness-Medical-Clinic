const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Krijo aplikacionin Express
const app = express();
const PORT = 5000;

// Konfigurimi i CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Për requete preflight
app.options('*', cors());

// Middleware për të parsuar JSON
app.use(express.json());

// ==============================================
// VENDOS KREDENCIALET E TUAJA TË MYSQL KËTU!
// ==============================================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'meduser', // VENDOS USERNAME-IN TËND
    password: 'medpass123', // VENDOS PASSWORD-IN TËND (nëse nuk ka password, lëre bosh)
    database: 'clinic'
});

// Testo lidhjen me databazën
db.connect((err) => {
    if (err) {
        console.error('❌ Gabim në lidhjen me MySQL:', err.message);
        console.log('\n💡 Këshilla:');
        console.log('1. Kontrollo nëse MySQL është duke punuar');
        console.log('2. Kontrollo username dhe password në MySQL Workbench');
        console.log('3. Sigurohu që databaza "clinic" ekziston');
    } else {
        console.log('✅ U lidhëm me databazën MySQL: clinic');
        
        // Testo nëse tabela medicines ekziston
        db.query('SHOW TABLES LIKE "medicines"', (err, results) => {
            if (err) {
                console.error('Gabim në kontrollin e tabelës:', err.message);
            } else if (results.length === 0) {
                console.log('⚠️  Tabela "medicines" nuk ekziston. Do ta krijoj...');
                
                // Krijo tabelën nëse nuk ekziston
                const createTableSQL = `
                    CREATE TABLE medicines (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(100) NOT NULL,
                        quantity INT NOT NULL,
                        expiry_date DATE,
                        price DECIMAL(10,2),
                        description TEXT
                    )
                `;
                
                db.query(createTableSQL, (err) => {
                    if (err) {
                        console.error('Gabim në krijimin e tabelës:', err.message);
                    } else {
                        console.log('✅ Tabela "medicines" u krijua me sukses');
                        
                        // Shto disa të dhëna test
                        const testData = [
                            ['Paracetamol', 100, '2025-12-31', 1.50, 'Për dhimbje koke'],
                            ['Ibuprofen', 50, '2024-11-30', 2.25, 'Anti-inflamator'],
                            ['Amoxicillin', 30, '2024-09-15', 5.75, 'Antibiotik']
                        ];
                        
                        testData.forEach((data, index) => {
                            setTimeout(() => {
                                db.query(
                                    'INSERT INTO medicines (name, quantity, expiry_date, price, description) VALUES (?, ?, ?, ?, ?)',
                                    data,
                                    (err) => {
                                        if (err) console.error('Gabim në shtimin e të dhënave test:', err.message);
                                    }
                                );
                            }, index * 500);
                        });
                    }
                });
            } else {
                console.log('✅ Tabela "medicines" ekziston');
            }
        });
    }
});

// ==================== ROUTES ====================

// 1. Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        time: new Date().toISOString(),
        routes: [
            '/health',
            '/api/medicines',
            '/api/medicines/:id'
        ]
    });
});

// 2. Merr të gjitha barnat
app.get('/api/medicines', (req, res) => {
    const sql = 'SELECT * FROM medicines ORDER BY id DESC';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Gabim në databazë:', err);
            res.status(500).json({ error: 'Gabim në server' });
            return;
        }
        res.json(results);
    });
});

// 3. Merr një barnë sipas ID
app.get('/api/medicines/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM medicines WHERE id = ?';
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Gabim në server' });
            return;
        }
        
        if (results.length === 0) {
            res.status(404).json({ error: 'Barnë nuk u gjet' });
            return;
        }
        
        res.json(results[0]);
    });
});

// 4. Shto barnë të re
app.post('/api/medicines', (req, res) => {
    const { name, quantity, expiry_date, price, description } = req.body;
    
    // Validim i thjeshtë
    if (!name || !quantity) {
        return res.status(400).json({ 
            error: 'Emri dhe sasia janë të detyrueshme' 
        });
    }
    
    const sql = 'INSERT INTO medicines (name, quantity, expiry_date, price, description) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [name, quantity, expiry_date, price, description], (err, result) => {
        if (err) {
            console.error('Gabim gjatë shtimit:', err);
            res.status(500).json({ error: 'Gabim gjatë shtimit të barnës' });
            return;
        }
        
        res.status(201).json({
            message: 'Barnë u shtua me sukses',
            id: result.insertId,
            medicine: {
                id: result.insertId,
                name,
                quantity,
                expiry_date,
                price,
                description
            }
        });
    });
});

// 5. Përditëso barnë
app.put('/api/medicines/:id', (req, res) => {
    const { id } = req.params;
    const { name, quantity, expiry_date, price, description } = req.body;
    
    const sql = 'UPDATE medicines SET name = ?, quantity = ?, expiry_date = ?, price = ?, description = ? WHERE id = ?';
    
    db.query(sql, [name, quantity, expiry_date, price, description, id], (err, result) => {
        if (err) {
            console.error('Gabim gjatë përditësimit:', err);
            res.status(500).json({ error: 'Gabim gjatë përditësimit të barnës' });
            return;
        }
        
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Barnë nuk u gjet' });
            return;
        }
        
        res.json({
            message: 'Barnë u përditësua me sukses',
            affectedRows: result.affectedRows
        });
    });
});

// 6. Fshi barnë
app.delete('/api/medicines/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM medicines WHERE id = ?';
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Gabim gjatë fshirjes:', err);
            res.status(500).json({ error: 'Gabim gjatë fshirjes së barnës' });
            return;
        }
        
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Barnë nuk u gjet' });
            return;
        }
        
        res.json({
            message: 'Barnë u fshi me sukses',
            affectedRows: result.affectedRows
        });
    });
});

// 7. Test route
app.get('/test', (req, res) => {
    res.json({ message: 'API është duke punuar!' });
});

// Rrugë për root
app.get('/', (req, res) => {
    res.json({
        message: 'Medical Clinic Backend API',
        version: '1.0.0',
        endpoints: [
            'GET    /health',
            'GET    /api/medicines',
            'GET    /api/medicines/:id',
            'POST   /api/medicines',
            'PUT    /api/medicines/:id',
            'DELETE /api/medicines/:id'
        ]
    });
});

// Nis serverin
app.listen(PORT, () => {
    console.log(`🚀 Serveri është duke punuar në portin ${PORT}`);
    console.log(`🌐 Shko në: http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`💊 Barnat: http://localhost:${PORT}/api/medicines`);
});