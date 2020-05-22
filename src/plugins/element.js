import Vue from 'vue'
// 导入弹框提示组件message
import { Button, Form, FormItem,
     Input, Message} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 把弹框组件挂到到了Vue的原型对象上，那每一个组件都可以直接通过 this 来访问 $message ，就可以进行弹框提示
Vue.prototype.$message = Message
