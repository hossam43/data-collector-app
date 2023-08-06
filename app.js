const streetsTable = document.getElementById("streets-table");
const streetNameInput = document.getElementById("street-name-input");
const addStreetBtn = document.getElementById("add-street-btn");
const addRainBtn = document.getElementById("add-rain-btn");
const removeRainBtn = document.getElementById("remove-rain-btn");
const addSewerBtn = document.getElementById("add-sewer-btn");
const removeSewerBtn = document.getElementById("remove-sewer-btn");
const exportPdfBtn = document.getElementById("export-pdf-btn");
// Get a reference to the export button
const exportBtn = document.getElementById("export-xlsx-btn");
window.jsPDF = window.jspdf.jsPDF;

let selectedRow = null;

// Add a new row to the table
function addStreet() {
  const streetName = streetNameInput.value.trim();
  if (!streetName) {
    return;
  }
  const newRow = streetsTable.insertRow(-1);
  newRow.insertCell(0).innerHTML = streetName;
  newRow.insertCell(1).innerHTML = 0;
  newRow.insertCell(2).innerHTML = 0;
  newRow.addEventListener("click", selectRow);
  streetNameInput.value = "";
}

// Highlight the selected row and enable the buttons
function selectRow(event) {
  if (selectedRow) {
    selectedRow.classList.remove("highlighted");
  }
  selectedRow = event.currentTarget;
  selectedRow.classList.add("highlighted");
  addRainBtn.disabled = false;
  removeRainBtn.disabled = false;
  addSewerBtn.disabled = false;
  removeSewerBtn.disabled = false;
}

// Add a rain manhole to the selected row
function addRain() {
  if (!selectedRow) {
    return;
  }
  const rainManholeCell = selectedRow.cells[1];
  const currentCount = parseInt(rainManholeCell.innerHTML);
  rainManholeCell.innerHTML = currentCount + 1;
}

// Remove a rain manhole from the selected row
function removeRain() {
  if (!selectedRow) {
    return;
  }
  const rainManholeCell = selectedRow.cells[1];
  const currentCount = parseInt(rainManholeCell.innerHTML);
  if (currentCount > 0) {
    rainManholeCell.innerHTML = currentCount - 1;
  }
}

// Add a sewer manhole to the selected row
function addSewer() {
  if (!selectedRow) {
    return;
  }
  const sewerManholeCell = selectedRow.cells[2];
  const currentCount = parseInt(sewerManholeCell.innerHTML);
  sewerManholeCell.innerHTML = currentCount + 1;
}

// Remove a sewer manhole from the selected row
function removeSewer() {
  if (!selectedRow) {
    return;
  }
  const sewerManholeCell = selectedRow.cells[2];
  const currentCount = parseInt(sewerManholeCell.innerHTML);
  if (currentCount > 0) {
    sewerManholeCell.innerHTML = currentCount - 1;
  }
}
// Export the table as a PDF
exportPdfBtn.addEventListener("click", () => {
  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Get the table HTML element
  const table = document.getElementById("streets-table");

  // Use html2canvas to render the table as a canvas
  html2canvas(table).then((canvas) => {
    // Get the canvas data as an image URL
    const imgData = canvas.toDataURL("image/png");

    // Add the image to the PDF document
    doc.addImage(imgData, "PNG", 10, 10, 180, 0);

    // Save the PDF document
    doc.save("table.pdf");
  });
});

// Add an event listener to the export button
exportBtn.addEventListener("click", () => {
  // Get the table HTML element
  const table = document.getElementById("streets-table");

  // Convert the table to a workbook
  const workbook = XLSX.utils.table_to_book(table);

  // Generate a binary string from the workbook
  const binaryString = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "binary",
  });

  // Convert the binary string to a Blob
  const blob = new Blob([s2ab(binaryString)], {
    type: "application/octet-stream",
  });

  // Create a download link for the Excel file
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "table.xlsx";

  // Append the download link to the document body
  document.body.appendChild(link);

  // Click the download link to download the file
  link.click();

  // Remove the download link from the document body
  document.body.removeChild(link);
});

// Utility function to convert a string to an ArrayBuffer
function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
}

// Add event listeners to the buttons
addStreetBtn.addEventListener("click", addStreet);
addRainBtn.addEventListener("click", addRain);
removeRainBtn.addEventListener("click", removeRain);
addSewerBtn.addEventListener("click", addSewer);
removeSewerBtn.addEventListener("click", removeSewer);
// Disable the buttons until a row is selected
addRainBtn.disabled = true;
removeRainBtn.disabled = true;
addSewerBtn.disabled = true;
removeSewerBtn.disabled = true;
