
import React, { useState } from 'react';
import { ResearchPaper } from '../types';
import { Button } from './Button';

interface PaperCardProps {
  paper: ResearchPaper;
}

export const PaperCard: React.FC<PaperCardProps> = ({ paper }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-gray-300 py-10 first:pt-0 group transition-colors hover:bg-[#fcfcfc] px-6 -mx-6">
      
      {/* Title */}
      <h3 className="text-3xl font-serif font-bold text-academic-text leading-tight mb-6">
        {paper.title}
      </h3>

      {/* Meta Information Block */}
      <div className="mb-6 border-l-2 border-academic-border pl-4 space-y-2">
          {/* Authors */}
          <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500">Authors</span>
            <span className="font-serif text-lg text-gray-900 leading-tight">{paper.authors}</span>
          </div>

          {/* Journal/Platform */}
          <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500">Journal</span>
            <span className="font-serif text-lg text-gray-800 italic leading-tight">{paper.journal}</span>
          </div>

          {/* Year */}
          <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500">Year</span>
            <span className="font-mono text-base text-gray-700">{paper.year}</span>
          </div>
        
          {/* Cited */}
          {paper.citationCount && (
            <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500">Cited</span>
                <span className="font-mono text-base text-academic-accent">{paper.citationCount}</span>
            </div>
          )}

          {/* Paper ID / DOI */}
          {paper.paperId && (
            <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500">ID / DOI</span>
                <span className="font-mono text-base text-gray-600">{paper.paperId}</span>
            </div>
          )}
      </div>

      {/* Summary */}
      <div className="font-serif text-gray-800 leading-relaxed mb-8 text-lg text-justify">
        {paper.summary}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
         <Button 
            variant="outline" 
            onClick={() => setExpanded(!expanded)}
            className="text-sm py-2 px-6"
         >
           {expanded ? 'Collapse Analysis' : 'View Analysis & Policy'}
         </Button>

         {paper.url && (
           <a href={paper.url} target="_blank" rel="noopener noreferrer">
             <Button variant="primary" className="text-sm py-2 px-6 shadow-sm">
               Read Original &rarr;
             </Button>
           </a>
         )}
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="mt-8 pt-6 border-t border-dashed border-gray-300 animate-fadeIn">
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div className="bg-gray-50 p-5 border border-gray-100 rounded-sm">
                <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-200 pb-2">Key Findings</h4>
                <ul className="list-disc list-outside ml-4 space-y-3">
                {paper.keyFindings.map((finding, idx) => (
                    <li key={idx} className="text-sm font-serif text-gray-900 leading-relaxed">{finding}</li>
                ))}
                </ul>
            </div>

            <div className="bg-[#fdfbf7] p-5 border border-academic-border rounded-sm">
                <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-200 pb-2">Policy Implementations</h4>
                <ul className="space-y-3">
                {paper.policyImplementations.map((policy, idx) => (
                    <li key={idx} className="text-sm font-serif text-gray-900 flex items-start">
                        <span className="text-academic-accent mr-2 mt-1.5 text-xs">◼</span> 
                        <span>{policy}</span>
                    </li>
                ))}
                </ul>
            </div>
          </div>

           {paper.similarTopics && paper.similarTopics.length > 0 && (
            <div className="flex flex-col md:flex-row md:items-baseline gap-4">
              <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500 flex-shrink-0">Related Topics:</h4>
              <div className="flex flex-wrap gap-2">
                {paper.similarTopics.map((topic, idx) => (
                  <span key={idx} className="text-xs text-gray-600 underline decoration-gray-300 hover:decoration-gray-600 underline-offset-4 cursor-pointer transition-all font-sans">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
