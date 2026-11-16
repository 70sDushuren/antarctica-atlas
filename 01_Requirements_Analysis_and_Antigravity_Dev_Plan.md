# Antarctica Atlas（南极洲全息气象、地质与人文数字地图集）— 项目需求分析与 Google Antigravity 开发计划书（V1.1 修订定稿版）
# Project Requirements Analysis & Google Antigravity Development Plan (v1.1 Confirmed Baseline)

> **文档状态与修订说明 (Document Status & Revision Summary)**：
> 本规划书已根据确认意见完成 **V1.1 定稿修订**，作为在本地工作区 `/Users/shawnhuang/Documents/GeminiProjects/MyWebsites/antarctica-atlas` 启动 [Google Antigravity](https://antigravity.google/) 智能协同开发的唯一基准规范（Single Source of Truth，当前不含业务代码）：
> 1. **架构定型**：锁定 **【方案 A：Next.js 15 轻量级全栈边缘缓存架构】**（零数据库运维成本，本地秒级预览，支持一键部署至 Vercel / Cloudflare / Firebase App Hosting）。
> 2. **空间画布定型**：锁定 **【3D 交互式南极数字地球 ⇄ 2D 原生 `EPSG:3031` 极球面立体投影科学全图】双模无缝切换形态**。
> 3. **默认考察航线**：内置并将 **“乌斯怀亚（Ushuaia）→ 德雷克海峡（Drake Passage）→ 南设得兰群岛 → 南极半岛 → 威德尔海（Weddell Sea，含保莱特岛 / 坚忍号海域）”** 设为首屏默认置顶航线走廊。
> 4. **品牌与六语国际化（6-Locale `i18n`）**：正式定名 **`Antarctica Atlas`**，全面支持 **英文（`en`）、简体中文（`zh-CN`）、繁体中文（`zh-TW`）、繁体粤语（`yue-Hant`）、葡萄牙语（`pt`）、西班牙语（`es`）** 六种语言版本无缝切换。

---

## 1. 项目愿景、行业痛点与多元受众需求分析 (Project Vision, Pain Points & User Personas)

### 1.1 背景与现有信息孤岛痛点 (Context & Ecosystem Fragmentation)

南极洲（Antarctica）占地球陆地总面积约 9.2%，冰盖平均厚度逾 2,160 米（最厚处逾 4,700 米），储存了全球约 70% 的淡水资源，既是全球气候系统的核心冷源与古气候档案库，也是人类极地科学考察、地质构造演化研究与现代探险航行的终极疆域。然而，当前互联网上面向公众与专业爱好者的南极信息门户普遍存在四大结构性割裂：

1. **地图投影失真与极区交互缺失 (Projection Distortion at High Latitudes)**：绝大多数通用气象与地图网站默认采用 Web 墨卡托投影（`EPSG:3857`），在南纬 60° 以南产生剧烈面积拉伸，并在南纬 85.05° 至南极点（90°S）之间出现几何奇点截断，无法完整呈现横贯南极山脉（Transantarctic Mountains）、罗斯冰架（Ross Ice Shelf）与威德尔海（Weddell Sea）的真实空间拓扑关系；兼具三维球体全局视角与原生 [EPSG:3031 南极极球面立体投影](https://spatialreference.org/ref/epsg/3031/) 科学精度的双模 Web 应用极为稀缺。
2. **实时气象海冰与静态地质构造割裂 (Decoupled Meteorology & Subglacial Geology)**：通用天气平台缺乏极地特有的下降风（Katabatic Wind）阵风预警、风寒体感温度（Wind Chill）、极昼/极夜太阳高度角及德雷克海峡（Drake Passage）涌浪与海冰密集度耦合展示；而顶级科学数据集——如英国南极调查局发布的 [Bedmap3 冰下基岩地形与冰厚数据集](https://www.bas.ac.uk/project/bedmap3/)、新西兰地质与核科学研究所主导的 [SCAR GeoMAP 南极全境地质图库](https://www.gns.cri.nz/data-and-resources/geomap-geological-mapping-of-antarctica/)——主要面向桌面 GIS 软件（如 [Quantarctica v4](https://www.pgc.umn.edu/news/quantarctica-version-4-released/)），缺少浏览器端即开即用的交互式冰盖剥离与地质剖面透视体验。
3. **地理科考站点与人类探险历史叙事断层 (Disconnected Geography & Human Heritage)**：南极洲现存 70 余座常年/夏季科考站（源自 [COMNAP 南极设施名录](https://www.comnap.aq/antarctic-facilities-information)）及 90 余处受国际条约保护的 [南极历史遗迹与纪念物（HSMs）](https://ukaht.org/latest-news/historic-sites-and-monuments-in-antarctica/)（如沙克尔顿“坚忍号”沉船遗址 HSM-93、斯科特与阿蒙森探险小屋、保莱特岛石屋 HSM-41、中国长城站一号栋 HSM-86），在现有平台上往往仅以静态文字百科形式存在，未能与所在地实时风雪实况、登陆地形及历史探险航迹实现时空同屏联动。
4. **跨语种极地门户体验缺失 (Multilingual & Gateway Language Gap)**：南极科考与探险高度国际化——阿根廷乌斯怀亚/布宜诺斯艾利斯与智利蓬塔阿雷纳斯等核心门户港以西班牙语（`es`）为主，巴西费拉斯司令站及葡语区科研旅游群体使用葡萄牙语（`pt`），而大中华区及海外华人读者涵盖简体中文（`zh-CN`）、书面繁体中文（`zh-TW`）与地道繁体粤语（`yue-Hant`）习惯。现有极地科学网站几乎仅提供单一英文界面，缺乏兼顾专业地学/气象术语准确性与本土化母语表达的多语言知识体系。

### 1.2 核心目标用户画像与场景诉求 (Target User Personas & Core Use Cases)

| 目标用户群体 (Persona) | 覆盖主要语言受众 | 核心使用场景 (Primary Use Cases) | 关键数据与功能诉求 (Key Requirements) |
| :--- | :--- | :--- | :--- |
| **极地探险者与自然摄影师**<br>(Polar Expedition Travelers & Photographers) | `en` / `zh-CN` / `zh-TW` / `yue-Hant` / `es` / `pt` | 从乌斯怀亚或蓬塔阿雷纳斯登船跨越德雷克海峡前往南极半岛及威德尔海，评估航道风浪、登陆点微气候与拍摄光线窗口 | 默认置顶经典半岛—威德尔海航线走廊、德雷克海峡浪高/涌浪周期预报（Drake Lake vs. Drake Shake）、极昼黄金光线计算、[IAATO 访客登陆准则](https://iaato.org/visiting-antarctica/visitor-guidelines-library) 与多语种历史遗址导览 |
| **地球科学、冰川与极地气象爱好者**<br>(Geoscience & Meteorology Enthusiasts) | `en` / `zh-CN` / `zh-TW` / `pt` / `es` | 探究南极冰盖下方山脉/冰下湖分布、冈瓦纳古陆（Gondwana）裂解证据、活火山与海冰季节消长 | 3D/2D 双模视图切换、基于 [Bedmap3](https://data.bas.ac.uk/full-record.php?id=GB/NERC/BAS/PDC/01615) 的“剥冰透视”滑块、任意两点冰面—冰下基岩高程剖面仪、[NSIDC 海冰指数](https://nsidc.org/data/g02135/versions/4) 距平曲线 |
| **STEM 教育者、学生与人文历史读者**<br>(STEM Educators & History Readers) | 全六语受众（尤其强化 `yue-Hant` 生动科普叙事与 `es`/`pt` 南美门户视角） | 学习极地大气环流、《南极条约》治理体系、“英雄时代”（1897–1922）探险史及各国现代科考布局 | 交互式探险时间轴地图回放、[SCAR 综合地名录（CGA）](https://placenames.aq/) 多国地名溯源（含英/西/葡/中历史命名渊源）、70+ 科考站实时气象对比卡片 |

---

## 2. 网站内容规划、双模交互形式与六语本地化规范 (Content, Dual-Mode UX & 6-Locale i18n Specification)

### 2.1 整体产品形态与双模空间画布设计 (Product Form & Confirmed 2D/3D Dual-Mode Canvas)

网站正式定名为 **`Antarctica Atlas`**，定位于 **“空间画布驱动的交互式极地全息数字地图集（Spatial-First Interactive Polar Digital Atlas）”**，采用 **“全屏 2D/3D 双模极地地图主画布 + 悬浮毛玻璃遥测仪表盘（Cryo-Glassmorphism HUD） + 沉浸式滚动历史长卷（Scrollytelling）”** 的现代复合形态：

- **已锁定的 3D/2D 双模无缝切换空间引擎 (Confirmed 3D Globe ⇄ 2D `EPSG:3031` Dual-Mode Switch)**：
  - **模式一：3D 交互式南极数字地球 (3D Polar Globe View)**：基于 [CesiumJS](https://github.com/cesiumgs/cesium) 渲染高精度南半球与南极大陆三维球体，直观呈现南美洲锥体（乌斯怀亚）跨越德雷克海峡连接南极半岛的全球空间关系，叠加实时太阳赤纬晨昏线（动态展现 11–2 月极昼不落日与 5–8 月极夜光照）、三维地形垂直夸张及探险历史三维航迹飞跃动画。
  - **模式二：2D 原生极球面立体投影科学全图 (2D Native `EPSG:3031` Scientific Atlas)**：顶部视角切换器一键平滑过渡至国际南极测绘标准 [EPSG:3031 (WGS 84 / Antarctic Polar Stereographic)](https://spatialreference.org/ref/epsg/3031/) 俯视平面图（基于 [Leaflet + Proj4Leaflet](https://nasa-gibs.github.io/gibs-web-examples/examples/leaflet/antarctic-epsg3031.html)），直连 [NASA GIBS EPSG:3031 极地卫星遥感瓦片服务](https://nasa-gibs.github.io/gibs-api-docs/access-basics/)（MODIS/VIIRS 真彩色海冰与云图）并承载高精度冰下基岩两点剖面测绘，彻底消除极点变形。
  - **跨模式相机状态同步 (Camera State Sync)**：用户在 3D 与 2D 模式间切换时，自动保持当前聚焦的经纬度中心点、缩放层级、已开启的地质/海冰图层及当前激活的科考站/历史遗迹抽屉状态。
- **视觉色彩规范 (Cryo-Telemetry Palette)**：默认采用深邃极夜蓝灰底色（`#07111F`）配合冰川青（`#38BDF8`）、极光翠绿（`#10B981`）、岩浆琥珀橙（`#F59E0B`，用于标示埃里伯斯火山及暴风浪预警）与高对比度雪白排版，同时支持“极昼冰白（Glacial Light）”浅色主题切换。

### 2.2 五大核心业务内容模块详解 (Five Core Functional Modules)

| 模块代号与英文基准名 | 功能定位 | 核心集成内容与交互形式 | 权威数据驱动源 |
| :--- | :--- | :--- | :--- |
| **Module 1**<br>`Live Polar Weather & Sea Ice` | 实时南极气象与航道海冰中心 | 1. **全洲科考站与关键地标实时看板**：覆盖南极点、麦克默多、沃斯托克、长城站、中山站、秦岭站、费拉斯司令站（巴西）、希望湾（阿根廷）、弗雷站（智利）、罗瑟拉站等 35+ 核心节点的实时气温、体感风寒（Wind Chill）、10m 阵风（识别下降风爆发）、气压、降雪量与未来 7–16 天逐时预报曲线；<br>2. **德雷克海峡与南大洋航行海况仪 (`Drake Shake Index`)**：实时展示乌斯怀亚至南极半岛走廊的有效波高（Significant Wave Height）、涌浪周期、海表温度（SST），按浪高自动划分为 *Drake Lake*（`< 3m` 平稳）至 *Severe Drake Shake*（`>= 6m` 狂浪）五级航行提示；<br>3. **南极海冰范围动态监测**：展示当前环南极海冰面积及与 1981–2010 气候中位数的距平对比曲线。 | [Open-Meteo Weather API](https://open-meteo.com/en/docs) ([ECMWF IFS 9km](https://open-meteo.com/en/docs/ecmwf-api))、[Open-Meteo Marine API](https://open-meteo.com/en/docs/marine-weather-api)、[UW-Madison AMRDC 自动气象站网](https://amrdc.ssec.wisc.edu/real-time-data/surface/aws-weather-maps-and-plots)、[NSIDC Sea Ice Index v4](https://nsidc.org/data/g02135/versions/4)、[OSI SAF Sea-Ice Index](https://osi-saf.eumetsat.int/sea-ice-index) |
| **Module 2**<br>`Subglacial Geology & Cryosphere` | 冰下基岩地质与冰盖剖面透视 | 1. **“剥去冰盖”交互滑块 (`Ice-Peel Opacity & Threshold Slider`)**：支持动态剥离 2,000–4,700 米厚冰盖，直观露出冰下甘布尔泽夫山脉（Gamburtsev Mountains）、本特利冰下海沟（Bentley Subglacial Trench，深达 -2,555m）及沃斯托克湖（Lake Vostok）等冰下水系；<br>2. **交互式冰盖—基岩横截面测绘仪 (`Interactive Cross-Section Profiler`)**：用户在地图任意拉出一条测线，底部即时绘制“冰面海拔 vs. 冰层厚度 vs. 基岩高程（区分海平面以下海洋性冰盖基底）”双层剖面图；<br>3. **基岩露头岩性、古大陆演化与极地火山专题**：高亮无冰基岩露头岩性分类（源自 [SCAR GeoMAP](https://scar.org/library-data/maps/geomap-geological-mapping)）、冈瓦纳超大陆裂解化石点（舌羊齿植物与极地恐龙化石点）以及埃里伯斯火山（Mount Erebus）、欺骗岛（Deception Island 破火山口）火山构造带。 | [BAS Bedmap3 数据集](https://data.bas.ac.uk/full-record.php?id=GB/NERC/BAS/PDC/01615)、[SCAR GeoMAP (GNS Science)](https://www.gns.cri.nz/data-and-resources/geomap-geological-mapping-of-antarctica/)、[PGC REMA 高程模型](https://www.pgc.umn.edu/data/rema/) ([OpenTopography 32m](https://portal.opentopography.org/rema?opentopoID=OTSDEM.082023.3031.3)) |
| **Module 3**<br>`Geography, Regions & Stations` | 南极地理分区与全球科考站矩阵 | 1. **三大自然地理宏观解构**：对比东南极冰盖（古老克拉通地盾、高寒极干）、西南极冰盖（海洋性冰盖、思韦茨冰川不稳定区）与南极半岛（安第斯山脉南延褶皱带、海洋性微气候）；专题呈现麦克默多干谷、罗斯冰架、菲尔希纳-龙尼冰架与威德尔海冰间湖；<br>2. **全球南极科考站数字名录 (`COMNAP Station Explorer`)**：按所属国家、运行季节（常年越冬 Permanent vs. 夏季科考 Seasonal）、海拔、最大容纳人数过滤检索 70+ 座科考站，点击任一站点即弹出“地理档案 + 建筑历史 + 实时天气实况”三合一详情卡；<br>3. **多语种地名溯源检索**：基于 [SCAR 综合地名录（CGA）](https://placenames.aq/) 精选地标库，同步呈现同一地理实体在英语、西班牙语（智利/阿根廷命名）、葡萄牙语及中文中的官方译名与发现渊源。 | [COMNAP 南极设施数据集](https://www.comnap.aq/antarctic-facilities-information) ([GitHub 归档](https://github.com/PolarGeospatialCenter/comnap-antarctic-facilities))、[SCAR ADD 南极数字数据库](https://www.bas.ac.uk/project/add/)、[SCAR CGA 地名服务](https://placenames.aq/information/data-services) |
| **Module 4**<br>`Exploration History & Heritage` | 南极人文探险史与文化遗产长卷 | 1. **四幕式时空叙事长卷 (`Chronicle Scrollytelling`)**：随页面滚动驱动地图镜头自动飞跃关键历史坐标：<br>  • *第一幕：未知南方大陆与早期航海发现（1773–1895）*（库克船长跨越极圈、1820 年早期目击大陆、南设得兰早期航海遗址）；<br>  • *第二幕：南极探险“英雄时代”（1897–1922）*（1911–1912 阿蒙森 vs. 斯科特南极点竞速双轨路线对比；1914–1916 沙克尔顿“坚忍号”威德尔海浮冰受困漂流、象岛求生与南乔治亚岛救援航迹；1901–1903 诺登舍尔德探险队与保莱特岛石屋越冬奇迹）；<br>  • *第三幕：国际地球物理年与《南极条约》和平共治（1957–1991）*（1957–1958 IGY 科学合作、1959 年《南极条约》、1991 年《马德里议定书》环境保护机制）；<br>  • *第四幕：深冰芯古气候解码与现代生态守护（1992–至今）*（百万年冰芯钻探、2022 年“坚忍号”3,008 米深海发现并列为 HSM-93、极地可持续旅游治理）；<br>2. **受保护历史遗迹（HSM）地图导览**：精选展示《南极条约》认证的标志性历史纪念物与探险木屋建筑档案。 | [ATCM 南极历史遗迹与纪念物官方名录](https://documents.ats.aq/cep/handbook/List%20of%20HSMs%202010_e.pdf)、[45 CFR 670.29 (HSM 1–94 法规名录)](https://www.ecfr.gov/current/title-45/subtitle-B/chapter-VI/part-670/subpart-F/section-670.29)、[英国南极遗产信托 UKAHT](https://ukaht.org/latest-news/historic-sites-and-monuments-in-antarctica/)、[IAATO 访客准则库](https://iaato.org/visiting-antarctica/visitor-guidelines-library) |
| **Module 5**<br>`Expedition Corridor Briefing` | 极地考察航线走廊多维简报器（已锁定默认走廊） | **首屏默认置顶走廊（Corridor #1 Default）**：**`乌斯怀亚 (Ushuaia) → 德雷克海峡 (Drake Passage) → 南设得兰群岛 (South Shetland Is.) → 南极半岛西岸 (Antarctic Peninsula) → 威德尔海 (Weddell Sea: 保莱特岛 HSM-41 / 坚忍号海域 HSM-93)`**；<br>同时提供下拉切换另外两条经典走廊：*Corridor #2 罗斯海与英雄时代探险木屋航线*、*Corridor #3 蓬塔阿雷纳斯 → 联合冰川 → 地理南极点内陆航线*。一键聚合沿线分段未来 7 天风浪/气温窗口、极昼日照时长、沿途典型地质露头/火山（如欺骗岛、布朗断崖）与历史登陆点背景简报。 | 跨模块实时聚合（Module 1–4 联动计算） |

### 2.3 六语国际化架构与专业术语本地化规范 (Six-Locale `i18n` Architecture & Terminology Standard)

为满足全球极地研究者、南美门户港旅客及大中华区多元语言读者的无障碍访问需求，全站基于 [Next.js App Router 国际化路由](https://nextjs.org/docs/app/guides/internationalization) 与 [next-intl](https://next-intl.dev/docs/getting-started/app-router)（[GitHub](https://github.com/amannn/next-intl)）构建 **六语言完整本地化体系**，并在遥测仪表盘中采用 **“本地化主文案 + 国际通用科学缩写徽标（如 `SST` / `HSM` / `EPSG:3031`）双轨呈现”** 设计：

| 语言代码 (BCP 47 Locale) | 语言切换器显示名 | 网站本地化副标题规划 | 语言风格、专业术语与工程实现核心规范 |
| :--- | :--- | :--- | :--- |
| **`en`** (默认基准) | `English` | *Holistic Weather, Subglacial Geology & Heritage Digital Atlas* | 采用 SCAR / WMO / BAS 国际标准科学英语；在非英语模式下，关键遥测缩写（如 `Wind Chill`、`Katabatic`、`HSM`）保留辅助对照以确保工程严谨性。 |
| **`zh-CN`** | `简体中文` | 南极洲全息气象、冰下地质与人文历史数字地图集 | 采用中国极地研究中心与国家标准地名译法（如“下降风”、“威德尔海”、“冰架”、“接地线”、“欺骗岛”、“长城站 / 中山站 / 秦岭站”）。 |
| **`zh-TW`** | `繁體中文` | 南極洲全息氣象、冰下地質與人文歷史數位地圖集 | 采用标准现代书面语繁体中文（非口语粤文），遵循港台地学与海洋学规范译名（如「數位地圖集」、「下降風」、「冰棚／冰架」、「歷史遺蹟與紀念物」）。 |
| **`yue-Hant`** | `繁體粵語` | 南極洲實時天氣、冰下地質同人文歷史數碼地圖集 | **严禁简单套用繁中书面语字表替换**，采用地道、自然、雅俗共赏的现代粤语书面表达（粵文）撰写导览解说、状态提示与交互按钮（例如：「實時風浪」、「體感凍度」、「揭開冰蓋睇基岩」、「呢條航線未來七日天氣」、「嗰陣時沙克爾頓架堅忍號喺威德爾海俾浮冰困住」），专有科学名词与地名保持标准繁体汉字以确保学术准确性。 |
| **`pt`** | `Português` | *Atlas Digital de Meteorologia, Geologia Subglacial e História da Antártida* | 面向葡语区用户及巴西极地科考受众，采用地道葡萄牙语地学与航海术语（如 *Vento Catabático*、*Passagem de Drake*、*Mar de Weddell*、*Espessura do Manto de Gelo*，重点完善乔治王岛巴西 *Estação Antártica Comandante Ferraz* 等站点档案）。 |
| **`es`** | `Español` | *Atlas Digital de Meteorología, Geología Subglacial e Historia de la Antártida* | 面向乌斯怀亚（阿根廷）与蓬塔阿雷纳斯（智利）两大南极出发门户及西语世界，原生支持西语极地航海术语（*Pasaje de Drake*、*Viento Catabático*、*Barrera de Hielo*）以及 [SCAR CGA](https://placenames.aq/) 收录的西语历史地名（如 *Isla Decepción*、*Bahía Esperanza*、*Base Marambio*）。 |

**多语言交互与工程细节保障**：
1. **无感热切换与状态保持 (Stateful Locale Switching)**：顶部导航栏右侧常驻紧凑型六语言下拉选择器（带当前语言简码徽章 `EN` / `简` / `繁` / `粵` / `PT` / `ES`）。切换语言时通过 `next-intl` 路由无缝切换 URL 前缀（如 `/yue-Hant`、`/es`），**不重置** 当前 3D/2D 地图视角、已选航线走廊或打开的地质剖面面板。
2. **数值、单位与日期本地化 (Intl Formatting & Unit Toggle)**：依托 `Intl.NumberFormat` 与 `Intl.DateTimeFormat` 自动适配西语/葡语的小数点逗号习惯（如 `-24,5 °C` vs `-24.5 °C`）与本地日期格式；同时独立提供公制/航海制切换（温度 `°C / °F`，风速 `kt 节 / km/h / m/s`，波高 `m / ft`）。
3. **防溢出弹性排版 (Multilingual Layout Resilience)**：针对西班牙语（`es`）与葡萄牙语（`pt`）词汇平均长度比英语和中文长 25%–35% 的特征，所有悬浮毛玻璃卡片均采用弹性网格（`min-w-0`、自适应折行与响应式字号），严禁固定死窄像素宽度导致西/葡语按钮截断。

---

## 3. 多源权威数据资源整合清单与更新机制 (Data Integration Catalog & Ingestion Strategy)

为确保在已确认的 **方案 A（轻量级全栈边缘架构）** 下做到 **“零虚构数据、高科学可信度、首屏毫秒级加载、免 API 密钥泄漏风险”**，数据流采取 **“实时气象海况走 Next.js 服务端边缘缓存代理 + 地质地理人文走构建期预烘焙高压缩静态切片”** 的动静分离设计：

| 数据维度 | 数据源名称与官方链接 | 获取方式与数据格式 | 空间/时间分辨率 | 授权协议与限流约束 | 网站集成与缓存策略 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **实时天气预报** | [Open-Meteo Weather Forecast API](https://open-meteo.com/en/docs) & [ECMWF API](https://open-meteo.com/en/docs/ecmwf-api) | REST JSON（无需 API Key，支持单请求批量传入多组经纬度） | 9 km – 11 km 网格；逐小时 / 未来 7–16 天 | CC BY 4.0（非商业免费，禁止前端高频滥用轮询） | Next.js `/api/weather` 路由合并 35+ 关键站点与航道节点单次批量拉取，配置 30 分钟边缘缓存（`s-maxage=1800, stale-while-revalidate=3600`） |
| **海洋波浪与海温** | [Open-Meteo Marine Weather API](https://open-meteo.com/en/docs/marine-weather-api) | REST JSON（有效波高、波向、涌浪周期、海表温度 SST） | ~8 km 网格；逐小时 / 未来 7 天 | CC BY 4.0（非商业免费） | Next.js `/api/marine` 聚合德雷克海峡（56°S–62°S）、南设得兰、威德尔海及罗斯海采样点，每小时缓存更新 |
| **南极实测气象基准** | [UW-Madison AMRDC (南极气象研究与数据中心)](https://amrdc.ssec.wisc.edu/) & [AWS 实况图](https://amrdc.ssec.wisc.edu/real-time-data/surface/aws-weather-maps-and-plots) | 公开自动气象站（AWS）元数据与历史气候极值基准 | 站点级长期观测（1980–至今） | 学术与公共科普开放引用（署名 AMRDC / USAP） | 集成典型 AWS 站点空间分布与实测气候极值（如沃斯托克 `-89.2°C`、迪蒙迪维尔下降风极值）供实时温差参照 |
| **海冰范围与极地云图** | [NASA GIBS EPSG:3031 WMTS](https://nasa-gibs.github.io/gibs-api-docs/access-basics/) + [NSIDC Sea Ice Index v4](https://nsidc.org/data/g02135/versions/4) + [EUMETSAT OSI SAF](https://osi-saf.eumetsat.int/sea-ice-index) | OGC WMTS 极地瓦片 + 每日/每月海冰面积时序 JSON | 卫星影像 250m–1km；海冰指数 25km 每日更新 | NASA / NOAA 公共领域开放数据 | 2D `EPSG:3031` 地图直连 GIBS 极地瓦片；`/api/sea-ice` 按 6 小时缓存同步最新海冰面积与历史中位数对比序列 |
| **冰厚与冰下基岩地形** | [BAS Bedmap3 (英国南极调查局)](https://data.bas.ac.uk/full-record.php?id=GB/NERC/BAS/PDC/01615) + [PGC REMA 32m](https://portal.opentopography.org/rema?opentopoID=OTSDEM.082023.3031.3) | 原始栅格经离线脚本采样为轻量化二进制高程矩阵 + 渲染图层 | 覆盖南纬 60° 以南冰表高程、冰厚与冰下基岩高程 | CC BY 4.0（署名 British Antarctic Survey / PGC） | 构建阶段用 Python 生成紧凑型 `Float32`/`Int16` 双层高程网格（`< 2 MB`），在浏览器内存实现 `< 50ms` 任意测线实时剖面插值 |
| **基岩露头与构造地质** | [SCAR GeoMAP (GNS Science)](https://www.gns.cri.nz/data-and-resources/geomap-geological-mapping-of-antarctica/) ([SCAR 门户](https://scar.org/library-data/maps/geomap-geological-mapping)) | 离线简化裁剪为 GeoJSON / PMTiles 矢量瓦片 | 全洲重点露头岩性、主断层带、火山与化石点 | CC BY 4.0（署名 Cox et al. / SCAR GeoMAP） | 静态托管于 `public/geo-data/`，按需流式渲染并配齐六语岩性与地质时期词条翻译 |
| **基础海岸线与冰架边界** | [SCAR Antarctic Digital Database (ADD)](https://www.bas.ac.uk/project/add/) & [Quantarctica v4](https://data.npolar.no/dataset/8516e961-81db-4120-af13-b8a2ffe174c9) | TopoJSON（精确区分接地线 Grounding Line、浮动冰架与裸岩海岸） | 南纬 60° 以南无缝标准极地拓扑 | CC BY 4.0（SCAR / BAS / 挪威极地研究所 NPI） | 高压缩 TopoJSON 作为 2D `EPSG:3031` 与 3D 球体的高精度矢量地理边界层 |
| **科考站、地名与历史遗迹** | [COMNAP 设施库](https://www.comnap.aq/antarctic-facilities-information)、[SCAR CGA 地名库](https://placenames.aq/)、[ATCM HSM 历史遗迹名录](https://www.ecfr.gov/current/title-45/subtitle-B/chapter-VI/part-670/subpart-F/section-670.29) | 结构化多语言 TypeScript / JSON 知识图谱 | 70+ 科考站、精选多国地标与重点 HSM 历史纪念物 | 公共科研与教育用途合规引用 | 编译为带六语字段（`en`/`zh-CN`/`zh-TW`/`yue-Hant`/`pt`/`es`）与官方溯源链接的静态数据模块，零延迟检索 |

---

## 4. 已锁定的技术架构栈规范 (Confirmed Technical Architecture — Option A Baseline)

基于已确认的 **方案 A（Next.js 轻量级全栈边缘缓存架构）** 与 **2D/3D 双模切换** 决策，系统技术栈正式锁定如下：

| 架构分层 | 锁定技术选型 | 核心工程职责 |
| :--- | :--- | :--- |
| **全栈框架与路由** | **Next.js 15 (App Router) + React 19 + TypeScript 5** | 承载 `[locale]` 六语动态路由、Server Components 首屏极速注水，以及 `/api/weather`、`/api/marine`、`/api/sea-ice` 边缘缓存聚合代理（内置离线降级快照防断网）。 |
| **国际化引擎 (`i18n`)** | **[next-intl](https://next-intl.dev/docs/getting-started/app-router)** (`en`, `zh-CN`, `zh-TW`, `yue-Hant`, `pt`, `es`) | 提供编译期类型安全的多语言键值校验、ICU 复数/插值语法、本地化数值/时间格式化及保持地图状态的无刷路由切换。 |
| **3D 数字地球引擎** | **[CesiumJS](https://github.com/cesiumgs/cesium)**（或轻量化 Globe WebGL 渲染层按需异步懒加载） | 负责 3D 模式下南半球与南极大陆球体渲染、极昼/极夜太阳光照实时计算、乌斯怀亚—南极半岛—威德尔海三维航迹与历史探险路线飞跃展示。 |
| **2D 极地科学地图引擎** | **[Leaflet](https://nasa-gibs.github.io/gibs-web-examples/examples/leaflet/antarctic-epsg3031.html) + `Proj4js` / `Proj4Leaflet`**（原生 `EPSG:3031`） | 负责 2D 科学俯视图，无缝加载 [NASA GIBS EPSG:3031](https://www.earthdata.nasa.gov/engage/open-data-services-software/earthdata-developer-portal/gibs-api) 极地遥感瓦片、冰盖剥离栅格叠加层、SCAR ADD 冰架边界与两点拉线地质剖面测绘交互。 |
| **科学数据可视化与样式** | **Tailwind CSS v4 + Lucide Icons + Apache ECharts** | 构建 Cryo-Glassmorphism 悬浮遥测卡片、7 天风寒/阵风双轴预报图、德雷克海峡波浪玫瑰/仪表盘、海冰距平历史折线及 Bedmap3 冰面—基岩双层面积剖面图。 |
| **离线数据构建工具链** | **Python 3.12 (`pyproj`, `numpy`, `shapely`) / Node 构建脚本** | 仅在构建准备阶段执行一次，生成高压缩极地 TopoJSON、Bedmap3 采样高程二进制网格与六语校验报告，运行时无需 Python 后端常驻，实现 **$0/月** 托管成本。 |

> *演进预留说明*：接口与数据访问层采用清晰的 Repository 抽象封装，未来 V2.0 若需扩展 Google Cloud BigQuery 多年气象归档或 Vertex AI Gemini 六语极地智能问答助手，可直接平滑挂载而无需重构前端地图与多语言组件。

---

## 5. 基于 Google Antigravity 的开发计划书 (Google Antigravity Development Plan)

### 5.1 锁定工程目录拓扑 (Confirmed Project Directory Topology)

后续在 `/Users/shawnhuang/Documents/GeminiProjects/MyWebsites/antarctica-atlas` 启动 [Google Antigravity](https://antigravity.google/) 开发时，严格按以下解耦目录结构组织代码与多语言资产，便于多智能体并行开发与 [Artifacts 可视化核验](https://antigravity.google/docs/artifacts/)：

```text
antarctica-atlas/
├── 01_Requirements_Analysis_and_Antigravity_Dev_Plan.md  # 本修订定稿版需求与开发计划书（v1.1）
├── .agent/
│   ├── rules/
│   │   ├── architecture-and-ui.md         # 方案 A 无服务器约束、2D/3D 双模切换规范、Cryo-Glass 响应式排版红线
│   │   ├── six-locale-i18n-standard.md    # en/zh-CN/zh-TW/yue-Hant/pt/es 六语完整性与地道粤文（非机翻字表转换）强制准则
│   │   └── data-attribution-safety.md     # SCAR/BAS/NSIDC/AMRDC/Open-Meteo 权威署名与服务端批量缓存反封禁守则
│   └── skills/
│       ├── polar-projection-epsg3031/     # SKILL.md：EPSG:3031 坐标转换、±180° 罗斯海防撕裂、2D/3D 视角同步与剖面插值校验
│       ├── polar-weather-aggregator/      # SKILL.md：Open-Meteo 多站点单次批量拉取、极寒风寒公式与德雷克海峡五级浪高判定
│       └── multilingual-polar-qa/         # SKILL.md：六语 JSON 键对齐静态检查脚本与长文本（西/葡语）UI 防溢出巡检规范
├── scripts/
│   ├── data-pipeline/                     # Python/Node 离线地理与高程网格预处理脚本（Bedmap3、SCAR ADD、COMNAP、HSM）
│   └── validate-i18n.mjs                  # 构建期自动校验 6 个语言包 Key 100% 对齐与非空检查脚本
├── messages/                              # next-intl 六语 UI 界面词典（100% 键值严格对称）
│   ├── en.json                            # 英语（基准词典）
│   ├── zh-CN.json                         # 简体中文
│   ├── zh-TW.json                         # 繁体中文（标准书面语）
│   ├── yue-Hant.json                      # 繁体粤语（地道粤语书面表达）
│   ├── pt.json                            # 葡萄牙语
│   └── es.json                            # 西班牙语
├── public/
│   └── geo-data/                          # 预烘焙高压缩极地数据包（海岸线/冰架 TopoJSON、露头地质、Bedmap3 双层高程矩阵）
└── src/
    ├── i18n/                              # next-intl 路由配置（locales 列表、默认 locale、request 解析与导航封装）
    ├── app/
    │   ├── [locale]/                      # 六语页面主入口、SEO hreflang 元数据与全局布局
    │   └── api/                           # `/api/weather`、`/api/marine`、`/api/sea-ice` 服务端批量聚合缓存路由
    ├── components/
    │   ├── atlas-canvas/                  # 3D Cesium Globe ⇄ 2D EPSG:3031 双模切换容器、冰盖剥离滑块、GIBS 遥感图层控制
    │   ├── layout-hud/                    # 顶部导航栏、六语切换器（EN/简/繁/粵/PT/ES）、公制/航海制单位切换器
    │   ├── weather-hud/                   # 科考站实时气象遥测面板、德雷克海峡海况仪、海冰距平卡片与 7 天预报曲线
    │   ├── geology-lab/                   # Bedmap3 冰面—冰厚—基岩交互式横截面测绘仪、露头岩性与极地火山详情卡
    │   ├── heritage-chronicle/            # 四幕式探险历史滚动长卷、阿蒙森/斯科特/沙克尔顿航迹回放器、HSM 遗迹导览
    │   └── expedition-briefing/           # 默认置顶“乌斯怀亚—德雷克—南极半岛—威德尔海”航线走廊多维简报器
    ├── data/                              # 六语结构化领域知识库（科考站、HSM 遗迹、四幕探险史事件、预设考察走廊坐标）
    └── lib/                               # 极昼/极夜太阳高度角计算、EPSG:3031 坐标变换、风寒指数算法与类型定义
```

### 5.2 专属 Antigravity Agent Skills 与工程护栏 (Custom Agent Skills & Quality Guardrails)

遵循 [Google Antigravity Agent Skills 规范](https://antigravity.google/docs/skills/) 与 [CLI / IDE 最佳实践](https://antigravity.google/docs/cli/best-practices/)，在启动编码阶段率先植入三项领域专属工程守则：

1. **`polar-projection-epsg3031`（2D/3D 双模极地几何与防撕裂技能）**：
   - 2D 科学模式强制采用 `EPSG:3031`（中央经线 `0°`，标准纬线 `-71°`），3D 球体模式采用动态懒加载以避免阻塞首屏，且切换 `2D ⇄ 3D` 时必须同步中心经纬度与选中实体；
   - 针对跨越 `±180°` 国际日期变更线（穿过罗斯海与阿蒙森/斯科特南极点路线区域）的航迹与冰架多边形，强制执行球面大圆插值或 `EPSG:3031` 平面笛卡尔坐标绘制，严禁出现横贯屏幕的几何撕裂线。
2. **`polar-weather-aggregator`（极地气象科学计算与批量边缘缓存技能）**：
   - 严禁客户端浏览器直接循环请求第三方 API；统一由服务端 `/api/weather` 与 `/api/marine` 合并坐标单次批量请求 [Open-Meteo](https://open-meteo.com/en/docs)，设置 30 分钟缓存及本地备用基准快照，确保离线或断网环境下界面依然完整可用；
   - 内置标准极寒风寒温度（Wind Chill）与德雷克海峡五级波高风险算法，同步支持 `°C/°F` 与 `kt/km/h/m/s` 实时换算。
3. **`multilingual-polar-qa`（六语术语保真、地道粤文与 UI 防溢出验收技能）**：
   - **编译期键值硬校验**：通过 `scripts/validate-i18n.mjs` 强制检查 `en`、`zh-CN`、`zh-TW`、`yue-Hant`、`pt`、`es` 六份语言包及领域知识库条目的键值 100% 完整对齐，缺失任一语种即阻断构建；
   - **粤文与繁中严格区分**：明确审查 `yue-Hant` 文案必须使用地道粤语词汇与句式（如 `係`、`喺`、`嘅`、`睇`、`而家`、`唔同`），同时保持科学术语严谨，杜绝把 `zh-TW` 原样复制充当 `yue-Hant`；
   - **六语实机视觉巡检**：利用 [Antigravity Artifacts 浏览器录制与截图能力](https://antigravity.google/docs/artifacts/)，依次访问 `/en`、`/zh-CN`、`/zh-TW`、`/yue-Hant`、`/pt`、`/es` 六个路由检验长词条（尤其西语与葡语）无折行错位、无乱码及 `hreflang` 标签正确生成。

### 5.3 四阶段里程碑实施路线图 (Four-Phase Execution Roadmap in Antigravity)

| 阶段里程碑 | 阶段名称与核心交付目标 | Antigravity 智能体关键执行动作 | 里程碑验收标准 (Acceptance Criteria) |
| :--- | :--- | :--- | :--- |
| **Phase 0**<br>(脚手架、i18n 与数据底座) | **工程初始化、六语路由框架与极地地理数据预烘焙**<br>(Scaffold, 6-Locale `next-intl` & Geo-Data Prep) | 1. 写入 `.agent/rules` 与 `.agent/skills`；<br>2. 初始化 Next.js 15 + TypeScript + Tailwind v4 + `next-intl` 六语路由骨架；<br>3. 生成南极海岸线/冰架 TopoJSON、[COMNAP](https://www.comnap.aq/antarctic-facilities-information) 科考站库、[HSM](https://www.ecfr.gov/current/title-45/subtitle-B/chapter-VI/part-670/subpart-F/section-670.29) 历史遗迹库、预设考察航线坐标及 [Bedmap3](https://www.bas.ac.uk/project/bedmap3/) 双层高程采样网格。 | `npm run validate:i18n` 与 `npm run build` 零错误通过；静态地理数据包 `< 5 MB`；六语路由切换顺畅。 |
| **Phase 1**<br>(双模地图与实时气象) | **2D/3D 双模极地画布与实时气象/海冰遥测中心**<br>(Dual-Mode Polar Canvas & Live Weather/Marine HUD) | 1. 实现 **3D 数字地球 ⇄ 2D `EPSG:3031` 极地全图** 双模无缝切换器，接入 [NASA GIBS](https://nasa-gibs.github.io/gibs-api-docs/access-basics/) 卫星影像与实时极昼/极夜光照层；<br>2. 开发 `/api/weather`、`/api/marine`、`/api/sea-ice` 批量缓存接口；<br>3. 完成 35+ 站点实时天气抽屉、**德雷克海峡波浪海况仪**与 [NSIDC](https://nsidc.org/data/g02135/versions/4) 海冰距平趋势图。 | 2D 与 3D 模式切换平滑且保持视角同步；站点 7 天预报与德雷克海峡波高实时渲染；罗斯海 `±180°` 无图形撕裂。 |
| **Phase 2**<br>(冰下地质与地理深度) | **Bedmap3 冰盖剥离透视与横截面地质实验室**<br>(Subglacial Bedrock Explorer & Cross-Section Lab) | 1. 实现 **“剥冰透视滑块（Ice-Peel Slider）”**，动态切换冰面高程、冰厚分布与冰下基岩起伏；<br>2. 开发交互式两点拉线 **冰面—冰厚—基岩双层剖面测绘仪**（Apache ECharts）；<br>3. 接入 [SCAR GeoMAP](https://www.gns.cri.nz/data-and-resources/geomap-geological-mapping-of-antarctica/) 重点露头岩性、冈瓦纳化石点、极地活火山及六语 [SCAR CGA](https://placenames.aq/) 地名检索。 | 任意绘制横跨南极剖面线 `< 100ms` 生成平滑双层高程曲线；干谷、冰下湖、火山及科考站详情卡在六语下完整呈现。 |
| **Phase 3**<br>(历史长卷、默认走廊与六语验收) | **英雄时代长卷、默认半岛—威德尔海航线简报与全站 QA**<br>(Heritage Scrollytelling, Default Corridor Briefing & 6-Locale QA) | 1. 构建四幕式南极探险历史滚动长卷，实现阿蒙森/斯科特南极点竞速与沙克尔顿“坚忍号”威德尔海漂流救援航迹动态回放；<br>2. 上线默认置顶 **“乌斯怀亚—德雷克海峡—南极半岛—威德尔海”航线综合简报器**（含另外两条可选走廊）；<br>3. 执行六语全量文案校对与 Antigravity 内置浏览器桌面/移动端实机验收。 | 默认航线简报一键联动输出沿途分段天气+风浪+地质+HSM 遗迹卡片；`en`/`zh-CN`/`zh-TW`/`yue-Hant`/`pt`/`es` 六语切换零缺失、零溢出。 |

---

## 6. 已锁定架构决策总表与启动就绪状态 (Confirmed Decisions Summary — Ready for Development)

| 决策编号 | 决策维度 | 已确认定稿方案 | 状态 |
| :--- | :--- | :--- | :--- |
| **#1** | **后端与部署形态** | **方案 A：Next.js 15 轻量级全栈边缘缓存架构**（服务端批量缓存代理 + 预烘焙静态极地数据包，零数据库运维成本） | **已确认锁定** |
| **#2** | **空间主画布形态** | **3D 交互式南极数字地球 ⇄ 2D 原生 `EPSG:3031` 极地投影科学平面图 双模无缝切换形态**（支持跨模式视角状态同步） | **已确认锁定** |
| **#3** | **默认考察航线走廊** | 默认首屏置顶 **“乌斯怀亚 → 德雷克海峡 → 南设得兰群岛 → 南极半岛 → 威德尔海（含保莱特岛 / 坚忍号海域）”**，并附罗斯海与南极点内陆两条切换走廊 | **已确认锁定** |
| **#4** | **品牌命名** | **`Antarctica Atlas`**（配各语种本地化副标题） | **已确认锁定** |
| **#5** | **多语言国际化支持** | **六语完整支持**：英文（`en`）、简体中文（`zh-CN`）、繁体中文（`zh-TW`）、繁体粤语（`yue-Hant`，地道粤文表达）、葡萄牙语（`pt`）、西班牙语（`es`） | **已新增锁定** |

---

## 7. 权威数据源与技术参考索引 (Verified References & Official Portals)

1. **实时气象与海洋预报服务**：[Open-Meteo Weather Forecast API Docs](https://open-meteo.com/en/docs)、[Open-Meteo ECMWF IFS 9km API](https://open-meteo.com/en/docs/ecmwf-api)、[Open-Meteo Marine Weather API](https://open-meteo.com/en/docs/marine-weather-api)、[Open-Meteo Historical Weather API](https://open-meteo.com/en/docs/historical-weather-api)。
2. **南极实测气象与海冰遥感**：[Antarctic Meteorological Research and Data Center (AMRDC, UW-Madison)](https://amrdc.ssec.wisc.edu/)、[AMRDC Real-Time AWS Weather Maps](https://amrdc.ssec.wisc.edu/real-time-data/surface/aws-weather-maps-and-plots)、[NSIDC Sea Ice Index Version 4](https://nsidc.org/data/g02135/versions/4)、[NSIDC Charctic Interactive Sea Ice Graph](https://nsidc.org/sea-ice-today/sea-ice-tools/charctic-interactive-sea-ice-graph)、[EUMETSAT OSI SAF Sea-Ice Index](https://osi-saf.eumetsat.int/sea-ice-index)、[NASA Earthdata GIBS API](https://www.earthdata.nasa.gov/engage/open-data-services-software/earthdata-developer-portal/gibs-api)（[EPSG:3031 Access Basics](https://nasa-gibs.github.io/gibs-api-docs/access-basics/)）。
3. **冰下基岩地形、高程与南极地质**：[British Antarctic Survey (BAS) Bedmap3 Project](https://www.bas.ac.uk/project/bedmap3/)（[BAS Data Catalogue Record](https://data.bas.ac.uk/full-record.php?id=GB/NERC/BAS/PDC/01615)）、[GNS Science GeoMAP — Geological Mapping of Antarctica](https://www.gns.cri.nz/data-and-resources/geomap-geological-mapping-of-antarctica/)（[SCAR GeoMAP Portal](https://scar.org/library-data/maps/geomap-geological-mapping)）、[Polar Geospatial Center REMA](https://www.pgc.umn.edu/data/rema/)（[OpenTopography REMA 32m](https://portal.opentopography.org/rema?opentopoID=OTSDEM.082023.3031.3)）。
4. **南极地理底图、科考站与多语地名**：[SCAR Antarctic Digital Database (ADD)](https://www.bas.ac.uk/project/add/)、[Quantarctica v4 (Norwegian Polar Institute / PGC)](https://www.pgc.umn.edu/news/quantarctica-version-4-released/)（[NPDC Dataset](https://data.npolar.no/dataset/8516e961-81db-4120-af13-b8a2ffe174c9)）、[COMNAP Antarctic Facilities Information](https://www.comnap.aq/antarctic-facilities-information)（[PGC GitHub Archive](https://github.com/PolarGeospatialCenter/comnap-antarctic-facilities)）、[SCAR Composite Gazetteer of Antarctica (CGA)](https://placenames.aq/)（[Data Services](https://placenames.aq/information/data-services)）、[EPSG:3031 WGS 84 / Antarctic Polar Stereographic](https://spatialreference.org/ref/epsg/3031/)。
5. **人文探险遗产与访客生态规范**：[ATCM List of Historic Sites and Monuments (HSMs)](https://documents.ats.aq/cep/handbook/List%20of%20HSMs%202010_e.pdf)、[45 CFR 670.29 Antarctic Historic Sites & Monuments (HSM 1–94)](https://www.ecfr.gov/current/title-45/subtitle-B/chapter-VI/part-670/subpart-F/section-670.29)、[UK Antarctic Heritage Trust — Historic Sites Overview](https://ukaht.org/latest-news/historic-sites-and-monuments-in-antarctica/)、[IAATO Visitor Guidelines Library](https://iaato.org/visiting-antarctica/visitor-guidelines-library)。
6. **多语言架构、可视化引擎与 Google Antigravity 工程体系**：[Next.js App Router Internationalization Guide](https://nextjs.org/docs/app/guides/internationalization)、[next-intl Official Documentation](https://next-intl.dev/docs/getting-started/app-router)（[GitHub](https://github.com/amannn/next-intl)）、[CesiumJS GitHub](https://github.com/cesiumgs/cesium)、[MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js)、[NASA GIBS Leaflet EPSG:3031 Example](https://nasa-gibs.github.io/gibs-web-examples/examples/leaflet/antarctic-epsg3031.html)、[Google Antigravity Official Portal](https://antigravity.google/)、[Antigravity Artifacts Documentation](https://antigravity.google/docs/artifacts/)、[Antigravity Agent Skills](https://antigravity.google/docs/skills/)、[Antigravity Agent Capabilities](https://antigravity.google/docs/agent/)、[Antigravity CLI Best Practices](https://antigravity.google/docs/cli/best-practices/)。
