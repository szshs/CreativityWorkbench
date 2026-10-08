# 粤象·岭南文化创意工作台

以岭南文化知识和原创视觉素材为依据，制作短篇、概念图、视频镜头、静态网站及受控三维资产。网页与 WorkBuddy 共用本机项目，支持查看结果、修改、保存版本和下载文件。

## 功能

| 作品 | 输出与边界 |
| --- | --- |
| 小说 | 短篇正文、TXT 与 Markdown；不含长篇自动编排 |
| 图片 | 概念图及基于原图的修改；比较后选用 |
| 视频 | 2–10 秒单镜头 MP4；实际画幅和时长需核对 |
| 网站 | WorkBuddy 实现静态网站，回传源码 ZIP 后预览与修改；发布另行处理 |
| 3D 文创 | 本机 Blender 制作受控器皿或建筑构件，导出 Blender 与 GLB；不提供直接三维编辑 |
| 器皿图案 | 现有图片服务生成平面图案，本机贴合外壁并保留原模型 |

内置知识保留出处和地域边界，区分文化事实与原创表达。主题插画由源码脚本生成，不是实景、文物或传统工艺复原。不同作品类型可显式沿用正文和已采用媒体。

## 安装与启动

需要 Node.js 22.13 或更新的兼容版本。三维功能另需本机 Blender。

```sh
npm ci
npm run dev
```

打开 <http://localhost:3001>。共享 Runtime 默认监听 `127.0.0.1:8791`。如果 Runtime 已由 MCP 启动，只运行 `npm run dev:web`。

内置主题素材在安装、启动、构建或测试时自动生成到 `public/theme-assets/`，不随 Git 发布成品文件。使用 `npm ci --ignore-scripts` 安装后，可运行 `npm run assets:ensure` 补齐素材；需要完整重建时使用 `npm run assets:theme`。

## 配置生成服务

在网页“设置 → API 配置”填写本次需要的服务，或参考 [.env.example](.env.example) 创建本机 `.env.local`。文字服务的 API 地址、模型 ID 和密钥必须属于匹配的平台；文字配置不会自动接入该平台的图片或视频能力。

- WorkBuddy 对话可直接完成文字创作和三维方案交接。
- 图片和视频依赖实际可用的 WorkBuddy 工具或已配置的外部服务。
- “生成文化图案”复用图片服务，无需额外配置混元 3D 或 COS。
- 网页没有自动发送授权时，复制原任务的完整交接请求到 WorkBuddy 即可继续。

## WorkBuddy 接入

```sh
npm run workbench:setup
```

生成的两项 Skills ZIP、连接配置和使用说明保存在本机 `work/workbuddy-core/`。导入 Skills，并把 `mcp.json` 中的服务项合并到 WorkBuddy 配置。移动仓库或换机器后重新生成连接配置。

使用方法见 [WorkBuddy 接入说明](docs/WORKBUDDY.md)、[使用说明](docs/USAGE.md) 和 [功能验收清单](docs/ACCEPTANCE.md)。

## 项目保存

默认数据目录为 `work/data/`，网页设置保存在 `work/service-settings.json`。正式作品、任务、交接文件、导出结果和个人配置只保存在本机；备份与迁移方法见使用说明。生成成功、文件入库和最终选用是不同步骤，以对应作品页面的提示为准。

## 源码与检查

仓库保留应用源码、依赖锁文件、测试、用户说明、主题知识和用户可安装的 WorkBuddy Skills。开发工作记录、Agent 规则、个人演示作品、生成媒体和本机配置不属于公开源码。

```sh
npm run check:public
npm test
npm run lint
npm run typecheck
npm run build
```

`check:public` 检查 Git 跟踪列表，阻止被忽略的内部资料或生成文件重新进入提交，并核对公开文档的本地链接。检查不会删除本机文件。

## 许可

项目许可见 [LICENSE](LICENSE)，第三方说明见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。外部生成服务的权限、计费和输出限制由对应服务决定。
