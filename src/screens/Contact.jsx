import { useState } from "react"
import { useForm } from "react-hook-form"
import { CheckCircle } from "lucide-react"

export default function Contact() {
  const [showModal, setShowModal] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const onSubmit = (data) => {
    console.log("Contact Form Data:", data)
    setShowModal(true)
    reset()
  }

  return (
    <main id="page-4" className="mt-16 md:mt-20">
      <section className="w-full">
        <div className="flex flex-col items-center justify-center text-center space-y-4 px-4 md:px-6">
          <div className="text-2xl md:text-3xl font-bold mt-12 md:mt-20">Get in touch with us</div>
          <div className="w-full max-w-[644px] text-center">
            <p className="text-sm md:text-base">
              For more information about our product & services, please feel free to drop us an email. Our staff will
              always be there to help you out. Do not hesitate!
            </p>
          </div>
        </div>

        <section className="text-gray-600 body-font relative">
          <div className="container px-4 md:px-5 py-12 md:py-24 mx-auto flex flex-col justify-center items-center lg:flex-row flex-wrap">
            <div className="lg:w-2/3 md:w-full bg-gray-300 rounded-lg overflow-hidden p-4 md:p-10 flex items-end justify-start relative h-[300px] md:h-[400px] lg:h-[500px] lg:mr-10">
              <iframe
                width="100%"
                height="100%"
                className="absolute inset-0"
                title="map"
                src="https://maps.google.com/maps?q=24.8715402,67.0234554&hl=en&z=17&output=embed"
                style={{ filter: "grayscale(1) contrast(1.2) opacity(0.4)" }}
              ></iframe>
              <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md w-full">
                <div className="lg:w-1/2 w-full px-6">
                  <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">ADDRESS</h2>
                  <p className="mt-1 text-sm md:text-base">Our address is Garden West, Karachi</p>
                </div>
                <div className="lg:w-1/2 w-full px-6 mt-4 lg:mt-0">
                  <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">EMAIL</h2>
                  <a className="text-indigo-500 leading-relaxed text-sm md:text-base">Furniro@email.com</a>
                  <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">PHONE</h2>
                  <p className="leading-relaxed text-sm md:text-base">123-456-7890</p>
                </div>
              </div>
            </div>

            <form
              className="lg:w-1/3 md:w-full bg-white flex flex-col w-full md:py-8 mt-8 lg:mt-0"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="relative mb-4">
                <label htmlFor="name" className="leading-7 text-sm text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  className={`w-full bg-white rounded-lg border focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out ${
                    errors.name ? "border-red-500" : "border-gray-300 focus:border-indigo-500"
                  }`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div className="relative mb-4">
                <label htmlFor="email" className="leading-7 text-sm text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className={`w-full bg-white rounded-lg border focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out ${
                    errors.email ? "border-red-500" : "border-gray-300 focus:border-indigo-500"
                  }`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div className="relative mb-4">
                <label htmlFor="subject" className="leading-7 text-sm text-gray-600">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  {...register("subject", { required: "Subject is required" })}
                  className={`w-full bg-white rounded-lg border focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out ${
                    errors.subject ? "border-red-500" : "border-gray-300 focus:border-indigo-500"
                  }`}
                />
                {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
              </div>

              <div className="relative mb-4">
                <label htmlFor="message" className="leading-7 text-sm text-gray-600">
                  Message
                </label>
                <textarea
                  id="message"
                  {...register("message", { required: "Message is required" })}
                  className={`w-full bg-white rounded-lg border focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out ${
                    errors.message ? "border-red-500" : "border-gray-300 focus:border-indigo-500"
                  }`}
                ></textarea>
                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                className="text-white bg-[#B88E2F] border-0 py-2 px-6 focus:outline-none hover:bg-[#a07a29] rounded text-lg w-full sm:w-auto sm:max-w-[237px] transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </section>
      </section>
      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full transform transition-all scale-100 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
              <p className="text-gray-500 mb-8">
                Thank you for contacting us. We have received your message and will get back to you shortly.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-green-200 shadow-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

