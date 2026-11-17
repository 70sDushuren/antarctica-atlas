import type {
  ChronicleAct,
  ExpeditionCorridor,
  HistoricExpeditionTrack,
  HistoricMonument
} from '@/lib/types';

export const EXPEDITION_CORRIDORS: ExpeditionCorridor[] = [
  {
    id: 'peninsula-weddell',
    isDefaultPinned: true,
    name: {
      en: 'Ushuaia → Drake Passage → Antarctic Peninsula → Weddell Sea',
      'zh-CN': '乌斯怀亚 → 德雷克海峡 → 南设得兰群岛 → 南极半岛 → 威德尔海',
      'zh-TW': '烏斯懷亞 → 德雷克海峽 → 南設得蘭群島 → 南極半島 → 威德爾海',
      'yue-Hant': '烏斯懷亞 → 德雷克海峽 → 南設得蘭群島 → 南極半島 → 威德爾海',
      pt: 'Ushuaia → Passagem de Drake → Península Antártica → Mar de Weddell',
      es: 'Ushuaia → Pasaje de Drake → Península Antártica → Mar de Weddell'
    },
    durationDays: '12–16',
    distanceNauticalMiles: 2150,
    summary: {
      en: 'Classic expedition corridor crossing the Antarctic Convergence into volcanic calderas, glacial fjords, Antarctic Sound tabular icebergs, and Heroic Age survival landmarks in the Weddell Sea.',
      'zh-CN': '经典深度极地航线：从火地岛乌斯怀亚跨越西风漂流与南极辐合带，深入欺骗岛破火山口、利马水道冰川峡湾，并穿越南极海峡直抵巨型桌状冰山密布的威德尔海与“英雄时代”求生遗址区。',
      'zh-TW': '經典深度極地航線：從火地島烏斯懷亞跨越西風漂流與南極輻合帶，深入欺騙島破火山口、利馬水道冰川峽灣，並穿越特里尼蒂半島海峽直抵桌狀冰山密布的威德爾海遺址區。',
      'yue-Hant': '最經典嘅深度南極航線：由烏斯懷亞出發過咗德雷克海峽之後，一路睇盡欺騙島活火山口、利馬水道冰川，再穿入去滿佈巨型平頂冰山嘅威德爾海同埋當年探險家越冬石屋。',
      pt: 'Corredor clássico cruzando a Convergência Antártica rumo a caldeiras vulcânicas, fiordes glaciais e os icebergs tabulares e sítios históricos do Mar de Weddell.',
      es: 'Corredor clásico que cruza la Convergencia Antártica hacia calderas volcánicas, fiordos glaciares y los témpanos tabulares e hitos históricos del Mar de Weddell.'
    },
    waypoints: [
      {
        id: 'ushuaia',
        name: {
          en: 'Ushuaia (Beagle Channel Gateway)',
          'zh-CN': '乌斯怀亚（比格尔水道出发港）',
          'zh-TW': '烏斯懷亞（比格爾水道出發港）',
          'yue-Hant': '烏斯懷亞（比格爾水道出發港）',
          pt: 'Ushuaia (Portal do Canal de Beagle)',
          es: 'Ushuaia (Puerto del Canal Beagle)'
        },
        lat: -54.8019,
        lon: -68.303,
        category: 'gateway',
        highlight: {
          en: 'Southernmost expedition port in Tierra del Fuego, Argentina; biosecurity boot-scrubbing & vessel briefing.',
          'zh-CN': '阿根廷火地岛世界最南端极地母港，登船前执行严格的 IAATO 外来物种生物安全洗消与防风浪简报。',
          'zh-TW': '阿根廷火地島世界最南端極地母港，登船前執行嚴格的 IAATO 生物安全清潔與航前簡報。',
          'yue-Hant': '阿根廷火地島最南端嘅南極船出發碼頭，上船前要做足 IAATO 鞋底消毒確保唔會帶外來種子入南極。',
          pt: 'Porto de expedição mais austral na Terra do Fogo, Argentina, com rigorosa biossegurança IAATO.',
          es: 'Puerto antártico más austral en Tierra del Fuego, Argentina, con protocolo de bioseguridad IAATO.'
        }
      },
      {
        id: 'drake-passage-mid',
        name: {
          en: 'Drake Passage & Antarctic Convergence',
          'zh-CN': '德雷克海峡与南极辐合带核心区',
          'zh-TW': '德雷克海峽與南極輻合帶核心區',
          'yue-Hant': '德雷克海峽同埋南極輻合帶中線',
          pt: 'Passagem de Drake e Convergência Antártica',
          es: 'Pasaje de Drake y Convergencia Antártica'
        },
        lat: -58.5,
        lon: -64.0,
        category: 'passage',
        highlight: {
          en: 'Antarctic Circumpolar Current bottleneck where cold polar waters plunge beneath sub-Antarctic seas.',
          'zh-CN': '南极绕极流最窄咽喉水道，冷暖洋流交汇带来海水温度骤降与漂泊信天翁伴飞。',
          'zh-TW': '南極繞極流最窄咽喉水道，冷暖洋流交匯帶來海溫驟降與海鳥聚集。',
          'yue-Hant': '南極繞極流最窄嘅風浪關口，過咗呢條冷暖水交界線水溫即跌，仲有翼展三米幾嘅漂泊信天翁跟住隻船飛。',
          pt: 'Estreito da Corrente Circumpolar Antártica onde águas polares encontram mares subantárticos.',
          es: 'Estrecho de la Corriente Circumpolar Antártica donde convergen aguas polares y subantárticas.'
        }
      },
      {
        id: 'king-george-great-wall',
        name: {
          en: 'King George Island (Great Wall HSM-86 & Ferraz)',
          'zh-CN': '乔治王岛（长城站 HSM-86 / 弗雷站 / 费拉斯司令站）',
          'zh-TW': '喬治王島（長城站 HSM-86 / 佛雷站 / 費拉斯司令站）',
          'yue-Hant': '喬治王島科考站群（長城站 HSM-86 同費拉斯站）',
          pt: 'Ilha Rei George (Estações Comandante Ferraz e Grande Muralha)',
          es: 'Isla 25 de Mayo / Rey Jorge (Bases Frei, Gran Muralla y Ferraz)'
        },
        lat: -62.2163,
        lon: -58.9622,
        category: 'station',
        highlight: {
          en: 'South Shetland multinational research hub hosting 10+ national stations and海-air logistics.',
          'zh-CN': '南设得兰群岛国际科考密度最高岛屿，汇聚十余国常年科考站与海空联运走廊。',
          'zh-TW': '南設得蘭群島國際科考最密集島嶼，匯聚十餘國常年科考站與海空聯運樞紐。',
          'yue-Hant': '南設得蘭群島最多國家設站嘅地方，好似地球村咁聚齊中、智、巴、俄、韓等十幾個科考基地。',
          pt: 'Principal polo científico multinacional das Ilhas Shetland do Sul.',
          es: 'Principal polo científico multinacional de las Islas Shetland del Sur.'
        }
      },
      {
        id: 'deception-island',
        name: {
          en: 'Deception Island Caldera (South Shetland Is.)',
          'zh-CN': '欺骗岛破火山口（南设得兰群岛）',
          'zh-TW': '欺騙島破火山口（南設得蘭群島）',
          'yue-Hant': '欺騙島火山口內灣（南設得蘭群島）',
          pt: 'Caldeira da Ilha Decepção (Shetland do Sul)',
          es: 'Caldera de Isla Decepción (Shetland del Sur)'
        },
        lat: -62.978,
        lon: -60.652,
        category: 'landing',
        highlight: {
          en: 'Flooded active volcanic caldera entered via narrow Neptune’s Bellows; site of historic Whalers Bay (HSM-71).',
          'zh-CN': '海水灌入的马蹄形活火山口，经狭窄“海神风箱”航道驶入捕鲸人湾遗址（HSM-71）。',
          'zh-TW': '海水灌入的馬蹄形活火山口，經狹窄「海神風箱」航道駛入捕鯨人灣遺址（HSM-71）。',
          'yue-Hant': '成隻船穿過好窄嘅「海神風箱」直入活火山口內灣，岸邊仲有地熱蒸氣同捕鯨站遺址（HSM-71）。',
          pt: 'Caldeira vulcânica ativa inundada pelo mar, acessada pelos Foles de Netuno (HSM-71).',
          es: 'Caldera volcánica activa inundada por el mar con acceso por los Fuelles de Neptuno (HSM-71).'
        }
      },
      {
        id: 'port-lockroy-lemaire',
        name: {
          en: 'Port Lockroy (HSM-61) & Lemaire Channel',
          'zh-CN': '洛克罗伊港（HSM-61）与利马水道',
          'zh-TW': '洛克羅伊港（HSM-61）與利馬水道',
          'yue-Hant': '洛克羅伊港郵局（HSM-61）同利馬水道',
          pt: 'Porto Lockroy (HSM-61) e Canal Lemaire',
          es: 'Puerto Lockroy (HSM-61) y Canal Lemaire'
        },
        lat: -64.825,
        lon: -63.494,
        category: 'heritage',
        highlight: {
          en: '1944 Operation Tabarin Base A museum/post office paired with sheer 1,000 m granite cliffs along Lemaire Channel.',
          'zh-CN': '1944 年英国“塔巴林行动”A 基地历史博物馆（南极邮局）与两侧千米花岗岩绝壁夹峙的利马水道。',
          'zh-TW': '1944 年英國「塔巴林行動」A 基地歷史博物館（南極郵局）與兩側千公尺花崗岩絕壁夾峙的利馬水道。',
          'yue-Hant': '1944 年起落嘅英國歷史基地兼南極郵局，附近仲有兩邊成千米高花崗岩峭壁倒映喺水面嘅利馬水道。',
          pt: 'Base histórica britânica de 1944 (correio polar) próxima aos paredões de granito do Canal Lemaire.',
          es: 'Base histórica británica de 1944 (correo austral) junto a los acantilados graníticos del Canal Lemaire.'
        }
      },
      {
        id: 'paulet-weddell',
        name: {
          en: 'Antarctic Sound, Paulet Island (HSM-41) & Weddell Pack Ice',
          'zh-CN': '南极海峡、威德尔海保莱特岛（HSM-41）与坚忍号外缘海域',
          'zh-TW': '南極海峽、威德爾海保萊特島（HSM-41）與堅忍號外緣海域',
          'yue-Hant': '南極海峽、威德爾海保萊特島石屋（HSM-41）同平頂大冰山群',
          pt: 'Estreito Antártico, Ilha Paulet (HSM-41) e Mar de Weddell',
          es: 'Estrecho Antártico, Isla Paulet (HSM-41) y Mar de Weddell'
        },
        lat: -63.58,
        lon: -55.78,
        category: 'heritage',
        highlight: {
          en: 'Gateway to colossal tabular icebergs of the Weddell Gyre, preserving the 1903 Nordenskjöld stone survival hut (HSM-41) and 100,000+ breeding pairs of Adélie penguins.',
          'zh-CN': '进入威德尔海巨型桌状冰山群的门户，完整留存 1903 年瑞典探险队沉船求生石屋（HSM-41）与逾十万对阿德利企鹅栖息地。',
          'zh-TW': '進入威德爾海巨型桌狀冰山群的門戶，留存 1903 年瑞典探險隊沉船求生石屋（HSM-41）與逾十萬對阿德利企鵝棲息地。',
          'yue-Hant': '轉入威德爾海即刻見到一座座好似航空母艦咁大嘅平頂冰山，岸上留低咗 1903 年瑞典探險隊砌石過冬嘅求生屋（HSM-41）同十幾萬對阿德利企鵝。',
          pt: 'Portal dos imensos icebergs tabulares do Mar de Weddell, com a cabana de pedra de 1903 (HSM-41) e mais de 100 mil casais de pinguins-de-adélia.',
          es: 'Puerta a los gigantescos témpanos tabulares del Mar de Weddell, con la cabaña de piedra de 1903 (HSM-41) y más de 100.000 parejas de pingüinos Adelia.'
        }
      }
    ],
    sourceUrl: 'https://iaato.org/visiting-antarctica/visitor-guidelines-library'
  },
  {
    id: 'ross-sea-heritage',
    name: {
      en: 'Hobart / Bluff → Cape Adare → Terra Nova Bay → Ross Island Huts',
      'zh-CN': '霍巴特/布拉夫 → 阿代尔角 → 特拉诺瓦湾 → 罗斯岛探险木屋走廊',
      'zh-TW': '霍巴特/布拉夫 → 阿代爾角 → 特拉諾瓦灣 → 羅斯島探險木屋走廊',
      'yue-Hant': '霍巴特/布拉夫 → 阿代爾角 → 特拉諾瓦灣 → 羅斯島探險木屋航線',
      pt: 'Hobart / Bluff → Cabo Adare → Baía Terra Nova → Cabanas da Ilha de Ross',
      es: 'Hobart / Bluff → Cabo Adare → Bahía Terra Nova → Cabañas de Isla de Ross'
    },
    durationDays: '22–28',
    distanceNauticalMiles: 4600,
    summary: {
      en: 'Deep-south expedition crossing 180° meridian into the Ross Ice Shelf front, visiting Borchgrevink’s 1899 hut (HSM-22), Qinling Station, Shackleton’s hut (HSM-15), and Scott’s hut (HSM-16).',
      'zh-CN': '深入南纬 77° 罗斯冰架前缘的远征走廊，跨越 180° 经线探访阿代尔角（HSM-22）、难言岛（秦岭站）以及沙克尔顿（HSM-15）与斯科特（HSM-16）百年探险木屋。',
      'zh-TW': '深入南緯 77° 羅斯冰架前緣的遠征走廊，跨越 180° 經線探訪阿代爾角（HSM-22）、難言島與沙克爾頓（HSM-15）、斯科特（HSM-16）百年探險木屋。',
      'yue-Hant': '直入南緯 77 度羅斯冰架邊緣嘅遠征航線，跨過 180 度經線去睇難言島同埋沙克爾頓（HSM-15）、斯科特（HSM-16）百幾年前留低嘅探險木屋。',
      pt: 'Expedição ao extremo sul cruzando o meridiano 180° até a Plataforma de Gelo Ross e as cabanas históricas HSM-15, HSM-16 e HSM-22.',
      es: 'Expedición al extremo sur cruzando el meridiano 180° hasta la Barrera de Hielo de Ross y las cabañas históricas HSM-15, HSM-16 y HSM-22.'
    },
    waypoints: [
      {
        id: 'cape-adare',
        name: {
          en: 'Cape Adare (HSM-22)',
          'zh-CN': '阿代尔角（HSM-22 首次越冬木屋）',
          'zh-TW': '阿代爾角（HSM-22 首次越冬木屋）',
          'yue-Hant': '阿代爾角（HSM-22 人類首次南極過冬木屋）',
          pt: 'Cabo Adare (HSM-22)',
          es: 'Cabo Adare (HSM-22)'
        },
        lat: -71.3,
        lon: 170.2,
        category: 'heritage',
        highlight: {
          en: '1899 Southern Cross Expedition huts — humanity’s first overwintering buildings on the Antarctic continent.',
          'zh-CN': '1899 年“南十字星号”探险队木屋，人类历史上首批在南极大陆越冬的建筑。',
          'zh-TW': '1899 年「南十字星號」探險隊木屋，人類歷史上首批在南極大陸越冬的建築。',
          'yue-Hant': '1899 年起好嘅探險木屋，係人類歷史上第一次喺南極大陸捱過寒冬嘅建築物。',
          pt: 'Cabanas de 1899 da Expedição Southern Cross — primeiras edificações de invernada no continente.',
          es: 'Cabañas de 1899 de la Expedición Southern Cross — primeras construcciones de invernada continental.'
        }
      },
      {
        id: 'terra-nova-inexpressible',
        name: {
          en: 'Terra Nova Bay & Inexpressible Island (Qinling & HSM-14)',
          'zh-CN': '特拉诺瓦湾与恩克斯堡岛/难言岛（秦岭站与 HSM-14 冰洞）',
          'zh-TW': '特拉諾瓦灣與恩克斯堡島/難言島（秦嶺站與 HSM-14 冰洞）',
          'yue-Hant': '特拉諾瓦灣難言島（中國秦嶺站同 HSM-14 過冬雪洞）',
          pt: 'Baía Terra Nova e Ilha Inexpressible (Qinling e HSM-14)',
          es: 'Bahía Terra Nova e Isla Inexpresable (Qinling y HSM-14)'
        },
        lat: -74.9344,
        lon: 163.7147,
        category: 'station',
        highlight: {
          en: 'Katabatic-swept coastal polynya combining modern polar architecture (Qinling Station, 2024) with Scott’s Northern Party survival site (HSM-14).',
          'zh-CN': '强下降风吹开的沿岸冰间湖，现代极地工程（2024 年建成秦岭站）与 1912 年斯科特北路队雪洞求生遗址（HSM-14）在此交汇。',
          'zh-TW': '強下降風維持的沿岸冰間湖，現代極地科考（秦嶺站）與 1912 年斯科特北路隊求生遺址（HSM-14）於此交會。',
          'yue-Hant': '下降風長年吹開海冰形成不凍冰間湖，呢度同時見到最新落成嘅中國秦嶺站同埋百幾年前探險家掘雪洞保命嘅遺址（HSM-14）。',
          pt: 'Polínia costeira unindo a moderna Estação Qinling (2024) ao abrigo histórico de sobrevivência de 1912 (HSM-14).',
          es: 'Polinia costera que une la moderna Base Qinling (2024) con el sitio histórico de supervivencia de 1912 (HSM-14).'
        }
      },
      {
        id: 'ross-180-meridian',
        name: {
          en: 'Ross Ice Shelf Front & 180° Meridian Crossing',
          'zh-CN': '罗斯冰架垂直冰崖与 180° 国际日期变更线航段',
          'zh-TW': '羅斯冰架垂直冰崖與 180° 經線跨越航段',
          'yue-Hant': '羅斯冰架五十米高大冰牆同 180° 經線跨越位',
          pt: 'Frente da Plataforma de Gelo Ross e Meridiano 180°',
          es: 'Frente de la Barrera de Hielo de Ross y Meridiano 180°'
        },
        lat: -77.4,
        lon: -179.8,
        category: 'passage',
        highlight: {
          en: 'Cruising along the 50 m sheer ice wall where East and West longitudes meet across the Ross Sea.',
          'zh-CN': '沿高出海面 50 米的壮观罗斯冰架前缘巡航，无缝跨越东经 180° 与西经 180° 交界。',
          'zh-TW': '沿高出海面 50 公尺的壯觀羅斯冰架前緣巡航，無縫跨越東經與西經 180° 交界線。',
          'yue-Hant': '貼住成五十米高嘅羅斯冰架垂直大冰牆行船，直接跨過東經同西經 180 度交界。',
          pt: 'Navegação junto ao paredão de 50 m de gelo onde se encontram as longitudes Leste e Oeste.',
          es: 'Navegación junto a la muralla de hielo de 50 m en la unión de las longitudes Este y Oeste.'
        }
      },
      {
        id: 'ross-island-huts',
        name: {
          en: 'Ross Island: Mt. Erebus, Cape Royds & Cape Evans (HSM-15 / HSM-16)',
          'zh-CN': '罗斯岛：埃里伯斯火山、罗伊兹角与埃文斯角木屋（HSM-15 / HSM-16）',
          'zh-TW': '羅斯島：埃里伯斯火山、羅伊茲角與埃文斯角木屋（HSM-15 / HSM-16）',
          'yue-Hant': '羅斯島：埃里伯斯活火山同沙克爾頓、斯科特木屋（HSM-15 / HSM-16）',
          pt: 'Ilha de Ross: Monte Erebus, Cabo Royds e Cabo Evans (HSM-15 / HSM-16)',
          es: 'Isla de Ross: Monte Erebus, Cabo Royds y Cabo Evans (HSM-15 / HSM-16)'
        },
        lat: -77.636,
        lon: 166.417,
        category: 'heritage',
        highlight: {
          en: 'Preserved time-capsule expedition bases of Sir Ernest Shackleton (1908) and Capt. Robert Falcon Scott (1911) beneath steaming Mount Erebus.',
          'zh-CN': '背靠喷烟的埃里伯斯活火山，完好保存着沙克尔顿（1908）与斯科特（1911）冲击南极点的百年木屋大本营。',
          'zh-TW': '背靠埃里伯斯活火山，如時光膠囊般完好保存的沙克爾頓（1908）與斯科特（1911）衝擊南極點大本營。',
          'yue-Hant': '後面係噴緊白煙嘅埃里伯斯活火山，入面啲罐頭同科研儀器原封不動留咗百幾年，好似時光膠囊咁紀錄住當年衝刺南極點嘅歷史。',
          pt: 'Bases preservadas como cápsulas do tempo de Ernest Shackleton (1908) e Robert Falcon Scott (1911) sob o Monte Erebus.',
          es: 'Bases conservadas como cápsulas del tiempo de Ernest Shackleton (1908) y Robert Falcon Scott (1911) bajo el Monte Erebus.'
        }
      }
    ],
    sourceUrl: 'https://ukaht.org/latest-news/historic-sites-and-monuments-in-antarctica/'
  },
  {
    id: 'interior-south-pole',
    name: {
      en: 'Punta Arenas → Union Glacier → Geographic South Pole (90°S)',
      'zh-CN': '蓬塔阿雷纳斯 → 联合冰川营地 → 地理南极点（90°S）',
      'zh-TW': '蓬塔阿雷納斯 → 聯合冰川營地 → 地理南極點（90°S）',
      'yue-Hant': '蓬塔阿雷納斯 → 聯合冰川營地 → 地理南極點（90°S）',
      pt: 'Punta Arenas → Geleira Union → Polo Sul Geográfico (90°S)',
      es: 'Punta Arenas → Glaciar Unión → Polo Sur Geográfico (90°S)'
    },
    durationDays: '7–10',
    distanceNauticalMiles: 2300,
    summary: {
      en: 'Airborne inland polar route flying from Chilean Patagonia to the blue-ice runway of the Ellsworth Mountains before ascending the high Polar Plateau to 90°S.',
      'zh-CN': '内陆航空考察走廊：自智利蓬塔阿雷纳斯飞抵埃尔斯沃思山脉联合冰川蓝冰跑道，再跃升至海拔 2,835 米的地理南极点高原。',
      'zh-TW': '內陸航空考察走廊：自智利蓬塔阿雷納斯飛抵埃爾斯沃思山脈聯合冰川藍冰跑道，再躍升至海拔 2,835 公尺的地理南極點高原。',
      'yue-Hant': '內陸飛機探險路線：由智利蓬塔阿雷納斯直飛埃爾斯沃思山脈天然藍冰跑道，再轉雪橇飛機飛上 90 度地理南極點高原。',
      pt: 'Rota aérea interior voando da Patagônia chilena até a pista de gelo azul dos Montes Ellsworth rumo ao Polo Sul Geográfico (90°S).',
      es: 'Ruta aérea interior desde la Patagonia chilena hasta la pista de hielo azul de los Montes Ellsworth hacia el Polo Sur Geográfico (90°S).'
    },
    waypoints: [
      {
        id: 'punta-arenas-gateway',
        name: {
          en: 'Punta Arenas (Strait of Magellan Air Gateway)',
          'zh-CN': '蓬塔阿雷纳斯（麦哲伦海峡极地航空门户）',
          'zh-TW': '蓬塔阿雷納斯（麥哲倫海峽極地航空門戶）',
          'yue-Hant': '蓬塔阿雷納斯（智利麥哲倫海峽極地航空總站）',
          pt: 'Punta Arenas (Portal Aéreo do Estreito de Magalhães)',
          es: 'Punta Arenas (Puerta Aérea del Estrecho de Magallanes)'
        },
        lat: -53.1638,
        lon: -70.9171,
        category: 'gateway',
        highlight: {
          en: 'Historic Chilean staging city where Shackleton organized his 1916 rescue of the Elephant Island crew aboard the Yelcho.',
          'zh-CN': '智利南部历史名城，1916 年沙克尔顿正是自此搭乘智利海军“耶尔乔号”成功救出象岛全部 22 名受困船员。',
          'zh-TW': '智利南部極地門戶城市，1916 年沙克爾頓即由此搭乘智利「耶爾喬號」出發救回象島 22 名受困船員。',
          'yue-Hant': '智利南部出發重鎮，1916 年沙克爾頓就係喺呢度借到智利海軍「耶爾喬號」衝返去象島救出晒廿二個兄弟。',
          pt: 'Cidade histórica chilena de onde Shackleton partiu no vapor Yelcho em 1916 para resgatar seus homens na Ilha Elefante.',
          es: 'Histórico puerto chileno desde donde Shackleton y el piloto Luis Pardo zarparon en la escampavía Yelcho en 1916 rumbo a Isla Elefante.'
        }
      },
      {
        id: 'union-glacier',
        name: {
          en: 'Union Glacier Blue-Ice Camp & Vinson Massif',
          'zh-CN': '联合冰川蓝冰营地与文森峰（埃尔斯沃思山脉）',
          'zh-TW': '聯合冰川藍冰營地與文森峰（埃爾斯沃思山脈）',
          'yue-Hant': '聯合冰川天然藍冰跑道同南極最高峰文森峰',
          pt: 'Acampamento de Gelo Azul Union Glacier e Maciço Vinson',
          es: 'Campamento Glaciar Unión y Macizo Vinson'
        },
        lat: -79.768,
        lon: -82.856,
        category: 'landing',
        highlight: {
          en: 'Natural katabatic-swept blue-ice runway near Vinson Massif (4,892 m, Antarctica’s highest peak).',
          'zh-CN': '天然下降风吹蚀形成的坚硬蓝冰跑道，毗邻南极洲最高峰文森峰（海拔 4,892 米）。',
          'zh-TW': '天然下降風吹蝕形成的藍冰跑道，毗鄰南極洲最高峰文森峰（海拔 4,892 公尺）。',
          'yue-Hant': '靠強勁下降風吹走積雪形成嘅天然堅硬藍冰跑道，重型運輸機都降落到，隔離就係成座南極最高嘅文森峰（4,892 米）。',
          pt: 'Pista natural de gelo azul próxima ao Maciço Vinson (4.892 m, ponto mais alto da Antártida).',
          es: 'Pista natural de hielo azul cercana al Macizo Vinson (4.892 m, cumbre más alta de la Antártida).'
        }
      },
      {
        id: 'south-pole-90s',
        name: {
          en: 'Geographic South Pole (90°S · HSM-1 & Amundsen-Scott)',
          'zh-CN': '地理南极点（90°S · 仪式极点标志 HSM-1 与南极点站）',
          'zh-TW': '地理南極點（90°S · 儀式極點標誌 HSM-1 與南極點站）',
          'yue-Hant': '90°S 地理南極點（地球所有經線匯聚點 · HSM-1）',
          pt: 'Polo Sul Geográfico (90°S · Marco HSM-1 e Estação Amundsen-Scott)',
          es: 'Polo Sur Geográfico (90°S · Hito HSM-1 y Base Amundsen-Scott)'
        },
        lat: -90.0,
        lon: 0.0,
        category: 'station',
        highlight: {
          en: 'Convergence of all 360° of Earth’s meridians atop 2,835 m of slow-moving plateau ice (drifting ~10 m/year toward the Weddell Sea).',
          'zh-CN': '地球全部 360° 经线交汇之巅，坐落于海拔 2,835 米冰盖上（冰层每年向威德尔海方向缓慢漂移约 10 米，每年元旦需重新标定真实地理极点桩）。',
          'zh-TW': '地球全部 360° 經線交會處，位於海拔 2,835 公尺冰原（冰層每年移動約 10 公尺，每年元旦均重新校準極點標記）。',
          'yue-Hant': '全地球所有經線聚埋一點嘅盡頭，一步就可以跨過晒所有時區；因為腳下兩千八百幾米厚嘅冰每年會郁十米左右，所以每年元旦都要重新插過支真南極點標記柱。',
          pt: 'Convergência de todos os meridianos terrestres sobre 2.835 m de gelo que desliza cerca de 10 m por ano.',
          es: 'Convergencia de todos los meridianos terrestres sobre 2.835 m de hielo que se desplaza unos 10 m cada año.'
        }
      }
    ],
    sourceUrl: 'https://www.pgc.umn.edu/data/rema/'
  }
];

