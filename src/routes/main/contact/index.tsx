import { useState } from "react"
import { MapPin } from "lucide-react"
import ic_phone from "@/assets/ic_phone.png"
import ic_mail from "@/assets/ic_mail.png"
import icons_insta from "@/assets/icons_insta.png"

const contactDetails = [
  {
    icon: MapPin,
    lines: ["119, Jimoh Cliff Street, Lekki, Lagos Nigeria."],
  },
  {
    iconSrc: ic_phone,
    lines: ["+234 8187038043. +234 803916692, +234 805 534 0408, +447031885358"],
  },
  {
    iconSrc: ic_mail,
    lines: ["info@dominicegbukwusoccerafrica.com, soccerafrica2000@yahoo.com"],
  },
  {
    iconSrc: icons_insta,
    lines: ["udesportsmanagementltd"],
  },
]

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  })
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please fill in your name, email, and message.")
      return
    }

    // TODO: wire to a real backend endpoint (send via Brevo, per EMAIL_OWNER env var)
    // once contact-form submission is added on the server. Mocked for now.
    console.log("Contact form submitted:", formData)
    setSubmitted(true)
    setFormData({ fullName: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="w-full px-5 lg:px-16 py-14 container mx-auto bg-white dark:bg-black transition-colors duration-300">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-5">
        {/* Left — Let's Talk */}
        <div className="flex flex-col gap-5 w-full lg:max-w-[662px]">
          <div className="flex flex-col gap-2 w-full lg:max-w-[379px]">
            <div className="bg-[#00D46A4D] flex items-center justify-center gap-2 rounded-full px-4 py-2 w-fit">
              <span className="bg-[#00D46A] w-2 h-2 rounded-full"></span>
              <p className="font-manrope font-bold text-[16px] leading-[1.3] text-[#00A553]">
                Reach out to Us
              </p>
            </div>

            <h1 className="font-bebas text-[clamp(44px,6vw,64px)] leading-[1.08] text-[#060A0F] dark:text-white">
              let&rsquo;s talk
            </h1>
          </div>

          <p className="font-manrope font-medium text-[18px] leading-[27px] text-[#8E8E8E] dark:text-gray-400">
            Whether you're a scout, a parent, a player, or a club
            representative — we'd love to hear from you.
          </p>

          <div className="flex flex-col gap-4 mt-2">
            {contactDetails.map(({ icon: Icon, iconSrc, lines }, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-[55px] h-[53px] rounded-2xl bg-[#00D46A] flex items-center justify-center flex-shrink-0 p-2">
                  {Icon ? (
                    <Icon className="w-8 h-8 text-white" />
                  ) : (
                    <img src={iconSrc} alt="" className="w-8 h-8 object-contain" />
                  )}
                </div>
                <div>
                  {lines.map((line, j) => (
                    <p key={j} className="font-manrope font-medium text-[18px] leading-[27px] text-[#8E8E8E] dark:text-gray-400">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Send a Message */}
        <div className="flex flex-col gap-6 w-full lg:max-w-[623px]">
          <h2 className="font-bebas text-[clamp(44px,6vw,64px)] leading-[1.08] text-[#060A0F] dark:text-white">
            Send a message
          </h2>

          {submitted ? (
            <div className="border border-[#00D46A] bg-[#00D46A1A] p-6">
              <p className="font-manrope font-bold text-[#060A0F] dark:text-white mb-1">
                Message sent
              </p>
              <p className="font-manrope text-[14px] leading-[21px] text-[#68717D] dark:text-gray-400">
                Thanks for reaching out — we'll get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label htmlFor="fullName" className="font-manrope text-[12px] leading-[1.4] text-[#1A1A1A] dark:text-gray-300">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Input Full Name"
                    className="w-full border border-[rgba(0,0,0,0.29)] dark:border-white/20 bg-transparent dark:bg-white/5 px-4 py-2.5 font-manrope text-[13px] leading-[18px] text-[#060A0F] dark:text-white placeholder:text-[rgba(0,0,0,0.32)] dark:placeholder:text-gray-500 focus:outline-none focus:border-[#00D46A] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <label htmlFor="email" className="font-manrope text-[12px] leading-[1.4] text-[#1A1A1A] dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="emailaddress@gmail.com"
                    className="w-full border border-[rgba(0,0,0,0.29)] dark:border-white/20 bg-transparent dark:bg-white/5 px-4 py-2.5 font-manrope text-[13px] leading-[18px] text-[#060A0F] dark:text-white placeholder:text-[rgba(0,0,0,0.32)] dark:placeholder:text-gray-500 focus:outline-none focus:border-[#00D46A] transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="font-manrope text-[12px] leading-[1.4] text-[#1A1A1A] dark:text-gray-300">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Transfer enquiry / Academy / General"
                  className="w-full border border-[rgba(0,0,0,0.29)] dark:border-white/20 bg-transparent dark:bg-white/5 px-4 py-3 font-manrope text-[13px] leading-[18px] text-[#060A0F] dark:text-white placeholder:text-[rgba(0,0,0,0.32)] dark:placeholder:text-gray-500 focus:outline-none focus:border-[#00D46A] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="font-manrope text-[12px] leading-[1.4] text-[#1A1A1A] dark:text-gray-300">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your enquiry..."
                  className="w-full border border-[rgba(0,0,0,0.29)] dark:border-white/20 bg-transparent dark:bg-white/5 px-4 py-3 font-manrope text-[13px] leading-[18px] text-[#060A0F] dark:text-white placeholder:text-[rgba(0,0,0,0.32)] dark:placeholder:text-gray-500 focus:outline-none focus:border-[#00D46A] transition-colors resize-none"
                />
              </div>

              {error && (
                <p className="text-[#DC2626] text-[13px] font-manrope">{error}</p>
              )}

              <button
                type="submit"
                className="w-fit min-w-41 h-11.25 px-3 bg-[#00D46A] rounded-md text-white font-manrope font-medium text-[14px] leading-[21px] flex items-center justify-center transition-all duration-200 shadow-[0_-1px_0_0_#38FF9C,1px_0_0_0_#38FF9C,-1px_0_0_0_#38FF9C] hover:bg-[#00c45e] hover:shadow-[0_-1px_0_0_#38FF9C,1px_0_0_0_#38FF9C,-1px_0_0_0_#38FF9C,0_4px_12px_rgba(0,212,106,0.3)] active:scale-95 cursor-pointer"
              >
                Contact Us
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Contact

