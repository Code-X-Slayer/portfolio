/**
 * ==============================================================================
 * PORTFOLIO CONFIGURATION — SINGLE SOURCE OF TRUTH
 * ==============================================================================
 * Welcome! To edit anything on your portfolio (drive links, ratings, projects,
 * education, stats, or social profiles), simply modify the values below.
 *
 * Your changes will automatically reflect across the entire website without
 * needing to search through 1000+ lines of HTML!
 * ==============================================================================
 */

const portfolioConfig = {
  // 1. PERSONAL INFORMATION
  personal: {
    fullName: "Ryali Venkata Sri Vijay Karthik",
    shortName: "Vijay Karthik",
    statusBadge: "Available for Backend & AI Roles",
    titleHighlight: "backend APIs",
    tagline: "Engineering reliable backend APIs & scalable AI systems",
    bio: "Hi, I'm <strong>Ryali Venkata Sri Vijay Karthik</strong> — a software engineering student at Aditya University (9.09 CGPA) focused on building high-performance <strong>Python APIs</strong> (FastAPI, Flask), <strong>RAG pipelines</strong>, and data architectures. Active competitive programmer with <strong>1,770+ problems solved</strong>.",
    email: "karthikryali2007@gmail.com",
    avatarImage: "assets/logo.png",
    floatingBadges: {
      top: "FastAPI • RAG • SQL",
      bottomCount: "1,770+ Solved",
      bottomLabel: "Competitive Coding"
    }
  },

  // 2. DOCUMENT & DRIVE LINKS (Edit your drive links here in one place!)
  links: {
    // 🔗 Main Resume Link (Used in Navbar, Hero, and Footer)
    resumeDriveLink: "https://drive.google.com/file/d/1ygzKB71wWXQ9cYzWkuiDimRYXowxL0Lp/view?usp=sharing",

    // 🔗 Verified Transcripts & Credentials
    transcriptDriveLink: "https://drive.google.com/file/d/1vg2_GbXPfvPwKpVxuqB-70T-YmIzf2eG/view?usp=sharing",
    hirekruitCertificateLink: "https://drive.google.com/file/d/1tHCf93UC443762WvGTK8LjRfUH8cSX8H/view?usp=drive_link",
    dockerCertificateLink: "https://drive.google.com/file/d/1xq6vgo4O8gblTm2yxNDU9Wn5P1RPMx_J/view?usp=sharing",
    ociCertificateLink: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=2E74789A0D2D8250E10C2DB6EB066BC9115A5A9B1AAD06BB3AB6DA615953DF9A",
    ibmDataScienceLink: "https://www.credly.com/badges/1c13d56a-e71b-4be5-81f8-e2a51f849e76/public_url",
    ibmPythonAiLink: "https://www.credly.com/badges/6daf7796-cb6f-4cc0-bc33-88ba8b81d7c6/public_url",
    codeCarnivalPost: "https://www.linkedin.com/posts/venkata-sri-vijay-karthik-ryali-350895355_codecarnival2k25-adityauniversity-1stprize-activity-7359460751742267393-DkrC",
    icpcSelectionPool: "https://indiaicpc.in/selection_pool_2026.html"
  },

  // 3. SOCIAL & CODING PLATFORMS (Handles, URLs, and real logo image paths)
  profiles: [
    {
      id: "github",
      name: "GitHub",
      url: "https://github.com/Code-X-Slayer",
      icon: "assets/github.png",
      label: "GitHub"
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/venkata-sri-vijay-karthik-ryali-350895355/",
      icon: "assets/linkedin.png",
      label: "LinkedIn"
    },
    {
      id: "leetcode",
      name: "LeetCode",
      url: "https://leetcode.com/u/codeXslayer/",
      icon: "assets/leetcode.png",
      label: "LeetCode 1775",
      metric: "1775 Rating"
    },
    {
      id: "codechef",
      name: "CodeChef",
      url: "https://www.codechef.com/users/code_x_slayer",
      icon: "assets/codechef.png",
      label: "CodeChef 1904",
      metric: "1904 DSA • 2★"
    },
    {
      id: "codolio",
      name: "Codolio",
      url: "https://codolio.com/profile/code-x-slayer",
      icon: "assets/codolio-icon.png",
      label: "Codolio",
      metric: "Unified Tracker"
    }
  ],

  // 4. COMPETITIVE PROGRAMMING METRICS
  stats: [
    {
      count: 1770,
      suffix: "+",
      title: "DSA Problems Solved",
      caption: "Across LeetCode, CodeChef, Code360 & HackerRank"
    },
    {
      count: 116,
      suffix: "",
      title: "Contests Participated",
      caption: "Regular timed competitive rounds",
      highlight: true
    },
    {
      count: 1775,
      suffix: "",
      title: "LeetCode Peak",
      caption: "Top percentile problem solver",
      logo: "assets/leetcode.png"
    },
    {
      count: 1904,
      suffix: "",
      title: "CodeChef DSA Peak",
      caption: "2-Star Rated (Peak 1538 Overall)",
      logo: "assets/codechef.png"
    }
  ],

  // 5. FEATURED PROJECTS (Add a new project by just duplicating an entry here!)
  projects: [
    {
      id: "devmeter",
      title: "DevMeter — API Gateway MVP",
      category: "Backend System",
      date: "Sep 2026",
      description: "A modular API gateway service with dynamic upstream service registration, secure API key generation/revocation, and authenticated reverse request proxying.",
      features: [
        "<strong>Per-Key Daily Quotas:</strong> Enforced granular usage limits with fast SQL-based tracking.",
        "<strong>Usage Analytics:</strong> Real-time statistics including request throughput, success ratios, and latency.",
        "<strong>Enterprise Structure:</strong> Layered architecture, Alembic migrations, Pytest suite, and CI pipeline."
      ],
      tags: ["FastAPI", "SQLAlchemy", "Python", "React", "Alembic", "CI/CD"],
      githubUrl: "https://github.com/Code-X-Slayer/dev-meter",
      buttonText: "View Repository"
    },
    {
      id: "data-warehouse",
      title: "SQL Data Warehouse & Analytics",
      category: "Data Architecture",
      date: "May 2026",
      description: "An end-to-end data warehouse solution implemented on SQL Server utilizing the Bronze-Silver-Gold architecture to process and analyze CRM and ERP business datasets.",
      features: [
        "<strong>Star Schema Design:</strong> Fact and dimension data modeling optimized for high-performance analytical queries.",
        "<strong>ETL & Data Quality:</strong> Stored procedures and automated cleansing scripts ensuring high data integrity.",
        "<strong>Advanced SQL:</strong> Multi-dimensional reporting using CTEs, window functions, and customer/product segmentation."
      ],
      tags: ["SQL Server", "T-SQL", "ETL", "Star Schema", "Analytics"],
      githubUrl: "https://github.com/Code-X-Slayer/data-warehouse-project",
      buttonText: "View Repository"
    }
  ],

  // 6. WORK EXPERIENCE
  experience: [
    {
      num: "01",
      role: "Software Development Intern",
      company: "HiRekruit",
      meta: "AI Recruitment Platform • Remote • Dec 2025 – Feb 2026",
      description: "Collaborated on core backend features for an AI-driven recruitment platform, connecting LLM tools and vector search into existing production services.",
      highlights: [
        "Integrated <strong>Groq LLM</strong> and <strong>Tavily AI</strong> search APIs into a Flask backend using <strong>LangChain</strong> to query company context dynamically.",
        "Engineered a <strong>Retrieval-Augmented Generation (RAG)</strong> pipeline: document chunking, dense vector embeddings, storage, and similarity search inside <strong>MongoDB Atlas</strong>.",
        "Hardened API endpoints against missing context and malformed inputs; prepared clean technical documentation for the RAG ingestion lifecycle."
      ],
      links: [
        { label: "Visit HiRekruit →", url: "https://hirekruit.com/" },
        { label: "View Internship Certificate →", url: "https://drive.google.com/file/d/1tHCf93UC443762WvGTK8LjRfUH8cSX8H/view?usp=drive_link" }
      ],
      isOpen: true
    },
    {
      num: "02",
      role: "Software Developer",
      company: "Code to Win",
      meta: "Aditya University Collaborative Project",
      description: "Student platform built to streamline coding competitions, student verification, and competitive rankings across the university.",
      highlights: [
        "Designed a resilient self-service password reset and recovery system.",
        "Integrated the <strong>Codeforces Public API</strong> to automate competitor profile sync and score tracking.",
        "Built a custom bio-based account ownership verification check using JavaScript to eliminate spoofed handles."
      ],
      links: [],
      isOpen: false
    }
  ],

  // 7. EDUCATION
  education: {
    institution: "Aditya University",
    location: "Surampalem, Andhra Pradesh, India",
    degree: "B.Tech. in Artificial Intelligence & Machine Learning",
    cgpa: "9.09 / 10",
    graduation: "Expected Graduation: 2028",
    description: "Focused on distributed backend systems, algorithmic problem solving, machine learning pipelines, and database architecture.",
    coursework: [
      "Data Structures & Algorithms",
      "Machine Learning",
      "Database Management",
      "Python & Java OOP",
      "Backend Web Architectures"
    ],
    transcriptUrl: "https://drive.google.com/file/d/1vg2_GbXPfvPwKpVxuqB-70T-YmIzf2eG/view?usp=sharing"
  },

  // 8. CERTIFICATIONS
  certifications: [
    {
      title: "Docker Foundations Professional",
      issuer: "LinkedIn Learning • Jul 2026",
      icon: "🚀",
      verifyUrl: "https://drive.google.com/file/d/1xq6vgo4O8gblTm2yxNDU9Wn5P1RPMx_J/view?usp=sharing"
    },
    {
      title: "OCI Foundations Associate",
      issuer: "Oracle Cloud Infrastructure • Oct 2025",
      icon: "☁️",
      verifyUrl: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=2E74789A0D2D8250E10C2DB6EB066BC9115A5A9B1AAD06BB3AB6DA615953DF9A"
    },
    {
      title: "Python Project for Data Science",
      issuer: "IBM via Coursera • Sep 2025",
      icon: "🐍",
      verifyUrl: "https://www.credly.com/badges/1c13d56a-e71b-4be5-81f8-e2a51f849e76/public_url"
    },
    {
      title: "Python for Data Science & AI",
      issuer: "IBM via Coursera • Aug 2025",
      icon: "🤖",
      verifyUrl: "https://www.credly.com/badges/6daf7796-cb6f-4cc0-bc33-88ba8b81d7c6/public_url"
    }
  ]
};

// Export for Node environments if required
if (typeof module !== 'undefined' && module.exports) {
  module.exports = portfolioConfig;
}

