function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Powiadomienia są włączone.");
            } else {
                console.log("Powiadomienia są wyłączone.");
            }
        });
    }
}

requestNotificationPermission();

function getLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation is not available.");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        document.getElementById("latitude").innerText = position.coords.latitude;
        document.getElementById("longitude").innerText = position.coords.longitude;
    }, error => {
        console.error("Geolocation error:", error);
    });
}

let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>Cool loc.");

let originalPositions = [];

function getRasterMap() {
    leafletImage(map, function (err, canvas) {
        if (err) {
            console.error("Error generating map image:", err);
            return;
        }
        const rasterMap = document.getElementById("rasterMap");
        rasterMap.width = 400;
        rasterMap.height = 400;
        const rasterContext = rasterMap.getContext("2d");

        rasterContext.drawImage(canvas, 0, 0, rasterMap.width, rasterMap.height);
        
        createPuzzlePieces();
    });
}

function createPuzzlePieces() {
    const puzzleContainer = document.getElementById("puzzle-container");
    puzzleContainer.innerHTML = "";
    const canvas = document.getElementById("rasterMap");
    const pieceSize = 100;
    let pieces = [];

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const pieceCanvas = document.createElement("canvas");
            pieceCanvas.width = pieceSize;
            pieceCanvas.height = pieceSize;
            const ctx = pieceCanvas.getContext("2d");

            ctx.drawImage(canvas, col * pieceSize, row * pieceSize, pieceSize, pieceSize, 0, 0, pieceSize, pieceSize);

            const pieceDiv = document.createElement("div");
            pieceDiv.classList.add("puzzle-piece");
            pieceDiv.style.backgroundImage = `url(${pieceCanvas.toDataURL()})`;
            pieceDiv.dataset.position = `${row}-${col}`;
            pieceDiv.dataset.correctPosition = `${row}-${col}`;
            pieceDiv.draggable = true;

            originalPositions.push(pieceDiv.dataset.position);

            pieceDiv.addEventListener("dragstart", dragStart);
            pieceDiv.addEventListener("dragover", dragOver);
            pieceDiv.addEventListener("drop", dropPiece);
            
            pieces.push(pieceDiv);
        }
    }

    pieces = pieces.sort(() => Math.random() - 0.5);
    pieces.forEach(piece => puzzleContainer.appendChild(piece));
}

let draggedPiece = null;

function dragStart(e) {
    draggedPiece = e.target;
    setTimeout(() => e.target.style.visibility = "hidden", 0);
}

function dragOver(e) {
    e.preventDefault();
}

function dropPiece(e) {
    e.preventDefault();
    if (draggedPiece) {
        const targetPiece = e.target;

        if (targetPiece.classList.contains("puzzle-piece")) {
            const draggedPosition = draggedPiece.dataset.position;
            const targetPosition = targetPiece.dataset.position;

            [draggedPiece.style.backgroundImage, targetPiece.style.backgroundImage] =
            [targetPiece.style.backgroundImage, draggedPiece.style.backgroundImage];
            [draggedPiece.dataset.position, targetPiece.dataset.position] =
            [targetPosition, draggedPosition];
        }

        draggedPiece.style.visibility = "visible";
        draggedPiece = null;

        setTimeout(checkPuzzle, 500);
    }
}

function checkPuzzle() {
    const pieces = document.querySelectorAll(".puzzle-piece");
    const isCompleted = Array.from(pieces).every((piece, index) => 
        piece.dataset.position === originalPositions[index]
    );

    if (isCompleted) {
        if (Notification.permission === "granted") {
            new Notification("Gratulacje!", {
                body: "Gratulacje! Puzzle są poprawnie ułożone!",
            });
        } else {
            console.log("Powiadomienia są wyłączone!");
        }
    }
}
