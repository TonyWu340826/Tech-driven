import { Tutor, ScheduleItem, Conversation } from './types';

export const MOCK_TUTORS: Tutor[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    title: '认证数学老师',
    price: 40,
    rating: 4.9,
    reviewCount: 120,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmivbYrie6tocV7J9B4edTyk6ydqFZgkEbExmhF2ZpMnH15wW19gM-Db_q6IVaNg3LyAHlilo7UJUWLPYIj43BeW20pwAo4-VQZKveJxJm-g48VbBwm1mWLTjqi-6lAUjy434jOPy8pckfnGRXWd-TtuH4o27MYRhQp77CnyJFr5MRPXj9C3mpCBr-KPYH8QVsP6DUiG53ntFacwzo8A1O_-ktogy0dARDpbxspHop_FpCuEJP1voRTcoR7zarxYplz6Mdi2_SnSA6',
    verified: true,
    tags: ['上门辅导', '在线授课'],
    subject: 'Math',
    bio: '热爱数学教学，拥有超过5年的辅导经验，致力于帮助学生实现学术目标。我擅长将复杂的微积分问题分解为简单易懂的步骤。我的教学风格注重建立学生的自信心，培养受益终身的解题技巧。',
    certifications: [
        { id: 'c1', title: '数学学士', issuer: '斯坦福大学 • 2018', icon: 'school', colorClass: 'text-primary' },
        { id: 'c2', title: '认证数学老师', issuer: '国家家教协会 • 2019', icon: 'workspace_premium', colorClass: 'text-primary' },
        { id: 'c3', title: '高级讲师', issuer: 'Mathnasium • 3 年', icon: 'history_edu', colorClass: 'text-primary' },
    ],
    reviews: [
        { id: 'r1', author: 'James L.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_CwpCpswiBc5dIs1yBmCpL29ULXZS57AH4uKwCtVMY01VDJUDpd_UOPVo-H1GsoI04_t2vDCbLoEtJjkKLkaW8vJCb8YcEBvEFlE_t8VSQoHZGc9q2HO0TjhgWhe_mG1h_y8on4Uj6ByTSZtFThOf8h4OvYheDhjzgZop5udUx8TSR9JYQN7NFawGHSY0Ln7JCF_EqlPOOy2jeJNGBZkmTLynGjA8KBlJDd83-oP32tch9yLl5wPRY4GEEPYlAPgx70lvNET3IBvu', rating: 5, content: 'Sarah 非常有耐心。我的儿子之前在代数II上很吃力，但她能用一种让他顿悟的方式解释概念。强烈推荐！', date: '2 天前' },
        { id: 'r2', author: 'Maria G.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3UctkEEJBNjrDTSKn10lWZLAgYJc5xiApfgN9RsQ0-vAJzUSsxoMjQU58FmlAr0GjZYwPJRyQsEnNB8Tx2ZCCl7WFGQL2jNC1XC8Ay3Sbe-mxu1dacpcSOSf5zVxpPC4StHrdHjpuFA2IwHULEqzKUAj27nVCl04otfknE63Q5RLiH9ymXuWHhj5Bnxzw4ci5wZCocP6EmS9vJL1an_2CudClShZ_QNmvgNOQjP1k1IvirmYIBATnGAA5_eEEYEDS7eRSHnKAqn_1', rating: 4.5, content: '备考SAT的绝佳导师。仅仅经过6周的辅导，我们就看到了150分的提升。她布置的家庭作业非常有价值。', date: '1 周前' },
    ]
  },
  {
    id: '2',
    name: 'David Kim',
    title: '物理与化学专家',
    price: 35,
    rating: 4.8,
    reviewCount: 85,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxEzMuti2QYb8LzMkd-y57Byr5enMLtSp5ATAQ5z4CCq5zbtYVCEGDHpQCmczYhnwRr7qaxwC_FHJ3s2i8rHbVH_SYMe4R3w7GBKczXREMf2SpCxkO09nCkpIIqye84sh45_3LbIdTQpBcpNFynlLXF95JARgfW9OSu-tzAkTReqTDlztAiDB-HF1H-uJ1Rpt1rLULjKtnphV1wM9GN_MMEX1vfjzuU_m1PP9vxjDGywREnLiRhbMtj3IBB3hj3X_hIKW6-0693b0q',
    verified: true,
    tags: ['仅限在线'],
    subject: 'Science'
  },
  {
    id: '3',
    name: 'Emily Chen',
    title: '钢琴与乐理',
    price: 50,
    rating: 5.0,
    reviewCount: 42,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDblzpE5w_EpQ9_0dytdSFygbBES70IaLzOkhGMXslZoPo_z78aLYzurK35jlo9pXo06QsCumqh7_-4w40Ivb3g1z9X8FB5lk7Y5jqJ0UxMXgSsKX9Q7xKjVtus1EHab76PMsU51UazLv2FSH8AG3-_PqtxrvW02ZACDiXZaGWaHvKs9jJ1ha2X1vOSP4LnZou_hucSS_bHOHZerdNakLisgSJgtuinJqjDuj8Q03xI9KNLZRkievFGl2kx_s2rKzTsM2_BasneNTxP',
    verified: false,
    tags: ['上门辅导'],
    subject: 'Music'
  }
];