export const FEATURED_HISTORIC_MONUMENTS: HistoricMonument[] = [
  {
    id: 'hsm-93-endurance',
    hsmCode: 'HSM-93',
    title: {
      en: 'Wreck of Sir Ernest Shackleton’s Vessel Endurance (Weddell Sea)',
      'zh-CN': '沙克尔顿爵士“坚忍号”沉船遗址（威德尔海深海）',
      'zh-TW': '沙克爾頓爵士「堅忍號」沉船遺址（威德爾海深海）',
      'yue-Hant': '沙克爾頓爵士「堅忍號」三千米海底沉船遺址（威德爾海）',
      pt: 'Naufrágio do Navio Endurance de Ernest Shackleton (Mar de Weddell)',
      es: 'Pecio del Buque Endurance de Sir Ernest Shackleton (Mar de Weddell)'
    },
    era: 'modern-stewardship',
    year: 1915,
    lat: -68.74,
    lon: -52.33,
    proposingParties: 'United Kingdom',
    summary: {
      en: 'Crushed by Weddell Sea pack ice in November 1915 during the Imperial Trans-Antarctic Expedition and rediscovered upright at 3,008 m depth in March 2022 with a 1,500 m protection perimeter.',
      'zh-CN': '1915 年 11 月在大英帝国横穿南极探险中被威德尔海浮冰挤压沉没（全员 28 人史诗生还），2022 年 3 月于水下 3,008 米处完好重现并划定半径 1,500 米水下文物禁区。',
      'zh-TW': '1915 年 11 月於橫穿南極探險中被威德爾海浮冰擠壓沉沒（全員 28 人奇蹟生還），2022 年 3 月於水下 3,008 公尺處重現並列入受保護遺址。',
      'yue-Hant': '1915 年 11 月俾威德爾海厚浮冰夾爆沉沒，但沙克爾頓帶領全船 28 人奇蹟生還；到 2022 年 3 月喺三千幾米海底搵返隻船尾仲刻住清晰金字嘅完整木船。',
      pt: 'Esmagado pelo gelo do Mar de Weddell em 1915 e redescoberto intacto a 3.008 m de profundidade em 2022 sob proteção integral do Tratado.',
      es: 'Hundido por el hielo del Mar de Weddell en 1915 y hallado intacto a 3.008 m de profundidad en 2022 con perímetro protegido de 1.500 m.'
    },
    sourceUrl: 'https://www.ecfr.gov/current/title-45/subtitle-B/chapter-VI/part-670/subpart-F/section-670.29'
  },
  {
    id: 'hsm-41-paulet',
    hsmCode: 'HSM-41',
    title: {
      en: 'Paulet Island Stone Hut & Cairn (Swedish Expedition 1903)',
      'zh-CN': '保莱特岛石屋与求救石冢（1903 年瑞典南极探险队）',
      'zh-TW': '保萊特島石屋與求救石塚（1903 年瑞典南極探險隊）',
      'yue-Hant': '保萊特島求生石屋同石堆標記（1903 年瑞典南極探險隊）',
      pt: 'Cabana de Pedra da Ilha Paulet (Expedição Sueca de 1903)',
      es: 'Cabaña de Piedra de Isla Paulet (Expedición Sueca de 1903)'
    },
    era: 'heroic-age',
    year: 1903,
    lat: -63.58,
    lon: -55.78,
    proposingParties: 'Argentina / Sweden / United Kingdom',
    summary: {
      en: 'Built in February 1903 from basalt rocks by 20 survivors of the crushed ship Antarctic under Capt. Carl Anton Larsen during Otto Nordenskjöld’s expedition.',
      'zh-CN': '1903 年 2 月诺登舍尔德瑞典南极探险队座船“南极号”冰碎沉没后，拉尔森船长率 20 名船员用玄武岩垒筑越冬并由阿根廷军舰“乌拉圭号”成功营救的历史石屋。',
      'zh-TW': '1903 年 2 月諾登舍爾德瑞典南極探險隊座船「南極號」沉沒後，拉爾森船長率 20 名船員以玄武岩壘築越冬並獲救的歷史石屋。',
      'yue-Hant': '1903 年 2 月「南極號」沉船之後，拉爾森船長帶住廿個船員就地取材用火山玄武岩砌屋捱過嚴冬，最後由阿根廷救援艦「烏拉圭號」救返晒出嚟。',
      pt: 'Construída em fevereiro de 1903 com rochas basálticas pelos 20 sobreviventes do navio Antarctic resgatados pela corveta argentina Uruguay.',
      es: 'Construida en febrero de 1903 con rocas basálticas por los 20 náufragos del Antarctic rescatados por la corbeta argentina ARA Uruguay.'
    },
    sourceUrl: 'https://documents.ats.aq/cep/handbook/List%20of%20HSMs%202010_e.pdf'
  },
  {
    id: 'hsm-53-elephant-island',
    hsmCode: 'HSM-53',
    title: {
      en: 'Point Wild Endurance Camp & Bust of Piloto Pardo (Elephant Island)',
      'zh-CN': '象岛怀尔德角“坚忍号”绝境营地与智利帕尔多船长纪念像',
      'zh-TW': '象島懷爾德角「堅忍號」求生營地與帕爾多船長紀念像',
      'yue-Hant': '象島懷爾德角廿二人反轉木艇過冬營地同帕爾多船長銅像',
      pt: 'Ponta Wild: Acampamento do Endurance e Busto do Piloto Pardo (Ilha Elefante)',
      es: 'Punta Wild: Campamento del Endurance y Busto del Piloto Pardo (Isla Elefante)'
    },
    era: 'heroic-age',
    year: 1916,
    lat: -61.1,
    lon: -54.83,
    proposingParties: 'Chile',
    summary: {
      en: 'Narrow wave-lashed spit where Frank Wild kept 22 Endurance men alive beneath two upturned lifeboats for 4.5 months until Shackleton and Chilean Capt. Luis Pardo rescued them on 30 Aug 1916.',
      'zh-CN': '狭窄险峻的碎石海岬：副队长弗兰克·怀尔德在此率 22 名船员将两艘救生艇倒扣为屋坚守四个半月，直至 1916 年 8 月 30 日沙克尔顿与智利海军帕尔多船长乘“耶尔乔号”奇迹接回全员。',
      'zh-TW': '狹窄險峻的海岬：副隊長懷爾德率 22 名船員倒扣兩艘救生艇棲身四個半月，直至 1916 年 8 月 30 日沙克爾頓與智利帕爾多船長成功救援全員。',
      'yue-Hant': '窄到幾乎俾大浪淹過嘅石灘：當年沙克爾頓坐細艇出海求救之後，副隊長懷爾德帶住留低嘅 22 個船員將兩隻救生艇反轉蓋住頭頂捱足四個半月，直到 1916 年 8 月底智利帕爾多船長揸船衝破浮冰救走晒全部人。',
      pt: 'Estreita ponta rochosa onde 22 tripulantes do Endurance sobreviveram sob dois botes virados até o resgate histórico pelo Piloto Luis Pardo em agosto de 1916.',
      es: 'Angosta punta rocosa donde 22 hombres del Endurance resistieron cuatro meses y medio bajo dos botes invertidos hasta el heroico rescate del Piloto Luis Pardo el 30 de agosto de 1916.'
    },
    sourceUrl: 'https://www.ecfr.gov/current/title-45/subtitle-B/chapter-VI/part-670/subpart-F/section-670.29'
  },
  {
    id: 'hsm-61-port-lockroy',
    hsmCode: 'HSM-61',
    title: {
      en: 'Port Lockroy Base A Living Museum & Penguin Post Office',
      'zh-CN': '洛克罗伊港英国 A 基地历史博物馆（南极企鹅邮局）',
      'zh-TW': '洛克羅伊港英國 A 基地歷史博物館（南極企鵝郵局）',
      'yue-Hant': '洛克羅伊港 1944 歷史基地博物館兼南極企鵝郵局',
      pt: 'Porto Lockroy Base A — Museu Histórico e Correio Antártico',
      es: 'Puerto Lockroy Base A — Museo Histórico y Correo Austral'
    },
    era: 'treaty-igy',
    year: 1944,
    lat: -64.825,
    lon: -63.494,
    proposingParties: 'United Kingdom',
    summary: {
      en: 'Established on Goudier Island in Feb 1944 during wartime Operation Tabarin for meteorology and ionospheric research; restored in 1996 by UKAHT.',
      'zh-CN': '1944 年 2 月二战“塔巴林行动”期间建于古迪尔岛，是英国在南极的首座永久基地，曾开展早期电离层测量，1996 年修复为活态遗产博物馆与最南端邮局。',
      'zh-TW': '1944 年「塔巴林行動」期間建於古迪爾島，曾執行早期極地氣象與電離層觀測，1996 年修復為活態歷史博物館與極地郵局。',
      'yue-Hant': '1944 年二戰期間起喺古迪爾島嘅英國首座南極常駐基地，專門測天氣同電離層，1996 年翻新做歷史博物館兼企鵝郵局，門口就係成群巴布亞企鵝築巢。',
      pt: 'Estabelecida em fevereiro de 1944 na Operação Tabarin para pesquisa meteorológica e ionosférica; restaurada em 1996 como museu vivo.',
      es: 'Establecida en febrero de 1944 durante la Operación Tabarin para estudios meteorológicos e ionosféricos; restaurada en 1996 como museo vivo.'
    },
    sourceUrl: 'https://ukaht.org/latest-news/historic-sites-and-monuments-in-antarctica/'
  },
  {
    id: 'hsm-15-16-ross',
    hsmCode: 'HSM-15 / HSM-16',
    title: {
      en: 'Shackleton’s Nimrod Hut & Scott’s Terra Nova Hut (Ross Island)',
      'zh-CN': '沙克尔顿尼姆罗德木屋与斯科特新地号木屋（罗斯岛）',
      'zh-TW': '沙克爾頓尼姆羅德木屋與斯科特新地號木屋（羅斯島）',
      'yue-Hant': '沙克爾頓同斯科特探險大本營木屋群（羅斯島）',
      pt: 'Cabanas de Shackleton (Nimrod) e Scott (Terra Nova) na Ilha de Ross',
      es: 'Cabañas de Shackleton (Nimrod) y Scott (Terra Nova) en Isla de Ross'
    },
    era: 'heroic-age',
    year: 1911,
    lat: -77.636,
    lon: 166.417,
    proposingParties: 'New Zealand / United Kingdom',
    summary: {
      en: 'Iconic wooden expedition bases at Cape Royds (1908) and Cape Evans (1911) containing thousands of scientific instruments, provisions, and Heroic Age artifacts.',
      'zh-CN': '分别建于罗伊兹角（1908）与埃文斯角（1911）的标志性木结构科考探险基地，封存着上万件百年前的科学仪器、补给罐头与暗房底片遗物。',
      'zh-TW': '分別建於羅伊茲角（1908）與埃文斯角（1911）的標誌性木構探險基地，封存著上萬件百年前的科學儀器與補給遺物。',
      'yue-Hant': '分別喺 1908 同 1911 年起喺羅斯島嘅兩座木屋基地，由於極地又凍又乾，入面成萬件百年前嘅科研儀器、食物罐頭同相片底片都保存得好完整。',
      pt: 'Bases históricas de madeira em Cabo Royds (1908) e Cabo Evans (1911) preservando milhares de artefatos científicos originais.',
      es: 'Bases históricas de madera en Cabo Royds (1908) y Cabo Evans (1911) que preservan miles de instrumentos científicos originales.'
    },
    sourceUrl: 'https://ukaht.org/latest-news/historic-sites-and-monuments-in-antarctica/'
  },
  {
    id: 'hsm-86-great-wall',
    hsmCode: 'HSM-86 / HSM-52',
    title: {
      en: 'No. 1 Building & Monolith at Great Wall Station (King George Island)',
      'zh-CN': '中国南极长城站一号栋与建站纪念碑（乔治王岛）',
      'zh-TW': '中國南極長城站一號棟與建站紀念碑（喬治王島）',
      'yue-Hant': '中國南極長城站第一棟落成主樓同一號紀念碑（喬治王島）',
      pt: 'Edifício Nº 1 e Monólito da Estação Grande Muralha (Ilha Rei George)',
      es: 'Edificio Nº 1 y Monolito de la Base Gran Muralla (Isla Rey Jorge)'
    },
    era: 'treaty-igy',
    year: 1985,
    lat: -62.2163,
    lon: -58.9622,
    proposingParties: 'China',
    summary: {
      en: 'Erected in February 1985 on Fildes Peninsula, marking China’s entry into permanent Antarctic meteorological, glaciological, and ecological research.',
      'zh-CN': '1985 年 2 月落成于乔治王岛菲尔德斯半岛，见证中国正式开启常年南极越冬气象、冰川与高空物理科学考察历程，被《南极条约》协商会议列为受保护历史建筑。',
      'zh-TW': '1985 年 2 月落成於喬治王島菲爾德斯半島，見證中國展開常年南極越冬科學考察歷程，獲列為《南極條約》受保護歷史建築。',
      'yue-Hant': '1985 年 2 月喺喬治王島起好，係中國第一棟常年駐守南極過冬嘅科研建築，見證幾代極地科考隊員嘅開荒歷史，已經正式列入《南極條約》法定保護古蹟。',
      pt: 'Erguido em fevereiro de 1985 na Península Fildes, marcando o início da pesquisa científica permanente da China na Antártida.',
      es: 'Construido en febrero de 1985 en la Península Fildes, hito fundacional de la investigación científica permanente de China en la Antártida.'
    },
    sourceUrl: 'https://www.ecfr.gov/current/title-45/subtitle-B/chapter-VI/part-670/subpart-F/section-670.29'
  },
  {
    id: 'hsm-1-south-pole-flagpole',
    hsmCode: 'HSM-1',
    title: {
      en: 'South Pole Ceremonial Flagpole (90°S · IGY & Treaty Founders)',
      'zh-CN': '地理南极点第一号历史纪念旗杆（90°S · 国际地球物理年纪念）',
      'zh-TW': '地理南極點第一號歷史紀念旗桿（90°S · 國際地球物理年紀念）',
      'yue-Hant': '地理南極點 1 號歷史紀念旗桿（90°S · 南極條約和平科研象徵）',
      pt: 'Mastro Cerimonial do Polo Sul (90°S · Ano Geofísico Internacional)',
      es: 'Mástil Ceremonial del Polo Sur (90°S · Año Geofísico Internacional)'
    },
    era: 'treaty-igy',
    year: 1965,
    lat: -90.0,
    lon: 0.0,
    proposingParties: 'Argentina',
    summary: {
      en: 'The very first monument listed under the Antarctic Treaty System (HSM-1), erected at 90°S in December 1965 to honor all expeditions that reached the South Pole and peaceful international science.',
      'zh-CN': '《南极条约》体系编号第一位的历史纪念物（HSM-1），1965 年 12 月树立于南纬 90° 极点，致敬阿蒙森、斯科特以来所有抵达南极点的先驱及和平跨国科学合作精神。',
      'zh-TW': '《南極條約》體系編號第一號的歷史紀念物（HSM-1），1965 年 12 月豎立於南緯 90°，致敬所有抵達南極點的探險先驅與國際科學合作。',
      'yue-Hant': '成個《南極條約》古蹟名冊排第一號嘅紀念物（HSM-1），1965 年 12 月插喺南緯 90 度正中心，向阿蒙森、斯科特以嚟所有去到南極點嘅探險家同埋國際和平科研致敬。',
      pt: 'O primeiro monumento registrado no Sistema do Tratado da Antártida (HSM-1), erguido a 90°S em 1965 em tributo à exploração polar e à ciência pacífica.',
      es: 'El primer monumento inscrito bajo el Tratado Antártico (HSM-1), erigido en los 90°S por la Primera Expedición Polar Terrestre Argentina en diciembre de 1965.'
    },
    sourceUrl: 'https://www.ecfr.gov/current/title-45/subtitle-B/chapter-VI/part-670/subpart-F/section-670.29'
  }
];

