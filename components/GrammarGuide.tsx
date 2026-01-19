
import React, { useState, useMemo } from 'react';
import { TIBETAN_STRINGS } from '../constants';

interface GrammarGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VerbEntry {
  future: string;
  present: string;
  past: string;
  imperative: string;
  definition: string;
  examples: string[];
}

const VERBS: VerbEntry[] = [
  { 
    future: "བཀླག", present: "ཀློག", past: "བཀླགས།", imperative: "ཀློགས།", 
    definition: "ཡི་གེའི་དོན་ལ་བལྟ་བའམ་སྒྲོག་པ།", 
    examples: [
      "ངས་དེབ་འདི་བཀླགས་པ་ཡིན།",
      "ཁོང་གིས་ཚགས་པར་ཀློག་བཞིན་འདུག",
      "སང་ཉིན་སྒྲུང་དེབ་ཅིག་བཀླག་གི་ཡིན།",
      "ཁྱེད་རང་གིས་ཡི་གེ་འདི་ཀློགས་དང་།",
      "སློབ་མ་རྣམས་ཀྱིས་སློབ་ཚན་བཀླགས་ཟིན།"
    ]
  },
  { 
    future: "བྱ།", present: "བྱེད།", past: "བྱས།", imperative: "བྱོས།", 
    definition: "ལས་ཀ་སོགས་རྩོམ་པའམ་སྒྲུབ་པ།", 
    examples: [
      "ངས་ལས་ཀ་འདི་བྱས་པ་ཡིན།",
      "ཁྱེད་རང་གིས་ཅི་ཞིག་བྱེད་ཀྱི་ཡོད།",
      "སང་ཉིན་རོགས་པ་བྱ་རྒྱུ་ཡིན།",
      "ལས་ཀ་ཧུར་ཐག་བྱོས།",
      "ཁོང་གིས་དགེ་བའི་ལས་མང་པོ་བྱས་སོང་།"
    ]
  },
  { 
    future: "བྲི།", present: "འབྲི།", past: "བྲིས།", imperative: "བྲིས།", 
    definition: "ཡི་གེ་སོགས་རིས་སུ་འགོད་པ།", 
    examples: [
      "ངས་ཡི་གེ་ཞིག་བྲིས་པ་ཡིན།",
      "ཁྱེད་རང་གིས་སྙན་ངག་འབྲི་ཤེས་སམ།",
      "ངས་རྩོམ་ཡིག་ཅིག་བྲི་དགོས།",
      "མིང་འདིར་བྲིས།",
      "ཁོང་གིས་དེབ་མང་པོ་བྲིས་པ་རེད།"
    ]
  },
  { 
    future: "བཏུང་།", present: "འཐུང་།", past: "བཏུངས།", imperative: "ཐུངས།", 
    definition: "གཤེར་ཁུ་མིད་པར་བྱེད་པ།", 
    examples: [
      "ཇ་འཐུང་དགོས།",
      "ངས་ཆུ་བཏུངས་པ་ཡིན།",
      "སང་ཉིན་འོ་མ་བཏུང་གི་ཡིན།",
      "སྨན་འདི་ཐུངས།",
      "ཁོང་གིས་ཇ་མང་པོ་འཐུང་གི་འདུག"
    ]
  },
  { 
    future: "བཟའ།", present: "ཟ།", past: "ཟོས།", imperative: "ཟོས།", 
    definition: "ཟས་མིད་པར་བྱེད་པ།", 
    examples: [
      "ཁ་ལག་ཟོས།",
      "ངས་མོག་མོག་ཟོས།",
      "ཁོང་གིས་ཚལ་ཟ་བཞིན་འདུག",
      "སང་ཉིན་ཤིང་ཏོག་བཟའ་རྒྱུ་ཡིན།",
      "བྱིས་པས་ལྷ་བཤོས་ཟོས་སོང་།"
    ]
  },
  { 
    future: "བལྟ།", present: "ལྟ།", past: "བལྟས།", imperative: "ལྟོས།", 
    definition: "མིག་གིས་མཐོང་བར་བྱེད་པ།", 
    examples: [
      "ངས་གློག་བརྙན་ལ་བལྟས་པ་ཡིན།",
      "ཁྱེད་རང་གིས་འདིར་ལྟོས།",
      "སང་ཉིན་ལྟད་མོ་ཞིག་ལ་བལྟ་རྒྱུ་ཡིན།",
      "ཁོང་གིས་རི་མོ་ལ་ལྟ་བཞིན་འདུག",
      "ངས་ཁྱེད་ལ་བལྟས་ནས་བསྡད་ཡོད།"
    ]
  },
  { 
    future: "གཏང་།", present: "གཏོང་།", past: "བཏང་།", imperative: "ཐོངས།", 
    definition: "གནས་གཞན་དུ་འགྲོ་བར་བྱེད་པའམ་སྤེལ་བ།", 
    examples: [
      "ངས་ཁ་པར་བཏང་བ་ཡིན།",
      "འཕྲིན་ཡིག་ཅིག་གཏོང་རོགས།",
      "སང་ཉིན་དངུལ་གཏང་རྒྱུ་ཡིན།",
      "ཁྱི་འདི་ཕྱིར་ཐོངས།",
      "ཁོང་གིས་གློག་བརྙན་གཏོང་གི་འདུག"
    ]
  },
  { 
    future: "བསླབ།", present: "སློབ།", past: "བསླབས།", imperative: "སློབས།", 
    definition: "ཤེས་བྱ་སྦྱོང་བའམ་སྟོན་པ།", 
    examples: [
      "བོད་ཡིག་ཡག་པོ་སློབས།",
      "ངས་དབྱིན་ཡིག་བསླབས་པ་ཡིན།",
      "སང་ཉིན་རི་མོ་བསླབ་རྒྱུ་ཡིན།",
      "ཁོང་གིས་སློབ་མ་ལ་སློབ་བཞིན་འདུག",
      "ང་ལ་རོགས་པ་བྱེད་སྟངས་ཤིག་སློབས་དང་།"
    ]
  },
  { 
    future: "སྤྲད།", present: "སྤྲོད།", past: "སྤྲད།", imperative: "སྤྲོད།", 
    definition: "གཞན་ལ་གནང་བའམ་འབུལ་བ།", 
    examples: [
      "ཁོང་ལ་དངུལ་སྤྲད།",
      "ངས་དེབ་འདི་ཁྱེད་ལ་སྤྲད་པ་ཡིན།",
      "སང་ཉིན་ལག་རྟགས་ཤིག་སྤྲད་ཀྱི་ཡིན།",
      "ང་ལ་ལྡེ་མིག་སྤྲོད།",
      "ཁོང་གིས་གནས་ཚུལ་དེ་ང་ལ་སྤྲད་སོང་།"
    ]
  },
  { 
    future: "བཞག", present: "འཇོག", past: "བཞག", imperative: "ཞོག", 
    definition: "གནས་གཅིག་ཏུ་འཇོག་པ།", 
    examples: [
      "དེབ་འདི་འདིར་བཞག",
      "ངས་ཁ་པར་ཅོག་ཙེའི་སྟེང་དུ་བཞག་པ་ཡིན།",
      "སང་ཉིན་ཅ་ལག་རྣམས་འདིར་བཞག་རྒྱུ་ཡིན།",
      "ལས་ཀ་འདི་དེ་མུར་ཞོག",
      "ཁོང་གིས་སེམས་ལ་བཞག་ནས་བསྡད་འདུག"
    ]
  }
];

