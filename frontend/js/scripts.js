const form = document.getElementById("mainForm")

/* escucha el evento submit. Cuando ocurre el evento preventDefault detiene el funcionamiento por defecto del navegador (no se actualiza la pag.). crea FormData con los datos del form.   */
form.addEventListener("submit", function (e) {
    e.preventDefault();

    let operationsFormData = new FormData(form);
    let operationsObj =  convertFormDataToOperationObj(operationsFormData); 
    saveOperationObj(operationsObj); 
    insertRowInOperationTable(operationsObj);
    form.reset();
})

document.addEventListener("DOMContentLoaded", function(e){
    //trae del localStoragela info de las operaciones 
    let operationObjArray = getNewOperationFromApi() || [];

    operationObjArray.forEach(
        function(arrayElement){
            insertRowInOperationTable(arrayElement)
        }
    )
})

function getNewOperationFromApi(){
    //llama al backend
    //obtiene las operaciones
    //las guarda en un array
    const allOperations = [];
    return allOperations
}

function getNewOperationId() {
    let lastOperationId = localStorage.getItem("lastOperationId") || "-1";
    let newOperationId = JSON.parse(lastOperationId) + 1;
    localStorage.setItem("lastOperationId", JSON.stringify(newOperationId))     
    return newOperationId;
}

//convierte el FormData a un objeto
function convertFormDataToOperationObj(operationsFormData) {
    let activeSelect = operationsFormData.get("activeSelect");
    let shortLongInput = operationsFormData.get("shortLongInput");
    let investmentInput = operationsFormData.get("investmentInput");
    let commissionInput = operationsFormData.get("commissionInput");
    let entrancePriceInput = operationsFormData.get("entrancePriceInput");
    let exitPriceInput = operationsFormData.get("exitPriceInput");
    let entryDateInput = operationsFormData.get("entryDateInput");
    let exitDateInput = operationsFormData.get("exitDateInput");
    let operationId = getNewOperationId();

    return {
        "activeSelect" : activeSelect,
        "shortLongInput" : shortLongInput,
        "investmentInput" : investmentInput, 
        "commissionInput": commissionInput, 
        "entrancePriceInput" : entrancePriceInput,
        "exitPriceInput" : exitPriceInput, 
        "entryDateInput"  : entryDateInput,
        "exitDateInput" : exitDateInput,
        "operationId" : operationId
    }
}


/* obtiene la tabla principal. inserta una fila en la ultima posicion. inseta una nueva celda y obtiene el contenido del formulario */
function insertRowInOperationTable(operationsObj) {
    let OperationTableRef = document.getElementById("OperationTable");
    let newOperationRowRef = OperationTableRef.insertRow(-1);
    newOperationRowRef.setAttribute("data-operation-id", operationsObj["operationId"])

    let newOperationCellRef = newOperationRowRef.insertCell(0);
    newOperationCellRef.textContent = operationsObj["activeSelect"];

    newOperationCellRef = newOperationRowRef.insertCell(1);
    newOperationCellRef.textContent = operationsObj["shortLongInput"];

    newOperationCellRef = newOperationRowRef.insertCell(2);
    newOperationCellRef.textContent = "$" + operationsObj["investmentInput"];

    newOperationCellRef = newOperationRowRef.insertCell(3);
    newOperationCellRef.textContent = operationsObj["commissionInput"] + "%";

    newOperationCellRef = newOperationRowRef.insertCell(4);
    newOperationCellRef.textContent = "$" + operationsObj["entrancePriceInput"];

    newOperationCellRef = newOperationRowRef.insertCell(5);
    newOperationCellRef.textContent = "$" + operationsObj["exitPriceInput"];

    let newEarningsCell = newOperationRowRef.insertCell(6);

    let newRoiCell = newOperationRowRef.insertCell(7);

    newOperationCellRef = newOperationRowRef.insertCell(8);
    newOperationCellRef.textContent = operationsObj["entryDateInput"];

    newOperationCellRef = newOperationRowRef.insertCell(9);
    newOperationCellRef.textContent = operationsObj["exitDateInput"];

    let newDeleteCell = newOperationRowRef.insertCell(10);
    let deleteButton = document.createElement("button");
    newDeleteCell.appendChild(deleteButton);
    deleteButton.textContent = "Eliminar";


    deleteButton.addEventListener("click", (e) => {
        let operationRow = e.target.parentNode.parentNode;
        operationId = operationRow.getAttribute("data-operation-id");  
        e.target.parentNode.parentNode.remove();
        DeleteOperationRow(operationId)
    })


    //calculos para completar las celdas de ganancias y roi
    var shortLong = operationsObj["shortLongInput"];
    var investment = operationsObj["investmentInput"];
    var entrancePrice = operationsObj["entrancePriceInput"];
    var exitPrice = operationsObj["exitPriceInput"];
    var roi;    
    var earnings;

    if (investment == 0) {
        roi = 0;
    } else if (shortLong === "short") {
        roi = (((entrancePrice - exitPrice) / investment) * 10).toFixed(2);
        earnings = ((entrancePrice - exitPrice) * (investment / entrancePrice)).toFixed(2);   

    } else { // long
        roi = (((exitPrice - entrancePrice) / investment) * 10).toFixed(2);
        earnings = ((exitPrice - entrancePrice) * (investment / entrancePrice)).toFixed(2);
    }
    
    newEarningsCell.textContent = "$" + earnings;
    newRoiCell.textContent = roi + "%";
}

//le paso como parametro el operationId de la fila que quiero eliminar
function DeleteOperationRow(operationId) {
    //obtengo las operaciones del lStorage
    let operationObjArray = JSON.parse(localStorage.getItem("operationData"));
    //busco el indece de la fila que quiero eliminar
    let operationIndexInArray = operationObjArray.findIndex(element => element.operationId === operationId)
    //elimino la fila que se encuentra en esa posicion
    operationObjArray.splice(operationIndexInArray, 1) //elimina 1 elemento
    //convierto de objeto a JSON
    let operationObjArrayJSON = JSON.stringify(operationObjArray)
    //guardo el array de operacion en formato JSON en lStorage
    localStorage.setItem("operationData",  operationObjArrayJSON)
}

function saveOperationObj(operationsObj) {
    //si no hay nada en el localStorage, operationArray = a un arreglo vacio.
    let operationArray = JSON.parse(localStorage.getItem("operationData")) || [];
    operationArray.push(operationsObj)
    // convierto el array de operaciones a JSON
    let operationsArrayJSON = JSON.stringify(operationArray);  
    // guardo el arreglode operaciones en formato JSON en el localStorage
    localStorage.setItem("operationData", operationsArrayJSON)
}

fetch("http://localhost:3000/operations")