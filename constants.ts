
import { DictionaryEntry } from './types';

export const SYSTEM_PROMPT = `
ROLE & IDENTITY:
You are ThonmiAI (ཐོན་མི་AI), a general-purpose AI assistant named in honor of Thonmi Sambhota, the creator of the Tibetan script. Your mission is to promote, preserve, and normalize the use of the Tibetan language as a living, contemporary language.
You serve native Tibetan speakers—students, scholars, monks, nuns, professionals, and lay people—who speak, read, and write Tibetan as their first or mother tongue.
You are not a translation tool and not a bilingual assistant.

CORE LANGUAGE RULE (NON-NEGOTIABLE):
- You must always respond in Tibetan language only, using Unicode Tibetan script (Uchen).
- This rule applies regardless of input language (Tibetan, EWTS/Wylie, English, or mixed input).
- You must never output English, Wylie, or mixed-language text unless the user explicitly asks for it in Tibetan.

TONE & REGISTER:
- You must adapt your tone based on the user's preference (Neutral, Formal, Informal, Humorous).
- Formal: Use high honorifics (Zhe-sa) and structured, polite language.
- Informal: Use natural, conversational Tibetan (Phal-skad) that is easily understood.
- Humorous: Incorporate wit or a lighthearted style while maintaining respect.
- Neutral: Clear, Modern, Widely intelligible.

ERROR HANDLING & HONESTY:
- If information is unclear or unknown, say so explicitly in Tibetan.
- Never fabricate facts. All error messages must be in Tibetan.

CULTURAL & ETHICAL CONSTRAINTS:
- Be culturally respectful. Avoid political advocacy.
- Do not trivialize Tibetan culture, religion, or identity.

SUMMARY:
ThonmiAI is a Tibetan-first digital environment, not a translation layer. Tibetan is the medium, not the subject.
`;

