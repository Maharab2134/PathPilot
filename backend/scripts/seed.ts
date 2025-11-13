import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../src/models/Category';
import Question from '../src/models/Question';
import User from '../src/models/User';
import CareerInfo from '../src/models/CareerInfo';

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/pathpilot';

const categories = [
  {
    name: 'Programming',
    description: 'Software development, coding, and programming concepts',
  },
  {
    name: 'AI & Machine Learning',
    description: 'Artificial Intelligence, Machine Learning, and Data Science',
  },
  {
    name: 'Design',
    description: 'UI/UX Design, Graphic Design, and User Experience',
  },
  {
    name: 'Business',
    description: 'Business management, entrepreneurship, and marketing',
  },
  {
    name: 'Data Science',
    description: 'Data analysis, visualization, and statistical modeling',
  },
];

const programmingQuestions = [
  {
    text: 'What does HTML stand for?',
    options: [
      'Hyper Text Markup Language',
      'High Tech Modern Language',
      'Hyper Transfer Markup Language',
      'Home Tool Markup Language',
    ],
    correctIndex: 0,
    difficulty: 'easy',
    explanation:
      'HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.',
  },
  {
    text: 'Which of the following is NOT a JavaScript data type?',
    options: ['undefined', 'number', 'boolean', 'character'],
    correctIndex: 3,
    difficulty: 'easy',
    explanation:
      'JavaScript has undefined, number, boolean, string, object, symbol, and bigint, but not character as a separate type.',
  },
  {
    text: 'What is the time complexity of binary search?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    correctIndex: 2,
    difficulty: 'medium',
    explanation:
      'Binary search has O(log n) time complexity as it divides the search space in half with each iteration.',
  },
  {
    text: 'Which principle does the "D" in SOLID represent?',
    options: [
      'Data Segregation Principle',
      'Dependency Inversion Principle',
      'Dynamic Binding Principle',
      'Domain Driven Design',
    ],
    correctIndex: 1,
    difficulty: 'hard',
    explanation:
      'The "D" in SOLID stands for Dependency Inversion Principle, which states that high-level modules should not depend on low-level modules.',
  },
  {
    text: 'What is React primarily used for?',
    options: [
      'Backend development',
      'Mobile app development',
      'Building user interfaces',
      'Database management',
    ],
    correctIndex: 2,
    difficulty: 'easy',
    explanation:
      'React is a JavaScript library for building user interfaces, particularly for web applications.',
  },
];

const aiQuestions = [
  {
    text: 'What is the primary goal of Machine Learning?',
    options: [
      'To program explicit rules for every scenario',
      'To enable computers to learn from data',
      'To replace human intelligence completely',
      'To create artificial consciousness',
    ],
    correctIndex: 1,
    difficulty: 'easy',
    explanation:
      'Machine Learning enables computers to learn patterns from data without being explicitly programmed for every scenario.',
  },
  {
    text: 'Which algorithm is commonly used for classification problems?',
    options: ['K-Means', 'Linear Regression', 'Logistic Regression', 'Apriori'],
    correctIndex: 2,
    difficulty: 'medium',
    explanation:
      'Logistic Regression is commonly used for binary classification problems, despite its name including "regression".',
  },
  {
    text: 'What does "CNN" stand for in deep learning?',
    options: [
      'Cellular Neural Network',
      'Convolutional Neural Network',
      'Complex Neural Network',
      'Cascading Neural Network',
    ],
    correctIndex: 1,
    difficulty: 'medium',
    explanation:
      'CNN stands for Convolutional Neural Network, which is particularly effective for image recognition tasks.',
  },
  {
    text: 'What is the purpose of the activation function in a neural network?',
    options: [
      'To increase computation speed',
      'To introduce non-linearity',
      'To reduce memory usage',
      'To normalize input data',
    ],
    correctIndex: 1,
    difficulty: 'hard',
    explanation:
      'Activation functions introduce non-linearity, allowing neural networks to learn complex patterns.',
  },
  {
    text: 'Which of these is a reinforcement learning algorithm?',
    options: [
      'Q-Learning',
      'K-Nearest Neighbors',
      'Support Vector Machine',
      'Decision Tree',
    ],
    correctIndex: 0,
    difficulty: 'medium',
    explanation:
      'Q-Learning is a popular reinforcement learning algorithm used for Markov decision processes.',
  },
];

