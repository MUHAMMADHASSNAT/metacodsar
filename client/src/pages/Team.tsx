import { useState, useEffect } from 'react';
import { User, Github, Linkedin, Calendar, Award, Code, Smartphone, Cloud, Database, X } from 'lucide-react';

// Use proxy in development, full URL in production
const API_BASE_URL = import.meta.env.DEV ? '' : 'http://localhost:5001';

interface TeamMember {
  _id?: string;
  id?: string | number;
  name: string;
  designation?: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  projects?: number;
  joinedDate?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
  };
}

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/team`);
      if (response.ok) {
        const data = await response.json();
        // Map API data to component format
        const formattedMembers = data.map((member: TeamMember) => ({
          id: member._id || member.id,
          name: member.name,
          designation: member.designation || 'Team Member',
          email: member.email,
          phone: member.phone || 'N/A',
          profilePicture: member.profilePicture 
            ? (member.profilePicture.startsWith('http') ? member.profilePicture : `http://localhost:5001${member.profilePicture.startsWith('/') ? '' : '/'}${member.profilePicture}`)
            : `https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=${member.name.charAt(0).toUpperCase()}`,
          bio: member.bio || `${member.designation || 'Team Member'} at MetaCodsar. Passionate about technology and innovation.`,
          skills: member.skills || [],
          experience: member.experience || 'Experienced',
          projects: member.projects || 0,
          joinedDate: member.joinedDate || new Date().toISOString(),
          socialLinks: member.socialLinks || {}
        }));
        setTeamMembers(formattedMembers);
      } else {
        console.error('Failed to fetch team members');
        setTeamMembers([]);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSkillIcon = (skill: string) => {
    if (skill.toLowerCase().includes('react') || skill.toLowerCase().includes('web')) return Code;
    if (skill.toLowerCase().includes('mobile') || skill.toLowerCase().includes('ios') || skill.toLowerCase().includes('android')) return Smartphone;
    if (skill.toLowerCase().includes('cloud') || skill.toLowerCase().includes('aws') || skill.toLowerCase().includes('azure')) return Cloud;
    if (skill.toLowerCase().includes('database') || skill.toLowerCase().includes('sql') || skill.toLowerCase().includes('mongo')) return Database;
    return Code;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-20 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-6">Meet Our Team</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Our talented team of developers, designers, and engineers working together to deliver exceptional solutions.
          </p>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <User className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{teamMembers.length}</h3>
              <p className="text-gray-600 font-medium">Team Members</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{teamMembers.reduce((sum, member) => sum + (member.projects || 0), 0)}</h3>
              <p className="text-gray-600 font-medium">Projects Completed</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Calendar className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {teamMembers.length > 0 
                  ? Math.max(...teamMembers.map(m => parseInt(m.experience || '0') || 0)) + '+' 
                  : '0+'
                }
              </h3>
              <p className="text-gray-600 font-medium">Years Experience</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Code className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">15+</h3>
              <p className="text-gray-600 font-medium">Technologies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="group">
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                  {/* Profile Image - Circular */}
                  <div className="relative flex justify-center pt-8 pb-4">
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-indigo-500 shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                    <img
                      src={member.profilePicture}
                alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">${member.name.charAt(0).toUpperCase()}</div>`;
                            }
                          }}
                        />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex space-x-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                        {member.socialLinks?.github && (
                          <a
                            href={member.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                              className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors"
                          >
                            <Github className="text-white" size={16} />
                          </a>
                        )}
                        {member.socialLinks?.linkedin && (
                          <a
                            href={member.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                              className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                          >
                            <Linkedin className="text-white" size={16} />
                          </a>
                        )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors text-center">
                      {member.name}
                    </h3>
                    <p className="text-indigo-600 font-semibold mb-3 text-center">{member.designation}</p>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{member.bio}</p>

                    {/* Skills */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {(member.skills || []).slice(0, 4).map((skill, index) => {
                          const IconComponent = getSkillIcon(skill);
                          return (
                            <span
                              key={index}
                              className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              <IconComponent size={12} />
                              <span>{skill}</span>
                            </span>
                          );
                        })}
                        {(member.skills?.length || 0) > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{(member.skills?.length || 0) - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{member.experience}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award size={14} />
                        <span>{member.projects} projects</span>
                      </div>
                    </div>

                    {/* Contact Button */}
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
            </div>
          ))}
        </div>
      </div>
      </section>

      {/* Member Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 p-8 flex justify-center items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl">
              <img
                src={selectedMember.profilePicture}
                alt={selectedMember.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center text-indigo-600 text-6xl font-bold">${selectedMember.name.charAt(0).toUpperCase()}</div>`;
                    }
                  }}
                />
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white text-gray-700 shadow-lg transition-all hover:scale-110"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedMember.name}</h2>
              <p className="text-indigo-600 font-semibold text-lg mb-4">{selectedMember.designation}</p>
              <p className="text-gray-600 mb-6">{selectedMember.bio}</p>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Experience</h3>
                  <p className="text-gray-600">{selectedMember.experience}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Projects</h3>
                  <p className="text-gray-600">{selectedMember.projects} completed</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600">{selectedMember.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                  <p className="text-gray-600">{selectedMember.phone}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {(selectedMember.skills || []).map((skill, index) => {
                    const IconComponent = getSkillIcon(skill);
                    return (
                      <span
                        key={index}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-full"
                      >
                        <IconComponent size={16} />
                        <span>{skill}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex space-x-3">
                {selectedMember.socialLinks?.github && (
                  <a
                    href={selectedMember.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Github size={18} />
                    <span>GitHub</span>
                  </a>
                )}
                {selectedMember.socialLinks?.linkedin && (
                  <a
                    href={selectedMember.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Linkedin size={18} />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-6">Join Our Team</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            We're always looking for talented individuals to join our growing team. Let's build amazing things together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              View Open Positions
            </button>
            <button className="border-2 border-emerald-500 text-emerald-400 px-8 py-3 rounded-xl font-semibold hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-lg">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;