
const Services = () => {
  const services = [
    {
      title: "Web Development",
      description: "Custom web applications using React, Node.js, and modern frameworks.",
      features: ["Responsive Design", "SEO Optimization", "Performance Tuning", "Security"]
    },
    {
      title: "Mobile Development",
      description: "Native and cross-platform mobile apps for iOS and Android.",
      features: ["iOS Apps", "Android Apps", "React Native", "Flutter"]
    },
    {
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and deployment solutions.",
      features: ["AWS", "Azure", "Google Cloud", "DevOps"]
    },
    {
      title: "Consulting",
      description: "Technical consulting and architecture design services.",
      features: ["System Design", "Code Review", "Performance Audit", "Migration"]
    }
  ];

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Our Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;