export const TIBETAN_STRINGS = {
  // General UI
  appTitle: "ཐོན་མི་AI",
  versionInfo: "ཐོན་མི་AI v1.1.0",
  newChat: "འདྲི་བ་གསར་པ།",
  inputPlaceholder: "འདིར་ཡི་གེ་བྲིས།...",
  wyliePlaceholder: "Wylie Input (e.g. bkra shis bde legs/)...",
  wylieLabel: "Wylie:",
  loading: "བབསམ་བློ་གཏོང་བཞིན་པ།...",
  errorOccurred: "ནོར་འཁྲུལ་ཞིག་བྱུང་སོང་། སླར་ཡང་གནང་རོགས།",
  errorAiResponse: "བོད་སྐད་ཀྱི་ལན་ཞིག་སྤྲོད་ཐུབ་མ་སོང་།",
  resetApp: "རྨང་གཞི་ནས་སྐྱར་སྒྲིག",
  resetConfirm: "ཁྱེད་ཀྱིས་གནས་ཚུལ་ཡོད་ཚད་གསུབ་འདོད་པ་ངེས་གཏན་ཡིན་ནམ། བྱ་འདི་སླར་གསོ་བྱེད་མི་ཐུབ།",
  aiCaveat: "མིས་བཟོས་རིག་ནུས་ཀྱིས་ནོར་འཁྲུལ་བཟོ་སྲིད་པས་དེ་དོན་དགོངས་འཇགས་ཞུ།",
  
  // Controls
  edit: "རྩོམ་སྒྲིག",
  save: "ཉར་ཚགས།",
  cancel: "ཕྱིར་འཐེན།",

  // Tone
  toneLabel: "སྐད་གདངས།",
  tones: {
    neutral: "རྒྱུན་ལྡན།",
    formal: "གུས་ཞབས་ལྡན་པ།",
    informal: "ཕལ་སྐད།",
    humorous: "བཞད་གད་དང་བཅས་པ།"
  },

  // Auth (New)
  login: "ནང་ལ་འཛུལ།",
  signup: "ཐོ་འགོད།",
  account: "ཐོ་གཞུང་།",

  // API Key Selection
  keySelectionTitle: "རྩིས་ཐོའི་ལྡེ་མིག་འདེམས་པ།",
  keySelectionDesc: "པར་རིས་བཟོ་བ་སོགས་ཀྱི་ནུས་པ་གཏོང་ཆེད་རང་ཉིད་ཀྱི་ API Key འདེམས་དགོས།",
  selectKey: "ལྡེ་མིག་འདེམས་པ།",
  keySelected: "ལྡེ་མིག་བདམས་ཟིན།",
  billingDoc: "དངུལ་རྩིས་ལམ་སྟོན།",
  billingDocUrl: "https://ai.google.dev/gemini-api/docs/billing",

  // Wylie Guide
  wylieGuide: "ཝ་ལི་སྦྱོང་ཚུལ།",
  wylieConsonants: "གསལ་བྱེད།",
  wylieVowels: "དབྱངས།",
  wyliePunctuation: "ཚེག་ཤད།",
  wylieExamples: "དཔེ་མཚོན།",
  wylieIntroTitle: "ཝ་ལི་ (Wylie) ཞེས་པ་ཅི་ཡིན།",
  wylieIntroContent: "ཝ་ལི་ནི་བོད་ཡིག་གི་སྒྲ་རྣམས་དབྱིན་ཡིག་གམ་རོམ་མའི་ཡི་གེའི་ལམ་ནས་འབྲི་བའི་ཐབས་ལམ་ཞིག་ཡིན། འདི་ནི་ཨ་རིའི་བོད་རིག་པ་མཁས་ཅན་ཊར་རེལ་ཝ་ལི་ (Turrell V. Wylie) ལགས་ཀྱིས་ཕྱི་ལོ་ ༡༩༥༩ ལོར་གསར་གཏོད་གནང་བ་ཞིག་ཡིན།",
  wyliePurpose: "འདིའི་དམིགས་ཡུལ་ནི་བོད་ཡིག་གི་དག་ཆ་ཇི་བཞིན་དབྱིན་ཡིག་གི་ལམ་ནས་མཚོན་པར་བྱེད་རྒྱུ་དང་། གློག་ཀླད་ནང་དུ་བོད་ཡིག་འབྲི་བར་སྟབས་བདེ་བཟོ་རྒྱུ་དེ་ཡིན།",

  // Tense Chart
  tenseChart: "དུས་གསུམ་རིའུ་མིག",
  tenseFuture: "མ་འོངས་པ།",
  tensePresent: "ད་ལྟ་བ།",
  tensePast: "འདས་པ།",
  tenseImperative: "སྐུལ་ཚིག",
  tenseVerb: "བྱེད་ཚིག",

  // Sidebar
  sidebarTitle: "བརྒྱུད་རིམ།",
  emptyHistory: "ལོ་རྒྱུས་མི་འདུག",
  deleteChat: "བཅར་འདྲི་གསུབ་པ།",
  whyThonmi: "ཐོན་མི་AI དགོས་དོན་ཅི།",
  howItWorks: "འདི་ཇི་ལྟར་བཀོལ།",
  
  // Welcome View
  welcomeTitle: "ཅི་ཞིག་ཤེས་འདོད་འདུག",
  welcomeSubtitle: "ང་ནི་བོད་ཡིག་བཀོལ་སྤྱོད་བྱེད་རྒྱུར་རོགས་པ་བྱེད་མཁན་གྱི་རིག་ནུས་ཤིག་ཡིན།",
  examplePrompts: [
    "བོད་ཀྱི་ཁ་ཟས་མོག་མོག་བཟོ་སྟངས་ཀྱི་རིམ་པ་རྣམས་གསལ་བཤད་གནང་རོགས།",
    "དབྱིག་རྡུལ་དངོས་ཁམས་རིག་པའི་ (Quantum Physics) གཞི་རྩའི་བསམ་བློ་དེ་གོ་སླ་བོའི་ངང་ནས་ཤོད།",
    "ཕོ་བྲང་པོ་ཏ་ལའི་བཟོ་བཀོད་དང་ལོ་རྒྱུས་ཀྱི་གལ་གནད་སྐོར་ཤོད་རོགས།",
    "གངས་གཟིག་གི་སྐོར་ལ་བྱིས་པའི་སྒྲུང་ཐུང་ཞིག་བྲིས།"
  ],
  examplePromptsNote: "གོང་གསལ་ནི་དཔེ་མཚོན་ཙམ་ལཨ། ཅིཡང་འདྲི་ཆོག",
  
  // Keyboards
  kbEwts: "ཝཡིལི། (Wylie)",
  kbTibetan: "བོད་ཡིག",
  
  // Dictionary
  dictionary: "བརྡ་དག་ཀུན་གསལ།",
  terminologyDict: "དབྱིན་བོད་ཤན་སྦྱར་ཚིག་མཛོད།",
  spellCheckPass: "དག་ཆ་འགྲིག་འདུག",
  spellCheckFail: "དག་ཆ་ལ་ནོར་འཁྲུལ་འདུག",
  searchPlaceholder: "ཚིག་འཚོལ་བ།...",
  deepLookup: "གཏིང་ཟབ་པའི་འགྲེལ་བཤད།",
  noDefinition: "འགྲེལ་བཤད་རྙེད་མ་སོང་། AI ལ་འདྲི་རོགས།",
  dictInitialHint: "འདིར་ཚིག་གསར་པ་འཚོལ་རོགས།",
  saveToDict: "ཉར་བ།",
  addTerm: "ཚིག་གསར་པ་སྣོན་པ།",
  termSaved: "ཉར་ཟིན།",
  englishTerm: "དབྱིན་ཡིག་གི་མིང་། (English Term)",
  tibetanTerm: "བོད་ཡིག་གི་མིང་། (Tibetan Term)",

  // Image Generation
  imageGen: "པར་རིས་བཟོ་བ།",
  imageGenPlaceholder: "པར་རིས་ཅི་ཞིག་བཟོ་འདོད་འདུག...",

  // About / Manifesto
  aboutProject: "ལས་འཆར་འདིའི་སྐོར།",
  manifestoTitle: "ཐོན་མི་AI ཡི་གསལ་བསྒྲགས།",
  manifestoContent: `ཐོན་མི་AI ནི་བོད་ཀྱི་སྐད་ཡིག་དེ་ཉིད་དེང་རབས་ཀྱི་འཚོ་བའི་ནང་དུ་རྒྱུན་ལྡན་དང་གསོན་པོའི་ངང་བཀོལ་སྤྱོད་བྱེད་པའི་ཁོར་ཡུག་ཅིག་གཏོད་ཆེད་ཡིན། ང་ཚོའི་དམིགས་ཡུལ་ནི་བོད་སྐད་དེ་བརྡ་སྤྲོད་བྱེད་བྱེད་ཙམ་མ་ཡིན་པར། བསམ་བློ་གཏོང་བྱེད་ཀྱི་ལག་ཆ་གཙོ་བོ་ཞིག་ཏུ་འགྱུར་རྒྱུ་དེ་ཡིན།

༡༽ བོད་སྐད་ནི་དེང་རབས་ཀྱི་སྐད་ཡིག་ཅིག་ཡིན། དེས་ཚན་རིག་དང་། ལག་རྩལ། ལྟ་གྲུབ་སོགས་ཅི་ཡང་ མཚོན་ཐུབ།
༢༽ ང་ཚོའི་རིག་ནུས་རོགས་པ་ཐོན་མི་AI འདིས་བོད་ཀྱི་སྐད་ཡིག་སྲུང་སྐྱོབ་ཙམ་མ་ཡིན་པར། དེ་ཉིད་དུས་རབས་དང་ མཐུན་པའི་གོང་འཕེལ་གཏོང་རྒྱུར་དམིགས་ཡོད།
༣༽ འདི་ནི་ལོ་ཙཱའི་ལག་ཆ་ཙམ་མ་ཡིན་པར། བོད་སྐད་རང་རྐྱ་འཕེར་བའི་ལམ་ནས་འཛམ་གླིང་གི་ཤེས་བྱ་ཀུན་ལ་ལོངས་སྤྱོད་བྱེད་པའི་སྒོ་ མོ་ཞིག་ཡིན།

བོད་ཀྱི་སྐད་ཡིག་ནི་ང་ཚོའི་བླ་སྲོག་ཡིན་ལ། དེང་རབས་ཀྱི་ཤེས་བྱ་ནི་ང་ཚོའི་གཤོག་པ་ཡིན།`,
  aboutMainGoal: "དམིགས་ཡུལ་གཙོ་བོ།",
  aboutMainGoalDesc: "བོད་ཀྱི་སྐད་ཡིག་འདི་ཉིད་དུས་རབས་ཉེར་གཅིག་པའི་རིག་ནུས་ལག་རྩལ་དང་ མཐུན་པར་བཟོ་རྒྱུ།",
  aboutUsers: "བཀོལ་སྤྱོད་བྱེད་ མཁན།",
  aboutUsersDesc: "བོད་ཡིག་ལ་དགའ་བའི་སློབ་ gnyer བ་དང་། ཤེས་ཡོན་ཅན། མི་ མང་ཡོངས་ལ་དམིགས་ཡོད།",

  // Why Thonmi Content
  whyThonmiTitle: "ཐོན་མི་AI ཅི་ཕྱིར་གལ་ཆེ་བ་ཡིན་ནམ།",
  whyThonmiContent: `དེང་རབས་ཀྱི་དུས་འདིར་སྐད་ཡིག་ནི་འཕྲུལ་ཆས་དང་ལག་རྩལ་གྱི་ལམ་ནས་འཚོ་གནས་བྱེད་དགོས། ཐོན་མི་AI ནི་དམིགས་ཡུལ་ཁག་གསུམ་གྱི་ཆེད་དུ་བསྐྲུན་པ་ཡིན།

༡༽ བོད་ཡིག་འདི་ཉིད་དེང་རབས་ཀྱི་ཤེས་བྱ་ཀུན་མཚོན་བྱེད་ཀྱི་སྐད་ཡིག་ཅིག་ཏུ་འགྱུར་བར་བྱེད་རྒྱུ།
༢༽ བོད་སྐད་native speaker རྣམས་ལ་རང་སྐད་ཀྱི་ལམ་ནས་ཤེས་བྱ་གསར་པ་ལེན་པའི་སྟབས་བདེའི་ཁོར་ཡུག་ཅིག་གཏོད་རྒྱུ།
༣༽ བོད་ཡིག་འདི་ཉིད་འགྲེལ་བཤད་རྒྱག་བྱེད་ཙམ་མ་ཡིན་པར། གསར་གཏོད་དང་བསམ་བློ་གཏོང་བྱེད་ཀྱི་རྨང་གཞིར་འགྱུར་བར་བྱེད་རྒྱུ།`,

  // How it works Content
  howItWorksTitle: "འདི་ཇི་ལྟར་བཀོལ་དགོས་སམ།",
  howItWorksSteps: [
    { title: "འདྲི་བ་གཏོང་བ།", desc: "བོད་ཡིག་དང་། ཝ་ལི། དབྱིན་ཡིག་གང་རུང་གི་ལམ་ནས་འདྲི་བ་གཏོང་ཆོག" },
    { title: "ལན་འདེབས་པ།", desc: "ཁྱེད་ཀྱིས་སྐད་ཡིག་གང་བཀོལ་ཡང་། ཐོན་མི་AI ཡིས་བོད་ཡིག་གཙང་མའི་ལམ་ནས་ལན་འདེབས་བྱེད་ཀྱི་རེད།" },
    { title: "ལག་ཆ་གཞན་པ།", desc: "ཚིག་མཛོད་དང་། ཝ་ལི་སྦྱོང་ཚུལ། བརྡ་སྤྲོད་སོགས་ཀྱི་ལག་ཆ་རྣམས་ sidebar ནང་དུ་ཡོད།" }
  ]
};

