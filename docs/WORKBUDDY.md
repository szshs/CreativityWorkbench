# WorkBuddy 接入说明

WorkBuddy 通过两项 Skills 与 MCP 访问本机工作台，和网页共享项目、任务及媒体。接入包不包含完整工作台应用，需要先在本机安装项目和依赖。

## 生成接入包

在项目根目录使用 Node.js 22.13 或更新兼容版本：

```sh
npm ci
npm run workbench:setup
```

`work/workbuddy-core/` 中生成以下本机文件：

- `creativity-project.zip`：项目、文字与文化资料操作。
- `creativity-media.zip`：图片、视频、网站与三维交接。
- `mcp.json`：当前机器的连接配置，不包含 API 密钥。
- `SETUP.md`、`USAGE.md`、`TESTING.md`：接入、使用与验收说明。

导入并启用两个 Skills ZIP，再把 mcp.json 中的 creativity-workbench 项合并到现有 MCP 配置，保留其他服务器。配置含本机绝对路径；移动仓库或换机器后重新生成。脚本不会自动安装 Skills 或改动 WorkBuddy 配置。

## 启动与更新

MCP 的 `--ensure-runtime` 会检查并按需启动本机 Runtime，默认地址为 `http://127.0.0.1:8791`，数据目录为项目下的 `work/data`。

如果已运行 `npm run dev`，MCP 可以复用其 Runtime。若 Runtime 已由 MCP 启动，使用 `npm run dev:web` 打开网页，避免重复启动。同一项目的 MCP 与网页需使用同一个数据目录；版本或目录不匹配时应停止并修正配置。

更新后重启旧 Runtime，并在 WorkBuddy 中重新连接 MCP、导入新版 Skills。版本以 MCP 握手和能力清单为准；能读取配置不等于真实生成已通过。

## 使用方式

可以要求 WorkBuddy：先检查工作台连接并列出项目，继续指定项目，沿用已保存文化资料，完成本次作品并交付真实文件。

网页已经创建任务时，优先复制网页的完整交接请求。WorkBuddy 必须接续原项目、原任务和要求的输出，不新建不关联的任务。

| 任务 | 原任务接收的结果 |
| --- | --- |
| 网站连续制作 | 实际源码 ZIP，由 website_complete 或原结果路径交回 |
| 概念图及图片返工 | PNG，由 task_complete_handoff 或原结果路径交回 |
| 视频 | 指定路径的真实 MP4 |
| 普通三维建模 | craft_complete_plan 提交受限方案，本机继续建模 |
| 器皿文化图案 | 原任务 PNG，本机继续贴图；不调用 craft_complete_plan |

网站初稿自动展示，由用户确认使用。图片最终选用使用 image_select 或页面操作；task_adopt 对图片只放入候选。三维结果成功后自动显示和保存，无需额外采用。

WorkBuddy 当前对话创作文字或整理三维方案不要求额外文字密钥。图片、视频取决于宿主实际可用的能力。手动交接无需网页自动发送授权；外部 API 配置在工作台本机设置中保存，不能写入 Skills 或公开连接文件。

## 故障处理

使用 workbench_status 和 project_get 检查连接及项目。任务不确定时先核对原 ID，不自动换 ID 重试。数组序列化失败可使用 workbench_call_json，保持原参数、版本与幂等请求标识。

网页仍等待但文件已生成时，核对文件是否真正完成原任务交接；媒体库中存在文件不能替代原结果。真实加载验收需在 WorkBuddy 中完成工具发现、调用、回传、网页展示和下载，不以本机单元测试代替。
