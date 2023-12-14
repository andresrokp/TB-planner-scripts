function auxDash_BufferAttsCardTable () {

    function action_saveChecklist360Teltry() {
        console.log(widgetContext);

        // >APIs loading
        let $injector = widgetContext.$scope.$injector;
        let attributeService = $injector.get(widgetContext.servicesMap.get('attributeService'));
        let deviceService = $injector.get(widgetContext.servicesMap.get('deviceService'));

        // >Build a printable string of the data to submit
        const widgetData = widgetContext.data; // Takes the rendered widget info
        let widgetHash = {};
        let imgurl = '';
        for (let data of widgetData){// iterate over the real rendered values
            if (!data.data[0][1] && data.dataKey.name != 'check' && data.dataKey.name != 'otros'){
                alert('Faltan datos por suministrar');
                return;
            }
            if (data.dataKey.name == 'fotografia' ){
                // This looks stupid, but a direct insertion of it's data value implies the later JSON cleaning ends deleting the doble quotes of the <img/>. So its better to clavarle un placeholder aquí para que no joda.
                if (data.data[0][1].length < 100) {
                    alert('Faltan datos por suministrar');
                    return;
                }
                widgetHash[data.dataKey.label] = 'IMGURL';
                imgurl = data.data[0][1];
            }else{
                widgetHash[data.dataKey.label] = data.data[0][1];
            }
        }
        // console.log('widgetHash',widgetHash)
        const valuesAsString = JSON.stringify(widgetHash,null,2)
        // console.log('valuesAsString',valuesAsString)
        const valuesToPrint = valuesAsString.replaceAll('"','').replaceAll(',','').replace('{','').replace('}','').replace('IMGURL',imgurl);
        // console.log('valuesToPrint',valuesToPrint)

        // - Data saving -

        // >Get all widget's datakey names
        let keys = widgetContext.datasources[0].dataKeys.map(dk => dk.name);
        // console.log('-----------------\nkeys',keys)

        // >Confirmation alert
        let choose = confirm('¿Confirma el guardado de la información?');
        if (!choose) return;

        // >Get SERVER attributes
        attributeService.getEntityAttributes(entityId, 'SERVER_SCOPE', keys).subscribe(
            async function(atts){
                // console.log('loaded atts',atts);
                
                // await new Promise(resolve => setTimeout(resolve, 500)); 
                
                // >Build the main values structure
                let valuesHashForPost = {};
                let valuesArrayForApi = [];
                for (let keyPkg of atts){
                    if (keyPkg.value != '-'){
                        // add to a simple post hash
                        valuesHashForPost[keyPkg.key] = keyPkg.value;
                        // add to a more complex api array
                        valuesArrayForApi.push({key:keyPkg.key, value:keyPkg.value});
                    }
                }
                
                // Adjustment for post Rule Chain
                let nowDate = new Date().getTime();
                valuesHashForPost.ts_id = nowDate;
                valuesHashForPost.isCheck = true;

                console.log('valuesHashForPost',valuesHashForPost);
                console.log('valuesArrayForApi',valuesArrayForApi);
                
                // TODO: calc performance and REFACTOR
                
                // >SAVE esa vaina por rest, quitar la foto para que la RuCh no colapse
                delete valuesHashForPost.fotografia;
                deviceService.getDeviceCredentials(entityId.id,true).subscribe( async function (rCredentials) {
                    // console.log('rCredentials',rCredentials);
                    const token = rCredentials.credentialsId;
                    // console.log('valuesHashForPost',valuesHashForPost);
                    const r = await postTelemetry(valuesHashForPost, token);
                    // console.log('r',r);
                    
                    
                    // envío paralelo por API.
                    if (r){
                        attributeService.saveEntityTimeseries(entityId, 'ANY', valuesArrayForApi)
                        .subscribe( function(resp){
                            // console.log('resp',resp);
                            
                            // >Triggers a feedback dialog
                            widgetContext.dialogs.alert('Datos guardados correctamente',`<pre>${valuesToPrint}</pre>`).subscribe();
                            
                            // // ---------- Clear Form ----------
                            // // >Format keys list as obj array
                            // keys = keys.map(k => ({'key':k}));
                            // // >Delete and then refresh
                            // attributeService.deleteEntityAttributes(entityId, 'SERVER_SCOPE', keys)
                            // .subscribe(function () {
                            //     ()=>{setTimeout(widgetContext.updateAliases(),1500)};
                            // })
                                    
                        });
                    }
                });
                
            }
        ); 

        async function postTelemetry(telemetryData, token) {
        const url = `https://${window.location.host}/api/v1/${token}/telemetry`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(telemetryData),
        });
        
        if (response.ok) { console.log(response.status, 'Telemetry posted successfully', telemetryData); }
        else { console.log('Failed to post telemetry:', response.status); }
        
        return response;
        }
    }

    function data_all_PostProcessing() {
        const valueMap = {
            1:"C",
            '-': "NA",
            0: "NC"
        };
        return valueMap[value] || "";  
    }



    function settings_widgetStyle() {
        return `
            #labelCell0, #labelCell6, #labelCell12, #labelCell20, #labelCell26, #labelCell34, #labelCell40 {
                color: #1F3567;
                font-weight: 600;
            }

            td{
                text-wrap: wrap;
            }
        `        
    }
    
}



function mainTable_rowActionButton_generateQRCode() {

    // console.log('widgetContext',widgetContext);
    console.log('additionalParams',additionalParams);

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
    const estacion = additionalParams.entity['Estación'];
    let infoFetch = encodeURIComponent(JSON.stringify({entityId,entityName,estacion}));



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
                if (entityName.includes('XQT') || entityName.includes('MC-') || entityName.includes('FLT')) {
                    openDash('check_tractor');
                } else if (entityName.includes('GPU')) {
                    openDash('check_gpu');
                } else if (entityName.includes('CBL')) {
                    openDash('check_belt');
                } else if (entityName.includes('ASU')) {
                    openDash('check_asu');
                } else if (entityName.includes('ACU')) {
                    openDash('check_acu');
                } else if (entityName.includes('PUT')) {
                    openDash('check_car');
                } else if (entityName.includes('LSC')) {
                    openDash('check_lav');
                } else if (entityName.includes('PST')) {
                    openDash('check_steps');
                } else {
                    openDash('diligenciar_checklist')
                }
                
                function openDash(statedId) {
                    var params = {entityId, entityName};
                    widgetContext.stateController.openState(statedId, params, false);
                }
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
    } else if (entityName.includes('ASU')) {
        openDash('check_asu');
    } else if (entityName.includes('ACU')) {
        openDash('check_acu');
    } else if (entityName.includes('MC-')) {
        openDash('check_forklift');
    } else if (entityName.includes('PUT')) {
        openDash('check_car');
    } else if (entityName.includes('LSC')) {
        openDash('check_lav');
    } else if (entityName.includes('PST')) {
        openDash('check_steps');
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
    
                
                /*Para mostrar corronchamente todo el texto de la pregunta*/
                label{
                    position: relative;     /*El label toma espacio real en el doc flow*/
                    text-wrap: wrap;        /*Para bajar el texto en overflow de la view*/
                    top: 0px !important;    /*Para quitar el desfase por defecto y alinearlo con la cajetilla*/
                }
            `    
        }
        
    }
}