import { d as defineComponent, h } from "./index.js";
var ____all_ = defineComponent({
  data() {
    return {
      msg: "hello world~~~"
    };
  },
  render() {
    return /* @__PURE__ */ h("view", {
      onTap: () => {
        wx.navigateTo({ url: "/About" });
      }
    }, this.msg);
  }
});
export { ____all_ as default };
