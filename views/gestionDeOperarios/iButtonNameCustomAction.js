console.log("entityId", entityId);
console.log("additionalParams", additionalParams);
console.log("widgetContext", widgetContext);

let $injector = widgetContext.$scope.$injector;
let customDialog = $injector.get(widgetContext.servicesMap.get("customDialog"));
let entityService = $injector.get(
  widgetContext.servicesMap.get("entityService")
);
let assetService = $injector.get(widgetContext.servicesMap.get("assetService"));
let deviceService = $injector.get(
  widgetContext.servicesMap.get("deviceService")
);
let attributeService = $injector.get(
  widgetContext.servicesMap.get("attributeService")
);

openEditEntityDialog();

function openEditEntityDialog() {
    // this is the "main" element. Is a dialog component wich is loaded with an html template and a model controller to merge in an Angular-ish way
  customDialog
    .customDialog(htmlTemplate, EditEntityDialogController)
    .subscribe();
}

function EditEntityDialogController(instance) {
    // a convenient rename vm = view model
  let vm = instance;

  vm.entityName = entityName;
  vm.entityType = entityId.entityType;
  vm.entitySearchDirection = {
    from: "FROM",
    to: "TO",
  };
  vm.attributes = {};
  vm.relationsToDelete = [];
  vm.entity = {};
  // le meto una nueva cosa al modelo to have it available in the view. El additionalParams[1] del widget es el iButtonTag (en el orden actual).
  vm.iButtonTag = additionalParams[1];

  // esto está altamente relacionado con la estructura de la Form. Los null son para limpiar los campos . 'fb' means 'FormBuilder' is a calling to the Angular's REACTIVE Form Module . 'vm.editEntityFormGroup' ends being the main variable bag of the things inside the form . Thats why its object definition has the same shape of the input fields 
  vm.editEntityFormGroup = vm.fb.group({
    entityName: ["", [vm.validators.required]],
    // it seems this shit can be nested!!
    attributes: vm.fb.group({
      // como se llame aquí, se debe llamar el mat-form-field>input>formControlName
    //   pruebaEscritura: [null],
      // Valor dinámico que le meto al objeto y debe corresponder con un matFormField embebido dinámico
      [vm.iButtonTag]: [null]
    }),
    // also can be streamed!!
    // relations: vm.fb.array([]),
  });

  getEntityInfo();

  vm.cancel = function () {
    vm.dialogRef.close(null);
  };

  vm.relations = function () {
    return vm.editEntityFormGroup.get("relations");
  };

  vm.save = function () {
    vm.editEntityFormGroup.markAsPristine();
    widgetContext.rxjs
      .forkJoin([
        saveAttributes(entityId),
        saveEntity(),
      ])
      .subscribe(function () {
        widgetContext.updateAliases();
        vm.dialogRef.close(null);
      });
  };

  // BUSINESS METHODS DEFINITION

// This is not a pure get... This is a extractor/setter. Extract the atts data from the parameter, and set it as the values of the vm.attributes JSON
  function getEntityAttributes(attributes) {
    for (var i = 0; i < attributes.length; i++) {
      vm.attributes[attributes[i].key] = attributes[i].value;
    }
  }

  function getEntityInfo() {
    widgetContext.rxjs
      .forkJoin([
        attributeService.getEntityAttributes(entityId, "SERVER_SCOPE"),
        entityService.getEntity(entityId.entityType, entityId.id),
      ])
      .subscribe(function (data) {
        // getEntityRelations(data.slice(0, 2));
        getEntityAttributes(data[0]);
        vm.entity = data[1];
        vm.editEntityFormGroup.patchValue(
          {
            entityName: vm.entity.name,
            // entityType: vm.entityType,
            // entityLabel: vm.entity.label,
            // type: vm.entity.type,
            attributes: vm.attributes
          },
          {
            emitEvent: false,
          }
        );
      });
  }

  function saveEntity() {
    const formValues = vm.editEntityFormGroup.value;
    if (vm.entity.label !== formValues.entityLabel) {
      vm.entity.label = formValues.entityLabel;
      if (formValues.entityType == "ASSET") {
        return assetService.saveAsset(vm.entity);
      } else if (formValues.entityType == "DEVICE") {
        return deviceService.saveDevice(vm.entity);
      }
    }
    return widgetContext.rxjs.of([]);
  }

  function saveAttributes(entityId) {
    let attributes = vm.editEntityFormGroup.get("attributes").value;
    let attributesArray = [];
    for (let key in attributes) {
      if (attributes[key] !== vm.attributes[key]) {
        attributesArray.push({
          key: key,
          value: attributes[key],
        });
      }
    }
    if (attributesArray.length > 0) {
      // jala el Device, toma el customerId y guarda copia en él
      deviceService.getDevice(entityId.id).subscribe((resp) => {
        // console.log("getDeviceResp", resp);
        attributeService
          .saveEntityAttributes(
            resp.customerId,
            "SERVER_SCOPE",
            attributesArray
          )
          .subscribe();
      });
      // Normal thing. Save Device Atts
      return attributeService.saveEntityAttributes(
        entityId,
        "SERVER_SCOPE",
        attributesArray
      );
    }
    return widgetContext.rxjs.of([]);
  }
}