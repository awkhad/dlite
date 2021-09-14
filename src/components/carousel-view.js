Vue.component('carousel-view', {
    extends: editableComponent,
    template: `
        <div :id="cid" :style="componentBorderStyle()" :class="viewModel.layoutClass">
            <component-icon v-if="isEditable()" :type="viewModel.type"></component-icon>
            <component-badge :component="getThis()" :edit="isEditable()" :targeted="targeted" :selected="selected"></component-badge>
            <b-carousel 
                :background="$eval(viewModel.background, undefined)" 
                :controls="$eval(viewModel.controls, false)" 
                :fade="$eval(viewModel.fade, false)" 
                :img-width="$eval(viewModel.imgWidth, '')" 
                :img-height="$eval(viewModel.imgHeight, '')" 
                :indicators="$eval(viewModel.indicators, false)" 
                :interval="$eval(viewModel.interval, 5000)" 
                :label-goto-slide="$eval(viewModel.labelGotoSlide, undefined)" 
                :label-indicators="$eval(viewModel.labelIndicators, undefined)" 
                :label-next="$eval(viewModel.labelNext, undefined)" 
                :label-prev="$eval(viewModel.labelPrev, undefined)" 
                :no-animation="$eval(viewModel.noAnimation, false)" 
                :no-hover-pause="$eval(viewModel.noHoverPause, false)" 
                :no-touch="$eval(viewModel.noTouch, false)" 
                :no-wrap="$eval(viewModel.noWrap, false)" 
                >
                    
                <b-carousel-slide v-for="slide of viewModel.slides"
                    :background="$eval(slide.background, undefined)" 
                    :caption-html="$eval(slide.captionHtml, undefined)" 
                    :text-html="$eval(slide.textHtml, undefined)" 
                    :img-blank="$eval(slide.imgBlank, undefined)"
                    :img-src="$eval(slide.imgBlank, undefined) ? undefined : $eval(slide.imgSrc, undefined)"
                    :img-blank-color="$eval(slide.imgBlankColor, 'transparent')"
                >
                </b-carousel-slide>     
                               
            </b-carousel>
        </div>
    `,
    methods: {
        slides() {
            if (this.viewModel.useDataModel || this.viewModel.slides === undefined) {
                return this.dataModel;
            } else {
                return this.viewModel.slides;
            }
        },
        propNames() {
            return ["cid", "useDataModel",
                "background", "controls", "fade", "imgWidth", "imgHeight", "indicators", "interval",
                "labelGotoSlide", "labelIndicators", "labelPrev", "labelNext",
                "noAnimation", "noHoverPause", "noTouch", "noWrap", "slides",
                "layoutClass", "class", "style", "dataSource",
                "eventHandlers"];
        },
        customPropDescriptors() {
            return {
                background: {
                    type: 'text',
                    editable: true,
                    description: "Set the CSS color of the carousel's background",
                    category: 'style'
                },
                controls: {
                    type: 'checkbox',
                    editable: true,
                    description: "Enable the previous and next controls"
                },
                fade: {
                    type: 'checkbox',
                    editable: true,
                    description: "When set, changes the slide animation to a crossfade instead of a sliding effect"
                },
                indicators: {
                    type: 'checkbox',
                    editable: true,
                    description: "Enable the indicator buttons for jumping to specific slides"
                },
                interval: {
                    type: 'number',
                    editable: true,
                    label: 'Interval (ms)',
                    description: "Set the delay time (in milliseconds) between slides"
                },
                noAnimation: {
                    type: 'checkbox',
                    editable: true,
                    description: "When set, disables animation when transitioning between slides"
                },
                noHoverPause: {
                    type: 'checkbox',
                    editable: true,
                    description: "When set, disables the pausing of the slide show when the current slide is hovered"
                },
                noWrap: {
                    type: 'checkbox',
                    editable: true,
                    description: "Do not restart the slide show when then end is reached"
                },
                useDataModel: {
                    type: 'checkbox',
                    editable: true,
                    description: "When set, overrides the slides configuration with the data model (must be a list of slide descriptors)",
                    category: 'slides'
                },
                slides: {
                    type: 'custom',
                    editor: 'carousel-slides-panel',
                    category: 'slides'
                }

            }
        }

    }
});


