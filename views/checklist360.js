function auxDash_attsCardAction_saveChecklist360Teltry() {
    console.log(widgetContext);

    // Confirmation alert
    let choose = confirm('¿Confirma el guardado de la información?');
    if (!choose) return;
    
    let $injector = widgetContext.$scope.$injector;
    let attributeService = $injector.get(widgetContext.servicesMap.get('attributeService'));
    
    // get all widget's key names
    let keys = widgetContext.datasources[0].dataKeys.map(dk => dk.name);
    console.log('-----------------\nkeys',keys)
    
    // get SHARED attributes
    attributeService.getEntityAttributes(entityId, 'SHARED_SCOPE', keys).subscribe(
        async function(atts){
            
            console.log('loaded atts',atts);
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            
            let valuesHash = {};
            for (let keyPkg of atts){
                // // si la key no es un Simple letrero y el value no existe
                // if (!keyPkg.key.includes('-<') && !keyPkg.value){
                //     alert("ERROR: Hay valores no definidos");
                //     return;
                // }
                valuesHash[keyPkg.key] = keyPkg.value;
            }
            let nowDate = new Date().getTime();
            valuesHash.ts_id = nowDate;
            
            let telemetryHashArray = [ {key:'ts',value:nowDate}, {key:'values',value:valuesHash} ];
            console.log('telemetryHashArray',telemetryHashArray)
            
            // save esa mondá, clear form via att deletion, and wait 1 second to refresh
            attributeService.saveEntityTimeseries(entityId, 'ANY', telemetryHashArray)
            .subscribe( function(resp){
                console.log('resp',resp);
                // // ---------- Clear Form ----------
                // // format keys list as obj array
                // keys = keys.map(k => ({'key':k}));
                // // delete and then refresh
                // attributeService.deleteEntityAttributes(entityId, 'SHARED_SCOPE', keys)
                // .subscribe(function () {
                //     ()=>{setTimeout(widgetContext.updateAliases(),1000)};
                // })
            })
        }
    ); 
}



function mainTable_rowActionButton_generateQRCode() {

    // console.log('widgetContext',widgetContext);

    let data = {...additionalParams.entity};

    //remove standard values, and only leave the column named values
    delete data.actionCellButtons
    delete data.hasActions
    delete data.entityLabel;
    delete data.entityType;
    delete data.id;
    delete data.entityName;
    let infoPrint = JSON.stringify(data,null,4);
    infoPrint = infoPrint.replaceAll('"','').replace('{','').replace('}','')

    // data needed to dash jump
    let infoFetch = encodeURIComponent(JSON.stringify({entityId,entityName}));



    let imgStyles="display: block; margin-left: auto; margin-right: auto;";

    widgetContext.dialogs
    .alert('QR Generado',
        `<br><img style="${imgStyles}" src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${infoFetch}">
        <pre>${infoPrint}</pre>`)
    .subscribe();

}

function mainTable_headerAction_readQrCode(params) {
    
    setTimeout(function() {
    
        try {
            let { entityId, entityName } =  JSON.parse(code)
            widgetContext.dialogs
            .alert('Lectura código QR', `<pre>Check vehículo ${entityName}</pre>`)
            .subscribe(()=>{
                let params = { entityId, entityName };
                widgetContext.stateController.openState('diligenciar_checklist', params, false);
            });
        }catch(e){
            widgetContext.dialogs
            .alert('Lectura código QR', `<pre>QR no válido para MENZIES GSE</pre>`)
            .subscribe()
        }
        
    }, 150);
}

function auxDash_inputForm_takePhoto() {
    // Function body to process image obtained as a result of mobile action (take photo, take image from gallery, etc.). 
    // - imageUrl - image URL in base64 data format

    // showImageDialog('Photo', imageUrl);
    saveEntityImageAttribute('fotografia', imageUrl);

    function showImageDialog(title, imageUrl) {
        setTimeout(function() {
            widgetContext.customDialog.customDialog(imageDialogTemplate, ImageDialogController, {imageUrl: imageUrl, title: title}).subscribe();
        }, 100);
    }

    function saveEntityImageAttribute(attributeName, imageUrl) {
        if (entityId) {
            let attributes = [{
                key: attributeName, value: imageUrl
            }];
            widgetContext.attributeService.saveEntityAttributes(entityId, "SERVER_SCOPE", attributes).subscribe(
            function() {
                widgetContext.showSuccessToast('Fotografía guardada!');
            },
            function(error) {
                widgetContext.dialogs.alert('Falla en guardado', JSON.stringify(error));
            }
            );
        }
    }

    var
    imageDialogTemplate =
        '<div aria-label="Image">' +
        '<form #theForm="ngForm">' +
        '<mat-toolbar fxLayout="row" color="primary">' +
        '<h2>{{title}}</h2>' +
        '<span fxFlex></span>' +
        '<button mat-icon-button (click)="close()">' +
        '<mat-icon>close</mat-icon>' +
        '</button>' +
        '</mat-toolbar>' +
        '<div mat-dialog-content>' +
        '<div class="mat-content mat-padding">' +
        '<div fxLayout="column" fxFlex>' +
        '<div style="padding-top: 20px;">' +
        '<img [src]="imageUrl" style="height: 300px;"/>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div mat-dialog-actions fxLayout="row">' +
        '<span fxFlex></span>' +
        '<button mat-button (click)="close()" style="margin-right:20px;">Close</button>' +
        '</div>' +
        '</form>' +
        '</div>';

    function ImageDialogController(instance) {
    let vm = instance;
    vm.title = vm.data.title;
    vm.imageUrl = vm.data.imageUrl;
    vm.close = function ()
    {
        vm.dialogRef.close(null);
    }
    }

    let dataBytes = imageUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/,'');

    alert(`Original: ${(atob(dataBytes).length/1024).toFixed(2)} kB`);

        
    reduceImgSize(imageUrl);
    function reduceImgSize(imgData64){
        
        const imgDOM = new Image();
        
        imgDOM.onLoad(()=>{
            
            alert('inicia onLodeo');
            
            const newWidth = imgDOM.width * 0.25;
            const newHeight = imgDOM.height * 0.25;
            
            const aCanvasToLeverage = document.createElement('canvas');
            alert('create canvas'+aCanvasToLeverage.tagName);
            const theCtxToManipulate = aCanvasToLeverage.getContext('2d');
            alert('tomó el ctx');
            
            theCtxToManipulate.width = newWidth;
            theCtxToManipulate.height = newHeight;
            
            alert('newWidth - '+newWidth);
            alert('newHeight - '+newHeight);
            
            theCtxToManipulate.drawImage(imgDOM,0,0,newWidth,newHeight);
            
            const imgNowReducedInBase64 = aCanvasToLeverage.toDataUrl('image/jpeg',1);
            
            let dataBytesReduced = imgNowReducedInBase64.replace(/^data:image\/(png|jpg|jpeg);base64,/,'');
            alert('dataBytesReduced - '+dataBytesReduced.splice(0,40));
            
            alert(`Reduced: ${(atob(dataBytesReduced).length/1024).toFixed(2)} kB`);
            
        })
        
        imgDOM.src = imgData64;
        alert('imgDOM.src - '+imgDOM.src.slice(0,40));
    }
}