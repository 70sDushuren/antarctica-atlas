import type {
  GazetteerEntry,
  PolarGeologicalSite,
  PolarMacroRegion,
  SubglacialTransectPreset
} from '@/lib/types';

export const SUBGLACIAL_TRANSECT_PRESETS: SubglacialTransectPreset[] = [
  {
    id: 'trans-continental-bentley-domea',
    name: {
      en: 'Trans-Antarctic: Bentley Trench (-2,555 m) → South Pole → Dome A & Gamburtsev Mts',
      'zh-CN': '横跨东西南极：本特利冰下海沟 (-2,555 m) → 南极点 → 冰穹 A 与甘布尔泽夫山脉',
      'zh-TW': '橫跨東西南極：本特利冰下海溝 (-2,555 m) → 南極點 → 冰穹 A 與甘布爾澤夫山脈',
      'yue-Hant': '橫跨東西南極：本特利海底級深溝 (-2,555 m) → 南極點 → 冰穹 A 同冰下甘布爾澤夫山脈',
      pt: 'Transantártico: Fossa Bentley (-2.555 m) → Polo Sul → Domo A e Montanhas Gamburtsev',
      es: 'Transantártico: Fosa Bentley (-2.555 m) → Polo Sur → Domo A y Montes Gamburtsev'
    },
    summary: {
      en: 'Contrasts West Antarctica’s deep sub-sea-level marine rift basin against East Antarctica’s ancient craton and buried alpine peaks.',
      'zh-CN': '直观对比西南极海平面以下深邃裂谷盆地（海洋性冰盖）与东南极古老陆核及冰封千米的甘布尔泽夫高山。',
      'zh-TW': '直觀對比西南極海平面以下深邃裂谷盆地（海洋性冰蓋）與東南極古老克拉通地盾及冰封高山。',
      'yue-Hant': '一線睇清西南極低過海平面兩千幾米嘅海洋性冰底，同埋東南極厚冰下面藏住嘅高聳古山脈有幾大分別。',
      pt: 'Contrasta a profunda bacia marinha subglacial da Antártida Ocidental com o antigo cráton e os picos alpinos soterrados do Leste.',
      es: 'Contrasta la profunda cuenca marina subglacial de la Antártida Occidental con el antiguo cratón y las cumbres sepultadas del Este.'
    },
    pointA: {
      lat: -80.0,
      lon: -115.0,
      label: {
        en: 'Bentley Trench (WAIS)',
        'zh-CN': '本特利海沟 (西南极)',
        'zh-TW': '本特利海溝 (西南極)',
        'yue-Hant': '本特利深溝 (西南極)',
        pt: 'Fossa Bentley (Oeste)',
        es: 'Fosa Bentley (Oeste)'
      }
    },
    pointB: {
      lat: -80.42,
      lon: 77.12,
      label: {
        en: 'Dome A / Gamburtsev (EAIS)',
        'zh-CN': '冰穹 A / 甘布尔泽夫 (东南极)',
        'zh-TW': '冰穹 A / 甘布爾澤夫 (東南極)',
        'yue-Hant': '冰穹 A / 甘布爾澤夫山 (東南極)',
        pt: 'Domo A / Gamburtsev (Leste)',
        es: 'Domo A / Gamburtsev (Este)'
      }
    }
  },
  {
    id: 'thwaites-transantarctic-mcmurdo',
    name: {
      en: 'Marine Instability: Thwaites Grounding Zone → West Rift → Transantarctic Mts → Ross Sea',
      'zh-CN': '海洋冰盖不稳定性：思韦茨冰川接地线 → 西南极裂谷 → 横贯南极山脉 → 麦克默多',
      'zh-TW': '海洋冰蓋不穩定性：思韋茨冰川接地線 → 西南極裂谷 → 橫貫南極山脈 → 麥克默多',
      'yue-Hant': '海洋冰蓋危機線：思韋茨「末日冰川」接地帶 → 西南極裂谷 → 橫貫南極山脈 → 麥克默多',
      pt: 'Instabilidade Marinha: Geleira Thwaites → Rifte Ocidental → Montes Transantárticos → Ross',
      es: 'Inestabilidad Marina: Glaciar Thwaites → Rift Occidental → Montes Transantárticos → Ross'
    },
    summary: {
      en: 'Reveals retrograde sub-sea-level bedrock beneath Thwaites Glacier before climbing the faulted Transantarctic Mountains scarp.',
      'zh-CN': '揭示思韦茨冰川下方内倾且低于海平面的脆弱基岩床，随后跃升跨越横贯南极山脉断层陡崖抵达罗斯海。',
      'zh-TW': '揭示思韋茨冰川下方內傾且低於海平面的脆弱基岩床，隨後躍升跨越橫貫南極山脈斷層陡崖抵達羅斯海。',
      'yue-Hant': '清楚見到思韋茨冰川底下越入內陸越深嘅逆向海底斜坡，跟住一嘢爬上橫貫南極山脈大斷層去到羅斯海。',
      pt: 'Revela o leito retrógrado abaixo do nível do mar sob a Geleira Thwaites até a escarpa dos Montes Transantárticos.',
      es: 'Revela el lecho retrógrado bajo el nivel del mar del Glaciar Thwaites hasta el escarpe de los Montes Transantárticos.'
    },
    pointA: {
      lat: -75.1,
      lon: -106.7,
      label: {
        en: 'Thwaites Margin',
        'zh-CN': '思韦茨冰川前缘',
        'zh-TW': '思韋茨冰川前緣',
        'yue-Hant': '思韋茨冰川口',
        pt: 'Margem Thwaites',
        es: 'Frente Thwaites'
      }
    },
    pointB: {
      lat: -77.85,
      lon: 166.67,
      label: {
        en: 'Ross Island (McMurdo)',
        'zh-CN': '罗斯岛 (麦克默多)',
        'zh-TW': '羅斯島 (麥克默多)',
        'yue-Hant': '羅斯島 (麥克默多)',
        pt: 'Ilha de Ross (McMurdo)',
        es: 'Isla de Ross (McMurdo)'
      }
    }
  },
  {
    id: 'prydz-vostok-domec',
    name: {
      en: 'Subglacial Lakes & Deep Ice Cores: Prydz Bay (Zhongshan) → Lake Vostok → Dome C',
      'zh-CN': '冰下巨湖与深冰芯：普里兹湾中山站 → 沃斯托克冰下湖 → 冰穹 C 康考迪亚',
      'zh-TW': '冰下巨湖與深冰芯：普里茲灣中山站 → 沃斯托克冰下湖 → 冰穹 C 康考迪亞',
      'yue-Hant': '冰下巨湖同百萬年冰芯線：普里茲灣中山站 → 沃斯托克冰下湖 → 冰穹 C 康考迪亞',
      pt: 'Lagos Subglaciais e Testemunhos: Baía Prydz → Lago Vostok → Domo C (Concordia)',
      es: 'Lagos Subglaciales y Testigos de Hielo: Bahía Prydz → Lago Vostok → Domo C'
    },
    summary: {
      en: 'Ascends the East Antarctic Ice Sheet across the 4,000 m-deep tectonic trough of Lake Vostok to the 1.2-million-year Dome C ice-core dome.',
      'zh-CN': '自普里兹湾海岸攀升进入东南极高原腹地，穿过冰层厚近 4,000 米的沃斯托克构造湖盆直抵百万年古气候冰芯钻探区冰穹 C。',
      'zh-TW': '自普里茲灣海岸攀升進入東南極高原腹地，穿過冰層厚近 4,000 公尺的沃斯托克構造湖盆直抵百萬年深冰芯區冰穹 C。',
      'yue-Hant': '由海岸中山站一路爬上東南極大冰原，經過四千米厚冰封住嘅沃斯托克大湖槽，再去到鑽出百萬年冰芯嘅冰穹 C。',
      pt: 'Sobe o manto oriental cruzando a fossa tectônica do Lago Vostok sob 4.000 m de gelo até o Domo C.',
      es: 'Asciende el manto oriental cruzando la fosa tectónica del Lago Vostok bajo 4.000 m de hielo hasta el Domo C.'
    },
    pointA: {
      lat: -69.37,
      lon: 76.37,
      label: {
        en: 'Prydz Bay (Zhongshan)',
        'zh-CN': '普里兹湾 (中山站)',
        'zh-TW': '普里茲灣 (中山站)',
        'yue-Hant': '普里茲灣 (中山站)',
        pt: 'Baía Prydz (Zhongshan)',
        es: 'Bahía Prydz (Zhongshan)'
      }
    },
    pointB: {
      lat: -75.1,
      lon: 123.33,
      label: {
        en: 'Dome C (Concordia)',
        'zh-CN': '冰穹 C (康考迪亚)',
        'zh-TW': '冰穹 C (康考迪亞)',
        'yue-Hant': '冰穹 C (康考迪亞)',
        pt: 'Domo C (Concordia)',
        es: 'Domo C (Concordia)'
      }
    }
  },
  {
    id: 'peninsula-cordillera-weddell',
    name: {
      en: 'Andean Fold Belt: Palmer Archipelago → Antarctic Peninsula Spine → Weddell Basin',
      'zh-CN': '安第斯南延褶皱带：帕尔默群岛 → 南极半岛花岗岩脊线 → 威德尔海盆地',
      'zh-TW': '安第斯南延褶皺帶：帕爾默群島 → 南極半島花崗岩脊線 → 威德爾海盆地',
      'yue-Hant': '南極半島山脊橫切線：帕爾默群島 → 半島花崗岩高山脊 → 威德爾海冰盆',
      pt: 'Cinturão Andino Polar: Arquipélago Palmer → Cordilheira da Península → Bacia de Weddell',
      es: 'Cordón Andino Austral: Archipiélago Palmer → Cordillera de la Península → Cuenca de Weddell'
    },
    summary: {
      en: 'Crosses the steep Mesozoic-Cenozoic magmatic arc of the Antarctic Peninsula into the cold shelf waters of the Weddell Sea.',
      'zh-CN': '横切中—新生代岩浆弧隆起的南极半岛陡峭山脊，直观呈现西岸温暖峡湾向东岸寒冷威德尔海陆架的地形跃变。',
      'zh-TW': '橫切中—新生代岩漿弧隆起的南極半島陡峭山脊，呈現西岸溫暖峽灣向東岸寒冷威德爾海陸架的地形躍變。',
      'yue-Hant': '橫切南極半島好似魚脊骨咁企嘅花崗岩山脈，睇勻西岸峽灣同東面結滿浮冰嘅威德爾海大陸架地形落差。',
      pt: 'Cruza o íngreme arco magmático da Península Antártica até a plataforma continental fria do Mar de Weddell.',
      es: 'Cruza el abrupto arco magmático de la Península Antártica hacia la plataforma continental fría del Mar de Weddell.'
    },
    pointA: {
      lat: -64.77,
      lon: -64.05,
      label: {
        en: 'Anvers Is. (Palmer)',
        'zh-CN': '昂韦尔岛 (帕尔默)',
        'zh-TW': '昂韋爾島 (帕爾默)',
        'yue-Hant': '昂韋爾島 (半島西岸)',
        pt: 'Ilha Anvers (Palmer)',
        es: 'Isla Amberes (Palmer)'
      }
    },
    pointB: {
      lat: -68.74,
      lon: -52.33,
      label: {
        en: 'Weddell Basin (Endurance)',
        'zh-CN': '威德尔海盆 (坚忍号海域)',
        'zh-TW': '威德爾海盆 (堅忍號海域)',
        'yue-Hant': '威德爾海深盆 (堅忍號海域)',
        pt: 'Bacia de Weddell (Endurance)',
        es: 'Cuenca de Weddell (Endurance)'
      }
    }
  }
];

