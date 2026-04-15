import { useState } from "react"
import { useForm } from "react-hook-form"
import { CheckCircle, XCircle } from "lucide-react"
import { Button } from "../../components/common/Button"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../../firebase/config"

export default function Contact() {
  const [formStatus, setFormStatus] = useState(null) // 'success' | 'error' | null
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const onSubmit = async (data) => {
    setSubmitting(true)
    setFormStatus(null)
    try {
      await addDoc(collection(db, "contacts"), {
        name: data.name,
        email: data.email,
        subject: data.subject || "",
        message: data.message,
        status: "unread",
        createdAt: serverTimestamp(),
      })
      setFormStatus("success")
      reset()
    } catch (error) {
      console.error("Error submitting contact form:", error)
      setFormStatus("error")
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyles = "w-full bg-white rounded-xl border border-[#9F9F9F] focus:border-[#B88E2F] text-[16px] outline-none text-[#333333] py-3 px-4 transition-all duration-200";

  return (
    <main id="page-4" className="mt-16 md:mt-20 bg-white">

      <div className="bg-[#F9F1E7] relative h-[316px] flex flex-col items-center justify-center bg-[url('/src/Images/Common/bg.jpg')] bg-cover bg-center backdrop-blur-lg">
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="relative z-10 text-center">
            <h1 className="text-[48px] font-bold text-black">Contact</h1>
            <div className="flex items-center gap-2 justify-center text-[16px]">
               <span className="font-bold">Home</span>
               <span className="font-bold">{">"}</span>
               <span className="font-medium text-[#333333]">Contact</span>
            </div>
        </div>
      </div>

      <section className="w-full max-w-7xl mx-auto px-4 md:px-32 lg:px-32 py-16 md:py-24">
        <div className="flex flex-col items-center justify-center text-center space-y-4 mb-16">
          <h1 className="text-[36px] font-bold text-[#333333]">Get In Touch With Us</h1>
          <div className="w-full max-w-[644px] text-center">
            <p className="text-[16px] text-[#9F9F9F]">
              For more information about our product & services, please feel free to drop us an email. Our staff will
              always be there to help you out. Do not hesitate!
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Info Side */}
          <div className="lg:w-1/3 space-y-8">
            <div className="flex items-start gap-6">
              <div className="mt-1">
                <svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 0C4.925 0 0 4.925 0 11C0 19.25 11 28 11 28C11 28 22 19.25 22 11C22 4.925 17.075 0 11 0ZM11 15C8.791 15 7 13.209 7 11C7 8.791 8.791 7 11 7C13.209 7 15 8.791 15 11C15 13.209 13.209 15 11 15Z" fill="black"/>
                </svg>
              </div>
              <div>
                <h3 className="text-[24px] font-bold text-[#333333]">Address</h3>
                <p className="text-[16px] text-[#333333]">236 5th SE Avenue, New York NY10000, United States</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="mt-1">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16.92V18.92C21.0011 19.1985 20.9441 19.4741 20.8325 19.7291C20.7209 19.9841 20.5573 20.2131 20.3521 20.4013C20.1468 20.5895 19.9046 20.7329 19.6409 20.8222C19.3773 20.9115 19.0978 20.9448 18.82 20.92C15.7428 20.5856 12.787 19.5342 10.19 17.85C7.77381 16.3147 5.72532 14.2662 4.18999 11.85C2.49997 9.24129 1.44824 6.27109 1.11999 3.18C1.09524 2.90317 1.1281 2.62453 1.21633 2.36162C1.30455 2.0987 1.44622 1.85719 1.63189 1.65251C1.81756 1.44782 2.04313 1.28441 2.29369 1.17296C2.54425 1.06151 2.81422 1.00445 3.08699 1.005H5.08699C5.57425 1.00006 6.04581 1.18182 6.40455 1.51278C6.7633 1.84373 6.98394 2.30007 7.01999 2.79C7.08745 3.76632 7.23724 4.7336 7.466 5.68C7.6046 6.25585 7.56708 6.85827 7.35899 7.41C7.15091 7.96173 6.78187 8.43743 6.29999 8.77L5.45699 9.36C6.88414 11.8688 8.95115 13.9358 11.46 15.363L12.3 14.52C12.6326 14.0381 13.1083 13.6691 13.66 13.461C14.2117 13.2529 14.8141 13.2154 15.39 13.354C16.3364 13.5828 17.3037 13.7326 18.28 13.8C18.775 13.8354 19.2319 14.0587 19.5589 14.4221C19.8858 14.7856 20.0592 15.2601 20.044 15.744L20.044 17.744C20.044 17.744 20.044 17.744 21 16.924V16.92Z" fill="black"/>
                </svg>
              </div>
              <div>
                <h3 className="text-[24px] font-bold text-[#333333]">Phone</h3>
                <p className="text-[16px] text-[#333333]">Mobile: +(84) 546-6789</p>
                <p className="text-[16px] text-[#333333]">Hotline: +(84) 456-6789</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="mt-1">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C12 12.5523 11.5523 13 11 13C10.4477 13 10 12.5523 10 12C10 11.4477 10.4477 11 11 11C11.5523 11 12 11.4477 12 12Z" fill="black" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 6V11" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-[24px] font-bold text-[#333333]">Working Time</h3>
                <p className="text-[16px] text-[#333333]">Monday-Friday: 9:00 - 22:00</p>
                <p className="text-[16px] text-[#333333]">Saturday-Sunday: 9:00 - 21:00</p>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <form
            className="lg:w-2/3 space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
              <label htmlFor="name" className="text-[16px] font-semibold text-[#333333] ml-1">
                Your name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Abc"
                {...register("name", { required: "Name is required" })}
                className={inputStyles}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1 ml-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-4">
              <label htmlFor="email" className="text-[16px] font-semibold text-[#333333] ml-1">
                Email address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Abc@def.com"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className={inputStyles}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-4">
              <label htmlFor="subject" className="text-[16px] font-semibold text-[#333333] ml-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                placeholder="This is an optional"
                {...register("subject")}
                className={inputStyles}
              />
            </div>

            <div className="space-y-4">
              <label htmlFor="message" className="text-[16px] font-semibold text-[#333333] ml-1">
                Message
              </label>
              <textarea
                id="message"
                placeholder="Hi! i'd like to ask about"
                {...register("message", { required: "Message is required" })}
                className={`${inputStyles} h-32 resize-none`}
              ></textarea>
              {errors.message && <p className="text-xs text-red-500 mt-1 ml-1">{errors.message.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full md:w-[237px] h-14 rounded-sm text-[18px] font-bold"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>

            {formStatus === "success" && (
              <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-100 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-[14px] font-medium text-green-700">Message sent successfully!</p>
                  <p className="text-[12px] text-green-600">We have received your message and will get back to you shortly.</p>
                </div>
              </div>
            )}

            {formStatus === "error" && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-[14px] font-medium text-red-700">Failed to send message</p>
                  <p className="text-[12px] text-red-600">Please try again later.</p>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  )
}

