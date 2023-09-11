function mainTable_dataEmergency() {
    function cellContent() {
        return value == 1 ? `⚠️ <img style="height:25px;" src="https://media.tenor.com/FKdPTJ5KtbMAAAAC/panic-worried.gif"/> ⚠️` : '........ok........';
    }
}

function mainTable_ignition() {
    function cellContent() {
        let url="https://www.sighums.com/wp-content/uploads/2019/01/sighumscenter.png"
        switch (value) {
            case 'true':
                url = "https://upload.wikimedia.org/wikipedia/commons/c/cf/Toggle_green.png";
                break;
            case 'false':
                url="https://upload.wikimedia.org/wikipedia/commons/2/21/Toggle_grey.png";
                break;
            default:
        }        
        return `<img style="height:25px;" src="${url}"/>`;
    }    
}

function mainTable_dataHorometer2() {
    function cellContent() {
        return entity.proxMnttoA - Math.floor(entity["Horom."]/3600);
    }
}

function mainTable_dataName() {
    function cellStyle() {
        return {
            'fontWeight': 900
          }
    }
}



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
        },        
        'input:enabled':{
            'font-weight': 700
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