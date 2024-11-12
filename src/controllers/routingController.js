import express from 'express';
import { aStar, Node } from '../services/routingService.js';
import database from '../repository/mySQL.js'; 

const router = express.Router();

router.post('/route', async (req, res) => {
    const { start, end } = req.body;

    try {
        const conn = await database.connect();
        const [rows] = await conn.query('SELECT * FROM nodes WHERE building_id = ?', [start.building_id]);
        conn.end();

        const nodes = rows.map(row => new Node(row.x, row.y, row.floor_number, row.node_type));

        const startNode = new Node(start.x, start.y, start.floor);
        const endNode = new Node(end.x, end.y, end.floor);

        // Calcula de fato
        const path = aStar(startNode, endNode, nodes);

        res.json(path);
    } catch (error) {
        res.status(500).json({ message: 'Falha no cálculo da rota', error: error.message });
    }
});

export default router;
