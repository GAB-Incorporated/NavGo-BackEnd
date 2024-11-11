class Node {
    constructor(x, y, floor, type = 'regular', parent = null, g = 0, h = 0) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
        this.floor = floor;
        this.type = type;
        this.parent = parent;
        this.g = g;
        this.h = h;
        this.f = this.g + this.h;
    }
}

function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.floor - b.floor);
}

function findNeighbors(node, nodes) {
    const threshold = 12;

    const neighbors = nodes.filter(n => {
        const distance = Math.sqrt(Math.pow(n.x - node.x, 2) + Math.pow(n.y - node.y, 2));
        console.log(`Checking node at (${n.x}, ${n.y}, floor ${n.floor}) with distance ${distance}`);
        
        // Regular nodes
        if (n.floor === node.floor && distance <= threshold) {
            console.log(`Neighbor found at (${n.x}, ${n.y}, floor ${n.floor})`);
            return true;
        }
        
        // Stair nodes
        if (node.type === 'stair' || n.type === 'stair') {
            if (n.x === node.x && n.y === node.y) {
                console.log(`Stair node connection found at (${n.x}, ${n.y}, floor ${n.floor})`);
                return true;
            }
        }
        
        return false;
    });

    return neighbors;
}

function aStar(start, end, nodes) {
    //Checa se estão no mesmo andar
    if (start.floor === end.floor) {
        return aStarPathfinding(start, end, nodes);
    } else {
        //Caminho inicial
        const stairNodes = nodes.filter(node => node.type === 'stair' && node.floor === start.floor);
        let nearestStairNode = stairNodes.reduce((prev, curr) => (heuristic(start, curr) < heuristic(start, prev) ? curr : prev));
        
        let pathToStair = aStarPathfinding(start, nearestStairNode, nodes);
        
        //Caminho pós chegar na escada
        const newStartNode = nodes.find(node => node.x === nearestStairNode.x && node.y === nearestStairNode.y && node.floor === end.floor && node.type === 'stair');
        console.log(`NEW START NODE: FLOOR - ${newStartNode.floor}`);
        console.log(`NEW START NODE: X - ${newStartNode.x}`);
        console.log(`NEW START NODE: Y - ${newStartNode.y}`);
        console.log(`NEW END NODE: Y - ${end.floor}`);
        console.log(`NEW END NODE: Y - ${end.x}`);
        console.log(`NEW END NODE: Y - ${end.y}`);
        
        
        let pathFromStairToEnd = aStarPathfinding(newStartNode, end, nodes);

        return pathToStair.concat(pathFromStairToEnd);
    }
}

function aStarPathfinding(start, end, nodes) {
    let openSet = [];
    let closedSet = [];
    openSet.push(start);

    while (openSet.length > 0) {
        let current = openSet.reduce((prev, curr) => (prev.f < curr.f ? prev : curr));

        if (current.x === end.x && current.y === end.y && current.floor === end.floor) {
            let path = [];
            while (current.parent) {
                path.push(current);
                current = current.parent;
            }
            console.log('Found Path:', path.reverse());
            return path.reverse();
        }

        openSet = openSet.filter(node => node !== current);
        closedSet.push(current);

        let neighbors = findNeighbors(current, nodes);
        neighbors.forEach(neighbor => {
            if (closedSet.includes(neighbor)) return;
            let gScore = current.g + 1;
            if (neighbor.type === 'stair' && neighbor.floor !== current.floor) {
                gScore += 10; // Custo de subir/descer escada
            }
            if (!openSet.includes(neighbor) || gScore < neighbor.g) {
                neighbor.g = gScore;
                neighbor.h = heuristic(neighbor, end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = current;
                if (!openSet.includes(neighbor)) openSet.push(neighbor);
            }
        });
    }

    console.log('No Path Found');
    return [];
}

export { aStar, Node };