export const POLAR_GEOLOGICAL_SITES: PolarGeologicalSite[] = [
  {
    id: 'mount-erebus',
    category: 'volcano',
    name: {
      en: 'Mount Erebus Active Lava Lake (Ross Island)',
      'zh-CN': '埃里伯斯活火山与永久熔岩湖（罗斯岛）',
      'zh-TW': '埃里伯斯活火山與永久熔岩湖（羅斯島）',
      'yue-Hant': '埃里伯斯活火山同埋滾緊嘅永久熔岩湖（羅斯島）',
      pt: 'Monte Erebus e Lago de Lava Ativo (Ilha de Ross)',
      es: 'Monte Erebus y Lago de Lava Activo (Isla de Ross)'
    },
    geologicAge: {
      en: 'Quaternary (~1.3 Ma – Present)',
      'zh-CN': '第四纪（约 130 万年前至今）',
      'zh-TW': '第四紀（約 130 萬年前至今）',
      'yue-Hant': '第四紀（大約 130 萬年前噴到而家）',
      pt: 'Quaternário (~1,3 Ma – Presente)',
      es: 'Cuaternario (~1,3 Ma – Presente)'
    },
    lat: -77.529,
    lon: 167.153,
    elevationOrDepthM: 3794,
    rockOrFeatureType: {
      en: 'Anorthoclase Phonolite Stratovolcano & Fumarolic Ice Towers',
      'zh-CN': '歪长石响岩质层状火山 · 喷气孔冰塔群',
      'zh-TW': '歪長石響岩質層狀火山 · 噴氣孔冰塔群',
      'yue-Hant': '響岩層狀活火山 · 地熱蒸汽結成嘅高聳冰煙囪',
      pt: 'Estratovulcão Fonolítico e Torres de Gelo Fumarólicas',
      es: 'Estratovolcán Fonolítico y Torres de Hielo Fumarólicas'
    },
    summary: {
      en: 'Earth’s southernmost active volcano (3,794 m), driven by West Antarctic Rift mantle upwelling and hosting one of the world’s few persistent convecting phonolite lava lakes.',
      'zh-CN': '地球最南端活火山（海拔 3,794 米），受西南极裂谷系地幔热柱上涌驱动，火山口内保存着全球罕见的持续对流响岩质熔岩湖与壮观蒸汽冰塔。',
      'zh-TW': '地球最南端活火山（海拔 3,794 公尺），受西南極裂谷系地函上湧驅動，火山口內擁有全球罕見的持久對流響岩熔岩湖與地熱冰塔。',
      'yue-Hant': '全地球最南邊嘅活火山（3,794 米高），由西南極地幔熱流頂起，零下幾十度嘅山頂火山口入面竟然長年滾住一湖過千度嘅熔岩，噴出嚟嘅熱氣仲結成幾層樓高嘅冰煙囪。',
      pt: 'O vulcão ativo mais austral da Terra (3.794 m), alimentado pelo Rifte Antártico Ocidental com um raro lago permanente de lava fonolítica.',
      es: 'El volcán activo más austral de la Tierra (3.794 m), impulsado por el Rift Antártico Occidental con un lago permanente de lava fonolítica.'
    },
    sourceUrl: 'https://www.gns.cri.nz/data-and-resources/geomap-geological-mapping-of-antarctica/'
  },
  {
    id: 'deception-caldera',
    category: 'volcano',
    name: {
      en: 'Deception Island Submarine-Flooded Caldera',
      'zh-CN': '欺骗岛海水灌入型活破火山口',
      'zh-TW': '欺騙島海水灌入型活破火山口',
      'yue-Hant': '欺騙島海水倒灌馬蹄形活火山口',
      pt: 'Caldeira Submersa Ativa da Ilha Decepção',
      es: 'Caldera Volcánica Activa de Isla Decepción'
    },
    geologicAge: {
      en: 'Pleistocene–Holocene (Eruptions in 1967, 1969, 1970)',
      'zh-CN': '更新世—全新世（1967、1969、1970 年多次喷发）',
      'zh-TW': '更新世—全新世（1967、1969、1970 年多次噴發）',
      'yue-Hant': '更新世到現代（1967 至 1970 年先至連續爆發過）',
      pt: 'Pleistoceno–Holoceno (Erupções em 1967, 1969 e 1970)',
      es: 'Pleistoceno–Holoceno (Erupciones en 1967, 1969 y 1970)'
    },
    lat: -62.978,
    lon: -60.652,
    elevationOrDepthM: 539,
    rockOrFeatureType: {
      en: 'Back-Arc Spreading Basaltic-Andesite Collapse Caldera',
      'zh-CN': '布兰斯菲尔德弧后扩张带玄武安山质破火山口',
      'zh-TW': '布蘭斯菲爾德弧後擴張帶玄武安山質破火山口',
      'yue-Hant': '弧後海盆裂開形成嘅玄武安山岩陷落火山口',
      pt: 'Caldeira de Colapso Basáltico-Andesítica de Retroarco',
      es: 'Caldera de Colapso Basáltico-Andesítica de Trasarco'
    },
    summary: {
      en: 'Horseshoe-shaped restless caldera along the Bransfield Strait back-arc rift; ships sail directly into Port Foster over steaming geothermal black-sand beaches.',
      'zh-CN': '位于布兰斯菲尔德海峡弧后裂谷轴部，巨型火山锥塌陷后海水涌入形成天然内港，黑沙滩至今冒出滚烫地热蒸汽，曾在 1960 年代末摧毁岛上科考站。',
      'zh-TW': '位於布蘭斯菲爾德海峽弧後裂谷軸部，火山錐塌陷後海水湧入形成內灣，黑沙灘至今冒出地熱蒸氣，曾於 1960 年代末噴發損毀島上科考站。',
      'yue-Hant': '喺布蘭斯菲爾德海峽裂谷正中間，古火山爆完塌落去俾海水灌入變成馬蹄形內港；退潮嗰陣成個黑沙灘都冒晒熱氣，六十年代尾仲試過噴發沖毀島上基地。',
      pt: 'Caldeira ativa em forma de ferradura no rifte do Estreito de Bransfield; navios entram na cratera cercada por praias geotérmicas fumegantes.',
      es: 'Caldera activa en herradura sobre el rift de Bransfield; los buques navegan dentro del cráter junto a playas negras con vapor geotérmico.'
    },
    sourceUrl: 'https://scar.org/library-data/maps/geomap-geological-mapping'
  },
  {
    id: 'gamburtsev-subglacial',
    category: 'subglacial-tectonic',
    name: {
      en: 'Gamburtsev Subglacial Mountains (Beneath Dome A)',
      'zh-CN': '甘布尔泽夫冰下山脉（深埋冰穹 A 下方）',
      'zh-TW': '甘布爾澤夫冰下山脈（深埋冰穹 A 下方）',
      'yue-Hant': '甘布爾澤夫神秘冰下山脈（藏喺冰穹 A 底）',
      pt: 'Montanhas Subglaciais Gamburtsev (Sob o Domo A)',
      es: 'Montes Subglaciales Gamburtsev (Bajo el Domo A)'
    },
    geologicAge: {
      en: 'Proterozoic Suture / Permian–Cretaceous Rift Uplift, Iced ~34 Ma',
      'zh-CN': '元古宙碰撞造山带 · 约 3,400 万年前被冰盖永久封存',
      'zh-TW': '元古宙碰撞造山帶 · 約 3,400 萬年前被冰蓋永久封存',
      'yue-Hant': '遠古大陸碰撞隆起 · 三千四百萬年前開始俾厚冰原封存保鮮',
      pt: 'Sutura Proterozoica · Preservada sob gelo há ~34 Ma',
      es: 'Sutura Proterozoica · Preservada bajo el hielo desde hace ~34 Ma'
    },
    lat: -80.5,
    lon: 77.0,
    elevationOrDepthM: 2700,
    rockOrFeatureType: {
      en: 'Intracratonic Alpine Massif Sealed Under 1,500–3,000 m of Ice',
      'zh-CN': '克拉通腹地阿尔卑斯式锯齿高山（覆冰 1,500–3,000 米）',
      'zh-TW': '克拉通腹地阿爾卑斯式高山（覆冰 1,500–3,000 公尺）',
      'yue-Hant': '好似阿爾卑斯山咁尖削但成座埋喺兩三千米厚冰底嘅大山脈',
      pt: 'Maciço Alpino Intracratônico Sob 1.500–3.000 m de Gelo',
      es: 'Macizo Alpino Intracratónico Bajo 1.500–3.000 m de Hielo'
    },
    summary: {
      en: 'A 1,200 km-long European-Alps-sized mountain range completely invisible from the surface, where the East Antarctic Ice Sheet first nucleated 34 million years ago.',
      'zh-CN': '绵延 1,200 公里、规模堪比欧洲阿尔卑斯山却完全隐身于冰原之下的高山群，是距今约 3,400 万年前始新世—渐新世之交东南极冰盖最早成核发育的摇篮。',
      'zh-TW': '綿延 1,200 公里、規模堪比歐洲阿爾卑斯山卻完全隱沒於冰原之下的高山群，為 3,400 萬年前東南極冰蓋最初發育的核心搖籃。',
      'yue-Hant': '成條山脈有成千二公里長、規模拍得住歐洲阿爾卑斯山，但地面一粒石都睇唔到；三千四百萬年前地球變凍嗰陣，東南極大冰蓋就係由呢座山頂最先結冰擴展出去嘅。',
      pt: 'Cordilheira de 1.200 km do tamanho dos Alpes totalmente oculta sob o gelo, berço da glaciação antártica há 34 milhões de anos.',
      es: 'Cordillera de 1.200 km comparable a los Alpes totalmente oculta bajo el hielo, cuna de la glaciación antártica hace 34 millones de años.'
    },
    sourceUrl: 'https://www.bas.ac.uk/project/bedmap3/'
  },
  {
    id: 'bentley-trench',
    category: 'subglacial-tectonic',
    name: {
      en: 'Bentley Subglacial Trench (West Antarctic Rift)',
      'zh-CN': '本特利冰下海沟（西南极裂谷系深渊）',
      'zh-TW': '本特利冰下海溝（西南極裂谷系深淵）',
      'yue-Hant': '本特利冰下超深地溝（西南極裂谷底）',
      pt: 'Fossa Subglacial Bentley (Rifte Antártico Ocidental)',
      es: 'Fosa Subglacial Bentley (Rift Antártico Occidental)'
    },
    geologicAge: {
      en: 'Cretaceous–Cenozoic Crustal Extension',
      'zh-CN': '白垩纪—新生代地壳拉张裂陷盆地',
      'zh-TW': '白堊紀—新生代地殼拉張裂陷盆地',
      'yue-Hant': '白堊紀至新生代地殼拉裂凹陷形成嘅深槽',
      pt: 'Extensão Crustal Cretáceo–Cenozoica',
      es: 'Extensión Cortical Cretácico–Cenozoica'
    },
    lat: -80.0,
    lon: -115.0,
    elevationOrDepthM: -2555,
    rockOrFeatureType: {
      en: 'Marine-Grounded Continental Rift Basin (-2,555 m Below Sea Level)',
      'zh-CN': '海平面以下 -2,555 米大陆裂谷基底（上覆逾 4,000 米厚冰）',
      'zh-TW': '海平面以下 -2,555 公尺大陸裂谷基底（上覆逾 4,000 公尺厚冰）',
      'yue-Hant': '低過海平面足足 -2,555 米、上面壓住四千幾米厚冰嘅大陸裂谷深淵',
      pt: 'Bacia de Rifte Continental a -2.555 m Abaixo do Nível do Mar',
      es: 'Cuenca de Rift Continental a -2.555 m Bajo el Nivel del Mar'
    },
    summary: {
      en: 'One of the deepest non-oceanic land depressions on Earth (-2,555 m), filled entirely with glacial ice and illustrating why the West Antarctic Ice Sheet is vulnerable to warm ocean intrusion.',
      'zh-CN': '地球上未被海水直接覆盖的最深大陆构造凹陷之一（基岩深达海平面以下 2,555 米），被逾四千米巨厚冰体填满，直观揭示了西南极海洋性冰盖对暖水入侵的高度脆弱性。',
      'zh-TW': '地球上未被海水覆蓋的最深大陸構造凹陷之一（基岩深達海平面以下 2,555 公尺），為逾四千公尺厚冰填滿，體現西南極海洋性冰蓋的潛在脆弱性。',
      'yue-Hant': '除咗深海海溝之外全地球最深嘅陸地凹位之一（低過海平面 2,555 米），成個深坑俾四千幾米厚冰填滿晒；一旦暖海水攻入冰底，呢種低過海平面嘅冰蓋就會退得好快。',
      pt: 'Uma das depressões continentais mais profundas da Terra (-2.555 m), preenchida por gelo e chave para entender a vulnerabilidade marinha ocidental.',
      es: 'Una de las depresiones continentales más profundas de la Tierra (-2.555 m), rellena de hielo y clave en la vulnerabilidad del manto occidental.'
    },
    sourceUrl: 'https://data.bas.ac.uk/full-record.php?id=GB/NERC/BAS/PDC/01615'
  },
  {
    id: 'lake-vostok',
    category: 'cryosphere-lake-valley',
    name: {
      en: 'Subglacial Lake Vostok (East Antarctica)',
      'zh-CN': '沃斯托克冰下湖（东南极最大冰封淡水湖）',
      'zh-TW': '沃斯托克冰下湖（東南極最大冰封淡水湖）',
      'yue-Hant': '沃斯托克超巨型冰下淡水湖（東南極）',
      pt: 'Lago Subglacial Vostok (Antártida Oriental)',
      es: 'Lago Subglacial Vostok (Antártida Oriental)'
    },
    geologicAge: {
      en: 'Isolated Beneath Ice Sheet for ~15 Million Years',
      'zh-CN': '与地表大气隔绝逾 1,500 万年',
      'zh-TW': '與地表大氣隔絕逾 1,500 萬年',
      'yue-Hant': '已經同地面空氣隔絕咗超過一千五百萬年',
      pt: 'Isolado Sob o Manto de Gelo há ~15 Milhões de Anos',
      es: 'Aislado Bajo el Manto de Hielo durante ~15 Millones de Años'
    },
    lat: -77.5,
    lon: 106.0,
    elevationOrDepthM: -500,
    rockOrFeatureType: {
      en: 'High-Pressure Geothermal Liquid Lake Under 4,000 m Ice Cap',
      'zh-CN': '4,000 米冰盖高压与地热维系的液态淡水巨湖（面积约 1.25 万 km²）',
      'zh-TW': '4,000 公尺冰蓋高壓與地熱維繫的液態淡水巨湖（面積約 1.25 萬 km²）',
      'yue-Hant': '靠四千米厚冰高壓同地底微弱地熱保住唔結冰嘅一萬二千幾平方公里液態大湖',
      pt: 'Lago Líquido Geotérmico de Alta Pressão Sob 4.000 m de Gelo',
      es: 'Lago Líquido Geotérmico de Alta Presión Bajo 4.000 m de Hielo'
    },
    summary: {
      en: 'Largest of Antarctica’s 600+ subglacial lakes (~250 km long), kept liquid by geothermal heat and the pressure melting point depression of 4 km of overlying ice — an analog for Jupiter’s moon Europa.',
      'zh-CN': '南极已发现 600 余座冰下湖泊中规模最大的一座（长约 250 公里），在上覆 4 公里冰体高压降低冰点及地热共同作用下保持液态，被视为木卫二“欧罗巴”冰下海洋的地球天然实验室。',
      'zh-TW': '南極 600 餘座冰下湖泊中規模最大者（長約 250 公里），在 4 公里厚冰高壓與地熱共同作用下維持液態，為探索木衛二冰下海洋的最佳地球類比。',
      'yue-Hant': '全南極六百幾個冰下湖入面最大嗰個（長成 250 公里），因為頭頂四公里厚冰壓低咗冰點加上地熱保暖所以一直係液態水，科學家仲用佢嚟模擬木衛二星體冰殼下面嘅外星海洋。',
      pt: 'O maior dos mais de 600 lagos subglaciais antárticos (~250 km), mantido líquido por calor geotérmico e pressão — análogo terrestre da lua Europa.',
      es: 'El mayor de los más de 600 lagos subglaciales (~250 km), mantenido líquido por presión y calor geotérmico, análogo de la luna Europa de Júpiter.'
    },
    sourceUrl: 'https://www.bas.ac.uk/project/bedmap3/'
  },
  {
    id: 'mcmurdo-dry-valleys',
    category: 'cryosphere-lake-valley',
    name: {
      en: 'McMurdo Dry Valleys & Blood Falls (Victoria Land)',
      'zh-CN': '麦克默多干谷群与泰勒冰川“血瀑布”（维多利亚地）',
      'zh-TW': '麥克默多乾谷群與泰勒冰川「血瀑布」（維多利亞地）',
      'yue-Hant': '麥克默多無冰乾谷同泰勒冰川「血瀑布」（維多利亞地）',
      pt: 'Vales Secos de McMurdo e Cataratas de Sangue (Terra de Vitória)',
      es: 'Valles Secos de McMurdo y Cataratas de Sangre (Tierra Victoria)'
    },
    geologicAge: {
      en: 'Paleozoic Basement / Ferrar Dolerite Sills (~180 Ma)',
      'zh-CN': '古生代结晶基底 · 侏罗纪费拉尔辉绿岩床侵入（约 1.8 亿年前）',
      'zh-TW': '古生代結晶基底 · 侏羅紀費拉爾輝綠岩床侵入（約 1.8 億年前）',
      'yue-Hant': '古生代花崗岩基底夾住一億八千萬年前侵入嘅深色輝綠岩層',
      pt: 'Embasamento Paleozoico / Soleiras de Diabásio Ferrar (~180 Ma)',
      es: 'Basamento Paleozoico / Filones de Dolerita Ferrar (~180 Ma)'
    },
    lat: -77.47,
    lon: 162.52,
    elevationOrDepthM: 120,
    rockOrFeatureType: {
      en: 'Hyper-Arid Ice-Free Polar Desert & Subglacial Iron-Rich Brine Seep',
      'zh-CN': '极干无冰荒漠（下降风焚风效应）与富铁高盐卤水渗流奇观',
      'zh-TW': '極乾無冰荒漠（下降風焚風效應）與富鐵高鹽滷水滲流奇觀',
      'yue-Hant': '超過兩百萬年極少落雪嘅無冰荒漠，仲有冰底湧出遇空氣變鮮紅色嘅高鹽鐵質「血瀑布」',
      pt: 'Deserto Polar Hiperárido Livre de Gelo e Salmoura Rica em Ferro',
      es: 'Desierto Polar Hiperárido Libre de Hielo y Salmuera Subglacial Férrica'
    },
    summary: {
      en: 'Antarctica’s largest ice-free oasis (~4,800 km²), scoured snow-free by 300 km/h katabatic winds and exposing striking dark Jurassic Ferrar dolerite sills and iron-oxide Blood Falls.',
      'zh-CN': '南极大陆面积最大的无冰裸岩区（约 4,800 km²），横贯南极山脉阻挡冰流并配合狂暴下降风蒸发冰雪，裸露出黑白分明的侏罗纪辉绿岩床及泰勒冰川前端著名的富铁氧化“血瀑布”。',
      'zh-TW': '南極大陸面積最大的無冰裸岩區（約 4,800 km²），受山脈阻冰與下降風蒸發作用影響，裸露出侏羅紀輝綠岩床與泰勒冰川前端著名的富鐵「血瀑布」。',
      'yue-Hant': '全南極最大塊冇冰蓋住嘅裸岩地帶（成 4,800 平方公里），因為高山擋住冰川加上下降風吹乾晒水氣，成個山谷好似火星表面咁乾，仲睇到泰勒冰川流出鐵鏽紅色鹽水嘅「血瀑布」。',
      pt: 'Maior oásis livre de gelo da Antártida (~4.800 km²), varrido por ventos catabáticos e famoso pelas soleiras jurássicas e pelas Cataratas de Sangue.',
      es: 'El mayor oasis sin hielo de la Antártida (~4.800 km²), barrido por vientos catabáticos con espectaculares filones jurásicos y las Cataratas de Sangre.'
    },
    sourceUrl: 'https://www.gns.cri.nz/data-and-resources/geomap-geological-mapping-of-antarctica/'
  },
  {
    id: 'beardmore-glossopteris',
    category: 'gondwana-fossil',
    name: {
      en: 'Beardmore Glacier Glossopteris & Mt. Kirkpatrick Dinosaur Beds',
      'zh-CN': '比尔德莫尔冰川舌羊齿植物群与柯克帕特里克山极地恐龙化石带',
      'zh-TW': '比爾德莫爾冰川舌羊齒植物群與柯克帕特里克山極地恐龍化石帶',
      'yue-Hant': '比爾德莫爾冰川舌羊齒古植物同極地恐龍化石山',
      pt: 'Fósseis de Glossopteris (Beardmore) e Dinossauros do Monte Kirkpatrick',
      es: 'Fósiles de Glossopteris (Beardmore) y Dinosaurios del Monte Kirkpatrick'
    },
    geologicAge: {
      en: 'Permian (~260 Ma) Coal Seams & Early Jurassic (~190 Ma) Hanson Fm.',
      'zh-CN': '二叠纪煤系（约 2.6 亿年前）与早侏罗世汉森组（约 1.9 亿年前）',
      'zh-TW': '二疊紀煤層（約 2.6 億年前）與早侏羅世漢森組（約 1.9 億年前）',
      'yue-Hant': '二疊紀古森林煤層（2.6 億年前）同埋早侏羅世恐龍岩層（1.9 億年前）',
      pt: 'Camadas de Carvão Permiano (~260 Ma) e Jurássico Inferior (~190 Ma)',
      es: 'mantos de Carbón Pérmico (~260 Ma) y Jurásico Inferior (~190 Ma)'
    },
    lat: -84.33,
    lon: 166.15,
    elevationOrDepthM: 3250,
    rockOrFeatureType: {
      en: 'Beacon Supergroup Sedimentary Sandstones, Coal & Cryolophosaurus',
      'zh-CN': '比肯超群砂岩煤层 · 舌羊齿叶片与冰脊龙（Cryolophosaurus）化石',
      'zh-TW': '比肯超群砂岩煤層 · 舌羊齒葉片與冰脊龍（Cryolophosaurus）化石',
      'yue-Hant': '比肯超群沉積砂岩同煤層 · 證明南極以前係溫暖森林兼且有肉食冰脊龍行過',
      pt: 'Arenitos do Supergrupo Beacon, Carvão e Fósseis de Cryolophosaurus',
      es: 'Areniscas del Supergrupo Beacon, Carbón y Fósiles de Cryolophosaurus'
    },
    summary: {
      en: '16 kg of Permian Glossopteris leaf fossils hauled to the end by Scott’s 1912 Polar Party proved Antarctica once anchored forested Gondwana; nearby Mt. Kirkpatrick yielded the crested dinosaur Cryolophosaurus.',
      'zh-CN': '1912 年斯科特南极点探险队在绝境中仍坚持拖回 16 公斤二叠纪舌羊齿（Glossopteris）植物化石，铁证南极曾与南美、非洲、印度及澳洲相连为郁郁葱葱的冈瓦纳超大陆；毗邻山峰更出土了早侏罗世肉食冰脊龙。',
      'zh-TW': '1912 年斯科特探險隊在絕境中仍堅持攜回 16 公斤二疊紀舌羊齒植物化石，證明南極曾屬於森林茂密的岡瓦納超大陸；鄰近柯克帕特里克山更出土早侏羅世冰脊龍化石。',
      'yue-Hant': '1912 年斯科特小隊喺回程風雪絕境入面死都唔肯丟低嗰 16 公斤二疊紀「舌羊齒」樹葉化石，後來成為南極曾經連住南美、非洲同澳洲組成岡瓦納溫暖古大陸嘅鐵證；附近山頂仲掘出過頭頂有冠嘅極地食肉冰脊龍。',
      pt: 'Os 16 kg de fósseis de Glossopteris carregados pela equipe de Scott em 1912 provaram a conexão florestal da Antártida ao Gondwana, próximo ao sítio do dinossauro Cryolophosaurus.',
      es: 'Los 16 kg de fósiles de Glossopteris arrastrados por el grupo de Scott en 1912 probaron que la Antártida formó parte de los bosques de Gondwana, cerca del yacimiento de Cryolophosaurus.'
    },
    sourceUrl: 'https://www.gns.cri.nz/data-and-resources/geomap-geological-mapping-of-antarctica/'
  },
  {
    id: 'seymour-gondwana-fossils',
    category: 'gondwana-fossil',
    name: {
      en: 'Seymour (Marambio) Island K–Pg Boundary & Giant Penguin Beds',
      'zh-CN': '西摩岛（马兰比奥岛）白垩—古近纪灭绝界线与巨型古企鹅化石层',
      'zh-TW': '西摩島（馬蘭比奧島）白堊—古近紀界線與巨型古企鵝化石層',
      'yue-Hant': '西摩島恐龍滅絕分界岩層同埋兩米高巨型古企鵝化石地',
      pt: 'Limite K–Pg e Fósseis de Pinguins Gigantes da Ilha Seymour (Marambio)',
      es: 'Límite K–Pg y Fósiles de Pingüinos Gigantes de Isla Marambio (Seymour)'
    },
    geologicAge: {
      en: 'Late Cretaceous – Eocene (66 – 34 Ma)',
      'zh-CN': '晚白垩世—始新世（距今 6,600 万至 3,400 万年）',
      'zh-TW': '晚白堊世—始新世（距今 6,600 萬至 3,400 萬年）',
      'yue-Hant': '晚白堊世跨越到始新世（6,600 萬至 3,400 萬年前）',
      pt: 'Cretáceo Superior – Eoceno (66 – 34 Ma)',
      es: 'Cretácico Superior – Eoceno (66 – 34 Ma)'
    },
    lat: -64.28,
    lon: -56.68,
    elevationOrDepthM: 185,
    rockOrFeatureType: {
      en: 'Ice-Free Marine Sandstones Recording Gondwana Breakup & Cooling',
      'zh-CN': '无冰海相砂岩露头 · 完整记录恐龙大灭绝、南美分离与德雷克海峡开启',
      'zh-TW': '無冰海相砂岩露頭 · 記錄白堊紀末大滅絕、古企鵝與南極降溫史',
      'yue-Hant': '冇冰遮住嘅海相砂岩，由菊石、滄龍一路紀錄到身高近兩米嘅遠古巨型企鵝同埋南極變凍全過程',
      pt: 'Arenitos Marinhos Expostos Registrando a Ruptura do Gondwana',
      es: 'Areniscas Marinas Expuestas que Registran la Ruptura de Gondwana'
    },
    summary: {
      en: ' dubbed the “Rosetta Stone” of Antarctic paleontology: Nordenskjöld collected its first fossils in 1902, revealing ammonites, mosasaurs, marsupials, and 2 m-tall Eocene Palaeeudyptes penguins.',
      'zh-CN': '被誉为南极古生物学“罗塞塔石碑”：1902 年诺登舍尔德探险队首次在此采获化石，完整保存了白垩纪末菊石与沧龙灭绝面、古近纪南美—南极陆桥有袋类哺乳动物及身高近 2 米的始新世巨型古企鹅骨骼。',
      'zh-TW': '被譽為南極古生物學「羅塞塔石碑」：1902 年諾登舍爾德探險隊首度在此採集化石，完整保存白堊紀末菊石滅絕面、古近紀有袋類與近 2 公尺高的始新世巨型古企鵝化石。',
      'yue-Hant': '地質學界叫做南極古生物「羅塞塔石碑」：1902 年瑞典探險隊已經喺度執到化石，同一座島上面搵齊晒恐龍時代海怪滄龍、走過陸橋嘅古有袋動物，仲有成個人咁高（近兩米）嘅遠古巨型企鵝骨頭。',
      pt: 'A “Pedra de Roseta” da paleontologia antártica: revela amonites, mosassauros, marsupiais e pinguins gigantes eocênicos de quase 2 metros.',
      es: 'La “Piedra Rosetta” paleontológica antártica: conserva amonites, mosasaurios, marsupiales y pingüinos gigantes del Eoceno de casi 2 metros.'
    },
    sourceUrl: 'https://scar.org/library-data/maps/geomap-geological-mapping'
  }
];