export const HERITAGE_CHRONICLE_ACTS: ChronicleAct[] = [
  {
    id: 'act-1-early',
    actNumber: 1,
    yearsRange: '1773 – 1895',
    title: {
      en: 'Act I · Terra Australis Incognita & First Sightings of the Ice Continent',
      'zh-CN': '第一幕 · 未知南方大陆幻象破灭与早期冰岸发现（1773–1895）',
      'zh-TW': '第一幕 · 未知南方大陸與早期冰岸航海發現（1773–1895）',
      'yue-Hant': '第一幕 · 衝破南極圈迷霧同人類第一次望見南極冰岸（1773–1895）',
      pt: 'Ato I · Terra Australis Incognita e Primeiros Avistamentos (1773–1895)',
      es: 'Acto I · Terra Australis Incognita y Primeros Avistamientos (1773–1895)'
    },
    leadNarrative: {
      en: 'From ancient Greek maps of a temperate southern counterweight to wooden sailing ships piercing the Roaring Forties and Furious Fifties to sight the Antarctic ice barrier.',
      'zh-CN': '从古希腊哲学家假想的温带“未知南方大陆”，到木质帆船穿越咆哮西风带与浮冰迷雾，人类首次目击南极大陆架冰障与极地活火山。',
      'zh-TW': '從古希臘假想的南方大陸，到木帆船穿越咆哮西風帶與浮冰迷霧，人類首度目擊南極冰岸與極地活火山。',
      'yue-Hant': '以前歐洲人一直幻想南半球有塊溫暖肥沃嘅未知大陸，直到木帆船冒死衝過西風帶巨浪同大霧，人類先至親眼見到呢片俾萬年冰雪封住嘅白色大陸。',
      pt: 'Do mito clássico de um continente temperado austral aos veleiros de madeira cruzando o Círculo Polar para avistar as muralhas de gelo.',
      es: 'Del mito cartográfico de una tierra austral templada a los veleros que cruzaron el Círculo Polar hasta avistar las barreras de hielo.'
    },
    focusLat: -66.5,
    focusLon: -58.0,
    focusZoom: 2,
    milestones: [
      {
        yearLabel: '1773.01',
        lat: -66.56,
        lon: 39.5,
        title: {
          en: 'Capt. James Cook First Crosses the Antarctic Circle (66°33′S)',
          'zh-CN': '库克船长率“决心号”人类首次跨越 66°33′S 南极圈',
          'zh-TW': '庫克船長率「決心號」人類首度跨越 66°33′S 南極圈',
          'yue-Hant': '庫克船長揸住「決心號」成為史上第一個跨過 66°33′S 南極圈嘅人',
          pt: 'Capitão James Cook Cruza pela Primeira Vez o Círculo Polar Antártico',
          es: 'El Capitán James Cook Cruza por Primera Vez el Círculo Polar Antártico'
        },
        detail: {
          en: 'Reached 71°10′S in 1774 before impenetrable pack ice forced him back, proving any southern continent lay locked in polar ice.',
          'zh-CN': '1774 年更深入至南纬 71°10′，虽被密集浮冰阻挡未能目击陆地，但彻底终结了“温带南方大陆”传说。',
          'zh-TW': '1774 年推進至南緯 71°10′，證實若存在南方大陸亦必為極寒冰雪覆蓋。',
          'yue-Hant': '1774 年仲衝到南緯 71 度 10 分先俾厚浮冰頂住，一舉打破咗南極有溫暖綠洲嘅幻想。',
          pt: 'Atingiu 71°10′S em 1774, demonstrando que qualquer continente ao sul estaria coberto de gelo.',
          es: 'Alcanzó los 71°10′S en 1774, demostrando que cualquier continente austral estaba cubierto de hielo.'
        }
      },
      {
        yearLabel: '1820.01–11',
        lat: -63.4,
        lon: -58.0,
        title: {
          en: 'Bellingshausen, Bransfield & Palmer Sight the Antarctic Coast',
          'zh-CN': '别林斯高晋、布兰斯菲尔德与帕尔默先后目击南极冰岸与半岛',
          'zh-TW': '別林斯高晉、布蘭斯菲爾德與帕爾默先後目擊南極冰岸與半島',
          'yue-Hant': '俄、英、美三國船長同一年先後望見南極冰架同南極半島山脈',
          pt: 'Bellingshausen, Bransfield e Palmer Avistam a Costa Antártica',
          es: 'Bellingshausen, Bransfield y Palmer Avistan la Costa y la Península'
        },
        detail: {
          en: 'Within months in 1820, Russian, British, and American expeditions sighted the Fimbul Ice Shelf and Trinity Peninsula.',
          'zh-CN': '1820 年 1 月至 11 月间，俄、英、美航海家分别记录下毛德皇后地冰架前缘与南极半岛特里尼蒂山脉。',
          'zh-TW': '1820 年間，俄、英、美航海家分別記錄下冰架前緣與南極半島北端山脈。',
          'yue-Hant': '1820 年短短幾個月內，俄、英、美三隊帆船分別喺唔同方位望到南極冰架同半島北端雪山。',
          pt: 'Expedições russa, britânica e americana registraram a plataforma continental e a Península Trinidad.',
          es: 'Expediciones rusa, británica y estadounidense avistaron la barrera de hielo y la Península Trinidad.'
        }
      },
      {
        yearLabel: '1841.01',
        lat: -77.53,
        lon: 167.15,
        title: {
          en: 'James Clark Ross Discovers the Ross Sea, Mt. Erebus & Great Ice Barrier',
          'zh-CN': '詹姆斯·克拉克·罗斯驶入罗斯海，发现埃里伯斯喷发火山与大冰障',
          'zh-TW': '羅斯爵士駛入羅斯海，發現噴發中的埃里伯斯火山與大冰障',
          'yue-Hant': '羅斯爵士衝入羅斯海，親眼見到噴緊火嘅埃里伯斯山同五十米高大冰牆',
          pt: 'James Clark Ross Descobre o Mar de Ross e o Vulcão Monte Erebus',
          es: 'James Clark Ross Descubre el Mar de Ross y el Volcán Monte Erebus'
        },
        detail: {
          en: 'Aboard strengthened warships HMS Erebus and HMS Terror, Ross charted Victoria Land and the 50 m ice cliff.',
          'zh-CN': '驾驶加固木舰“埃里伯斯号”与“恐怖号”破冰南下，测绘维多利亚地海岸并命名罗斯岛双火山。',
          'zh-TW': '駕駛「埃里伯斯號」與「恐怖號」破冰南下，測繪維多利亞地海岸與羅斯冰架前緣。',
          'yue-Hant': '揸住加固木船「埃里伯斯號」同「恐怖號」破開浮冰，畫低維多利亞地海圖兼且為之後英雄時代探險開咗條路。',
          pt: 'A bordo do HMS Erebus e HMS Terror, cartografou a Terra de Vitória e a Grande Barreira de Gelo.',
          es: 'A bordo del HMS Erebus y HMS Terror, cartografió Tierra Victoria y la Gran Barrera de Hielo.'
        }
      }
    ],
    sourceUrl: 'https://ukaht.org/latest-news/historic-sites-and-monuments-in-antarctica/'
  },
  {
    id: 'act-2-heroic',
    actNumber: 2,
    yearsRange: '1897 – 1922',
    title: {
      en: 'Act II · The Heroic Age: Race to 90°S & Shackleton’s Endurance Miracle',
      'zh-CN': '第二幕 · 英雄时代：南极点双雄竞速与“坚忍号”绝境生还奇迹（1897–1922）',
      'zh-TW': '第二幕 · 英雄時代：南極點競速與「堅忍號」絕境生還史詩（1897–1922）',
      'yue-Hant': '第二幕 · 英雄時代：阿蒙森鬥斯科特衝刺極點同「堅忍號」全員生還奇蹟（1897–1922）',
      pt: 'Ato II · Era Heroica: A Corrida ao Polo Sul e a Epopeia do Endurance (1897–1922)',
      es: 'Acto II · Edad Heroica: Carrera al Polo Sur y Epopeya del Endurance (1897–1922)'
    },
    leadNarrative: {
      en: 'Before radios, aircraft, or satellite weather charts, small teams of explorers pushed across crevassed glaciers to 90°S and endured shipwreck in grinding pack ice.',
      'zh-CN': '在没有卫星云图与现代极地装备的年代，人类依靠狗拉雪橇、罗盘与钢铁意志向海拔近三千米的地理南极点发起冲刺，并在浮冰碎船绝境中谱写人类航海史上最伟大的救援传奇。',
      'zh-TW': '在缺乏現代通訊與氣象支援的年代，探險家憑藉雪橇、羅盤與非凡意志向 90°S 發起衝刺，並在碎冰沉船絕境中寫下不朽求生傳奇。',
      'yue-Hant': '嗰陣時冇衛星、冇飛機救援，探險家全靠雪橇犬、六分儀同埋驚人意志爬上近三千米高嘅冰原衝向 90°S，仲喺沉船困冰嘅絕路入面創造出人類歷史最震撼嘅求生奇蹟。',
      pt: 'Sem satélites ou aeronaves, equipes avançaram por geleiras até 90°S e sobreviveram ao esmagamento de navios no gelo.',
      es: 'Sin satélites ni aviación, expedicionarios avanzaron hacia los 90°S y protagonizaron rescates legendarios entre el hielo marino.'
    },
    focusLat: -83.0,
    focusLon: 172.0,
    focusZoom: 3,
    milestones: [
      {
        yearLabel: '1903',
        lat: -63.58,
        lon: -55.78,
        title: {
          en: 'Nordenskjöld Expedition Three-Way Winter Survival & Rescue (Paulet HSM-41)',
          'zh-CN': '瑞典诺登舍尔德探险队分困三地越冬奇迹重逢（保莱特岛石屋 HSM-41）',
          'zh-TW': '瑞典諾登舍爾德探險隊分困三地越冬奇蹟會師（保萊特島 HSM-41）',
          'yue-Hant': '瑞典探險隊沉船後分散三處砌石過冬，最後奇蹟全隊會師獲救（保萊特島 HSM-41）',
          pt: 'Sobrevivência Tripla da Expedição Sueca de Nordenskjöld (Ilha Paulet HSM-41)',
          es: 'Supervivencia en Tres Frentes de Nordenskjöld y Rescate del ARA Uruguay (HSM-41)'
        },
        detail: {
          en: 'Separated at Snow Hill, Hope Bay, and Paulet Island after the ship Antarctic sank, all three groups reunited in Nov 1903.',
          'zh-CN': '座船“南极号”被威德尔海浮冰挤沉后，三支分队在雪丘岛、希望湾与保莱特岛石屋各自熬过严冬并全员重逢获救。',
          'zh-TW': '「南極號」沉沒後，三支分隊分別於雪丘島、希望灣與保萊特島度過嚴冬並奇蹟重逢。',
          'yue-Hant': '「南極號」沉咗之後，隊員分散喺雪丘島、希望灣同保萊特島三度地方捱過極夜，最後竟然奇蹟同日重逢俾阿根廷軍艦救返。',
          pt: 'Separados em três grupos após o naufrágio do Antarctic, reuniram-se todos na primavera austral de 1903.',
          es: 'Divididos en Cerro Nevado, Bahía Esperanza e Isla Paulet tras hundirse el Antarctic, fueron rescatados en noviembre de 1903.'
        }
      },
      {
        yearLabel: '1911.12 – 1912.01',
        lat: -90.0,
        lon: 0.0,
        title: {
          en: 'Amundsen Reaches 90°S First (14 Dec 1911); Scott Arrives 34 Days Later',
          'zh-CN': '阿蒙森首抵南极点（1911.12.14）；斯科特小队 34 天后抵达并悲壮长眠冰原',
          'zh-TW': '阿蒙森首抵南極點（1911.12.14）；斯科特小隊 34 天後抵達並悲壯殞落歸途',
          'yue-Hant': '阿蒙森搶先插旗南極點（1911.12.14）；斯科特五人隊遲咗 34 日去到，回程遇暴風雪壯烈犧牲',
          pt: 'Amundsen Atinge 90°S em 14 Dez 1911; Scott Chega 34 Dias Depois',
          es: 'Amundsen Alcanza los 90°S el 14 Dic 1911; Scott Llega 34 Días Después'
        },
        detail: {
          en: 'Amundsen pioneered the steep Axel Heiberg Glacier on skis and dog sleds; Scott’s 5-man team man-hauled back with 16 kg of Glossopteris fossils.',
          'zh-CN': '挪威阿蒙森凭借娴熟滑雪与雪橇犬开辟阿克塞尔海伯格新路线凯旋；英国斯科特五人队归途遭遇罕见极寒暴风雪，至死守护着 16 公斤古植物化石样本。',
          'zh-TW': '阿蒙森憑藉雪橇犬開闢新路線安全凱旋；斯科特五人隊歸途遇罕見嚴寒暴雪，臨終仍守護 16 公斤舌羊齒化石。',
          'yue-Hant': '挪威阿蒙森靠雪橇犬開新路順利來回；英國斯科特五人隊人力拉雪橇回程撞正極寒暴風雪，離補給站只差 11 英里凍死帳篷入面，但身邊仲留住嗰 16 公斤珍貴化石。',
          pt: 'Amundsen subiu a Geleira Axel Heiberg com cães; o grupo de Scott pereceu no retorno mantendo intactos 16 kg de fósseis.',
          es: 'Amundsen abrió ruta por el glaciar Axel Heiberg; el grupo de Scott pereció al regreso conservando 16 kg de muestras científicas.'
        }
      },
      {
        yearLabel: '1914 – 1916',
        lat: -68.74,
        lon: -52.33,
        title: {
          en: 'Shackleton’s Endurance Crushed in Weddell Ice; All 28 Men Rescued',
          'zh-CN': '沙克尔顿“坚忍号”威德尔海沉没与 800 海里救生艇惊涛救援（28 人零伤亡）',
          'zh-TW': '沙克爾頓「堅忍號」威德爾海沉沒與 800 海里小艇跨海救援（28 人全員生還）',
          'yue-Hant': '沙克爾頓「堅忍號」沉船後坐七米細木艇衝過八百海里巨浪，全船 28 人一個都冇少',
          pt: 'O Endurance de Shackleton Naufraga no Mar de Weddell; Todos os 28 Homens Salvos',
          es: 'El Endurance Naufraga en el Mar de Weddell; Rescate Total de los 28 Tripulantes'
        },
        detail: {
          en: 'After drifting on ice floes to Elephant Island, Shackleton, Worsley, and four crew sailed the 22-foot James Caird across turbulent Scotia Sea waves to South Georgia.',
          'zh-CN': '浮冰漂流抵象岛后，沙克尔顿与航海长沃斯利等 6 人驾仅 6.9 米长的“詹姆斯·凯尔德号”小艇横渡狂暴斯科舍海并徒步翻越南乔治亚冰山求援成功。',
          'zh-TW': '漂流至象島後，沙克爾頓等 6 人駕 6.9 公尺小艇橫渡狂暴斯科舍海並徒步翻越南喬治亞冰川成功求援。',
          'yue-Hant': '漂到去象島之後，沙克爾頓揀咗五個隊友坐隻得唔夠七米長嘅救生艇「詹姆斯·凱爾德號」，喺驚濤駭浪入面盲航八百海里去到南喬治亞島，再徒步翻過無人冰山搵人返去救晒全隊人。',
          pt: 'Shackleton e cinco homens navegaram 800 milhas náuticas no bote James Caird até a Geórgia do Sul para salvar toda a tripulação.',
          es: 'Shackleton y cinco hombres navegaron 800 millas náuticas en el bote James Caird hasta Georgia del Sur para salvar a toda su dotación.'
        }
      }
    ],
    sourceUrl: 'https://ukaht.org/latest-news/historic-sites-and-monuments-in-antarctica/'
  },
  {
    id: 'act-3-treaty',
    actNumber: 3,
    yearsRange: '1957 – 1991',
    title: {
      en: 'Act III · International Geophysical Year & The Antarctic Treaty Peace Governance',
      'zh-CN': '第三幕 · 国际地球物理年与《南极条约》和平科学共治体系（1957–1991）',
      'zh-TW': '第三幕 · 國際地球物理年與《南極條約》和平科學共治體系（1957–1991）',
      'yue-Hant': '第三幕 · 國際地球物理年同《南極條約》定落和平科研保護規矩（1957–1991）',
      pt: 'Ato III · Ano Geofísico Internacional e Governança de Paz do Tratado (1957–1991)',
      es: 'Acto III · Año Geofísico Internacional y Gobernanza de Paz del Tratado (1957–1991)'
    },
    leadNarrative: {
      en: 'At the height of the Cold War, twelve nations set aside geopolitical rivalry to turn an entire continent south of 60°S into humanity’s demilitarized sanctuary for open science.',
      'zh-CN': '在冷战对峙最严峻的年代，12 个国家超越地缘分歧携手合作，将南纬 60° 以南整片大陆确立为人类历史上首个非军事化、无核化与科学数据自由共享的和平疆域。',
      'zh-TW': '於冷戰高峰期，12 國超越地緣對立，將南緯 60° 以南整片大陸確立為非軍事化、禁止核試與科學共享的和平保護區。',
      'yue-Hant': '就算喺冷戰最緊張嗰陣，十二個國家都肯放低爭拗坐埋一齊簽約，規定南緯 60 度以南永遠唔准駐軍、唔准核試，全人類一齊和平做科研同保護環境。',
      pt: 'Em plena Guerra Fria, doze nações transformaram o continente ao sul de 60°S em reserva desmilitarizada dedicada à ciência aberta.',
      es: 'En plena Guerra Fría, doce naciones consagraron todo el territorio al sur de los 60°S como reserva desmilitarizada dedicada a la paz y la ciencia.'
    },
    focusLat: -72.0,
    focusLon: -30.0,
    focusZoom: 2,
    milestones: [
      {
        yearLabel: '1957 – 1958',
        lat: -78.46,
        lon: 106.83,
        title: {
          en: 'International Geophysical Year (IGY): Over 50 Polar Observatories Built',
          'zh-CN': '国际地球物理年（IGY）：人类首次在南极内陆建成南极点站与东方站',
          'zh-TW': '國際地球物理年（IGY）：人類首度於內陸冰原建成南極點站與東方站',
          'yue-Hant': '國際地球物理年（IGY）：各國合力喺南極起咗五十幾個站，正式進駐內陸極寒禁區',
          pt: 'Ano Geofísico Internacional (IGY): Mais de 50 Estações Científicas Erguidas',
          es: 'Año Geofísico Internacional (AGI): Más de 50 Bases Científicas Establecidas'
        },
        detail: {
          en: 'Twelve nations established coordinated coastal and inland stations including Amundsen-Scott (90°S) and Vostok.',
          'zh-CN': '12 国协同建立逾 50 座观测站，首次实现人类在海拔三千米南极内陆冰盖常年越冬观测。',
          'zh-TW': '12 國協同建立逾 50 座觀測站，首度實現人類在內陸高原常年越冬科學觀測。',
          'yue-Hant': '十二個國家聯手起咗超過五十個觀測站，人類第一次做到全年留守三千幾米高嘅南極內陸過冬測數據。',
          pt: 'Doze países estabeleceram redes coordenadas na costa e no interior, incluindo Polo Sul e Vostok.',
          es: 'Doce países instalaron redes coordinadas en la costa y la meseta interior, incluyendo Polo Sur y Vostok.'
        }
      },
      {
        yearLabel: '1959.12 & 1985',
        lat: -75.58,
        lon: -26.66,
        title: {
          en: 'Antarctic Treaty Signed (1959) & Stratospheric Ozone Hole Discovered (1985)',
          'zh-CN': '《南极条约》签署（1959）与哈雷站发现南极臭氧层空洞拯救全球大气（1985）',
          'zh-TW': '《南極條約》簽署（1959）與哈雷站發現臭氧層破洞促成蒙特婁議定書（1985）',
          'yue-Hant': '《南極條約》簽訂（1959）同哈雷站發現臭氧層穿窿促成全球禁用氟利昂（1985）',
          pt: 'Assinatura do Tratado da Antártida (1959) e Descoberta do Buraco de Ozônio (1985)',
          es: 'Firma del Tratado Antártico (1959) y Descubrimiento del Agujero de Ozono (1985)'
        },
        detail: {
          en: 'Long-term BAS spectrophotometry at Halley Station alerted the world to CFC ozone depletion, leading directly to the 1987 Montreal Protocol.',
          'zh-CN': '英国哈雷站长达数十年的连续紫外光谱监测率先向全人类敲响氟氯烃破坏臭氧层警钟，直接催生《蒙特利尔议定书》。',
          'zh-TW': '哈雷站數十年連續光譜觀測率先揭露氟氯碳化物破壞臭氧層，直接催生 1987 年《蒙特婁議定書》。',
          'yue-Hant': '正因為哈雷站幾十年唔間斷測大氣數據，先至及時發現臭氧層穿咗個大窿，令全世界喺 1987 年簽《蒙特利爾議定書》救返地球大氣層。',
          pt: 'Medições contínuas em Halley revelaram a destruição do ozônio, originando o Protocolo de Montreal.',
          es: 'Las mediciones continuas en Halley alertaron sobre el agotamiento del ozono e impulsaron el Protocolo de Montreal.'
        }
      },
      {
        yearLabel: '1991.10',
        lat: -62.22,
        lon: -58.96,
        title: {
          en: 'Madrid Environmental Protocol Designates Antarctica a Natural Reserve',
          'zh-CN': '《马德里环境保护议定书》签署：全面禁止商业采矿，确立自然保护区地位',
          'zh-TW': '《馬德里環境保護議定書》簽署：禁止商業採礦，確立自然保護區地位',
          'yue-Hant': '簽訂《馬德里環保議定書》：嚴禁任何商業掘礦，將成個南極定為和平科研自然保護區',
          pt: 'Protocolo de Madri Consagra a Antártida como Reserva Natural da Humanidade',
          es: 'El Protocolo de Madrid Consagra la Antártida como Reserva Natural para la Paz y la Ciencia'
        },
        detail: {
          en: 'Established strict environmental impact assessments, waste removal rules, and ban on mineral resource exploitation.',
          'zh-CN': '确立严格的环评制度、废弃物清运标准与动植物保护铁律，同年国际南极旅游组织协会（IAATO）成立。',
          'zh-TW': '確立嚴格環評制度、廢棄物清運與生態保護規範，同年 IAATO 亦正式成立。',
          'yue-Hant': '立例規定所有活動都要做環評、垃圾要帶走，連一粒石頭都唔准亂執，同年 IAATO 成立規範極地生態旅遊。',
          pt: 'Proibiu a mineração comercial e instituiu avaliação ambiental rigorosa e diretrizes IAATO.',
          es: 'Prohibió la minería comercial e impuso estrictas normas ambientales junto con las directrices de la IAATO.'
        }
      }
    ],
    sourceUrl: 'https://www.ats.aq/'
  },
  {
    id: 'act-4-modern',
    actNumber: 4,
    yearsRange: '1992 – Present',
    title: {
      en: 'Act IV · Million-Year Ice Cores, Bedmap3 Radar & Endurance Rediscovered',
      'zh-CN': '第四幕 · 百万年深冰芯解码、冰下雷达透视与“坚忍号”深海重现（1992–至今）',
      'zh-TW': '第四幕 · 百萬年深冰芯解碼、冰下雷達透視與「堅忍號」深海重現（1992–至今）',
      'yue-Hant': '第四幕 · 百萬年深冰芯解碼、雷達透視冰底同三千米深海搵返「堅忍號」（1992–至今）',
      pt: 'Ato IV · Testemunhos Milenares, Radar Bedmap3 e Redescoberta do Endurance (1992–Hoje)',
      es: 'Acto IV · Hielo de un Millón de Años, Radar Bedmap3 y Hallazgo del Endurance (1992–Hoy)'
    },
    leadNarrative: {
      en: 'Airborne ice-penetrating radar, satellite altimetry, autonomous submersibles, and ultra-deep ice cores transform Antarctica into Earth’s master climate observatory.',
      'zh-CN': '航空穿冰雷达、极轨遥感卫星、自主水下潜航器与超深冰芯钻探技术交汇，既解码了地球百万年温室气体脉动，也让沉睡海底百年的探险传奇重见天日。',
      'zh-TW': '穿冰雷達、極軌衛星、水下自主潛航器與超深冰芯鑽探交會，既解碼百萬年古氣候脈動，亦讓百年沉船重見天日。',
      'yue-Hant': '靠穿冰雷達飛機、極地衛星同埋深海無人潛航器，今日科學家唔單止鑽穿幾千米冰層睇返百萬年前嘅古空氣，仲喺三千米冰海下面搵返百幾年前沉沒嘅傳奇木船。',
      pt: 'Radares de penetração no gelo, satélites polares e robôs submarinos revelam o clima de um milhão de anos e relíquias abissais.',
      es: 'Radares aerotransportados, satélites polares y vehículos submarinos descifran un millón de años de clima y hallazgos abisales.'
    },
    focusLat: -75.1,
    focusLon: 123.33,
    focusZoom: 3,
    milestones: [
      {
        yearLabel: '2004 – 2025',
        lat: -75.1,
        lon: 123.33,
        title: {
          en: 'Dome C & Dome A Deep Ice Cores Unlock 800,000–1.2 Million Years of CO₂ History',
          'zh-CN': '冰穹 C 与冰穹 A（昆仑站）深冰芯钻探：解锁 80 万至 120 万年大气温室气体档案',
          'zh-TW': '冰穹 C 與冰穹 A（崑崙站）深冰芯鑽探：解鎖 80 萬至 120 萬年古大氣檔案',
          'yue-Hant': '冰穹 C 同冰穹 A（崑崙站）超深冰芯：由冰泡入面讀出成百萬年地球二氧化碳同冷暖週期',
          pt: 'Testemunhos Profundos no Domo C e Domo A Revelam 1,2 Milhão de Anos de Clima',
          es: 'Testigos de Hielo en Domo C y Domo A Revelan 1,2 Millones de Años de Historia Climática'
        },
        detail: {
          en: 'Ancient air bubbles trapped 3 km deep at Concordia and Dome A directly link atmospheric CO₂ to glacial cycles.',
          'zh-CN': '封存在三千米深处冰晶气泡中的远古空气，以无可辩驳的实测数据揭示大气二氧化碳浓度与冰期旋回耦合规律。',
          'zh-TW': '封存於三千公尺深處冰晶氣泡中的遠古空氣，精準揭示大氣二氧化碳與冰期循環關係。',
          'yue-Hant': '鎖喺三千米深冰層氣泡入面嘅遠古空氣，直接俾科學家實測過去一百萬年二氧化碳同冰河時期點樣同步升跌。',
          pt: 'Bolhas de ar aprisionadas a 3 km de profundidade comprovam o elo entre CO₂ e ciclos glaciais.',
          es: 'Las burbujas de aire atrapadas a 3 km de profundidad demuestran el vínculo entre el CO₂ y los ciclos glaciares.'
        }
      },
      {
        yearLabel: '2022.03',
        lat: -68.74,
        lon: -52.33,
        title: {
          en: 'Endurance22 Locates Shackleton’s Ship Upright at 3,008 m in Weddell Sea (HSM-93)',
          'zh-CN': '“Endurance22”于威德尔海水下 3,008 米发现沙克尔顿“坚忍号”完好船体（HSM-93）',
          'zh-TW': '「Endurance22」於威德爾海水下 3,008 公尺尋獲完好「堅忍號」沉船（HSM-93）',
          'yue-Hant': '「Endurance22」喺威德爾海 3,008 米深海搵返完好直立嘅「堅忍號」沉船（HSM-93）',
          pt: 'Expedição Endurance22 Localiza o Navio de Shackleton Intacto a 3.008 m (HSM-93)',
          es: 'La Expedición Endurance22 Localiza el Buque de Shackleton a 3.008 m (HSM-93)'
        },
        detail: {
          en: 'Free of wood-boring organisms in freezing Weddell abyssal waters, the ship’s gilded name ENDURANCE gleams clearly after 107 years.',
          'zh-CN': '得益于威德尔海冰冷深水无食木生物侵蚀，沉没 107 年的木船舵轮与船尾“ENDURANCE”金字依然清晰如初。',
          'zh-TW': '受惠於冰冷深海無食木生物侵蝕，沉沒 107 年的舵輪與船尾「ENDURANCE」字樣依然清晰如新。',
          'yue-Hant': '因為南極深海水太凍冇食木蟲，沉咗 107 年嘅木船連船舵同船尾「ENDURANCE」粒五角星都清清楚楚，好似啱啱沉落去咁。',
          pt: 'Preservado pelas águas geladas sem organismos xilófagos, o nome ENDURANCE na popa permanece nítido após 107 anos.',
          es: 'Conservado en aguas heladas libres de xilófagos, el nombre ENDURANCE en la popa luce intacto tras 107 años.'
        }
      },
      {
        yearLabel: '2024 – Present',
        lat: -74.93,
        lon: 163.71,
        title: {
          en: 'Bedmap3 Continent-Wide Synthesis & Clean-Energy Polar Stations (Qinling Station)',
          'zh-CN': 'BAS Bedmap3 全洲冰下地形发布与新一代绿色智能科考站（秦岭站）投入运行',
          'zh-TW': 'BAS Bedmap3 全洲冰下地形發布與新一代綠色智慧科考站（秦嶺站）啟用',
          'yue-Hant': 'Bedmap3 全南極冰底地圖面世同埋新一代風光氫清潔能源科考站（秦嶺站）投入運作',
          pt: 'Síntese Continental Bedmap3 e Nova Geração de Estações Sustentáveis (Qinling)',
          es: 'Síntesis Continental Bedmap3 y Nueva Generación de Bases Sostenibles (Qinling)'
        },
        detail: {
          en: 'Over 80 million radar survey points map subglacial Antarctica while wind-solar-hydrogen microgrids power year-round science.',
          'zh-CN': '汇聚逾 8,000 万个雷达测点绘制最高精度南极冰床图，风—光—氢储微电网驱动极夜零碳科考观测。',
          'zh-TW': '整合逾 8,000 萬筆雷達測點繪製高精度冰床圖，並以風光氫再生能源支撐極夜低碳觀測。',
          'yue-Hant': '集合咗超過八千萬個雷達測點畫出最清晰嘅南極冰底地圖，新一代科考站仲用埋風力、太陽能同氫能微電網頂住極夜嚴寒。',
          pt: 'Mais de 80 milhões de pontos de radar mapeiam o subsolo glacial enquanto microrredes renováveis alimentam estações polares.',
          es: 'Más de 80 millones de mediciones de radar cartografían el subsuelo glacial mientras microrredes limpias alimentan la ciencia anual.'
        }
      }
    ],
    sourceUrl: 'https://www.bas.ac.uk/project/bedmap3/'
  }
];

