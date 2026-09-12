// import React from 'react'
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function Settings() {
  const [siteTitle, setSiteTitle] = useState('UDE Sports Management')
  const [contactInfo, setContactInfo] = useState('+234')
  const [mail, setMail] = useState('info@udesports.com')
  const [instagram, setInstagram] = useState('')
  const [twitter, setTwitter] = useState('')

  const [adminName, setAdminName] = useState('domegbukwu')
  const [adminEmail, setAdminEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [toast, setToast] = useState(false)
  const [adminErrors, setAdminErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [inviteAdmins, setInviteAdmins] = useState([
  { name: 'admin name 1', email: '', role: 'Sub Admin' },
  { name: 'admin name 2', email: '', role: 'Sub Admin' },
])

   const [editingIndex, setEditingIndex] = useState<number | null>(null)
  function showToast() {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  function validateAdmin() {
    const newErrors: Record<string, string> = {}
    if (!adminName.trim()) newErrors.adminName = 'Admin name is required'
    if (!adminEmail.trim()) newErrors.adminEmail = 'Admin email is required'
    if (!password.trim()) newErrors.password = 'password is required'
    if (password && !confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    return newErrors
  }

  function resetAdminForm() {
  setAdminName('')
  setAdminEmail('')
  setPassword('')
  setConfirmPassword('')
  setAdminErrors({})
}

    function handleAdminSave() {
    const newErrors = validateAdmin()
    if (Object.keys(newErrors).length > 0) {
      setAdminErrors(newErrors)
      return
    }
    setAdminErrors({})
    resetAdminForm()
    showToast()
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

      {/* Admin Account */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6 mb-5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Admin Account</h2>
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
              <option>Super Admin</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Password</label>
           <div className="relative">
             <input type={showPassword ? "text" : "password"} placeholder="........" value={password} onChange={(e)=>  {setPassword(e.target.value); setAdminErrors({...adminErrors, password: ""}) }}
                className="w-full border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-400 pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                {showPassword? <Eye size={15}/> : <EyeOff size={15}/>}
              </button>
             {adminErrors.password && <p className="text-xs text-red-500">{adminErrors.password}</p>}
           </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Confirm Password</label>
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
        <button onClick={handleAdminSave} className="bg-green-500 hover:bg-green-600 hover:text-white rounded-lg text-gray-900 text-sm font-medium px-5 py-2 transition-colors">
          Save Changes
        </button>
      </div>

      {/* Invite Admin Account */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Invite Admin Account</h2>
        <div className="space-y-4">
          {
            inviteAdmins.map((admin, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Admin Name</label>
                  <input type="text" value={admin.name} disabled={editingIndex !== i} onChange={(e) => {const updated = [...inviteAdmins]; updated[i].name = e.target.value; setInviteAdmins(updated)}}
                   className={`border px-3 py-2 rounded-lg text-sm focus:outline-none ${editingIndex === i ? 'border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white' : 'border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500'}`} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Admin Email</label>
                  <input type="email" value={admin.email} disabled={editingIndex !== i} onChange={(e) => {const updated = [...inviteAdmins]; updated[i].email = e.target.value; setInviteAdmins(updated)}} placeholder="email address"
                  className={`border px-3 py-2 rounded-lg text-sm focus:outline-none ${editingIndex === i ? 'border-green-400 bg-white dark:bg-white/5 text-gray-900 dark:text-white' : 'border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500'}`}/>
                </div>
                <div className="flex flex-col gap-1.5">
                 <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Role</label>
                 <select value={admin.role} disabled={editingIndex !== i} onChange={(e) => {
                 const updated = [...inviteAdmins]; updated[i].role = e.target.value; setInviteAdmins(updated)}}
                 className={`border px-3 py-2 rounded-lg text-sm focus:outline-none ${editingIndex === i ? 'border-green-400 text-gray-600 dark:text-gray-300 bg-white dark:bg-white/5' : 'border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500'}`}>
                    <option>Sub Admin</option>
                    <option>Super Admin</option>
                 </select>
                </div>
                <div className="flex items-end gap-2 pb-0.5">
                  {editingIndex === i ? (
                    <button
                      onClick={() => { setEditingIndex(null); showToast() }}
                      className="text-xs text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors">
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingIndex(i)}
                      className="text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/15 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                      Edit
                    </button>
                  )}
                  <button className="text-xs text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
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
    </>
   )
}

