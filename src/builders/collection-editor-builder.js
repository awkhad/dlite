Vue.component('collection-editor-builder', {
    template: `
        <b-modal id="collection-editor-builder" ref="collection-editor-builder" title="Build collection editor" @ok="build">

            <b-form-group label="Collection access point class" label-size="sm" label-class="mb-0" class="mb-1">
                <b-form-select v-model="className" :options="selectableClasses()" size="sm" @change="updateClasses"></b-form-select>
            </b-form-group>
            <b-form-group label="Collection getter" label-size="sm" label-class="mb-0" class="mb-1">
                <b-form-select v-model="methodName" :options="selectableMethods(className)" size="sm" @change="fillFields"></b-form-select>
            </b-form-group>
            <div v-if="instanceType">Instance class {{ instanceType.name }} fields:</div>
            <b-form-textarea
                v-if="instanceType"
                disabled
                id="textarea"
                v-model="fields"
                rows="3"
                size="sm" 
                max-rows="6"></b-form-textarea>
            
            <b-card class="mt-2" body-class="p-1">
                <b-form-group label="Allow create instance" label-size="sm" label-cols="8" label-class="mb-0 mt-0" class="mb-1">
                    <b-form-checkbox v-model="createInstance" size="sm" switch class="float-right"></b-form-checkbox>
                </b-form-group>
                <b-form-group label="Instance creation class" label-size="sm" label-class="mb-0" class="mb-1">
                    <b-form-select v-model="createClassName" :options="selectableClasses()" size="sm" :disabled="!createInstance"></b-form-select>
                </b-form-group>
                <b-form-group label="Instance creation method" label-size="sm" label-class="mb-0" class="mb-1">
                    <b-form-select v-model="createMethodName" :options="selectableMethods(createClassName)" size="sm" :disabled="!createInstance"></b-form-select>
                </b-form-group>
            </b-card>
            
            <b-card class="mt-2" body-class="p-1">
                <b-form-group label="Allow update instance" label-size="sm" label-cols="8" label-class="mb-0 mt-0" class="mb-1">
                    <b-form-checkbox v-model="updateInstance" size="sm" switch class="float-right"></b-form-checkbox>
                </b-form-group>
                <b-form-group label="Instance update class" label-size="sm" label-class="mb-0" class="mb-1">
                    <b-form-select v-model="updateClassName" :options="selectableClasses()" size="sm" :disabled="!updateInstance"></b-form-select>
                </b-form-group>
                <b-form-group label="Instance update method" label-size="sm" label-class="mb-0" class="mb-1">
                    <b-form-select v-model="updateMethodName" :options="selectableMethods(updateClassName)" size="sm" :disabled="!updateInstance"></b-form-select>
                </b-form-group>
            </b-card>
            
            <b-card class="mt-2" body-class="p-1">
                <b-form-group label="Allow delete instance" label-size="sm" label-cols="8" label-class="mb-0 mt-0" class="mb-1">
                    <b-form-checkbox v-model="deleteInstance" size="sm" switch class="float-right"></b-form-checkbox>
                </b-form-group>
                <b-form-group label="Instance delete class" label-size="sm" label-class="mb-0" class="mb-1">
                    <b-form-select v-model="deleteClassName" :options="selectableClasses()" size="sm" :disabled="!deleteInstance"></b-form-select>
                </b-form-group>
                <b-form-group label="Instance delete method" label-size="sm" label-class="mb-0" class="mb-1">
                    <b-form-select v-model="deleteMethodName" :options="selectableMethods(deleteClassName)" size="sm" :disabled="!deleteInstance"></b-form-select>
                </b-form-group>
            </b-card>
                
        </b-modal>
    `,
    data: function () {
        return {
            className: undefined,
            methodName: undefined,
            instanceType: undefined,
            fields: [],
            createInstance: false,
            createClassName: undefined,
            createMethodName: undefined,
            updateInstance: false,
            updateClassName: undefined,
            updateMethodName: undefined,
            deleteInstance: false,
            deleteClassName: undefined,
            deleteMethodName: undefined

        }
    },
    methods: {
        updateClasses() {
            this.createClassName = this.className;
            this.updateClassName = this.className;
            this.deleteClassName = this.className;
        },
        fillFields() {
            let method = domainModel.classDescriptors[this.className]['methodDescriptors'][this.methodName];
            let returnedClassName = method['componentType'];
            if (!returnedClassName) {
                this.notACollection = true;
                return;
            }
            this.instanceType = domainModel.classDescriptors[returnedClassName];
            this.fields = domainModel.classDescriptors[returnedClassName].fieldDescriptors;
        },
        selectableClasses() {
            return Tools.arrayConcat(domainModel.repositories, domainModel.services);
        },
        selectableMethods(className) {
            return className ? domainModel.classDescriptors[className]['methods'] : [];
        },
        createConnector(container, kind, className, methodName) {
            let connector = components.createComponentModel("ApplicationConnector");
            connector.kind = domainModel.classDescriptors[className].kind;
            connector.className = className;
            connector.methodName = methodName;
            components.registerComponentModel(connector);
            container.components.push(connector);
            return connector;
        },
        build() {
            if (!this.instanceType) {
                return;
            }
            console.info("building collection editor", this.instanceType);

            let container = components.createComponentModel("ContainerView");

            let collectionConnector = this.createConnector(container, domainModel.classDescriptors[this.className].kind, this.className, this.methodName);
            let createConnector = this.createConnector(container, domainModel.classDescriptors[this.createClassName].kind, this.createClassName, this.createMethodName);
            let updateConnector = this.createConnector(container, domainModel.classDescriptors[this.updateClassName].kind, this.updateClassName, this.updateMethodName);
            let deleteConnector = this.createConnector(container, domainModel.classDescriptors[this.deleteClassName].kind, this.deleteClassName, this.deleteMethodName);

            let split = components.createComponentModel("SplitView");

            let tableContainer = components.createComponentModel("ContainerView");
            let table = components.createComponentModel("TableView");
            components.fillTableFields(table, this.instanceType);
            table.dataSource = collectionConnector.cid;

            let updateInstanceContainer = components.buildInstanceForm(this.instanceType);
            if (this.updateInstance) {
                let updateButton = components.createComponentModel("ButtonView");
                updateButton.label = "Update " + Tools.camelToLabelText(Tools.toSimpleName(this.instanceType.name), true);
                updateButton.eventHandlers[0].actions[0] = {
                    targetId: updateConnector.cid,
                    name: 'invoke',
                    description: 'Invoke update connector',
                    argument: '$d(parent)'
                }
                components.registerComponentModel(updateButton);
                updateInstanceContainer.components.push(updateButton);
            }

            components.registerComponentModel(updateInstanceContainer);

            table.eventHandlers.push(
                {
                    global: false,
                    name: '@item-selected',
                    actions: [{
                        targetId: updateInstanceContainer.cid,
                        name: 'eval',
                        description: 'Update instance form',
                        argument: 'target.dataModel = value'
                    }]
                }
            );

            components.registerComponentModel(table);
            tableContainer.components.push(table);

            let createDialog = undefined;
            if (this.createInstance) {
                createDialog = components.createComponentModel("DialogView");
                createDialog.title = "Create " + Tools.camelToLabelText(Tools.toSimpleName(this.instanceType.name), true);
                let createInstanceContainer = components.buildInstanceForm(this.instanceType);
                createInstanceContainer.dataSource = '$object';
                let doCreateButton = components.createComponentModel("ButtonView");
                doCreateButton.label = "Create " + Tools.camelToLabelText(Tools.toSimpleName(this.instanceType.name), true);
                doCreateButton.eventHandlers[0].actions[0] = {
                    targetId: createConnector.cid,
                    name: 'invoke',
                    description: 'Invoke create connector',
                    argument: '$d(parent)'
                }
                doCreateButton.eventHandlers[0].actions.push({
                    targetId: collectionConnector.cid,
                    name: 'update',
                    description: 'Update table content'
                });

                components.registerComponentModel(doCreateButton);
                createInstanceContainer.components.push(doCreateButton);
                components.registerComponentModel(createInstanceContainer);
                createDialog.content = createInstanceContainer;
                components.registerComponentModel(createDialog);

                doCreateButton.eventHandlers[0].actions.push({
                    targetId: createDialog.cid,
                    name: 'hide',
                    description: 'Close dialog'
                });

                let createButton = components.createComponentModel("ButtonView");
                createButton.label = "Create " + Tools.camelToLabelText(Tools.toSimpleName(this.instanceType.name), true);
                createButton.eventHandlers[0].actions[0] = {
                    targetId: createDialog.cid,
                    name: 'show',
                    description: 'Open create dialog',
                }
                components.registerComponentModel(createButton);
                tableContainer.components.push(createButton);
            }

            if (this.deleteInstance) {
                let deleteButton = components.createComponentModel("ButtonView");
                deleteButton.label = "Delete " + Tools.camelToLabelText(Tools.toSimpleName(this.instanceType.name), true);
                deleteButton.eventHandlers[0].actions[0] = {
                    targetId: deleteConnector.cid,
                    name: 'invoke',
                    description: 'Invoke delete connector',
                    argument: `$c('${table.cid}').selectedItem`
                }
                deleteButton.eventHandlers[0].actions.push({
                    targetId: collectionConnector.cid,
                    name: 'update',
                    description: 'Update table content'
                });

                components.registerComponentModel(deleteButton);
                tableContainer.components.push(deleteButton);
            }

            components.registerComponentModel(tableContainer);

            split.primaryComponent = tableContainer;
            split.secondaryComponent = updateInstanceContainer;

            components.registerComponentModel(split);

            container.components.push(split);

            if (createDialog) {
                container.components.push(createDialog);
            }

            components.registerComponentModel(container);
            components.setChild(ide.getTargetLocation(), container);
            ide.selectComponent(container.cid);
            this.$refs['collection-editor-builder'].hide();

        }
    }
});

