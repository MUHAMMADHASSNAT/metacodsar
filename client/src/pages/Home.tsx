import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Smartphone, Cloud, Users, Shield, Globe, Star, Award, TrendingUp, Zap, Target, Lightbulb } from 'lucide-react';
import MetaCodSarLogo from '../components/MetaCodSarLogo';
import { API_BASE_URL } from '../config/api';

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    projects: 0,
    clients: 0,
    experience: 0,
    satisfaction: 0
  });

  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "TechCorp Inc.",
      text: "MetaCodsar delivered an exceptional e-commerce platform that exceeded our expectations. Their attention to detail and technical expertise is unmatched.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      company: "StartupXYZ",
      text: "Working with MetaCodsar was a game-changer for our business. They transformed our idea into a powerful mobile application.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      company: "Enterprise Solutions",
      text: "The cloud migration project was handled flawlessly. MetaCodsar's team made the transition seamless and efficient.",
      rating: 5,
      avatar: "ER"
    }
  ];

  const [homeStats, setHomeStats] = useState([
    { icon: Award, label: "Projects Completed", value: 50, suffix: "+", color: "from-emerald-500 to-green-600" },
    { icon: Users, label: "Happy Clients", value: 25, suffix: "+", color: "from-green-500 to-emerald-600" },
    { icon: TrendingUp, label: "Years Experience", value: 5, suffix: "+", color: "from-lime-500 to-emerald-600" },
    { icon: Star, label: "Client Satisfaction", value: 100, suffix: "%", color: "from-emerald-500 to-green-600" }
  ]);
  
  const stats = homeStats;

  const services = [
    {
      icon: Code,
      title: "Web Development",
      description: "Custom web applications built with modern technologies like React, Node.js, and MongoDB",
      color: "from-emerald-500 to-green-600",
      bgColor: "from-emerald-50 to-green-50"
    },
    {
      icon: Smartphone,
      title: "Mobile Apps",
      description: "Native and cross-platform mobile applications for iOS and Android using React Native and Flutter",
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      icon: Cloud,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and migration services using AWS, Azure, and Google Cloud",
      color: "from-indigo-500 to-purple-600",
      bgColor: "from-indigo-50 to-purple-50"
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Comprehensive security solutions and compliance management for your applications",
      color: "from-emerald-500 to-green-600",
      bgColor: "from-emerald-50 to-green-50"
    }
  ];

  const features = [
    {
      icon: Target,
      title: "Goal-Oriented",
      description: "We focus on achieving your business objectives through technology"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Cutting-edge solutions that give you a competitive advantage"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless communication and collaboration throughout the project"
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Quick turnaround times without compromising on quality"
    }
  ];

  useEffect(() => {
    // Fetch stats from backend
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/stats`);
        if (response.ok) {
          const data = await response.json();
          if (data.stats && data.stats.length > 0) {
            const fetchedStats = data.stats.map((s: any) => ({
              icon: s.label === 'Projects Completed' ? Award : 
                    s.label === 'Happy Clients' ? Users : 
                    s.label === 'Years Experience' ? TrendingUp : Star,
              label: s.label,
              value: s.value,
              suffix: s.suffix || (s.label.includes('Satisfaction') ? '%' : '+'),
              color: s.color || (s.label === 'Projects Completed' ? 'from-emerald-500 to-green-600' :
                                s.label === 'Happy Clients' ? 'from-green-500 to-emerald-600' :
                                s.label === 'Years Experience' ? 'from-lime-500 to-emerald-600' :
                                'from-emerald-500 to-green-600')
            }));
            setHomeStats(fetchedStats);
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
      
      // Animate stats after fetch
      setTimeout(() => {
        const currentStats = homeStats.length > 0 ? homeStats : [
          { label: 'Projects Completed', value: 50 },
          { label: 'Happy Clients', value: 25 },
          { label: 'Years Experience', value: 5 },
          { label: 'Client Satisfaction', value: 100 }
        ];
        setAnimatedStats({
          projects: currentStats.find((s: any) => s.label.includes('Projects'))?.value || 50,
          clients: currentStats.find((s: any) => s.label.includes('Clients'))?.value || 25,
          experience: currentStats.find((s: any) => s.label.includes('Experience'))?.value || 5,
          satisfaction: currentStats.find((s: any) => s.label.includes('Satisfaction'))?.value || 100
        });
      }, 500);
    };
    
    fetchStats();
  }, []);

  useEffect(() => {
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-green-100">
      {/* Hero Section */}
      <section className="relative bg-green-100 py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-green-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-lime-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          {/* Logo */}
          <div className="mb-12">
            <div className="mx-auto w-48 h-48 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-emerald-400 transform hover:scale-105 transition-all duration-500">
              <div className="bg-white rounded-full p-6">
                <MetaCodSarLogo size={100} />
              </div>
            </div>
          </div>
          
          <h1 className="text-7xl font-bold mb-8 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text text-transparent animate-fade-in">
            METACODSAR
          </h1>
          <p className="text-4xl mb-6 italic text-emerald-700 font-serif animate-slide-up">
            CODE FROM THE HEIGHTS
          </p>
          <p className="text-2xl mb-4 max-w-4xl mx-auto text-gray-700 font-medium animate-slide-up">
            Where Professional Projects Live - Transforming Ideas into Digital Reality
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in">
            <Link 
              to="/projects" 
              className="group bg-gradient-to-r from-emerald-600 to-green-600 text-white px-10 py-5 rounded-2xl font-semibold text-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center"
            >
              <span>Explore Our Projects</span>
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={24} />
            </Link>
            <Link 
              to="/contact" 
              className="group border-2 border-emerald-500 text-emerald-400 px-10 py-5 rounded-2xl font-semibold text-xl hover:bg-emerald-500 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <span>Start Your Project</span>
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Stats Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Our Achievements</h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              Numbers that speak for our commitment to excellence and client satisfaction
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="group text-center">
                  <div className={`w-24 h-24 bg-gradient-to-br ${stat.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <IconComponent className="text-white" size={36} />
                  </div>
                  <h3 className="text-5xl font-bold text-gray-900 mb-3">
                    {animatedStats[stat.label.toLowerCase().replace(' ', '') as keyof typeof animatedStats] || 0}{stat.suffix}
                  </h3>
                  <p className="text-xl text-gray-600 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">Our Services</h2>
            <p className="text-2xl text-slate-300 max-w-4xl mx-auto">
              Comprehensive solutions tailored to your business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="group text-center p-8 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-emerald-500/20">
                  <div className={`w-24 h-24 bg-gradient-to-br ${service.color} rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <IconComponent className="text-white" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold mb-6 text-white group-hover:text-emerald-400 transition-colors">{service.title}</h3>
                  <p className="text-slate-300 leading-relaxed text-lg">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Why Choose Us?</h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              We combine technical expertise with business understanding to deliver exceptional results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group text-center p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-green-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-emerald-100">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <IconComponent className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">What Our Clients Say</h2>
            <p className="text-2xl text-slate-300 max-w-4xl mx-auto">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-12 shadow-2xl relative overflow-hidden border border-emerald-500/20">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500/20 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative text-center">
                <div className="flex justify-center mb-8">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current mx-1" size={28} />
                  ))}
                </div>
                <blockquote className="text-2xl text-slate-200 mb-8 italic leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div className="flex items-center justify-center space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">
                      {testimonials[currentTestimonial].avatar}
                    </span>
              </div>
                  <div className="text-left">
                    <p className="text-xl font-semibold text-emerald-300">{testimonials[currentTestimonial].name}</p>
                    <p className="text-lg text-slate-400">{testimonials[currentTestimonial].company}</p>
            </div>
              </div>
            </div>
              
              {/* Testimonial Navigation */}
              <div className="flex justify-center mt-8 space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'bg-emerald-500 scale-125' : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-bold text-white mb-8">About MetaCodsar</h2>
              <div className="space-y-8 text-slate-300 leading-relaxed text-lg">
                <p>
                  MetaCodsar was founded with a simple yet powerful vision: to create software solutions 
                  that not only meet business requirements but exceed expectations. Our journey began when 
                  we realized the gap between what businesses needed and what they were getting.
                </p>
                <p>
                  Today, we're proud to be a team of passionate developers, designers, and strategists 
                  who work together to deliver exceptional results. We believe in the power of technology 
                  to transform businesses and create opportunities.
                </p>
                <p>
                  Our commitment to quality, innovation, and client satisfaction has made us a trusted 
                  partner for businesses of all sizes, from startups to enterprise-level organizations.
                </p>
            </div>
                </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-3xl p-10 text-white shadow-2xl">
                <div className="flex items-center mb-8">
                  <Globe className="w-10 h-10 mr-4" />
                  <h3 className="text-3xl font-bold">Global Reach</h3>
                </div>
                <p className="text-emerald-100 leading-relaxed mb-8 text-lg">
                  We serve clients worldwide, delivering solutions that work across different time zones, 
                  cultures, and business environments.
                </p>
                <div className="flex items-center text-emerald-100 text-lg">
                  <ArrowRight className="w-6 h-6 mr-3" />
                  <span className="font-medium">Learn more about our services</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden border-t border-emerald-500/20">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-8">Ready to Start Your Project?</h2>
          <p className="text-2xl text-slate-300 mb-12 max-w-4xl mx-auto">
            Let's work together to bring your ideas to life with cutting-edge technology and innovative solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/contact" 
              className="group bg-gradient-to-r from-emerald-600 to-green-600 text-white px-10 py-5 rounded-2xl font-semibold text-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center"
            >
              <span>Get Free Consultation</span>
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={24} />
            </Link>
            <Link 
              to="/projects" 
              className="group border-2 border-emerald-500 text-emerald-400 px-10 py-5 rounded-2xl font-semibold text-xl hover:bg-emerald-500 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <span>View Our Portfolio</span>
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={24} />
          </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;