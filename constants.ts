
import { Level, AgeGroup } from './types';

export const getLevels = (ageGroup: AgeGroup): Level[] => {
  const colors = [
    { bg: "#1e293b", text: "#e2e8f0", button: "#6366f1", shadow: "#4f46e5", accent: "#312e81" }, // Deep Indigo
    { bg: "#2a1b3d", text: "#f3e8ff", button: "#a855f7", shadow: "#9333ea", accent: "#581c87" }, // Dark Purple
    { bg: "#0f172a", text: "#cbd5e1", button: "#3b82f6", shadow: "#2563eb", accent: "#1e3a8a" }, // Dark Blue
    { bg: "#271a1a", text: "#ffe4e6", button: "#f43f5e", shadow: "#e11d48", accent: "#881337" }, // Dark Red
    { bg: "#1c1917", text: "#fef3c7", button: "#d97706", shadow: "#b45309", accent: "#78350f" }, // Dark Amber
    { bg: "#022c22", text: "#d1fae5", button: "#10b981", shadow: "#059669", accent: "#064e3b" }  // Dark Emerald
  ];

  if (ageGroup === 'child') {
     // Simplified fantasy RPG for kids
    return [
      {
        id: 1, title: "第一章", subtitle: "迷雾森林的诱惑", description: "你带着爷爷给的少量金币踏入森林。这里不仅有会说话的狐狸，还有看起来很美味但有毒的糖果。", colors: colors[0], imageKeyword: "fantasy",
        modules: [
          { id: "c_l1_m1", name: "神秘商人的推销", description: "他手里那个闪闪发光的玩具，真的值得用光所有积蓄吗？", icon: "Ghost" },
          { id: "c_l1_m2", name: "松鼠的储蓄罐", description: "松鼠说把金币埋在树下，明年会长出金币树，你信吗？", icon: "Save" },
          { id: "c_l1_m3", name: "伙伴的生日宴", description: "大家都送昂贵的礼物，你送什么才不会丢脸？", icon: "Gift" },
          { id: "c_l1_m4", name: "借钱的诱惑", description: "想买的东西钱不够，乌鸦说可以先借给你...", icon: "HandCoins" },
        ]
      },
      {
         id: 2, title: "第二章", subtitle: "风暴将至", description: "森林里传言大风暴要来了。是及时享乐，还是筑墙积粮？", colors: colors[1], imageKeyword: "storm",
         modules: [
            { id: "c_l2_m1", name: "蚂蚁的建议", description: "现在辛苦一点，冬天就不饿肚子。", icon: "Shield" },
            { id: "c_l2_m2", name: "蝴蝶的舞会", description: "大家都去玩了，我也想去...", icon: "Music" },
         ]
      },
      {
         id: 3, title: "第三章", subtitle: "勇者的试炼", description: "要成为真正的勇者，不仅需要勇气，还需要智慧来管理你的资源。", colors: colors[2], imageKeyword: "castle",
         modules: [
            { id: "c_l3_m1", name: "装备升级", description: "是买最贵的剑，还是修理旧盾牌？", icon: "Hammer" },
            { id: "c_l3_m2", name: "队友招募", description: "雇佣昂贵的骑士，还是培养潜力的新人？", icon: "Users" },
         ]
      },
      {
         id: 4, title: "第四章", subtitle: "巨龙的宝藏", description: "你发现了宝藏，但贪婪的巨龙正在苏醒。", colors: colors[3], imageKeyword: "dragon",
         modules: [
            { id: "c_l4_m1", name: "拿多少？", description: "拿走所有金币会吵醒巨龙，只拿一点又不甘心。", icon: "Coins" },
            { id: "c_l4_m2", name: "逃跑路线", description: "付费走密道，还是冒险走大路？", icon: "Map" },
         ]
      },
      {
         id: 5, title: "第五章", subtitle: "王国的危机", description: "王国遭遇了旱灾，国王请求你的援助。", colors: colors[4], imageKeyword: "kingdom",
         modules: [
            { id: "c_l5_m1", name: "捐赠物资", description: "捐出所有积蓄，还是力所能及？", icon: "HeartHandshake" },
            { id: "c_l5_m2", name: "粮价波动", description: "趁机高价卖粮，还是平价救济？", icon: "TrendingUp" },
         ]
      },
      {
         id: 6, title: "终章", subtitle: "传说", description: "你的故事将被吟游诗人传唱。你成为了什么样的英雄？", colors: colors[5], imageKeyword: "hero",
         modules: [
            { id: "c_l6_m1", name: "建立公会", description: "建立一个帮助新人的组织。", icon: "ShieldCheck" },
            { id: "c_l6_m2", name: "隐居", description: "带着财富去没有人认识的地方。", icon: "Home" },
         ]
      }
    ];
  } 
  
  else if (ageGroup === 'teen') {
    // High School Drama / Social RPG
    return [
      {
        id: 1, title: "序幕", subtitle: "校园名利场", description: "新学期，名牌球鞋和最新款手机成了社交通行证。在合群与钱包之间，你如何博弈？", colors: colors[0], imageKeyword: "school",
        modules: [
          { id: "t_l1_m1", name: "限量款球鞋", description: "不买就被嘲笑，买了就吃土。", icon: "Footprints" },
          { id: "t_l1_m2", name: "奶茶社交", description: "每天一杯奶茶，是合群的入场券吗？", icon: "Coffee" },
          { id: "t_l1_m3", name: "游戏氪金", description: "只要充值就能变强，这诱惑太大了。", icon: "Gamepad" },
          { id: "t_l1_m4", name: "第一次约会", description: "AA制还是打肿脸充胖子？", icon: "Heart" },
        ]
      },
      {
        id: 2, title: "第二幕", subtitle: "兼职陷阱", description: "你想赚钱证明自己，但社会给你上了第一课。", colors: colors[1], imageKeyword: "work",
        modules: [
          { id: "t_l2_m1", name: "刷单兼职", description: "动动手指月入过万？", icon: "AlertTriangle" },
          { id: "t_l2_m2", name: "二手交易", description: "在闲鱼上卖旧物遇到了奇怪的买家。", icon: "RefreshCw" },
        ]
      },
      {
        id: 3, title: "第三幕", subtitle: "兴趣与现实", description: "由于社团活动需要经费，你必须在爱好和生活费之间做选择。", colors: colors[2], imageKeyword: "hobby",
        modules: [
          { id: "t_l3_m1", name: "昂贵的设备", description: "摄影社的相机，是买入门款还是借钱买旗舰？", icon: "Camera" },
          { id: "t_l3_m2", name: "众筹梦想", description: "发起众筹来实现创意，还是脚踏实地打工？", icon: "Rocket" },
        ]
      },
      {
        id: 4, title: "第四幕", subtitle: "毕业季", description: "即将步入大学或社会，第一笔大额支出该如何规划？", colors: colors[3], imageKeyword: "graduation",
        modules: [
          { id: "t_l4_m1", name: "毕业旅行", description: "大家都去欧洲，你预算只够周边游。", icon: "Plane" },
          { id: "t_l4_m2", name: "笔记本电脑", description: "为了学习买MacBook Pro，还是性价比游戏本？", icon: "Laptop" },
        ]
      },
      {
        id: 5, title: "第五幕", subtitle: "奖学金风云", description: "这笔意外之财，是用来投资自己还是挥霍奖励？", colors: colors[4], imageKeyword: "library",
        modules: [
          { id: "t_l5_m1", name: "付费课程", description: "几千块的技能课，真的有用吗？", icon: "BookOpen" },
          { id: "t_l5_m2", name: "请客吃饭", description: "拿到奖学金就要请全班吃饭吗？", icon: "Utensils" },
        ]
      },
      {
        id: 6, title: "终章", subtitle: "成人礼", description: "18岁了，你获得了财务独立的初步权利。", colors: colors[5], imageKeyword: "sunrise",
        modules: [
          { id: "t_l6_m1", name: "第一张信用卡", description: "是透支未来的工具，还是建立信用的基石？", icon: "CreditCard" },
          { id: "t_l6_m2", name: "未来规划", description: "存钱去大城市闯荡，还是留在舒适区？", icon: "MapPin" },
        ]
      }
    ];
  }
  
  else { // ADULT - HUAJING CITY NOIR
    return [
      {
        id: 1, title: "第一幕", subtitle: "华京漂流记", description: "你刚抵达华京市，手里只有微薄的积蓄。这座城市光鲜亮丽，但每个霓虹灯下都标好了价格。活下去，是你的唯一目标。", colors: colors[0], imageKeyword: "city_night",
        modules: [
          { id: "a_l1_m1", name: "房东的通牒", description: "押一付三还是住进城中村？环境与钱包的第一次博弈。", icon: "Home" },
          { id: "a_l1_m2", name: "职场午餐政治", description: "同事都去吃日料，你带了便当。去，还是不去？", icon: "Utensils" },
          { id: "a_l1_m3", name: "双十一的狂欢", description: "李佳琦在尖叫，你的多巴胺在分泌，信用卡在颤抖。", icon: "ShoppingBag" },
          { id: "a_l1_m4", name: "伪精致陷阱", description: "如果不办这张健身卡，是不是就代表放弃了自己？", icon: "Dumbbell" },
        ]
      },
      {
        id: 2, title: "第二幕", subtitle: "镰刀的盛宴", description: "你手里攒了一点钱，觉得自己行了。而华京市的镰刀们闻到了韭菜的清香，微笑着向你走来。", colors: colors[4], imageKeyword: "stock_market",
        modules: [
          { id: "a_l2_m1", name: "股神的内幕", description: "老同学拉你进群，说有内幕消息，稳赚不赔。", icon: "TrendingUp" },
          { id: "a_l2_m2", name: "理财经理的咖啡", description: "他穿着高定西装，向你推荐年化8%的“稳健”产品。", icon: "Briefcase" },
          { id: "a_l2_m3", name: "跟风买基", description: "热搜第一的基金，现在上车还能喝到汤吗？", icon: "BarChart2" },
          { id: "a_l2_m4", name: "第一辆车", description: "是为了通勤效率，还是为了过年回家有面子？", icon: "Car" },
        ]
      },
      {
        id: 3, title: "第三幕", subtitle: "三十五岁危局", description: "房贷像大山一样压在身上，公司传闻要裁员。你感觉自己像走在钢丝上，一阵风就能把你吹落。", colors: colors[3], imageKeyword: "storm",
        modules: [
          { id: "a_l3_m1", name: "裁员名单", description: "HR找你谈话了。是拿N+1走人，还是降薪留岗？", icon: "FileWarning" },
          { id: "a_l3_m2", name: "医院的账单", description: "身体亮红灯了。平时省下的保险钱，现在要百倍还回去吗？", icon: "Activity" },
          { id: "a_l3_m3", name: "兄弟的借条", description: "最好的哥们创业失败，找你救急。借，就是送；不借，就是绝交。", icon: "Handshake" },
          { id: "a_l3_m4", name: "副业的诱惑", description: "有人说做这个项目能月入三万，挽救你的中年危机。", icon: "Zap" },
        ]
      },
      {
        id: 4, title: "第四幕", subtitle: "觉醒年代", description: "经历过暴涨暴跌和职场冷暖，你终于看透了华京市的游戏规则。你开始构建自己的诺亚方舟。", colors: colors[5], imageKeyword: "sunrise",
        modules: [
          { id: "a_l4_m1", name: "极简主义", description: "扔掉家里80%没用的东西，你发现了真正的自由。", icon: "Trash2" },
          { id: "a_l4_m2", name: "定投的信仰", description: "市场在哀嚎，你却在默默买入。这是反人性的修炼。", icon: "Repeat" },
          { id: "a_l4_m3", name: "资产配置", description: "不要把鸡蛋放在一个篮子里，也不要放在同一个国家的篮子里。", icon: "Globe" },
          { id: "a_l4_m4", name: "时间的玫瑰", description: "种下一棵树，最好的时间是十年前，其次是现在。", icon: "Sprout" },
        ]
      },
      {
        id: 5, title: "第五幕", subtitle: "资本博弈", description: "你已不再是棋子，而是棋手。现在摆在你面前的，是股权、杠杆和并购。一步天堂，一步地狱。", colors: colors[1], imageKeyword: "chess",
        modules: [
          { id: "a_l5_m1", name: "天使投资", description: "一个年轻的创业者找上门，他的PPT很完美，但人品呢？", icon: "Lightbulb" },
          { id: "a_l5_m2", name: "杠杆的诱惑", description: "只要加五倍杠杆，收益就能翻十倍。你敢赌吗？", icon: "Layers" },
          { id: "a_l5_m3", name: "税务筹划", description: "合法避税与非法逃税只有一线之隔。如何守住底线？", icon: "Scale" },
          { id: "a_l5_m4", name: "合伙人决裂", description: "曾经的战友在利益面前露出了獠牙。是妥协还是清洗？", icon: "Users" },
        ]
      },
      {
        id: 6, title: "终章", subtitle: "传承与永恒", description: "财富已经不是数字，而是责任。当白发苍苍回首往事，你留给这个世界的，不仅仅是金钱。", colors: colors[0], imageKeyword: "legacy",
        modules: [
          { id: "a_l6_m1", name: "家族信托", description: "如何保证富不过三代的魔咒不在你身上应验？", icon: "Scroll" },
          { id: "a_l6_m2", name: "慈善基金", description: "为了名声，还是为了内心的救赎？", icon: "HeartHandshake" },
          { id: "a_l6_m3", name: "立遗嘱", description: "这是你对这个世界最后一次权力的行使。", icon: "PenTool" },
          { id: "a_l6_m4", name: "回望初心", description: "如果能回到第一章的那个雨夜，你会对年轻的自己说什么？", icon: "Rewind" },
        ]
      }
    ];
  }
};
