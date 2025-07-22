// 配置与常量定义
const openButton = hexo.config.content_blocks.open_button;
let types = hexo.config.content_blocks.types; // 使用let因后续会重新赋值
const nameHeader = "hcb";
const defaultType = "note";
const nh = nameHeader; // 缩写别名，保持简洁


// 处理types：为所有key添加nameHeader前缀
const newTypes = Object.fromEntries(
  Object.entries(types).map(([key, value]) => [`${nameHeader}${key}`, value])
);
types = newTypes;


// 解析types结构：拆分、trim并确保颜色值以#开头
for (const key in types) {
  const [color, icon] = types[key].split('||').map(part => part.trim());
  // 确保颜色值以#开头
  types[key] = [color.startsWith('#') ? color : `#${color}`, icon];
}


// 提取类型条目，用于生成CSS选择器
const allTypes = Object.entries(types);


// 生成CSS样式字符串（提取重复逻辑为函数，减少冗余）
const generateCss = (template) => allTypes.map(([typeKey, [color]]) => template(typeKey, color)).join('\n');

const css = `
/* 基础容器样式 */
${generateCss((typeKey) => `div.${nh}-content.${nh}-block.${typeKey}, details.${nh}-content.box.${typeKey}`).replace(/\n/g, ', ')} {
  border: .05rem solid #448aff;
  border-radius: .2rem;
  font-size: 0.96rem;
  margin: 1.5625em 0;
  padding: 0 1.2rem;
  transition: box-shadow 250ms;
}

/* 类型专属边框色 */
${generateCss((typeKey, color) => `div.${nh}-content.${nh}-block.${typeKey}, details.${nh}-content.box.${typeKey} {
  border-color: ${color};
}`)}

/* 聚焦状态阴影 */
${generateCss((typeKey, color) => `div.${nh}-content.${nh}-block.${typeKey}:focus-within, details.${nh}-content.box.${typeKey}:focus-within {
  box-shadow: 0 0 0 .2rem ${color}1a;
}`)}

/* 内部元素盒模型 */
${generateCss((typeKey) => `div.${nh}-content.${nh}-block.${typeKey} *, details.${nh}-content.box.${typeKey} *`).replace(/\n/g, ', ')} {
  box-sizing: border-box;
}

/* 标题/摘要样式 */
${generateCss((typeKey) => `div.${nh}-content.${nh}-block.${typeKey} p.${nh}-content.${nh}-block-title, details.${nh}-content.box.${typeKey} summary`).replace(/\n/g, ', ')} {
  border-top-right-radius: 0.1rem;
  border-top-left-radius: 0.1rem;
  border-left-width: 0.2rem;
  display: block;
  min-height: 1rem;
  border: none;
  font-weight: 700;
  margin: 0 -1.2rem 0rem;
  padding: 0.4rem 0.6rem;
  position: relative;
  outline: none;
}

/* 摘要鼠标交互 */
${generateCss((typeKey) => `details.${nh}-content.box.${typeKey} summary`).replace(/\n/g, ', ')} {
  cursor: pointer;
}

/* 标题/摘要背景色 */
${generateCss((typeKey, color) => `div.${nh}-content.${nh}-block.${typeKey} p.${nh}-content.${nh}-block-title, details.${nh}-content.box.${typeKey} summary {
  background-color: ${color}1a;
}`)}

/* 标题/摘要图标样式 */
${generateCss((typeKey, color) => `div.${nh}-content.${nh}-block.${typeKey} p.${nh}-content.${nh}-block-title i, details.${nh}-content.box.${typeKey} summary i {
  margin: 0 0.6rem;
  color: ${color};
}`)}

/* 展开按钮容器 */
${generateCss((typeKey) => `details.${nh}-content.box.${typeKey} summary div.${nh}-box-open-button`).replace(/\n/g, ', ')} {
  float: right;
}

/* 展开按钮图标基础样式 */
${generateCss((typeKey) => `details.${nh}-content.box.${typeKey} summary div.${nh}-box-open-button i`).replace(/\n/g, ', ')} {
  margin: 0 0.6rem;
  font-size: 0.7rem;
  transition: transform 250ms;
}

/* 展开/折叠状态图标旋转 */
${generateCss((typeKey) => `details.${nh}-content.box.${typeKey}:not([open]) summary div.${nh}-box-open-button i`).replace(/\n/g, ', ')} {
  transform: rotate(270deg);
}
${generateCss((typeKey) => `details.${nh}-content.box.${typeKey}[open] summary div.${nh}-box-open-button i`).replace(/\n/g, ', ')} {
  transform: rotate(180deg);
}

/* 展开按钮图标颜色 */
${generateCss((typeKey, color) => `details.${nh}-content.box.${typeKey} summary div.${nh}-box-open-button i {
  color: ${color};
}`)}

/* 卡片容器基础样式 */
div.${nh}-content.${nh}-cards * {
  box-sizing: border-box;
}

/* 卡片切换radio（隐藏） */
input.${nh}-content.${nh}-cards-input {
  display: none;
}

/* 卡片标签容器 */
div.${nh}-content.${nh}-cards-labels {
  position: relative;
  box-shadow: 0 -0.05rem #00000012 inset;
  display: flex;
  margin-bottom: 1.25rem;
}

/* 卡片激活指示器 */
div.${nh}-content.${nh}-cards-labels:before {
  background: var(--cards-color);
  bottom: 0;
  content: "";
  display: block;
  height: 2px;
  left: 0;
  position: absolute;
  transform: translateX(var(--md-indicator-x));
  transition: width 225ms, transform 250ms;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
  width: var(--md-indicator-width);
}

/* 卡片标签样式 */
label.${nh}-content.${nh}-cards-label {
  border-bottom: 0.1rem solid #0000;
  border-radius: 0.1rem 0.1rem 0 0;
  cursor: pointer;
  color: #0000008a;
  font-size: 0.92em;
  font-weight: 700;
  padding: 0 1.25rem 0.625rem;
  transition: color 250ms;
}

/* 卡片标签激活/hover状态 */
label.${nh}-content.${nh}-cards-label.active, label.${nh}-content.${nh}-cards-label:hover {
  color: var(--cards-color);
}

/* 卡片内容容器 */
div.${nh}-content.${nh}-cards-content {
  display: none;
}
div.${nh}-content.${nh}-cards-content.active {
  display: block;
}
`;


