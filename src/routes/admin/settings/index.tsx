import { useState } from "react"
import { Eye, EyeOff, Trash2 } from "lucide-react"
import { toast as showApiErrorToast } from "react-toastify"
import { useMe, useUpdateProfile, useGetAdmins, useInviteAdmin, useDeleteAdmin } from "@/hooks/useApi"
import type { GrantableRole } from "@/services/Auth"

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  SUB_ADMIN: "Sub Admin",
}

export default function Settings() {
  const [siteTitle, setSiteTitle] = useState('UDE Sports Management')
  const [contactInfo, setContactInfo] = useState('+234')
  const [mail, setMail] = useState('info@udesports.com')
  const [instagram, setInstagram] = useState('')
  const [twitter, setTwitter] = useState('')

  const { data: meData } = useMe()
  const me = meData?.admin
  const updateProfileMutation = useUpdateProfile()

  // Seeded lazily from `me` on first render — by the time this page mounts
  // the admin is already logged in, so `me` is normally already in the
  // query cache. Using a lazy initializer (rather than an effect that
  // calls setState once `me` resolves) keeps this a single render.
  const [adminName, setAdminName] = useState(() => me?.name ?? '')
  const [adminEmail, setAdminEmail] = useState(() => me?.email ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [toast, setToast] = useState(false)
  const [adminErrors, setAdminErrors] = useState<Record<string, string>>({})
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function showToast() {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  function validateAdmin() {
    const newErrors: Record<string, string> = {}
    if (!adminName.trim()) newErrors.adminName = 'Admin name is required'
    if (!adminEmail.trim()) newErrors.adminEmail = 'Admin email is required'
    if (password && !currentPassword) newErrors.currentPassword = 'Enter your current password to set a new one'
    if (password && !confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (password && password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    return newErrors
  }

  async function handleAdminSave() {
    const newErrors = validateAdmin()
    if (Object.keys(newErrors).length > 0) {
      setAdminErrors(newErrors)
      return
    }
    setAdminErrors({})

    try {
      await updateProfileMutation.mutateAsync({
        name: adminName.trim(),
        email: adminEmail.trim(),
        ...(password ? { currentPassword, newPassword: password } : {}),
      })
      setCurrentPassword('')
      setPassword('')
      setConfirmPassword('')
      showToast()
    } catch (err) {
      setAdminErrors({ form: err instanceof Error ? err.message : 'Something went wrong. Please try again.' })
    }
  }

  // ---- Team (invite / list / delete) — Super Admin only ----
  const isSuperAdmin = me?.role === 'SUPER_ADMIN'
  const { data: admins, isLoading: adminsLoading, isError: adminsError } = useGetAdmins()
  const inviteMutation = useInviteAdmin()
  const deleteMutation = useDeleteAdmin()

  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<GrantableRole>('SUB_ADMIN')
  const [inviteError, setInviteError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)

  async function handleInvite() {
    if (!inviteName.trim() || !inviteEmail.trim()) {
      setInviteError('Name and email are both required')
      return
    }
    setInviteError('')
    try {
      const result = await inviteMutation.mutateAsync({
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
      })
      setInviteName('')
      setInviteEmail('')
      setInviteRole('SUB_ADMIN')
      if (!result.emailSent) {
        showApiErrorToast.warn("Admin created, but the invite email couldn't be sent right now — it's queued to retry automatically.")
      } else {
        showApiErrorToast.success(`Invite sent to ${result.admin.email}`)
      }
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  function confirmDeleteAdmin() {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => showApiErrorToast.success('Admin removed'),
      onError: (err) => showApiErrorToast.error(err instanceof Error ? err.message : "Couldn't remove this admin"),
    })
    setDeleteTarget(null)
  }

  return (
     <>
    <div className="p-6">
      {/* header */}
      <p className="text-sm font-medium text-green-500 mb-1">Communication</p>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SETTINGS</h1>
      <p className="text-sm text-gray-400 mt-0.5 mb-6">Manage site configuration, admin accounts, and display preferences</p>

      {/* Site Information */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6 mb-5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Site Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div className="flex flex-col gap-1.5">
             <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Site Title
          </label>
          <input type="text" value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} className="border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-500"/>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Contact Info</label>
            <input type="text" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} className="border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400"  />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Mail</label>
            <input type="email" value={mail} onChange={(e) => setMail(e.target.value)} className="border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Instagram</label>
              <input type="text" placeholder="Instagram Handle" value={instagram} onChange={(e) => setInstagram(e.target.value)}
                className="border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">X (Twitter)</label>
            <input type="text" placeholder="x.com/" value={twitter} onChange={(e) => setTwitter(e.target.value)} className="border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400" />
          </div>
        </div>
        <button onClick={showToast} className="bg-green-500 hover:bg-green-600 rounded-lg hover:text-white text-gray-900 text-sm font-medium px-5 py-2 transition-colors">
             Save Changes
        </button>
      </div>

      {/* Admin Account — your own profile */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6 mb-5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Admin Account</h2>
        <p className="text-xs text-gray-400 mb-4">Your own name, email, role, and password</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div className="flex flex-col gap-1.5">
           <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Admin Name</label>
           <input type="text" value={adminName} onChange={(e) => {setAdminName(e.target.value); setAdminErrors({...adminErrors, adminName: ""}) }}
           className={`border px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 ${adminErrors.adminName ? 'border-red-400' : 'border-gray-200 dark:border-white/15'}`} />
           {adminErrors.adminName && <p className="text-xs text-red-500">{adminErrors.adminName}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
           <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Admin Email</label>
           <input type="email" placeholder="email address" value={adminEmail} onChange={(e)=> {setAdminEmail(e.target.value); setAdminErrors({...adminErrors, adminEmail: ""})}}
           className={`border px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-400 ${adminErrors.adminEmail ? 'border-red-400' : 'border-gray-200 dark:border-white/15'}`} />
           {adminErrors.adminEmail && <p className="text-xs text-red-500">{adminErrors.adminEmail}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Role</label>
            <select disabled className="border border-gray-200 dark:border-white/15 px-3 py-2 rounded-lg text-sm text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 cursor-not-allowed focus:outline-none">
              <option>{me ? ROLE_LABEL[me.role] : "…"}</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Current Password</label>
           <div className="relative">
             <input type={showCurrentPassword ? "text" : "password"} placeholder="required to change password" value={currentPassword} onChange={(e)=>  {setCurrentPassword(e.target.value); setAdminErrors({...adminErrors, currentPassword: ""}) }}
                className={`w-full border px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-400 pr-10 ${adminErrors.currentPassword ? 'border-red-400' : 'border-gray-200 dark:border-white/15'}`} />
              <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                {showCurrentPassword ? <Eye size={15}/> : <EyeOff size={15}/>}
              </button>
           </div>
           {adminErrors.currentPassword && <p className="text-xs text-red-500">{adminErrors.currentPassword}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">New Password</label>
           <div className="relative">
             <input type={showPassword ? "text" : "password"} placeholder="leave blank to keep current" value={password} onChange={(e)=>  {setPassword(e.target.value); setAdminErrors({...adminErrors, password: ""}) }}
                className={`w-full border px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-400 pr-10 ${adminErrors.password ? 'border-red-400' : 'border-gray-200 dark:border-white/15'}`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                {showPassword? <Eye size={15}/> : <EyeOff size={15}/>}
              </button>
           </div>
             {adminErrors.password && <p className="text-xs text-red-500">{adminErrors.password}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Confirm New Password</label>
           <div className="relative">
             <input type={showConfirmPassword ? "text" : "password"} placeholder=".........." value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value); setAdminErrors({...adminErrors, confirmPassword: ""})}}
           className={`w-full border px-3 py-2 rounded-lg text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-green-400 pr-10 ${ adminErrors.confirmPassword ? 'border-red-400' : 'border-gray-200 dark:border-white/15'}`} />
           <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              {showConfirmPassword ? <Eye size={15} /> : <EyeOff size={15} />}
            </button>
           </div>
            {adminErrors.confirmPassword && <p className="text-xs text-red-500">{adminErrors.confirmPassword}</p>}
          </div>
        </div>
        {adminErrors.form && <p className="text-xs text-red-500 mb-3">{adminErrors.form}</p>}
        <button onClick={handleAdminSave} disabled={updateProfileMutation.isPending} className="bg-green-500 hover:bg-green-600 hover:text-white rounded-lg text-gray-900 text-sm font-medium px-5 py-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {updateProfileMutation.isPending ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Invite Admin Account — Super Admin only */}
      {isSuperAdmin && (
        <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Invite Admin Account</h2>
          <p className="text-xs text-gray-400 mb-4">
            You can grant Admin or Sub Admin access — Super Admin can't be assigned to anyone else.
          </p>

          {/* Invite form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-6 pb-6 border-b border-gray-100 dark:border-white/10">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Admin Name</label>
              <input type="text" placeholder="e.g. Chisom Dominic" value={inviteName}
                onChange={(e) => { setInviteName(e.target.value); setInviteError('') }}
                className="border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Admin Email</label>
              <input type="email" placeholder="email address" value={inviteEmail}
                onChange={(e) => { setInviteEmail(e.target.value); setInviteError('') }}
                className="border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Role</label>
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as GrantableRole)}
                className="border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400">
                <option value="SUB_ADMIN">Sub Admin</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button onClick={handleInvite} disabled={inviteMutation.isPending}
              className="bg-green-500 hover:bg-green-600 hover:text-white text-gray-900 text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {inviteMutation.isPending ? "Sending…" : "Send Invite"}
            </button>
          </div>
          {inviteError && <p className="text-xs text-red-500 -mt-4 mb-4">{inviteError}</p>}

          {/* Existing admins */}
          {adminsError && (
            <p className="text-sm text-red-500 mb-3">Couldn't load admins. Please refresh the page.</p>
          )}
          <div className="space-y-3">
            {adminsLoading ? (
              [0, 1].map((i) => (
                <div key={i} className="h-14 rounded-lg bg-gray-100 dark:bg-white/5 animate-pulse" />
              ))
            ) : !admins || admins.length === 0 ? (
              <p className="text-sm text-gray-400">No other admins yet — invite one above.</p>
            ) : (
              admins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between gap-4 border border-gray-100 dark:border-white/10 rounded-lg px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{admin.name}</p>
                    <p className="text-xs text-gray-400 truncate">{admin.email}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${admin.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                      {ROLE_LABEL[admin.role] ?? admin.role}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${admin.isActive ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-700'}`}>
                      {admin.isActive ? 'Active' : 'Invite Pending'}
                    </span>
                    {admin.id !== me?.id && admin.role !== 'SUPER_ADMIN' && (
                      <button
                        onClick={() => setDeleteTarget({ id: admin.id, name: admin.name })}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label={`Delete ${admin.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>

    {/* Toast */}
    {toast && (
      <div className="fixed bottom-6 right-6 bg-green-500 text-white text-xs font-medium px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
       <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-white">✓</div>
       <div>
         <p className="font-semibold">Changes Saved</p>
            <p className="opacity-80">Changes for task done saved</p>
       </div>
       <button onClick={() => setToast(false)} className="ml-2 text-white/70 hover:text-white">
         ✕
       </button>
      </div>
    )}

    {/* Delete admin confirmation modal */}
    {deleteTarget && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#0d1117] rounded-xl shadow-xl w-full max-w-md overflow-hidden border-2 border-red-500">
          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{deleteTarget.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
              Are you sure you want to <span className="font-semibold text-gray-900 dark:text-white">remove</span> this admin? They'll lose access immediately.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={confirmDeleteAdmin}
                disabled={deleteMutation.isPending}
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-10 py-1.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {deleteMutation.isPending ? "Removing…" : "Remove"}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 text-sm font-medium px-10 py-1.5 rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
   )
}

