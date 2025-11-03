import { Users, Target, Award, Lightbulb, ArrowRight, CheckCircle, Star, Globe } from 'lucide-react';

const About = () => {
  const stats = [
    { number: '50+', label: 'Projects Completed', icon: Award },
    { number: '25+', label: 'Happy Clients', icon: Users },
    { number: '5+', label: 'Years Experience', icon: Star },
    { number: '100%', label: 'Success Rate', icon: CheckCircle }
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To deliver exceptional software solutions that drive business growth and innovation.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Lightbulb,
      title: 'Our Vision',
      description: 'To be the leading technology partner for businesses worldwide.',
      color: 'from-lime-500 to-emerald-600'
    },
    {
      icon: Users,
      title: 'Our Values',
      description: 'Integrity, excellence, and client satisfaction are at the core of everything we do.',
      color: 'from-emerald-500 to-green-600'
    }
  ];

  const teamFeatures = [
    'Expert developers with 5+ years experience',
    'Modern technologies and best practices',
    'Agile development methodology',
    '24/7 support and maintenance',
    'Scalable and secure solutions',
    'Competitive pricing and flexible packages'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-20 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-6">About MetaCodsar</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            We are passionate developers creating innovative solutions that help businesses reach new heights.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <IconComponent className="text-white" size={32} />
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-green-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Foundation</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on strong principles and driven by innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="group">
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="text-white" size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
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
              <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-3xl p-8 text-white shadow-xl">
                <div className="flex items-center mb-6">
                  <Globe className="w-8 h-8 mr-3" />
                  <h3 className="text-2xl font-bold">Global Reach</h3>
                </div>
                <p className="text-emerald-100 leading-relaxed mb-6">
                  We serve clients worldwide, delivering solutions that work across different time zones, 
                  cultures, and business environments.
                </p>
                <div className="flex items-center text-emerald-100">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  <span className="font-medium">Learn more about our services</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose MetaCodsar?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine technical expertise with business understanding to deliver exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {teamFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">{feature}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Get Started?</h3>
              <p className="text-gray-600 mb-6">
                Let's discuss your project requirements and create something amazing together.
              </p>
              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Get Free Consultation
                </button>
                <button className="w-full border-2 border-emerald-600 text-emerald-600 py-3 px-6 rounded-xl font-semibold hover:bg-emerald-600 hover:text-white transition-all duration-300">
                  View Our Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;