// Pre-fill more verbs with at least 1 example to keep chart large but functional
const OTHER_VERBS: VerbEntry[] = [
  { future: "བཀོལ།", present: "འཁོལ།", past: "བཀོལ།", imperative: "ཁོལ།", definition: "ཚ་ཚད་རྒྱས་ནས་ལྦུ་བ་འཕྱུར་བ།", examples: ["ཆུ་འཁོལ་གྱི་འདུག", "ཇ་བཀོལ་ནས་འཐུང་།"] },
  { future: "བརྐོ།", present: "རྐོ།", past: "བརྐོས།", imperative: "རྐོས།", definition: "ས་སོགས་སྔོག་པའམ་འབྲུ་བ།", examples: ["ས་བརྐོས་ནས་ཤིང་བཙུགས་པ་ཡིན།"] },
  { future: "བསྐྱེལ།", present: "སྐྱེལ།", past: "བསྐྱེལ།", imperative: "སྐྱེལ།", definition: "གནས་གཅིག་ནས་ gshan དུ་འཁྱེར་བ།", examples: ["ཡི་གེ་བསྐྱེལ་དུ་འགྲོ།"] },
  { future: "བསྐྲུན།", present: "སྐྲུན།", past: "བསྐྲུན།", imperative: "སྐྲུན།", definition: "གསར་དུ་བཟོ་བའམ་འཛུགས་སྐྲུན་བྱེད་པ།", examples: ["ཁང་པ་གསར་པ་ཞིག་བསྐྲུན་པ་རེད།"] },
  { future: "བཀྲུ།", present: "འཁྲུད།", past: "བཀྲུས།", imperative: "ཁྲུས།", definition: "ཆུ་སོགས་ཀྱིས་དྲི་མ་དག་པར་བྱེད་པ།", examples: ["ལག་པ་ཡག་པོ་འཁྲུད་དགོས།"] },
  { future: "བསྒུག", present: "སྒུག", past: "བསྒུགས།", imperative: "སྒུགས།", definition: "སྒུག་སྡོད་བྱེད་པ།", examples: ["ང་ལ་ཏོག་ཙམ་བསྒུག་རོགས།"] },
  { future: "བསྒྲུབ།", present: "སྒྲུབ།", past: "བསྒྲུབས།", imperative: "སྒྲུབས།", definition: "ལས་ཀ་སོགས་མཐར་ཕྱིན་པར་བྱེད་པ།", examples: ["ལས་ཀ་འདི་དེ་རིང་སྒྲུབ་དགོས།"] },
  { future: "བཅད།", present: "གཅོད།", past: "བཅད།", imperative: "ཆོད།", definition: "དངོས་པོ་སོགས་ལྷུ་འཕྲལ་བ།", examples: ["ཤིང་བཅད་ནས་མེ་བཏང་།"] },
  { future: "བཅོས།", present: "བཅོས།", past: "བཅོས།", imperative: "བཅོས།", definition: "ལེགས་པར་བཟོ་བའམ་དག་པར་བྱེད་པ།", examples: ["ནོར་འཁྲུལ་དེ་བཅོས་དགོས།"] },
  { future: "བརྗེ།", present: "བརྗེ།", past: "བརྗེས།", imperative: "བརྗེས།", definition: "གཅིག་ཚབ་ཏུ་གཞན་ཞིག་ལེན་པ།", examples: ["གོས་གསར་པ་ཞིག་བརྗེས་པ་ཡིན།"] },
  { future: "བསྟན།", present: "སྟོན།", past: "བསྟན།", imperative: "སྟོན།", definition: "གཞན་ལ་གོ་བའམ་མཐོང་བར་བྱེད་པ།", examples: ["ལམ་ཁ་སྟོན་རོགས་གནང་།"] },
  { future: "བསྡད།", present: "སྡོད།", past: "བསྡད།", imperative: "སྡོད།", definition: "གནས་གཅིག་ཏུ་གནས་པ།", examples: ["འདིར་ཡུན་རིང་བསྡད་པ་ཡིན།"] },
  { future: "བསྡུ།", present: "སྡུད།", past: "བསྡུས།", imperative: "སྡུས།", definition: "ཕྱོགས་གཅིག་ཏུ་སྤུངས་པའམ་གསོག་པ།", examples: ["དེབ་རྣམས་ཕྱོགས་གཅིག་ཏུ་བསྡུས་པ་ཡིན།"] },
  { future: "བླང་།", present: "ལེན།", past: "བླངས།", imperative: "ལོངས།", definition: "རང་ལ་ཐོབ་པར་བྱེད་པ།", examples: ["དངུལ་ཁང་ནས་དངུལ་བླངས་པ་ཡིན།"] },
  { future: "བཤད།", present: "འཆད།", past: "བཤད།", imperative: "ཤོད།", definition: "ངག་ནས་སྨྲ་བའམ་གསལ་བཤད་བྱེད་པ།", examples: ["ཁོས་སྒྲུང་བཤད་སོང་།"] },
  { future: "བཟོ།", present: "བཟོ།", past: "བཟོས།", imperative: "བཟོས།", definition: "དངོས་པོ་གསར་དུ་བསྐྲུན་པ།", examples: ["ཅོག་ཙེ་འདི་བཟོས་པ་ཡིན།"] },
  { future: "བཞེངས།", present: "བཞེངས།", past: "བཞེངས།", imperative: "བཞེངས།", definition: "ཡར་ལངས་པའམ་གསར་དུ་བཞེངས་པ། (ཞེ་ས།)", examples: ["སྔ་པོ་ནས་བཞེངས་དགོས།"] },
  { future: "བསླང།", present: "སློང་།", past: "བསླངས།", imperative: "སློངས།", definition: "ཡར་སློང་བའམ་འཚོལ་བ།", examples: ["རེ་བ་བསླངས་པ་ཡིན།"] },
  { future: "མཉན།", present: "ཉན།", past: "མཉན།", imperative: "ཉོན།", definition: "རྣ་བས་སྒྲ་འཛིན་པ།", examples: ["གླུ་གཞས་ཉན་གྱི་ཡོད།"] },
  { future: "ཉོ།", present: "ཉོ།", past: "ཉོས།", imperative: "ཉོས།", definition: "རིན་སྤྲད་ནས་དངོས་པོ་ལེན་པ།", examples: ["ངས་ཚལ་ཉོས་པ་ཡིན།"] },
  { future: "གཟིམ།", present: "གཟིམ།", past: "གཟིམས།", imperative: "གཟིམས།", definition: "ཉལ་བའམ་གཉིད་ཁུག་པ། (ཞེ་ས།)", examples: ["དགོང་མོ་སྔ་པོ་གཟིམས་དགོས།"] },
  { future: "འགྲོ།", present: "འགྲོ།", past: "ཕྱིན།", imperative: "སོང་།", definition: "གནས་གཞན་དུ་བསྐྱོད་པ།", examples: ["ང་སློབ་གྲྭར་འགྲོ་གི་ཡིན།"] },
  { future: "འོང་།", present: "ཡོང་།", past: "འོངས།", imperative: "ཤོག", definition: "གནས་འདིར་སླེབས་པ།", examples: ["འདིར་ཡོང་རོགས་གནང་།"] },
  { future: "འཁྱེར།", present: "འཁྱེར།", past: "འཁྱེར།", imperative: "ཁྱེར།", definition: "ལག་ཏུ་བཟུང་ནས་འགྲོ་བ།", examples: ["ཆུ་འཁྱེར་ནས་ཤོག"] },
  { future: "འགྱུར།", present: "འགྱུར།", past: "གྱུར།", imperative: "གྱུར།", definition: "རྣམ་པ་གཞན་དུ་འཕོ་བ།", examples: ["གནམ་གཤིས་འགྱུར་སོང་།"] },
  { future: "འཕུར།", present: "འཕུར།", past: "འཕུར།", imperative: "འཕུར།", definition: "གནམ་ལ་འགྲོ་བ།", examples: ["བྱ་དེ་གནམ་ལ་འཕུར་སོང་།"] },
  { future: "འཛུགས།", present: "འཛུགས།", past: "བཙུགས།", imperative: "ཚུགས།", definition: "ས་ལ་འཛུགས་པའམ་གསར་དུ་རྩོམ་པ།", examples: ["ཤིང་སྡོང་མང་པོ་བཙུགས་པ་ཡིན།"] },
  { future: "འཚོལ།", present: "འཚོལ།", past: "བཙལ།", imperative: "ཚོལ།", definition: "བརླག་པ་སོགས་འཚོལ་བ།", examples: ["བོར་བརླག་སོང་བའི་ལྡེ་མིག་བཙལ་བ་ཡིན།"] },
  { future: "འཛུལ།", present: "འཛུལ།", past: "འཛུལ།", imperative: "འཛུལ།", definition: "ནང་དུ་འགྲོ་བ།", examples: ["ཁང་པའི་ནང་ལ་འཛུལ་སོང་།"] },
  { future: "འདེབས།", present: "འདེབས།", past: "བཏབ།", imperative: "ཐོབ།", definition: "ས་བོན་འདེབས་པའམ་སྨོན་ལམ་འདེབས་པ།", examples: ["ས་བོན་བཏབ་པ་ཡིན།"] },
  { future: "འབུལ།", present: "འབུལ།", past: "ཕུལ།", imperative: "ཕུལ།", definition: "གུས་ཞབས་ཀྱིས་སྤྲོད་པ།", examples: ["ཁོང་ལ་ལག་རྟགས་ཤིག་ཕུལ་བ་ཡིན།"] },
  { future: "འབྱོར།", present: "འབྱོར།", past: "འབྱོར།", imperative: "འབྱོར།", definition: "ལག་ཏུ་སླེབས་པ།", examples: ["ཡི་གེ་དེ་འབྱོར་སོང་།"] },
  { future: "སྦྱོང་།", present: "སྦྱོང་།", past: "སྦྱངས།", imperative: "སྦྱོངས།", definition: "ཤེས་བྱ་ལ་གོམས་པར་བྱེད་པ།", examples: ["བོད་ཡིག་ཡག་པོ་སྦྱོང་དགོས།"] },
  { future: "འཆར།", present: "འཆར།", past: "ཤར།", imperative: "ཤར།", definition: "གསལ་བར་དོད་པའམ་འཆར་བ།", examples: ["ཉི་མ་ཤར་སོང་།"] },
  { future: "ཤེས།", present: "ཤེས།", past: "ཤེས།", imperative: "ཤེས།", definition: "བློས་རྟོགས་པར་བྱེད་པ།", examples: ["ངས་གནས་ཚུལ་དེ་ཤེས་ཀྱི་ཡོད།"] },
  { future: "མཐོང་།", present: "མཐོང་།", past: "མཐོང་།", imperative: "མཐོང་།", definition: "མིག་ལམ་དུ་གསལ་བ།", examples: ["ངས་ཁྱེད་རང་མཐོང་བྱུང་།"] },
  { future: "བཀྱག", present: "འདེགས་", past: "བཏེགས", imperative: "ཐེགས", definition: "ཡར་འདེགས་པར་བྱེད་པ།", examples: ["ལྗིད་ཁོག་ཡོད་པ་དེ་བཏེགས་པ་ཡིན།"] },
  { future: "བསྒྲག", present: "སྒྲོག་", past: "བསྒྲགས", imperative: "སྒྲོགས", definition: "གསལ་བསྒྲགས་བྱེད་པ།", examples: ["གསལ་བསྒྲགས་ཤིག་བསྒྲགས་པ་རེད།"] },
  { future: "བརྔ", present: "རྔོ་", past: "བརྔོས", imperative: "རྔོས", definition: "མེས་བརྔོ་བར་བྱེད་པ།", examples: ["གྲོ་བརྔོས་ནས་རྩམ་པ་བཟོས་པ་ཡིན།"] },
  { future: "བསྙལ", present: "སྙོལ་", past: "བསྙལ", imperative: "སྙོལ", definition: "ཉལ་དུ་འཇུག་པ།", examples: ["བྱིས་པ་ཉལ་ཁྲིའི་སྟེང་དུ་བསྙལ་བ་ཡིན།"] },
  { future: "བརྟག", present: "རྟོག་", past: "བརྟགས", imperative: "རྟོགས", definition: "དཔྱད་པ་གཏོང་བ།", examples: ["གནས་ཚུལ་ལ་བརྟག་དཔྱད་བྱེད་དགོས།"] },
  { future: "བསྟིམ", present: "ཐིམ་", past: "བསྟིམས", imperative: "ཐིམས", definition: "ནང་དུ་སིམ་པར་བྱེད་པ།", examples: ["ཆུ་དེ་སའི་ནང་དུ་ཐིམ་སོང་།"] },
  { future: "བརྡུང", present: "རྡུང་", past: "བརྡུངས", imperative: "རྡུངས", definition: "རྡེག་པར་བྱེད་པ།", examples: ["རྔ་བརྡུངས་ནས་ཆོ་ག་བྱེད་བཞིན་ཡོད།"] },
  { future: "བརྣན", present: "རྣོན་", past: "བརྣན", imperative: "རྣོན", definition: "ནན་ཏན་དུ་བྱེད་པ།", examples: ["མིང་འདི་ལ་ནན་བརྣན་བྱེད་དགོས།"] },
  { future: "བསྣམ", present: "སྣོམ་", past: "བསྣམས", imperative: "སྣོམས", definition: "ལག་ཏུ་བཟུང་བའམ་འཁྱེར་བ། (ཞེ་ས།)", examples: ["ཕྱག་དེབ་འདི་བསྣམས་ནས་ཕེབས་རོགས།"] },
  { future: "བཙིར", present: "འཚིར་", past: "བཙིར", imperative: "ཚིར", definition: "བཙིར་ནས་ཁུ་བ་འདོན་པ།", examples: ["ཚལ་གྱི་ཁུ་བ་བཙིར་བ་ཡིན།"] },
  { future: "བཞུ", present: "འཇུ་", past: "བཞུས", imperative: "ཞུས", definition: "མེས་བཞུ་བའམ་འཇུ་བར་བྱེད་པ།", examples: ["མར་བཞུས་ནས་མར་མེ་བསྒྲོན་པ་ཡིན།"] },
  { future: "བསྲེ", present: "སྲེ་", past: "བསྲེས", imperative: "སྲེས", definition: "ཕན་ཚུན་བསྲེ་བར་བྱེད་པ།", examples: ["དངོས་པོ་གཉིས་མཉམ་དུ་བསྲེས་པ་ཡིན།"] },
  { future: "བསྲུང", present: "སྲུང་", past: "བསྲུངས", imperative: "སྲུངས", definition: "བདག་གཅེས་སམ་ཉེན་ཁ་ནས་སྲུང་བ།", examples: ["ཁྲིམས་སྲུང་རྒྱུ་དེ་གལ་ཆེན་པོ་ཡིན།"] },
  { future: "བསླུ", present: "སླུ་", past: "བསླུས", imperative: "སླུས", definition: "གཞན་ལ་མགོ་སྐོར་གཏོང་བ།", examples: ["མི་གཞན་ལ་བསླུ་བྲིད་བྱེད་མི་ཆོག"] }
];

