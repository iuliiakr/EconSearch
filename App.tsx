
import React, { useState } from 'react';
import { LoadingStage, ResearchPaper } from './types';
import { searchEconomicsPapers } from './services/geminiService';
import { PaperCard } from './components/PaperCard';
import { Button } from './components/Button';
import { Spinner } from './components/Spinner';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [authors, setAuthors] = useState('');
  const [journal, setJournal] = useState('');
  const [yearStart, setYearStart] = useState('');
  const [yearEnd, setYearEnd] = useState('');
  const [isRefinement, setIsRefinement] = useState(false);
  
  const [results, setResults] = useState<ResearchPaper[]>([]);
  const [clarifications, setClarifications] = useState<string[]>([]);
  const [totalEstimate, setTotalEstimate] = useState<string | undefined>(undefined);
  const [loadingState, setLoadingState] = useState<LoadingStage>(LoadingStage.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [searchedQuery, setSearchedQuery] = useState<string>('');

  const handleSearch = async (overrideQuery?: string) => {
    const activeQuery = overrideQuery || query;
    if (!activeQuery.trim()) return;
    
    setLoadingState(LoadingStage.SEARCHING);
    setError(null);
    setResults([]); // Clear previous results for clean state
    setClarifications([]);
    setTotalEstimate(undefined);

    // Construct the effective query based on refinement state
    let effectiveQuery = activeQuery;
    if (isRefinement && searchedQuery && !overrideQuery) {
       // Only apply refinement logic if using the main input (not a suggestion button)
       effectiveQuery = `${searchedQuery}. Refinement: ${activeQuery}`;
    }

    setSearchedQuery(effectiveQuery);

    try {
      const response = await searchEconomicsPapers(effectiveQuery, {
        authors, 
        journal,
        yearStart,
        yearEnd
      });
      
      setResults(response.papers);
      setClarifications(response.clarifications);
      setTotalEstimate(response.totalResultsEstimate);
      setLoadingState(LoadingStage.COMPLETE);
    } catch (err) {
      console.error(err);
      setError("An error occurred while retrieving research data. Please try refining your parameters.");
      setLoadingState(LoadingStage.ERROR);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-academic-bg text-academic-text font-sans selection:bg-gray-300">
      {/* Header / Navigation */}
      <header className="border-b-4 border-academic-text py-6 px-4 md:px-12 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-academic-text">
              ECON<span className="font-light">SEARCH</span>
            </h1>
            <p className="text-xs uppercase tracking-widest mt-1 text-gray-500">
              Advanced Research & Policy Analysis Interface
            </p>
          </div>
          
          <div className="text-right hidden md:block">
             <div className="text-xs font-bold text-gray-400 uppercase">System Status</div>
             <div className="flex items-center gap-2 justify-end">
               <span className="w-2 h-2 rounded-full bg-green-500"></span>
               <span className="text-sm font-medium">Online • Gemini 2.5 Flash</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-12 py-12">
        
        {/* Search Section */}
        <div className="mb-16 p-6 md:p-8 bg-white border border-academic-border shadow-sm rounded-sm">
          <div className="flex flex-col gap-6">
            
            {/* Main Query */}
            <div className="flex-grow">
              <label htmlFor="search" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Research Topic</label>
              <input
                type="text"
                id="search"
                name="search_topic_query"
                autoComplete="off"
                className="w-full bg-white border-2 border-gray-300 p-4 text-xl font-serif focus:border-academic-text focus:outline-none transition-colors placeholder-gray-300"
                placeholder="Enter keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              
              <div className="mt-3 flex items-center">
                 <input 
                    type="checkbox" 
                    id="refineCheck" 
                    checked={isRefinement}
                    disabled={!searchedQuery}
                    onChange={(e) => setIsRefinement(e.target.checked)}
                    className="w-4 h-4 border-2 border-gray-300 text-academic-text focus:ring-0 cursor-pointer accent-academic-text disabled:opacity-50"
                 />
                 <label htmlFor="refineCheck" className={`ml-2 text-sm font-sans ${!searchedQuery ? 'text-gray-300' : 'text-gray-700'} cursor-pointer select-none`}>
                    Refine previous search <span className="text-xs text-gray-400">(Treat new input as continuation)</span>
                 </label>
              </div>
            </div>

            {/* Filters Row */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                 <label htmlFor="authors" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Author(s) <span className="font-normal normal-case text-gray-400">(Optional)</span></label>
                 <input 
                    type="text"
                    id="authors"
                    autoComplete="off"
                    className="w-full bg-white border border-gray-300 p-3 font-serif focus:border-academic-text focus:outline-none transition-colors placeholder-gray-300"
                    placeholder="Filter by author..."
                    value={authors}
                    onChange={(e) => setAuthors(e.target.value)}
                    onKeyDown={handleKeyDown}
                 />
              </div>
              <div>
                 <label htmlFor="journal" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Journal / Platform <span className="font-normal normal-case text-gray-400">(Optional)</span></label>
                 <input 
                    type="text"
                    id="journal"
                    autoComplete="off"
                    className="w-full bg-white border border-gray-300 p-3 font-serif focus:border-academic-text focus:outline-none transition-colors placeholder-gray-300"
                    placeholder="Filter by journal..."
                    value={journal}
                    onChange={(e) => setJournal(e.target.value)}
                    onKeyDown={handleKeyDown}
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Year Range</label>
                 <div className="flex gap-2">
                    <input 
                        type="text"
                        placeholder="Start"
                        autoComplete="off"
                        className="w-1/2 bg-white border border-gray-300 p-3 font-serif focus:border-academic-text focus:outline-none transition-colors placeholder-gray-300"
                        value={yearStart}
                        onChange={(e) => setYearStart(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <input 
                        type="text"
                        placeholder="End"
                        autoComplete="off"
                        className="w-1/2 bg-white border border-gray-300 p-3 font-serif focus:border-academic-text focus:outline-none transition-colors placeholder-gray-300"
                        value={yearEnd}
                        onChange={(e) => setYearEnd(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                 </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button 
                onClick={() => handleSearch()} 
                disabled={loadingState === LoadingStage.SEARCHING || !query.trim()}
                className="w-full md:w-auto"
              >
                {loadingState === LoadingStage.SEARCHING ? 'Analyzing...' : 'Search'}
              </Button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-8 animate-fadeIn">
           {loadingState === LoadingStage.SEARCHING && <Spinner />}
           
           {loadingState === LoadingStage.ERROR && (
             <div className="p-6 border-l-4 border-red-500 bg-red-50 text-red-800 font-serif">
               <h3 className="font-bold text-lg mb-2">Search Error</h3>
               <p>{error}</p>
             </div>
           )}

           {results.length > 0 && (
             <>
               <div className="flex justify-between items-baseline border-b border-gray-300 pb-4 mb-8">
                 <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">
                   Results Found
                 </h2>
                 <span className="text-xs text-gray-400 font-mono">
                   Displaying {results.length} papers {totalEstimate ? `• Found: ${totalEstimate}` : ''}
                 </span>
               </div>

               {clarifications.length > 0 && (
                 <div className="bg-gray-100 border border-gray-200 p-6 rounded-sm mb-10">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Suggested Refinements</h4>
                    <div className="flex flex-wrap gap-3">
                      {clarifications.map((clarification, idx) => (
                        <button 
                          key={idx}
                          onClick={() => {
                            setQuery(clarification);
                            handleSearch(clarification);
                          }}
                          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors rounded-sm shadow-sm"
                        >
                          {clarification}
                        </button>
                      ))}
                    </div>
                 </div>
               )}

               <div className="flex flex-col">
                 {results.map((paper) => (
                   <PaperCard key={paper.id} paper={paper} />
                 ))}
               </div>
             </>
           )}
        </div>

      </main>
    </div>
  );
};

export default App;
