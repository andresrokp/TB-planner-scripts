
function main_table() {
    
    function action_generateQrCode(params) {

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
        const gseType = additionalParams.entity['Tipo GSE'];
        let infoFetch = encodeURIComponent(JSON.stringify({entityId,entityName,estacion,gseType}));



        let imgStyles="display: block; margin-left: auto; margin-right: auto;";

        widgetContext.dialogs
        .alert('QR Generado',
            `<br><img style="${imgStyles}" src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${infoFetch}">
            <pre>${infoPrint}</pre>`)
        .subscribe();

    }
}





function auxDash_history_actionCell_showPhoto(params) {
    console.log('additionalParams',additionalParams);
    console.log('widgetContext',widgetContext);

    const attsServ = widgetContext.$scope.$injector.get(widgetContext.servicesMap.get('attributeService'));

    const ts = additionalParams[0];

    attsServ.getEntityTimeseries(entityId,['fotografia','comentarios'],ts-2,ts+2)
            .subscribe(function(teltry){
                console.log(teltry);
                const img64 = teltry.fotografia[0].value;
                widgetContext.dialogs.alert('Foto del registro',`<img width="600px" src="${img64}"/>`).subscribe();
            });
}


function auxDash_history_dataCumplimiento(params) {
    let good = 0;
    let bad = 0;

    for (let dato in rowData){
        if ( rowData[dato] === 1) {
            good++;
        }
        if ( rowData[dato] === 0) {
            bad++;
        }
    }

    return Math.round(good / (good+bad) * 100);
}


function resultadosTablita() {

    function cellStyle() {
        if (value === 0) return {color:'red', fontWeight: 600};
        if (value === 1) return {fontWeight: 600};
        return {};
    }
    function cellContent() {
        const valueMap = {
            1:"C",
            0: "NC"
        };
        return valueMap[value] || "NA";
    }
    
}

function auxDash_alarmas_renderDetalles(){
    var noCumpleList = [];

    for (var prop in value){
        if (value[prop] === 0) noCumpleList.push(prop);
    }

    return '<b>-' + noCumpleList.join('<br>-') + '</b>';
}

