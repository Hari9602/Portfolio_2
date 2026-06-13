/* ============================================================
   Content source: harikrishnanvj.tech  (factual, re-presented)
   ============================================================ */

export const profile = {
  name: "Harikrishnan VJ",
  shortName: "Harikrishnan",
  initials: "HV",
  role: "Penetration Tester & Purple Teamer",
  roles: [
    "Penetration Tester",
    "Purple Team Operator",
    "Digital Forensics Analyst",
    "Vulnerability Researcher",
  ],
  tagline:
    "I break systems to prove how they hold — mapping attack surface, validating exploitability, and engineering the defenses that close the gap.",
  location: "India",
  status: "Available for security roles & engagements",
  email: "harikrishnan9602@gmail.com",
  phone: "+91 79948 20277",
  links: {
    linkedin: "https://linkedin.com/in/harikrishnan-v-j/",
    github: "https://github.com/Hari9602",
    tryhackme: "https://tryhackme.com/",
    email: "mailto:harikrishnan9602@gmail.com",
  },
};

export const stats = [
  { value: "Top 1%", label: "Global rank · TryHackMe", accent: "cyan" },
  { value: "13", label: "Industry certifications", accent: "violet" },
  { value: "5", label: "CTF podium finishes", accent: "magenta" },
  { value: "10+", label: "Security domains", accent: "aqua" },
];

export const about = {
  lead:
    "I'm a cybersecurity specialist operating at the intersection of offense and defense — a purple teamer who thinks like an attacker and builds like a defender.",
  body: [
    "My focus is the full assessment lifecycle: reconnaissance, vulnerability identification, exploitation, and the remediation engineering that actually moves the needle. I live in the methodology — understanding precisely how a system can be compromised, then turning that understanding into resilient, defensible architecture.",
    "Hands-on practice drives everything I do. Through hundreds of TryHackMe labs and competitive CTFs, I've built a problem-solving discipline grounded in real adversary tradecraft — not theory. Network security, digital forensics, and infrastructure automation are where I go deepest.",
  ],
  principles: [
    {
      title: "Adversarial Mindset",
      desc: "Every system is a hypothesis waiting to be tested. I assume breach and work backward to the weakest link.",
    },
    {
      title: "Evidence Over Assumption",
      desc: "Findings are proven with reproducible exploitation, captured artifacts, and verifiable impact — never speculation.",
    },
    {
      title: "Defense by Design",
      desc: "Offense without remediation is just noise. Each finding ships with a concrete, prioritized path to resolution.",
    },
  ],
};

export type Experience = {
  role: string;
  company: string;
  type: string;
  period: string;
  duration: string;
  location: string;
  mode: string;
  current: boolean;
  summary: string;
  highlights: string[];
  stack: string[];
  accent: string;
};

export const experience: Experience[] = [
  {
    role: "VAPT Intern",
    company: "Bima Sugam India Federation",
    type: "Internship",
    period: "Apr 2026 — Present",
    duration: "3 mos",
    location: "Mumbai, Maharashtra, India",
    mode: "On-site",
    current: true,
    summary:
      "Hands-on vulnerability assessment and penetration testing across the digital insurance infrastructure of India's national insurance-platform federation.",
    highlights: [
      "Run end-to-end VAPT engagements against web applications and network services, mapping attack surface and validating real exploitability.",
      "Test against the OWASP Top 10 and document findings with reproducible proof-of-concept and risk-rated severity.",
      "Translate findings into clear, prioritized remediation guidance for engineering teams — closing the loop from offense to defense.",
    ],
    stack: ["VAPT", "Web App Security", "Network Security", "OWASP", "Reporting"],
    accent: "cyan",
  },
];

export type Expertise = {
  id: string;
  title: string;
  blurb: string;
  capabilities: string[];
  accent: string;
};

