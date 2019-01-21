import style from './index.module.styl'
import {mapState, mapActions} from 'vuex'

const Panel = {
  functional: true,
  render(h, context) {
    return (
      <div class={style['panel']}>
        <div class={style['label']}>{context.props.title}</div>
        <div class={style['content']}>{context.children}</div>
      </div>
    )
  }
}

export default {
  components: {
    Panel
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
    handleInputChange(key) {
      return value => {
        this.changeElementAttribute({key, value, id: this.selectedElementId})
      }
    },
    handleRadiusInput(index) {
      return value => {
        const borderValue = [...this.selectedElement.borderValue]
        borderValue.splice(index, 1, +value)
        this.changeElementAttribute({key: 'borderValue', value: borderValue, id: this.selectedElementId})
      }
    },
    handleSetTheSameThemeColor(key) {
      return () => {
        this.changeElementAttribute({key, value: '$themeColor', id: this.selectedElementId})
      }
    },
    ...mapActions([
      'changeElementAttribute'
    ])
  },
  render(h) {
    if (!this.selectedElement) return (
      <div class={style['setting-wrap']}>
        <div class={style['title']}>元素属性设置区</div>
        <div class={style['container']}>
          <div class={style['no-selected']}>暂未选中元素</div>
        </div>
      </div>
    )

    const themeColor = this.$store.state.present.themeColor
    const { name, width, height, left, top, borderWidth, borderValue, rotate, borderColor, backgroundColor } = this.selectedElement
    const [a, b, c, d, e, f, g, i] = borderValue
    
    return (
      <div class={style['setting-wrap']}>
        <div class={style['title']}>元素属性设置区</div>
        <div class={style['container']}>
          <panel title="名称" >
            <el-input onInput={this.handleInputChange('name')} placeholder="请输入内容" value={name} />
          </panel>
          <panel title="位置" >
            <div class={style['input-wrap']}>
              <el-input type="number" onInput={this.handleInputChange('left')} placeholder="请输入内容" value={left}>
                <template slot="prepend">X</template>
              </el-input>
              <el-input type="number" onInput={this.handleInputChange('top')} placeholder="请输入内容" value={top}>
                <template slot="prepend">Y</template>
              </el-input>
            </div>
          </panel>
          <panel title="大小" >
            <div class={style['input-wrap']}>
              <el-input type="number" onInput={this.handleInputChange('width')} placeholder="请输入内容" value={width}>
                <template slot="prepend">宽</template>
              </el-input>
              <el-input type="number" onInput={this.handleInputChange('height')} placeholder="请输入内容" value={height}>
                <template slot="prepend">高</template>
              </el-input>
            </div>            
          </panel>
          <panel title="外边宽" >
            <div class={style['input-wrap']}>
              <div class={style['radius-item']}>
                <el-input type="number" onInput={this.handleInputChange('borderWidth')} placeholder="请输入内容" value={borderWidth}>
                  <template slot="append">px</template>
                </el-input>
                <el-slider min={0} max={30} onInput={this.handleInputChange('borderWidth')} class={style['slide']} value={borderWidth}></el-slider>
              </div>       
            </div>       
          </panel>
          <panel title="圆角">
            <div class={style['radius-item']}>
              <el-input onInput={this.handleRadiusInput(0)} class={style['radius-input']}  placeholder="请输入内容" value={a}>
                <template slot="prepend">水平左上</template>
                <template slot="append">%</template>
              </el-input>
              <el-slider onInput={this.handleRadiusInput(0)} class={style['slide']} value={a}></el-slider>
            </div>
            <div class={style['radius-item']}>
              <el-input onInput={this.handleRadiusInput(1)} type="number" class={style['radius-input']}  placeholder="请输入内容" value={b}>
                <template slot="prepend">水平右上</template>
                <template slot="append">%</template>
              </el-input>
              <el-slider onInput={this.handleRadiusInput(1)} class={style['slide']} value={b}></el-slider>
            </div>
            <div class={style['radius-item']}>
              <el-input onInput={this.handleRadiusInput(2)} type="number" class={style['radius-input']}  placeholder="请输入内容" value={c}>
                <template slot="prepend">水平右下</template>
                <template slot="append">%</template>
              </el-input>
              <el-slider onInput={this.handleRadiusInput(2)} class={style['slide']} value={c}></el-slider>
            </div>
            <div class={style['radius-item']}>
              <el-input onInput={this.handleRadiusInput(3)} class={style['radius-input']}  placeholder="请输入内容" value={d}>
                <template slot="prepend">水平左下</template>
                <template slot="append">%</template>
              </el-input>
              <el-slider onInput={this.handleRadiusInput(3)} class={style['slide']} value={d}></el-slider>
            </div>
            <div class={style['radius-item']}>
              <el-input onInput={this.handleRadiusInput(4)} type="number" class={style['radius-input']}  placeholder="请输入内容" value={e}>
                <template slot="prepend">垂直左上</template>
                <template slot="append">%</template>
              </el-input>
              <el-slider onInput={this.handleRadiusInput(4)} class={style['slide']} value={e}></el-slider>
            </div>
            <div class={style['radius-item']}>
              <el-input onInput={this.handleRadiusInput(5)} type="number" class={style['radius-input']}  placeholder="请输入内容" value={f}>
                <template slot="prepend">垂直右上</template>
                <template slot="append">%</template>
              </el-input>
              <el-slider onInput={this.handleRadiusInput(5)} class={style['slide']} value={f}></el-slider>
            </div>
            <div class={style['radius-item']}>
              <el-input onInput={this.handleRadiusInput(6)} type="number" class={style['radius-input']}  placeholder="请输入内容" value={g}>
                <template slot="prepend">垂直右下</template>
                <template slot="append">%</template>
              </el-input>
              <el-slider onInput={this.handleRadiusInput(6)} class={style['slide']} value={g}></el-slider>
            </div>
            <div class={style['radius-item']}>
              <el-input onInput={this.handleRadiusInput(7)} type="number" class={style['radius-input']}  placeholder="请输入内容" value={i}>
                <template slot="prepend">垂直左下</template>
                <template slot="append">%</template>
              </el-input>
              <el-slider onInput={this.handleRadiusInput(7)} class={style['slide']} value={i}></el-slider>
            </div>
          </panel>

          <panel title="旋转">
            <div class={style['radius-item']}>
              <el-input type="number" onInput={this.handleInputChange('rotate')} class={style['radius-input']}  placeholder="请输入内容" value={rotate}>
                <template slot="prepend">角度</template>
                <template slot="append">deg</template>
              </el-input>
              <el-slider min={0} max={360} onInput={this.handleInputChange('rotate')} class={style['slide']} value={rotate}></el-slider>
            </div>
          </panel>
          <panel title="边框色">
            <div class={style['color-setting']}>
              <el-color-picker
                predefine={[
                  '#edabc8',
                  '#e483b0',
                  '#de4f53',
                  '#dd3a37',
                  '#241f51'
                ]}
                onInput={this.handleInputChange('borderColor')}
                value={borderColor === '$themeColor' ? themeColor : borderColor} />
              <el-button onClick={this.handleSetTheSameThemeColor('borderColor')} class={style['btn']} size="medium">设为背景色</el-button>
            </div>
          </panel>
          <panel title="背景色">
            <div class={style['color-setting']}>
              <el-color-picker
                predefine={[
                  '#edabc8',
                  '#e483b0',
                  '#de4f53',
                  '#dd3a37',
                  '#241f51'
                ]}
                onInput={this.handleInputChange('backgroundColor')}
                value={backgroundColor === '$themeColor' ? themeColor : backgroundColor} />
              <el-button onClick={this.handleSetTheSameThemeColor('backgroundColor')}  class={style['btn']} size="medium">设为背景色</el-button>
            </div>
          </panel>
        </div>
        
      </div>
    )
  }
}