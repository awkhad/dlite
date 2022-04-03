/*
 * d.Lite - low-code platform for local-first Web/Mobile development
 * Copyright (C) 2022 CINCHEO
 *                    https://www.cincheo.com
 *                    renaud.pawlak@cincheo.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

Vue.component('textarea-view', {
    extends: editableComponent,
    template: `
        <div :id="cid" :style="componentBorderStyle()" :class="viewModel.layoutClass" 
            :draggable="$eval(viewModel.draggable, false) ? true : false"
            v-on="boundEventHandlers()"
        >
            <component-badge :component="getThis()" :edit="isEditable()" :targeted="targeted" :selected="selected"></component-badge>
            <b-badge v-if="isEditable() && viewModel.field" variant="info">{{ viewModel.field }}</b-badge>                
            <b-form-group :label="$eval(viewModel.label, null)" :label-for="'input_' + viewModel.cid" 
                :label-cols="labelCols()"
                :label-class="$eval(viewModel.labelClass, null)"
                :label-size="$eval(viewModel.size, null)"
                :description="$eval(viewModel.description, null)" 
                :state="$eval(viewModel.state ? viewModel.state : undefined, null)"
                :invalid-feedback="$eval(viewModel.invalidFeedback, null)"
                :valid-feedback="$eval(viewModel.validFeedback, null)"
                :style="$eval(viewModel.style, null)"
                :class="$eval(viewModel.class, null)"
            >
                <b-form-textarea v-model="value" 
                    :number="$eval(viewModel.inputType, null) === 'number' ? true : false"
                    :rows="$eval(viewModel.rows, null)"
                    :maxRows="$eval(viewModel.maxRows, null)"
                    :size="$eval(viewModel.size, null)"
                    :state="$eval(viewModel.state ? viewModel.state : undefined, null)"
                    :placeholder="$eval(viewModel.placeholder, null)"
                    :disabled="$eval(viewModel.disabled, false)" 
                    :required="$eval(viewModel.required, false)"
                    @blur="onBlur" @change="onChange" @input="onInput" @update="onUpdate"
                ></b-form-textarea>
            </b-form-group>
        </div>
    `,
    methods: {
        labelCols() {
            let cols = undefined;
            if (this.$eval(this.viewModel.horizontalLayout, false)) {
                cols = 'auto';
                if (this.viewModel.labelCols) {
                    cols = this.$eval(this.viewModel.labelCols, 'auto');
                    if (cols == 0) {
                        cols = 'auto';
                    }
                }
            }
            return cols;
        },
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
                "horizontalLayout",
                "labelCols",
                "labelClass",
                "dataSource",
                "field",
                "label",
                "description",
                "size",
                "disabled",
                "rows",
                "maxRows",
                "placeholder",
                "required",
                "state",
                "invalidFeedback",
                "validFeedback",
                "eventHandlers"
            ];
        },
        customPropDescriptors() {
            return {
                disabled: {
                    type: 'checkbox',
                    editable: true
                },
                required: {
                    type: 'checkbox',
                    editable: true
                },
                placeholder: {
                    type: 'text'
                },
                rows: {
                    type: 'number'
                },
                maxRows: {
                    type: 'number'
                },
                horizontalLayout: {
                    type: 'checkbox',
                    label: 'Horizontal layout',
                    editable: true,
                    category: 'style'
                },
                labelCols: {
                    label: 'Label width',
                    type: 'range',
                    min: 0,
                    max: 11,
                    step: 1,
                    category: 'style',
                    hidden: (viewModel) => !viewModel.horizontalLayout,
                    description: 'Number of columns for the label when horizontal layout'
                },
                labelClass: {
                    label: 'Label class',
                    type: 'text',
                    category: 'style',
                    description: 'Class(es) (space-separated) applying to the label'
                },
                size: {
                    type: 'select',
                    editable: true,
                    options: ['md', 'sm', 'lg']
                },
                state: {
                    type: 'text',
                    actualType: 'boolean',
                    editable: true,
                    label: "Validation state"
                }
            }
        }

    }
});

