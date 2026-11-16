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
  }
];
