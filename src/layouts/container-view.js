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

Vue.component('container-view', {
    extends: editableComponent,
    template: `
         <b-container :id="cid" fluid :style="componentBorderStyle()" :class="componentClass()">
            <component-icon v-if="isEditable()" :type="viewModel.type"></component-icon>
            <component-badge :component="getThis()" :edit="isEditable()" :targeted="targeted" :selected="selected"></component-badge>
            <b-form v-if="viewModel.form" @sumbit="onSubmit" @reset="onReset">
                <div :style="containerStyle()"
                    class="h-100"
                    :draggable="$eval(viewModel.draggable, false) ? true : false" 
                    v-on="boundEventHandlers({'click': onClick})"
                >
                    <component-view v-for="(component, index) in viewModel.components" :key="component.cid" :cid="component.cid" keyInParent="components" :indexInKey="index" :inSelection="isEditable()" />
                    <!-- empty container to allow adding of components in edit mode -->
                    <component-view v-if="edit" cid="undefined" keyInParent="components" :indexInKey="viewModel.components ? viewModel.components.length : 0" :inSelection="isEditable()" />
                </div>
            </b-form>
            <div v-else :style="containerStyle()"
                class="h-100"
                :draggable="$eval(viewModel.draggable, false) ? true : false" 
                v-on="boundEventHandlers({'click': onClick})"
            >
                <component-view v-for="(component, index) in viewModel.components" :key="component.cid" :cid="component.cid" keyInParent="components" :indexInKey="index" :inSelection="isEditable()" />
                <!-- empty container to allow adding of components in edit mode -->
                <component-view v-if="edit" cid="undefined" keyInParent="components" :indexInKey="viewModel.components ? viewModel.components.length : 0" :inSelection="isEditable()" />
            </div>
            
        </b-container>
    `,
    methods: {
        onSubmit(event) {
            event.preventDefault();
            this.$eventHub.emit('@submit', event);
        },
        onReset(event) {
            event.preventDefault();
            this.$eventHub.emit('@reset', event);
        },
        containerStyle() {
            let style = 'display: flex; overflow: ' + (this.$eval(this.viewModel.scrollable, false) ? 'auto' : 'visible') + '; flex-direction: ' + (this.$eval(this.viewModel.direction, false) ? this.$eval(this.viewModel.direction) : 'column');
            if (this.viewModel.wrap) {
                style += '; flex-wrap: ' + this.$eval(this.viewModel.wrap, '');
            }
            if (this.viewModel.justify) {
                style += '; justify-content: ' + this.toFlexStyle(this.$eval(this.viewModel.justify, ''));
            }
            if (this.viewModel.alignItems) {
                style += '; align-items: ' + this.toFlexStyle(this.$eval(this.viewModel.alignItems, ''));
            }
            if (this.viewModel.alignContent) {
                style += '; align-content: ' + this.toFlexStyle(this.$eval(this.viewModel.alignContent, ''));
            }
            if (this.viewModel.style) {
                style += '; ' + this.$eval(this.viewModel.style, '');
            }
            // if (ide.editMode) {
            //     style += '; flex-wrap: wrap';
            // }
            return style;
        },
        toFlexStyle(style) {
            switch (style) {
                case 'end':
                    return 'flex-end';
                case 'start':
                    return 'flex-start';
                default:
                    return style;
            }
        },
        customEventNames() {
            return this.viewModel.form ? ['@submit', '@reset'] : [];
        },
        propNames() {
            return [
                "cid",
                "dataSource",
                "field",
                "form",
                "direction",
                "fillHeight",
                "wrap",
                "justify",
                "alignItems",
                "alignContent",
                "scrollable",
                "eventHandlers"
            ];
        },
        customPropDescriptors() {
            return {
                components: {
                    type: 'ref'
                },
                form: {
                    type: 'checkbox',
                    editable: true,
                    description: "If enabled, this container acts as a form and reacts on @submit and @reset events"
                },
                fillHeight: {
                    type: 'checkbox',
                    description: "Stretch vertically to fill the parent component height",
                    literalOnly: true
                },
                scrollable: {
                    type: 'checkbox',
                    editable: true
                },
                direction: {
                    type: 'select',
                    options: ['column', 'column-reverse', 'row', 'row-reverse'],
                    docLink: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/#flex-direction'
                },
                wrap: {
                    type: 'select',
                    options: ['nowrap', 'wrap', 'wrap-reverse'],
                    docLink: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/#flex-wrap'
                },
                justify: {
                    type: 'select',
                    options: ['start', 'end', 'center', 'space-between', 'space-around', 'space-evenly'],
                    docLink: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/#justify-content'
                },
                alignItems: {
                    type: 'select',
                    options: ['stretch', 'start', 'end', 'center', 'baseline'],
                    docLink: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/#align-items'
                },
                alignContent: {
                    type: 'select',
                    options: ['normal', 'stretch', 'start', 'end', 'center', 'space-between', 'space-around'],
                    docLink: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/#align-content'
                },
                index: 0
            };
        }
    }
});
