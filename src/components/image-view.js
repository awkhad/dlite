Vue.component('image-view', {
    extends: editableComponent,
    template: `
        <div :id="cid" :style="componentBorderStyle()" :class="viewModel.layoutClass">
            <component-badge :component="getThis()" :edit="isEditable()" :targeted="targeted" :selected="selected"></component-badge>
            <b-img 
                :class="$eval(viewModel.class)"
                :src="$eval(viewModel.src)" 
                :blank="viewModel.blank" 
                :blank-color="viewModel.blankColor" 
                :block="viewModel.display === 'block'" 
                :center="viewModel.display === 'center'"
                :fluid="viewModel.display === 'fluid'"
                :fluid-grow="viewModel.display === 'fluid-grow'"
                :left="viewModel.display === 'left'"
                :right="viewModel.display === 'right'"
                :height="$eval(viewModel.height)"
                :width="$eval(viewModel.width)"
                :rounded="$eval(viewModel.rounded)"
                :thumbnail="$eval(viewModel.thumbnail)"
                :style="$eval(viewModel.style) + ';' + ($eval(viewModel.invertColors) ? 'filter: invert(1)' : '')"
                @click="onClick">
            </b-img>
        </div>
    `,
    methods: {
        propNames() {
            return ["cid", "layoutClass", "class", "style", "dataSource", "field", "src", "blank", "blankColor", "display", "width", "height", "rounded", "thumbnail", "invertColors", "eventHandlers"];
        },
        customPropDescriptors() {
            return {
                src: {
                    label: 'URL',
                    type: 'text',
                    editable: true
                },
                blank: {
                    type: 'checkbox',
                    editable: true
                },
                blankColor: {
                    inputType: 'color',
                    editable: true
                },
                display: {
                    type: 'select',
                    editable: true,
                    options: [
                        'default', 'block', 'center', 'fluid', 'fluid-grow', 'left', 'right'
                    ]
                },
                rounded: {
                    type: 'checkbox',
                    editable: true
                },
                thumbnail: {
                    type: 'checkbox',
                    editable: true
                },
                invertColors: {
                    type: 'checkbox',
                    editable: true
                }
            }
        }

    }
});