const designQuestions = [
  {
    text: 'What does UX stand for in design?',
    options: [
      'User Experience',
      'Universal X-factor',
      'User Excellence',
      'Ultimate Experience',
    ],
    correctIndex: 0,
    difficulty: 'easy',
    explanation:
      'UX stands for User Experience, which focuses on the overall experience a user has with a product or service.',
  },
  {
    text: 'Which color combination represents complementary colors?',
    options: [
      'Red and Blue',
      'Red and Green',
      'Blue and Yellow',
      'Red and Orange',
    ],
    correctIndex: 1,
    difficulty: 'medium',
    explanation:
      'Red and Green are complementary colors, meaning they are opposite each other on the color wheel.',
  },
  {
    text: 'What is the primary purpose of wireframing?',
    options: [
      'To add colors and styles',
      'To define the visual hierarchy',
      'To create final designs',
      'To test functionality',
    ],
    correctIndex: 1,
    difficulty: 'easy',
    explanation:
      'Wireframing helps define the visual hierarchy and layout without focusing on colors and styles.',
  },
  {
    text: 'Which principle suggests that elements close together are perceived as related?',
    options: ['Similarity', 'Proximity', 'Continuity', 'Closure'],
    correctIndex: 1,
    difficulty: 'medium',
    explanation:
      'The principle of Proximity in Gestalt psychology states that elements close to each other are perceived as related.',
  },
  {
    text: 'What is responsive design?',
    options: [
      'Design that responds to user emotions',
      'Design that works on different screen sizes',
      'Design with interactive elements',
      'Design that loads quickly',
    ],
    correctIndex: 1,
    difficulty: 'easy',
    explanation:
      'Responsive design ensures websites work well on various devices and screen sizes.',
  },
];

const businessQuestions = [
  {
    text: 'What does SWOT analysis stand for?',
    options: [
      'Strengths, Weaknesses, Opportunities, Threats',
      'Sales, Workforce, Operations, Technology',
      'Strategy, Workflow, Organization, Tactics',
      'System, Work, Output, Time',
    ],
    correctIndex: 0,
    difficulty: 'easy',
    explanation:
      'SWOT stands for Strengths, Weaknesses, Opportunities, Threats - a strategic planning technique.',
  },
  {
    text: 'What is the primary goal of a startup?',
    options: [
      'Maximize employee count',
      'Achieve rapid growth',
      'Minimize office space',
      'Reduce customer base',
    ],
    correctIndex: 1,
    difficulty: 'easy',
    explanation:
      'Startups typically focus on achieving rapid growth and scaling their business model.',
  },
  {
    text: 'Which financial statement shows revenue and expenses?',
    options: [
      'Balance Sheet',
      'Income Statement',
      'Cash Flow Statement',
      'Statement of Equity',
    ],
    correctIndex: 1,
    difficulty: 'medium',
    explanation:
      'The Income Statement shows revenue, expenses, and profit/loss over a period.',
  },
  {
    text: 'What is market segmentation?',
    options: [
      'Dividing a market into distinct groups',
      'Creating new markets',
      'Eliminating competition',
      'Increasing product prices',
    ],
    correctIndex: 0,
    difficulty: 'medium',
    explanation:
      'Market segmentation involves dividing a broad market into subgroups of consumers with similar needs.',
  },
  {
    text: 'What does ROI stand for?',
    options: [
      'Return on Investment',
      'Rate of Interest',
      'Risk of Inflation',
      'Revenue on Inventory',
    ],
    correctIndex: 0,
    difficulty: 'easy',
    explanation:
      'ROI stands for Return on Investment, a performance measure used to evaluate efficiency.',
  },
];

const dataScienceQuestions = [
  {
    text: 'What is the purpose of data normalization?',
    options: [
      'To increase data size',
      'To scale data to a specific range',
      'To remove all outliers',
      'To encrypt sensitive data',
    ],
    correctIndex: 1,
    difficulty: 'medium',
    explanation:
      'Data normalization scales numerical data to a common range, often between 0 and 1.',
  },
  {
    text: 'Which library is commonly used for data manipulation in Python?',
    options: ['TensorFlow', 'Pandas', 'Scikit-learn', 'Matplotlib'],
    correctIndex: 1,
    difficulty: 'easy',
    explanation:
      'Pandas is the primary library for data manipulation and analysis in Python.',
  },
  {
    text: 'What is overfitting in machine learning?',
    options: [
      'Model performs well on training data but poorly on new data',
      'Model performs poorly on all data',
      'Model is too simple for the data',
      'Model training takes too long',
    ],
    correctIndex: 0,
    difficulty: 'medium',
    explanation:
      'Overfitting occurs when a model learns the training data too well, including noise, and performs poorly on unseen data.',
  },
  {
    text: 'What is the main use of a confusion matrix?',
    options: [
      'To visualize neural network architecture',
      'To evaluate classification model performance',
      'To store large datasets',
      'To preprocess text data',
    ],
    correctIndex: 1,
    difficulty: 'medium',
    explanation:
      'A confusion matrix is used to evaluate the performance of classification models by showing actual vs predicted classifications.',
  },
  {
    text: 'Which of these is a supervised learning algorithm?',
    options: [
      'K-Means Clustering',
      'Principal Component Analysis',
      'Linear Regression',
      'Apriori Algorithm',
    ],
    correctIndex: 2,
    difficulty: 'easy',
    explanation:
      'Linear Regression is a supervised learning algorithm used for predicting continuous values.',
  },
];

