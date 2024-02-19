// 
// MAIN DASH
// 

function mainDash_rowStyle() {
    if (entity['Prox. MTO en [km]'] < 100) return {
        backgroundColor: 'rgb(255, 50, 50, 0.3)'
    };
    if (entity['Prox. MTO en [km]'] < 500) return {
        backgroundColor: 'rgb(255, 165, 0, 0.2)'
    };
    if (entity['Prox. MTO en [km]'] < 1000) return {
        backgroundColor: 'rgb(255, 255, 100, 0.2)'
    };  
}

function mainDash_Hmto_CellContent(){

    let gseType = entity["Tipo GSE"];

    let groups = {
    kilometers: ["BUS - PASSENGER", "SUV", "TRUCK - PICK-UP", "VAN"],
    dateOnly: ["DOLLY - CARGO PALLET", "DOLLY - CARGO PALLET 20FT", "DOLLY - ULD CONTAINER", "TAIL STAND"]
    };

    if (groups.kilometers.includes(gseType) || groups.dateOnly.includes(gseType))
        return "-";

    return Math.floor(value/3600 * 100) / 100;
}



// 
// AUX DASH
// 


function auxDash_simpleCard_settings_widgetCss() {
    return{
        "tbDatasource-value":{
            "font-weight":600
        }
    }
}

function auxDash_updMultAtts_settings_widgetCss() {
    return`
        /* leverage the state psudo class and take the elements acording to its enabling */

        input:disabled{
            font-weight: 900;
        }
        
        input:enabled{
            font-weight: 700;
        }
        
        /* All form's input elements are wrapped into <divss> that are inside a parent <div>. In succession this parent div is the unique child of a <fieldset>. To manipulate the wrapping behavior of the form elements we have to override the inline width with the following important */
        
        fieldset > div > div{
            width:50% !important;
        }
    `
}


function auxDash_multAttsUpdate_inputHorasProxMto_getValue() {
    // Esto es suceptible al orden de los campos en los datasource
    // data posee los datos originales de la DDBB antes de entrar a la vm de Angular

    // valor en el input disabled de la derecha
    let hrsProxMntoA = ctx.data[5].data[0][1]
    // valor en el input disabled arriba; del alternador
    let hrsActuales = Math.floor(ctx.data[2].data[0][1]/3600)

    return hrsProxMntoA - hrsActuales;
}

function auxDash_multAttsUpdate_viewProxEnHrs_setValue() {
    // Se actualiza solo al guardar la Form
    
    // toma lo que marca el alternador de la DDBB
    let hrsActuales = Math.floor(ctx.data[2].data[0][1]/3600)
    
    //toma lo que está en el input de la Form de horas
    let hrsToNext = ctx.$scope.multipleInputWidget.multipleInputFormGroup.value['5'];
    
    return Math.floor(hrsActuales + hrsToNext);
}

function auxDash_multAttsUpdate_inputDiasProx_getValue() {
    //helper: take millis > calc diference > round up
    function calculateDaysDifference(date1, date2) {
        const millisecondsInDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
        const timeDifference = date2 - date1;
        const daysDifference = timeDifference / millisecondsInDay;
        return Math.round(daysDifference);
    }
    
    const fechaProxMntto = new Date(ctx.data[7].data[0][1] || 1);
    const fechaActual = new Date();
    return calculateDaysDifference(fechaActual, fechaProxMntto);
}

function auxDash_multAttsUpdate_viewProxSemanas_setValue() {
    // helper: take millis > add dates
    function calculateFutureDate(daysToAdd) {
        const millisecondsInDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
        const now = new Date(); // Get the current date
        const futureDate = new Date(now.getTime() + daysToAdd * millisecondsInDay);
        return futureDate;
    }
    
    // take value in the box
    const daysInForm = ctx.$scope.multipleInputWidget.multipleInputFormGroup.value['7'];
    const futureDate = calculateFutureDate(daysInForm);
    
    return futureDate;
}


function auxDash_multAttsUpdate_dataDeltaHrsToNextMntto_getValue() {
    let hrsProxMntoA = ctx.data[6].data[0][1]
    let hrsActuales = Math.floor(ctx.data[2].data[0][1]/3600)
    
    return hrsProxMntoA - hrsActuales;
}

function auxDash_multAttsUpdate_dataEnTaller_setValue(){
    return !ctx.$scope.multipleInputWidget.multipleInputFormGroup.value['1']
}


function auxDash_multAttsUpdate_inputKilometrosProxMto_getValue() {
    // valor en el input disabled de la derecha
    let kmProxMntoA = ctx.data[9].data[0][1];
    // valor en el input disabled arriba; del alternador
    let kmActuales = Math.round( ctx.data[3].data[0][1] );
    
    return (kmProxMntoA - kmActuales);
}


function auxDash_multAttsUpdate_viewProxKilometros_setValue() {
    // toma lo que marca el km satelital de la DDBB
    let kmActuales = Math.round( ctx.data[3].data[0][1] );
    //toma lo que está en el input de la Form de km
    let kmToNext = ctx.$scope.multipleInputWidget.multipleInputFormGroup.value['9'];
    return kmActuales+kmToNext;
}