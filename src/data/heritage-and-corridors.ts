import type { ExpeditionCorridor, HistoricMonument } from '@/lib/types';

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
          en: 'Southernmost expedition port in Tierra del Fuego, Argentina.',
          'zh-CN': '阿根廷火地岛世界最南端极地母港。',
          'zh-TW': '阿根廷火地島世界最南端極地母港。',
          'yue-Hant': '阿根廷火地島最南端嘅南極船出發碼頭。',
          pt: 'Porto de expedição mais austral na Terra do Fogo, Argentina.',
          es: 'Puerto antártico más austral en Tierra del Fuego, Argentina.'
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
          'zh-CN': '南极绕极流最窄咽喉水道，冷暖洋流交汇带来海水温度骤降与信天翁伴飞。',
          'zh-TW': '南極繞極流最窄咽喉水道，冷暖洋流交匯帶來海溫驟降與海鳥聚集。',
          'yue-Hant': '南極繞極流最窄嘅風浪關口，過咗呢條冷暖水交界線就正式踏入南極生態圈。',
          pt: 'Estreito da Corrente Circumpolar Antártica onde águas polares encontram mares subantárticos.',
          es: 'Estrecho de la Corriente Circumpolar Antártica donde convergen aguas polares y subantárticas.'
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
          'yue-Hant': '1944 年起落嘅英國歷史基地兼南極郵局，附近仲有兩邊成千米高花崗岩峭壁嘅利馬水道。',
          pt: 'Base histórica britânica de 1944 (correio polar) próxima aos paredões de granito do Canal Lemaire.',
          es: 'Base histórica británica de 1944 (correo austral) junto a los acantilados graníticos del Canal Lemaire.'
        }
      },
      {
        id: 'paulet-weddell',
        name: {
          en: 'Antarctic Sound & Paulet Island (Weddell Sea, HSM-41)',
          'zh-CN': '南极海峡与威德尔海保莱特岛（HSM-41）',
          'zh-TW': '南極海峽與威德爾海保萊特島（HSM-41）',
          'yue-Hant': '南極海峽同威德爾海保萊特島石屋（HSM-41）',
          pt: 'Estreito Antártico e Ilha Paulet (Mar de Weddell, HSM-41)',
          es: 'Estrecho Antártico e Isla Paulet (Mar de Weddell, HSM-41)'
        },
        lat: -63.58,
        lon: -55.78,
        category: 'heritage',
        highlight: {
          en: 'Volcanic cone in the northwestern Weddell Sea preserving the 1903 Nordenskjöld expedition stone survival hut (HSM-41) and vast Adélie penguin rookeries.',
          'zh-CN': '威德尔海西北门户火山锥岛，留存 1903 年瑞典探险队沉船求生石屋（HSM-41）及庞大的阿德利企鹅栖息地。',
          'zh-TW': '威德爾海西北門戶火山錐島，留存 1903 年瑞典探險隊沉船求生石屋（HSM-41）及龐大的阿德利企鵝棲息地。',
          'yue-Hant': '威德爾海入口嘅火山島，留低咗 1903 年瑞典探險隊沉船之後砌石過冬嘅求生石屋（HSM-41），仲有成山頭嘅阿德利企鵝。',
          pt: 'Cone vulcânico no Mar de Weddell com a cabana de pedra de sobrevivência de 1903 (HSM-41) e colônias de pinguins-de-adélia.',
          es: 'Cono volcánico en el Mar de Weddell con la cabaña de piedra de 1903 (HSM-41) y grandes colonias de pingüinos Adelia.'
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
      en: 'Deep-south expedition crossing 180° meridian into the Ross Ice Shelf front, visiting Borchgrevink’s 1899 hut (HSM-22), Shackleton’s Cape Royds hut (HSM-15), and Scott’s Cape Evans hut (HSM-16).',
      'zh-CN': '深入南纬 77° 罗斯冰架前缘的远征走廊，跨越 180° 经线探访博克格雷温克（HSM-22）、沙克尔顿（HSM-15）与斯科特（HSM-16）百年探险木屋。',
      'zh-TW': '深入南緯 77° 羅斯冰架前緣的遠征走廊，跨越 180° 經線探訪博克格雷溫克（HSM-22）、沙克爾頓（HSM-15）與斯科特（HSM-16）百年探險木屋。',
      'yue-Hant': '直入南緯 77 度羅斯冰架邊緣嘅遠征航線，跨過 180 度經線去睇沙克爾頓（HSM-15）同斯科特（HSM-16）百幾年前留低嘅探險木屋。',
      pt: 'Expedição ao extremo sul cruzando o meridiano 180° até a Plataforma de Gelo Ross e as cabanas históricas HSM-15 e HSM-16.',
      es: 'Expedición al extremo sur cruzando el meridiano 180° hasta la Barrera de Hielo de Ross y las cabañas históricas HSM-15 y HSM-16.'
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
        id: 'ross-island-huts',
        name: {
          en: 'Ross Island: Cape Royds & Cape Evans (HSM-15 / HSM-16)',
          'zh-CN': '罗斯岛：罗伊兹角与埃文斯角木屋（HSM-15 / HSM-16）',
          'zh-TW': '羅斯島：羅伊茲角與埃文斯角木屋（HSM-15 / HSM-16）',
          'yue-Hant': '羅斯島：沙克爾頓同斯科特探險木屋（HSM-15 / HSM-16）',
          pt: 'Ilha de Ross: Cabo Royds e Cabo Evans (HSM-15 / HSM-16)',
          es: 'Isla de Ross: Cabo Royds y Cabo Evans (HSM-15 / HSM-16)'
        },
        lat: -77.636,
        lon: 166.417,
        category: 'heritage',
        highlight: {
          en: 'Preserved time-capsule expedition bases of Sir Ernest Shackleton (1908) and Capt. Robert Falcon Scott (1911).',
          'zh-CN': '如同时间胶囊般完好保存的沙克尔顿（1908）与斯科特（1911）冲击南极点大本营。',
          'zh-TW': '宛如時光膠囊般完好保存的沙克爾頓（1908）與斯科特（1911）衝擊南極點大本營。',
          'yue-Hant': '入面啲罐頭同科研儀器仲原封不動留喺度，好似時光膠囊咁紀錄住沙克爾頓同斯科特當年衝刺南極點嘅歷史。',
          pt: 'Bases preservadas como cápsulas do tempo de Ernest Shackleton (1908) e Robert Falcon Scott (1911).',
          es: 'Bases conservadas como cápsulas del tiempo de Ernest Shackleton (1908) y Robert Falcon Scott (1911).'
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
      en: 'Airborne inland polar route landing on the blue-ice runway of Ellsworth Mountains before ascending the high Polar Plateau to 90°S.',
      'zh-CN': '内陆航空考察走廊：自智利蓬塔阿雷纳斯飞抵埃尔斯沃思山脉联合冰川蓝冰跑道，再跃升至海拔 2,835 米的地理南极点高原。',
      'zh-TW': '內陸航空考察走廊：自智利蓬塔阿雷納斯飛抵埃爾斯沃思山脈聯合冰川藍冰跑道，再躍升至海拔 2,835 公尺的地理南極點高原。',
      'yue-Hant': '內陸飛機探險路線：由智利蓬塔阿雷納斯直飛埃爾斯沃思山脈天然藍冰跑道，再轉內陸機飛上 90 度地理南極點。',
      pt: 'Rota aérea interior pousando na pista de gelo azul dos Montes Ellsworth rumo ao Planalto Polar a 90°S.',
      es: 'Ruta aérea interior aterrizando en la pista de hielo azul de los Montes Ellsworth hacia la Meseta Polar en 90°S.'
    },
    waypoints: [
      {
        id: 'union-glacier',
        name: {
          en: 'Union Glacier Blue-Ice Camp (Ellsworth Mountains)',
          'zh-CN': '联合冰川蓝冰营地（埃尔斯沃思山脉）',
          'zh-TW': '聯合冰川藍冰營地（埃爾斯沃思山脈）',
          'yue-Hant': '聯合冰川藍冰跑道營地（埃爾斯沃思山脈）',
          pt: 'Acampamento de Gelo Azul Union Glacier',
          es: 'Campamento Glaciar Unión (Montes Ellsworth)'
        },
        lat: -79.768,
        lon: -82.856,
        category: 'landing',
        highlight: {
          en: 'Natural katabatic-swept blue-ice runway near Vinson Massif (4,892 m, Antarctica’s highest peak).',
          'zh-CN': '天然下降风吹蚀形成的蓝冰跑道，毗邻南极最高峰文森峰（海拔 4,892 米）。',
          'zh-TW': '天然下降風吹蝕形成的藍冰跑道，毗鄰南極最高峰文森峰（海拔 4,892 公尺）。',
          'yue-Hant': '靠強勁下降風吹走積雪形成嘅天然堅硬藍冰跑道，隔離就係成座南極最高嘅文森峰（4,892 米）。',
          pt: 'Pista natural de gelo azul próxima ao Maciço Vinson (4.892 m, ponto mais alto da Antártida).',
          es: 'Pista natural de hielo azul cercana al Macizo Vinson (4.892 m, cumbre más alta de la Antártida).'
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
    era: 'heroic-age',
    year: 1915,
    lat: -68.74,
    lon: -52.33,
    proposingParties: 'United Kingdom',
    summary: {
      en: 'Crushed by Weddell Sea pack ice in November 1915 during the Imperial Trans-Antarctic Expedition and rediscovered upright at 3,008 m depth in March 2022.',
      'zh-CN': '1915 年 11 月在大英帝国横穿南极探险中被威德尔海密集浮冰挤压沉没（全员 28 人史诗生还），2022 年 3 月于水下 3,008 米处完好重现并列入受保护纪念物。',
      'zh-TW': '1915 年 11 月在大英帝國橫穿南極探險中被威德爾海浮冰擠壓沉沒（全員 28 人奇蹟生還），2022 年 3 月於水下 3,008 公尺處重現並列入受保護紀念物。',
      'yue-Hant': '1915 年 11 月俾威德爾海厚浮冰夾爆沉沒，但沙克爾頓帶領全船 28 人奇蹟生還；到 2022 年 3 月喺三千幾米海底搵返隻幾乎完好無缺嘅木船。',
      pt: 'Esmagado pelo gelo do Mar de Weddell em 1915 na expedição de Shackleton e redescoberto intacto a 3.008 m de profundidade em 2022.',
      es: 'Atrapado por el hielo del Mar de Weddell en 1915 durante la expedición de Shackleton y hallado intacto a 3.008 m de profundidad en 2022.'
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
      'zh-CN': '1903 年 2 月诺登舍尔德瑞典南极探险队座船“南极号”冰碎沉没后，拉尔森船长率 20 名船员用玄武岩垒筑越冬并最终获救的历史石屋。',
      'zh-TW': '1903 年 2 月諾登舍爾德瑞典南極探險隊座船「南極號」沉沒後，拉爾森船長率 20 名船員以玄武岩壘築越冬並獲救的歷史石屋。',
      'yue-Hant': '1903 年 2 月「南極號」沉船之後，拉爾森船長帶住廿個船員就地取材用火山玄武岩砌屋捱過嚴冬，最後成功獲救。',
      pt: 'Construída em fevereiro de 1903 com rochas basálticas pelos sobreviventes do navio Antarctic sob comando do Cap. Carl Anton Larsen.',
      es: 'Construida en febrero de 1903 con rocas basálticas por los náufragos del buque Antarctic al mando del capitán Carl Anton Larsen.'
    },
    sourceUrl: 'https://documents.ats.aq/cep/handbook/List%20of%20HSMs%202010_e.pdf'
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
      'zh-CN': '分别建于罗伊兹角（1908）与埃文斯角（1911）的标志性木结构科考探险基地，封存着上万件百年前的科学仪器、补给罐头与手稿遗物。',
      'zh-TW': '分別建於羅伊茲角（1908）與埃文斯角（1911）的標誌性木構探險基地，封存著上萬件百年前的科學儀器與補給遺物。',
      'yue-Hant': '分別喺 1908 同 1911 年起喺羅斯島嘅兩座木屋基地，由於極地又凍又乾，入面成萬件百年前嘅科研儀器同食物補給都保存得好完整。',
      pt: 'Bases históricas de madeira em Cabo Royds (1908) e Cabo Evans (1911) preservando milhares de artefatos científicos originais.',
      es: 'Bases históricas de madera en Cabo Royds (1908) y Cabo Evans (1911) que preservan miles de instrumentos científicos originales.'
    },
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
