import { useState, useEffect } from 'react';
import { ExternalLink, Github, Calendar, User, Search, Eye, Code, Smartphone, Cloud } from 'lucide-react';

import { API_BASE_URL, getImageUrl } from '../config/api';

interface Project {
  _id?: string;
  id?: string | number;
  title: string;
  description: string;
  image?: string;
  imageUrl?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  teamMember?: string;
  createdAt?: string;
  category?: string;
  isActive?: boolean;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Projects', icon: Eye },
    { id: 'web', name: 'Web Development', icon: Code },
    { id: 'mobile', name: 'Mobile Apps', icon: Smartphone },
    { id: 'cloud', name: 'Cloud Solutions', icon: Cloud }
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/projects`);
      if (response.ok) {
        const data = await response.json();
        // Map API data to component format
        const formattedProjects = data.map((project: Project) => ({
          id: project._id || project.id,
          title: project.title,
          description: project.description,
          image: project.imageUrl 
            ? getImageUrl(project.imageUrl)
            : project.image || 'https://via.placeholder.com/400x225/4F46E5/FFFFFF?text=' + encodeURIComponent(project.title || 'Project'),
          technologies: Array.isArray(project.technologies) ? project.technologies : [],
          githubUrl: project.githubUrl || '',
          liveUrl: project.liveUrl || '',
          teamMember: project.teamMember || 'Team',
          createdAt: project.createdAt || new Date().toISOString(),
          category: project.category || 'web'
        }));
        setProjects(formattedProjects);
        setFilteredProjects(formattedProjects);
      } else {
        console.error('Failed to fetch projects');
        setProjects([]);
        setFilteredProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
      setFilteredProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = projects;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProjects(filtered);
  }, [projects, selectedCategory, searchTerm]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'web': return 'from-emerald-500 to-green-600';
      case 'mobile': return 'from-green-500 to-emerald-600';
      case 'cloud': return 'from-lime-500 to-emerald-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-20 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-6">Our Projects</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Explore our portfolio of innovative solutions that have helped businesses achieve their goals.
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <IconComponent size={18} />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Projects Found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div key={project.id} className="group">
                  <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                    {/* Project Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={project.image || 'https://via.placeholder.com/400x225/4F46E5/FFFFFF?text=Project'}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x225/4F46E5/FFFFFF?text=${encodeURIComponent(project.title || 'Project')}`;
                        }}
                        alt={project.title || 'Project'}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(project.category || 'web')}`}>
                          {(project.category || 'web').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Project Meta */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-2">
                          <User size={16} />
                          <span>{project.teamMember}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} />
                          <span>{project.createdAt && typeof project.createdAt === 'string' ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                          <Github size={18} />
                          <span>Code</span>
                        </a>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                        >
                          <ExternalLink size={18} />
                          <span>Live</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-6">Have a Project in Mind?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Let's work together to bring your ideas to life with cutting-edge technology and innovative solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Your Project
            </button>
            <button className="border-2 border-emerald-500 text-emerald-400 px-8 py-3 rounded-xl font-semibold hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-lg">
              View Our Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;