export const MOCK_DISCOVERY_TUTORS: Tutor[] = [
    {
        id: '1',
        name: '莎拉·詹金斯',
        title: '数学与物理',
        price: 300,
        rating: 4.9,
        reviewCount: 120,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3lLOTcDpfgdNZiQ1sgiWuQznJKfLulTw8RmyUVjcn53dWfVEFk5zlEkOulCVic3xx6NxuwnolzoakOlW1dDa5b0f6KzuTz3gBYYLkFeAFZ-7Zmyz2I8PzwCUupW8Rx-1Wm59OCcezG0MpBu4yNYxnh-G4EON3DXmKliozLjalJ3DL-DPcpyMtkM0f5aS3j1r5zVIzBc0CtKrd17PpZtvJvrDudJpMh5kjNev83dh9nDJlK6CCpiyia5UeeQVTFY8CayyYBALNxc6X',
        verified: false,
        tags: [],
        subject: 'Math',
        distance: '2.5 公里',
        bio: '经验丰富的STEM导师，擅长高级课程，帮助学生精通微积分和物理概念。'
    },
    {
        id: '2',
        name: '陈大卫',
        title: '英语文学',
        price: 200,
        rating: 4.7,
        reviewCount: 45,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDglv1ASH7hhREWt_MyWJ3UaV1a1tFPDLJolwgA1owQ5C5O3auYt1qoCz3s9P3kC9vW5wBJVIGTWsSEx26inqx7ggciunBotd2tRt_RDjiQ_9AuxNPBtYLObPqlTmhNda8lcK3BiS5aDK86rEgOAvbahjCMFtj19p4rcTjRs3aRVRRqlXRrpy6cdlrd7E8OKUWR4lfQO3NrNb_RDvks5NZ5cvM4J4XCsUDHbaLkncISofuNzdnwZsP_Zdp7DMSpFYKrOCc8PBjxxJwO',
        verified: false,
        tags: [],
        subject: 'English',
        distance: '在线',
        bio: '帮助学生爱上阅读和写作，提供个性化教学课程。'
    },
    {
        id: '3',
        name: '玛丽亚·罗德里格斯',
        title: '西班牙语',
        price: 350,
        rating: 5.0,
        reviewCount: 12,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG4uG1Fu4t5GKoT100IAeWDEwYiYMlsmOW8lUQPy34O_kXmE10A10xB9zYqy1hYKLXXsLoVeV2dFbfe9XRqnx2YxZxJKzEY-NZUgShq7TpM5Tk1a3MPzHMTg0HW_9tSdJr3RovWxYA3qW2otQCEg9u-RUimAgsht5cRfwEZ1T_S0sErtbC4QxTnxOxs_YZc2MxrV6O_s2WSj-0i0byBE9Amk4giS844oveeuJUnEor_jiRAwHMKnNxwlx4L-dvIXiGlU-RfuyXQjO-',
        verified: false,
        tags: [],
        subject: 'Spanish',
        distance: '5.0 公里',
        bio: '母语为西班牙语，擅长对话式西班牙语教学及初学者语法。'
    }
]

