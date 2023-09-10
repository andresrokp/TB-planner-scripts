function auxDash_simpleCard_settings_widgetCss(params) {
    return{
        "tbDatasource-value":{
            "font-weight":600
        }
    }
}


function auxDash_multAttsUpdate_dataAbsoluteProxMnttoA_setValue() {
    let hrsActuales = ctx.$scope.multipleInputWidget.multipleInputFormGroup.value['3'];
    let hrsToNext = ctx.$scope.multipleInputWidget.multipleInputFormGroup.value['4'];
    
    return Math.floor(hrsActuales + hrsToNext);
}


function auxDash_multAttsUpdate_dataDeltaHrsToNextMntto_getValue() {
    let hrsProxMntoA = ctx.data[4].data[0][1]
    let hrsActuales = Math.floor(ctx.data[2].data[0][1]/3600)
    
    return hrsProxMntoA - hrsActuales;
}