// 注册CSS辅助函数
hexo.extend.helper.register('content_blocks_css', function() {
  return css;
});


// 注册contentblock标签（内容块）
hexo.extend.tag.register('contentblock', (args, content) => {
  let type = defaultType;
  let title = 'default_not_set';

  // 解析参数（type和title）
  for (const arg of args) {
    if (arg.startsWith('type:')) {
      type = arg.replace(/^type:/, '');
    } else {
      title = arg.replace(/^title:/, '');
    }
  }

  // 标题默认值：首字母大写的type
  if (title === 'default_not_set') {
    title = type.charAt(0).toUpperCase() + type.slice(1);
  }

  const fullType = `${nameHeader}${type}`;
  return `
<div class="${nh}-content ${nh}-block ${fullType}">
  <p class="${nh}-content ${nh}-block-title"><i class="${types[fullType][1]} fa-fw"></i>${title}</p>
  ${hexo.render.renderSync({ text: content, engine: 'markdown' }).trim().replace(/\n/g, '\n  ')}
</div>
  `.trim();
}, { ends: true });


// 注册contentbox标签（可折叠内容盒）
hexo.extend.tag.register('contentbox', (args, content) => {
  let type = defaultType;
  let title = 'default_not_set';
  let open = false;

  // 解析参数（type、title、open状态）
  for (const arg of args) {
    if (arg.startsWith('type:')) {
      type = arg.replace(/^type:/, '');
    } else if (arg === 'open') {
      open = true;
    } else {
      title = arg.replace(/^title:/, '');
    }
  }

  // 标题默认值：首字母大写的type
  if (title === 'default_not_set') {
    title = type.charAt(0).toUpperCase() + type.slice(1);
  }

  const fullType = `${nameHeader}${type}`;
  return `
<details class="${nh}-content box ${fullType}"${open ? ' open' : ''}>
  <summary>
    <i class="${types[fullType][1]} fa-fw"></i>${title}
    <div class="${nh}-box-open-button"><i class="${openButton} fa-fw"></i></div>
  </summary>
  ${hexo.render.renderSync({ text: content, engine: 'markdown' }).trim().replace(/\n/g, '\n  ')}
</details>
  `.trim();
}, { ends: true });