export const SCHEDULE_ITEMS: ScheduleItem[] = [
  {
    id: 's1',
    tutorName: 'Mr. Johnson',
    tutorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ-tn9gbXD7SlBn2seqoY1mlvDLYgfQ9nIJT8rOK6YSg9_DKZWYO9iE7qvUkRc6-3SKw_vsdNznRDSjwhubAgxCK35VYcyvHBCZhpwETLPnO2tXnih3sUoEo7-EfZZ_zZi5X9UgoXaUZROx7pkasrq39Aj0UaEid_qW0Elb-xCM9DpvBkNPVj0dwrpiiDVnuQFzOIu2U5Ly4Mosf3zuWvkAV7QJlCXFUPbt-rFowCyLSXofboeyh2Ou5T1g_pLLjLUSWFKZTzAjBvP',
    subject: 'Physics • High School',
    status: 'upcoming',
    startTime: '15:30',
    endTime: '16:30',
    date: '2023-10-24',
    type: 'online',
    label: '10分钟后开始'
  },
  {
    id: 's2',
    tutorName: 'Sarah K.',
    tutorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_DZU3vpq6UaWQNPzoqQM3-vf1U4tmpiJ_KEvCYPiUvCbnfxLsoGvB52VFRw_Yk1-JGUMz86LRzLBJw4OJzA_ey-JAC153SQPEu4hWCJCDsg8eRnbuy-kdC5jNwO4PtfAWZ-MS_TAGUwFCCLuy6ctrLqp1YU0aG-S37nJzYzj6BQ65Cfl9XKH2jdJoWheKkCRHAvFD39x44NU5oJI7LeAwaNMHt-Re-TrRt9nJqkzy69Kx2Ia5yfPhTv7qfCmy4hhD74NPvNz6f6ly',
    subject: 'English Lit • AP Prep',
    status: 'upcoming',
    startTime: '18:00',
    endTime: '19:00',
    date: '2023-10-24',
    type: 'in-person'
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    tutorId: '1',
    tutorName: 'Sarah Jenkins',
    tutorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmivbYrie6tocV7J9B4edTyk6ydqFZgkEbExmhF2ZpMnH15wW19gM-Db_q6IVaNg3LyAHlilo7UJUWLPYIj43BeW20pwAo4-VQZKveJxJm-g48VbBwm1mWLTjqi-6lAUjy434jOPy8pckfnGRXWd-TtuH4o27MYRhQp77CnyJFr5MRPXj9C3mpCBr-KPYH8QVsP6DUiG53ntFacwzo8A1O_-ktogy0dARDpbxspHop_FpCuEJP1voRTcoR7zarxYplz6Mdi2_SnSA6',
    lastMessage: '好的，我们明天下午3点见！',
    lastMessageTime: '10:30',
    unreadCount: 2,
    isOnline: true,
    messages: [
       { id: 'm1', senderId: 'me', text: '你好，Sarah，我想重新安排一下周二的课程。', timestamp: '10:15', type: 'text' },
       { id: 'm2', senderId: '1', text: '没问题！周三下午3点可以吗？', timestamp: '10:20', type: 'text' },
       { id: 'm3', senderId: 'me', text: '那个时间可以。', timestamp: '10:25', type: 'text' },
       { id: 'm4', senderId: '1', text: '好的，我们明天下午3点见！', timestamp: '10:30', type: 'text' },
    ]
  },
  {
    id: 'c2',
    tutorId: '2',
    tutorName: 'David Kim',
    tutorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxEzMuti2QYb8LzMkd-y57Byr5enMLtSp5ATAQ5z4CCq5zbtYVCEGDHpQCmczYhnwRr7qaxwC_FHJ3s2i8rHbVH_SYMe4R3w7GBKczXREMf2SpCxkO09nCkpIIqye84sh45_3LbIdTQpBcpNFynlLXF95JARgfW9OSu-tzAkTReqTDlztAiDB-HF1H-uJ1Rpt1rLULjKtnphV1wM9GN_MMEX1vfjzuU_m1PP9vxjDGywREnLiRhbMtj3IBB3hj3X_hIKW6-0693b0q',
    lastMessage: '请记得把作业发给我。',
    lastMessageTime: '昨天',
    unreadCount: 0,
    isOnline: false,
    messages: [
       { id: 'm1', senderId: '2', text: '今天的课上得不错！', timestamp: '16:00', type: 'text' },
       { id: 'm2', senderId: '2', text: '请记得把作业发给我。', timestamp: '16:01', type: 'text' },
    ]
  },
  {
    id: 'c3',
    tutorId: '3',
    tutorName: 'Emily Chen',
    tutorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDblzpE5w_EpQ9_0dytdSFygbBES70IaLzOkhGMXslZoPo_z78aLYzurK35jlo9pXo06QsCumqh7_-4w40Ivb3g1z9X8FB5lk7Y5jqJ0UxMXgSsKX9Q7xKjVtus1EHab76PMsU51UazLv2FSH8AG3-_PqtxrvW02ZACDiXZaGWaHvKs9jJ1ha2X1vOSP4LnZou_hucSS_bHOHZerdNakLisgSJgtuinJqjDuj8Q03xI9KNLZRkievFGl2kx_s2rKzTsM2_BasneNTxP',
    lastMessage: '谢谢你的推荐！',
    lastMessageTime: '周一',
    unreadCount: 0,
    isOnline: true,
    messages: [
        { id: 'm1', senderId: 'me', text: 'Emily，我非常喜欢上次的钢琴课。', timestamp: '09:00', type: 'text' },
        { id: 'm2', senderId: '3', text: '谢谢你的推荐！很高兴能帮到你。', timestamp: '09:15', type: 'text' },
    ]
  }
];