export const POLAR_MACRO_REGIONS: PolarMacroRegion[] = [
  {
    id: 'east-antarctica',
    name: {
      en: 'East Antarctic Ice Sheet (EAIS)',
      'zh-CN': '东南极冰盖与克拉通陆盾（EAIS）',
      'zh-TW': '東南極冰蓋與克拉通陸盾（EAIS）',
      'yue-Hant': '東南極超厚大冰蓋同古老大陸盾（EAIS）',
      pt: 'Manto de Gelo da Antártida Oriental (EAIS)',
      es: 'Manto de Hielo de la Antártida Oriental (EAIS)'
    },
    crustalAge: {
      en: 'Archean–Proterozoic Craton (> 3.0 – 1.0 Ga)',
      'zh-CN': '太古宙—元古宙古老克拉通（10 亿–30 亿年以上）',
      'zh-TW': '太古宙—元古宙古老克拉通（10 億–30 億年以上）',
      'yue-Hant': '超過十億至三十億年歷史嘅堅硬古老大陸地盾',
      pt: 'Cráton Arqueano–Proterozoico (> 1,0 – 3,0 Ga)',
      es: 'Cratón Arcaico–Proterozoico (> 1,0 – 3,0 Ga)'
    },
    meanIceThicknessM: 2226,
    seaLevelEquivalentM: 52.2,
    centerLat: -80.0,
    centerLon: 85.0,
    summary: {
      en: 'Rests largely on bedrock above sea level; holds ~85% of Earth’s glacial ice (up to 4,776 m thick) and plunges below -89°C in winter.',
      'zh-CN': '绝大部分冰体坐落于海平面以上的稳定大陆基底，储藏全球约 85% 的冰川冰（最大冰厚达 4,776 米，折合全球海平面当量 52.2 米），是地球极寒干冷中心。',
      'zh-TW': '絕大部分冰體坐落於海平面以上的穩定大陸基底，儲藏全球約 85% 的冰川冰（最大冰厚達 4,776 公尺，折合海平面當量 52.2 公尺），為地球極寒核心。',
      'yue-Hant': '成塊冰原大部分都穩陣坐喺海平面以上嘅古老大陸岩石上面，儲起咗全地球八成半嘅冰（最厚去到 4,776 米，如果全部融晒海平面會升 52.2 米），冬天凍到零下八十幾度。',
      pt: 'Apoiado majoritariamente acima do nível do mar, concentra ~85% do gelo terrestre (até 4.776 m de espessura; 52,2 m de nível do mar equivalente).',
      es: 'Asentado mayormente sobre roca por encima del nivel del mar; almacena ~85% del hielo glacial terrestre (hasta 4.776 m de espesor; 52,2 m de nivel del mar).'
    }
  },
  {
    id: 'west-antarctica',
    name: {
      en: 'West Antarctic Marine Ice Sheet (WAIS)',
      'zh-CN': '西南极海洋性冰盖与裂谷盆地（WAIS）',
      'zh-TW': '西南極海洋性冰蓋與裂谷盆地（WAIS）',
      'yue-Hant': '西南極低過海平面嘅海洋性冰蓋（WAIS）',
      pt: 'Manto de Gelo Marinho da Antártida Ocidental (WAIS)',
      es: 'Manto de Hielo Marino de la Antártida Occidental (WAIS)'
    },
    crustalAge: {
      en: 'Mesozoic–Cenozoic Rift & Crustal Blocks',
      'zh-CN': '中—新生代微陆块拼贴与拉张裂谷系',
      'zh-TW': '中—新生代微陸塊拼貼與拉張裂谷系',
      'yue-Hant': '中生代至新生代地殼拉開形成嘅微陸塊同埋火山裂谷帶',
      pt: 'Rifte Meso-Cenozoico e Blocos Crustais',
      es: 'Rift Meso-Cenozoico y Bloques Corticales'
    },
    meanIceThicknessM: 1806,
    seaLevelEquivalentM: 5.3,
    centerLat: -79.0,
    centerLon: -108.0,
    summary: {
      en: 'A marine-based ice sheet grounded up to 2.5 km below sea level, buttressed by the Ross and Filchner-Ronne Ice Shelves and actively thinning in the Amundsen Sea sector.',
      'zh-CN': '典型的“海洋性冰盖”，冰床大面积深陷海平面以下 1,000–2,555 米，外侧依赖罗斯冰架与菲尔希纳-龙尼冰架提供支撑背应力，阿蒙森海思韦茨冰川扇区正经历快速接地线后退。',
      'zh-TW': '典型的「海洋性冰蓋」，冰床大面積深陷海平面以下 1,000–2,555 公尺，外側仰賴羅斯冰架與菲爾希納-龍尼冰架支撐，阿蒙森海思韋茨扇區正經歷快速消融。',
      'yue-Hant': '典型嘅「海洋性冰蓋」，個冰底大範圍凹落海平面以下一兩千米，全靠外圍羅斯冰架同菲爾希納-龍尼冰架頂住；而家阿蒙森海暖水湧入去令思韋茨冰川退得好急。',
      pt: 'Manto de gelo marinho ancorado até 2,5 km abaixo do nível do mar, sustentado pelas plataformas Ross e Filchner-Ronne e sensível às águas quentes.',
      es: 'Manto de hielo marino apoyado hasta 2,5 km bajo el nivel del mar, contenido por las barreras de Ross y Filchner-Ronne y sensible al océano cálido.'
    }
  },
  {
    id: 'antarctic-peninsula',
    name: {
      en: 'Antarctic Peninsula Cordillera',
      'zh-CN': '南极半岛山脉弧与海岛峡湾带',
      'zh-TW': '南極半島山脈弧與海島峽灣帶',
      'yue-Hant': '南極半島高山峽灣同火山群島帶',
      pt: 'Cordilheira da Península Antártica',
      es: 'Cordillera de la Península Antártica'
    },
    crustalAge: {
      en: 'Andean Orogeny Continuation (Jurassic–Cenozoic Arc)',
      'zh-CN': '南美安第斯造山带南延岩浆弧（侏罗纪—新生代）',
      'zh-TW': '南美安第斯造山帶南延岩漿弧（侏羅紀—新生代）',
      'yue-Hant': '同南美洲安第斯山脈一脈相承嘅火山花崗岩山脊',
      pt: 'Continuação da Orogenia Andina (Arco Jurássico–Cenozoico)',
      es: 'Continuación de la Orogenia Andina (Arco Jurásico–Cenozoico)'
    },
    meanIceThicknessM: 615,
    seaLevelEquivalentM: 0.24,
    centerLat: -65.5,
    centerLon: -63.5,
    summary: {
      en: 'Stretches 1,300 km northward to 63°S toward Tierra del Fuego, hosting maritime tundra oases, active volcanic islands, and Antarctica’s richest penguin and whale feeding fjords.',
      'zh-CN': '向北绵延 1,300 公里直抵南纬 63° 与火地岛隔海相望，受海洋性气候滋润，汇聚了壮丽花岗岩峡湾、活火山群岛、极地苔原及最密集的企鹅与座头鲸觅食区。',
      'zh-TW': '向北綿延 1,300 公里直抵南緯 63° 與火地島隔海相望，受海洋性微氣候影響，匯聚花崗岩峽灣、活火山群島、極地苔原與最密集的企鵝鯨群生態。',
      'yue-Hant': '一路向北伸出千三公里去到南緯 63 度同火地島遙遙相對，氣候比內陸溫和濕潤好多，到處都係花崗岩峽灣、活火山島，仲係企鵝同座頭鯨最集中嘅覓食天堂。',
      pt: 'Estende-se por 1.300 km ao norte rumo à Terra do Fogo, reunindo fiordes graníticos, ilhas vulcânicas, tundra marítima e intensa vida marinha.',
      es: 'Se extiende 1.300 km al norte hacia Tierra del Fuego, con fiordos graníticos, islas volcánicas activas, tundra marítima y abundante fauna polar.'
    }
  }
];