export const expertise: Expertise[] = [
  {
    id: "vapt",
    title: "Vulnerability Assessment & Penetration Testing",
    blurb:
      "End-to-end VAPT — from automated discovery to manual exploitation and risk-rated reporting.",
    capabilities: ["Recon & Enumeration", "Exploitation", "Risk Rating", "Remediation"],
    accent: "cyan",
  },
  {
    id: "network",
    title: "Network Security",
    blurb:
      "Mapping topology, hunting exposed services, and validating segmentation under real attack conditions.",
    capabilities: ["Nmap", "Traffic Analysis", "Service Hardening", "Segmentation"],
    accent: "azure",
  },
  {
    id: "forensics",
    title: "Digital Forensics",
    blurb:
      "Disk, memory, and network forensics with rigorous evidence preservation and chain of custody.",
    capabilities: ["Autopsy", "FTK Imager", "Artifact Analysis", "Memory Forensics"],
    accent: "violet",
  },
  {
    id: "threat",
    title: "Threat Detection & Modeling",
    blurb:
      "Purple-team detection engineering mapped to MITRE ATT&CK, closing the loop between attack and alert.",
    capabilities: ["MITRE ATT&CK", "Detection Eng.", "Threat Modeling", "Risk Management"],
    accent: "magenta",
  },
  {
    id: "appsec",
    title: "Application & Web Security",
    blurb:
      "OWASP-driven testing of web surfaces — source review, injection, and logic-flaw hunting.",
    capabilities: ["OWASP Top 10", "Source Review", "Injection", "Logic Flaws"],
    accent: "aqua",
  },
  {
    id: "infra",
    title: "Systems & Infrastructure",
    blurb:
      "Linux administration and automation that bakes security into the operational baseline.",
    capabilities: ["Linux (RHCSA)", "Automation", "Hardening", "Bash / Python"],
    accent: "cyan",
  },
];

export type Project = {
  id: string;
  name: string;
  type: string;
  summary: string;
  challenge: string;
  methodology: string;
  findings: string;
  impact: string;
  stack: string[];
  accent: string;
};

export const projects: Project[] = [
  {
    id: "vulnscanner",
    name: "VulnScanner",
    type: "Offensive Tooling",
    summary:
      "A containerized reconnaissance engine that chains network scanning to live exploit intelligence.",
    challenge:
      "Manual recon is slow and inconsistent. Analysts need a portable, repeatable way to map a target and instantly surface known exploits for discovered services.",
    methodology:
      "Built a Dockerized pipeline orchestrating Nmap service/version detection, then piping enumerated services into SearchSploit to correlate live exploit availability — fully scripted in Bash for one-command deployment.",
    findings:
      "Reduced the discovery-to-exploit-intel loop from a multi-tool manual workflow to a single reproducible container run, with consistent output across any host environment.",
    impact:
      "A drop-in recon asset that standardizes the earliest, most error-prone phase of an engagement and accelerates triage.",
    stack: ["Docker", "Nmap", "SearchSploit", "Bash"],
    accent: "cyan",
  },
  {
    id: "sharkhunt",
    name: "SharkHunt",
    type: "Network Forensics · CTF",
    summary:
      "Deep packet analysis challenge — extracting hidden data from captured network traffic.",
    challenge:
      "A PCAP capture concealed exfiltrated data across noisy network traffic. The task: reconstruct the story the packets tell and recover the payload.",
    methodology:
      "Dissected the capture in Wireshark — following TCP streams, filtering by protocol, and isolating anomalous flows to trace the data path and reassemble the hidden artifact.",
    findings:
      "Successfully extracted the concealed data by correlating protocol behavior with packet-level anomalies, demonstrating practical traffic-inspection tradecraft.",
    impact:
      "Sharpened real-world incident-response skills in evidence reconstruction from raw network captures.",
    stack: ["Wireshark", "PCAP", "Networking", "Forensics"],
    accent: "violet",
  },
  {
    id: "decodethelook",
    name: "DecodeTheLook",
    type: "Web Exploitation · CTF",
    summary:
      "Source-inspection web challenge surfacing data hidden in plain sight behind encoding layers.",
    challenge:
      "A web application hid its secret in client-side source and obfuscated it with layered encoding — rewarding methodical inspection over brute force.",
    methodology:
      "Audited the page source for embedded artifacts, identified Base64-encoded strings, and decoded the layers to reconstruct the hidden flag.",
    findings:
      "Recovered the concealed value through systematic source review and decoding — reinforcing how often sensitive data leaks through the client.",
    impact:
      "Demonstrates the high-yield habit of treating every byte the client receives as untrusted and inspectable.",
    stack: ["HTML", "JavaScript", "Base64", "Web"],
    accent: "magenta",
  },
];

export type CertItem = { name: string; date: string; url?: string };
export type CertGroup = {
  issuer: string;
  accent: string;
  items: CertItem[];
};

/* To make a certification clickable, paste its verification URL into `url`.
   CompTIA / Fortinet verify via Credly (credly.com/badges/<id>);
   Red Hat via rhtapps.redhat.com/verify; others via the issuer's link.
   Leave url as "" to keep a cert non-clickable. */
