let choose = confirm('Are you sure to save the data?');

if (!choose) return;

let $injector = widgetContext.$scope.$injector;
let attributeService = $injector.get(widgetContext.servicesMap.get('attributeService'));

// build the msg array de sta, std, blockin, pushback, isClosed, +20
let keys = ['regNum','sta','std'];

// get SHARED attributes -> 
attributeService.getEntityAttributes(entityId, 'SHARED_SCOPE', keys).subscribe(
        async function(atts){
            // console.log('atts\n',atts)
            let valuesHash = {};
            await new Promise(resolve => setTimeout(resolve, 100)); 
            for (let keyPkg of atts){
                valuesHash[keyPkg.key] = keyPkg.value;
            }
            let nowDate = new Date();
            valuesHash.ts_id = nowDate;
            let telemetryHashArray = [{key:'ts',value:nowDate.getTime()},{key:'values',value:valuesHash}];
            console.log(telemetryHashArray);
            saveTelemetry(telemetryHashArray)
        }
    );


// Update esa mondá
function saveTelemetry(telemetryHashArray){
    attributeService.saveEntityTimeseries(entityId, 'ANY', telemetryHashArray).subscribe(
                    function () {
                        widgetContext.updateAliases();
                    })
}

// fetch('https://cdn.jsdelivr.net/npm/sweetalert2@11.0.19/dist/sweetalert2.all.min.js')
//     .then(resp => resp.text())
//     .then(data=>{
//         const scriptElement = document.createElement('script');
//         scriptElement.type = 'text/javascript';
//         scriptElement.innerHTML = data;
        
//         const headElement = document.getElementsByTagName('head')[0]
//         headElement.appendChild(scriptElement);
        
//         Swal.fire('Hello sweet alert 2');
//     })