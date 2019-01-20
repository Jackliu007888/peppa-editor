import PeppaEditor from '@/components/peppa-editor'
import store from '@/store'

export default {
  store,
  components: {
    PeppaEditor
  },
  render(h) {
    return (
      <div id="app" >
        <peppa-editor />
      </div>
    )
  }
}