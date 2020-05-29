import Vue from 'vue'
// 导入弹框提示组件message
import { Button, Form, FormItem, Input, Message, Container, 
    Header, Aside, Main, 
    Menu, Submenu, MenuItemGroup,MenuItem,
    Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip,Pagination,Dialog,
    MessageBox,
    Tag, Tree, Select, Option,Cascader,
    Alert,Tabs,TabPane} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.component(MessageBox)
// Vue.use(MessageBox)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)


// 把弹框组件挂到到了Vue的原型对象上，那每一个组件都可以直接通过 this 来访问 $message ，就可以进行弹框提示
Vue.prototype.$message = Message
// 在confirm确认框中，在点击确定时，若是需要请求接口从数据库中删除，直接在then中写对应的请求就好
Vue.prototype.$confirm = MessageBox.confirm
