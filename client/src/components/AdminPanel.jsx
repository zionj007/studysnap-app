import { useState, useEffect } from 'react'

const AdminPanel = ({ user, onClose }) => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [upgradePlan, setUpgradePlan] = useState('PRO')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const getApiUrl = () => {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          return 'http://localhost:3001'
        }
        return 'https://studysnap-app.onrender.com'
      }

      const token = localStorage.getItem('studysnap_token')
      const response = await fetch(`${getApiUrl()}/api/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (response.ok) {
        setUsers(result.users)
      } else {
        setError(result.message || 'Failed to fetch users')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgradeUser = async (userId) => {
    try {
      const getApiUrl = () => {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          return 'http://localhost:3001'
        }
        return 'https://studysnap-app.onrender.com'
      }

      const token = localStorage.getItem('studysnap_token')
      const response = await fetch(`${getApiUrl()}/api/auth/upgrade`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUserId: userId,
          plan: upgradePlan
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Refresh users list
        fetchUsers()
        setSelectedUser(null)
        alert(`User upgraded to ${upgradePlan} plan successfully!`)
      } else {
        alert(result.message || 'Upgrade failed')
      }
    } catch (err) {
      alert('Network error: ' + err.message)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getPlanBadge = (plan, isPro) => {
    if (isPro) {
      return <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">⭐ {plan}</span>
    }
    return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">🆓 FREE</span>
  }

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">👑 ADMIN</span>
    }
    return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">👤 USER</span>
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">👑 Admin Panel</h2>
              <p className="text-red-100 text-sm">
                Manage users and premium upgrades
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-red-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-blue-800 text-sm">Total Users</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.isPro).length}
              </div>
              <div className="text-green-800 text-sm">Pro Users</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.role === 'admin').length}
              </div>
              <div className="text-purple-800 text-sm">Admins</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">
                {users.filter(u => !u.isPro && u.role !== 'admin').length}
              </div>
              <div className="text-orange-800 text-sm">Free Users</div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-4 py-3">
                        {getPlanBadge(user.plan, user.isPro)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div>Uploads: {user.usage?.uploads || 0}</div>
                          <div>Generations: {user.usage?.generations || 0}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        {user.role !== 'admin' && !user.isPro && (
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setUpgradePlan('PRO')
                            }}
                            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
                          >
                            Upgrade to Pro
                          </button>
                        )}
                        {user.isPro && user.role !== 'admin' && (
                          <span className="text-green-600 text-sm font-medium">✓ Pro Active</span>
                        )}
                        {user.role === 'admin' && (
                          <span className="text-red-600 text-sm font-medium">👑 Admin</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Upgrade Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Upgrade User to Pro</h3>
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  Upgrade <strong>{selectedUser.name}</strong> ({selectedUser.email}) to Pro plan?
                </p>
                <select
                  value={upgradePlan}
                  onChange={(e) => setUpgradePlan(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="PRO">Pro Plan</option>
                  <option value="PREMIUM">Premium Plan</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleUpgradeUser(selectedUser.id)}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Confirm Upgrade
                </button>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
