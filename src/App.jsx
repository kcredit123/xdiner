import React, { useState, useEffect, useMemo } from 'react';
import { 
  Utensils, Calendar, Clock, MapPin, Phone, Mail, 
  Settings, Layout, Image as ImageIcon, MessageSquare, 
  ChevronRight, Star, Plus, Trash2, Edit2, Check, X,
  Menu, Facebook, Instagram, Twitter, Search, Globe,
  Shield, ChefHat, Bell, LogIn, ExternalLink, Save,
  ArrowRight
} from 'lucide-react';

/**
 * XDiner - High-Converting Restaurant Platform
 * * FEATURES:
 * - Customer UI: Hero, Menu, Reservations, Blog, About, Reviews
 * - Admin Panel: CMS, Menu Manager, Reservation System, Design Editor
 * - State Management: In-memory (can be upgraded to Firestore)
 */

const App = () => {
  // --- CONFIG & APP ID ---
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'xdiner-v1';
  const apiKey = ""; // Provided at runtime

  // --- STATE ---
  const [view, setView] = useState('home'); // 'home', 'menu', 'admin', 'blog', 'contact'
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // --- PERSISTENT DATA (Simulated Storage) ---
  const [siteData, setSiteData] = useState({
    settings: {
      name: "Xdiner",
      tagline: "Modern Fast Food Reimagined",
      primaryColor: "#ef4444", // red-500
      theme: "modern", // modern, warm, dark
      font: "sans",
      seoTitle: "Xdiner | Best Fast Food in Town",
      seoDescription: "High-quality ingredients, fast service, and a modern dining experience for local foodies.",
    },
    hours: [
      { day: "Mon-Fri", time: "10:00 AM - 10:00 PM" },
      { day: "Sat-Sun", time: "09:00 AM - 11:00 PM" }
    ],
    menu: [
      { id: 1, name: "Signature X-Burger", price: 12.99, category: "Mains", description: "Wagyu beef, secret X-sauce, brioche bun.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400" },
      { id: 2, name: "Truffle Parm Fries", price: 6.50, category: "Sides", description: "Hand-cut potatoes, white truffle oil, fresh parmesan.", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400" },
      { id: 3, name: "Spicy Buffalo Wings", price: 9.99, category: "Appetizers", description: "8 pieces, house-made buffalo glaze, celery sticks.", image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=400" },
      { id: 4, name: "Matcha Milkshake", price: 7.00, category: "Drinks", description: "Ceremonial grade matcha, vanilla bean ice cream.", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400" },
    ],
    reservations: [
      { id: 1, name: "John Doe", email: "john@example.com", date: "2024-05-20", time: "19:00", guests: 2, status: "pending" }
    ],
    inquiries: [
      { id: 1, name: "Jane Smith", subject: "Catering", message: "Do you offer office catering?", date: "2024-05-18" }
    ],
    blog: [
      { id: 1, title: "Our Local Farm Partnerships", date: "May 15, 2024", content: "We believe in sourcing locally to provide the freshest fast food experience...", image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=400" }
    ]
  });

  // --- HELPERS ---
  const accentColor = siteData.settings.primaryColor;
  
  const generateImage = async (prompt) => {
    setIsGeneratingImage(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`, {
        method: "POST",
        body: JSON.stringify({ instances: { prompt }, parameters: { sampleCount: 1 } })
      });
      const result = await response.json();
      return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
    } catch (e) {
      console.error("Image gen failed", e);
      return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400";
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // --- COMPONENTS ---

  const Navbar = () => (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="p-2 rounded-lg text-white" style={{ backgroundColor: accentColor }}>
            <Utensils size={24} />
          </div>
          <span className="text-2xl font-black tracking-tight">{siteData.settings.name}</span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          {['Home', 'Menu', 'Blog', 'Contact'].map(link => (
            <button 
              key={link} 
              onClick={() => setView(link.toLowerCase())}
              className={`hover:text-red-500 transition-colors ${view === link.toLowerCase() ? 'text-red-500' : 'text-gray-600'}`}
            >
              {link}
            </button>
          ))}
          <button 
            onClick={() => setView('admin')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <Settings size={20} />
          </button>
          <button 
            className="px-6 py-2.5 rounded-full text-white font-bold shadow-lg transition-transform active:scale-95"
            style={{ backgroundColor: accentColor }}
            onClick={() => {
                const el = document.getElementById('booking');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setView('home');
            }}
          >
            Book a Table
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b p-4 space-y-4 animate-in slide-in-from-top duration-300">
          {['Home', 'Menu', 'Blog', 'Contact'].map(link => (
            <button 
              key={link} 
              className="block w-full text-left py-2 font-bold"
              onClick={() => { setView(link.toLowerCase()); setIsMenuOpen(false); }}
            >
              {link}
            </button>
          ))}
          <button 
            onClick={() => { setView('admin'); setIsMenuOpen(false); }}
            className="flex items-center gap-2 w-full py-2 text-gray-500"
          >
            <Settings size={18} /> Admin Dashboard
          </button>
        </div>
      )}
    </nav>
  );

  const Hero = () => (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-bold">
            <Star size={14} fill="currentColor" /> Local Favorites Pick
          </div>
          <h1 className="text-6xl md:text-7xl font-black leading-tight text-gray-900">
            {siteData.settings.tagline.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? 'text-transparent bg-clip-text bg-gradient-to-r' : ''} style={i === 1 ? {backgroundImage: `linear-gradient(to right, ${accentColor}, #f87171)`} : {}}>
                {word}{' '}
              </span>
            ))}
          </h1>
          <p className="text-xl text-gray-600 max-w-lg">
            Experience the fusion of high-end culinary arts with the speed and comfort of classic fast food. Fresh ingredients, bold flavors.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              className="px-8 py-4 rounded-full text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              style={{ backgroundColor: accentColor }}
            >
              Order Online
            </button>
            <button className="px-8 py-4 rounded-full border-2 border-gray-200 font-bold text-lg hover:bg-gray-50 transition-all flex items-center gap-2">
              See Menu <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-red-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
          <img 
            src="https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&q=80&w=800" 
            alt="Hero Dish" 
            className="rounded-[2.5rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 object-cover aspect-[4/5]"
          />
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <Check />
            </div>
            <div>
              <p className="font-black text-gray-900">100% Organic</p>
              <p className="text-sm text-gray-500">Locally Sourced</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const MenuGrid = () => (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-black">Our Signature Flavors</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Explore our curated selection of modern fast food classics with a gourmet twist.</p>
          <div className="flex justify-center gap-2 mt-8 overflow-x-auto py-2">
            {['All', 'Mains', 'Sides', 'Appetizers', 'Drinks'].map(cat => (
              <button key={cat} className="px-6 py-2 rounded-full border bg-white hover:border-red-500 hover:text-red-500 transition-all font-bold whitespace-nowrap">
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {siteData.menu.map(item => (
            <div key={item.id} className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
              <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-black">
                  ${item.price.toFixed(2)}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1">{item.name}</h3>
              <p className="text-gray-500 text-sm line-clamp-2 mb-4">{item.description}</p>
              <button className="w-full py-3 rounded-xl border-2 border-gray-100 font-bold group-hover:bg-red-500 group-hover:border-red-500 group-hover:text-white transition-all">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const ReservationBlock = () => (
    <section id="booking" className="py-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-gray-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
          <div className="md:w-1/2 p-12 text-white space-y-6">
            <h2 className="text-5xl font-black">Table Booking</h2>
            <p className="text-gray-400">Join us for a unique dining experience. Reserve your spot for dinner, events, or just a quick lunch.</p>
            
            <div className="space-y-4 pt-6">
              <div className="flex items-center gap-4">
                <MapPin className="text-red-500" />
                <span>123 Culinary Drive, Foodville</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-red-500" />
                <span>(555) 000-1234</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 bg-white p-12">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Booking Submitted!"); }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Date</label>
                  <input type="date" className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-red-500/20 border" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Guests</label>
                  <select className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-red-500/20 border">
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guests</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-red-500/20 border" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-red-500/20 border" required />
              </div>
              <button 
                type="submit"
                className="w-full py-4 rounded-xl text-white font-black text-lg shadow-lg hover:shadow-red-500/30 transition-all"
                style={{ backgroundColor: accentColor }}
              >
                Confirm Reservation
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );

  const Footer = () => (
    <footer className="bg-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 border-b pb-12 mb-10">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg text-white" style={{ backgroundColor: accentColor }}>
              <Utensils size={20} />
            </div>
            <span className="text-2xl font-black">{siteData.settings.name}</span>
          </div>
          <p className="text-gray-500 text-sm">Elevating the standard of fast food through innovation, quality, and a commitment to local flavor.</p>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-red-500 cursor-pointer shadow-sm transition-colors">
              <Facebook size={18} />
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-red-500 cursor-pointer shadow-sm transition-colors">
              <Instagram size={18} />
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-red-500 cursor-pointer shadow-sm transition-colors">
              <Twitter size={18} />
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-black mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
          <ul className="space-y-4 text-gray-600 font-medium">
            {['Home', 'Menu', 'Gallery', 'Catering', 'Careers'].map(l => <li key={l} className="hover:text-red-500 cursor-pointer">{l}</li>)}
          </ul>
        </div>
        
        <div>
          <h4 className="font-black mb-6 uppercase tracking-wider text-sm">Contact Us</h4>
          <ul className="space-y-4 text-gray-600 font-medium">
            <li className="flex gap-2"><MapPin size={18} className="text-red-500" /> 123 Gourmet St, Metro City</li>
            <li className="flex gap-2"><Phone size={18} className="text-red-500" /> (555) 123-4567</li>
            <li className="flex gap-2"><Mail size={18} className="text-red-500" /> hello@xdiner.com</li>
          </ul>
        </div>

        <div>
          <h4 className="font-black mb-6 uppercase tracking-wider text-sm">Newsletter</h4>
          <p className="text-gray-500 text-sm mb-4">Get 10% off your first visit.</p>
          <div className="relative">
            <input type="text" placeholder="Email address" className="w-full p-4 pr-12 rounded-2xl bg-white border outline-none focus:ring-2 ring-red-500/20" />
            <button className="absolute right-2 top-2 bottom-2 px-4 rounded-xl text-white" style={{ backgroundColor: accentColor }}>
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:row justify-between items-center text-sm text-gray-400 gap-4">
        <p>© 2024 {siteData.settings.name}. All rights reserved.</p>
        <div className="flex gap-6">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <button onClick={() => setView('admin')} className="underline">Merchant Portal</button>
        </div>
      </div>
    </footer>
  );

  // --- ADMIN DASHBOARD ---

  const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('overview');
    
    const stats = [
      { label: 'Pending Bookings', value: siteData.reservations.length, icon: Calendar, color: 'text-blue-500' },
      { label: 'Total Sales', value: '$1,240', icon: Utensils, color: 'text-green-500' },
      { label: 'New Inquiries', value: siteData.inquiries.length, icon: MessageSquare, color: 'text-orange-500' },
      { label: 'Reviews', value: '4.8', icon: Star, color: 'text-yellow-500' },
    ];

    return (
      <div className="min-h-screen bg-gray-50 flex pt-20">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-white border-r hidden md:block">
          <div className="p-6 space-y-2">
            {[
              { id: 'overview', icon: Layout, label: 'Overview' },
              { id: 'menu', icon: Utensils, label: 'Menu Manager' },
              { id: 'bookings', icon: Calendar, label: 'Reservations' },
              { id: 'design', icon: Layout, label: 'Design Editor' },
              { id: 'seo', icon: Globe, label: 'SEO Settings' },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-red-50 text-red-600 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Admin Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-black capitalize">{activeTab}</h2>
                <p className="text-gray-500">Manage your restaurant business and platform settings.</p>
              </div>
              <button className="flex items-center gap-2 px-6 py-2 bg-white border rounded-full font-bold shadow-sm hover:shadow-md transition-all">
                <ExternalLink size={18} /> Live Site
              </button>
            </header>

            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-4 gap-6">
                {stats.map(s => (
                  <div key={s.label} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className={`p-4 rounded-2xl bg-gray-50 ${s.color}`}>
                      <s.icon size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                      <p className="text-2xl font-black">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'menu' && (
              <div className="bg-white rounded-[2rem] border overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-bold">Manage Dishes</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-500/20">
                    <Plus size={18} /> Add New Dish
                  </button>
                </div>
                <div className="divide-y">
                  {siteData.menu.map(item => (
                    <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                      <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)} • {item.category}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-white border rounded-lg"><Edit2 size={16} /></button>
                        <button className="p-2 hover:bg-red-50 text-red-500 border rounded-lg border-transparent hover:border-red-100"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'design' && (
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[2rem] border space-y-6">
                        <h3 className="font-black text-xl mb-4">Visual Branding</h3>
                        <div className="space-y-4">
                            <label className="block">
                                <span className="text-sm font-bold text-gray-700">Restaurant Name</span>
                                <input 
                                    type="text" 
                                    value={siteData.settings.name} 
                                    onChange={e => setSiteData({...siteData, settings: {...siteData.settings, name: e.target.value}})}
                                    className="w-full mt-1 p-3 border rounded-xl" 
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-bold text-gray-700">Primary Brand Color</span>
                                <div className="flex gap-3 mt-2">
                                    {['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#111827'].map(c => (
                                        <button 
                                            key={c}
                                            onClick={() => setSiteData({...siteData, settings: {...siteData.settings, primaryColor: c}})}
                                            className={`w-8 h-8 rounded-full border-2 ${siteData.settings.primaryColor === c ? 'border-black scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </label>
                            <div className="pt-4">
                                <button className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-8 rounded-[2rem] border">
                        <h3 className="font-black text-xl mb-4">Style Preview</h3>
                        <div className="border rounded-2xl overflow-hidden shadow-lg h-64 flex flex-col items-center justify-center p-8 bg-gray-50">
                            <div className="w-12 h-12 rounded-xl mb-4" style={{ backgroundColor: siteData.settings.primaryColor }}></div>
                            <h4 className="text-xl font-black">{siteData.settings.name}</h4>
                            <p className="text-gray-400 text-sm">Theme: {siteData.settings.theme}</p>
                            <div className="mt-6 flex gap-2">
                                <div className="h-2 w-20 rounded-full bg-gray-200"></div>
                                <div className="h-2 w-10 rounded-full bg-gray-200"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </main>
      </div>
    );
  };

  // --- ROUTING ---
  const renderContent = () => {
    switch (view) {
      case 'home': return (
        <>
          <Hero />
          <MenuGrid />
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-20 items-center">
                <img 
                    src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800" 
                    className="rounded-[3rem] shadow-2xl" 
                />
                <div className="space-y-6">
                    <h2 className="text-5xl font-black leading-tight">Born from a passion for perfection.</h2>
                    <p className="text-xl text-gray-500">Founded in 2024, Xdiner was created to prove that fast food doesn't have to be "junk" food. We partner with local farmers and artisans to bring high-quality ingredients to your table in minutes.</p>
                    <div className="flex gap-10">
                        <div>
                            <p className="text-4xl font-black text-red-500">100%</p>
                            <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Fresh Beef</p>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-red-500">24h</p>
                            <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Marinade</p>
                        </div>
                    </div>
                </div>
            </div>
          </section>
          <ReservationBlock />
        </>
      );
      case 'menu': return <MenuGrid />;
      case 'admin': return <AdminPanel />;
      case 'contact': return (
        <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
             <div className="text-center mb-16">
                 <h1 className="text-5xl font-black">Get In Touch</h1>
                 <p className="text-gray-500 mt-4">Have questions about catering, events, or reservations?</p>
             </div>
             <div className="grid md:grid-cols-3 gap-8">
                 <div className="bg-white p-8 rounded-3xl border shadow-sm text-center space-y-4">
                     <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto"><Phone /></div>
                     <h3 className="text-xl font-bold">Call Us</h3>
                     <p className="text-gray-500">(555) 123-4567</p>
                 </div>
                 <div className="bg-white p-8 rounded-3xl border shadow-sm text-center space-y-4">
                     <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto"><Mail /></div>
                     <h3 className="text-xl font-bold">Email Us</h3>
                     <p className="text-gray-500">hello@xdiner.com</p>
                 </div>
                 <div className="bg-white p-8 rounded-3xl border shadow-sm text-center space-y-4">
                     <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mx-auto"><Clock /></div>
                     <h3 className="text-xl font-bold">Opening Hours</h3>
                     <p className="text-gray-500">Mon - Sun: 10AM - 10PM</p>
                 </div>
             </div>
        </div>
      );
      default: return <Hero />;
    }
  }

  return (
    <div className={`min-h-screen font-${siteData.settings.font} text-gray-900 overflow-x-hidden selection:bg-red-200`}>
      <Navbar />
      {renderContent()}
      {view !== 'admin' && <Footer />}
      
      {/* Global Image Generation Loader Overlay */}
      {isGeneratingImage && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="font-black text-gray-900 animate-pulse">Generating High-Quality Imagery...</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;