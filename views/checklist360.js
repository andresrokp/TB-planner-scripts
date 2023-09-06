
console.log('entityName',entityName)
console.log('entityId',entityId)
console.log('additionalParams',additionalParams)
console.log('widgetContext',widgetContext)

let infoPrint = JSON.stringify({entityName,entityId},null,4);
let infoFetch = encodeURIComponent(JSON.stringify({entityName,entityId}));


widgetContext.dialogs
.alert('Qr Generado',
       `<br>Información:
       <br><pre>${infoPrint}</pre>
       <br>Imágen:
       <br><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${infoFetch}">`).subscribe();
