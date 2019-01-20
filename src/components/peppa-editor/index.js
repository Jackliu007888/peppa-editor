import style from './index.module.styl'
import Layer from './layer'
import Setting from './setting'
import CanvasWrap from './canvas'
import forwardIcon from '@/assets/icon/forward.svg'
import replyIcon from '@/assets/icon/reply.svg'
import settingIcon from '@/assets/icon/setting.svg'
import { mapGetters, mapState, mapActions } from 'vuex'
import axios from 'axios'
const BASE_URL = 'http://admin.dddog.com.cn/api/v1'
export default {
  data() {
    return {
      loading: false
    }
  },
  components: {
    Layer,
    Setting,
    CanvasWrap
  },
  computed: {
    ...mapState({
      themeColor: state => state.present.themeColor,
      configId: state => state._id
    }),
    ...mapGetters([
      'redoable',
      'undoable',
    ])
  },
  methods: {
    handleGetConfig() {
      this.$prompt('请输入上次所保存的作品名（请确保当前工作区已保存，获取配置会覆盖当前工作区）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.getConfig(value)
      }).catch(() => {})
    },
    handleSave() {
      this.loading = true
      axios.put(BASE_URL + '/peppa/' + this.configId, {
        name: this.$store.state.name,
        config: JSON.stringify(this.$store.state.present),
      }).then(res => {
        if (res.data.code !== 0) {
          throw new Error(res.data.msg)
        }
        this.$message.success('保存成功')
      }).catch(err => {
        console.error(err)
        this.$message.error('保存失败')
      }).finally(() => {
        this.loading = false
      })
    },
    handleSaveAs() {
      this.$prompt('请输入作品名（作品名可用在下次访问获取数据）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.loading = true
        axios.post(BASE_URL + '/peppa', {
          name: value,
          config: JSON.stringify(this.$store.state.present),
        }).then(res => {
          if (res.data.code !== 0) {
            throw new Error(res.data.msg)
          }
          this.$message.success('保存成功')
        }).catch(err => {
          console.error(err)
          this.$message.error('保存失败')
        }).finally(() => {
          this.loading = false
        })
      }).catch(() => {})
    },
    getConfig(value) {
      this.loading = true
      axios.get(BASE_URL + '/getPeppa', {
        params: {
          name: value
        }
      }).then(res => {
        if (res.data.code !== 0) {
          throw new Error(res.data.msg)
        }

        this.$message.success('获取成功')
        const { _id, config, name } = res.data.data
        this.loadConfig({ _id, config, name })
      }).catch(err => {
        console.error(err)
        this.$message.error('获取失败')
      }).finally (() => {
        this.loading = false
      })
    },
    ...mapActions([
      'changeThemeColor',
      'undo',
      'redo',
      'loadConfig'
    ])
  },
  mounted() {
    const name = window.location.pathname.slice(1)
    if (name) {
      this.getConfig(name)
    }
  },
  render(h) {
    return (
      <div class={style['peppa-editor-wrap']} v-loading={this.loading}>
        <div class={style['header-bar']}>
          <el-button onClick={this.handleGetConfig} type="primary" icon="el-icon-sort">获取</el-button>
          <el-button onClick={this.handleSave} type="primary" icon="el-icon-document">保存</el-button>
          <el-button onClick={this.handleSaveAs} type="primary" icon="el-icon-document">另存为</el-button>
        </div>
        <div class={style['content-body']}>
          <canvas-wrap />
          <div class={style['control-bar']}>
            <div
              onClick={this.undo}
              class={{
                [style['control-item']]: true,
                [style['disabled']]: !this.undoable
              }}>
              <img src={replyIcon} />
              <span>撤销</span>
            </div>
            <div
              onClick={this.redo}              
              class={{
                [style['control-item']]: true,
                [style['disabled']]: !this.redoable
              }} >
              <img src={forwardIcon} />
              <span>重做</span>
            </div>
            <div class={style['devide']}></div>
            <div class={style['control-item']}>
              <img src={settingIcon} />
              <span>设置</span>
            </div>
            <div class={style['devide']}></div>
            <el-color-picker
              predefine={[
                '#edabc8',
                '#e483b0',
                '#de4f53',
                '#dd3a37',
                '#241f51'
              ]}
              onInput={this.changeThemeColor}
              value={this.themeColor}
            />
          </div>
          <layer />
          <setting />
        </div>
      </div>
    )
  }
}