




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

function auxDash_multAttsUpdate_dataAbsoluteProxMnttoA_fecha_setValue() {
    // Get both sides of the month variable
    const monthsLoadedDDBB = ctx.data[5].data[0][1];
    const monthsInForm = ctx.$scope.multipleInputWidget.multipleInputFormGroup.value['6'];
    // Tells is the user changed the input month
    const userChangedMonths = (monthsLoadedDDBB != monthsInForm);

    if (userChangedMonths) {
        const ahora = new Date();
        // add number of moths to today's date
        const despues = new Date(ahora.setMonth( ahora.getMonth() + monthsInForm));
        return despues;
    }else{
        return value;
    }
}


function auxDash_multAttsUpdate_dataDeltaHrsToNextMntto_getValue() {
    let hrsProxMntoA = ctx.data[6].data[0][1]
    let hrsActuales = Math.floor(ctx.data[2].data[0][1]/3600)
    
    return hrsProxMntoA - hrsActuales;
}

function auxDash_multAttsUpdate_dataEnTaller_setValue(){
    return !ctx.$scope.multipleInputWidget.multipleInputFormGroup.value['1']
}
