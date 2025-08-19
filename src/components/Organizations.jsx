import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, Users, MapPin, Globe, Phone } from 'lucide-react'
import { moneyballDatabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const Organizations = () => {
  const [organizations, setOrganizations] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingOrg, setEditingOrg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    contact_person: '',
    phone: '',
    email: '',
    website: '',
    services: '',
    notes: ''
  })

  useEffect(() => {
    loadOrganizations()
  }, [])

  const loadOrganizations = async () => {
    try {
      setLoading(true)
      const data = await moneyballDatabase.getOrganizations()
      setOrganizations(data || [])
    } catch (error) {
      toast.error('Failed to load organizations')
      console.error('Error loading organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingOrg) {
        await moneyballDatabase.updateOrganization(editingOrg.id, formData)
        toast.success('Organization updated successfully')
      } else {
        await moneyballDatabase.createOrganization(formData)
        toast.success('Organization created successfully')
      }
      setShowModal(false)
      setEditingOrg(null)
      resetForm()
      loadOrganizations()
    } catch (error) {
      toast.error('Failed to save organization')
      console.error('Error saving organization:', error)
    }
  }

  const handleEdit = (org) => {
    setEditingOrg(org)
    setFormData({
      name: org.name || '',
      type: org.type || '',
      location: org.location || '',
      contact_person: org.contact_person || '',
      phone: org.phone || '',
      email: org.email || '',
      website: org.website || '',
      services: org.services || '',
      notes: org.notes || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await moneyballDatabase.deleteOrganization(id)
        toast.success('Organization deleted successfully')
        loadOrganizations()
      } catch (error) {
        toast.error('Failed to delete organization')
        console.error('Error deleting organization:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      location: '',
      contact_person: '',
      phone: '',
      email: '',
      website: '',
      services: '',
      notes: ''
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="text-sm text-gray-500">Manage 211 organizations and service providers</p>
        </div>
        <button
          onClick={() => {
            setEditingOrg(null)
            resetForm()
            setShowModal(true)
          }}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </button>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <div key={org.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900 flex-1">
                {org.name}
              </h3>
              <div className="flex space-x-1 ml-2">
                <button
                  onClick={() => handleEdit(org)}
                  className="text-indigo-600 hover:text-indigo-900 p-1"
                  title="Edit Organization"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(org.id)}
                  className="text-red-600 hover:text-red-900 p-1"
                  title="Delete Organization"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              {org.type && (
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {org.type}
                </div>
              )}
              {org.location && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {org.location}
                </div>
              )}
              {org.website && (
                <div className="flex items-center text-sm text-gray-600">
                  <Globe className="h-4 w-4 mr-2" />
                  <a href={org.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Website
                  </a>
                </div>
              )}
              {org.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {org.phone}
                </div>
              )}
            </div>
            
            {org.services && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 line-clamp-2">{org.services}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {organizations.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first organization.</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            Add Organization
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <form onSubmit={handleSubmit} className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingOrg ? 'Edit Organization' : 'Add New Organization'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="input-field"
                    >
                      <option value="">Select type...</option>
                      <option value="Nonprofit">Nonprofit</option>
                      <option value="Government">Government</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Social Services">Social Services</option>
                      <option value="Educational">Educational</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                    <input
                      type="text"
                      value={formData.contact_person}
                      onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
                    <textarea
                      value={formData.services}
                      onChange={(e) => setFormData({...formData, services: e.target.value})}
                      rows={3}
                      className="input-field"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={2}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingOrg ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Organizations