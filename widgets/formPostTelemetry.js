let choose = confirm('Are you sure to save the data?')

if (!choose) return

alert('load atts, save telem')

let $injector = widgetContext.$scope.$injector;
let attributeService = $injector.get(widgetContext.servicesMap.get('attributeService'));

console.log(additionalParams)
// coger el ts_id
let ts_id = additionalParams['0']

// build the msg array de sta, std, blockin, pushback, isClosed, +20
let keys = ['regNum','sta','std']

// get la telemetría de ese ts_id -> 
attributeService.getEntityTimeseries(entityId,keys,ts_id-2,ts_id+2).subscribe(
        function(telemetry){
            let attributesArray = []
            for (let key in telemetry){
                attributesArray.push({key:key,value:telemetry[key][0].value})
            }
            updateAttributes(attributesArray)
        }
    )


// Update esa mondá
function updateAttributes(attributesArray){
    attributeService.saveEntityAttributes(entityId, 'SHARED_SCOPE', attributesArray)
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