export const HISTORIC_EXPEDITION_TRACKS: HistoricExpeditionTrack[] = [
  {
    id: 'shackleton-endurance-1915',
    colorHex: '#38bdf8',
    years: '1914 – 1916',
    leader: {
      en: 'Sir Ernest Shackleton (Imperial Trans-Antarctic Expedition)',
      'zh-CN': '欧内斯特·沙克尔顿爵士（坚忍号威德尔海绝境漂流与救援）',
      'zh-TW': '歐內斯特·沙克爾頓爵士（堅忍號威德爾海漂流與跨海救援）',
      'yue-Hant': '沙克爾頓爵士（「堅忍號」威德爾海困冰漂流同八百海里救生艇奇蹟）',
      pt: 'Sir Ernest Shackleton (Deriva e Resgate do Endurance)',
      es: 'Sir Ernest Shackleton (Deriva y Rescate del Endurance)'
    },
    vesselOrBase: {
      en: 'Endurance (HSM-93) → Patience Camp → James Caird Lifeboat → South Georgia',
      'zh-CN': '坚忍号（HSM-93）→ 浮冰营地 → 象岛（HSM-53）→ 詹姆斯·凯尔德号小艇 → 南乔治亚岛',
      'zh-TW': '堅忍號（HSM-93）→ 浮冰營地 → 象島（HSM-53）→ 詹姆斯·凱爾德號小艇 → 南喬治亞島',
      'yue-Hant': '堅忍號（HSM-93）→ 浮冰帳篷營 → 象島（HSM-53）→ 七米細木艇 → 南喬治亞島',
      pt: 'Endurance (HSM-93) → Ilha Elefante (HSM-53) → Bote James Caird → Geórgia do Sul',
      es: 'Endurance (HSM-93) → Isla Elefante (HSM-53) → Bote James Caird → Georgia del Sur'
    },
    summary: {
      en: 'Became beset in Weddell Sea ice in Jan 1915, drifted 1,180 km north until crushed, camped on sea ice to Elephant Island, and sailed 800 nm in an open boat to rescue all 28 men.',
      'zh-CN': '1915 年 1 月于威德尔海受困浮冰，随顺时针环流北漂逾千公里后船毁沉没；全员在碎裂海冰与救生艇上搏击至象岛，最终驾无甲板小艇横渡狂暴南大洋实现 28 人全员生还。',
      'zh-TW': '1915 年 1 月受困威德爾海浮冰，隨環流北漂沉船後搏擊至象島，再駕小艇橫渡 800 海里狂濤達成 28 人全員生還。',
      'yue-Hant': '1915 年 1 月喺威德爾海俾浮冰鎖死，跟住海流向北漂咗成千幾公里之後隻船夾爆沉埋；全隊人瞓浮冰、扒救生艇去到象島，再由沙克爾頓揸七米細艇衝過八百海里巨浪救返晒 28 個人。',
      pt: 'Preso no gelo em jan/1915, derivou até o naufrágio, alcançou a Ilha Elefante e navegou 800 mn em bote aberto salvando os 28 tripulantes.',
      es: 'Atrapado en el hielo en ene/1915, derivó hasta hundirse, alcanzó Isla Elefante y cruzó 800 mn en bote abierto salvando a los 28 hombres.'
    },
    stops: [
      {
        dateLabel: '1915-01-18',
        lat: -76.57,
        lon: -31.5,
        title: {
          en: 'Beset in Pack Ice off Caird Coast',
          'zh-CN': '威德尔海凯尔德海岸外浮冰受困（距陆地仅一日航程）',
          'zh-TW': '威德爾海凱爾德海岸外遭浮冰圍困',
          'yue-Hant': '爭一日船程就到岸嗰陣俾威德爾海厚浮冰死死凍住',
          pt: 'Aprisionado no Gelo junto à Costa Caird',
          es: 'Atrapado en la Banquisa frente a Costa Caird'
        },
        note: {
          en: 'Frozen fast like “an almond in the middle of a chocolate bar” as temperatures plunged.',
          'zh-CN': '气温骤降令浮冰冻结如铁，“坚忍号”如巧克力块中的杏仁般动弹不得。',
          'zh-TW': '氣溫驟降令浮冰凝結，「堅忍號」被迫改為越冬漂流基地。',
          'yue-Hant': '氣溫急跌令四周圍浮冰結成鐵板咁實，隻船好似朱古力入面粒杏仁咁完全郁唔到。',
          pt: 'Congelado no pack ice ao sul do Mar de Weddell.',
          es: 'Inmovilizado por la presión del hielo en el sur del Mar de Weddell.'
        }
      },
      {
        dateLabel: '1915-11-21',
        lat: -68.74,
        lon: -52.33,
        title: {
          en: 'Endurance Sinks (Now Protected Site HSM-93)',
          'zh-CN': '“坚忍号”被浮冰彻底挤碎沉入 3,008 米海底（今 HSM-93）',
          'zh-TW': '「堅忍號」遭浮冰擠碎沉入 3,008 公尺深海（今 HSM-93）',
          'yue-Hant': '「堅忍號」頂唔順浮冰巨力沉入三千米海底（即係今日 HSM-93）',
          pt: 'Naufrágio do Endurance (Hoje Monumento HSM-93)',
          es: 'Hundimiento del Endurance (Hoy Sitio Protegido HSM-93)'
        },
        note: {
          en: '28 crew camped directly on drifting Ocean Camp and Patience Camp ice floes for five months.',
          'zh-CN': '全船 28 人携三艘救生艇转移至漂移浮冰上的“海洋营”与“耐心营”露营求生五个月。',
          'zh-TW': '28 名船員攜三艘救生艇轉移至漂流浮冰上紮營求生五個月。',
          'yue-Hant': '全船 28 人拉住三隻救生艇搬落塊浮冰上面紮營，隨波逐流捱足五個月等浮冰裂開。',
          pt: 'Os 28 homens acamparam sobre blocos de gelo à deriva por cinco meses.',
          es: 'Los 28 hombres acamparon sobre témpanos a la deriva durante cinco meses.'
        }
      },
      {
        dateLabel: '1916-04-15',
        lat: -61.1,
        lon: -54.83,
        title: {
          en: 'Landfall at Point Wild, Elephant Island (HSM-53)',
          'zh-CN': '三艘救生艇搏浪七昼夜登陆象岛怀尔德角（HSM-53）',
          'zh-TW': '三艘救生艇搏浪登陸象島懷爾德角（HSM-53）',
          'yue-Hant': '三隻細艇喺冰海死撐七日七夜終於踏上象島實地（HSM-53）',
          pt: 'Desembarque em Ponta Wild, Ilha Elefante (HSM-53)',
          es: 'Desembarco en Punta Wild, Isla Elefante (HSM-53)'
        },
        note: {
          en: 'First solid ground under their feet in 497 days; 22 men stayed under overturned boats while 6 sailed for help.',
          'zh-CN': '时隔 497 天首次踏上陆地；22 人留守孤岛，沙克尔顿率 5 人改装救生艇远航求救。',
          'zh-TW': '時隔 497 天首踏陸地；22 人留守，6 人駕小艇遠航南喬治亞島求援。',
          'yue-Hant': '隔咗足足 497 日終於踩返落實地；22 人留低守營，沙克爾頓帶五個人坐細艇衝出海求救。',
          pt: 'Terra firme após 497 dias; 6 homens partiram no James Caird em busca de socorro.',
          es: 'Tierra firme tras 497 días; 6 hombres zarparon en el James Caird en busca de auxilio.'
        }
      },
      {
        dateLabel: '1916-05-10',
        lat: -54.15,
        lon: -37.3,
        title: {
          en: '800 nm Open-Boat Miracle to South Georgia & Stromness Trek',
          'zh-CN': '跨越 800 海里狂风巨浪抵达南乔治亚岛并徒步翻越冰山获救',
          'zh-TW': '跨越 800 海里狂濤抵達南喬治亞島並徒步翻越冰川求援成功',
          'yue-Hant': '頂住十幾米巨浪盲航八百海里去到南喬治亞島，再連行 36 個鐘翻過冰山搵到救兵',
          pt: 'Travessia de 800 mn até a Geórgia do Sul e Resgate Final',
          es: 'Travesía de 800 mn hasta Georgia del Sur y Rescate Total'
        },
        note: {
          en: 'Worsley navigated with only four sextant sights in 16 days; on 30 Aug 1916 Piloto Pardo’s Yelcho rescued all 22 men from Elephant Island.',
          'zh-CN': '沃斯利在 16 天阴霾巨浪中仅凭 4 次六分仪测日精准命中海岛；8 月 30 日全员 28 人平安归来。',
          'zh-TW': '沃斯利僅憑 4 次六分儀觀測精準命中海島；8 月 30 日象島 22 人全數獲救。',
          'yue-Hant': '航海長沃斯利喺十六日陰天巨浪入面淨係靠四次太陽露面用六分儀就準確搵到個島，最後 28 個人一個都冇少全部平安返屋企。',
          pt: 'Navegação lendária de Worsley ao sextante; em 30 ago 1916 todos foram salvos.',
          es: 'Legendaria navegación astronómica de Worsley; el 30 ago 1916 fueron rescatados todos en la Yelcho.'
        }
      }
    ],
    sourceUrl: 'https://ukaht.org/latest-news/historic-sites-and-monuments-in-antarctica/'
  },
  {
    id: 'amundsen-1911',
    colorHex: '#10b981',
    years: '1911 – 1912',
    leader: {
      en: 'Roald Amundsen (Norwegian Fram South Pole Expedition)',
      'zh-CN': '罗阿尔·阿蒙森（挪威“前进号”人类首抵南极点路线）',
      'zh-TW': '羅阿爾·阿蒙森（挪威「前進號」人類首抵南極點路線）',
      'yue-Hant': '阿蒙森（挪威隊滑雪配雪橇犬首登 90°S 南極點路線）',
      pt: 'Roald Amundsen (Primeira Conquista do Polo Sul — Fram)',
      es: 'Roald Amundsen (Primera Conquista del Polo Sur — Fram)'
    },
    vesselOrBase: {
      en: 'Framheim (Bay of Whales) → Axel Heiberg Glacier → Polheim (90°S)',
      'zh-CN': '罗斯冰架鲸湾基地 → 阿克塞尔海伯格冰川 → 90°S 极点帐篷',
      'zh-TW': '羅斯冰架鯨灣基地 → 阿克塞爾海伯格冰川 → 90°S 極點帳篷',
      'yue-Hant': '羅斯冰架鯨灣大本營 → 阿克塞爾海伯格陡峭冰川 → 90°S 南極點',
      pt: 'Framheim (Baía das Baleias) → Geleira Axel Heiberg → Polo Sul (90°S)',
      es: 'Framheim (Bahía Ballenas) → Glaciar Axel Heiberg → Polo Sur (90°S)'
    },
    summary: {
      en: 'Starting 60 nautical miles closer to the Pole at the Bay of Whales, Amundsen’s 5-man ski and dog-sled team climbed the uncharted Axel Heiberg Glacier in 4 days and reached 90°S on 14 Dec 1911.',
      'zh-CN': '选址比罗斯岛更靠南 60 海里的鲸湾冰架前缘，5 名滑雪高手驱策格陵兰雪橇犬仅用 4 天闪电翻越未知的阿克塞尔海伯格陡峭冰川，于 1911 年 12 月 14 日率先登顶南极点并全员安全返航。',
      'zh-TW': '選址更靠南 60 海里的鯨灣，5 名隊員驅策雪橇犬僅用 4 天翻越未知的阿克塞爾海伯格冰川，於 1911 年 12 月 14 日率先抵達南極點並安全返航。',
      'yue-Hant': '醒目揀咗比對手近南極點 60 海里嘅鯨灣做起點，五個滑雪高手帶住格陵蘭雪橇犬只係用咗四日就衝上從未有人行過嘅陡峭冰川，1911 年 12 月 14 日成功做咗全人類第一批企喺南極點嘅人，仲全員平安返歸。',
      pt: 'Partindo da Baía das Baleias com esquis e cães, escalou a inexplorada Geleira Axel Heiberg e atingiu 90°S em 14 dez 1911.',
      es: 'Partiendo de Bahía Ballenas con esquís y perros, ascendió el inexplorado glaciar Axel Heiberg y alcanzó los 90°S el 14 dic 1911.'
    },
    stops: [
      {
        dateLabel: '1911-10-20',
        lat: -78.63,
        lon: -164.0,
        title: {
          en: 'Departure from Framheim (Bay of Whales)',
          'zh-CN': '自罗斯冰架东侧鲸湾“前进之家”出发（5 人 52 犬）',
          'zh-TW': '自羅斯冰架鯨灣「前進之家」出發（5 人 52 犬）',
          'yue-Hant': '由羅斯冰架鯨灣「前進之家」帶住 52 隻雪橇犬正式出發',
          pt: 'Partida de Framheim (Baía das Baleias)',
          es: 'Partida desde Framheim (Bahía Ballenas)'
        },
        note: {
          en: 'Pre-laid supply depots with black flags at 80°S, 81°S, and 82°S across the flat Ross Barrier.',
          'zh-CN': '沿南纬 80°、81°、82° 预先精准布设插有黑旗的补给站。',
          'zh-TW': '沿南緯 80° 至 82° 預先布設黑旗標示補給站。',
          'yue-Hant': '出發前已經喺 80°S 至 82°S 沿路插晒黑旗做好晒糧食補給站，準備十足。',
          pt: 'Depósitos previamente demarcados até 82°S.',
          es: 'Depósitos previamente balizados hasta los 82°S.'
        }
      },
      {
        dateLabel: '1911-11-17',
        lat: -85.4,
        lon: -163.0,
        title: {
          en: 'Ascent of Uncharted Axel Heiberg Glacier to 3,200 m Plateau',
          'zh-CN': '四天闪电攀登未知的阿克塞尔海伯格冰川跃上三千米极点高原',
          'zh-TW': '四天攀登阿克塞爾海伯格冰川躍上三千公尺極點高原',
          'yue-Hant': '用咗四日時間一口氣爬上三千幾米高嘅橫貫南極山脈冰川頂',
          pt: 'Subida da Geleira Axel Heiberg ao Planalto Polar',
          es: 'Ascenso por el Glaciar Axel Heiberg a la Meseta Polar'
        },
        note: {
          en: 'Crossed the Devil’s Glacier crevasse labyrinth onto the open Polar Plateau.',
          'zh-CN': '穿越“魔鬼冰川”密集冰裂缝迷宫，顺利踏上开阔内陆高原。',
          'zh-TW': '穿越密集冰裂隙區，順利進入內陸極點高原。',
          'yue-Hant': '穿過滿佈冰裂縫嘅「魔鬼冰川」，順利衝上平坦開闊嘅南極內陸高原。',
          pt: 'Travessia das fendas da Geleira do Diabo rumo ao planalto.',
          es: 'Cruce del laberinto de grietas del Glaciar del Diablo hacia la meseta.'
        }
      },
      {
        dateLabel: '1911-12-14',
        lat: -90.0,
        lon: 0.0,
        title: {
          en: 'Polheim: Humanity’s First Arrival at 90°S Geographic South Pole',
          'zh-CN': '“极点之家（Polheim）”：人类历史上首次抵达 90°S 地理南极点',
          'zh-TW': '「極點之家（Polheim）」：人類史上首度抵達 90°S 地理南極點',
          'yue-Hant': '「極點之家（Polheim）」：五對手一齊插落挪威國旗，成為史上首批到達 90°S 嘅人類',
          pt: 'Polheim: Primeira Chegada Humana ao Polo Sul Geográfico (90°S)',
          es: 'Polheim: Primera Llegada Humana al Polo Sur Geográfico (90°S)'
        },
        note: {
          en: 'Boxed the Pole with sextant observations over 3 days and left a spare tent and letter for Scott; returned safely to Framheim on 25 Jan 1912.',
          'zh-CN': '连续三天环绕极点天文测绘确保万无一失，留下备用帐篷与致斯科特信件后于 1912 年 1 月 25 日全员平安返抵鲸湾。',
          'zh-TW': '連續三天環繞測繪確認極點位置，留存帳篷與信件後於 1912 年 1 月 25 日平安返航。',
          'yue-Hant': '圍住極點連測三日太陽高度確保百發百中，留低帳篷同俾斯科特嘅信之後，1912 年 1 月 25 日全隊精神奕奕返到鯨灣。',
          pt: 'Confirmaram 90°S por três dias e retornaram em segurança em 25 jan 1912.',
          es: 'Verificaron los 90°S durante tres días y regresaron sanos y salvos el 25 ene 1912.'
        }
      }
    ],
    sourceUrl: 'https://www.ecfr.gov/current/title-45/subtitle-B/chapter-VI/part-670/subpart-F/section-670.29'
  },
  {
    id: 'scott-1911',
    colorHex: '#f43f5e',
    years: '1911 – 1912',
    leader: {
      en: 'Capt. Robert Falcon Scott (British Terra Nova Expedition)',
      'zh-CN': '罗伯特·福尔肯·斯科特上校（英国“新地号”科学与极点远征路线）',
      'zh-TW': '羅伯特·福爾肯·斯科特上校（英國「新地號」科學與極點遠征路線）',
      'yue-Hant': '斯科特上校（英國「新地號」人力拉雪橇衝極點同採集古化石悲壯路線）',
      pt: 'Cap. Robert Falcon Scott (Expedição Britânica Terra Nova)',
      es: 'Cap. Robert Falcon Scott (Expedición Británica Terra Nova)'
    },
    vesselOrBase: {
      en: 'Cape Evans (HSM-16) → Ross Ice Shelf → Beardmore Glacier → 90°S → One Ton Camp',
      'zh-CN': '埃文斯角（HSM-16）→ 罗斯冰架 → 比尔德莫尔冰川（采集化石）→ 90°S → 最后营地',
      'zh-TW': '埃文斯角（HSM-16）→ 羅斯冰架 → 比爾德莫爾冰川（採集化石）→ 90°S → 最後營地',
      'yue-Hant': '羅斯島埃文斯角木屋（HSM-16）→ 羅斯冰架 → 比爾德莫爾冰川執化石 → 90°S → 最後營地',
      pt: 'Cabo Evans (HSM-16) → Plataforma Ross → Geleira Beardmore → 90°S',
      es: 'Cabo Evans (HSM-16) → Barrera de Ross → Glaciar Beardmore → 90°S'
    },
    summary: {
      en: 'Combining polar exploration with comprehensive geology and meteorology, Scott’s 5-man Polar Party man-hauled up Beardmore Glacier to reach 90°S on 17 Jan 1912, perishing in anomalous -40°C blizzards just 11 miles from One Ton Depot.',
      'zh-CN': '兼具极点冲刺与系统地质气象考察使命：斯科特五人极点小队靠人力挽曳雪橇攀上比尔德莫尔大冰川，于 1912 年 1 月 17 日抵达南极点；归途遭遇反常 -40°C 狂风暴雪，倒在距“一吨补给站”仅 11 英里处。',
      'zh-TW': '兼顧極點探索與地質考察：斯科特五人隊人力拖曳雪橇攀上比爾德莫爾冰川，1912 年 1 月 17 日抵達極點；歸途遇反常零下 40°C 暴雪，長眠於距補給站僅 11 英里處。',
      'yue-Hant': '一路行一路做足科學考察嘅悲壯遠征：斯科特五個人用雙腳人力拉雪橇爬上比爾德莫爾大冰川，1912 年 1 月 17 日去到極點見到挪威黑旗；回程撞正反常零下四十度暴風雪，喺距離「一噸糧倉」只差 11 英里嘅地方長眠冰原。',
      pt: 'Unindo exploração e geologia, a equipe de 5 homens chegou a 90°S em 17 jan 1912 e pereceu a apenas 11 milhas do depósito no retorno.',
      es: 'Combinando exploración y ciencia, los 5 hombres alcanzaron los 90°S el 17 ene 1912 y perecieron a solo 11 millas del depósito al regresar.'
    },
    stops: [
      {
        dateLabel: '1911-11-01',
        lat: -77.64,
        lon: 166.42,
        title: {
          en: 'March South from Cape Evans Hut (Ross Island, HSM-16)',
          'zh-CN': '自罗斯岛埃文斯角木屋（HSM-16）向南踏上罗斯冰架',
          'zh-TW': '自羅斯島埃文斯角木屋（HSM-16）南下踏上羅斯冰架',
          'yue-Hant': '由羅斯島埃文斯角木屋（HSM-16）出發踏上漫長羅斯冰架',
          pt: 'Partida da Cabana de Cabo Evans (Ilha de Ross, HSM-16)',
          es: 'Salida desde la Cabaña de Cabo Evans (Isla de Ross, HSM-16)'
        },
        note: {
          en: 'Motor sledges failed early; ponies hauled to the glacier foot before men took the harnesses.',
          'zh-CN': '早期试验履带摩托雪橇故障后，依靠矮种马行至山麓再转为纯人力挽曳。',
          'zh-TW': '早期動力雪橇故障後，行至山麓轉為純人力拖曳雪橇攀冰。',
          'yue-Hant': '試驗性質嘅摩打雪橇好快壞咗，行到山腳之後五個隊員要全程用自己身體拉住幾百磅雪橇上山。',
          pt: 'Após falha dos trenós motorizados, seguiram em tração humana.',
          es: 'Tras fallar los trineos motorizados, continuaron tirando a pie.'
        }
      },
      {
        dateLabel: '1911-12-10',
        lat: -84.33,
        lon: 166.15,
        title: {
          en: 'Man-Hauling Up 160 km Beardmore Glacier & Fossil Discovery',
          'zh-CN': '人力攀登 160 公里比尔德莫尔冰川并于归途岩壁采获舌羊齿化石',
          'zh-TW': '人力攀登 160 公里比爾德莫爾冰川並採集岡瓦納舌羊齒化石',
          'yue-Hant': '人力拉雪橇爬上 160 公里長大冰川，回程仲特登停低鑿出 16 公斤岡瓦納古樹葉化石',
          pt: 'Subida da Geleira Beardmore e Coleta de Fósseis do Gondwana',
          es: 'Ascenso del Glaciar Beardmore y Recolección de Fósseis de Gondwana'
        },
        note: {
          en: 'Dr. Edward Wilson sketched geological strata and collected 16 kg of Permian plant fossils.',
          'zh-CN': '首席科学家威尔逊博士在严寒中手绘地质剖面并采集 16 公斤二叠纪古植物岩石标本。',
          'zh-TW': '威爾遜博士於嚴寒中繪製地層剖面並採集 16 公斤古植物岩石標本。',
          'yue-Hant': '科學家威爾遜博士凍到手指僵晒都堅持畫低地層圖同執滿 16 公斤古植物化石放上雪橇。',
          pt: 'Edward Wilson coletou 16 kg de fósseis vegetais permianos fundamentais.',
          es: 'Edward Wilson recolectó 16 kg de fósiles vegetales pérmicos decisivos.'
        }
      },
      {
        dateLabel: '1912-01-17',
        lat: -90.0,
        lon: 0.0,
        title: {
          en: 'Scott, Wilson, Oates, Bowers & Evans Reach 90°S to Find Amundsen’s Tent',
          'zh-CN': '五人小队抵达 90°S 南极点，目睹先行一步的挪威黑旗与帐篷',
          'zh-TW': '五人小隊抵達 90°S 南極點，目睹阿蒙森留下的挪威旗幟與帳篷',
          'yue-Hant': '五個人千辛萬苦行到 90°S，卻見到雪地上面已經插住阿蒙森留低嘅挪威旗',
          pt: 'Grupo Polar de 5 Homens Atinge 90°S e Encontra a Tenda de Amundsen',
          es: 'El Grupo Polar de 5 Hombres Alcanza los 90°S y Halla la Tienda de Amundsen'
        },
        note: {
          en: '“Great God! This is an awful place…” wrote Scott before turning north on an 800-mile return march.',
          'zh-CN': '斯科特在日记写下“天啊！真是个可怕的地方”，随即转身踏上八百英里风雪归途。',
          'zh-TW': '斯科特於日記感嘆後，隨即踏上八百英里酷寒歸途。',
          'yue-Hant': '斯科特喺日記嘆咗句「呢度真係個可怕嘅地方」，影完張五人合照就轉身頂住逆風踏上八百英里歸途。',
          pt: 'Iniciaram imediatamente a marcha de retorno de 800 milhas sob frio extremo.',
          es: 'Iniciaron de inmediato la marcha de regreso de 800 millas bajo frío extremo.'
        }
      },
      {
        dateLabel: '1912-03-29',
        lat: -79.63,
        lon: 169.3,
        title: {
          en: 'Final Camp on Ross Ice Shelf & Observation Hill Cross (HSM-20)',
          'zh-CN': '罗斯冰架最后营地（距一吨补给站 11 英里）与观测山木十字架（HSM-20）',
          'zh-TW': '羅斯冰架最後營地（距一噸補給站 11 英里）與觀測山十字架（HSM-20）',
          'yue-Hant': '羅斯冰架最後帳篷（離糧倉只差 11 英里）同「努力、尋求、發現、永不屈服」紀念十字架',
          pt: 'Acampamento Final na Plataforma Ross e Cruz de Observation Hill (HSM-20)',
          es: 'Campamento Final en la Barrera de Ross y Cruz de Observation Hill (HSM-20)'
        },
        note: {
          en: 'Search party found their journals and 16 kg of fossils in Nov 1912; inscribed on HSM-20: “To strive, to seek, to find, and not to yield.”',
          'zh-CN': '1912 年 11 月搜救队寻获绝笔日记与珍贵化石；罗斯岛观测山十字架（HSM-20）镌刻丁尼生诗句：“努力、追寻、发现，永不屈服”。',
          'zh-TW': '1912 年 11 月搜救隊尋獲日記與化石；觀測山十字架（HSM-20）銘刻：「努力、追尋、發現，永不屈服」。',
          'yue-Hant': '同年 11 月搜救隊搵返佢哋嘅日記同化石；隊友喺羅斯島山頂立起十字架（HSM-20），刻住名句：「努力、追尋、發現，永不屈服」。',
          pt: 'Diários e fósseis resgatados em nov/1912; inscrição eterna no HSM-20.',
          es: 'Diarios y fósiles recuperados en nov/1912; inscripción inmortal en el HSM-20.'
        }
      }
    ],
    sourceUrl: 'https://ukaht.org/latest-news/historic-sites-and-monuments-in-antarctica/'
  }
];

