import { Code, Smartphone, Cloud, Zap, Shield, Database } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Code,
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies like React, Next.js, Node.js, and MongoDB. We create responsive, fast, and scalable web solutions.',
      features: ['React & Next.js', 'Node.js Backend', 'MongoDB Database', 'Responsive Design'],
      color: 'green' // teal
    },
    {
      icon: Smartphone,
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android using React Native and Flutter. We ensure optimal performance and user experience.',
      features: ['React Native', 'Flutter', 'iOS & Android', 'App Store Deployment'],
      color: 'blue' // cyan
    },
    {
      icon: Cloud,
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and deployment solutions on AWS, Azure, and Google Cloud. We help you migrate and optimize your applications.',
      features: ['AWS Services', 'Azure Cloud', 'Google Cloud', 'DevOps & CI/CD'],
      color: 'purple' // indigo
    },
    {
      icon: Zap,
      title: 'API Development',
      description: 'RESTful and GraphQL APIs with comprehensive documentation and testing. We build robust APIs that integrate seamlessly with your applications.',
      features: ['REST APIs', 'GraphQL', 'API Documentation', 'Testing & Security'],
      color: 'orange' // amber
    },
    {
      icon: Database,
      title: 'Database Solutions',
      description: 'Database design, optimization, and management services. We work with SQL and NoSQL databases to ensure optimal performance.',
      features: ['MySQL & PostgreSQL', 'MongoDB & Redis', 'Database Design', 'Performance Optimization'],
      color: 'indigo' // slate
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Comprehensive security solutions including penetration testing, vulnerability assessment, and compliance with industry standards.',
      features: ['Security Audits', 'Penetration Testing', 'GDPR Compliance', 'Data Protection'],
      color: 'red' // emerald
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'from-emerald-50 to-green-50 border-emerald-200 text-emerald-600',
      blue: 'from-cyan-50 to-blue-50 border-cyan-200 text-cyan-600',
      purple: 'from-indigo-50 to-purple-50 border-indigo-200 text-indigo-600',
      orange: 'from-amber-50 to-orange-50 border-amber-200 text-amber-600',
      indigo: 'from-slate-50 to-indigo-50 border-slate-200 text-slate-600',
      red: 'from-emerald-50 to-green-50 border-emerald-200 text-emerald-600'
    };
    return colors[color as keyof typeof colors] || colors.green;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-20 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-6">Our Services</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We offer comprehensive software solutions to elevate your business to new heights. 
            From web development to cloud solutions, we have the expertise to bring your ideas to life.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const colorClasses = getColorClasses(service.color);

  return (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${colorClasses} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent size={32} />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                
                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    {feature}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We follow a structured approach to ensure your project's success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery', description: 'We understand your requirements and goals' },
              { step: '02', title: 'Planning', description: 'We create a detailed project roadmap' },
              { step: '03', title: 'Development', description: 'We build your solution with regular updates' },
              { step: '04', title: 'Launch', description: 'We deploy and provide ongoing support' }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-20 border-t border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Let's discuss your project requirements and create something amazing together
          </p>
          <button className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Contact Us Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;