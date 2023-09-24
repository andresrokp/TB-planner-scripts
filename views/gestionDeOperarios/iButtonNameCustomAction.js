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
let entityRelationService = $injector.get(
  widgetContext.servicesMap.get("entityRelationService")
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
  vm.oldRelationsData = [];
  vm.relationsToDelete = [];
  vm.entity = {};
  // le meto una nueva cosa al modelo to have it available in the view. El additionalParams[1] es el iButton Tag... el asignado en vm debería llamarse iButtonValue o algo así mejor
  vm.additionalParams = additionalParams[1];

  // esto está altamente relacionado con la estructura de la Form. Los null son para limpiar los campos . 'fb' means 'FormBuilder' is a calling to the Angular's REACTIVE Form Module . 'vm.editEntityFormGroup' ends being the main variable bag of the things inside the form . Thats why its object definition has the same shape of the input fields 
  vm.editEntityFormGroup = vm.fb.group({
    entityName: ["", [vm.validators.required]],
    entityType: [null],
    entityLabel: [null],
    type: ["", [vm.validators.required]],
    // it seems this shit can be nested!!
    attributes: vm.fb.group({
      // como se llame aquí, se debe llamar el mat-form-field>input>formControlName
      pruebaEscritura: [null],
      // Valor dinámico que le meto al objeto y debe corresponder con un matFormField embebido dinámico
      [additionalParams[1]]: [null],
      address: [null],
      owner: [null],
      number: [null, [vm.validators.pattern(/^-?[0-9]+$/)]],
      booleanValue: [false],
    }),
    // also can be streamed!!
    oldRelations: vm.fb.array([]),
    relations: vm.fb.array([]),
  });

  getEntityInfo();

  vm.cancel = function () {
    vm.dialogRef.close(null);
  };

  vm.relations = function () {
    return vm.editEntityFormGroup.get("relations");
  };

  vm.oldRelations = function () {
    return vm.editEntityFormGroup.get("oldRelations");
  };

  vm.addRelation = function () {
    vm.relations().push(
      vm.fb.group({
        relatedEntity: [null, [vm.validators.required]],
        relationType: [null, [vm.validators.required]],
        direction: [null, [vm.validators.required]],
      })
    );
  };

  function addOldRelation() {
    vm.oldRelations().push(
      vm.fb.group({
        relatedEntity: [
          {
            value: null,
            disabled: true,
          },
          [vm.validators.required],
        ],
        relationType: [
          {
            value: null,
            disabled: true,
          },
          [vm.validators.required],
        ],
        direction: [
          {
            value: null,
            disabled: true,
          },
          [vm.validators.required],
        ],
      })
    );
  }

  vm.removeRelation = function (index) {
    vm.relations().removeAt(index);
    vm.relations().markAsDirty();
  };

  vm.removeOldRelation = function (index, relation) {
    vm.oldRelations().removeAt(index);
    vm.relationsToDelete.push(relation);
    vm.oldRelations().markAsDirty();
  };

  vm.save = function () {
    vm.editEntityFormGroup.markAsPristine();
    widgetContext.rxjs
      .forkJoin([
        saveAttributes(entityId),
        saveRelations(entityId),
        saveEntity(),
      ])
      .subscribe(function () {
        widgetContext.updateAliases();
        vm.dialogRef.close(null);
      });
  };

  // BUSINESS METHODS DEFINITION

  function getEntityAttributes(attributes) {
    for (var i = 0; i < attributes.length; i++) {
      vm.attributes[attributes[i].key] = attributes[i].value;
    }
  }

  function getEntityRelations(relations) {
    let relationsFrom = relations[0];
    let relationsTo = relations[1];
    for (let i = 0; i < relationsFrom.length; i++) {
      let relation = {
        direction: "FROM",
        relationType: relationsFrom[i].type,
        relatedEntity: relationsFrom[i].to,
      };
      vm.oldRelationsData.push(relation);
      addOldRelation();
    }
    for (let i = 0; i < relationsTo.length; i++) {
      let relation = {
        direction: "TO",
        relationType: relationsTo[i].type,
        relatedEntity: relationsTo[i].from,
      };
      vm.oldRelationsData.push(relation);
      addOldRelation();
    }
  }

  function getEntityInfo() {
    widgetContext.rxjs
      .forkJoin([
        entityRelationService.findInfoByFrom(entityId),
        entityRelationService.findInfoByTo(entityId),
        attributeService.getEntityAttributes(entityId, "SERVER_SCOPE"),
        entityService.getEntity(entityId.entityType, entityId.id),
      ])
      .subscribe(function (data) {
        getEntityRelations(data.slice(0, 2));
        getEntityAttributes(data[2]);
        vm.entity = data[3];
        vm.editEntityFormGroup.patchValue(
          {
            entityName: vm.entity.name,
            entityType: vm.entityType,
            entityLabel: vm.entity.label,
            type: vm.entity.type,
            attributes: vm.attributes,
            oldRelations: vm.oldRelationsData,
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
      // jala el customer y guarda copia en él
      deviceService.getDevice(entityId.id).subscribe((resp) => {
        console.log("getDeviceResp", resp);
        attributeService
          .saveEntityAttributes(
            resp.customerId,
            "SERVER_SCOPE",
            attributesArray
          )
          .subscribe((resp2) => {
            console.log("saveEntityAttributesResp", resp2);
          });
      });
      return attributeService.saveEntityAttributes(
        entityId,
        "SERVER_SCOPE",
        attributesArray
      );
    }
    return widgetContext.rxjs.of([]);
  }

  function saveRelations(entityId) {
    let relations = vm.editEntityFormGroup.get("relations").value;
    let tasks = [];
    for (let i = 0; i < relations.length; i++) {
      let relation = {
        type: relations[i].relationType,
        typeGroup: "COMMON",
      };
      if (relations[i].direction == "FROM") {
        relation.to = relations[i].relatedEntity;
        relation.from = entityId;
      } else {
        relation.to = entityId;
        relation.from = relations[i].relatedEntity;
      }
      tasks.push(entityRelationService.saveRelation(relation));
    }
    for (let i = 0; i < vm.relationsToDelete.length; i++) {
      let relation = {
        type: vm.relationsToDelete[i].relationType,
      };
      if (vm.relationsToDelete[i].direction == "FROM") {
        relation.to = vm.relationsToDelete[i].relatedEntity;
        relation.from = entityId;
      } else {
        relation.to = entityId;
        relation.from = vm.relationsToDelete[i].relatedEntity;
      }
      tasks.push(
        entityRelationService.deleteRelation(
          relation.from,
          relation.type,
          relation.to
        )
      );
    }
    if (tasks.length > 0) {
      return widgetContext.rxjs.forkJoin(tasks);
    }
    return widgetContext.rxjs.of([]);
  }
}
