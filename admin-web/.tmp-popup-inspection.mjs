const width = Number(process.argv[2]);
const pages = await fetch("http://127.0.0.1:9333/json/list").then((response) => response.json());
const page = pages.find((entry) => entry.type === "page");
if (!page) throw new Error("No browser page found");
const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});
let id = 0;
const pending = new Map();
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  const waiter = pending.get(message.id);
  if (!waiter) return;
  pending.delete(message.id);
  message.error ? waiter.reject(message.error) : waiter.resolve(message.result);
});
const send = (method, params = {}) => {
  const callId = ++id;
  socket.send(JSON.stringify({ id: callId, method, params }));
  return new Promise((resolve, reject) => pending.set(callId, { resolve, reject }));
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const evaluate = async (expression) => {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
};
async function click(selector) {
  const p = await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}})()`);
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: p.x, y: p.y });
  await send("Input.dispatchMouseEvent", { type: "mousePressed", x: p.x, y: p.y, button: "left", clickCount: 1, pointerType: "mouse" });
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: p.x, y: p.y, button: "left", clickCount: 1, pointerType: "mouse" });
  await wait(800);
}
async function type(selector, text) {
  await click(selector);
  await send("Input.insertText", { text });
  return evaluate(`document.querySelector(${JSON.stringify(selector)}).value`);
}
await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width, height: width === 390 ? 844 : 1000, deviceScaleFactor: 1, mobile: false });
const login = await fetch("http://localhost:3000/api/admin/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ username: "admin", password: "Admin123!" }) }).then((response) => response.json());
await send("Page.navigate", { url: "http://localhost:5173/admin/login" });
await wait(500);
await evaluate(`localStorage.setItem('accessToken', ${JSON.stringify(login.accessToken)})`);
await send("Page.navigate", { url: "http://localhost:5173/admin/products/add" });
await wait(1500);
await click('#categoryId');
await evaluate(`window.dispatchEvent(new Event('resize'))`);
await wait(500);
const inspect = await evaluate(`(()=>{
  const summarize=(e)=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return{tag:e.tagName,class:e.className,rect:{x:r.x,y:r.y,w:r.width,h:r.height},overflow:s.overflow,overflowX:s.overflowX,overflowY:s.overflowY,position:s.position,zIndex:s.zIndex,transform:s.transform,filter:s.filter,backdropFilter:s.backdropFilter,contain:s.contain,isolation:s.isolation,opacity:s.opacity,visibility:s.visibility,display:s.display}};
  const trigger=document.querySelector('#categoryId'); const popup=[...document.querySelectorAll('.ant-select-dropdown')].at(-1);
  const ancestors=[]; for(let e=trigger;e;e=e.parentElement) ancestors.push(summarize(e));
  const popupAncestors=[]; for(let e=popup;e;e=e.parentElement) popupAncestors.push(summarize(e));
  return{width:${width},expanded:trigger.getAttribute('aria-expanded'),popup:popup&&summarize(popup),popupText:popup?.innerText,ancestors,popupAncestors,bodyScroll:{x:scrollX,y:scrollY,w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight}};
})()`);
const typing={price:await type('#price','21.5'),stock:await type('#stock','8'),name:await type('#translations_0_name','Popup test'),description:await type('#translations_0_description','Visible popup test'),slug:await type('#translations_0_slug','popup-test')};
console.log(JSON.stringify({inspect,typing},null,2));
socket.close();
