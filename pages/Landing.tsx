import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle, Clock, Shield, Star, Leaf, 
  Car, Banknote, FileCheck, Recycle, MapPin, Phone, Truck 
} from 'lucide-react';
import { Button } from '../components/ui';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary-100 selection:text-primary-900">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 pb-16 pt-24 sm:pb-32 lg:pb-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary-600/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-900/50 border border-primary-700/50 px-4 py-1.5 text-sm font-medium text-primary-300 mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <span className="flex h-2 w-2 rounded-full bg-primary-400 animate-pulse"></span>
                Official Scrappage Policy Partner
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl mb-6 leading-tight">
                Responsible Disposal. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-400">Maximum Value.</span>
              </h1>
              <p className="mx-auto lg:mx-0 max-w-lg text-lg text-slate-300 mb-10 leading-relaxed">
                ReCarma is India's most trusted digital platform for End-of-Life Vehicles. We simplify the scrappage process, ensuring you get the best price while staying legally compliant.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/register" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto px-8 py-4 text-lg bg-primary-600 hover:bg-primary-500 text-white shadow-xl shadow-primary-500/20 rounded-2xl">
                        Get Valuation <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto px-8 py-4 text-lg !border-slate-700 !text-slate-300 !bg-transparent hover:!bg-slate-800 hover:!text-white hover:!border-slate-600 rounded-2xl transition-all">
                        Dealer Login
                    </Button>
                </Link>
              </div>
            </div>

            <div className="relative mt-16 lg:mt-0 lg:col-span-6 perspective-1000">
               {/* Abstract Dashboard UI */}
               <div className="relative rounded-2xl bg-slate-800/80 border border-slate-700/50 p-2 shadow-2xl backdrop-blur-md transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-all duration-700">
                   <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                       <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
                           <div className="flex gap-1.5">
                               <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                               <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                               <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                           </div>
                           <div className="text-xs text-slate-500 font-mono ml-2">status.recarma.app</div>
                       </div>
                       <div className="p-6 space-y-6">
                           <div className="flex items-center justify-between">
                               <div>
                                   <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-bold">Current Vehicle</div>
                                   <div className="text-white font-bold text-lg">Honda City 2012</div>
                               </div>
                               <div className="text-right">
                                   <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-bold">Scrap Value</div>
                                   <div className="text-emerald-400 font-bold text-xl">₹ 42,500</div>
                               </div>
                           </div>
                           <div className="space-y-2">
                               <div className="flex justify-between text-xs text-slate-400">
                                   <span>Process</span>
                                   <span>80%</span>
                               </div>
                               <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                   <div className="h-full w-[80%] bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full animate-pulse"></div>
                               </div>
                           </div>
                           <div className="flex gap-3">
                               <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg flex-1 text-center">
                                   <FileCheck className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                                   <div className="text-[10px] text-emerald-200">COD Issued</div>
                               </div>
                               <div className="bg-primary-500/10 border border-primary-500/20 p-3 rounded-lg flex-1 text-center">
                                   <Banknote className="w-5 h-5 text-primary-400 mx-auto mb-1" />
                                   <div className="text-[10px] text-primary-200">Payment Done</div>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary-900 py-12 border-b border-primary-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-primary-800/50">
                  {[
                      { label: 'Vehicles Scrapped', value: '5' },
                      { label: 'Happy Owners', value: '10' },
                      { label: 'Tons CO2 Saved', value: '120' },
                      { label: 'Value Generated', value: '₹20 L+' },
                  ].map((stat, idx) => (
                      <div key={idx} className="p-2">
                          <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{stat.value}</div>
                          <div className="text-sm text-primary-200 font-medium uppercase tracking-wide">{stat.label}</div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* How It Works */}
      <div className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-2">The Process</h2>
                <h3 className="text-4xl font-bold text-slate-900">How ReCarma Works</h3>
                <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-lg">We've simplified a complex legal process into 4 easy steps.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                    { title: "Register", desc: "Enter vehicle details & upload RC photos.", icon: Car },
                    { title: "Valuation", desc: "Get best price quotes from authorized dealers.", icon: Banknote },
                    { title: "Pickup", desc: "Free doorstep towing at your preferred time.", icon: Truck },
                    { title: "Certificate", desc: "Receive official Certificate of Deposit (COD).", icon: FileCheck },
                ].map((step, idx) => (
                    <div key={idx} className="relative group">
                        <div className="bg-white rounded-2xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300 h-full">
                            <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors duration-300">
                                <step.icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
                            <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                        </div>
                        {idx < 3 && (
                            <div className="hidden md:block absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 z-20">
                                <ArrowRight className="w-6 h-6 text-slate-300" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-2">Benefits</h2>
                    <h3 className="text-4xl font-bold text-slate-900 mb-6">Why use ReCarma?</h3>
                    <p className="text-lg text-slate-600 mb-8">
                        Beyond just disposing of a car, ReCarma ensures you contribute to a circular economy while ensuring your own legal safety.
                    </p>
                    
                    <div className="space-y-6">
                        {[
                            { title: "Guaranteed Legal Compliance", desc: "We ensure your vehicle is de-registered from RTO records so you are not liable for future misuse.", icon: Shield },
                            { title: "Transparent Pricing", desc: "No haggling with local scrap dealers. Get standardized pricing based on metal weight and reusable parts.", icon: Star },
                            { title: "Eco-Friendly Recycling", desc: "Our partners follow strict environmental norms to recycle hazardous fluids and batteries safely.", icon: Leaf },
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-4">
                                <div className="mt-1">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <item.icon className="w-5 h-5 text-emerald-600" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                                    <p className="text-slate-600 mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4 translate-y-8">
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
                            <Clock className="w-8 h-8 text-blue-500 mb-4" />
                            <h4 className="font-bold text-slate-900">Save Time</h4>
                            <p className="text-sm text-slate-500 mt-2">Process completed in under 7 days.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
                            <MapPin className="w-8 h-8 text-rose-500 mb-4" />
                            <h4 className="font-bold text-slate-900">Pan India</h4>
                            <p className="text-sm text-slate-500 mt-2">Network across 50+ cities.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
                            <Recycle className="w-8 h-8 text-emerald-500 mb-4" />
                            <h4 className="font-bold text-slate-900">98% Recovery</h4>
                            <p className="text-sm text-slate-500 mt-2">Almost zero waste to landfill.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
                            <Phone className="w-8 h-8 text-purple-500 mb-4" />
                            <h4 className="font-bold text-slate-900">Support</h4>
                            <p className="text-sm text-slate-500 mt-2">24/7 assistance for owners.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Use Cases / CTA */}
      <div className="py-24 bg-slate-900 text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold mb-6">What vehicles can you scrap?</h2>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                  {['End-of-Life (15+ Years)', 'Accidental Total Loss', 'Abandoned', 'Non-Running', 'Commercial Trucks'].map((tag) => (
                      <span key={tag} className="px-6 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium text-sm">
                          {tag}
                      </span>
                  ))}
              </div>
              
              <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-12 relative overflow-hidden">
                  <div className="relative z-10">
                      <h3 className="text-3xl font-bold mb-4">Ready to clear the clutter?</h3>
                      <p className="text-primary-100 mb-8 text-lg">Join thousands of responsible citizens contributing to a greener future.</p>
                      <Link to="/register">
                          <Button className="px-8 py-4 bg-black text-primary-900 hover:bg-slate-100 font-bold text-lg border-0">
                              Start Scrapping Now
                          </Button>
                      </Link>
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Landing;
