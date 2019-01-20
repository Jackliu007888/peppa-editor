import style from './index.module.styl'
import {mapState, mapActions} from 'vuex'
import Utils from '@/common/js/utils'
export default {
  components: {
    VueDraggable: () => import('vuedraggable')
  },
  computed: {
    sortedEelements() {
      return this.elements.length < 2 ? this.elements : Utils.deepClone(this.elements).sort((a, b) => b.zIndex - a.zIndex)
    },
    ...mapState({
      elements: state => state.present.elements,
      selectedElement: state => state.selectedElement
    })
  },
  methods: {
    handleDelElement(e) {
      const { id } = e.currentTarget.dataset
      this.delElement({id, list: this.sortedEelements})
    },
    handleClickElement(e) {
      const { id } = e.currentTarget.dataset
      this.changeSelectedElement(id)
    },
    ...mapActions([
      'newElements',
      'delElement',
      'changeSelectedElement',
      'changeElementSort'
    ])
  },
  render(h) {
    return (
      <div class={style['layer-wrap']}>
        <div class={style['layer-title']}>元素图层区</div>
        <div class={style['main']}>
          <div class={style['scroll']}>
            <div class={style['new']}>
              <el-button size="medium" onClick={this.newElements}>新建元素</el-button>
            </div>
            <vue-Draggable
              onInput={this.changeElementSort}
              value={this.sortedEelements}
            >
              {
                this.sortedEelements.map((item, index) => (
                  <div
                    data-id={item.id}
                    onClick={this.handleClickElement}
                    class={{
                      [style['item']]: true,
                      [style['selected']]: item.id === this.selectedElement
                    }}
                    key={item.id + index}>
                    <div class={style['left']}>
                      <div class={style['index']}>{item.zIndex}</div>
                      <div class={style['name']}>{item.name}</div>
                    </div>
                    <div data-id={item.id} onClick={this.handleDelElement} class={style['right']}><i class="el-icon-delete"></i></div>
                  </div>
                ))
              }
            </vue-Draggable>
          </div>
        </div>
      </div>
    )
  }
}