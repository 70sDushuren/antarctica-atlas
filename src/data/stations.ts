import type { PolarStation } from '@/lib/types';

export const POLAR_STATIONS: PolarStation[] = [
  {
    id: 'amundsen-scott',
    code: 'NPX',
    name: {
      en: 'Amundsen-Scott South Pole Station',
      'zh-CN': '阿蒙森-斯科特南极点科考站',
      'zh-TW': '阿蒙森-斯科特南極點科考站',
      'yue-Hant': '阿蒙森-斯科特南極點科考站',
      pt: 'Estação Polo Sul Amundsen-Scott',
      es: 'Estación Polo Sur Amundsen-Scott'
    },
    countryCode: 'US',
    countryName: {
      en: 'United States',
      'zh-CN': '美国',
      'zh-TW': '美國',
      'yue-Hant': '美國',
      pt: 'Estados Unidos',
      es: 'Estados Unidos'
    },
    region: 'south-pole-plateau',
    lat: -90.0,
    lon: 0.0,
    elevationM: 2835,
    seasonality: 'year-round',
    establishedYear: 1956,
    maxCapacity: 150,
    summary: {
      en: 'Located directly at 90°S atop a 2,835 m ice sheet, experiencing one 6-month polar day and one 6-month polar night each year.',
      'zh-CN': '坐落于地理南极点（90°S）厚达 2,835 米的高原冰盖之上，每年仅经历一次长达半年的极昼与半年的极夜。',
      'zh-TW': '坐落於地理南極點（90°S）厚達 2,835 公尺的高原冰蓋之上，每年僅經歷一次長達半年的極晝與半年的極夜。',
      'yue-Hant': '正正起喺南緯 90 度地理南極點、成 2,835 米厚嘅冰蓋上面，成年得一次半年極晝同埋半年極夜。',
      pt: 'Situada exatamente a 90°S sobre 2.835 m de gelo, vivenciando seis meses contínuos de dia polar e seis meses de noite polar.',
      es: 'Ubicada exactamente en los 90°S sobre 2.835 m de hielo, con seis meses continuos de día polar y seis meses de noche polar.'
    },
    sourceUrl: 'https://www.comnap.aq/antarctic-facilities-information'
  },
  {
    id: 'great-wall',
    code: 'GWS',
    name: {
      en: 'Great Wall Station',
      'zh-CN': '中国南极长城站',
      'zh-TW': '中國南極長城站',
      'yue-Hant': '中國南極長城站',
      pt: 'Estação Grande Muralha',
      es: 'Base Gran Muralla'
    },
    countryCode: 'CN',
    countryName: {
      en: 'China',
      'zh-CN': '中国',
      'zh-TW': '中國',
      'yue-Hant': '中國',
      pt: 'China',
      es: 'China'
    },
    region: 'antarctic-peninsula',
    lat: -62.2163,
    lon: -58.9622,
    elevationM: 10,
    seasonality: 'year-round',
    establishedYear: 1985,
    maxCapacity: 80,
    summary: {
      en: 'Established in February 1985 on Fildes Peninsula, King George Island (South Shetland Islands); home to protected heritage sites HSM-52 and HSM-86.',
      'zh-CN': '1985 年 2 月建于南设得兰群岛乔治王岛菲尔德斯半岛，拥有受《南极条约》保护的建站纪念碑（HSM-52）与一号栋（HSM-86）。',
      'zh-TW': '1985 年 2 月建於南設得蘭群島喬治王島菲爾德斯半島，擁有受《南極條約》保護之建站紀念碑（HSM-52）與一號棟（HSM-86）。',
      'yue-Hant': '1985 年 2 月喺南設得蘭群島喬治王島落成，入面嘅建站紀念碑（HSM-52）同埋一號棟（HSM-86）都列入咗南極條約法定古蹟。',
      pt: 'Inaugurada em fevereiro de 1985 na Península Fildes, Ilha Rei George, abrigando os monumentos históricos protegidos HSM-52 e HSM-86.',
      es: 'Inaugurada en febrero de 1985 en la Península Fildes, Isla Rey Jorge, sede de los sitios históricos protegidos HSM-52 y HSM-86.'
    },
    sourceUrl: 'https://www.comnap.aq/antarctic-facilities-information'
  },
  {
    id: 'zhongshan',
    code: 'ZSS',
    name: {
      en: 'Zhongshan Station',
      'zh-CN': '中国南极中山站',
      'zh-TW': '中國南極中山站',
      'yue-Hant': '中國南極中山站',
      pt: 'Estação Zhongshan',
      es: 'Base Zhongshan'
    },
    countryCode: 'CN',
    countryName: {
      en: 'China',
      'zh-CN': '中国',
      'zh-TW': '中國',
      'yue-Hant': '中國',
      pt: 'China',
      es: 'China'
    },
    region: 'east-antarctica',
    lat: -69.3731,
    lon: 76.3722,
    elevationM: 11,
    seasonality: 'year-round',
    establishedYear: 1989,
    maxCapacity: 60,
    summary: {
      en: 'Coastal gateway in the Larsemann Hills (Prydz Bay, East Antarctica) for inland Dome A ice-core traverses and polar aurora observation.',
      'zh-CN': '位于东南极普里兹湾拉斯曼丘陵，是深入内陆冰穹 A（昆仑站）科考断面与极光磁层观测的核心枢纽。',
      'zh-TW': '位於東南極普里茲灣拉斯曼丘陵，為深入內陸冰穹 A 科考斷面與極光磁層觀測的核心樞紐。',
      'yue-Hant': '位於東南極普里茲灣拉斯曼丘陵，係出發去內陸冰穹 A 鑽冰芯同埋觀測南極光嘅重要大本營。',
      pt: 'Portal costeiro nas Colinas Larsemann (Baía Prydz) para travessias ao Domo A e observação de auroras austrais.',
      es: 'Base costera en las Colinas Larsemann (Bahía Prydz), punto de partida hacia el Domo A y observatorio de auroras australes.'
    },
    sourceUrl: 'https://www.comnap.aq/antarctic-facilities-information'
  },
  {
    id: 'qinling',
    code: 'QLS',
    name: {
      en: 'Qinling Station',
      'zh-CN': '中国南极秦岭站',
      'zh-TW': '中國南極秦嶺站',
      'yue-Hant': '中國南極秦嶺站',
      pt: 'Estação Qinling',
      es: 'Base Qinling'
    },
    countryCode: 'CN',
    countryName: {
      en: 'China',
      'zh-CN': '中国',
      'zh-TW': '中國',
      'yue-Hant': '中國',
      pt: 'China',
      es: 'China'
    },
    region: 'ross-sea-sector',
    lat: -74.9344,
    lon: 163.7147,
    elevationM: 28,
    seasonality: 'year-round',
    establishedYear: 2024,
    maxCapacity: 80,
    summary: {
      en: 'Located on rocky Inexpressible Island in Terra Nova Bay (Ross Sea), a major polynya zone shaped by intense katabatic winds.',
      'zh-CN': '位于罗斯海特拉诺瓦湾恩克斯堡岛（难言岛），地处典型下降风频发与冰间湖生态海气耦合研究核心区。',
      'zh-TW': '位於羅斯海特拉諾瓦灣恩克斯堡島（難言島），地處典型下降風頻發與冰間湖生態海氣耦合研究核心區。',
      'yue-Hant': '起喺羅斯海難言島岩石地帶，嗰度出名下降風特別猛烈，係研究羅斯海冰間湖生態同氣候嘅重要基地。',
      pt: 'Localizada na Ilha Inexpressible, Baía Terra Nova (Mar de Ross), região chave de polínias e fortes ventos catabáticos.',
      es: 'Situada en la Isla Inexpresable, Bahía Terra Nova (Mar de Ross), zona clave de polinias costeras y fuertes vientos catabáticos.'
    },
    sourceUrl: 'https://www.comnap.aq/antarctic-facilities-information'
  },
  {
    id: 'kunlun',
    code: 'KLS',
    name: {
      en: 'Kunlun Station (Dome A)',
      'zh-CN': '中国南极昆仑站（冰穹 A）',
      'zh-TW': '中國南極崑崙站（冰穹 A）',
      'yue-Hant': '中國南極崑崙站（冰穹 A 最高點）',
      pt: 'Estação Kunlun (Domo A)',
      es: 'Base Kunlun (Domo A)'
    },
    countryCode: 'CN',
    countryName: {
      en: 'China',
      'zh-CN': '中国',
      'zh-TW': '中國',
      'yue-Hant': '中國',
      pt: 'China',
      es: 'China'
    },
    region: 'east-antarctica',
    lat: -80.4167,
    lon: 77.1167,
    elevationM: 4087,
    seasonality: 'summer-only',
    establishedYear: 2009,
    maxCapacity: 24,
    summary: {
      en: 'Perched at 4,087 m atop Dome Argus — the highest summit of the East Antarctic Ice Sheet — directly above the subglacial Gamburtsev Mountains.',
      'zh-CN': '坐落于海拔 4,087 米的东南极冰盖最高点冰穹 A（Dome A），正下方横亘着深埋冰下的甘布尔泽夫山脉，具备地球顶尖太赫兹天文观测条件。',
      'zh-TW': '坐落於海拔 4,087 公尺的東南極冰蓋最高點冰穹 A（Dome A），正下方為深埋冰下的甘布爾澤夫山脈，具備極佳極地天文觀測條件。',
      'yue-Hant': '起喺海拔 4,087 米嘅東南極冰蓋最高峰冰穹 A 上面，正下方就係藏喺厚冰底嘅甘布爾澤夫山脈，空氣極乾好適合做天文觀測同鑽深冰芯。',
      pt: 'Situada a 4.087 m no topo do Domo Argus — ponto mais elevado do manto de gelo antártico — sobre as Montanhas Gamburtsev subglaciais.',
      es: 'Ubicada a 4.087 m en la cima del Domo Argus — el punto más alto del manto de hielo oriental — sobre la cordillera subglacial Gamburtsev.'
    },
    sourceUrl: 'https://www.comnap.aq/antarctic-facilities-information'
  },
  {
    id: 'mcmurdo',
    code: 'MCM',
    name: {
      en: 'McMurdo Station',
      'zh-CN': '麦克默多站',
      'zh-TW': '麥克默多站',
      'yue-Hant': '麥克默多站',
      pt: 'Estação McMurdo',
      es: 'Estación McMurdo'
    },
    countryCode: 'US',
    countryName: {
      en: 'United States',
      'zh-CN': '美国',
      'zh-TW': '美國',
      'yue-Hant': '美國',
      pt: 'Estados Unidos',
      es: 'Estados Unidos'
    },
    region: 'ross-sea-sector',
    lat: -77.8463,
    lon: 166.6682,
    elevationM: 24,
    seasonality: 'year-round',
    establishedYear: 1955,
    maxCapacity: 1000,
    summary: {
      en: 'Antarctica’s largest logistics and research hub on volcanic Ross Island beneath active Mount Erebus (3,794 m).',
      'zh-CN': '南极洲规模最大的科考与航空后勤枢纽，位于罗斯岛南端，背靠拥有永久熔岩湖的埃里伯斯活火山（海拔 3,794 米）。',
      'zh-TW': '南極洲規模最大的科考與航空後勤樞紐，位於羅斯島南端，背靠擁有永久熔岩湖的埃里伯斯活火山（海拔 3,794 公尺）。',
      'yue-Hant': '全南極最大規模嘅科研同埋後勤中心，就喺羅斯島南邊，後面就係成日噴煙嘅埃里伯斯活火山。',
      pt: 'O maior centro logístico e científico da Antártida na Ilha de Ross, ao pé do vulcão ativo Monte Erebus (3.794 m).',
      es: 'El mayor centro científico y logístico antártico en la Isla de Ross, al pie del volcán activo Monte Erebus (3.794 m).'
    },
    sourceUrl: 'https://www.comnap.aq/antarctic-facilities-information'
  },
  {
    id: 'palmer',
    code: 'PAL',
    name: {
      en: 'Palmer Station',
      'zh-CN': '帕尔默站',
      'zh-TW': '帕爾默站',
      'yue-Hant': '帕爾默海洋生態科考站',
      pt: 'Estação Palmer',
      es: 'Estación Palmer'
    },
    countryCode: 'US',
    countryName: {
      en: 'United States',
      'zh-CN': '美国',
      'zh-TW': '美國',
      'yue-Hant': '美國',
      pt: 'Estados Unidos',
      es: 'Estados Unidos'
    },
    region: 'antarctic-peninsula',
    lat: -64.7743,
    lon: -64.0538,
    elevationM: 8,
    seasonality: 'year-round',
    establishedYear: 1968,
    maxCapacity: 46,
    summary: {
      en: 'Marine biological observatory on Anvers Island north of the Antarctic Circle, tracking rapid West Antarctic Peninsula sea-ice and krill ecosystem shifts.',
      'zh-CN': '位于南极圈以北昂韦尔岛的海洋生态观测站，长期追踪南极半岛西岸快速升温、海冰消退与磷虾食物网演变。',
      'zh-TW': '位於南極圈以北昂韋爾島的海洋生態觀測站，長期追蹤南極半島西岸快速升溫、海冰消退與磷蝦生態演變。',
      'yue-Hant': '喺南極半島西岸昂韋爾島嘅海洋生物研究站，專門監測海冰減少同埋南極磷蝦、企鵝生態鏈嘅長遠變化。',
      pt: 'Observatório de biologia marinha na Ilha Anvers, monitorando o gelo marinho e o ecossistema de krill da Península Antártica.',
      es: 'Observatorio de biología marina en la Isla Amberes, dedicado al estudio del hielo marino y el ecosistema de kril en la Península.'
    },
    sourceUrl: 'https://www.comnap.aq/antarctic-facilities-information'
  },
  {
    id: 'rothera',
    code: 'ROT',
    name: {
      en: 'Rothera Research Station',
      'zh-CN': '罗瑟拉科考站',
      'zh-TW': '羅瑟拉科考站',
      'yue-Hant': '英國羅瑟拉科考站',
      pt: 'Estação de Pesquisa Rothera',
      es: 'Base de Investigación Rothera'
    },
    countryCode: 'GB',
    countryName: {
      en: 'United Kingdom',
      'zh-CN': '英国',
      'zh-TW': '英國',
      'yue-Hant': '英國',
      pt: 'Reino Unido',
      es: 'Reino Unido'
    },
    region: 'antarctic-peninsula',
    lat: -67.5681,
    lon: -68.1258,
    elevationM: 16,
    seasonality: 'year-round',
    establishedYear: 1975,
    maxCapacity: 130,
    summary: {
      en: 'Flagship British Antarctic Survey hub on Adelaide Island south of the Antarctic Circle, supporting RRS Sir David Attenborough and deep-field glaciology.',
      'zh-CN': '英国南极调查局（BAS）位于南极圈内阿德莱德岛的核心枢纽，兼备碎石航空跑道与极地科考船深水码头。',
      'zh-TW': '英國南極調查局（BAS）位於南極圈內阿德萊德島的核心樞紐，兼備航空跑道與極地科考船深水碼頭。',
      'yue-Hant': '英國南極調查局喺南極圈入面阿德萊德島嘅主力基地，既有飛機跑道又有深水碼頭支援大型破冰船同內陸冰川考察。',
      pt: 'Principal centro do British Antarctic Survey na Ilha Adelaide, ao sul do Círculo Polar, com pista aérea e porto polar.',
      es: 'Centro principal del British Antarctic Survey en la Isla Adelaida, al sur del Círculo Polar, con aeródromo y muelle polar.'
    },
    sourceUrl: 'https://www.comnap.aq/antarctic-facilities-information'
  },
  {
    id: 'halley-vi',
    code: 'HAL',
    name: {
      en: 'Halley VI Research Station',
      'zh-CN': '哈雷六号模块化科考站',
      'zh-TW': '哈雷六號模組化科考站',
      'yue-Hant': '哈雷六號識行路冰架科考站',
      pt: 'Estação Halley VI',
      es: 'Estación Halley VI'
    },
    countryCode: 'GB',
    countryName: {
      en: 'United Kingdom',
      'zh-CN': '英国',
      'zh-TW': '英國',
      'yue-Hant': '英國',
      pt: 'Reino Unido',
      es: 'Reino Unido'
    },
    region: 'weddell-sea-sector',
    lat: -75.58,
    lon: -26.66,
    elevationM: 37,
    seasonality: 'summer-only',
    establishedYear: 1956,
    maxCapacity: 70,
    summary: {
      en: 'World’s first relocatable ski-mounted polar station on the floating Brunt Ice Shelf (eastern Weddell Sea), historic site of the 1985 stratospheric ozone hole discovery.',
      'zh-CN': '坐落于威德尔海东岸浮动布伦特冰架上的全球首座雪橇液压可移动科考站，1985 年人类正是在哈雷站首次发现南极臭氧层空洞。',
      'zh-TW': '坐落於威德爾海東岸浮動布倫特冰架上的全球首座雪橇液壓可移動科考站，1985 年科學家即在此首度發現南極臭氧層破洞。',
      'yue-Hant': '起喺威德爾海浮動冰架上面、全球第一個裝咗液壓雪橇可以成座拖走搬位嘅科考站；1985 年南極臭氧層穿窿就係喺呢度發現嘅。',
      pt: 'Primeira estação polar relocável sobre esquis na Plataforma de Gelo Brunt (Mar de Weddell), berço da descoberta do buraco na camada de ozônio em 1985.',
      es: 'Primera estación polar reubicable sobre esquís en la Barrera de Hielo Brunt (Mar de Weddell), donde se descubrió el agujero de ozono en 1985.'
    },
    sourceUrl: 'https://www.comnap.aq/antarctic-facilities-information'
  },
  {
    id: 'esperanza',
    code: 'ESP',
    name: {
      en: 'Esperanza Base (Hope Bay)',
      'zh-CN': '希望湾埃斯佩兰萨站',
      'zh-TW': '希望灣埃斯佩蘭薩站',
      'yue-Hant': '希望灣埃斯佩蘭薩站',
      pt: 'Base Esperanza (Baía Esperança)',
      es: 'Base Esperanza (Bahía Esperanza)'
    },
    countryCode: 'AR',
    countryName: {
      en: 'Argentina',
      'zh-CN': '阿根廷',
      'zh-TW': '阿根廷',
      'yue-Hant': '阿根廷',
      pt: 'Argentina',
      es: 'Argentina'
    },
    region: 'antarctic-peninsula',
    lat: -63.3981,
    lon: -56.9973,
    elevationM: 25,
    seasonality: 'year-round',
    establishedYear: 1952,
    maxCapacity: 90,
    summary: {
      en: 'Situated at the northern tip of Trinity Peninsula at the gateway to the Antarctic Sound and Weddell Sea; site of HSM-40.',
      'zh-CN': '扼守南极半岛最北端特里尼蒂半岛希望湾，连接南极海峡与威德尔海门户，内设历史纪念遗迹 HSM-40。',
      'zh-TW': '扼守南極半島最北端特里尼蒂半島希望灣，連接南極海峽與威德爾海門戶，內設歷史紀念遺蹟 HSM-40。',
      'yue-Hant': '守住南極半島最北邊希望灣，係由半島轉入威德爾海必經嘅咽喉位，站入面仲有 HSM-40 歷史紀念碑。',
      pt: 'Localizada na ponta da Península Trinidad, entrada para o Estreito Antártico e o Mar de Weddell; abriga o HSM-40.',
      es: 'Situada en el extremo norte de la Península Trinidad, puerta de acceso al Estrecho Antártico y el Mar de Weddell; alberga el HSM-40.'
    },
    sourceUrl: 'https://www.comnap.aq/antarctic-facilities-information'
  },
  {
    id: 'marambio',
    code: 'MAR',
    name: {
      en: 'Marambio Base (Seymour Island)',
      'zh-CN': '马兰比奥站（西摩岛）',
      'zh-TW': '馬蘭比奧站（西摩島）',
      'yue-Hant': '馬蘭比奧高原機場站（西摩島）',
      pt: 'Base Marambio (Ilha Seymour)',
      es: 'Base Marambio (Isla Marambio / Seymour)'
    },
    countryCode: 'AR',
    countryName: {
      en: 'Argentina',
      'zh-CN': '阿根廷',
      'zh-TW': '阿根廷',
      'yue-Hant': '阿根廷',
      pt: 'Argentina',
      es: 'Argentina'
    },
    region: 'weddell-sea-sector',
    lat: -64.2414,
    lon: -56.6267,
    elevationM: 198,
    seasonality: 'year-round',
    establishedYear: 1969,
    maxCapacity: 150,
    summary: {
      en: 'Built atop a 198 m permafrost mesa in the northwestern Weddell Sea, renowned for Cretaceous-Paleogene Gondwana marine and dinosaur fossil beds.',
      'zh-CN': '建于威德尔海西北部海拔 198 米的冻土台地之上，拥有全年起降跑道，周边地层富含白垩纪—古近纪冈瓦纳古生物化石。',
      'zh-TW': '建於威德爾海西北部海拔 198 公尺的凍土台地之上，擁有全年起降跑道，周邊地層富含白堊紀至古近紀岡瓦納古生物化石。',
      'yue-Hant': '起喺威德爾海西北邊成二百米高嘅凍土平頂山上面，飛機成年都可以起降，附近岩石仲掘出過好多遠古恐龍同海洋化石。',
      pt: 'Construída sobre um platô de permafrost de 198 m no Mar de Weddell, famosa por ricos depósitos de fósseis do Gondwana.',
      es: 'Construida sobre una meseta de permafrost de 198 m en el Mar de Weddell, célebre por su pista aérea anual y sus yacimientos fósiles.'
    },
    sourceUrl: 'https://www.comnap.aq/antarctic-facilities-information'
  },
  {
    id: 'presidente-frei',
    code: 'FRE',
    name: {
      en: 'Presidente Eduardo Frei Montalva Base',
      'zh-CN': '弗雷总统科考站',
      'zh-TW': '佛雷總統科考站',
      'yue-Hant': '智利弗雷總統航空站',
      pt: 'Base Presidente Eduardo Frei Montalva',
      es: 'Base Presidente Eduardo Frei Montalva'
    },
    countryCode: 'CL',
    countryName: {
      en: 'Chile',
      'zh-CN': '智利',
      'zh-TW': '智利',
      'yue-Hant': '智利',
      pt: 'Chile',
      es: 'Chile'
    },
    region: 'antarctic-peninsula',
    lat: -62.2002,
    lon: -58.9789,
    elevationM: 10,
    seasonality: 'year-round',
    establishedYear: 1969,
    maxCapacity: 150,
    summary: {
      en: 'Primary air-bridge meteorological center linking Punta Arenas across the Drake Passage to King George Island (Teniente Marsh Aerodrome).',
      'zh-CN': '连接智利蓬塔阿雷纳斯跨越德雷克海峡飞抵乔治王岛的核心航空气象中心（马什中尉机场所在地）。',
      'zh-TW': '連接智利蓬塔阿雷納斯跨越德雷克海峽飛抵喬治王島的核心航空氣象中心（馬什中尉機場所在地）。',
      'yue-Hant': '由智利蓬塔阿雷納斯坐飛機飛過德雷克海峽落腳喬治王島嘅主要航空氣象站，隔離就係各國共用嘅碎石跑道。',
      pt: 'Principal centro meteorológico e ponte aérea ligando Punta Arenas à Ilha Rei George através da Passagem de Drake.',
      es: 'Principal centro meteorológico y puente aéreo que conecta Punta Arenas con la Isla Rey Jorge a través del Pasaje de Drake.'
    },
    sourceUrl: 'https://www.comnap.aq/antarctic-facilities-information'
  },
  {
    id: 'comandante-ferraz',
    code: 'EACF',
    name: {
      en: 'Comandante Ferraz Antarctic Station',
      'zh-CN': '费拉斯司令南极科考站',
      'zh-TW': '費拉斯司令南極科考站',
      'yue-Hant': '費拉斯司令南極科考站',
      pt: 'Estação Antártica Comandante Ferraz',
      es: 'Estación Antártica Comandante Ferraz'
    },
    countryCode: 'BR',
    countryName: {
      en: 'Brazil',
      'zh-CN': '巴西',
      'zh-TW': '巴西',
      'yue-Hant': '巴西',
      pt: 'Brasil',
      es: 'Brasil'
    },
    region: 'antarctic-peninsula',
    lat: -62.085,
    lon: -58.3917,
    elevationM: 8,
    seasonality: 'year-round',
    establishedYear: 1984,
    maxCapacity: 64,
    summary: {
      en: 'Modern architectural research complex in Admiralty Bay, King George Island, leading South Atlantic-Antarctic climate and marine biology studies.',
      'zh-CN': '位于乔治王岛阿德默勒尔蒂湾，现代极地建筑典范，主攻南大西洋—南极气候遥相关与海洋生态研究。',
      'zh-TW': '位於喬治王島阿德默勒爾蒂灣，現代極地建築典範，主攻南大西洋—南極氣候遙相關與海洋生態研究。',
      'yue-Hant': '位於喬治王島海軍部灣，新落成嘅現代化極地建築好有設計感，專門研究南大西洋同南極嘅氣候關聯。',
      pt: 'Complexo científico moderno na Baía do Almirantado, Ilha Rei George, referência em clima sul-atlântico e biologia marinha.',
      es: 'Complejo científico moderno en la Bahía Almirantazgo, Isla Rey Jorge, referente en clima del Atlántico Sur y biología marina.'
    },
    sourceUrl: 'https://www.comnap.aq/antarctic-facilities-information'
  },
  {
    id: 'vostok',
    code: 'VOS',
    name: {
      en: 'Vostok Station',
      'zh-CN': '沃斯托克站（东方站）',
      'zh-TW': '沃斯托克站（東方站）',
      'yue-Hant': '沃斯托克站（東方站）',
      pt: 'Estação Vostok',
      es: 'Base Vostok'
    },
    countryCode: 'RU',
    countryName: {
      en: 'Russia',
      'zh-CN': '俄罗斯',
      'zh-TW': '俄羅斯',
      'yue-Hant': '俄羅斯',
      pt: 'Rússia',
      es: 'Rusia'
    },
    region: 'east-antarctica',
    lat: -78.4645,
    lon: 106.834,
    elevationM: 3488,
    seasonality: 'year-round',
    establishedYear: 1957,
    maxCapacity: 30,
    summary: {
      en: 'Sits at 3,488 m directly above giant subglacial Lake Vostok; recorded Earth’s coldest natural surface air temperature (-89.2°C on 21 July 1983).',
      'zh-CN': '海拔 3,488 米，正下方封存着巨大的冰下沃斯托克湖，曾于 1983 年 7 月 21 日测得地球表面最低自然气温纪录 -89.2°C。',
      'zh-TW': '海拔 3,488 公尺，正下方封存著巨大的冰下沃斯托克湖，曾於 1983 年 7 月 21 日測得地球表面最低自然氣溫紀錄 -89.2°C。',
      'yue-Hant': '海拔高達 3,488 米，地底四千米冰層下面藏住超巨型冰下湖，1983 年仲創低地球表面最凍自然氣溫紀錄零下 89.2 度。',
      pt: 'A 3.488 m de altitude sobre o gigantesco Lago Vostok subglacial; registrou a menor temperatura natural da Terra (-89,2°C em 1983).',
      es: 'A 3.488 m de altitud sobre el gigantesco Lago Vostok subglacial; registró la temperatura natural más baja de la Tierra (-89,2°C en 1983).'
    },
    sourceUrl: 'https://amrdc.ssec.wisc.edu/'
  },
  {
    id: 'concordia',
    code: 'CON',
    name: {
      en: 'Concordia Station (Dome C)',
      'zh-CN': '康考迪亚站（冰穹 C）',
      'zh-TW': '康考迪亞站（冰穹 C）',
      'yue-Hant': '康考迪亞雙圓塔科考站（冰穹 C）',
      pt: 'Estação Concordia (Domo C)',
      es: 'Estación Concordia (Domo C)'
    },
    countryCode: 'FR/IT',
    countryName: {
      en: 'France / Italy',
      'zh-CN': '法国 / 意大利',
      'zh-TW': '法國 / 義大利',
      'yue-Hant': '法國同埋意大利合辦',
      pt: 'França / Itália',
      es: 'Francia / Italia'
    },
    region: 'east-antarctica',
    lat: -75.0998,
    lon: 123.3322,
    elevationM: 3233,
    seasonality: 'year-round',
    establishedYear: 2005,
    maxCapacity: 60,
    summary: {
      en: 'Joint Franco-Italian inland plateau station at 3,233 m where EPICA & Beyond EPICA extracted continuous 800,000-to-1.2-million-year paleoclimate ice cores.',
      'zh-CN': '法意联合建造的海拔 3,233 米内陆高原双子圆塔科考站，人类在此成功钻取跨越 80 万至 120 万年的深冰芯古气候档案。',
      'zh-TW': '法義聯合建造的海拔 3,233 公尺內陸高原雙子圓塔科考站，科學家在此成功鑽取跨越 80 萬至 120 萬年的深冰芯古氣候紀錄。',
      'yue-Hant': '法國同意大利合作起喺三千二百幾米冰原上面嘅雙圓柱科考站，科學家喺呢度鑽出過紀錄咗成百萬年地球氣候歷史嘅超深冰芯。',
      pt: 'Estação franco-italiana a 3.233 m no Domo C, famosa pela perfuração de testemunhos de gelo de até 1,2 milhão de anos.',
      es: 'Base franco-italiana a 3.233 m en el Domo C, célebre por los testigos de hielo paleoclimáticos de hasta 1,2 millones de años.'
    },
    sourceUrl: 'https://www.comnap.aq/antarctic-facilities-information'
  },
  {
    id: 'dumont-durville',
    code: 'DDU',
    name: {
      en: 'Dumont d’Urville Station',
      'zh-CN': '迪蒙·迪维尔站（阿黛利地）',
      'zh-TW': '迪蒙·迪維爾站（阿黛利地）',
      'yue-Hant': '迪蒙·迪維爾狂風海岸站',
      pt: 'Estação Dumont d’Urville',
      es: 'Base Dumont d’Urville'
    },
    countryCode: 'FR',
    countryName: {
      en: 'France',
      'zh-CN': '法国',
      'zh-TW': '法國',
      'yue-Hant': '法國',
      pt: 'França',
      es: 'Francia'
    },
    region: 'east-antarctica',
    lat: -66.6628,
    lon: 140.0014,
    elevationM: 43,
    seasonality: 'year-round',
    establishedYear: 1956,
    maxCapacity: 90,
    summary: {
      en: 'Coastal Adélie Land station famous for emperor penguin colonies and extreme katabatic wind gusts exceeding 320 km/h rushing off the East Antarctic plateau.',
      'zh-CN': '位于东南极阿黛利地海岸佩特雷尔岛，紧邻帝企鹅繁殖地，以高原倾泻而下、极值超过 320 km/h 的狂暴下降风闻名于世。',
      'zh-TW': '位於東南極阿黛利地海岸佩特雷爾島，緊鄰帝企鵝棲息地，以高原傾瀉而下、極值超過 320 km/h 的猛烈下降風聞名。',
      'yue-Hant': '位於阿黛利地海岸，隔離就有大群帝企鵝聚居，同時亦係全地球下降風最猛烈嘅地方之一，陣風紀錄超過每小時 320 公里。',
      pt: 'Estação costeira na Terra Adélia famosa pelas colônias de pinguins-imperadores e rajadas catabáticas extremas acima de 320 km/h.',
      es: 'Base costera en Tierra Adelia famosa por sus colonias de pingüinos emperador y ráfagas catabáticas récord superiores a 320 km/h.'
    },
    sourceUrl: 'https://amrdc.ssec.wisc.edu/'
  },
  {
    id: 'syowa',
    code: 'SYO',
    name: {
      en: 'Syowa Station',
      'zh-CN': '昭和站',
      'zh-TW': '昭和站',
      'yue-Hant': '日本昭和極光科考站',
      pt: 'Estação Syowa',
      es: 'Estación Syowa'
    },
    countryCode: 'JP',
    countryName: {
      en: 'Japan',
      'zh-CN': '日本',
      'zh-TW': '日本',
      'yue-Hant': '日本',
      pt: 'Japão',
      es: 'Japón'
    },
    region: 'east-antarctica',
    lat: -69.0044,
    lon: 39.5819,
    elevationM: 29,
    seasonality: 'year-round',
    establishedYear: 1957,
    maxCapacity: 110,
    summary: {
      en: 'Situated directly beneath the auroral oval on East Ongul Island (Queen Maud Land), serving as a premier upper-atmosphere radar and geomagnetic observatory.',
      'zh-CN': '位于毛德皇后地吕佐夫-霍尔姆湾东翁古尔岛，正处南极光椭圆带下方，是全球极区中高层大气雷达与地磁观测重镇。',
      'zh-TW': '位於毛德皇后地呂佐夫-霍爾姆灣東翁古爾島，正處南極光橢圓帶下方，為極區高層大氣雷達與地磁觀測重鎮。',
      'yue-Hant': '正正起喺南極光橢圓帶底下嘅東翁古爾島，一到冬天夜晚抬頭就係漫天極光，係觀測高層大氣同地磁場嘅頂級基地。',
      pt: 'Localizada sob a oval auroral na Ilha Ongul Oriental (Terra da Rainha Maud), referência em radar atmosférico e geomagnetismo.',
      es: 'Situada bajo el óvalo auroral en la Isla Ongul Oriental (Tierra de la Reina Maud), centro clave de radar atmosférico y geomagnetismo.'
    },
    sourceUrl: 'https://www.comnap.aq/antarctic-facilities-information'
  },
  {
    id: 'neumayer-iii',
    code: 'NEU',
    name: {
      en: 'Neumayer Station III',
      'zh-CN': '诺伊迈尔三号科考站',
      'zh-TW': '諾伊邁爾三號科考站',
      'yue-Hant': '德國諾伊邁爾三號液壓高腳科考站',
      pt: 'Estação Neumayer III',
      es: 'Estación Neumayer III'
    },
    countryCode: 'DE',
    countryName: {
      en: 'Germany',
      'zh-CN': '德国',
      'zh-TW': '德國',
      'yue-Hant': '德國',
      pt: 'Alemanha',
      es: 'Alemanha'
    },
    region: 'east-antarctica',
    lat: -70.675,
    lon: -8.2667,
    elevationM: 43,
    seasonality: 'year-round',
    establishedYear: 2009,
    maxCapacity: 60,
    summary: {
      en: 'Alfred Wegener Institute station elevated on 16 hydraulic legs above the Ekström Ice Shelf so it can jack itself upward above annual snow accumulation.',
      'zh-CN': '德国阿尔弗雷德·魏格纳研究所建造于埃克斯特伦冰架上的工程杰作，依靠 16 根液压支柱每年主动抬升以抵消积雪掩埋。',
      'zh-TW': '德國阿爾弗雷德·魏格納研究所建於埃克斯特倫冰架上的工程傑作，依靠 16 根液壓支柱每年主動抬升以防止暴雪掩埋。',
      'yue-Hant': '德國起喺冰架上面嘅高科技基地，成棟樓用 16 條液壓大長腳撐起，每年落完大雪都可以自己升高成棟建築唔怕俾雪埋住。',
      pt: 'Estação do Instituto Alfred Wegener apoiada em 16 pilares hidráulicos sobre a Plataforma de Gelo Ekström contra o acúmulo anual de neve.',
      es: 'Estación del Instituto Alfred Wegener elevada sobre 16 pilares hidráulicos en la Barrera de Hielo Ekström para superar la acumulación nívea.'
    },
    sourceUrl: 'https://www.comnap.aq/antarctic-facilities-information'
  }
];
