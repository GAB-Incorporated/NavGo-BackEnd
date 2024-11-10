import express from 'express';
import { aStar, Node } from '../services/routingService.js';
import database from '../repository/mySQL.js'; 

const router = express.Router();

router.post('/route', async (req, res) => {
    const { start, end } = req.body;

    console.log('Start:', start);
    console.log('End:', end);

    try {
        const conn = await database.connect();
        const [rows] = await conn.query('SELECT * FROM nodes WHERE building_id = ?', [start.building_id]);
        conn.end();

        console.log('Nodes:', rows);

        const nodes = rows.map(row => new Node(row.x, row.y, row.floor_number, row.node_type));

        // Create start and end nodes
        const startNode = new Node(start.x, start.y, start.floor);
        const endNode = new Node(end.x, end.y, end.floor);

        console.log('Start Node:', startNode);
        console.log('End Node:', endNode);

        // Calculate the path
        const path = aStar(startNode, endNode, nodes);

        console.log('Path:', path);

        res.json(path);
    } catch (error) {
        console.error('Error calculating route:', error);
        res.status(500).json({ message: 'Failed to calculate the route', error: error.message });
    }
});

export default router;
