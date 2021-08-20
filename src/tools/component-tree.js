Vue.component('component-tree', {
    template: `
         <ul class="tree root-tree">
            <li v-for="item in this.rootModels" :key="item.cid">
                <component-tree-node :nodeModel="item" :filter="filter">
                </component-tree-node>
            </li>
         </ul>
    `,
    props: ["rootModels", "filter"]
});
