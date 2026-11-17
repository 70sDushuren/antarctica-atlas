import type { PolarLandingHotspot } from '@/lib/types';

export const POLAR_LANDING_HOTSPOTS: PolarLandingHotspot[] = [
  {
    id: 'neko-harbour',
    region: 'antarctic-peninsula',
    lat: -64.8439,
    lon: -62.5319,
    typicalElevationGainM: 135,
    typicalMaxSlopeDeg: 14,
    terrainType: 'snow-ridge-hike',
    aliases: [
      'neko harbour',
      'neko harbor',
      'puerto neko',
      'porto neko',
      '尼科港',
      '妮可港'
    ],
    name: {
      en: 'Neko Harbour (Andvord Bay Continental Landing)',
      'zh-CN': '尼科港（安德沃德湾南极大陆登陆点）',
      'zh-TW': '尼科港（安德沃德灣南極大陸登陸點）',
      'yue-Hant': '尼科港（安德沃德灣南極大陸登陸點）',
      pt: 'Porto Neko (Desembarque Continental na Baía Andvord)',
      es: 'Puerto Neko (Desembarco Continental en Bahía Andvord)'
    },
    summary: {
      en: 'Iconic continental Antarctica landing in Andvord Bay featuring a gentoo penguin rookery on a gravel beach and a snow-ridge hike above an active calving glacier.',
      'zh-CN': '位于安德沃德湾的经典南极大陆本土登陆点，岸边砾石滩栖息着巴布亚企鹅群，后方雪坡可徒步登高俯瞰活跃崩解的冰川前缘。',
      'zh-TW': '位於安德沃德灣的經典南極大陸本土登陸點，岸邊礫石灘棲息著巴布亞企鵝群，後方雪坡可徒步登高俯瞰活躍崩解的冰川前緣。',
      'yue-Hant': '呢度係安德沃德灣好出名嘅南極大陸本土登陸點，沙石灘上面有成群巴布亞企鵝，後面條雪坡仲可以行山上去望晒成幅冰川崩落海嘅壯觀畫面。',
      pt: 'Desembarque continental clássico na Baía Andvord com colônia de pinguins-gentoo e caminhada em crista de neve sobre geleira ativa.',
      es: 'Desembarco continental clásico en Bahía Andvord con colonia de pingüinos papúa y caminata por cresta nevada frente a un glaciar activo.'
    },
    highlight: {
      en: 'Keep clear of the lower beach surge zone — glacier calving waves can sweep 5–10 m ashore within 60 seconds.',
      'zh-CN': '务必远离低处水线碎浪区——对面冰川崩解激起的涌浪可在 60 秒内冲刷岸滩 5–10 米。',
      'zh-TW': '務必遠離低處水線碎浪區——對面冰川崩解激起的湧浪可在 60 秒內沖刷岸灘 5–10 公尺。',
      'yue-Hant': '千祈唔好企喺太近水邊嘅低位——對面冰川一冧冰就會捲起大湧浪，一分鐘內可以沖上岸五至十米咁遠。',
      pt: 'Mantenha distância da linha d’água baixa — ondas geradas por desprendimento de gelo varrem a praia rapidamente.',
      es: 'Manténgase alejado de la orilla baja: las olas por desprendimiento glaciar pueden barrer la playa en menos de un minuto.'
    },
    sourceUrl: 'https://iaato.org/visiting-antarctica/visitor-guidelines-library/'
  },
  {
    id: 'cuverville-island',
    region: 'antarctic-peninsula',
    lat: -64.6833,
    lon: -62.6333,
    typicalElevationGainM: 45,
    typicalMaxSlopeDeg: 8,
    terrainType: 'pebble-ash-beach',
    aliases: [
      'cuverville',
      'cuverville island',
      'isla cuverville',
      'ilha cuverville',
      '库佛维尔岛',
      '庫佛維爾島',
      'errera channel'
    ],
    name: {
      en: 'Cuverville Island (Errera Channel)',
      'zh-CN': '库佛维尔岛（埃雷拉水道）',
      'zh-TW': '庫佛維爾島（埃雷拉水道）',
      'yue-Hant': '庫佛維爾島（埃雷拉水道）',
      pt: 'Ilha Cuverville (Canal Errera)',
      es: 'Isla Cuverville (Canal Errera)'
    },
    summary: {
      en: 'Steep dome-shaped island at the northern entrance of Errera Channel hosting one of the Antarctic Peninsula’s largest gentoo penguin colonies.',
      'zh-CN': '扼守埃雷拉水道北口的陡峭穹顶状岛屿，拥有南极半岛规模最大的巴布亚企鹅繁殖种群之一。',
      'zh-TW': '扼守埃雷拉水道北口的陡峭穹頂狀島嶼，擁有南極半島規模最大的巴布亞企鵝繁殖種群之一。',
      'yue-Hant': '呢座圓頂形小島守住埃雷拉水道北面入口，住咗成個南極半島最大規模之一嘅巴布亞企鵝群落，仲成日有巨型浮冰擱淺喺淺灣度。',
      pt: 'Ilha rochosa na entrada norte do Canal Errera que abriga uma das maiores colônias de pinguins-gentoo da Península Antártica.',
      es: 'Isla escarpada en la entrada norte del Canal Errera que alberga una de las mayores colonias de pingüinos papúa de la península.'
    },
    highlight: {
      en: 'Deep spring snowpack in November requires snowshoes; yield strictly to penguin highways crossing the cobble spit.',
      'zh-CN': '11 月春季积雪深厚需穿踏雪板；穿越卵石滩时必须礼让“企鹅高速公路”。',
      'zh-TW': '11 月春季積雪深厚需穿踏雪板；穿越卵石灘時必須禮讓「企鵝高速公路」。',
      'yue-Hant': '十一月開季嗰陣積雪好深要著雪鞋行，行過石春灘嗰陣記得企定讓路畀行緊「企鵝高速公路」嘅企鵝先。',
      pt: 'Neve profunda em novembro exige raquetes de neve; dê sempre preferência às trilhas dos pinguins.',
      es: 'La nieve profunda de noviembre requiere raquetas; ceda siempre el paso en los senderos de pingüinos.'
    },
    sourceUrl: 'https://iaato.org/visiting-antarctica/visitor-guidelines-library/'
  },
  {
    id: 'port-lockroy',
    region: 'antarctic-peninsula',
    lat: -64.8253,
    lon: -63.4944,
    typicalElevationGainM: 20,
    typicalMaxSlopeDeg: 6,
    terrainType: 'sheltered-cove-zodiac',
    aliases: [
      'port lockroy',
      'goudier island',
      'jougla point',
      'base a',
      'puerto lockroy',
      'porto lockroy',
      '洛克罗伊港',
      '洛克羅伊港',
      '企鹅邮局',
      '企鵝郵局'
    ],
    name: {
      en: 'Port Lockroy & Jougla Point (Goudier Island HSM-61)',
      'zh-CN': '洛克罗伊港与朱格拉角（古迪尔岛 HSM-61 极地邮局）',
      'zh-TW': '洛克羅伊港與朱格拉角（古迪爾島 HSM-61 極地郵局）',
      'yue-Hant': '洛克羅伊港同朱格拉角（古迪爾島 HSM-61 企鵝郵局）',
      pt: 'Porto Lockroy e Ponta Jougla (Ilha Goudier HSM-61)',
      es: 'Puerto Lockroy y Punta Jougla (Isla Goudier HSM-61)'
    },
    summary: {
      en: 'Natural sheltered harbour on Wiencke Island housing historic British Base A (HSM-61), the southernmost public post office, and whale-bone heritage at Jougla Point.',
      'zh-CN': '温克岛旁的天然避风良港，坐落着英国历史基地 A（HSM-61）与世界最南端公共邮局，对岸朱格拉角散落早期捕鲸时代鲸骨遗存。',
      'zh-TW': '溫克島旁的天然避風良港，坐落著英國歷史基地 A（HSM-61）與世界最南端公共郵局，對岸朱格拉角散落早期捕鯨時代鯨骨遺存。',
      'yue-Hant': '溫克島隔離嘅天然避風港，嗰度有英國以前留低嘅 A 基地（HSM-61）同埋全世界最南邊嘅企鵝郵局，對面朱格拉角仲睇到舊時留低嘅鯨魚骨。',
      pt: 'Porto natural abrigado com a histórica Base A britânica (HSM-61), a agência postal mais austral do mundo e ossadas de baleia em Jougla Point.',
      es: 'Puerto natural protegido con la histórica Base A británica (HSM-61), la oficina postal más austral del mundo y restos balleneros en Punta Jougla.'
    },
    highlight: {
      en: 'Slippery guano-coated granite rocks require rubber boots with deep lugs and thorough boot scrubbing afterward.',
      'zh-CN': '花岗岩礁石覆有湿滑企鹅粪泥，需穿深齿防水高筒靴并在返船时彻底刷洗消杀。',
      'zh-TW': '花崗岩礁石覆有濕滑企鵝糞泥，需穿深齒防水高筒靴並在返船時徹底刷洗消殺。',
      'yue-Hant': '花崗岩石面鋪滿企鵝糞好鬼跣腳，一定要著深坑防滑長靴，返上船嗰陣仲要徹底洗乾淨對靴消毒。',
      pt: 'Rochas graníticas escorregadias exigem botas impermeáveis aderentes e higienização rigorosa ao retornar ao navio.',
      es: 'Las rocas graníticas resbaladizas exigen botas de goma con buen agarre y desinfección completa al regresar al barco.'
    },
    sourceUrl: 'https://www.ukaht.org/visit/port-lockroy/'
  },
  {
    id: 'paradise-bay',
    region: 'antarctic-peninsula',
    lat: -64.85,
    lon: -62.8667,
    typicalElevationGainM: 85,
    typicalMaxSlopeDeg: 16,
    terrainType: 'snow-ridge-hike',
    aliases: [
      'paradise bay',
      'paradise harbour',
      'paradise harbor',
      'almirante brown',
      'waterboat point',
      'bahia paraiso',
      'baia paraiso',
      '天堂湾',
      '天堂灣',
      '布朗站'
    ],
    name: {
      en: 'Paradise Bay & Brown Station Ridge',
      'zh-CN': '天堂湾与阿尔米兰特·布朗站雪脊观景台',
      'zh-TW': '天堂灣與阿爾米蘭特·布朗站雪脊觀景台',
      'yue-Hant': '天堂灣同布朗站雪脊觀景台',
      pt: 'Baía Paraíso e Mirante da Estação Brown',
      es: 'Bahía Paraíso y Mirador de Base Almirante Brown'
    },
    summary: {
      en: 'Mirror-calm glacial embayment ringed by 1,500 m ice-clad peaks; includes a steep snow climb behind Argentine Brown Station to a panoramic viewpoint.',
      'zh-CN': '被海拔 1,500 米冰峰环抱的镜面冰川海湾，可自阿根廷布朗站后方陡峭雪坡攀登至全景制高点俯瞰浮冰群。',
      'zh-TW': '被海拔 1,500 公尺冰峰環抱的鏡面冰川海灣，可自阿根廷布朗站後方陡峭雪坡攀登至全景制高點俯瞰浮冰群。',
      'yue-Hant': '四周圍俾千五米高雪山包住、水面平靜到好似塊鏡咁嘅冰川海灣，可以由阿根廷布朗站後面條斜雪坡行上去山頂望晒成個海灣嘅浮冰。',
      pt: 'Enseada glacial espelhada cercada por picos de 1.500 m, com subida íngreme na neve atrás da Estação Argentina Brown.',
      es: 'Bahía glaciar espejada rodeada de cumbres de 1.500 m, con ascenso empinado en nieve detrás de la Base Almirante Brown.'
    },
    highlight: {
      en: 'Afternoon thaw softens the 16° snow chute — bring trekking poles or microspikes for controlled descent.',
      'zh-CN': '午后日照会使 16° 雪坡表层变软湿滑，下山建议使用登山杖或冰爪防滑链保持重心。',
      'zh-TW': '午後日照會使 16° 雪坡表層變軟濕滑，下山建議使用登山杖或冰爪防滑鏈保持重心。',
      'yue-Hant': '晏晝太陽曬完之後條十六度斜雪坡會變軟同埋好跣，落山嗰陣最好用行山杖或者套返防滑冰爪穩陣啲。',
      pt: 'O degelo da tarde amolece a rampa de neve de 16°; use bastões de caminhada na descida.',
      es: 'El deshielo vespertino ablanda la pendiente nevada de 16°; lleve bastones o crampones ligeros para el descenso.'
    },
    sourceUrl: 'https://placenames.aq/'
  },
  {
    id: 'lemaire-channel',
    region: 'antarctic-peninsula',
    lat: -65.0767,
    lon: -63.9536,
    typicalElevationGainM: 0,
    typicalMaxSlopeDeg: 0,
    terrainType: 'sheltered-cove-zodiac',
    aliases: [
      'lemaire channel',
      'kodak gap',
      'canal lemaire',
      'booth island',
      'pleneau',
      '勒梅尔水道',
      '利马水道',
      '萊梅爾水道',
      '利馬水道'
    ],
    name: {
      en: 'Lemaire Channel & Pléneau Iceberg Graveyard',
      'zh-CN': '勒梅尔水道与普莱诺岛“冰山墓园”巡游走廊',
      'zh-TW': '萊梅爾水道與普萊諾島「冰山墓園」巡遊走廊',
      'yue-Hant': '勒梅爾水道同普萊諾島「冰山墓園」航道',
      pt: 'Canal Lemaire e Cemitério de Icebergs de Pléneau',
      es: 'Canal Lemaire y Cementerio de Témpanos de Pléneau'
    },
    summary: {
      en: 'Dramatic 11 km long, 700 m narrow sea passage between Booth Island and Kiev Peninsula, opening south into grounded tabular icebergs off Pléneau Island.',
      'zh-CN': '夹在布斯岛与基辅半岛之间全长 11 公里、最窄处仅 700 米的险峻冰壁峡湾，南口连接普莱诺岛巨型搁浅冰山群。',
      'zh-TW': '夾在布斯島與基輔半島之間全長 11 公里、最窄處僅 700 公尺的險峻冰壁峽灣，南口連接普萊諾島巨型擱淺冰山群。',
      'yue-Hant': '夾喺布斯島同基輔半島中間、長十一公里但最窄得七百米闊嘅懸崖冰峽，出咗南口就係普萊諾島成大片擱淺巨型冰山群。',
      pt: 'Passagem marítima dramática de 11 km de extensão e 700 m de largura entre a Ilha Booth e a Península de Kiev.',
      es: 'Espectacular paso marítimo de 11 km de largo y 700 m de ancho entre la Isla Booth y la Península de Kiev.'
    },
    highlight: {
      en: 'Early-season brash ice and wind-driven floes frequently block transit in November; dress fully windproof on outer bow decks.',
      'zh-CN': '11 月初春碎浮冰常受风向挤压封锁水道；在船首甲板拍摄需做好全套防风防寒与相机电池保温。',
      'zh-TW': '11 月初春碎浮冰常受風向擠壓封鎖水道；在船首甲板拍攝需做好全套防風防寒與相機電池保溫。',
      'yue-Hant': '十一月頭啲浮冰好易俾大風吹埋一嚿塞住條水道；企喺船頭甲板影相吹風好凍，記得著夠防風衫同埋幫相機電池保暖。',
      pt: 'Gelo flutuante frequentemente bloqueia o canal no início do verão; vista camadas corta-vento no convés externo.',
      es: 'El hielo marino suele bloquear el paso a principios de temporada; abríguese contra el viento en cubierta.'
    },
    sourceUrl: 'https://placenames.aq/'
  },
  {
    id: 'whalers-bay-deception',
    region: 'antarctic-peninsula',
    lat: -62.9794,
    lon: -60.5553,
    typicalElevationGainM: 165,
    typicalMaxSlopeDeg: 18,
    terrainType: 'pebble-ash-beach',
    aliases: [
      'whalers bay',
      'deception island',
      'neptunes bellows',
      'neptunes window',
      'isla decepcion',
      'caleta balleneros',
      'ilha decepcao',
      '欺骗岛',
      '欺騙島',
      '捕鲸湾',
      '捕鯨灣'
    ],
    name: {
      en: 'Deception Island — Whalers Bay & Neptune’s Window Hike',
      'zh-CN': '欺骗岛破火山口——捕鲸湾与海神之窗火山脊徒步',
      'zh-TW': '欺騙島破火山口——捕鯨灣與海神之窗火山脊徒步',
      'yue-Hant': '欺騙島火山口——捕鯨灣同海神之窗火山脊行山線',
      pt: 'Ilha Decepção — Baía dos Baleeiros e Janela de Netuno',
      es: 'Isla Decepción — Caleta Balleneros y Ventana de Neptuno'
    },
    summary: {
      en: 'Flooded active volcanic caldera entered via narrow Neptune’s Bellows; features black scoria beaches, steaming geothermal sands, HSM-71 whaling relics, and a ridge hike to Neptune’s Window.',
      'zh-CN': '经狭窄“海神风箱”驶入的海水淹没活火山口，遍布黑色火山渣海滩、地热蒸汽、HSM-71 捕鲸站遗迹及通往“海神之窗”的火山脊徒步线。',
      'zh-TW': '經狹窄「海神風箱」駛入的海水淹沒活火山口，遍布黑色火山渣海灘、地熱蒸汽、HSM-71 捕鯨站遺蹟及通往「海神之窗」的火山脊徒步線。',
      'yue-Hant': '穿過好窄嘅「海神風箱」先入到去嘅海底活火山口，成個黑沙灘都冒緊地熱白煙，仲有 HSM-71 舊捕鯨廠遺跡同埋行上「海神之窗」嘅火山脊山路。',
      pt: 'Caldeira vulcânica ativa inundada pelo mar, com praias de cinza negra geotérmica, ruínas baleeiras HSM-71 e trilha até a Janela de Netuno.',
      es: 'Caldera volcánica activa inundada con playas de ceniza negra geotérmica, ruinas balleneras HSM-71 y sendero a la Ventana de Neptuno.'
    },
    highlight: {
      en: 'Loose volcanic scoria and funneling gusts at Neptune’s Window cliff edge demand ankle-supporting boots and cautious footing.',
      'zh-CN': '松散火山碎屑坡与“海神之窗”崖口狭管阵风强劲，需注意护踝与崖边防风安全距离。',
      'zh-TW': '鬆散火山碎屑坡與「海神之窗」崖口狹管陣風強勁，需注意護踝與崖邊防風安全距離。',
      'yue-Hant': '火山碎石路行落好鬆散，「海神之窗」懸崖口嘅陣風又急又勁，行上去嗰陣記得睇實腳下唔好行得太貼崖邊。',
      pt: 'Escória vulcânica solta e rajadas fortes na borda da Janela de Netuno exigem botas firmes e distância segura do penhasco.',
      es: 'La escoria volcánica suelta y las ráfagas en el borde de la Ventana de Neptuno exigen pisada firme y precaución.'
    },
    sourceUrl: 'https://documents.ats.aq/recatt/att571_e.pdf'
  },
  {
    id: 'half-moon-island',
    region: 'antarctic-peninsula',
    lat: -62.5944,
    lon: -59.9194,
    typicalElevationGainM: 55,
    typicalMaxSlopeDeg: 9,
    terrainType: 'pebble-ash-beach',
    aliases: [
      'half moon island',
      'isla media luna',
      'ilha meia lua',
      'camara base',
      '半月岛',
      '半月島'
    ],
    name: {
      en: 'Half Moon Island (South Shetland Chinstrap Rookery)',
      'zh-CN': '半月岛（南设得兰群岛帽带企鹅栖息地）',
      'zh-TW': '半月島（南設得蘭群島頰帶企鵝棲息地）',
      'yue-Hant': '半月島（南設得蘭群島帽帶企鵝棲息地）',
      pt: 'Ilha Meia Lua (Colônia de Pinguins-de-Barbicha)',
      es: 'Isla Media Luna (Colonia de Pingüinos Barbijo)'
    },
    summary: {
      en: 'Crescent-shaped island in McFarlane Strait offering a 2 km coastal cobble walk alongside chinstrap penguins, Weddell seals, and Livingston Island glacier backdrops.',
      'zh-CN': '麦克法兰海峡中的新月形岛屿，提供约 2 公里的海岸碎石漫步路线，沿途伴随帽带企鹅、威德尔海豹及利文斯顿岛冰川远景。',
      'zh-TW': '麥克法蘭海峽中的新月形島嶼，提供約 2 公里的海岸碎石漫步路線，沿途伴隨頰帶企鵝、威德爾海豹及利文斯頓島冰川遠景。',
      'yue-Hant': '麥克法蘭海峽入面彎彎地好似半個月亮咁嘅小島，有條兩公里長嘅石灘行山徑，沿路睇到帽帶企鵝、威德爾海豹同對面利文斯頓島嘅大冰川。',
      pt: 'Ilha em forma de crescente no Estreito McFarlane com caminhada costeira de 2 km entre pinguins-de-barbicha e focas-de-weddell.',
      es: 'Isla en forma de media luna en el Estrecho McFarlane con caminata costera de 2 km entre pingüinos barbijo y focas de Weddell.'
    },
    highlight: {
      en: 'Ideal introductory polar walk; watch for territorial Antarctic fur seals resting among beach boulders in late summer (Feb–Mar).',
      'zh-CN': '非常适合作为首日适应性徒步；2–3 月晚夏需留意巨石间休息且领地意识较强的南极毛皮海豹。',
      'zh-TW': '非常適合作為首日適應性徒步；2–3 月晚夏需留意巨石間休息且領地意識較強的南極毛皮海豹。',
      'yue-Hant': '呢條線平緩好行，好啱做第一日熱身；不過二至三月尾季要小心大石罅入面休息緊、脾氣比較躁嘅南極毛皮海豹。',
      pt: 'Caminhada introdutória ideal; atenção aos lobos-marinhos-antárticos territoriais entre as rochas em fevereiro e março.',
      es: 'Caminata introductoria ideal; precaución con los lobos finos antárticos territoriales entre las rocas en febrero y marzo.'
    },
    sourceUrl: 'https://iaato.org/visiting-antarctica/visitor-guidelines-library/'
  },
  {
    id: 'snow-hill-emperor',
    region: 'weddell-sea-sector',
    lat: -64.4667,
    lon: -57.2,
    typicalElevationGainM: 35,
    typicalMaxSlopeDeg: 7,
    terrainType: 'inland-blue-ice',
    aliases: [
      'snow hill island',
      'isla cerro nevado',
      'snow hill',
      'nordenskjold hut',
      '雪丘岛',
      '雪丘島',
      '帝企鹅栖息地'
    ],
    name: {
      en: 'Snow Hill Island Fast-Ice Trek (Weddell Sea & HSM-38)',
      'zh-CN': '雪丘岛威德尔海陆缘固定冰徒步（帝企鹅栖息地与 HSM-38）',
      'zh-TW': '雪丘島威德爾海陸緣固定冰徒步（國王/帝企鵝棲息地與 HSM-38）',
      'yue-Hant': '雪丘島威德爾海固定海冰長途徒步（帝企鵝棲息地同 HSM-38）',
      pt: 'Ilha Snow Hill — Travessia no Gelo Fixo do Mar de Weddell (HSM-38)',
      es: 'Isla Cerro Nevado — Travesía sobre Hielo Fijo en el Mar de Weddell (HSM-38)'
    },
    summary: {
      en: 'Challenging multi-kilometer trek over flat but wind-scoured Weddell Sea fast ice to observe emperor penguin chicks, alongside Nordenskjöld’s 1902 wooden hut (HSM-38).',
      'zh-CN': '在威德尔海寒风凛冽的陆缘固定海冰上进行数公里平地长距离徒步以远观帝企鹅育雏地，邻近 1902 年诺登舍尔德越冬木屋（HSM-38）。',
      'zh-TW': '在威德爾海寒風凜冽的陸緣固定海冰上進行數公里平地長距離徒步以遠觀帝企鵝育雛地，鄰近 1902 年諾登舍爾德越冬木屋（HSM-38）。',
      'yue-Hant': '要喺威德爾海又凍又大風嘅固定海冰上面行幾公里遠去睇帝企鵝湊仔，隔離仲有 1902 年諾登舍爾德探險隊留低嘅越冬木屋（HSM-38）。',
      pt: 'Travessia exigente de vários quilômetros sobre o gelo marinho fixo do Mar de Weddell até a colônia de pinguins-imperadores e a cabana HSM-38.',
      es: 'Exigente caminata de varios kilómetros sobre hielo fijo del Mar de Weddell hacia la colonia de pingüinos emperador y la cabaña HSM-38.'
    },
    highlight: {
      en: 'Heavy Weddell pack ice and low cloud ceilings frequently delay sea-ice landings — pack chemical hand/toe warmers for prolonged stationary photography.',
      'zh-CN': '威德尔海密集流冰与低云极易阻断登陆窗口；在海冰面长时间静立拍摄极易冻伤手脚，务必携带暖宝宝与高蓬松羽绒层。',
      'zh-TW': '威德爾海密集流冰與低雲極易阻斷登陸窗口；在海冰面長時間靜立拍攝極易凍傷手腳，務必攜帶暖暖包與高蓬鬆羽絨層。',
      'yue-Hant': '威德爾海厚浮冰同低雲成日會阻住登陸；企喺冰面影相唔郁好易凍傷手腳，記得帶定暖包同厚羽絨。',
      pt: 'Banquisas densas e teto nublado baixo frequentemente atrasam operações; leve aquecedores térmicos para mãos e pés.',
      es: 'La densa banquisa y la nubosidad baja suelen demorar las operaciones; lleve calentadores térmicos para manos y pies.'
    },
    sourceUrl: 'https://documents.ats.aq/cep/handbook/List%20of%20HSMs%202010_e.pdf'
  },
  {
    id: 'union-glacier-camp',
    region: 'west-antarctica',
    lat: -79.7681,
    lon: -82.8567,
    typicalElevationGainM: 320,
    typicalMaxSlopeDeg: 19,
    terrainType: 'inland-blue-ice',
    aliases: [
      'union glacier',
      'glaciar union',
      'elephant head',
      'ellsworth mountains',
      '联合冰川',
      '聯合冰川',
      '埃尔斯沃思山脉'
    ],
    name: {
      en: 'Union Glacier Blue-Ice Camp (Ellsworth Mountains, 79°S)',
      'zh-CN': '联合冰川蓝冰营地（埃尔斯沃思山脉，南纬 79°）',
      'zh-TW': '聯合冰川藍冰營地（埃爾斯沃思山脈，南緯 79°）',
      'yue-Hant': '聯合冰川藍冰營地（埃爾斯沃思山脈，南緯 79°）',
      pt: 'Acampamento de Gelo Azul da Geleira Union (Montes Ellsworth, 79°S)',
      es: 'Campamento de Hielo Azul Glaciar Unión (Montes Ellsworth, 79°S)'
    },
    summary: {
      en: 'Deep-field inland expedition hub in the Heritage Range (700 m elevation) featuring natural blue-ice runways, 24-hour summer sun, and glacier treks around Elephant Head.',
      'zh-CN': '位于埃尔斯沃思山脉海拔约 700 米的内陆深处探险枢纽，拥有天然蓝冰跑道、24 小时极昼骄阳及象头峰周边冰川徒步线路。',
      'zh-TW': '位於埃爾斯沃思山脈海拔約 700 公尺的內陸深處探險樞紐，擁有天然藍冰跑道、24 小時極晝驕陽及象頭峰周邊冰川徒步路線。',
      'yue-Hant': '喺埃爾斯沃思山脈海拔七百米嘅內陸探險大本營，有天然藍冰飛機跑道、廿四小時唔落山嘅極晝太陽同埋象頭峰冰川行山線。',
      pt: 'Base logística no interior profundo dos Montes Ellsworth (700 m), com pista natural de gelo azul, sol da meia-noite e trilhas glaciais.',
      es: 'Base logística en el interior de los Montes Ellsworth (700 m), con pista natural de hielo azul, sol de medianoche y rutas glaciares.'
    },
    highlight: {
      en: 'Polished blue-ice surfaces reflect intense UV radiation and sudden katabatic gusts — Category 4 glacier sunglasses, SPF 50+, and crampons are mandatory.',
      'zh-CN': '镜面蓝冰反射极强紫外线且随时可能遭遇下降风，必须佩戴 4 级防雪盲冰川墨镜、涂抹 SPF50+ 防晒霜并穿戴冰爪。',
      'zh-TW': '鏡面藍冰反射極強紫外線且隨時可能遭遇下降風，必須佩戴 4 級防雪盲冰川墨鏡、塗抹 SPF50+ 防曬霜並穿戴冰爪。',
      'yue-Hant': '光滑嘅藍冰反射超強紫外線而且隨時吹起大陣下降風，一定要戴四級防雪盲冰川黑超、搽足防曬同埋扣實冰爪。',
      pt: 'O gelo azul polido reflete UV intenso e exige óculos glaciais Categoria 4, protetor solar SPF 50+ e crampons.',
      es: 'El hielo azul pulido refleja intensa radiación UV; son obligatorias gafas glaciares Categoría 4, protector SPF 50+ y crampones.'
    },
    sourceUrl: 'https://placenames.aq/'
  },
  {
    id: 'mount-vinson-base',
    region: 'west-antarctica',
    lat: -78.58,
    lon: -85.62,
    typicalElevationGainM: 1200,
    typicalMaxSlopeDeg: 35,
    terrainType: 'glacier-crevasse-zone',
    aliases: [
      'mount vinson',
      'vinson massif',
      'branscomb glacier',
      'monte vinson',
      'macizo vinson',
      '文森峰',
      '文森山'
    ],
    name: {
      en: 'Vinson Massif Base Camp (4,892 m Highest Antarctic Peak)',
      'zh-CN': '文森峰大本营（南极最高峰 4,892 米攀登路线）',
      'zh-TW': '文森峰大本營（南極最高峰 4,892 公尺攀登路線）',
      'yue-Hant': '文森峰大本營（南極最高峰 4,892 米攀山線）',
      pt: 'Campo Base do Maciço Vinson (4.892 m, Ponto Culminante da Antártida)',
      es: 'Campamento Base del Macizo Vinson (4.892 m, Cumbre de la Antártida)'
    },
    summary: {
      en: 'High-altitude roped glacier expedition base at ~2,140 m on Branscomb Glacier ascending toward Antarctica’s 4,892 m summit under extreme polar wind chill.',
      'zh-CN': '设于布兰斯科姆冰川海拔约 2,140 米的高海拔结组探险大本营，在极端风寒与低气压下攀登海拔 4,892 米的南极最高峰。',
      'zh-TW': '設於布蘭斯科姆冰川海拔約 2,140 公尺的高海拔結組探險大本營，在極端風寒與低氣壓下攀登海拔 4,892 公尺的南極最高峰。',
      'yue-Hant': '設喺布蘭斯科姆冰川海拔二千一百幾米嘅高海拔結組大本營，要頂住極端風寒同低氣壓攀上 4,892 米高嘅南極最高峰。',
      pt: 'Base de expedição alpina encordoada a 2.140 m na Geleira Branscomb rumo ao cume de 4.892 m da Antártida.',
      es: 'Base de expedición alpina encordada a 2.140 m en el Glaciar Branscomb rumbo a la cumbre antártica de 4.892 m.'
    },
    highlight: {
      en: 'Barometric pressure near 4,800 m feels equivalent to ~5,500 m due to polar atmospheric thinning; full roped crevasse rescue gear and expedition down suit required.',
      'zh-CN': '受极区大气层偏薄效应影响，4,800 米处等效生理缺氧高度接近 5,500 米；必须配备完整冰裂缝结组救援装备与连体高寒羽绒服。',
      'zh-TW': '受極區大氣層偏薄效應影響，4,800 公尺處等效生理缺氧高度接近 5,500 公尺；必須配備完整冰裂縫結組救援裝備與連體高寒羽絨服。',
      'yue-Hant': '極地大氣層特別薄，上到四千八百米嘅缺氧感覺等於平時五千五百米咁高；必須帶齊冰裂縫結組救援裝備同埋連身極地羽絨衣。',
      pt: 'O afinamento atmosférico polar faz 4.800 m equivalerem a ~5.500 m fisiológicos; equipamento completo de resgate em fendas é indispensável.',
      es: 'El adelgazamiento atmosférico polar hace que 4.800 m equivalgan fisiológicamente a ~5.500 m; equipo completo de encordamiento obligatorio.'
    },
    sourceUrl: 'https://placenames.aq/'
  }
];