function aux_dash_reg_table_info_button(params) {
    let pairs = [
        { short: 'Acelerador y correas WASP/FAST', full: '¿Está funcionando el control del acelerador en el conveyor, incluidas las correas WASP/FAST?' },
        { short: 'Actuador de gas', full: 'Verifique el funcionamiento del actuador de gas comprimiendo el tubo deslizante hasta el area roja y asegurese que regrese a la zona verde.' },
        { short: 'Advertencias de seguridad', full: '¿Están todas las advertencias de seguridad presentes y legibles?' },
        { short: 'Agarraderas', full: 'Revisa que las agarraderas estén en buenas condiciones sin movimiento anormal.' },
        { short: 'Alarma de plataforma y torreta', full: '¿Está activada la alarma de la plataforma trasera o el aviso visible, p. ¿Funciona la torreta?' },
        { short: 'Almohadilla de punta', full: 'Verifique que la almohadilla de la punta gura libremente.' },
        { short: 'Bara de tiro y ojillo', full: '¿La barra de tiro y ojillo se encuentran en buena condiciones?' },
        { short: 'Barandales con extensiones', full: '¿Hay barandales equipados con extensiones para mitigar el espacio con el fuselaje en ambos lados?' },
        { short: 'Barandales de seguridad', full: '¿Los barandales de seguridad funcionan sin daños?' },
        { short: 'Barra de tiro', full: '¿Está la barra de tiro en buenas condiciones y sin signos visibles de daño (grietas/dobladuras/ojillo deformado)?' },
        { short: 'Bloqueo magnético o de cable de seguridad', full: '¿Está funcionando el sistema de bloqueo magnético o de cable de seguridad?' },
        { short: 'Bocina (pito)', full: '¿Funciona la bocina(pito)?' },
        { short: 'Brazo y enganche de remolque', full: '¿Están el brazo de remolque y el enganche de remolque en buenas condiciones y sin daños?' },
        { short: 'Bumpers techo', full: '¿Hay protección de caucho (bumpers) para aviones en las esquinas del techo?' },
        { short: 'Cabezal de conexión', full: '¿Está el cabezal de conexión de la barra de remolque en buenas condiciones y hay algún daño visible?' },
        { short: 'Cables y conexiones de cabezal', full: '¿Están en buenas condiciones las conexiones de la manguera y el cabezal?' },
        { short: 'Calcetín', full: '¿Hay un calcetin instalado sobre el brazo de remolque para advertir que se desconecten los cables antes de partir?' },
        { short: 'Calcomanía de avión aplicable', full: '¿Hay una calcomania colocada para el operador que muestre el tipo de avion aplicable a este pushback?' },
        { short: 'Calcomanías', full: '¿Las calcomanías especificadas actualmente están en buenas condiciones?' },
        { short: 'Calzos de goma', full: '¿Están los calzos en su lugar y son de goma?' },
        { short: 'Caster y libre', full: '¿Estan en buenas condiciones los casters y rodillos?' },
        { short: 'Cinturón de seguridad', full: '¿El cinturón de seguridad del conductor está instalado y funcionando?' },
        { short: 'Cinturones de seguridad', full: '¿Están colocados y funcionando los cinturones de seguridad del operador?' },
        { short: 'Cinturones y abrazaderas', full: '¿Están funcionando todos los cinturones de seguridad de los pasajeros?' },
        { short: 'Controles internos', full: '¿Están los controles internos en buenas condiciones, p. ¿Interruptores, instrumentos, palancas, etc.?' },
        { short: 'Correa colocada', full: '¿Hay una correa colocada en la parte trasera de las escaleras para controlar el acceso?' },
        { short: 'Cortinas y barras deslizantes', full: '¿Compruebe la fijacion de las cortinas y barras deslizantes?' },
        { short: 'Dirección', full: '¿Está funcionando correctamente la dirección?' },
        { short: 'Enganche trasero', full: '¿Está el enganche trasero en buenas condiciones de funcionamiento y equipado con bloqueo positivo (pasador accionado por resorte)?' },
        { short: 'Enganches de remolque', full: '¿Están los enganches de remolque/empuje en buenas condiciones y sin daños?' },
        { short: 'Estabilizadores', full: '¿Están los estabilizadores funcionando y sin daños?' },
        { short: 'Estado general', full: '¿Está bien el estado general, es decir, sin daños?' },
        { short: 'Estado General', full: '¿Está bien el estado general, es decir, sin daños?' },
        { short: 'Estado general al interior', full: '¿El estado general dentro del autobús es bueno, p.e. libre de FOD?' },
        { short: 'Extensión eléctrica', full: '¿La extension electrica se encuentra libre de cortes y daños?' },
        { short: 'Extintor', full: '¿Hay un extintor, está dentro de la fecha de caducidad, está lleno y todos los sellos están en su lugar?' },
        { short: 'FOD', full: '¿El equipo se encuentra libre de FOD y se asegura que NO existan objetos sospechosos y/o prohibidos ocultos en el interior y exterior del equipo (guanteras(si aplica),salpicaderas, cabina, debajo de asientos, motor etc.)?' },
        { short: 'Freno de estacionamiento', full: '¿Funciona correctamente el freno de estacionamiento?' },
        { short: 'Freno de mano', full: '¿Está funcionando el freno de mano/estacionamiento adecuadamente?' },
        { short: 'Frenos', full: '¿Están funcionando los frenos (incluido el freno de pedal/estacionamiento)?' },
        { short: 'Fugas, derrames y FOD', full: '¿El equipo se encuentra libre de fugas, derrames visibles, FOD y se asegura que NO existan objetos sospechosos y/o prohibidos ocultos en el interior y exterior del equipo (guanteras(si aplica),salpicaderas, cabina, debajo de asientos, motor etc.)?' },
        { short: 'Funciones hidráulicas', full: '¿Realiza todas las funciones hidrualicas sin ruidos extraños?' },
        { short: 'Galómetro y monómetro', full: '¿El galometro y manometro funcionan correctamente?' },
        { short: 'Impermeabilización', full: '¿Está la impermeabilización de los interruptores y controles del tablero en buenas condiciones, sin daños visibles y funcionando correctamente?' },
        { short: 'Indicador de temperatura', full: '¿Funciona correctamente el indicador de temperatura?' },
        { short: 'Indicadores de tuercas', full: '¿Hay indicadores de tuercas instalados para mostrar si alguna tuerca está floja?' },
        { short: 'Libre de corrosión', full: 'Esta libre de corrosion el piso y/o techo?' },
        { short: 'Limpiaparabrisas y lavaparabrisas', full: '¿Funcionan los limpiaparabrisas y el lavaparabrisas?' },
        { short: 'Limpiaparabrisas y Lavaparabrisas', full: '¿Funcionan los limpiaparabrisas y el lavaparabrisas?' },
        { short: 'Luces', full: '¿Las luces están en buenas condiciones y funcionan [incluidas las luces de freno]?' },
        { short: 'Luces y alarma de reversa', full: '¿Funciona la luz y alarma de reversa?' },
        { short: 'Manguera de suministro', full: '¿La manguera de suministro de agua potable se encuentra en buenas condiciones y sin signos visibles de infeccion?' },
        { short: 'Manguera y boquilla', full: '¿Están la manguera y boquilla de eliminación de heces en condiciones de servicio?' },
        { short: 'Movimiento de ruedas', full: 'Verifique el libre movimiento de las ruedas.' },
        { short: 'Neumáticos', full: '¿Están los neumáticos en buenas condiciones, por ejemplo, dibujo, paredes laterales, inflado, etc.?' },
        { short: 'Paneles laterales', full: '¿Están los paneles laterales superiores deslizantes libres de daños y funcionando?' },
        { short: 'Paros de emergencia', full: '¿Los paros de emergencia están en buenas condiciones y funcionando?' },
        { short: 'Pasador de bloqueo y cadena', full: '¿Están el pasador de bloqueo y la cadena de seguridad en su lugar y en buenas condiciones?' },
        { short: 'Pasamanos', full: '¿Funcionan los pasamanos plegables/desplegables [cuando corresponda]?' },
        { short: 'Pasamanos y correas', full: '¿Están en buenas condiciones los pasamanos y correas dentro del autobús?' },
        { short: 'Pernos fusibles', full: '¿Están los pernos fusibles en su lugar, giran libremente y tienen algún daño visible?' },
        { short: 'Pistola de alta presión', full: '¿Funcionan correctamente la pistola de alta presion?' },
        { short: 'Protección de goma delantera', full: '¿Hay protección de goma en la parte delantera, p. Ruedas de protección y ¿el estado es bueno?' },
        { short: 'Seguros y guías', full: '¿Estan operativos los seguros y guias de carga y libres de daños?' },
        { short: 'Sistema de aproximación', full: '¿Existe un sistema de aproximación de aeronaves instalado y en funcionamiento? Aplicable desde 2018' },
        { short: 'Sistema de bloqueo de panel', full: '¿Hay instalado un sistema de bloqueo Anderson [cuando corresponda] o un sistema inhibidor de panel deslizante superior para garantizar que los paneles estén completamente retraídos?' },
        { short: 'Soporte de nivelación', full: 'Verifique si el soporte de nivelacion esta presente y funcionando.' },
        { short: 'Tapas de cojinetes', full: '¿Están las tapas de los cojinetes de las ruedas en su lugar y presentes?' },
        { short: 'Tapas de los cojinetes', full: '¿Están las tapas de los cojinetes de las ruedas en su lugar y presentes?' },
        { short: 'Tipo de avión en barra', full: '¿Se muestra claramente el tipo de avión correcto en el poste de cola?' },
        { short: 'Topes de descanso', full: '¿El soporte de la barra de remolque (topes de descanso) está libre de daños y en buenas condiciones?' },
        { short: 'Topes de goma', full: '¿Están en buenas condiciones los topes de goma de protección de la aeronave?' },
        { short: 'Torreta', full: '¿Funciona correctamente la torreta?' },
        { short: 'Trinquete', full: 'Cuenta con trinquete (ganchos) accionados por resorte que se bloquean en el sistema de altura de la escalera?' }
    ];
    
    let content = `
      <div style="max-width: 400px; margin: 0 auto;">
        <ul style="list-style: none; padding: 0;">
          ${pairs.map(pair => `<li><strong>${pair.short}:</strong> ${pair.full}</li>`).join('')}
        </ul>
      </div>
    `;
    
    widgetContext.dialogs.alert('Relaciones de Encabezados', content).subscribe();
}