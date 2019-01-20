import style from './index.module.styl'
import { mapState, mapActions } from 'vuex'
import { fromEvent } from 'rxjs'
import { map, takeUntil, concatAll, withLatestFrom, tap } from 'rxjs/operators'
import Utils from '@/common/js/utils'

export default {
  directives: {
    noSelect: {
      bind: el => {
        /* eslint-disable-next-line */
        el.onselectstart = e => false
        /* eslint-disable-next-line */
        el.oncontextmenu = e => false
      }
    }
  },
  watch: {
    selectedElementId(val) {
      if (val) {
        this.$nextTick(() => {
          this.grabElement()
        })
      }
    }
  },
  computed: {
    selectedElement() {
      return this.elements.find(d => d.id === this.selectedElementId)
    },
    ...mapState({
      elements: state => state.present.elements,
      selectedElementId: state => state.selectedElement
    })
  },
  methods: {
    grabElement() {
      const selectedWrap = window.document.querySelector('#selectedWrap')
      const canvasEl = window.document.querySelector('#canvas')
      const mouseDown = fromEvent(selectedWrap, 'mousedown')
      const mouseUp = fromEvent(document, 'mouseup')
      const mouseMove = fromEvent(canvasEl, 'mousemove')
      const canvasElBox = [canvasEl.offsetWidth, canvasEl.offsetHeight]
      
      const validValue = (value, max, min) => {
        return Math.min(Math.max(value, min), max)
      }

      let initPos
      mouseDown
        .pipe(
          tap(e => {
            e.stopPropagation()
            const elememt = Utils.deepClone(this.selectedElement)
            initPos = {
              left: elememt.left,
              top: elememt.top,
            }
          }),
          map(() => mouseMove.pipe(takeUntil(mouseUp))),
          concatAll(),
          withLatestFrom(mouseDown, (move, down) => {
            const elememt = Utils.deepClone(this.selectedElement)
            const elememtBox = [elememt.width, elememt.height]
            return {
              left: validValue(initPos.left + move.clientX - down.clientX, canvasElBox[0] - elememtBox[0], 0),
              top: validValue(initPos.top + move.clientY - down.clientY, canvasElBox[1] - elememtBox[1], 0)
            }
          }
          ))
        .subscribe(({left, top}) => {
          this.changeElementAttribute({key: 'left', value: left, id: this.selectedElementId})
          this.changeElementAttribute({key: 'top', value: top, id: this.selectedElementId})
        })
    },
    ...mapActions([
      'changeElementAttribute'
    ])
  },
  render(h) {
    const { themeColor, elements } = this.$store.state.present
    

    const elementsCb = (item, index) => {
      const { zIndex, width, height, left, top, borderWidth, borderValue, rotate, borderColor, backgroundColor } = item
      const [a, b, c, d, e, f, g, i] = borderValue 

      const wrapStyle = {
        zIndex,
        width: width + 'px',
        height: height + 'px',
        left: left + 'px',
        top: top + 'px',
        transform: `rotate(${rotate}deg)`,
      }
      const itemStyle = {
        ...wrapStyle,
        backgroundColor,
        borderColor,
        borderStyle: 'solid',
        boxSizing: 'border-box',
        borderWidth: borderWidth + 'px',
        borderRadius: `${a}% ${b}% ${c}% ${d}% / ${e}% ${f}% ${g}% ${i}%`
      }


      if (item.id === this.selectedElementId) {
        return (
          <div id="selectedWrap" key={index} style={wrapStyle} class={style['selected-wrap']}>
            <div
              style={{
                ...itemStyle,
                transform: `rotate(${0}deg)`,
              }}>
            </div>
          </div>
        )
      }
      return (
        <div
          class={style['item']}
          key={index}
          style={itemStyle}>
        </div>
      )
    }
    
    return (
      <div class={style['canvas-wrap']} v-noSelect>
        <div style={`background-color: ${themeColor}`} class={style['canvas']} id="canvas">
          {
            elements.map(elementsCb)
          }
        </div>
      </div>
    )
  }
}