const ALL_VERBS = [...VERBS, ...OTHER_VERBS];

// Sort verbs initially in Tibetan alphabetical order
const SORTED_VERBS = [...ALL_VERBS].sort((a, b) => a.present.localeCompare(b.present, 'bo'));

const GrammarGuide: React.FC<GrammarGuideProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVerbs = useMemo(() => {
    if (!searchTerm.trim()) return SORTED_VERBS;
    return SORTED_VERBS.filter(v => 
      v.future.includes(searchTerm) || 
      v.present.includes(searchTerm) || 
      v.past.includes(searchTerm) || 
      v.imperative.includes(searchTerm) ||
      v.definition.includes(searchTerm) ||
      v.examples.some(ex => ex.includes(searchTerm))
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/70 backdrop-blur-md animate-fade-in transition-colors duration-300">
      <div className="bg-white dark:bg-stone-900 w-full max-w-6xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/40 dark:border-stone-800 animate-slide-up transition-colors duration-300">
        <div className="p-7 border-b border-slate-100 dark:border-stone-800 flex items-center justify-between bg-slate-50/50 dark:bg-stone-800/50">
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-stone-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-100 dark:shadow-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v8a2 2 0 00-2 2z" />
                </svg>
              </div>
              {TIBETAN_STRINGS.tenseChart}
            </h3>
            <p className="text-xs text-slate-400 dark:text-stone-500 font-bold ml-14 uppercase tracking-widest">
              Alphabetically Sorted (Ka-Kha Order)
            </p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 dark:hover:bg-stone-800 rounded-full transition-all text-slate-400 hover:text-amber-600 dark:hover:text-amber-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-8 pt-6 pb-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="བྱེད་ཚིག་གམ་འགྲེལ་བཤད་འཚོལ་བ། (Search verb or definition...)"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-600 transition-all Tibetan-text text-base dark:text-stone-100"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar bg-white dark:bg-stone-900">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-6 gap-2 mb-4 sticky top-0 z-10 bg-white dark:bg-stone-900 pb-2">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-200 rounded-2xl font-bold text-center border border-indigo-100 dark:border-indigo-800 Tibetan-text">{TIBETAN_STRINGS.tenseFuture}</div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 rounded-2xl font-bold text-center border border-emerald-100 dark:border-emerald-800 Tibetan-text">{TIBETAN_STRINGS.tensePresent}</div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 rounded-2xl font-bold text-center border border-amber-100 dark:border-amber-800 Tibetan-text">{TIBETAN_STRINGS.tensePast}</div>
              <div className="p-4 bg-rose-50 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200 rounded-2xl font-bold text-center border border-rose-100 dark:border-rose-800 Tibetan-text">{TIBETAN_STRINGS.tenseImperative}</div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 rounded-2xl font-bold text-center border border-blue-100 dark:border-blue-800 Tibetan-text">འགྲེལ་བཤད།</div>
              <div className="p-4 bg-slate-50 dark:bg-stone-800/60 text-slate-600 dark:text-stone-400 rounded-2xl font-bold text-center border border-slate-100 dark:border-stone-700 Tibetan-text">དཔེར་བརྗོད།</div>
            </div>

            <div className="space-y-2 pb-10">
              {filteredVerbs.length > 0 ? (
                filteredVerbs.map((verb, idx) => (
                  <div key={idx} className="grid grid-cols-6 gap-2 group animate-fade-in border-b border-slate-50 dark:border-stone-800/30 pb-2 mb-2">
                    <div className="p-4 bg-slate-50/50 dark:bg-stone-800/40 group-hover:bg-white dark:group-hover:bg-stone-800 border border-transparent group-hover:border-indigo-100 dark:group-hover:border-indigo-900 rounded-2xl text-center text-xl text-slate-700 dark:text-stone-200 Tibetan-text transition-all">{verb.future}</div>
                    <div className="p-4 bg-slate-50/50 dark:bg-stone-800/40 group-hover:bg-white dark:group-hover:bg-stone-800 border border-transparent group-hover:border-emerald-100 dark:group-hover:border-emerald-900 rounded-2xl text-center text-xl text-slate-700 dark:text-stone-200 Tibetan-text transition-all font-bold">{verb.present}</div>
                    <div className="p-4 bg-slate-50/50 dark:bg-stone-800/40 group-hover:bg-white dark:group-hover:bg-stone-800 border border-transparent group-hover:border-amber-100 dark:group-hover:border-amber-900 rounded-2xl text-center text-xl text-slate-700 dark:text-stone-200 Tibetan-text transition-all">{verb.past}</div>
                    <div className="p-4 bg-slate-50/50 dark:bg-stone-800/40 group-hover:bg-white dark:group-hover:bg-stone-800 border border-transparent group-hover:border-rose-100 dark:group-hover:border-rose-900 rounded-2xl text-center text-xl text-slate-700 dark:text-stone-200 Tibetan-text transition-all">{verb.imperative}</div>
                    <div className="p-4 bg-blue-50/20 dark:bg-blue-900/10 group-hover:bg-white dark:group-hover:bg-stone-800 border border-transparent group-hover:border-blue-100 dark:group-hover:border-blue-900 rounded-2xl text-left text-sm text-slate-600 dark:text-stone-300 Tibetan-text transition-all flex items-center px-4">
                      {verb.definition}
                    </div>
                    <div className="p-4 bg-slate-50/30 dark:bg-stone-800/20 group-hover:bg-white dark:group-hover:bg-stone-800 border border-transparent group-hover:border-slate-200 dark:group-hover:border-stone-700 rounded-2xl text-left text-xs text-slate-500 dark:text-stone-400 Tibetan-text italic transition-all flex flex-col justify-center gap-1.5 px-4 overflow-hidden">
                      {verb.examples.map((ex, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0 mt-1.5"></span>
                          <span>{ex}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-slate-400 dark:text-stone-600 Tibetan-text bg-slate-50/50 dark:bg-stone-800/20 rounded-[3rem] border border-dashed border-slate-200 dark:border-stone-700">
                  བྱེད་ཚིག་རྙེད་མ་སོང་། (No verbs found matching "{searchTerm}")
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-slate-50 dark:bg-stone-950 border-t border-slate-100 dark:border-stone-800 text-center text-slate-400 dark:text-stone-600 text-[10px] font-black tracking-[0.3em] uppercase transition-colors duration-300">
           བོད་ཀྱི་བརྡ་སྤྲོད་ལས་བྱེད་ཚིག་གི་དུས་གསུམ་རེའུ་མིག་དང་དཔེར་བརྗོད།
        </div>
      </div>
    </div>
  );
};

export default GrammarGuide;
