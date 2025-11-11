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

  // calcolo dimensioni e posizione mappa
  let mapMargin = 50;
  let mapY = 100;
  let maxMapWidth = width - mapMargin * 2;
  let maxMapHeight = height - mapY - mapMargin;

  // dimensioni base mappa
  const baseMapWidth = 800;
  const baseMapHeight = 500;

  // calcolo fattore di scala
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
  // titolo
  fill('white');
  textFont('futura');
  textAlign(CENTER, TOP); 
  textSize(36);
  text("ASSIGNMENT 3 - La distribuzione dei vulcani nel mondo", width / 2, 20);

  // sottotitolo
  textSize(16);
  text("Ogni cerchio rappresenta un vulcano: la grandezza rappresenta l'altitudine, il colore invece rappresenta la categoria.", width / 2, 70);
}


// mappa dei vulcani
function drawMap(mapX, mapY, mapWidth, mapHeight) {
  noFill();
}

// vulcani
function drawV(mapX, mapY, mapWidth, mapHeight) {
  tooltip = null; // reset ogni frame

  // ciclo sui dati
  for (let r = 0; r < data.getRowCount(); r++) {
    let row = data.getRow(r);
    let lat = float(row.get("Latitude"));
    let lon = float(row.get("Longitude"));
    let elev = float(row.get("Elevation (m)"));
    let name = row.get("Volcano Name") || "Unknown";
    let country = row.get("Country") || "Unknown"; 
    let status = row.get("Status") || "N/A";
    let typeCategory = row.get("TypeCategory") || "Other / Unknown";

    // posizione sulla mappa
    let x = map(lon, -180, 180, mapX, mapX + mapWidth);
    let y = map(lat, 90, -90, mapY, mapY + mapHeight); 
    
    // dimensione (in base all'altitudine)
    let size = map(elev, -400, 6000, 4, 14); 
    size = constrain(size, 4, 14);

    // colore (in base alla categoria)
    let baseCol = typeColors[typeCategory] || typeColors["Other / Unknown"];
    let colFill = baseCol;
    let colStroke = lerpColor(baseCol, color(0), 0.4);

    // hover (schiarimento colore e tooltip)
    if (dist(mouseX, mouseY, x, y) < size/2) {
      colFill = lerpColor(baseCol, color(255), 0.5);
      colStroke = color(255);
      tooltip = {name, country, elev, status, typeCategory, x, y};
    }

    colFill.setAlpha(140);   
    colStroke.setAlpha(180); 

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

  // spostamento tooltip se esce dallo schermo (da dx a sx)
  if (posX + w > width) {
    posX = mouseX - w - 10;
  }

  fill(50, 50, 50, 220);
  stroke(255);
  rect(posX, posY, w, h, 8);

  noStroke();
  fill(255);
  textAlign(LEFT, TOP);
  text(txt, posX + 10, posY + 10);
}

// disegno legenda
function drawLegend() {
  let startX = 50;              // posizione della prima colonna
  let startY = height - 120;    // posizione verticale
  let spacingY = 22;            // spaziatura verticale
  let colSpacing = 220;         // distanza tra le due colonne

  // titolo legenda
  textAlign(LEFT, CENTER);
  textSize(14);
  fill(255);
  text("Legenda delle categorie dei vulcani:", startX, startY - 30);

  // ottengo le categorie
  let categories = Object.keys(typeColors); 

  for (let i = 0; i < categories.length; i++) {
    let category = categories[i];
    let col = typeColors[category];

    // calcolo colonna e riga
    let colIndex = floor(i / 2);   
    let rowIndex = i % 2;        

    let x = startX + colIndex * colSpacing;
    let y = startY + rowIndex * spacingY;

    // disegno cerchio
    fill(col);
    stroke(lerpColor(col, color(0), 0.4));
    strokeWeight(0.8);
    ellipse(x, y, 14, 14);

    // label categoria
    noStroke();
    fill(255);
    text(category, x + 25, y);
  }
}







