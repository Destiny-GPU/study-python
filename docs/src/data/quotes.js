// docs/src/data/quotes.js
const quotes = [
  // ===== 计算机科学 =====
  {
    id: 'turing-1',
    text: '一台机器能在多大程度上模仿人类思维，这是一个只能用数字来回答的科学问题，而不是一个必须用哲学来回答的"是或否"的问题。',
    author: 'Alan Turing',
    role: '计算机科学之父',
    tags: ['computer-science', 'ai', 'philosophy'],
  },
  {
    id: 'knuth-1',
    text: '过早优化是万恶之源。',
    author: 'Donald Knuth',
    role: '计算机程序设计艺术作者',
    tags: ['programming', 'best-practice', 'computer-science'],
  },
  {
    id: 'dijkstra-3',
    text: '计算机科学不仅仅是关于计算机，就像天文学不仅仅是关于望远镜一样。',
    author: 'Edsger Dijkstra',
    role: '结构化编程之父',
    tags: ['computer-science', 'programming'],
  },
  {
    id: 'dijkstra-1',
    text: '测试只能证明 bug 的存在，而不能证明 bug 的不存在。',
    author: 'Edsger Dijkstra',
    role: '结构化编程之父',
    tags: ['testing', 'debugging', 'computer-science'],
  },
  {
    id: 'dijkstra-2',
    text: '简单是可靠的先决条件。',
    author: 'Edsger Dijkstra',
    role: '结构化编程之父',
    tags: ['programming', 'best-practice'],
  },
  {
    id: 'lamport-1',
    text: '一个分布式系统就是这样的一种系统：你甚至不知道存在的一台电脑的故障，能把你自己电脑的故障搞出来。',
    author: 'Leslie Lamport',
    role: '分布式系统先驱',
    tags: ['distributed-systems', 'computer-science'],
  },
  {
    id: 'hoare-1',
    text: '有两种方法来编写无错误的程序；但只有第三种方法有效。',
    author: 'Tony Hoare',
    role: '快速排序发明者',
    tags: ['programming', 'algorithms', 'computer-science'],
  },
  {
    id: 'bjarne-1',
    text: 'C 语言让你容易地访问计算机的内存；C++ 让你更容易地滥用它。',
    author: 'Bjarne Stroustrup',
    role: 'C++ 之父',
    tags: ['programming', 'cpp', 'computer-science'],
  },
  {
    id: 'hopper-1',
    text: '最危险的一句话是：\'我们一直都是这样做的。\'',
    author: 'Grace Hopper',
    role: '计算机先驱',
    tags: ['programming', 'innovation', 'computer-science'],
  },
  {
    id: 'torvalds-1',
    text: 'Talk is cheap. Show me the code.',
    author: 'Linus Torvalds',
    role: 'Linux 之父',
    tags: ['programming', 'open-source'],
  },
  // ===== 人工智能与机器学习 =====
  {
    id: 'mccarthy-1',
    text: '一旦某件事变得足够有效，它就不再被视为人工智能。',
    author: 'John McCarthy',
    role: '人工智能之父',
    tags: ['ai', 'philosophy'],
  },
  {
    id: 'minsky-1',
    text: '人工智能的问题在于，当某件事有效时，没有人再叫它人工智能了。',
    author: 'Marvin Minsky',
    role: '人工智能先驱',
    tags: ['ai'],
  },
  {
    id: 'norvig-1',
    text: '人工智能的定义是：让计算机去做人类需要智慧才能做的事。',
    author: 'Peter Norvig',
    role: 'AI 研究者',
    tags: ['ai', 'machine-learning'],
  },
  {
    id: 'samuel-1',
    text: '给计算机编程让它学习，而不是给它编程让它知道一切。',
    author: 'Arthur Samuel',
    role: '机器学习先驱',
    tags: ['ai', 'machine-learning'],
  },
  {
    id: 'zhang-1',
    text: '不是使用更好的模型，而是使用更多的数据。',
    author: 'Andrew Ng',
    role: 'AI 领域领袖',
    tags: ['ai', 'machine-learning', 'deep-learning'],
  },
  // ===== 信息论与信号处理 =====
  {
    id: 'shannon-1',
    text: '信息是不确定性的消除。',
    author: 'Claude Shannon',
    role: '信息论创始人',
    tags: ['information-theory', 'signal-processing'],
  },
  {
    id: 'shannon-2',
    text: '我们思考的速率远不及我们表达的速率，我们表达的速率远不及我们阅读的速率。',
    author: 'Claude Shannon',
    role: '信息论创始人',
    tags: ['information-theory', 'communication'],
  },
  {
    id: 'nyquist-1',
    text: '如果一个信号的带宽有限，那么它可以完全由其在等间隔时刻的采样值来确定。',
    author: 'Harry Nyquist',
    role: '采样定理奠基人',
    tags: ['signal-processing', 'sampling'],
  },
  {
    id: 'fourier-1',
    text: '一个任意的周期函数都可以表示为简单正弦波的和。',
    author: 'Joseph Fourier',
    role: '傅里叶分析创始人',
    tags: ['signal-processing', 'math', 'fourier'],
  },
  {
    id: 'wiener-1',
    text: '信息就是信息，不是物质也不是能量。',
    author: 'Norbert Wiener',
    role: '控制论创始人',
    tags: ['control-theory', 'cybernetics', 'information-theory'],
  },
  {
    id: 'bode-1',
    text: '工程不是科学，也不是数学，而是对科学和数学的应用。',
    author: 'Hendrik Bode',
    role: '控制理论先驱',
    tags: ['control-theory', 'engineering'],
  },
  // ===== 数学 =====
  {
    id: 'gauss-1',
    text: '数学是科学的皇后，数论是数学的皇后。',
    author: 'Carl Friedrich Gauss',
    role: '数学王子',
    tags: ['math', 'number-theory'],
  },
  {
    id: 'euler-1',
    text: '如果一个问题不能用简单的方式解决，那就说明你还没有真正理解它。',
    author: 'Leonhard Euler',
    role: '最伟大的数学家之一',
    tags: ['math', 'problem-solving'],
  },
  {
    id: 'euler-2',
    text: '公式中最重要的常数是 e，最重要的数字是 1，最重要的运算符是 +，最重要的等式是 e^{i\\pi}+1=0。',
    author: 'Leonhard Euler',
    role: '最伟大的数学家之一',
    tags: ['math', 'constants'],
  },
  {
    id: 'hardy-1',
    text: '数学家的模式，就像画家或诗人的模式，必须是美的。',
    author: 'G. H. Hardy',
    role: '数论大师',
    tags: ['math', 'beauty'],
  },
  {
    id: 'cantor-1',
    text: '在数学中，提问的艺术比回答的艺术更重要。',
    author: 'Georg Cantor',
    role: '集合论创始人',
    tags: ['math', 'set-theory'],
  },
  {
    id: 'hilbert-1',
    text: '我们必须知道，我们终将知道。',
    author: 'David Hilbert',
    role: '数学公理化之父',
    tags: ['math', 'philosophy'],
  },
  {
    id: 'kolmogorov-1',
    text: '概率论是数学的一个分支，它定量地研究不确定性的规律。',
    author: 'Andrey Kolmogorov',
    role: '概率论公理化者',
    tags: ['math', 'probability', 'statistics'],
  },
  {
    id: 'ramanujan-1',
    text: '一个等式如果对我没有意义，那就毫无意义。',
    author: 'Srinivasa Ramanujan',
    role: '数学天才',
    tags: ['math', 'intuition'],
  },
  {
    id: 'hamming-1',
    text: '理解一个问题，就是用一百种方式来表达它。',
    author: 'Richard Hamming',
    role: '信息论与数值分析先驱',
    tags: ['math', 'communication', 'problem-solving'],
  },
  {
    id: 'von-neumann-1',
    text: '如果人们不相信数学是简单的，那只是因为他们没有意识到生活有多复杂。',
    author: 'John von Neumann',
    role: '博弈论之父',
    tags: ['math', 'computer-science', 'philosophy'],
  },
  // ===== 物理学 =====
  {
    id: 'feynman-1',
    text: '如果你不能把一个概念解释给一个大一新生听，那说明你自己也没有真正理解它。',
    author: 'Richard Feynman',
    role: '物理学大师',
    tags: ['physics', 'teaching', 'communication'],
  },
  {
    id: 'feynman-2',
    text: '想象力比知识更重要，因为知识是有限的，而想象力概括着世界的一切。',
    author: 'Richard Feynman',
    role: '物理学大师',
    tags: ['physics', 'creativity'],
  },
  {
    id: 'einstein-1',
    text: '一切都应该尽可能简单，但不能过于简单。',
    author: 'Albert Einstein',
    role: '物理学大师',
    tags: ['physics', 'simplicity', 'philosophy'],
  },
  {
    id: 'einstein-2',
    text: '逻辑会把你从 A 带到 B，想象力会把你带到任何地方。',
    author: 'Albert Einstein',
    role: '物理学大师',
    tags: ['physics', 'creativity', 'philosophy'],
  },
  {
    id: 'planck-1',
    text: '科学不能解决自然的终极奥秘，因为归根结底，我们自己也是自然的一部分。',
    author: 'Max Planck',
    role: '量子物理先驱',
    tags: ['physics', 'philosophy'],
  },
  {
    id: 'maxwell-1',
    text: '一个科学真理的最佳胜利，不是通过说服其反对者来实现的，而是通过它的反对者最终都死了来实现的。',
    author: 'James Clerk Maxwell',
    role: '电磁学之父',
    tags: ['physics', 'science'],
  },
  {
    id: 'boltzmann-1',
    text: '如果我能为一个理论做哪怕最小的贡献，那我就已经心满意足了。',
    author: 'Ludwig Boltzmann',
    role: '统计力学之父',
    tags: ['physics', 'thermodynamics', 'probability'],
  },
  {
    id: 'bohr-1',
    text: '如果量子力学没有让你感到震惊，那说明你还没有理解它。',
    author: 'Niels Bohr',
    role: '原子物理先驱',
    tags: ['physics', 'quantum'],
  },
  // ===== 自动控制 =====
  {
    id: 'wiener-2',
    text: '控制论的本质在于，它不问"这是什么"，而问"这做什么"。',
    author: 'Norbert Wiener',
    role: '控制论创始人',
    tags: ['control-theory', 'cybernetics'],
  },
  {
    id: 'nyquist-2',
    text: '反馈系统的稳定性取决于开环传递函数的频率特性。',
    author: 'Harry Nyquist',
    role: '稳定性判据提出者',
    tags: ['control-theory', 'stability'],
  },
  {
    id: 'feedback-1',
    text: '反馈是自然和社会中一切自我调节系统的核心机制。',
    author: 'W. Ross Ashby',
    role: '控制论先驱',
    tags: ['control-theory', 'cybernetics', 'systems'],
  },
  {
    id: 'stability-1',
    text: '稳定不是一种状态，而是一种持续的自我调节过程。',
    author: 'Stafford Beer',
    role: '管理控制论之父',
    tags: ['control-theory', 'systems'],
  },
  // ===== 哲学与思维 =====
  {
    id: 'wittgenstein-1',
    text: '我的语言的界限意味着我的世界的界限。',
    author: 'Ludwig Wittgenstein',
    role: '分析哲学之父',
    tags: ['philosophy', 'language', 'logic'],
  },
  {
    id: 'russell-1',
    text: '数学，如果正确地看待它，不但拥有真理，而且拥有至高无上的美。',
    author: 'Bertrand Russell',
    role: '数学哲学家',
    tags: ['philosophy', 'math', 'beauty'],
  },
  {
    id: 'socrates-1',
    text: '未经审视的人生不值得过。',
    author: 'Socrates',
    role: '古希腊哲学家',
    tags: ['philosophy', 'learning'],
  },
  {
    id: 'descartes-1',
    text: '我思故我在。',
    author: 'René Descartes',
    role: '近代哲学之父',
    tags: ['philosophy', 'consciousness'],
  },
  {
    id: 'pascal-1',
    text: '人类的全部不幸，就在于不能安安静静地待在房间里。',
    author: 'Blaise Pascal',
    role: '数学家与哲学家',
    tags: ['philosophy', 'programming'],
  },
  {
    id: 'pascal-2',
    text: '心灵有其自身的逻辑，是理性所不能理解的。',
    author: 'Blaise Pascal',
    role: '数学家与哲学家',
    tags: ['philosophy', 'intuition'],
  },
  // ===== 数据结构与算法 =====
  {
    id: 'algorithm-1',
    text: '算法 + 数据结构 = 程序。',
    author: 'Niklaus Wirth',
    role: 'Pascal 语言设计者',
    tags: ['algorithms', 'data-structures', 'programming'],
  },
  {
    id: 'recursion-1',
    text: '要理解递归，你必须首先理解递归。',
    author: '匿名',
    role: '计算机科学经典悖论',
    tags: ['recursion', 'programming', 'humor'],
  },
  {
    id: 'sorting-1',
    text: '排序是计算机科学中最基本的操作之一，也是最能体现算法之美的领域。',
    author: 'Jon Bentley',
    role: '编程大师',
    tags: ['algorithms', 'sorting', 'programming'],
  },
  // ===== 编程哲学 =====
  {
    id: 'programming-1',
    text: '优秀的代码是最好的文档。当你需要添加注释时，应该思考如何改进代码。',
    author: 'Steve McConnell',
    role: '代码大全作者',
    tags: ['programming', 'best-practice', 'clean-code'],
  },
  {
    id: 'programming-2',
    text: '先让代码工作，再让代码正确，最后让代码高效。',
    author: 'Kent Beck',
    role: '极限编程创始人',
    tags: ['programming', 'best-practice', 'tdd'],
  },
  {
    id: 'programming-3',
    text: '任何傻瓜都能写出计算机能理解的代码。优秀的程序员写出的是人类能理解的代码。',
    author: 'Martin Fowler',
    role: '重构作者',
    tags: ['programming', 'clean-code', 'readability'],
  },
  {
    id: 'python-1',
    text: 'There should be one-- and preferably only one --obvious way to do it.',
    author: 'Tim Peters',
    role: 'Python 之禅',
    tags: ['python', 'programming', 'best-practice'],
  },
  {
    id: 'python-2',
    text: '优美胜于丑陋，明了胜于晦涩，简洁胜于复杂。',
    author: 'Tim Peters',
    role: 'Python 之禅',
    tags: ['python', 'programming', 'beauty'],
  },
  // ===== 错误处理与调试 =====
  {
    id: 'debug-1',
    text: '调试的难度是编写代码的两倍。因此，如果你在写代码时已经用尽了所有的聪明才智，那你就没有足够的才智来调试它。',
    author: 'Brian Kernighan',
    role: 'C 语言与 Unix 先驱',
    tags: ['debugging', 'programming'],
  },
  {
    id: 'debug-2',
    text: '先修复最离奇的 bug。',
    author: 'Brian Kernighan',
    role: 'C 语言与 Unix 先驱',
    tags: ['debugging', 'programming'],
  },
  // ===== 文件与数据 =====
  {
    id: 'data-1',
    text: '没有数据，你只是另一个有观点的人。',
    author: 'W. Edwards Deming',
    role: '质量管理大师',
    tags: ['data', 'statistics', 'science'],
  },
  // ===== 并发与系统 =====
  {
    id: 'unix-1',
    text: '做一件事并做好它。',
    author: 'Doug McIlroy',
    role: 'Unix 管道发明者',
    tags: ['programming', 'unix', 'best-practice'],
  },
  // ===== 标准库与工具 =====
  {
    id: 'stdlib-1',
    text: '标准库的存在是因为代码复用比复制粘贴更可靠。',
    author: 'Bjarne Stroustrup',
    role: 'C++ 之父',
    tags: ['programming', 'stdlib', 'reuse'],
  },
  // ===== 通用学习 =====
  {
    id: 'learning-1',
    text: '学习数学的最好方法是做数学。',
    author: 'Paul Halmos',
    role: '数学家',
    tags: ['learning', 'math'],
  },
  {
    id: 'learning-2',
    text: '我通过写来学习，只有在尝试表达时，我才发现我不知道我在想什么。',
    author: 'E. B. White',
    role: '作家',
    tags: ['learning', 'writing'],
  },
  {
    id: 'learning-3',
    text: '专家就是在一个非常小的领域里犯过所有可能错误的人。',
    author: 'Niels Bohr',
    role: '物理学家',
    tags: ['learning', 'expertise'],
  },
];

export function getQuoteById(id) {
  return quotes.find((q) => q.id === id) || null;
}

export function getQuotesByTag(tag) {
  return quotes.filter((q) => q.tags.includes(tag));
}

export function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function getRandomQuoteByTag(tag) {
  const matches = getQuotesByTag(tag);
  if (matches.length === 0) return getRandomQuote();
  return matches[Math.floor(Math.random() * matches.length)];
}

export function getQuoteForPage(slug, specificId = null) {
  if (specificId) {
    const found = getQuoteById(specificId);
    if (found) return found;
  }

  const topicMap = {
    'getting-started': 'programming',
    'basics': 'programming',
    'control-flow': 'programming',
    'data-structures': 'data-structures',
    'functions': 'programming',
    'oop': 'programming',
    'error-handling': 'debugging',
    'file-handling': 'data',
    'standard-library': 'stdlib',
    'modules': 'programming',
    'testing-debugging': 'debugging',
    'advanced': 'computer-science',
  };

  const category = slug.split('/')[0];
  const tag = topicMap[category];

  if (tag) {
    const matches = getQuotesByTag(tag);
    if (matches.length > 0) {
      return matches[Math.floor(Math.random() * matches.length)];
    }
  }

  return getRandomQuote();
}

export default quotes;