export const certifications: CertGroup[] = [
  {
    issuer: "CompTIA",
    accent: "cyan",
    items: [
      {
        name: "Network Vulnerability Assessment Professional",
        date: "Sep 2025",
        url: "https://www.credly.com/badges/0e921077-1480-423b-9c6e-2cec863c5c12/public_url",
      },
      {
        name: "Network Security Professional",
        date: "Sep 2025",
        url: "https://www.credly.com/badges/26261674-f087-4b77-9bea-4b37f416b55e/public_url",
      },
      {
        name: "PenTest+ CE",
        date: "Sep 2025",
        url: "https://www.credly.com/badges/c27fbca0-be38-4edf-9c90-0b0b090d756d/public_url",
      },
      {
        name: "CSAP — Security Analytics Professional",
        date: "Aug 2025",
        url: "https://www.credly.com/badges/5840e93a-4255-4057-a73f-f02db180551b/public_url",
      },
      {
        name: "CySA+ CE",
        date: "Aug 2025",
        url: "https://www.credly.com/badges/67c294d0-9459-4e0e-862c-6e6365294904/public_url",
      },
      {
        name: "Security+ CE",
        date: "Feb 2025",
        url: "https://www.credly.com/badges/23f4e83a-a8a6-4e59-801c-19b7467a0961/public_url",
      },
    ],
  },
  {
    issuer: "Red Hat",
    accent: "magenta",
    items: [
      {
        name: "System Administration II (RH134)",
        date: "Jul 2024",
        url: "https://1yx6sr-my.sharepoint.com/personal/harikrishnan9602_1yx6sr_onmicrosoft_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fharikrishnan9602%5F1yx6sr%5Fonmicrosoft%5Fcom%2FDocuments%2FCertificates%2FRHEL%2F%28RH134%2D9%2E0%29%20Certificate%2Epdf&parent=%2Fpersonal%2Fharikrishnan9602%5F1yx6sr%5Fonmicrosoft%5Fcom%2FDocuments%2FCertificates%2FRHEL&ga=1",
      },
      {
        name: "System Administration I (RH124)",
        date: "Jun 2024",
        url: "https://1yx6sr-my.sharepoint.com/personal/harikrishnan9602_1yx6sr_onmicrosoft_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fharikrishnan9602%5F1yx6sr%5Fonmicrosoft%5Fcom%2FDocuments%2FCertificates%2FRHEL%2F%28RH124%2D9%2E0%29%20Certificate%2Epdf&parent=%2Fpersonal%2Fharikrishnan9602%5F1yx6sr%5Fonmicrosoft%5Fcom%2FDocuments%2FCertificates%2FRHEL&ga=1",
      },
    ],
  },
  {
    issuer: "Quick Heal",
    accent: "violet",
    items: [
      {
        name: "Certified Digital Forensic Investigator",
        date: "Jan 2025",
        url: "https://lms.quickhealacademy.com/certificates/verification/exam?id=LPU-0000-189986",
      },
    ],
  },
  {
    issuer: "Fortinet & Foundations",
    accent: "aqua",
    items: [
      {
        name: "Certified Network Security Engineer Foundation",
        date: "Nov 2020",
        url: "https://1yx6sr-my.sharepoint.com/personal/harikrishnan9602_1yx6sr_onmicrosoft_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fharikrishnan9602%5F1yx6sr%5Fonmicrosoft%5Fcom%2FDocuments%2FCertificates%2FSchool%20of%20Cyber%20Defense%2Fimg17%2Ejpg&parent=%2Fpersonal%2Fharikrishnan9602%5F1yx6sr%5Fonmicrosoft%5Fcom%2FDocuments%2FCertificates%2FSchool%20of%20Cyber%20Defense&ga=1",
      },
      {
        name: "Fortinet NSE-2",
        date: "Aug 2020",
        url: "https://1yx6sr-my.sharepoint.com/personal/harikrishnan9602_1yx6sr_onmicrosoft_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fharikrishnan9602%5F1yx6sr%5Fonmicrosoft%5Fcom%2FDocuments%2FCertificates%2FFortinet%2FNSE%5F2%5FCertification%2Epdf&parent=%2Fpersonal%2Fharikrishnan9602%5F1yx6sr%5Fonmicrosoft%5Fcom%2FDocuments%2FCertificates%2FFortinet&ga=1",
      },
      {
        name: "Fortinet NSE-1",
        date: "Aug 2020",
        url: "https://1yx6sr-my.sharepoint.com/personal/harikrishnan9602_1yx6sr_onmicrosoft_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fharikrishnan9602%5F1yx6sr%5Fonmicrosoft%5Fcom%2FDocuments%2FCertificates%2FFortinet%2FNSE%5F1%5FCertification%2Epdf&parent=%2Fpersonal%2Fharikrishnan9602%5F1yx6sr%5Fonmicrosoft%5Fcom%2FDocuments%2FCertificates%2FFortinet&ga=1",
      },
      {
        name: "Cybersecurity Fundamentals",
        date: "Jul 2024",
        url: "https://1yx6sr-my.sharepoint.com/personal/harikrishnan9602_1yx6sr_onmicrosoft_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fharikrishnan9602%5F1yx6sr%5Fonmicrosoft%5Fcom%2FDocuments%2FCertificates%2FPaloalto%2FCybersecurity%20Fundamentals%20%5F%20Beacon%2Epdf&parent=%2Fpersonal%2Fharikrishnan9602%5F1yx6sr%5Fonmicrosoft%5Fcom%2FDocuments%2FCertificates%2FPaloalto&ga=1",
      },
    ],
  },
];

