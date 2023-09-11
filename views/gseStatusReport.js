function auxDash_simpleCard_settings_widgetCss() {
    return{
        "tbDatasource-value":{
            "font-weight":600
        }
    }
}

function auxDash_updtLumtAtts_settings_widgetCss() {
    return{
        'input:disabled':{
            'font-weight': 900
        }
    }
}


function auxDash_multAttsUpdate_dataAbsoluteProxMnttoA_setValue() {
    let hrsActuales = Math.floor(ctx.data[2].data[0][1]/3600)
    let hrsToNext = ctx.$scope.multipleInputWidget.multipleInputFormGroup.value['4'];
    
    return Math.floor(hrsActuales + hrsToNext);
}


function auxDash_multAttsUpdate_dataDeltaHrsToNextMntto_getValue() {
    let hrsProxMntoA = ctx.data[4].data[0][1]
    let hrsActuales = Math.floor(ctx.data[2].data[0][1]/3600)
    
    return hrsProxMntoA - hrsActuales;
}

function auxDash_multAttsUpdate_dataEnTaller_setValue(){
    return !ctx.$scope.multipleInputWidget.multipleInputFormGroup.value['1']
}
