/**
 * Servidor de Desenvolvimento Simples
 * Serve os arquivos estáticos do Pomodoro Timer
 */

import { readFile } from 'fs/promises';
import { createServer } from 'http';
import { dirname, extname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 8080;  // Mudado de 8000 para 8080 (evitar conflito com backend)
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webmanifest': 'application/manifest+json'
};

const server = createServer(async (req, res) => {
    try {
        // Remove query string
        let filePath = req.url.split('?')[0];
        
        // Rota raiz serve index.html
        if (filePath === '/') {
            filePath = '/index.html';
        }
        
        // Caminho completo do arquivo (servindo da pasta frontend)
        const fullPath = join(__dirname, 'frontend', filePath);
        
        // Ler arquivo
        const content = await readFile(fullPath);
        
        // Determinar Content-Type
        const ext = extname(filePath);
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        
        // Enviar resposta
        res.writeHead(200, { 
            'Content-Type': contentType,
            'Cache-Control': 'no-cache'
        });
        res.end(content);
        
        console.log(`✓ ${req.method} ${req.url} - 200`);
    } catch (error) {
        // Arquivo não encontrado
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Arquivo não encontrado');
        console.log(`✗ ${req.method} ${req.url} - 404`);
    }
});

server.listen(PORT, () => {
    console.log('\n🍅 Servidor Pomodoro rodando!');
    console.log(`\n   Local: http://localhost:${PORT}`);
    console.log(`   Rede:  http://$(hostname -I | awk '{print $1}'):${PORT}\n`);
    console.log('Pressione Ctrl+C para parar\n');
});
