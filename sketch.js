// VARIABILI GLOBALI
let data;
let tooltip = null; 

let typeColors;


// CARICO I DATI
function preload() {
  data = loadTable("assets/data.csv", "csv", "header");
}

// SETUP
function setup() {
  createCanvas(windowWidth, windowHeight+300);
  typeColors = {
    "Stratovolcano": color(171, 134, 255),   // lilla vivace (no rosso/arancio/rosa/fucsia/verde)
    "Shield Volcano": color(255, 220, 100),  // giallo sole
    "Caldera": color(120, 200, 255),         // azzurro cielo
    "Cone": color(255, 105, 180),            // rosa acceso
    "Crater System": color(255, 165, 0),     // arancio chiaro
    "Maars / Tuff ring": color(80, 200, 120),// verde brillante
    "Submarine Volcano": color(0, 180, 220), // turchese oceano
    "Other / Unknown": color(200, 200, 200)  // grigio neutro
  };    

}

// DRAW
function draw() {
  background('black');

  drawTitle();

  let mapMargin = 50;
  let mapY = 100;
  let maxMapWidth = width - mapMargin * 2;
  let maxMapHeight = height - mapY - mapMargin;

  const baseMapWidth = 800;
  const baseMapHeight = 500;

  let scaleFactor = min(maxMapWidth / baseMapWidth, maxMapHeight / baseMapHeight);
  let mapWidth = baseMapWidth * scaleFactor;
  let mapHeight = baseMapHeight * scaleFactor;
  let mapX = (width - mapWidth) / 2;

  drawMap(mapX, mapY, mapWidth, mapHeight);
  drawV(mapX, mapY, mapWidth, mapHeight);

  if (tooltip) {
    drawTooltip(tooltip);
  }

  drawLegend();
}

// intestazione
function drawTitle() {
  fill('white');
  textFont('futura');
  textAlign(CENTER, TOP); 
  textSize(36);
  text("ASSIGNMENT 3 - La distribuzione dei vulcani nel mondo", width / 2, 20);

  textSize(16);
  text("Ogni cerchio rappresenta un vulcano: la grandezza rappresenta l'altitudine, il colore invece rappresenta la categoria.", width / 2, 70);
}


// disegno la mappa dei vulcani
function drawMap(mapX, mapY, mapWidth, mapHeight) {
  noFill();
}

// disegno i vulcani
function drawV(mapX, mapY, mapWidth, mapHeight) {
  tooltip = null; // reset ogni frame

  for (let r = 0; r < data.getRowCount(); r++) {
    let row = data.getRow(r);
    let lat = float(row.get("Latitude"));
    let lon = float(row.get("Longitude"));
    let elev = float(row.get("Elevation (m)"));
    let name = row.get("Volcano Name") || "Unknown";
    let country = row.get("Country") || "Unknown"; 
    let status = row.get("Status") || "N/A";
    let typeCategory = row.get("TypeCategory") || "Other / Unknown";

    let x = map(lon, -180, 180, mapX, mapX + mapWidth);
    let y = map(lat, 90, -90, mapY, mapY + mapHeight); 
    
    // 🔽 dimensione ridotta
    let size = map(elev, -400, 6000, 4, 14); 
    size = constrain(size, 4, 14);

    // colore base
    let baseCol = typeColors[typeCategory] || typeColors["Other / Unknown"];
    let colFill = baseCol;
    let colStroke = lerpColor(baseCol, color(0), 0.4);

    // hover → schiarisco fill e bordo bianco
    if (dist(mouseX, mouseY, x, y) < size/2) {
      colFill = lerpColor(baseCol, color(255), 0.5);
      colStroke = color(255);
      tooltip = {name, country, elev, status, typeCategory, x, y};
    }

    // 🔽 trasparenza ridotta
    colFill.setAlpha(140);   // 0 = invisibile, 255 = opaco
    colStroke.setAlpha(180); // bordo meno trasparente

    fill(colFill);
    stroke(colStroke);
    strokeWeight(0.8);
    ellipse(x, y, size, size);
  }
}



// disegno tooltip
function drawTooltip(v) {
  let txt = `NOME: ${v.name}
PAESE: ${v.country}
ALTITUDINE: ${v.elev} m
CATEGORIA: ${v.typeCategory}
STATUS: ${v.status}`;

  textSize(12);
  let w = textWidth(v.name) + 120;
  let h = 100;

  // posizione base
  let posX = mouseX + 10;
  let posY = mouseY + 10;

  // se tooltip esce a destra → spostalo a sinistra
  if (posX + w > width) {
    posX = mouseX - w - 10;
  }
  // se esce in basso → spostalo in alto
  if (posY + h > height) {
    posY = mouseY - h - 10;
  }

  fill(50, 50, 50, 220);
  stroke(255);
  rect(posX, posY, w, h, 8);

  noStroke();
  fill(255);
  textAlign(LEFT, TOP);
  text(txt, posX + 10, posY + 10);
}


function drawLegend() {
  let startX = 50;              // posizione della prima colonna
  let startY = height - 120;    // posizione verticale
  let spacingY = 22;            // spaziatura verticale
  let colSpacing = 220;         // distanza tra le due colonne

  textAlign(LEFT, CENTER);
  textSize(14);
  fill(255);
  text("Legenda delle categorie dei vulcani:", startX, startY - 30);

  let categories = Object.keys(typeColors);

  for (let i = 0; i < categories.length; i++) {
    let category = categories[i];
    let col = typeColors[category];

    // calcolo colonna e riga
    let colIndex = floor(i / 2);   // ogni 2 categorie si passa alla colonna successiva
    let rowIndex = i % 2;          // 0 = prima riga, 1 = seconda riga

    let x = startX + colIndex * colSpacing;
    let y = startY + rowIndex * spacingY;

    // disegno pallino
    fill(col);
    stroke(lerpColor(col, color(0), 0.4));
    strokeWeight(0.8);
    ellipse(x, y, 14, 14);

    // etichetta
    noStroke();
    fill(255);
    text(category, x + 25, y);
  }
}







