import { MessageSquareCode, LayoutGrid, Hash, Send } from 'lucide-react';

const HeroSection = () => {
  const tableRows = [
    { name: 'api-server-6d7f6c8f6b-2k9js', ready: '1/1', status: 'Running', restarts: '0', age: '2h' },
    { name: 'auth-service-5cd9f7d5d-r8z3n', ready: '1/1', status: 'Running', restarts: '0', age: '3h' },
    { name: 'web-ui-6b6cc7d8f9-h4m2x', ready: '1/1', status: 'Running', restarts: '1', age: '4h' },
  ];

  return (
    <section className="w-full bg-white py-8 sm:py-12 md:py-16 lg:py-20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          
          {/* Left Content Section */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6 max-w-xl">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-100/60">
              <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase whitespace-nowrap">
                Kubernetes ChatOps Platform
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Manage Kubernetes{' '}
              <span className="hidden sm:inline"><br /></span>
              with{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Simple Conversations
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              KubeChatOps brings the power of Kubernetes to your favorite chat platforms. 
              Manage, monitor, and troubleshoot your clusters using natural language commands.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <button className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:opacity-95 shadow-md shadow-blue-200 transition-all">
                <MessageSquareCode size={16} />
                Start Chatting
              </button>
              <button className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white text-slate-900 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all">
                <LayoutGrid size={16} className="text-slate-600" />
                View Dashboard
              </button>
            </div>
          </div>

          {/* Right Mockup Section */}
          <div className="relative w-full">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-blue-100/20 overflow-hidden flex flex-col sm:flex-row h-auto sm:h-[450px] md:h-[500px]">
              {/* Sidebar - Hidden on mobile, shown on sm and up */}
              <div className="hidden sm:block w-[140px] md:w-[160px] border-r border-gray-100 p-3 md:p-4 bg-slate-50/50 flex-shrink-0">
                <div className="flex items-center gap-2 mb-6 md:mb-8">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0">K</div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">KubeBot</p>
                    <p className="text-[9px] text-green-500 font-medium">● Online</p>
                  </div>
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Channels</p>
                <div className="space-y-1 mb-6">
                  {['general', 'alerts', 'deployments'].map(ch => (
                    <div key={ch} className="flex items-center gap-1.5 text-xs text-slate-600 px-2 py-1 truncate">
                      <Hash size={12} className="flex-shrink-0" /> 
                      <span className="truncate">{ch}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Sidebar - Shown only on mobile */}
              <div className="sm:hidden flex items-center gap-2 p-3 border-b border-gray-100 bg-slate-50/50">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0">K</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900">KubeBot</p>
                  <p className="text-[9px] text-green-500 font-medium">● Online</p>
                </div>
                <div className="flex gap-2">
                  <Hash size={14} className="text-slate-400" />
                  <Hash size={14} className="text-slate-400" />
                  <Hash size={14} className="text-slate-400" />
                </div>
              </div>

              {/* Chat Content */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
                  <div className="flex gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-200 rounded-full flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900">
                        User <span className="text-[10px] text-slate-400 font-normal ml-2">10:30 AM</span>
                      </p>
                      <p className="text-xs text-slate-700 bg-slate-50 p-1.5 rounded inline-block break-words">
                        /pods
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-[10px] sm:text-xs flex-shrink-0">K</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900">
                        KubeBot <span className="text-[8px] bg-blue-100 text-blue-600 px-1 rounded uppercase">Bot</span>
                      </p>
                      <div className="mt-2 border border-gray-100 rounded-lg overflow-hidden text-[10px]">
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[300px] sm:min-w-full text-left">
                            <thead className="bg-slate-50 text-slate-400">
                              <tr>
                                <th className="p-1.5 sm:p-2 text-[9px] sm:text-[10px]">NAME</th>
                                <th className="p-1.5 sm:p-2 text-[9px] sm:text-[10px]">STATUS</th>
                                <th className="p-1.5 sm:p-2 text-[9px] sm:text-[10px]">AGE</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tableRows.map((row, i) => (
                                <tr key={i} className="border-t border-gray-50">
                                  <td className="p-1.5 sm:p-2 text-[9px] sm:text-[10px] max-w-[80px] sm:max-w-none truncate">
                                    {row.name.substring(0, 12)}...
                                  </td>
                                  <td className="p-1.5 sm:p-2 text-[9px] sm:text-[10px] text-green-600 whitespace-nowrap">
                                    {row.status}
                                  </td>
                                  <td className="p-1.5 sm:p-2 text-[9px] sm:text-[10px] whitespace-nowrap">
                                    {row.age}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-4 border-t border-gray-100">
                  <div className="flex bg-slate-50 rounded-xl p-2 items-center gap-2">
                    <input 
                      className="flex-1 bg-transparent text-xs outline-none px-2 min-w-0" 
                      placeholder="Message KubeBot..." 
                    />
                    <Send size={14} className="text-blue-600 flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;