export const achievements = [
  { rank: "Top 1%", title: "Global Ranking", venue: "TryHackMe", note: "Sustained hands-on dominance" },
  { rank: "125th", title: "Pentathon CTF", venue: "National CTF", note: "Multi-discipline challenge" },
  { rank: "4th", title: "Chakravyuh CTF", venue: "Competitive CTF", note: "Podium finish" },
  { rank: "16th", title: "TechnOcean CTF", venue: "Competitive CTF", note: "Top-tier placement" },
  { rank: "Qualified", title: "AIESEC Hackathon", venue: "Hackathon", note: "Selection round cleared" },
];

export type SkillBar = { name: string; level: number };
export type SkillCluster = { group: string; accent: string; skills: SkillBar[] };

export const skillClusters: SkillCluster[] = [
  {
    group: "Offensive Security",
    accent: "cyan",
    skills: [
      { name: "Penetration Testing", level: 90 },
      { name: "Vulnerability Management", level: 88 },
      { name: "Metasploit Framework", level: 82 },
      { name: "OSINT Techniques", level: 85 },
      { name: "OWASP Top 10", level: 86 },
    ],
  },
  {
    group: "Defense & Forensics",
    accent: "violet",
    skills: [
      { name: "Threat Detection", level: 84 },
      { name: "Digital Forensics", level: 87 },
      { name: "Threat Modeling", level: 80 },
      { name: "MITRE Framework", level: 83 },
      { name: "Risk Management", level: 80 },
    ],
  },
  {
    group: "Systems & Code",
    accent: "aqua",
    skills: [
      { name: "Linux Administration", level: 88 },
      { name: "Python", level: 82 },
      { name: "Bash Scripting", level: 86 },
      { name: "Wireshark", level: 85 },
      { name: "Cryptography", level: 76 },
    ],
  },
];

export const timeline = [
  {
    period: "2025",
    title: "Penetration Testing Specialization",
    org: "CompTIA Career Pathway",
    desc: "Stacked six advanced security certifications in a single year — PenTest+, CySA+, Security+, and the Network Security / Vulnerability Assessment professional tracks.",
    accent: "cyan",
  },
  {
    period: "2024 – 2025",
    title: "Forensics & Infrastructure Depth",
    org: "Quick Heal · Red Hat",
    desc: "Certified Digital Forensic Investigator alongside Red Hat RHCSA-track administration — pairing investigation skill with the systems knowledge to defend them.",
    accent: "violet",
  },
  {
    period: "2022 – Present",
    title: "B.Tech, Computer Science & Engineering",
    org: "Lovely Professional University",
    desc: "Building the formal CS foundation while competing in CTFs and climbing to the top 1% on TryHackMe.",
    accent: "magenta",
  },
  {
    period: "2020",
    title: "Security Foundations",
    org: "Fortinet NSE · CNSE",
    desc: "Earliest steps into the discipline — network security engineering foundations that set the trajectory.",
    accent: "aqua",
  },
];

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Expertise", href: "#expertise" },
  { label: "Work", href: "#projects" },
  { label: "Credentials", href: "#credentials" },
  { label: "Contact", href: "#contact" },
];
