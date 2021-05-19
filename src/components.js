let Tools = {};

Tools.uuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

Tools.camelToKebabCase = function (str) {
    if (str.charAt(0).toUpperCase() === str.charAt(0)) {
        str = str.charAt(0).toLowerCase() + str.slice(1);
    }
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

Tools.camelToLabelText = function (str, lowerCase) {
    str = str.replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`);
    if (lowerCase) {
        return str;
    } else {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

Tools.truncate = function (str, size) {
    if (str.length > size - 6) {
        return str.substring(0, size - 6) + "(...)";
    } else {
        return str;
    }
}

Tools.toSimpleName = function (qualifiedName) {
    return qualifiedName.substring(qualifiedName.lastIndexOf('.') + 1);
}

Tools.arrayMove = function (arr, fromIndex, toIndex) {
    let element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    return arr;
}

Tools.arrayConcat = function (array, arrayOrItem) {
    if (Array.isArray(arrayOrItem)) {
        Array.prototype.push.apply(array, arrayOrItem);
    } else {
        array.push(arrayOrItem);
    }
    return array;
}

Tools.functionBody = function (f) {
    let entire = f.toString();
    return entire.toString().slice(entire.toString().indexOf("{") + 1, entire.lastIndexOf("}"));
}

Tools.inputType = function (type, fieldType) {
    switch (type) {
        case 'java.lang.String':
            return 'text';
        case 'java.util.Date':
        case 'java.sql.Date':
            return 'date';
    }
    return 'text';
}

Tools.getCookie = function (name) {
    let cookie = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cookie) == 0) {
            return c.substring(cookie.length, c.length);
        }
    }
    return "";
}

Tools.setCookie = function (name, value, expirationDate) {
    let expires = undefined;
    if (expirationDate) {
        expires = "expires=" + d.toUTCString();
    }
    if (expires) {
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    } else {
        document.cookie = name + "=" + value + ";path=/";
    }
}

Tools.diff = function (array, fields) {
    if (fields) {
        return array.map((e, i) => {
            let o = JSON.parse(JSON.stringify(e));
            for (let field of fields) {
                if (i === 0) {
                    o[field] = 0;
                } else {
                    o[field] = o[field] - array[i - 1][field];
                }
            }
            return o;
        });
    } else {
        return array.map((e, i) => {
            let r = 0;
            if (i > 0) {
                r = e - array[i - 1];
            }
            return r;
        });
    }
}

let applicationModel = {
    defaultPage: "index",
    navbar: {
        cid: "navbar",
        type: "NavbarView",
        brand: "App name",
        navigationItems: [{
            pageId: "index",
            label: "Index"
        }]
    },
    autoIncrementIds: {}
};

let domainModel = {};

class Components {
    repository = {};
    ids = [];

    nextId(componentType) {
        if (!applicationModel.autoIncrementIds[componentType]) {
            applicationModel.autoIncrementIds[componentType] = 0;
        }
        let nextId = applicationModel.autoIncrementIds[componentType];
        applicationModel.autoIncrementIds[componentType] = nextId + 1;
        return nextId;
    }

    getComponentModels() {
        return this.repository;
    }

    getComponentIds() {
        return this.ids;
    }

    fillComponentModelRepository(viewModel) {
        if (Array.isArray(viewModel)) {
            for (const subModel of viewModel) {
                this.fillComponentModelRepository(subModel);
            }
        } else if (typeof viewModel === 'object') {
            for (const key in viewModel) {
                if (key === 'cid') {
                    this.registerComponentModel(viewModel);
                } else {
                    this.fillComponentModelRepository(viewModel[key]);
                }
            }
        }
    }

    mapTemplate(template, mapping) {
        if (Array.isArray(template)) {
            for (const subModel of template) {
                this.mapTemplate(subModel, mapping);
            }
        } else if (typeof template === 'object') {
            for (const key in template) {
                if (key === 'cid') {
                    let current = template.cid;
                    template.cid = Tools.camelToKebabCase(template.type) + '-' + this.nextId(template.type);
                    if (current !== template.cid) {
                        mapping[current] = template.cid;
                    }
                } else {
                    this.mapTemplate(template[key], mapping);
                }
            }
        }
    }

    redirectTemplate(template, mapping) {
        if (Array.isArray(template)) {
            for (const subModel of template) {
                this.redirectTemplate(subModel, mapping);
            }
        } else if (typeof template === 'object') {
            for (const key in template) {
                if (key !== 'cid' && key !== '_parentId') {
                    if (typeof template[key] === 'string') {
                        for (let id in mapping) {
                            if (template[key].indexOf(id) !== -1) {
                                console.info("SUBST", key, id, template[key]);
                                template[key] = template[key].replaceAll(id, mapping[id]);
                                // stop to avoid replacing back already replaced ids
                                // TODO: clever way
                                break;
                            }
                        }
                    } else {
                        this.redirectTemplate(template[key], mapping);
                    }
                }
            }
        }
    }

    registerTemplate(template) {
        let mapping = {};
        this.mapTemplate(template, mapping);
        console.info("MAPPINGS", mapping);
        this.redirectTemplate(template, mapping);
        this.fillComponentModelRepository(template);
        return template;
    }

    getDirectChildren(viewModel, children) {
        if (!children) {
            children = [];
        }
        for (const key in viewModel) {
            if (typeof viewModel[key] === 'object' && viewModel[key].cid !== undefined) {
                viewModel[key]._parentId = viewModel.cid;
                children.push(viewModel[key]);
            } else if (Array.isArray(viewModel[key])) {
                for (const subModel of viewModel[key]) {
                    if (typeof subModel === 'object' && subModel.cid !== undefined) {
                        subModel._parentId = viewModel.cid;
                        children.push(subModel);
                    }
                }
            }
        }
        return children;
    }

    setChild(targetLocation, childViewModel) {
        if (targetLocation.cid) {
            console.info("set child component");
            let parentComponentModel = components.getComponentModel(targetLocation.cid);
            let keyField = parentComponentModel[targetLocation.key];
            if (Array.isArray(keyField)) {
                if (targetLocation.index === undefined) {
                    throw new Error("undefined index for array key")
                }
                if (targetLocation.index >= keyField.length) {
                    keyField.push(childViewModel);
                } else {
                    keyField.splice(targetLocation.index, 0, childViewModel);
                    //keyField[targetLocation.index] = childViewModel;
                }
            } else {
                parentComponentModel[targetLocation.key] = childViewModel;
            }
        }
    }

    unsetChild(targetLocation) {
        if (targetLocation.cid) {
            console.info("unset child component");
            let parentComponentModel = components.getComponentModel(targetLocation.cid);
            if (Array.isArray(parentComponentModel[targetLocation.key])) {
                if (targetLocation.index === undefined) {
                    throw new Error("undefined index for array key");
                }
                parentComponentModel[targetLocation.key].splice(targetLocation.index, 1);
            } else {
                parentComponentModel[targetLocation.key] = undefined;
            }
        }
    }

    getRoots() {
        for (let model of Object.values(this.repository)) {
            delete model._parentId;
        }
        for (let model of Object.values(this.repository)) {
            this.getDirectChildren(model);
        }
        let roots = [];
        for (let model of Object.values(this.repository)) {
            if (!model._parentId) {
                roots.push(model);
            }
        }
        return roots;
    }

    deleteComponentModel(cid) {
        delete this.repository[cid];
        this.ids.splice(this.ids.indexOf(cid), 1);
        Vue.prototype.$eventHub.$emit('component-deleted', this.repository[cid]);
    }

    getComponentModel(componentId) {
        return componentId ? this.repository[componentId] : undefined;
    }

    hasComponent(componentId) {
        return this.repository[componentId] != null;
    }

    getComponentOptions(componentId) {
        return Vue.component(Tools.camelToKebabCase(this.getComponentModel(componentId).type)).options;
    }

    getViewComponent(componentId) {
        return Vue.component(Tools.camelToKebabCase(this.getComponentModel(componentId).type));
    }

    getView(componentId) {
        let element = document.getElementById(componentId);
        return element ? element['__vue__'] : undefined;
    }

    getHtmlElement(componentId) {
        return document.getElementById(componentId);
    }

    getContainerView(componentId) {
        let view = this.getView(componentId);
        return view ? view.$parent : undefined;
    }

    createComponentModel(type) {
        console.info("CREATING COMPONENT FOR " + type);
        let viewModel = undefined;
        switch (type) {
            case 'SplitView':
                viewModel = {
                    orientation: 'VERTICAL',
                    primaryComponent: {},
                    secondaryComponent: {}
                };
                break;
            case 'CollectionView':
                viewModel = {
                    repositoryType: "",
                    collectionName: ""
                };
                break;
            case 'InstanceView':
                viewModel = {
                    kind: 'entity',
                    className: undefined,
                    editable: false
                };
                break;
            case 'ContainerView':
                viewModel = {
                    layout: "block",
                    components: []
                };
                break;
            case 'DialogView':
                viewModel = {
                    title: "",
                    content: {}
                };
                break;
            case 'TableView':
                viewModel = {
                    selectMode: "single",
                    selectable: true,
                    striped: false,
                    hover: true,
                    small: false,
                    fields: [],
                    perPage: "0",
                    stacked: undefined,
                    filterIncludedFields: undefined,
                    filterExcludedFields: undefined
                };
                break;
            case 'CollectionProvider':
                viewModel = {
                    repositoryType: "",
                    collectionName: "",
                    content: {}
                };
                break;
            case 'InstanceProvider':
                viewModel = {
                    repositoryType: "",
                    selectorMethodName: "",
                    selectorArgument: "",
                    content: {}
                };
                break;
            case 'ApplicationConnector':
                viewModel = {
                    kind: 'repository',
                    className: "",
                    methodName: "",
                    arguments: "",
                    content: {}
                };
                break;
            case 'InputView':
                viewModel = {
                    label: "",
                    _type: "text",
                    description: "",
                    field: "",
                    size: "default",
                    disabled: false,
                    placeholder: "",
                    state: undefined,
                    validFeedback: undefined,
                    invalidFeedback: undefined
                };
                break;
            case 'ButtonView':
                viewModel = {
                    label: "Click me",
                    _type: "button",
                    variant: "secondary",
                    size: "default",
                    pill: false,
                    squared: false,
                    block: false,
                    disabled: false,
                    eventHandlers: [
                        {
                            global: false,
                            name: '@click',
                            actions: [
                                {
                                    targetId: '$self',
                                    name: 'eval',
                                    description: 'Default action',
                                    argument: undefined
                                }
                            ]
                        }
                    ]
                };
                break;
            case 'CheckboxView':
                viewModel = {
                    label: "",
                    size: "default",
                    description: "",
                    field: "",
                    disabled: false,
                    switch: true
                };
                break;
            case 'SelectView':
                viewModel = {
                    label: "",
                    size: "default",
                    description: "",
                    field: "",
                    disabled: false,
                    options: "=[]"
                };
                break;
            case 'CardView':
                viewModel = {
                    title: "",
                    subTitle: "",
                    imgSrc: "",
                    imgPosition: "top",
                    imgWidth: "",
                    imgHeight: "",
                    text: "",
                    body: {}
                };
                break;
            case 'IteratorView':
                viewModel = {
                    body: {}
                };
                break;
            case 'ImageView':
                viewModel = {
                    src: "",
                    blank: false,
                    blankColor: undefined,
                    display: "default",
                    width: "",
                    height: "",
                    rounded: false,
                    thumbnail: false
                };
                break;
            case 'ChartView':
                viewModel = {
                    label: undefined,
                    chartType: 'line',
                    labels: undefined,
                    width: '400',
                    height: '400',
                    backgroundColor: undefined,
                    borderColor: undefined,
                    borderWidth: undefined,
                    options: {}
                };
                break;
            case 'TimeSeriesChartView':
                viewModel = {
                    chartType: 'line',
                    width: '400',
                    height: '400',
                    timeSeriesList: [
                        {
                            key: 'y',
                            label: 'Value'
                        }
                    ]
                };
                break;
            case 'CookieConnector':
                viewModel = {
                    name: undefined,
                    expirationDate: undefined
                };
                break;
            case 'DataMapper':
                viewModel = {
                    mapper: undefined
                };
                break;
        }
        if (viewModel) {
            viewModel.type = type;
            if (!viewModel.eventHandlers) {
                viewModel.eventHandlers = [];
            }
        }
        console.info("created new component model", viewModel);
        return viewModel;
    }

    registerComponentModel(viewModel, componentId) {
        if (viewModel) {
            console.info("registering view model", viewModel, componentId);
            if (componentId) {
                viewModel.cid = componentId;
            } else {
                if (viewModel.cid == null) {
                    viewModel.cid = Tools.camelToKebabCase(viewModel.type) + '-' + this.nextId(viewModel.type);
                }
            }
            this.repository[viewModel.cid] = viewModel;
            this.ids.push(viewModel.cid);
            Vue.prototype.$eventHub.$emit('component-created', viewModel.cid);
        }
    }

    propNames(viewModel) {
        let f = this.getComponentOptions(viewModel.cid).methods.propNames;
        let propNames = f ? f() : undefined;
        if (!propNames) {
            propNames = [];
            for (const propName in viewModel) {
                propNames.push(propName);
            }
        }
        return propNames;
    }

    propDescriptors(viewModel) {
        let propDescriptors = [];
        let f = this.getComponentOptions(viewModel.cid).methods.customPropDescriptors;
        let customPropDescriptors = f ? f() : {};

        if (!customPropDescriptors.eventHandlers) {
            customPropDescriptors.eventHandlers = {
                type: 'custom',
                editor: 'events-panel',
                label: 'Events',
                name: 'eventHandlers'
            };
        }
        if (!customPropDescriptors.dataSource) {
            customPropDescriptors.dataSource = {
                type: 'select',
                label: 'Data source',
                name: 'dataSource',
                editable: true,
                options: Tools.arrayConcat(['', '$parent', '$object', '$array'], components.getComponentIds())
            };
        }

        for (const propName of this.propNames(viewModel)) {
            console.info(propName, viewModel);
            let propDescriptor = customPropDescriptors[propName] ? customPropDescriptors[propName] : {
                type: typeof viewModel[propName] === 'string'
                    ? 'text' : typeof viewModel[propName] === 'boolean'
                        ? 'checkbox' : Array.isArray(viewModel[propName])
                            ? 'table' : (viewModel[propName] && viewModel[propName].cid)
                                ? 'ref' : 'text'
            };
            if (propDescriptor.editable === undefined) {
                propDescriptor.editable = (propName !== 'cid');
            }
            if (propDescriptor.label === undefined) {
                propDescriptor.label = propName === 'cid' ? 'ID' : Tools.camelToLabelText(propName);
            }
            propDescriptor.name = propName;
            propDescriptors.push(propDescriptor);
        }
        return propDescriptors;
    }

    buildInstanceForm(instanceType) {
        let instanceContainer = this.createComponentModel("ContainerView");

        for (let propName of instanceType.fields) {
            let prop = instanceType.fieldDescriptors[propName];
            let component = undefined;
            if (prop.options) {
                component = components.createComponentModel("SelectView");
                component.options = '=' + JSON.stringify(prop.options);
            } else {
                component = components.createComponentModel("InputView");
                component._type = Tools.inputType(prop.type, prop.type);
            }
            component.field = prop.field;
            component.dataSource = '$parent';
            component.label = Tools.camelToLabelText(prop.field);
            components.registerComponentModel(component);
            instanceContainer.components.push(component);
        }
        return instanceContainer;
    }

    fillTableFields(tableView, instanceType) {
        for (let propName of instanceType.fields) {
            //let prop = instanceType.fieldDescriptors[propName];
            tableView.fields.push({
                key: propName,
                label: Tools.camelToLabelText(propName)
            });
        }
        return tableView;
    }

}

let components = new Components();

function $c(componentId) {
    return components.getView(componentId);
}

function $v(componentId) {
    return components.getView(componentId).viewModel;
}

function $d(componentOrComponentId, optionalValue) {
    if (!componentOrComponentId) {
        return undefined;
    }
    let view = typeof componentOrComponentId === 'string' ? components.getView(componentOrComponentId) : componentOrComponentId;
    if (!view) {
        return undefined;
    }
    if (optionalValue !== undefined) {
        view.dataModel = optionalValue;
    }
    return view.dataModel;
}

// TODO: add 'getParent' to editable components
// function $parent(componentOrComponentId) {
//     let view = typeof componentOrComponentId === 'string' ? components.getView(componentOrComponentId) : componentOrComponentId;
//     if (!view) {
//         return undefined;
//     }
//     return view.$parent.$parent;
// }