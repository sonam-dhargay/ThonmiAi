
import React, { useState, useEffect } from 'react';
import { TIBETAN_STRINGS } from '../constants';

const AboutPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(TIBETAN_STRINGS.manifestoTitle);
  const [content, setContent] = useState(TIBETAN_STRINGS.manifestoContent);

  useEffect(() => {
    const savedTitle = localStorage.getItem('bod_skyad_about_title');
    const savedContent = localStorage.getItem('bod_skyad_about_content');
    if (savedTitle) setTitle(savedTitle);
    if (savedContent) setContent(savedContent);
  }, []);

  const handleSave = () => {
    localStorage.setItem('bod_skyad_about_title', title);
    localStorage.setItem('bod_skyad_about_content', content);
    setIsEditing(false);
  };

  const handleCancel = () => {
    const savedTitle = localStorage.getItem('bod_skyad_about_title') || TIBETAN_STRINGS.manifestoTitle;
    const savedContent = localStorage.getItem('bod_skyad_about_content') || TIBETAN_STRINGS.manifestoContent;
    setTitle(savedTitle);
    setContent(savedContent);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-14 px-7">
      <div className="bg-white rounded-[2.5rem] shadow-xl p-10 md:p-14 border border-red-50 relative">
        <div className="absolute top-8 right-8 flex gap-2">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="p-2.5 text-slate-400 hover:text-red-900 hover:bg-red-50 rounded-full transition-all"
              title="Edit Page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          ) : (
            <>
              <button 
                onClick={handleSave}
                className="p-2.5 text-green-600 hover:bg-green-50 rounded-full transition-all"
                title="Save"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button 
                onClick={handleCancel}
                className="p-2.5 text-red-600 hover:bg-red-50 rounded-full transition-all"
                title="Cancel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          )}
        </div>

        <div className="w-28 h-28 bg-red-900 rounded-[2.2rem] flex items-center justify-center text-white mb-12 shadow-xl shadow-red-100 overflow-hidden">
          <span className="text-7xl leading-none -mt-8">དྷྰི༔</span>
        </div>

        {isEditing ? (
          <div className="space-y-7">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-4xl font-bold text-slate-900 border-b-2 border-red-200 focus:border-red-900 outline-none pb-3 bg-transparent"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-96 text-2xl text-slate-700 leading-relaxed font-medium p-5 border border-red-50 rounded-2xl focus:ring-2 focus:ring-red-900 outline-none transition-all resize-none Tibetan-text"
            />
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-slate-900 mb-10 leading-tight">
              {title}
            </h1>
            <div className="prose prose-xl prose-slate max-w-none">
              <p className="text-2xl text-slate-700 leading-relaxed whitespace-pre-wrap font-medium Tibetan-text">
                {content}
              </p>
            </div>
          </>
        )}
        
        <div className="mt-14 pt-10 border-t border-red-50 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">{TIBETAN_STRINGS.aboutMainGoal}</h3>
            <p className="text-lg text-slate-600 leading-relaxed Tibetan-text">{TIBETAN_STRINGS.aboutMainGoalDesc}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">{TIBETAN_STRINGS.aboutUsers}</h3>
            <p className="text-lg text-slate-600 leading-relaxed Tibetan-text">{TIBETAN_STRINGS.aboutUsersDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