export const INITIAL_DICTIONARY: DictionaryEntry[] = [];

export const INITIAL_TERMINOLOGY: DictionaryEntry[] = [];

export const TIBETAN_STARTERS = [
  "ག་རེ་", "ག་འདྲ་", "ག་དུས་", "སུ་", "གང་དུ་", "ཅི་ཞིག་", "ཅི་ཕྱིར་", "ཇི་ལྟར་", "ཡིན་ནམ།", "རེད་དམ།"
];

export const TIBETAN_PARTICLES = [
  "གི་", "ཀྱི་", "གྱི་", "འི་", "ཡི་", "གིས་", "ཀྱིས་", "གྱིས་", "འིས་", "ཡིས་", "ལ་", "ཏུ་", "དུ་", "རུ་", "སུ་", "ནས་", "ལས་"
];

export const COMMON_TIBETAN_WORDS = [
  "བཀྲ་ཤིས་", "བདེ་ལེགས་", "ཐུགས་རྗེ་ཆེ་", "དགོངས་དག་", "ག་རེ་", "ཡིན་ན་", "འདི་", "དེ་", "ང་", "ཁྱེད་རང་",
  "བོད་", "ཡིག་", "སྐད་", "རིག་", "གནས་", "སློབ་", "སྦྱོང་", "ཆོས་", "སྲིད་", "དཔལ་", "འབྱོར་", "འཛམ་",
  "གླིང་", "རྒྱལ་", "ཁབ་", "མི་", "དམངས་", "རང་", "དབང་", "ཞི་", "བདེ་", "ཤེས་", "རབ་", "བྱམས་",
  "བརྩེ་", "སྙིང་", "རྗེ་", "བྱང་", "ཆུབ་", "སེམས་", "དཔའ་", "རིན་", "པོ་", "ཆེ་", "ལོ་", "རྒྱུས་",
  "དེང་", "རབས་", "ལག་", "རྩལ་", "ཚན་", "རིག་", "དཔྱད་", "གཞི་", "ལམ་", "སྟོན་", "རོགས་", "པ་",
  "བསམ་", "བློ་", "དམིགས་", "ཡུལ་", "གལ་", "ཆེན་", "གསར་", "པ་", "སྙན་", "ངག་", "ལྷ་", "ས་",
  "གངས་", "རི་", "མཚོ་", "སྔོན་", "དབུས་", "གཙང་", "ཁམས་", "ཨ་", "མདོ་", "བོད་", "རང་", "སྐྱོང་", "ལྗོངས་",
  "འགྲེལ་བཤད་", "གསལ་བཤད་", "ལོ་རྒྱུས་", "དོན་དག་", "དཔེར་ན་", "དམིགས་བསལ་", "མདོར་བསྡུས་", "རྒྱས་པ་",
  "བདེན་པ་", "རྫུན་མ་", "གཡོ་སྒྱུ་", "དྲང་པོ་", "བཀའ་དྲིན་", "སེམས་བཟང་", "རོགས་རམ་", "མཐུན་ལམ་"
];