export const SCIENTIFIC_DATA_SOURCES = [
  {
    id: 'open-meteo',
    label: 'Open-Meteo ECMWF IFS & Marine API',
    url: 'https://open-meteo.com/en/docs'
  },
  {
    id: 'amrdc',
    label: 'UW-Madison AMRDC AWS Network',
    url: 'https://amrdc.ssec.wisc.edu/'
  },
  {
    id: 'nasa-gibs',
    label: 'NASA Earthdata GIBS (EPSG:3031)',
    url: 'https://nasa-gibs.github.io/gibs-api-docs/access-basics/'
  },
  {
    id: 'nsidc',
    label: 'NSIDC Sea Ice Index v4',
    url: 'https://nsidc.org/data/g02135/versions/4'
  },
  {
    id: 'bas-bedmap3',
    label: 'British Antarctic Survey Bedmap3',
    url: 'https://www.bas.ac.uk/project/bedmap3/'
  },
  {
    id: 'scar-geomap',
    label: 'SCAR GeoMAP (GNS Science)',
    url: 'https://www.gns.cri.nz/data-and-resources/geomap-geological-mapping-of-antarctica/'
  },
  {
    id: 'comnap',
    label: 'COMNAP Antarctic Facilities',
    url: 'https://www.comnap.aq/antarctic-facilities-information'
  },
  {
    id: 'scar-cga',
    label: 'SCAR Composite Gazetteer (CGA)',
    url: 'https://placenames.aq/'
  },
  {
    id: 'ats-hsm',
    label: 'Antarctic Treaty HSM Registry',
    url: 'https://www.ecfr.gov/current/title-45/subtitle-B/chapter-VI/part-670/subpart-F/section-670.29'
  },
  {
    id: 'iaato',
    label: 'IAATO Visitor Guidelines',
    url: 'https://iaato.org/visiting-antarctica/visitor-guidelines-library'
  }
] as const;
