Vue.component('input-view', {
    extends: editableComponent,
    template: `
        <div :id="cid" :style="componentBorderStyle()" :class="viewModel.layoutClass">
            <component-badge :component="getThis()" :edit="isEditable()" :targeted="targeted" :selected="selected"></component-badge>
            <b-badge v-if="isEditable() && viewModel.field" variant="info">{{ viewModel.field }}</b-badge>                
            <b-form-group :label="$eval(viewModel.label, null)" :label-for="'input_' + viewModel.cid" 
                :description="$eval(viewModel.description, null)" 
                :state="$eval(viewModel.state, null)"
                :invalid-feedback="$eval(viewModel.invalidFeedback, null)"
                :valid-feedback="$eval(viewModel.validFeedback, null)"
                :style="$eval(viewModel.style)"
                :class="viewModel.class">
                <b-form-input v-if="viewModel.field && dataModel" v-model="dataModel[viewModel.field]" 
                    :type="viewModel.inputType" 
                    :size="viewModel.size"
                    :state="$eval(viewModel.state, null)"
                    :placeholder="viewModel.placeholder"
                    :disabled="viewModel.disabled" @blur="onBlur" @change="onChange" @input="onInput" @update="onUpdate"></b-form-input>
                <b-form-input v-if="!viewModel.field || !dataModel" v-model="dataModel" 
                    :type="viewModel.inputType" 
                    :size="viewModel.size"
                    :state="$eval(viewModel.state, null)"
                    :placeholder="viewModel.placeholder"
                    :disabled="viewModel.disabled" @blur="onBlur" @change="onChange" @input="onInput" @update="onUpdate"></b-form-input>
            </b-form-group>
        </div>
    `,
    methods: {
        customEventNames() {
            return ["@blur", "@change", "@input", "@update"];
        },
        onBlur(value) {
            this.$emit("@blur", value);
        },
        onChange(value) {
            this.$emit("@change", value);
        },
        onInput(value) {
            this.$emit("@input", value);
        },
        onUpdate(value) {
            this.$emit("@update", value);
        },
        clear() {
            if (this.viewModel.field && this.dataModel) {
                this.dataModel[this.viewModel.field] = undefined;
            } else {
                this.dataModel = undefined;
            }
        },
        propNames() {
            return [
                "cid",
                "layoutClass", "class", "style", "dataSource",
                "field",
                "inputType",
                "label",
                "description",
                "size",
                "disabled",
                "placeholder",
                "state",
                "invalidFeedback",
                "validFeedback",
                "eventHandlers"];
        },
        customPropDescriptors() {
            return {
                inputType: {
                    type: 'select',
                    label: 'Type',
                    editable: true,
                    options: [
                        "text", "password", "email", "number", "url", "tel", "search", "date", "datetime", "datetime-local", "month", "week", "time", "range", "color"
                    ]
                },
                disabled: {
                    type: 'checkbox',
                    editable: true
                },
                size: {
                    type: 'select',
                    editable: true,
                    options: ['md', 'sm', 'lg']
                },
                state: {
                    type: 'text',
                    editable: true,
                    label: "Validation state"
                }
            }
        }

    }
});


