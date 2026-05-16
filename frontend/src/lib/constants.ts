export const ENTRY_TYPES = [
  { id: "pub", letter: "A", label: "Publication", pbms: "Form G" },
  { id: "res", letter: "B", label: "Research Grant", pbms: "Form F" },
  { id: "pres", letter: "C", label: "Paper Presentation", pbms: "Form H" },
  { id: "patent", letter: "D", label: "Patent", pbms: "Form I" },
  { id: "creative", letter: "E", label: "Creative Work Output", pbms: "Form J" },
  { id: "award", letter: "F", label: "Award / Grant", pbms: "Record" },
  { id: "train", letter: "G", label: "Training Conducted", pbms: "Form K" },
  { id: "ext", letter: "H", label: "Extension Program", pbms: "Form L" },
  { id: "partner", letter: "I", label: "Partnership / MOA", pbms: "Form M" },
  { id: "auth", letter: "J", label: "Authorship", pbms: "Record" },
  { id: "other", letter: "K", label: "Other Accomplishment", pbms: "Various" },
];

export const ROLES = ["faculty", "department_chair", "admin"];

export const COLLEGE_DEPARTMENTS = {
  "College of Humanities & Social Sciences": [
    "Department of Architecture",
    "Department of Humanities",
    "Department of Social Sciences",
    "Department of Human Kinetics",
    "CHSS Office of the Dean & College Secretary"
  ],
  "College of Science and Mathematics": [
    "Department of Biological Science & Environmental Studies",
    "Department of Food Science & Chemistry",
    "Department of Mathematics, Physics & Computer Science",
    "CSM Office of the Dean & College Secretary"
  ],
  "School of Management (SOM)": [
    "School of Management (SOM)"
  ]
} as const;

export const COLLEGES = Object.keys(COLLEGE_DEPARTMENTS) as (keyof typeof COLLEGE_DEPARTMENTS)[];

export const DEPARTMENTS = Object.values(COLLEGE_DEPARTMENTS).flat();

export const STATUSES = ["Draft", "Waiting for Approval", "Partially Approved", "Fully Approved"];
