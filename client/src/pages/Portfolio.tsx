const Portfolio = () => {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with payment integration",
      tech: ["React", "Node.js", "MongoDB", "Stripe"]
    },
    {
      title: "Mobile Banking App",
      description: "Secure mobile banking application with biometric authentication",
      tech: ["React Native", "Node.js", "PostgreSQL", "AWS"]
    },
    {
      title: "CRM System",
      description: "Customer relationship management system for enterprise clients",
      tech: ["Vue.js", "Express", "MySQL", "Docker"]
    },
    {
      title: "IoT Dashboard",
      description: "Real-time IoT device monitoring and control dashboard",
      tech: ["React", "Socket.io", "MongoDB", "Raspberry Pi"]
    }
  ];

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Our Portfolio</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">{project.title}</h3>
              <p className="text-gray-600 mb-6">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;