export const SCAR_CGA_GAZETTEER: GazetteerEntry[] = [
  {
    id: 'cga-king-george',
    cgaFeatureType: {
      en: 'Island (South Shetland Islands)',
      'zh-CN': '岛屿（南设得兰群岛最大岛）',
      'zh-TW': '島嶼（南設得蘭群島最大島）',
      'yue-Hant': '島嶼（南設得蘭群島最大嗰個島）',
      pt: 'Ilha (Arquipélago Shetland do Sul)',
      es: 'Isla (Archipiélago Shetland del Sur)'
    },
    lat: -62.02,
    lon: -58.35,
    firstChartedYear: 1819,
    names: {
      en: 'King George Island',
      'zh-CN': '乔治王岛（阿称：5月25日岛 / 俄称：滑铁卢岛）',
      'zh-TW': '喬治王島（阿稱：5月25日島 / 俄稱：滑鐵盧島）',
      'yue-Hant': '喬治王島（阿根廷叫「5月25日島」／俄國叫「滑鐵盧島」）',
      pt: 'Ilha Rei George (Isla 25 de Mayo / Waterloo)',
      es: 'Isla 25 de Mayo / Isla Rey Jorge (Waterloo)'
    },
    etymology: {
      en: 'Named by British navigator William Smith on 16 Oct 1819 after King George III; named Isla 25 de Mayo in Argentina for National Day (1810) and Ostrov Vaterloo by Bellingshausen in 1821.',
      'zh-CN': '1819 年 10 月英国航海家威廉·史密斯以英王乔治三世命名；阿根廷以 1810 年五月革命纪念日命名为“5月25日岛（Isla 25 de Mayo）”；1821 年别林斯高晋俄国探险队则命名为“滑铁卢岛”，是极地多国历史地名共存的经典范例。',
      'zh-TW': '1819 年英國航海家威廉·史密斯以喬治三世命名；阿根廷以五月革命紀念日稱「5月25日島（Isla 25 de Mayo）」；1821 年俄國別林斯高晉探險隊則稱「滑鐵盧島」。',
      'yue-Hant': '同一個島喺 SCAR 國際地名冊入面有三個出名歷史名：1819 年英國船長用英王喬治三世改名；阿根廷就用國慶日叫佢「5月25日島」；1821 年俄國探險家別林斯高晉又叫佢做「滑鐵盧島」，完美反映南極多國探索史。',
      pt: 'Nomeada em 1819 por William Smith em homenagem a Jorge III; chamada Isla 25 de Mayo pela Argentina e Ilha Waterloo pela expedição russa de 1821.',
      es: 'Registrada en SCAR CGA con triple tradición histórica: Isla 25 de Mayo (Argentina), Isla Rey Jorge (cartografía chilena/británica, 1819) y Waterloo (Bellingshausen, 1821).'
    },
    sourceUrl: 'https://placenames.aq/'
  },
  {
    id: 'cga-deception',
    cgaFeatureType: {
      en: 'Volcanic Caldera Island',
      'zh-CN': '环状火山口岛屿',
      'zh-TW': '環狀火山口島嶼',
      'yue-Hant': '環形活火山口海島',
      pt: 'Ilha de Caldeira Vulcânica',
      es: 'Isla de Caldera Volcánica'
    },
    lat: -62.97,
    lon: -60.65,
    firstChartedYear: 1820,
    names: {
      en: 'Deception Island',
      'zh-CN': '欺骗岛（俄历史名：泰尔岛 Ostrov Teylya）',
      'zh-TW': '欺騙島（俄歷史名：泰爾島）',
      'yue-Hant': '欺騙島（睇落似普通孤島，入去先知係個大內海）',
      pt: 'Ilha Decepção (Deception Island)',
      es: 'Isla Decepción (Isla Deception)'
    },
    etymology: {
      en: 'Named by American sealer Nathaniel Palmer in Nov 1820 because its outer ring deceives mariners into seeing a solid island until discovering the narrow 500 m Neptune’s Bellows entrance into a vast flooded crater.',
      'zh-CN': '1820 年 11 月美国猎海豹船长纳撒尼尔·帕尔默命名：从外海远眺宛如一座封闭实心山岛，唯有驶近东南角宽仅 500 米的“海神风箱”裂口，方知内部竟暗藏直径逾 7 公里的巨型火山泻湖，故名“欺骗岛”。',
      'zh-TW': '1820 年美國船長帕爾默命名：自外海遠望看似實心島嶼，駛入寬僅 500 公尺的「海神風箱」缺口後方知內部為巨大火山內灣，故稱「欺騙島」。',
      'yue-Hant': '1820 年美國船長帕爾默改嘅名：喺外海望過去以為係座實心石島，點知轉去東南角穿過得五百米闊嘅「海神風箱」窄口之後，入面竟然係個成七公里闊嘅超避風火山大內灣，呃晒所有人隻眼，所以叫「欺騙島」。',
      pt: 'Batizada por Nathaniel Palmer em 1820 por parecer uma ilha maciça por fora, escondendo uma imensa lagoa vulcânica interna acessível pelos Foles de Netuno.',
      es: 'Nombrada por Nathaniel Palmer en 1820 por su apariencia engañosa de isla maciza que oculta una gran bahía interior accesible por los Fuelles de Neptuno.'
    },
    sourceUrl: 'https://placenames.aq/'
  },
  {
    id: 'cga-hope-bay',
    cgaFeatureType: {
      en: 'Bay & Strait Gateway (Trinity Peninsula)',
      'zh-CN': '海湾（南极半岛最北端门户）',
      'zh-TW': '海灣（南極半島最北端門戶）',
      'yue-Hant': '海灣（南極半島最北角咽喉位）',
      pt: 'Baía (Ponta da Península Trinidad)',
      es: 'Bahía (Extremo Norte de la Península Trinidad)'
    },
    lat: -63.39,
    lon: -56.99,
    firstChartedYear: 1902,
    names: {
      en: 'Hope Bay (Hoppets Vik)',
      'zh-CN': '希望湾',
      'zh-TW': '希望灣',
      'yue-Hant': '希望灣',
      pt: 'Baía Esperança (Hope Bay)',
      es: 'Bahía Esperanza (Hope Bay)'
    },
    etymology: {
      en: 'Originally named “Hoppets Vik” (Bay of Hope) by J. Gunnar Andersson’s 3-man party of the Swedish Antarctic Expedition who survived the 1903 winter here in a makeshift stone hut (HSM-39) awaiting rescue.',
      'zh-CN': '源自瑞典语“Hoppets Vik”：1903 年瑞典南极探险队安德松等三名队员因浮冰阻隔被迫在此就地垒石越冬（遗址今为 HSM-39），怀抱获救重逢的信念将其命名为“希望湾”，西语与葡语均直译传承此名。',
      'zh-TW': '源自瑞典語「Hoppets Vik」：1903 年瑞典探險隊三名隊員受浮冰阻隔在此壘石越冬（今 HSM-39），懷抱獲救信念命名為「希望灣」，西語 Bahía Esperanza 亦承襲此意。',
      'yue-Hant': '原本係瑞典文「Hoppets Vik」：1903 年瑞典探險隊有三個隊員俾厚冰封死咗退路，焗住喺呢個海灣砌石屋捱過成個極地寒冬（間石屋就係 HSM-39），佢哋日日盼望救援船出現所以改名做「希望灣」。',
      pt: 'Traduzido do sueco “Hoppets Vik”, dado pelo grupo de três homens da Expedição Antártica Sueca que sobreviveu ao inverno de 1903 em uma cabana de pedra (HSM-39).',
      es: 'Traducción del sueco “Hoppets Vik”, bautizada por los tres expedicionarios suecos que sobrevivieron al invierno de 1903 en una choza de piedra (HSM-39).'
    },
    sourceUrl: 'https://placenames.aq/'
  },
  {
    id: 'cga-weddell-sea',
    cgaFeatureType: {
      en: 'Marginal Sea & Cyclonic Gyre',
      'zh-CN': '南大洋陆缘海与顺时针冰山环流',
      'zh-TW': '南大洋陸緣海與順時針冰山環流',
      'yue-Hant': '南大洋大內海同埋巨型冰山漩渦區',
      pt: 'Mar Marginal e Giro Ciclônico Polar',
      es: 'Mar Marginal y Giro Ciclónico Polar'
    },
    lat: -73.0,
    lon: -45.0,
    firstChartedYear: 1823,
    names: {
      en: 'Weddell Sea (formerly King George IV Sea)',
      'zh-CN': '威德尔海',
      'zh-TW': '威德爾海',
      'yue-Hant': '威德爾海',
      pt: 'Mar de Weddell',
      es: 'Mar de Weddell'
    },
    etymology: {
      en: 'Reached to a record 74°15′S on 20 Feb 1823 by Scottish sealing captain James Weddell aboard the brig Jane; renamed from “King George IV Sea” to Weddell Sea in 1900 in honor of his navigation.',
      'zh-CN': '1823 年 2 月苏格兰航海家詹姆斯·威德尔趁罕见少冰年份驾帆船“简号”一举突入南纬 74°15′ 创下当时人类最南航行纪录；1900 年国际地理界正式将该海域定名为“威德尔海”以纪念其壮举。',
      'zh-TW': '1823 年蘇格蘭船長詹姆斯·威德爾駕船深入南緯 74°15′ 創下當時最南航行紀錄；1900 年正式定名為「威德爾海」以茲紀念。',
      'yue-Hant': '1823 年蘇格蘭船長詹姆斯·威德爾趁住嗰年浮冰特別少，揸住木帆船一口氣衝到入南緯 74 度 15 分破晒世界紀錄；到咗 1900 年地圖界就正式改用佢個姓氏叫呢片冰海做「威德爾海」。',
      pt: 'Alcançado até 74°15′S em 1823 pelo navegador escocês James Weddell; renomeado oficialmente Mar de Weddell em 1900 em sua homenagem.',
      es: 'Alcanzado hasta los 74°15′S en 1823 por el navegante escocés James Weddell; rebautizado oficialmente Mar de Weddell en 1900 en su honor.'
    },
    sourceUrl: 'https://placenames.aq/'
  },
  {
    id: 'cga-ross-ice-shelf',
    cgaFeatureType: {
      en: 'Floating Ice Shelf (~500,809 km²)',
      'zh-CN': '巨型浮动冰架（面积约 50 万 km²，与法国相当）',
      'zh-TW': '巨型浮動冰架（面積約 50 萬 km²，與法國相當）',
      'yue-Hant': '全球最大浮動冰架（面積成五十萬平方公里，差唔多成個法國咁大）',
      pt: 'Plataforma de Gelo Flutuante (~500.809 km²)',
      es: 'Barrera de Hielo Flotante (~500.809 km²)'
    },
    lat: -81.5,
    lon: -175.0,
    firstChartedYear: 1841,
    names: {
      en: 'Ross Ice Shelf (Historic: Great Ice Barrier)',
      'zh-CN': '罗斯冰架（英雄时代旧称：大冰障）',
      'zh-TW': '羅斯冰架／羅斯冰棚（舊稱：大冰障）',
      'yue-Hant': '羅斯冰架（百幾年前探險家叫佢做「大冰障」）',
      pt: 'Plataforma de Gelo Ross (Grande Barreira de Gelo)',
      es: 'Barrera de Hielo de Ross (Gran Barrera de Hielo)'
    },
    etymology: {
      en: 'Sighted in Jan 1841 by Sir James Clark Ross aboard HMS Erebus and HMS Terror, who declared you might “with equal chance of success try to sail through the Cliffs of Dover” as penetrate its 50 m vertical ice front.',
      'zh-CN': '1841 年 1 月英国皇家海军詹姆斯·克拉克·罗斯爵士率“埃里伯斯号”与“恐怖号”首次抵近这道高出海面 50 米、绵延数百公里的垂直冰崖，惊叹“想驾船穿过它不异于撞向多佛尔白崖”，故早期史书皆称“大冰障（Great Ice Barrier）”。',
      'zh-TW': '1841 年詹姆斯·克拉克·羅斯爵士率「埃里伯斯號」與「恐怖號」首度抵近這道高聳垂直冰崖，感嘆駕船穿越有如撞向多佛白崖，早期探險史均稱之為「大冰障」。',
      'yue-Hant': '1841 年英國海軍羅斯爵士揸住「埃里伯斯號」同「恐怖號」去到呢幅高過海面五十米、望唔到盡頭嘅垂直冰牆前面，形容想揸船穿過去簡直等於撞向英國多佛懸崖咁冇可能，所以以前一直叫「大冰障」，之後先改名紀念羅斯爵士。',
      pt: 'Avistada em 1841 por Sir James Clark Ross a bordo do HMS Erebus e HMS Terror como um paredão vertical intransponível (“Great Ice Barrier”).',
      es: 'Avistada en 1841 por Sir James Clark Ross con los buques HMS Erebus y HMS Terror como un frente vertical de 50 m, de ahí el término español “Barrera de Hielo”.'
    },
    sourceUrl: 'https://placenames.aq/'
  },
  {
    id: 'cga-inexpressible-island',
    cgaFeatureType: {
      en: 'Rocky Coastal Island (Terra Nova Bay)',
      'zh-CN': '海岸基岩岛屿（特拉诺瓦湾 · 秦岭站所在地）',
      'zh-TW': '海岸基岩島嶼（特拉諾瓦灣 · 秦嶺站所在地）',
      'yue-Hant': '海岸岩石島（特拉諾瓦灣 · 中國秦嶺站位置）',
      pt: 'Ilha Rochosa Costeira (Baía Terra Nova)',
      es: 'Isla Rocosa Costera (Bahía Terra Nova)'
    },
    lat: -74.9,
    lon: 163.7,
    firstChartedYear: 1912,
    names: {
      en: 'Inexpressible Island',
      'zh-CN': '恩克斯堡岛 / 难言岛',
      'zh-TW': '恩克斯堡島 / 難言島',
      'yue-Hant': '難言島 / 恩克斯堡島（苦不堪言嘅過冬雪洞島）',
      pt: 'Ilha Inexpressible (Ilha Indescritível)',
      es: 'Isla Inexpresable (Inexpressible Island)'
    },
    etymology: {
      en: 'Named by Scott’s Northern Party (led by Victor Campbell) who were stranded by sea ice in 1912 and survived an “inexpressibly” brutal winter carved inside a tiny snow-drift cave (HSM-14) before trekking 320 km to safety.',
      'zh-CN': '1912 年斯科特探险队北路分队（维克托·坎贝尔率领的 6 人）因海冰封航无法撤离，被迫在该岛狂暴下降风中挖凿狭小雪洞（遗址 HSM-14）靠海豹肉熬过“难以言喻（Inexpressible）”的苦寒极夜并全员生还，中文音义兼备译作“恩克斯堡岛 / 难言岛”。',
      'zh-TW': '1912 年斯科特北路分隊 6 人因浮冰受困，在島上強勁下降風中鑿築狹小冰洞（HSM-14）度過「難以言喻（Inexpressible）」的嚴冬後全員生還，故名「難言島／恩克斯堡島」。',
      'yue-Hant': '1912 年斯科特探險隊北路小隊六個人俾浮冰困住走唔甩，焗住喺呢個日日吹十幾級下降風嘅荒島掘個細雪洞（HSM-14）食海豹肉捱過成個極夜，嗰種辛苦真係「難以言喻（Inexpressible）」，今日中國秦嶺站就起喺呢個充滿傳奇色彩嘅島上面。',
      pt: 'Batizada pelo Grupo Norte da expedição de Scott, que sobreviveu ao inverno extremo de 1912 escavado em uma caverna de gelo (HSM-14) sob ventos implacáveis.',
      es: 'Nombrada por el Grupo Norte de la expedición de Scott tras sobrevivir al indescriptible invierno de 1912 en una cueva de hielo (HSM-14) azotada por el viento.'
    },
    sourceUrl: 'https://placenames.aq/'
  }
];
