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
    const threshold = 15;

    const neighbors = nodes.filter(n => {
        const distance = Math.sqrt(Math.pow(n.x - node.x, 2) + Math.pow(n.y - node.y, 2));
        console.log(`Checking node at (${n.x}, ${n.y}, floor ${n.floor}) with distance ${distance}`);
        
        // Regular nodes on the same floor within a certain distance
        if (n.floor === node.floor && distance <= threshold) {
            console.log(`Neighbor found at (${n.x}, ${n.y}, floor ${n.floor})`);
            return true;
        }
        
        // Stair nodes linking different floors
        if (node.type === 'stair' && n.type === 'stair' && n.x === node.x && n.y === node.y) {
            console.log(`Stair node connection found at (${n.x}, ${n.y}, floor ${n.floor})`);
            return true;
        }
        
        return false;
    });

    neighbors.forEach(neighbor => {
        console.log(`Neighbor at (${neighbor.x}, ${neighbor.y}, floor ${neighbor.floor}) with type ${neighbor.type}`);
    });

    return neighbors;
}

function aStar(start, end, nodes) {
    let openSet = [];
    let closedSet = [];
    openSet.push(start);

    console.log('Initial Open Set:', openSet);

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
        console.log('Current Node:', current);
        console.log('Neighbors:', neighbors);
        neighbors.forEach(neighbor => {
            if (closedSet.includes(neighbor)) return;
            let gScore = current.g + 1;
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