// 注册contentcards标签（卡片切换）
let cardsTot = 0; // 卡片计数器（全局唯一）
hexo.extend.tag.register('contentcards', (args, content) => {
  cardsTot++;
  let type = defaultType;
  const titles = [];
  let color = undefined;

  // 解析参数（type、color、titles）
  for (const arg of args) {
    if (arg.startsWith('type:')) {
      type = arg.replace(/^type:/, '');
    } else if (arg.startsWith('color:')) {
      color = arg.replace(/^color:/, '');
    } else {
      titles.push(arg.replace(/^title:/, ''));
    }
  }

  const fullType = `${nameHeader}${type}`;
  const contents = content.split(/<!-{2,}card-break-{2,}>/); // 分割卡片内容
  color = color || types[fullType][0]; // 颜色默认值：类型对应的颜色

  return `
<div class="${nh}-content ${nh}-cards" id="${nh}-content_cards_${cardsTot}" style="--cards-color: ${color}">
  ${titles.map((_, i) => `
    <input ${!i ? 'checked="checked"' : ''} 
           class="${nh}-content ${nh}-cards-input" 
           id="${nh}-content_cards_${cardsTot}_input_${i}" 
           name="${nh}-content_cards_${cardsTot}_inputs" 
           type="radio">
  `).join('\n')}

  <div class="${nh}-content ${nh}-cards-labels" 
       id="${nh}-content_cards_${cardsTot}_labels" 
       style="--md-indicator-x: 0px; --md-indicator-width: 0px;">
    ${titles.map((title, i) => `
      <label class="${nh}-content ${nh}-cards-label" 
             id="${nh}-content_cards_${cardsTot}_label_${i}" 
             for="${nh}-content_cards_${cardsTot}_input_${i}">
        ${title}
      </label>
    `).join('\n')}
  </div>

  <div class="${nh}-content ${nh}-cards-contents" id="${nh}-content_cards_${cardsTot}_contents">
    ${titles.map((_, i) => `
      <div class="${nh}-content ${nh}-cards-content" id="${nh}-content_cards_${cardsTot}_content_${i}">
        ${hexo.render.renderSync({ text: contents[i], engine: 'markdown' }).trim().replace(/\n/g, '\n  ')}
      </div>
    `).join('\n')}
  </div>

  <script>
    // 卡片切换逻辑
    function select_${cardsTot}(id) {
      let x = 0;
      for (let i = 0; i < ${titles.length}; i++) {
        const label = document.getElementById("${nh}-content_cards_${cardsTot}_label_" + i);
        const content = document.getElementById("${nh}-content_cards_${cardsTot}_content_" + i);

        if (i === id) {
          label.classList.add('active');
          content.classList.add('active');
          // 更新指示器位置和宽度
          document.getElementById("${nh}-content_cards_${cardsTot}_labels").style.setProperty("--md-indicator-x", x + "px");
          document.getElementById("${nh}-content_cards_${cardsTot}_labels").style.setProperty("--md-indicator-width", window.getComputedStyle(label).width);
        } else {
          label.classList.remove('active');
          content.classList.remove('active');
        }
        x += parseFloat(window.getComputedStyle(label).width);
      }
    }

    // 初始化与绑定事件
    select_${cardsTot}(0);
    ${titles.map((_, i) => `
      document.getElementById("${nh}-content_cards_${cardsTot}_input_${i}")
        .addEventListener("change", () => select_${cardsTot}(${i}));
    `).join('\n')}
  </script>
</div>
  `.trim();
}, { ends: true });