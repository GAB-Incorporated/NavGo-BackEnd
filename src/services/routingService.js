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
        
        // Regular nodes
        if (n.floor === node.floor && distance <= threshold) {
            return true;
        }
        
        // Stair nodes
        if (node.type === 'stair' || n.type === 'stair') {
            if (n.x === node.x && n.y === node.y) {
                
                return true;
            }
        }
        
        return false;
    });

    return neighbors;
}

function aStar(start, end, nodes) {
    // Verifica se o ponto inicial e o final estão no mesmo andar
    if (start.floor === end.floor) {
        return aStarPathfinding(start, end, nodes);
    } else {
        // Caminho inicial até a primeira escada
        let path = [];
        let currentFloor = start.floor;
        let currentStart = start;

        while (currentFloor !== end.floor) {
            // Encontra o nó de escada mais próximo no andar atual
            const stairNodes = nodes.filter(node => node.type === 'stair' && node.floor === currentFloor);
            let nearestStairNode = stairNodes.reduce((prev, curr) => (heuristic(currentStart, curr) < heuristic(currentStart, prev) ? curr : prev));

            // Caminho até a escada no andar atual
            let pathToStair = aStarPathfinding(currentStart, nearestStairNode, nodes);
            path = path.concat(pathToStair);

            // Adiciona explicitamente o nó da escada no andar superior ao caminho
            currentFloor = currentFloor < end.floor ? currentFloor + 1 : currentFloor - 1;
            let upperStairNode = nodes.find(node => node.x === nearestStairNode.x && node.y === nearestStairNode.y && node.floor === currentFloor && node.type === 'stair');
            
            if (!upperStairNode) {
                throw new Error("Não há escadas conectando andares corretamente")
            }

            path.push(upperStairNode); // Adiciona o nó da escada do novo andar ao caminho

            // Define o próximo ponto de partida como a escada no andar atual
            currentStart = upperStairNode;
        }

        // Caminho final do último ponto de escada até o destino
        let pathFromStairToEnd = aStarPathfinding(currentStart, end, nodes);
        path = path.concat(pathFromStairToEnd);

        return path;
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
            return path.reverse();
        }

        openSet = openSet.filter(node => node !== current);
        closedSet.push(current);

        let neighbors = findNeighbors(current, nodes);
        neighbors.forEach(neighbor => {
            if (closedSet.includes(neighbor)) return;
            let gScore = current.g + 1;

            // Custo de subir/descer escada
            if (neighbor.type === 'stair' && neighbor.floor !== current.floor) {
                gScore += 10; 
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

    throw new Error("Nenhuma rota foi encontrada");
}

export { aStar, Node };
