import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  FolderPlus, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  BarChart3,
  CheckCircle,
  Clock,
  UserPlus,
  Github,
  LogOut,
  User,
  Lock,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

import { API_BASE_URL, getImageUrl } from '../config/api';

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  designation?: string;
  profilePicture?: string;
  isActive: boolean;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  category?: string;
  isActive: boolean;
  createdAt?: string;
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'projects' | 'contact'>('overview');
  
  // Stats
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    teamMembers: 0,
    recentProjects: [] as Project[]
  });
  
  // Home Page Stats (Our Achievements)
  const [showStatsEditor, setShowStatsEditor] = useState(false);
  const [homeStats, setHomeStats] = useState([
    { label: 'Projects Completed', value: 50, suffix: '+', color: 'from-emerald-500 to-green-600' },
    { label: 'Happy Clients', value: 25, suffix: '+', color: 'from-green-500 to-emerald-600' },
    { label: 'Years Experience', value: 5, suffix: '+', color: 'from-lime-500 to-emerald-600' },
    { label: 'Client Satisfaction', value: 100, suffix: '%', color: 'from-emerald-500 to-green-600' }
  ]);

  // Team Management
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    designation: '',
    profilePicture: null as File | null
  });
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 }); // For positioning (top/bottom/center)
  const [imageScale, setImageScale] = useState(100); // For zoom

  // Project Management
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    imageUrl: '',
    images: [] as File[],
    imagePreviews: [] as string[],
    githubUrl: '',
    category: ''
  });

  // Password/Username Change States
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showUsernameChange, setShowUsernameChange] = useState(false);
  const [showTeamMemberPasswordChange, setShowTeamMemberPasswordChange] = useState<string | null>(null);
  const [showTeamMemberUsernameChange, setShowTeamMemberUsernameChange] = useState<string | null>(null);
  const [passwordChangeData, setPasswordChangeData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [usernameChangeData, setUsernameChangeData] = useState({
    newName: '',
    newEmail: ''
  });
  const [teamPasswordData, setTeamPasswordData] = useState({
    userId: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [teamUsernameData, setTeamUsernameData] = useState({
    userId: '',
    newName: '',
    newEmail: ''
  });

  const [isLoading, setIsLoading] = useState(true);

  // Contact Management
  const [showContactEditor, setShowContactEditor] = useState(false);
  const [contactData, setContactData] = useState({
    email: 'info@metacodsar.com',
    phone: '+92 300 1234567',
    address: 'Pakistan',
    officeHours: 'Mon-Fri from 9am to 6pm'
  });

  useEffect(() => {
    fetchData();
    fetchHomeStats();
    fetchContactInfo();
    // Initialize username change form with current user data
    if (user) {
      setUsernameChangeData({ newName: user.name, newEmail: user.email });
    }
  }, [user]);
  
  const fetchHomeStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats`);
      if (response.ok) {
        const data = await response.json();
        if (data.stats && data.stats.length > 0) {
          setHomeStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching home stats:', error);
    }
  };

  const fetchContactInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`);
      if (response.ok) {
        const data = await response.json();
        setContactData({
          email: data.email || 'info@metacodsar.com',
          phone: data.phone || '+92 300 1234567',
          address: data.address || 'Pakistan',
          officeHours: data.officeHours || 'Mon-Fri from 9am to 6pm'
        });
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  const handleSaveContactInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contactData)
      });
      
      if (response.ok) {
        alert('✅ Contact information updated successfully!');
        setShowContactEditor(false);
        fetchContactInfo(); // Refresh to show updated info
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.message || 'Failed to update contact information'}`);
      }
    } catch (error: any) {
      console.error('Error saving contact info:', error);
      alert(`❌ Error: ${error.message || 'Failed to save contact information'}`);
    }
  };
  
  const handleSaveHomeStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/stats`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ stats: homeStats })
      });
      
      if (response.ok) {
        alert('✅ Stats updated successfully!');
        setShowStatsEditor(false);
        fetchHomeStats(); // Refresh to show updated stats
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.message || 'Failed to update stats'}`);
      }
    } catch (error: any) {
      console.error('Error saving stats:', error);
      alert(`❌ Error: ${error.message || 'Failed to save stats'}`);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch team members
      const teamResponse = await fetch(`${API_BASE_URL}/api/team`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (teamResponse.ok) {
        const teamData = await teamResponse.json();
        setTeamMembers(teamData);
        setStats(prev => ({ ...prev, teamMembers: teamData.length }));
      }

      // Fetch projects
      const projectsResponse = await fetch(`${API_BASE_URL}/api/projects`);
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
        const activeProjects = projectsData.filter((p: Project) => p.isActive);
        setStats(prev => ({ 
          ...prev, 
          totalProjects: projectsData.length,
          activeProjects: activeProjects.length,
          recentProjects: activeProjects.slice(-3).reverse()
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Team Member Functions
  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('❌ Authentication required. Please login again.');
        return;
      }

      // Validation
      if (!teamFormData.name.trim()) {
        alert('❌ Name is required!');
        return;
      }
      if (!teamFormData.email.trim()) {
        alert('❌ Email is required!');
        return;
      }
      if (!editingTeamMember && !teamFormData.password.trim()) {
        alert('❌ Password is required for new team members!');
        return;
      }

      const formData = new FormData();
      
      formData.append('name', teamFormData.name.trim());
      formData.append('email', teamFormData.email.trim());
      if (teamFormData.password.trim()) {
        formData.append('password', teamFormData.password);
      }
      if (teamFormData.phone.trim()) {
        formData.append('phone', teamFormData.phone.trim());
      }
      if (teamFormData.designation.trim()) {
        formData.append('designation', teamFormData.designation.trim());
      }
      if (teamFormData.profilePicture) {
        formData.append('profilePicture', teamFormData.profilePicture);
      }

      const url = editingTeamMember 
        ? `${API_BASE_URL}/api/team/${editingTeamMember._id}`
        : `${API_BASE_URL}/api/team`;
      
      const method = editingTeamMember ? 'PUT' : 'POST';

      console.log('Submitting team member:', { url, method, editingTeamMember: !!editingTeamMember });

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const responseData = await response.json();

      if (response.ok) {
        alert(`✅ ${editingTeamMember ? 'Team member updated' : 'Team member added'} successfully!`);
        setShowTeamForm(false);
        setEditingTeamMember(null);
        resetTeamForm();
        await fetchData();
      } else {
        console.error('Server error:', responseData);
        alert(`❌ Error: ${responseData.message || 'Failed to save team member'}`);
      }
    } catch (error: any) {
      console.error('Error saving team member:', error);
      alert(`❌ Error: ${error.message || 'Failed to save team member. Please check console for details.'}`);
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/team/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Team member removed successfully!');
        fetchData();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to remove team member');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      alert('Failed to remove team member');
    }
  };

  const handleEditTeamMember = (member: TeamMember) => {
    setEditingTeamMember(member);
    setTeamFormData({
      name: member.name,
      email: member.email,
      password: '',
      phone: member.phone || '',
      designation: member.designation || '',
      profilePicture: null
    });
    if (member.profilePicture) {
      const fullUrl = getImageUrl(member.profilePicture);
      setProfilePicturePreview(fullUrl);
    } else {
      setProfilePicturePreview(null);
    }
    setImagePosition({ x: 50, y: 50 });
    setImageScale(100);
    setShowTeamForm(true);
  };

  const resetTeamForm = () => {
    setTeamFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      designation: '',
      profilePicture: null
    });
    setEditingTeamMember(null);
    setProfilePicturePreview(null);
    setImagePosition({ x: 50, y: 50 });
    setImageScale(100);
  };

  // Project Functions
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('title', projectFormData.title);
      formData.append('description', projectFormData.description);
      formData.append('technologies', projectFormData.technologies);
      formData.append('githubUrl', projectFormData.githubUrl);
      formData.append('category', projectFormData.category);
      
      // Append multiple images
      if (projectFormData.images.length > 0) {
        projectFormData.images.forEach((image) => {
          formData.append('images', image);
        });
      } else if (projectFormData.imageUrl) {
        formData.append('imageUrl', projectFormData.imageUrl);
      }

      const url = editingProject 
        ? `${API_BASE_URL}/api/projects/${editingProject._id}`
        : `${API_BASE_URL}/api/projects`;
      
      const method = editingProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        alert(editingProject ? 'Project updated successfully!' : 'Project added successfully!');
        setShowProjectForm(false);
        setEditingProject(null);
        resetProjectForm();
        fetchData();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Project deleted successfully!');
        fetchData();
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    // Handle both old format (imageUrl) and new format (images array)
    const projectImages = (project as any).images && Array.isArray((project as any).images) && (project as any).images.length > 0
      ? (project as any).images
      : project.imageUrl ? [project.imageUrl] : [];
    
    setProjectFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      imageUrl: project.imageUrl || '',
      images: [],
      imagePreviews: projectImages.map((img: string) => getImageUrl(img)),
      githubUrl: project.githubUrl || '',
      category: project.category || 'web'
    });
    setShowProjectForm(true);
  };

  const resetProjectForm = () => {
    setProjectFormData({
      title: '',
      description: '',
      technologies: '',
      imageUrl: '',
      images: [],
      imagePreviews: [],
      githubUrl: '',
      category: 'web'
    });
    setEditingProject(null);
  };

  // Password/Username Change Functions
  const handleAdminPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (passwordChangeData.newPassword !== passwordChangeData.confirmPassword) {
        alert('❌ New passwords do not match!');
        return;
      }

      if (passwordChangeData.newPassword.length < 6) {
        alert('❌ Password must be at least 6 characters long!');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordChangeData.currentPassword,
          newPassword: passwordChangeData.newPassword
        })
      });

      if (response.ok) {
        alert('✅ Password changed successfully!');
        setShowPasswordChange(false);
        setPasswordChangeData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const error = await response.json();
        alert(`❌ ${error.message || 'Failed to change password'}`);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('❌ Failed to change password');
    }
  };

  const handleAdminUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: usernameChangeData.newName,
          email: usernameChangeData.newEmail
        })
      });

      if (response.ok) {
        alert('✅ Username/Email updated successfully!');
        setShowUsernameChange(false);
        setUsernameChangeData({ newName: '', newEmail: '' });
        fetchData();
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`❌ ${error.message || 'Failed to update username/email'}`);
      }
    } catch (error) {
      console.error('Error changing username:', error);
      alert('❌ Failed to update username/email');
    }
  };

  const handleTeamMemberPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (teamPasswordData.newPassword !== teamPasswordData.confirmPassword) {
        alert('❌ New passwords do not match!');
        return;
      }

      if (teamPasswordData.newPassword.length < 6) {
        alert('❌ Password must be at least 6 characters long!');
        return;
      }

      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('password', teamPasswordData.newPassword);

      const response = await fetch(`${API_BASE_URL}/api/team/${teamPasswordData.userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        alert('✅ Team member password changed successfully!');
        setShowTeamMemberPasswordChange(null);
        setTeamPasswordData({ userId: '', newPassword: '', confirmPassword: '' });
      } else {
        const error = await response.json();
        alert(`❌ ${error.message || 'Failed to change password'}`);
      }
    } catch (error) {
      console.error('Error changing team password:', error);
      alert('❌ Failed to change password');
    }
  };

  const handleTeamMemberUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', teamUsernameData.newName);
      formData.append('email', teamUsernameData.newEmail);

      const response = await fetch(`${API_BASE_URL}/api/team/${teamUsernameData.userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        alert('✅ Team member username/email updated successfully!');
        setShowTeamMemberUsernameChange(null);
        setTeamUsernameData({ userId: '', newName: '', newEmail: '' });
        fetchData();
      } else {
        const error = await response.json();
        alert(`❌ ${error.message || 'Failed to update username/email'}`);
      }
    } catch (error) {
      console.error('Error changing team username:', error);
      alert('❌ Failed to update username/email');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 shadow-xl border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">Admin Dashboard</h1>
              <p className="text-sm sm:text-base text-emerald-100 font-medium">Welcome, {user?.name || 'Admin'}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowUsernameChange(true)}
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 border border-white/30 transition-all duration-300 shadow-lg text-sm sm:text-base"
              >
                <User size={16} />
                <span className="hidden sm:inline">Change Username</span>
                <span className="sm:hidden">Username</span>
              </button>
              <button
                onClick={() => setShowPasswordChange(true)}
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 border border-white/30 transition-all duration-300 shadow-lg text-sm sm:text-base"
              >
                <Settings size={16} />
                <span className="hidden sm:inline">Change Password</span>
                <span className="sm:hidden">Password</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-red-500/90 text-white rounded-xl hover:bg-red-600 border border-red-400 transition-all duration-300 shadow-lg text-sm sm:text-base"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 sm:mb-8 overflow-hidden">
          <div className="flex flex-wrap border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 min-w-[50%] sm:min-w-0 px-3 sm:px-6 py-3 sm:py-4 text-center font-semibold transition-all text-sm sm:text-base ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50'
              }`}
            >
              <BarChart3 className="inline-block mr-1 sm:mr-2" size={18} />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`flex-1 min-w-[50%] sm:min-w-0 px-3 sm:px-6 py-3 sm:py-4 text-center font-semibold transition-all text-sm sm:text-base ${
                activeTab === 'team'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50'
              }`}
            >
              <Users className="inline-block mr-1 sm:mr-2" size={18} />
              <span className="hidden sm:inline">Team ({teamMembers.length})</span>
              <span className="sm:hidden">Team</span>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 min-w-[50%] sm:min-w-0 px-3 sm:px-6 py-3 sm:py-4 text-center font-semibold transition-all text-sm sm:text-base ${
                activeTab === 'projects'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50'
              }`}
            >
              <FolderPlus className="inline-block mr-1 sm:mr-2" size={18} />
              <span className="hidden sm:inline">Projects ({projects.length})</span>
              <span className="sm:hidden">Projects</span>
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex-1 min-w-[50%] sm:min-w-0 px-3 sm:px-6 py-3 sm:py-4 text-center font-semibold transition-all text-sm sm:text-base ${
                activeTab === 'contact'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50'
              }`}
            >
              <Mail className="inline-block mr-1 sm:mr-2" size={18} />
              <span className="hidden sm:inline">Contact</span>
              <span className="sm:hidden">Contact</span>
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">Total Projects</p>
                    <p className="text-4xl font-bold">{stats.totalProjects}</p>
                  </div>
                  <FolderPlus size={48} className="opacity-80" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium mb-1">Active Projects</p>
                    <p className="text-4xl font-bold">{stats.activeProjects}</p>
                  </div>
                  <CheckCircle size={48} className="opacity-80" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium mb-1">Team Members</p>
                    <p className="text-4xl font-bold">{stats.teamMembers}</p>
                  </div>
                  <Users size={48} className="opacity-80" />
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="mr-2" size={24} />
                Recent Projects
              </h2>
              <div className="space-y-4">
                {stats.recentProjects.length > 0 ? (
                  stats.recentProjects.map((project) => (
                    <div key={project._id} className="border-l-4 border-green-500 pl-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <h3 className="font-semibold text-gray-900">{project.title}</h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies.slice(0, 3).map((tech, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FolderPlus size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No projects yet. Add your first project!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Home Page Stats Editor */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <BarChart3 className="mr-2" size={24} />
                  Our Achievements (Home Page)
                </h2>
                <button
                  onClick={() => setShowStatsEditor(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg"
                >
                  <Edit size={18} />
                  <span>Edit Stats</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {homeStats.map((stat, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}{stat.suffix}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => { setActiveTab('projects'); setShowProjectForm(true); }}
                  className="flex items-center justify-center space-x-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <FolderPlus size={24} />
                  <span className="font-semibold">Add New Project</span>
                </button>
                <button
                  onClick={() => { setActiveTab('team'); setShowTeamForm(true); }}
                  className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <UserPlus size={24} />
                  <span className="font-semibold">Add Team Member</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Team Management Tab */}
        {activeTab === 'team' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
              <button
                onClick={() => { resetTeamForm(); setShowTeamForm(true); }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg"
              >
                <Plus size={20} />
                <span>Add Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div key={member._id} className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      {member.profilePicture ? (
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-emerald-500 shadow-lg">
                          <img
                            src={getImageUrl(member.profilePicture)}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">${member.name.charAt(0).toUpperCase()}</div>`;
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-emerald-300">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setTeamUsernameData({ userId: member._id, newName: member.name, newEmail: member.email });
                          setShowTeamMemberUsernameChange(member._id);
                        }}
                        className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                        title="Change Username/Email"
                      >
                        <User size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setTeamPasswordData({ userId: member._id, newPassword: '', confirmPassword: '' });
                          setShowTeamMemberPasswordChange(member._id);
                        }}
                        className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors"
                        title="Change Password"
                      >
                        <Settings size={16} />
                      </button>
                      <button
                        onClick={() => handleEditTeamMember(member)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTeamMember(member._id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-emerald-600 font-semibold text-sm mb-2">{member.designation || 'Team Member'}</p>
                  <p className="text-gray-600 text-sm mb-1 flex items-center">
                    <span className="mr-2">📧</span>
                    {member.email}
                  </p>
                  {member.phone && (
                    <p className="text-gray-600 text-sm flex items-center">
                      <span className="mr-2">📞</span>
                      {member.phone}
                    </p>
                  )}
                </div>
              ))}
              
              {teamMembers.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Users size={64} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 text-lg">No team members yet</p>
                  <button
                    onClick={() => { resetTeamForm(); setShowTeamForm(true); }}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg"
                  >
                    Add First Member
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Management Tab */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Mail className="mr-2" size={24} />
                Contact Information
              </h2>
              <button
                onClick={() => setShowContactEditor(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg"
              >
                <Edit size={18} />
                <span>Edit Contact Info</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <Mail className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Email</h3>
                </div>
                <p className="text-gray-700 font-semibold">{contactData.email}</p>
                <p className="text-sm text-gray-500 mt-2">Send us an email anytime</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <Phone className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Phone</h3>
                </div>
                <p className="text-gray-700 font-semibold">{contactData.phone}</p>
                <p className="text-sm text-gray-500 mt-2">{contactData.officeHours}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Address</h3>
                </div>
                <p className="text-gray-700 font-semibold">{contactData.address}</p>
                <p className="text-sm text-gray-500 mt-2">Come say hello at our office</p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Preview</h3>
              <p className="text-sm text-gray-600 mb-4">Yeh information Contact page aur Footer mein dikhegi:</p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="text-emerald-600" size={20} />
                  <span className="text-gray-700">{contactData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="text-emerald-600" size={20} />
                  <span className="text-gray-700">{contactData.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-emerald-600" size={20} />
                  <span className="text-gray-700">{contactData.address}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Management Tab */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
              <button
                onClick={() => { resetProjectForm(); setShowProjectForm(true); }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg"
              >
                <Plus size={20} />
                <span>Add Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.filter(p => p.isActive).map((project) => (
                <div key={project._id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
                  {project.imageUrl && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img 
                        src={getImageUrl(project.imageUrl)}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center"><svg class="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project._id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                    {project.imageUrl && (
                      <div className="mb-4">
                        <img 
                          src={getImageUrl(project.imageUrl)} 
                          alt={project.title}
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x225/4F46E5/FFFFFF?text=${encodeURIComponent(project.title)}`;
                          }}
                        />
                      </div>
                    )}
                    <div className="flex space-x-2">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm">
                          <Github size={16} />
                          <span>View Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {projects.filter(p => p.isActive).length === 0 && (
                <div className="col-span-full text-center py-12">
                  <FolderPlus size={64} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 text-lg">No projects yet</p>
                  <button
                    onClick={() => { resetProjectForm(); setShowProjectForm(true); }}
                    className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                  >
                    Add First Project
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Team Member Form Modal */}
      {showTeamForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingTeamMember ? 'Edit Team Member' : 'Add Team Member'}
                </h3>
                <button
                  onClick={() => { setShowTeamForm(false); resetTeamForm(); }}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleTeamSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={teamFormData.name}
                  onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={teamFormData.email}
                  onChange={(e) => setTeamFormData({ ...teamFormData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password {editingTeamMember ? '(leave blank to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  required={!editingTeamMember}
                  value={teamFormData.password}
                  onChange={(e) => setTeamFormData({ ...teamFormData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={teamFormData.phone}
                  onChange={(e) => setTeamFormData({ ...teamFormData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Designation</label>
                <input
                  type="text"
                  value={teamFormData.designation}
                  onChange={(e) => setTeamFormData({ ...teamFormData, designation: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setTeamFormData({ ...teamFormData, profilePicture: file });
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setProfilePicturePreview(reader.result as string);
                        // Image editor will show when profilePicturePreview is set
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                
                {/* Image Preview with Editor */}
                {profilePicturePreview && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <div className="text-center mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Preview & Adjust</h4>
                      <p className="text-xs text-gray-500 mb-3">Image will be displayed in a circle</p>
                      
                      {/* Circular Preview */}
                      <div className="relative inline-block">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500 shadow-lg">
                          <img
                            src={profilePicturePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            style={{
                              objectPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                              transform: `scale(${imageScale / 100})`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Image Controls */}
                    <div className="space-y-3 mt-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Vertical Position: {imagePosition.y}%
                        </label>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => setImagePosition({ ...imagePosition, y: 20 })}
                            className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-xs font-medium"
                          >
                            ↑ Top
                          </button>
                          <button
                            type="button"
                            onClick={() => setImagePosition({ ...imagePosition, y: 50 })}
                            className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-xs font-medium"
                          >
                            • Center
                          </button>
                          <button
                            type="button"
                            onClick={() => setImagePosition({ ...imagePosition, y: 80 })}
                            className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-xs font-medium"
                          >
                            ↓ Bottom
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Zoom: {imageScale}%
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="150"
                          value={imageScale}
                          onChange={(e) => setImageScale(Number(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Smaller</span>
                          <span>Larger</span>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setProfilePicturePreview(null);
                          setTeamFormData({ ...teamFormData, profilePicture: null });
                          setImagePosition({ x: 50, y: 50 });
                          setImageScale(100);
                        }}
                        className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowTeamForm(false); resetTeamForm(); }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center justify-center space-x-2"
                >
                  <Save size={20} />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Form Modal */}
      {showProjectForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h3>
                <button
                  onClick={() => { setShowProjectForm(false); resetProjectForm(); }}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleProjectSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title *</label>
                <input
                  type="text"
                  required
                  value={projectFormData.title}
                  onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={projectFormData.description}
                  onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Technologies (comma separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="React, Node.js, MongoDB"
                  value={projectFormData.technologies}
                  onChange={(e) => setProjectFormData({ ...projectFormData, technologies: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Images (Optional - Multiple)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      const newImages = [...projectFormData.images, ...files];
                      setProjectFormData({ ...projectFormData, images: newImages, imageUrl: '' });
                      
                      // Create previews for all images
                      const previewPromises = files.map((file) => {
                        return new Promise<string>((resolve) => {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            resolve(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        });
                      });
                      
                      Promise.all(previewPromises).then((newPreviews) => {
                        setProjectFormData(prev => ({ 
                          ...prev, 
                          imagePreviews: [...prev.imagePreviews, ...newPreviews] 
                        }));
                      });
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">You can upload multiple images. Works on mobile and laptop.</p>
                
                {projectFormData.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Selected Images ({projectFormData.images.length}):</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {projectFormData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={projectFormData.imagePreviews[index] || URL.createObjectURL(image)} 
                            alt={`Preview ${index + 1}`} 
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = projectFormData.images.filter((_, i) => i !== index);
                              const newPreviews = projectFormData.imagePreviews.filter((_, i) => i !== index);
                              setProjectFormData({ ...projectFormData, images: newImages, imagePreviews: newPreviews });
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Or Image URL (Optional)</label>
                <input
                  type="url"
                  value={projectFormData.imageUrl}
                  onChange={(e) => {
                    setProjectFormData({ ...projectFormData, imageUrl: e.target.value, images: [], imagePreviews: [] });
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Alternative: Use image URL instead of uploading</p>
                {projectFormData.imageUrl && projectFormData.images.length === 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Preview:</p>
                    <img 
                      src={projectFormData.imageUrl} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <input
                  type="text"
                  required
                  value={projectFormData.category}
                  onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                  placeholder="e.g., Web Development, Mobile App, Cloud Solutions, AI/ML, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">Enter any category name</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={projectFormData.githubUrl}
                    onChange={(e) => setProjectFormData({ ...projectFormData, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowProjectForm(false); resetProjectForm(); }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
                >
                  <Save size={20} />
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Password Change Modal */}
      {showPasswordChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                <button
                  onClick={() => {
                    setShowPasswordChange(false);
                    setPasswordChangeData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <form onSubmit={handleAdminPasswordChange} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password *</label>
                <input
                  type="password"
                  required
                  value={passwordChangeData.currentPassword}
                  onChange={(e) => setPasswordChangeData({ ...passwordChangeData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password *</label>
                <input
                  type="password"
                  required
                  value={passwordChangeData.newPassword}
                  onChange={(e) => setPasswordChangeData({ ...passwordChangeData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={passwordChangeData.confirmPassword}
                  onChange={(e) => setPasswordChangeData({ ...passwordChangeData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordChange(false);
                    setPasswordChangeData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all flex items-center justify-center space-x-2"
                >
                  <Lock size={20} />
                  <span>Change Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Username Change Modal */}
      {showUsernameChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Change Username/Email</h3>
                <button
                  onClick={() => {
                    setShowUsernameChange(false);
                    setUsernameChangeData({ newName: user?.name || '', newEmail: user?.email || '' });
                  }}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <form onSubmit={handleAdminUsernameChange} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Name *</label>
                <input
                  type="text"
                  required
                  value={usernameChangeData.newName}
                  onChange={(e) => setUsernameChangeData({ ...usernameChangeData, newName: e.target.value })}
                  placeholder={user?.name || 'Enter name'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Email *</label>
                <input
                  type="email"
                  required
                  value={usernameChangeData.newEmail}
                  onChange={(e) => setUsernameChangeData({ ...usernameChangeData, newEmail: e.target.value })}
                  placeholder={user?.email || 'Enter email'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUsernameChange(false);
                    setUsernameChangeData({ newName: user?.name || '', newEmail: user?.email || '' });
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
                >
                  <User size={20} />
                  <span>Update</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Member Password Change Modal */}
      {showTeamMemberPasswordChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Change Team Member Password</h3>
                <button
                  onClick={() => {
                    setShowTeamMemberPasswordChange(null);
                    setTeamPasswordData({ userId: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <form onSubmit={handleTeamMemberPasswordChange} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password *</label>
                <input
                  type="password"
                  required
                  value={teamPasswordData.newPassword}
                  onChange={(e) => setTeamPasswordData({ ...teamPasswordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={teamPasswordData.confirmPassword}
                  onChange={(e) => setTeamPasswordData({ ...teamPasswordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowTeamMemberPasswordChange(null);
                    setTeamPasswordData({ userId: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-all flex items-center justify-center space-x-2"
                >
                  <Lock size={20} />
                  <span>Change Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Member Username Change Modal */}
      {showTeamMemberUsernameChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Change Team Member Username/Email</h3>
                <button
                  onClick={() => {
                    setShowTeamMemberUsernameChange(null);
                    setTeamUsernameData({ userId: '', newName: '', newEmail: '' });
                  }}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <form onSubmit={handleTeamMemberUsernameChange} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Name *</label>
                <input
                  type="text"
                  required
                  value={teamUsernameData.newName}
                  onChange={(e) => setTeamUsernameData({ ...teamUsernameData, newName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Email *</label>
                <input
                  type="email"
                  required
                  value={teamUsernameData.newEmail}
                  onChange={(e) => setTeamUsernameData({ ...teamUsernameData, newEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowTeamMemberUsernameChange(null);
                    setTeamUsernameData({ userId: '', newName: '', newEmail: '' });
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all flex items-center justify-center space-x-2"
                >
                  <User size={20} />
                  <span>Update</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Info Editor Modal */}
      {showContactEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Mail className="mr-2" size={24} />
                  Edit Contact Information
                </h3>
                <button
                  onClick={() => setShowContactEditor(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <form onSubmit={handleSaveContactInfo} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Mail className="mr-2" size={18} />
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  placeholder="info@metacodsar.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">Yeh email Contact page aur Footer mein dikhegi</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Phone className="mr-2" size={18} />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  placeholder="+92 300 1234567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">Format: +92 300 1234567</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <MapPin className="mr-2" size={18} />
                  Address *
                </label>
                <input
                  type="text"
                  required
                  value={contactData.address}
                  onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                  placeholder="Pakistan"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">Office location ya country name</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Office Hours
                </label>
                <input
                  type="text"
                  value={contactData.officeHours}
                  onChange={(e) => setContactData({ ...contactData, officeHours: e.target.value })}
                  placeholder="Mon-Fri from 9am to 6pm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">Office timings (optional)</p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowContactEditor(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  <Save className="inline-block" size={18} />
                  <span>Save Contact Info</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Home Stats Editor Modal */}
      {showStatsEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Edit Our Achievements Stats</h3>
                <button
                  onClick={() => setShowStatsEditor(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveHomeStats(); }} className="p-6 space-y-6">
              {homeStats.map((stat, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Label *</label>
                      <input
                        type="text"
                        required
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...homeStats];
                          newStats[index].label = e.target.value;
                          setHomeStats(newStats);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Value *</label>
                      <input
                        type="number"
                        required
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...homeStats];
                          newStats[index].value = parseInt(e.target.value) || 0;
                          setHomeStats(newStats);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Suffix</label>
                      <input
                        type="text"
                        value={stat.suffix}
                        onChange={(e) => {
                          const newStats = [...homeStats];
                          newStats[index].suffix = e.target.value;
                          setHomeStats(newStats);
                        }}
                        placeholder="+, %, etc."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Color Gradient</label>
                      <select
                        value={stat.color}
                        onChange={(e) => {
                          const newStats = [...homeStats];
                          newStats[index].color = e.target.value;
                          setHomeStats(newStats);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="from-emerald-500 to-green-600">Emerald to Green</option>
                        <option value="from-green-500 to-emerald-600">Green to Emerald</option>
                        <option value="from-lime-500 to-emerald-600">Lime to Emerald</option>
                        <option value="from-emerald-400 to-green-500">Light Emerald to Green</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg"
                >
                  <Save className="inline-block mr-2" size={18} />
                  Save Stats
                </button>
                <button
                  type="button"
                  onClick={() => setShowStatsEditor(false)}
                  className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
