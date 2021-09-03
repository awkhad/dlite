Vue.component('timepicker-view', {
    extends: editableComponent,
    template: `
        <div :id="cid" :style="componentBorderStyle()" :class="viewModel.layoutClass"
            :draggable="$eval(viewModel.draggable, false) ? true : false"
            v-on="boundEventHandlers({'click': onClick})"
        >
            <component-badge :component="getThis()" :edit="isEditable()" :targeted="targeted" :selected="selected"></component-badge>
            <b-badge v-if="isEditable() && viewModel.field" variant="info">{{ viewModel.field }}</b-badge>
            <b-form-group :label="$eval(viewModel.label, '#error#')" :label-for="'input_' + viewModel.cid" :description="$eval(viewModel.description)" 
                :label-cols="$eval(viewModel.horizontalLayout, false) ? 'auto' : undefined"
                :style="$eval(viewModel.style, null)"
                :label-size="$eval(viewModel.size, null)"
                :class="$eval(viewModel.class, null)"
            >
                <b-form-timepicker :ref="'component-'+cid" v-model="value" 
                    :disabled="$eval(viewModel.disabled, true)" 
                    @input="onInput" 
                    @hidden="onHidden" 
                    @shown="onShown" 
                    @context="onContext"
                    :style="$eval(viewModel.style, null)"
                    :class="$eval(viewModel.class, null)"
                    :size="$eval(viewModel.size, null)"
                    ></b-form-timepicker>
            </b-form-group>
        </div>
    `,
    methods: {
        customEventNames() {
            return ["@input", "@hidden", "@shown", "@context"];
        },
        onInput(value) {
            this.$emit("@input", value);
        },
        onHidden(value) {
            this.$emit("@hidden", value);
        },
        onShown(value) {
            this.$emit("@shown", value);
        },
        onContext(value) {
            this.$emit("@context", value);
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
                "horizontalLayout",
                "layoutClass", "class", "style", "size", "dataSource",
                "field",
                "label",
                "description",
                "disabled",
                "eventHandlers"];
        },
        customPropDescriptors() {
            return {
                horizontalLayout: {
                    type: 'checkbox',
                    label: 'Horizontal layout',
                    editable: true,
                    category: 'style'
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

