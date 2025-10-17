import React from 'react';

const Team = () => {
  const teamMembers = [
    {
      name: "John Smith",
      role: "CEO & Founder",
      image: "https://via.placeholder.com/200x200",
      description: "Visionary leader with 10+ years in software development"
    },
    {
      name: "Sarah Johnson",
      role: "CTO",
      image: "https://via.placeholder.com/200x200",
      description: "Technical architect specializing in scalable systems"
    },
    {
      name: "Mike Chen",
      role: "Lead Developer",
      image: "https://via.placeholder.com/200x200",
      description: "Full-stack developer with expertise in modern frameworks"
    },
    {
      name: "Emily Davis",
      role: "UI/UX Designer",
      image: "https://via.placeholder.com/200x200",
      description: "Creative designer focused on user experience"
    }
  ];

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Our Team</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <img 
                src={member.image} 
                alt={member.name}
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <p className="text-blue-600 font-medium mb-2">{member.role}</p>
              <p className="text-gray-600 text-sm">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;