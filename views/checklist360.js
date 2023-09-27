function auxDash_BufferAttsCardTable () {

    function action_saveChecklist360Teltry() {
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
        attributeService.getEntityAttributes(entityId, 'SERVER_SCOPE', keys).subscribe(
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



    function settings_widgetStyle() {
        return `
            #labelCell0, #labelCell6, #labelCell12, #labelCell20, #labelCell26, #labelCell34, #labelCell40 {
                color: #1F3567;
                font-weight: 600;
            }
        `        
    }
    
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

function mainTable_rowClickAction_goToAuxDash() {
    if (entityName.includes('GPU')) {
        openDash('check_gpu');
    } else if (entityName.includes('CBL')) {
        openDash('check_belt');
    } else {
        openDash('diligenciar_checklist')
    }
    
    function openDash(statedId) {
        var params = {entityId, entityName};
        widgetContext.stateController.openState(statedId, params, false);
    }
}



function auxDash_checkInputForm () {

    function action_TakePhoto() {
        // - imageUrl - image URL in base64 data format

        reduceImgSize(imageUrl)
        .then((reducedImgURL)=>{
            // know input img size
            const dataBytes = imageUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/,'');
            const dataBytesReduced = reducedImgURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
            
            alert(`Tamaño Original: ${(atob(dataBytes).length/1024).toFixed(2)} kB => Tamaño Optimizado: ${(atob(dataBytesReduced).length/1024).toFixed(2)} kB`);
            
            // alert(``); // logs size of reduced img
            showImageDialog('Photo', reducedImgURL);
            saveEntityImageAttribute('fotografia', reducedImgURL);
        });

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

        function reduceImgSize(imgData64){
            
            return new Promise((resolve)=>{
                const imgDOM = new Image();
                // alert('imgDOM.tagName 11 - '+imgDOM.tagName); //confirm image creation
                imgDOM.src = imgData64;
                // alert('imgDOM.src original - '+imgDOM.src.slice(0,100)); //see original data string
                
                imgDOM.onload = ()=>{
                    
                    const newWidth = imgDOM.width * 0.2;
                    const newHeight = imgDOM.height * 0.2;
                    
                    const aCanvasToLeverage = document.createElement('canvas');
                    // alert('create canvas'+aCanvasToLeverage.tagName);  //confirm canvas creation
                    
                    // set Canvas dimensions, this is the resizing boundary
                    aCanvasToLeverage.width = newWidth;
                    aCanvasToLeverage.height = newHeight;
                    
                    // get the 2d drawing Context of the Canvas
                    const theCtxToManipulate = aCanvasToLeverage.getContext('2d');
                    
                    // draw the image inside the context
                    theCtxToManipulate.drawImage(imgDOM,0,0,newWidth,newHeight);
                    
                    // extract the canvas' content as a Data URL
                    const imgNowReducedInBase64 = aCanvasToLeverage.toDataURL('image/jpeg',1);
                    
                    resolve(imgNowReducedInBase64);
                }
                
            })
        }
    }



    function settings_widgetStyle() {

        function widgetStyle() {
        
            return `
                /* Goes straigth to the only fielset of the widget and traverse the hierarchy through the nth child to get into the label*/
                fieldset > div > div:nth-child(1) > div > mat-form-field > div > div > div > label > mat-label{
                    color: #1F3567;
                    font-weight: 500;
                }
    
                fieldset > div > div:nth-child(7) > div > mat-form-field > div > div > div > label > mat-label{
                    color: #1F3567;
                    font-weight: 500;
                }
    
                fieldset > div > div:nth-child(13) > div > mat-form-field > div > div > div > label > mat-label{
                    color: #1F3567;
                    font-weight: 500;
                }
    
                fieldset > div > div:nth-child(21) > div > mat-form-field > div > div > div > label > mat-label{
                    color: #1F3567;
                    font-weight: 500;
                }
    
                fieldset > div > div:nth-child(27) > div > mat-form-field > div > div > div > label > mat-label{
                    color: #1F3567;
                    font-weight: 500;
                }
    
                fieldset > div > div:nth-child(35) > div > mat-form-field > div > div > div > label > mat-label{
                    color: #1F3567;
                    font-weight: 500;
                }
    
                fieldset > div > div:nth-child(41) > div > mat-form-field > div > div > div > label > mat-label{
                    color: #1F3567;
                    font-weight: 500;
                }
    
                /*Pinta todos los labels (letreritos de declaración) de todos los inputs*/
                /*mat-label{*/
                /*    color: red !important;*/
                /*}*/
            `    
        }
        
    }
}