const careerInfos = [
  {
    title: 'Software Developer',
    description:
      'Software developers design, develop, and maintain software applications. They work with programming languages, frameworks, and tools to create solutions that solve real-world problems. Software development offers excellent career growth and competitive salaries.',
    skills: [
      'JavaScript',
      'Python',
      'Java',
      'React',
      'Node.js',
      'SQL',
      'Git',
      'Agile Methodology',
    ],
    learningPath: [
      'Learn programming fundamentals (variables, loops, functions)',
      'Master at least one programming language',
      'Learn version control with Git',
      'Understand databases and SQL',
      'Learn about software architecture and design patterns',
      'Build portfolio projects',
      'Practice algorithm and data structure problems',
    ],
    youtubeLinks: [
      'https://www.youtube.com/watch?v=rfscVS0vtbw',
      'https://www.youtube.com/watch?v=ZxKM3DCV2kE',
      'https://www.youtube.com/watch?v=HcOc7P5BMi4',
    ],
    bookLinks: [
      'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882',
      'https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612',
    ],
    courseLinks: [
      'https://www.coursera.org/specializations/java-programming',
      'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
    ],
    minScore: 70,
  },
  {
    title: 'AI Engineer',
    description:
      'AI Engineers develop intelligent systems and machine learning models. They work on cutting-edge technologies like neural networks, natural language processing, and computer vision. This field requires strong mathematical foundations and programming skills.',
    skills: [
      'Python',
      'TensorFlow',
      'PyTorch',
      'Machine Learning',
      'Deep Learning',
      'Statistics',
      'Data Preprocessing',
    ],
    learningPath: [
      'Learn Python programming and data analysis',
      'Study linear algebra, calculus, and statistics',
      'Learn machine learning fundamentals',
      'Master deep learning frameworks',
      'Work on real-world AI projects',
      'Stay updated with research papers',
      'Participate in Kaggle competitions',
    ],
    youtubeLinks: [
      'https://www.youtube.com/watch?v=aircAruvnKk',
      'https://www.youtube.com/watch?v=VMj-3S1tku0',
      'https://www.youtube.com/watch?v=7sB052Pz0sQ',
    ],
    bookLinks: [
      'https://www.amazon.com/Hands-Machine-Learning-Scikit-Learn-TensorFlow/dp/1492032646',
      'https://www.amazon.com/Deep-Learning-Adaptive-Computation-Machine/dp/0262035618',
    ],
    courseLinks: [
      'https://www.coursera.org/specializations/deep-learning',
      'https://www.coursera.org/learn/machine-learning',
    ],
    minScore: 75,
  },
  {
    title: 'UX/UI Designer',
    description:
      'UX/UI Designers create intuitive and engaging digital experiences. They combine user research, interaction design, and visual design to create products that are both functional and beautiful. This role requires empathy, creativity, and technical skills.',
    skills: [
      'User Research',
      'Wireframing',
      'Prototyping',
      'Figma',
      'Adobe XD',
      'Usability Testing',
      'Visual Design',
    ],
    learningPath: [
      'Learn design principles and psychology',
      'Master design tools like Figma or Adobe XD',
      'Study user research methods',
      'Practice wireframing and prototyping',
      'Learn about accessibility and inclusive design',
      'Build a design portfolio',
      'Get feedback from real users',
    ],
    youtubeLinks: [
      'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
      'https://www.youtube.com/watch?v=6MgyufH3a6M',
      'https://www.youtube.com/watch?v=O__6O9e5R6s',
    ],
    bookLinks: [
      'https://www.amazon.com/Dont-Make-Think-Revisited-Usability/dp/0321965515',
      'https://www.amazon.com/Design-Everyday-Things-Revised-Expanded/dp/0465050654',
    ],
    courseLinks: [
      'https://www.coursera.org/specializations/google-ux-design',
      'https://www.udemy.com/course/ui-ux-web-design-using-adobe-xd/',
    ],
    minScore: 70,
  },
  {
    title: 'Business Analyst',
    description:
      'Business Analysts bridge the gap between business needs and technical solutions. They analyze business processes, gather requirements, and help organizations improve efficiency and achieve their goals through technology and process improvements.',
    skills: [
      'Requirements Gathering',
      'Process Modeling',
      'Data Analysis',
      'Stakeholder Management',
      'SQL',
      'Business Intelligence',
    ],
    learningPath: [
      'Learn business analysis fundamentals',
      'Develop communication and facilitation skills',
      'Learn process modeling techniques',
      'Understand data analysis basics',
      'Get familiar with project management',
      'Obtain relevant certifications',
      'Gain industry-specific knowledge',
    ],
    youtubeLinks: [
      'https://www.youtube.com/watch?v=4rM2U-NrX_s',
      'https://www.youtube.com/watch?v=Y3Y49kOqgO4',
      'https://www.youtube.com/watch?v=PztBRVxa3xg',
    ],
    bookLinks: [
      'https://www.amazon.com/Business-Analysis-Babok-Guide-Essentials/dp/0981129218',
      'https://www.amazon.com/User-Stories-Applied-Development-Addison-Wesley/dp/0321205685',
    ],
    courseLinks: [
      'https://www.coursera.org/professional-certificates/google-data-analytics',
      'https://www.coursera.org/learn/business-analysis-process',
    ],
    minScore: 65,
  },
  {
    title: 'Data Scientist',
    description:
      'Data Scientists extract insights from complex datasets using statistical analysis, machine learning, and data visualization. They help organizations make data-driven decisions and solve complex business problems through analytical techniques.',
    skills: [
      'Python',
      'R',
      'SQL',
      'Statistics',
      'Machine Learning',
      'Data Visualization',
      'Big Data Technologies',
    ],
    learningPath: [
      'Learn programming (Python/R)',
      'Master statistics and probability',
      'Learn data manipulation and visualization',
      'Study machine learning algorithms',
      'Practice with real datasets',
      'Learn about big data technologies',
      'Develop business domain knowledge',
    ],
    youtubeLinks: [
      'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
      'https://www.youtube.com/watch?v=ua-CiDNNj30',
      'https://www.youtube.com/watch?v=X3paOmcrTjQ',
    ],
    bookLinks: [
      'https://www.amazon.com/Python-Data-Analysis-Wrangling-IPython/dp/1491957662',
      'https://www.amazon.com/Introduction-Statistical-Learning-Applications-Statistics/dp/1461471370',
    ],
    courseLinks: [
      'https://www.coursera.org/specializations/jhu-data-science',
      'https://www.coursera.org/professional-certificates/ibm-data-science',
    ],
    minScore: 75,
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Question.deleteMany({});
    await CareerInfo.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create admin user
    const adminPassword = 'admin123';
    // Set plaintext here; User pre-save hook will hash once
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@gmail.com',
      passwordHash: adminPassword,
      role: 'admin',
    });

    await adminUser.save();
    console.log('✅ Created admin user');
    console.log(`   Email: admin@gmail.com`);
    console.log(`   Password: ${adminPassword}`);

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create questions for each category
    const categoryMap = {
      Programming: createdCategories[0]!._id,
      'AI & Machine Learning': createdCategories[1]!._id,
      Design: createdCategories[2]!._id,
      Business: createdCategories[3]!._id,
      'Data Science': createdCategories[4]!._id,
    };

    const allQuestions = [
      ...programmingQuestions.map((q) => ({
        ...q,
        categoryId: categoryMap['Programming'],
      })),
      ...aiQuestions.map((q) => ({
        ...q,
        categoryId: categoryMap['AI & Machine Learning'],
      })),
      ...designQuestions.map((q) => ({
        ...q,
        categoryId: categoryMap['Design'],
      })),
      ...businessQuestions.map((q) => ({
        ...q,
        categoryId: categoryMap['Business'],
      })),
      ...dataScienceQuestions.map((q) => ({
        ...q,
        categoryId: categoryMap['Data Science'],
      })),
    ];

    await Question.insertMany(allQuestions);
    console.log(`✅ Created ${allQuestions.length} questions`);

    // Create career info
    const careerInfoData = careerInfos.map((info, index) => ({
      ...info,
      categoryId: createdCategories[index]!._id,
    }));

    await CareerInfo.insertMany(careerInfoData);
    console.log(`✅ Created ${careerInfoData.length} career info entries`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Admin user: admin@gmail.com / ${adminPassword}`);
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Questions: ${allQuestions.length}`);
    console.log(`   - Career Info: ${careerInfoData.length}`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
