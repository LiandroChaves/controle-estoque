const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { autenticarUsuario } = require('./login');
const pool = require('../database/db');

const router = express.Router();

// Configurar o multer para salvar imagens localmente
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads/');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true }); // Cria a pasta, se não existir
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5 MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extName && mimeType) {
            cb(null, true);
        } else {
            cb(new Error('Apenas imagens nos formatos JPEG, JPG e PNG são permitidas.'));
        }
    },
});

// Rota de upload de imagem
router.post('/upload', autenticarUsuario, upload.single('image'), async (req, res) => {
    try {
        const userId = req.usuario.id; // ID do usuário extraído do token
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
        }

        const imagePath = `/uploads/${req.file.filename}`;
        console.log('Caminho da imagem:', imagePath); // Verifique se o caminho está correto

        // Atualizar a tabela com o caminho da imagem
        const query = `
            UPDATE informacoeslogin
            SET imagem = $1
            WHERE id = $2
        `;
        const values = [imagePath, userId];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.status(200).json({ message: 'Imagem salva com sucesso.', imagePath });
    } catch (error) {
        console.error('Erro ao salvar a imagem:', error.message);
        res.status(500).json({ error: 'Erro interno ao salvar a imagem.' });
    }
});


// Exportar o router
module.exports = router;
