(function () {
  const heroAction = document.querySelector('.hero-action');
  if (heroAction) {
    heroAction.href = '#about';
    heroAction.textContent = '了解读书会';
  }

  const labels = ['社团简介', '部门组成', '活动纪实', '活动瞬间', '荣誉展示'];
  document.querySelectorAll('.section-label').forEach((label, index) => {
    label.textContent = labels[index] || '';
  });
  const eyebrow = document.querySelector('.hero .eyebrow');
  if (eyebrow) eyebrow.remove();

  const periods = ['第十八期', '第十九期', '第二十期', '第二十一期', '第二十二期', '第二十三期', '第二十四期', '第二十五期'];
  document.querySelectorAll('.moments-grid figcaption').forEach((caption, index) => {
    if (!periods[index]) return;
    const suffix = index === 2 ? '闭幕式合影' : index === 4 ? '活动插花' : index > 5 ? '合影留念' : '现场照片';
    caption.textContent = `科技史读书会${periods[index]} · ${suffix}`;
  });

  const summaries = [
    '特邀马克思主义学院曹茂教授担任主讲嘉宾。2024级、2025级科技史研究生线下参加，89名马理论本科生通过到梦空间同步参与。',
    '特邀中国社会科学院易华研究员进行线上讲座。读书会指导教师兼主持人曹茂教授、云南农业大学银龄教授李建军老师，以及2024级、2025级科技史研究生21人线下参与，另有2025级党史党建、马原理研究生50人及马理论本科生40人通过到梦空间线上参加。',
    '组织学生围绕抗战史著作开展阅读汇报，来自全校本科一年级21个教学班的各小组代表参与了现场汇报展示评比，2025级科技史研究生参与学习交流。',
    '特邀西南林业大学木基元研究员担任主讲人。读书会指导教师曹茂教授、云南农业大学银龄教授倪根金、李建军老师，以及47名25级科技史、党史党建研究生线下参与，25级马理论研究生及马理论本科生通过到梦空间线上同步参加。',
    '2025级科技史硕士生黄忻瑶围绕明代张谦德所著《瓶花谱》作主题汇报。2025级科技史研究生线下参与，2025级马理论、党史党建研究生及马理论本科生线上同步参加。',
    '特邀云南农业大学银龄教授倪根金老师担任主讲人。读书会指导教师曹茂教授及科技史研究生线下参加，其他各学院到梦空间研究生、本科生通过腾讯会议同步参加。',
    '组织学生围绕长征史著作开展阅读汇报，由本课程班级共选派23位学生代表参与现场评比。读书报告会邀请华中师范大学教授谢从高、西南民族大学教授杜乐秀担任评审专家。',
    '邀请昆明理工大学教授黎尔平、西南林业大学教授扈志东、中国科学技术大学副研究员樊汇川参与评审，马院研究生参与汇报。'
  ];
  document.querySelectorAll('.activity-info > p:last-child').forEach((summary, index) => {
    if (summaries[index]) summary.textContent = summaries[index];
  });
}());
